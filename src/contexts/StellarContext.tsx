
'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Keypair } from '@stellar/stellar-sdk';
import { WalletService, WalletData } from '@/lib/stellar/wallet';
import { ContactService, Contact } from '@/lib/contacts';
import { horizonService } from '@/lib/stellar/horizon';

interface Balance {
  asset_code: string;
  balance: string;
  asset_type: string;
  asset_issuer?: string;
}

interface Transaction {
  id: string;
  hash: string;
  created_at: string;
  successful: boolean;
  operation_count: number;
}

interface StellarState {
  wallet: WalletData | null;
  balances: Balance[];
  transactions: Transaction[];
  contacts: Contact[];
  loading: boolean;
  error: string | null;
}

type StellarAction =
  | { type: 'SET_WALLET'; payload: WalletData | null }
  | { type: 'SET_BALANCES'; payload: Balance[] }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'SET_CONTACTS'; payload: Contact[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_CONTACT'; payload: Contact }
  | { type: 'UPDATE_CONTACT'; payload: Contact }
  | { type: 'DELETE_CONTACT'; payload: string };

const initialState: StellarState = {
  wallet: null,
  balances: [],
  transactions: [],
  contacts: [],
  loading: false,
  error: null,
};

function stellarReducer(state: StellarState, action: StellarAction): StellarState {
  switch (action.type) {
    case 'SET_WALLET':
      return { ...state, wallet: action.payload };
    case 'SET_BALANCES':
      return { ...state, balances: action.payload };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'SET_CONTACTS':
      return { ...state, contacts: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'ADD_CONTACT':
      return { ...state, contacts: [...state.contacts, action.payload] };
    case 'UPDATE_CONTACT':
      return {
        ...state,
        contacts: state.contacts.map(c =>
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case 'DELETE_CONTACT':
      return {
        ...state,
        contacts: state.contacts.filter(c => c.id !== action.payload),
      };
    default:
      return state;
  }
}

interface StellarContextType extends StellarState {
  generateWallet: () => void;
  importWallet: (secretKey: string) => boolean;
  fundWallet: () => Promise<boolean>;
  clearWallet: () => void;
  refreshBalances: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => Contact;
  updateContact: (id: string, updates: Partial<Contact>) => boolean;
  deleteContact: (id: string) => boolean;
  sendPayment: (to: string, amount: string, memo?: string) => Promise<boolean>;
}

const StellarContext = createContext<StellarContextType | undefined>(undefined);

export function StellarProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(stellarReducer, initialState);

  useEffect(() => {
    // Load wallet and contacts on mount
    const wallet = WalletService.loadWallet();
    const contacts = ContactService.getContacts();
    
    dispatch({ type: 'SET_WALLET', payload: wallet });
    dispatch({ type: 'SET_CONTACTS', payload: contacts });

    if (wallet) {
      refreshBalances();
      refreshTransactions();
    }
  }, []);

  const generateWallet = () => {
    const keypair = WalletService.generateKeypair();
    WalletService.saveWallet(keypair);
    
    const walletData: WalletData = {
      publicKey: keypair.publicKey(),
      secretKey: keypair.secret(),
      funded: false,
    };
    
    dispatch({ type: 'SET_WALLET', payload: walletData });
  };

  const importWallet = (secretKey: string): boolean => {
    if (!WalletService.validateKeypair(secretKey)) {
      dispatch({ type: 'SET_ERROR', payload: 'Invalid secret key' });
      return false;
    }

    try {
      const keypair = Keypair.fromSecret(secretKey);
      WalletService.saveWallet(keypair);
      
      const walletData: WalletData = {
        publicKey: keypair.publicKey(),
        secretKey: keypair.secret(),
        funded: false,
      };
      
      dispatch({ type: 'SET_WALLET', payload: walletData });
      refreshBalances();
      refreshTransactions();
      return true;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to import wallet' });
      return false;
    }
  };

  const fundWallet = async (): Promise<boolean> => {
    if (!state.wallet) return false;

    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const success = await WalletService.fundWallet(state.wallet.publicKey);
      if (success) {
        const updatedWallet = { ...state.wallet, funded: true };
        dispatch({ type: 'SET_WALLET', payload: updatedWallet });
        await refreshBalances();
      }
      return success;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fund wallet' });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearWallet = () => {
    WalletService.clearWallet();
    dispatch({ type: 'SET_WALLET', payload: null });
    dispatch({ type: 'SET_BALANCES', payload: [] });
    dispatch({ type: 'SET_TRANSACTIONS', payload: [] });
  };

  const refreshBalances = async (): Promise<void> => {
    if (!state.wallet) return;

    try {
      const balances = await horizonService.getAccountBalances(state.wallet.publicKey);
      dispatch({ type: 'SET_BALANCES', payload: balances });
    } catch (error) {
      console.error('Failed to refresh balances:', error);
    }
  };

  const refreshTransactions = async (): Promise<void> => {
    if (!state.wallet) return;

    try {
      const transactions = await horizonService.getTransactionHistory(state.wallet.publicKey);
      dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });
    } catch (error) {
      console.error('Failed to refresh transactions:', error);
    }
  };

  const addContact = (contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Contact => {
    const contact = ContactService.saveContact(contactData);
    dispatch({ type: 'ADD_CONTACT', payload: contact });
    return contact;
  };

  const updateContact = (id: string, updates: Partial<Contact>): boolean => {
    const updated = ContactService.updateContact(id, updates);
    if (updated) {
      dispatch({ type: 'UPDATE_CONTACT', payload: updated });
      return true;
    }
    return false;
  };

  const deleteContact = (id: string): boolean => {
    const success = ContactService.deleteContact(id);
    if (success) {
      dispatch({ type: 'DELETE_CONTACT', payload: id });
    }
    return success;
  };

  const sendPayment = async (to: string, amount: string, memo?: string): Promise<boolean> => {
    if (!state.wallet) return false;

    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const keypair = WalletService.getKeypairFromWallet();
      if (!keypair) throw new Error('Invalid wallet');

      const transaction = await horizonService.createPaymentTransaction(
        keypair,
        to,
        amount,
        undefined,
        memo
      );

      await horizonService.submitTransaction(transaction);
      
      // Refresh data after successful payment
      await refreshBalances();
      await refreshTransactions();
      
      return true;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Payment failed' });
      console.error('Payment error:', error);
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <StellarContext.Provider
      value={{
        ...state,
        generateWallet,
        importWallet,
        fundWallet,
        clearWallet,
        refreshBalances,
        refreshTransactions,
        addContact,
        updateContact,
        deleteContact,
        sendPayment,
      }}
    >
      {children}
    </StellarContext.Provider>
  );
}

export function useStellar() {
  const context = useContext(StellarContext);
  if (context === undefined) {
    throw new Error('useStellar must be used within a StellarProvider');
  }
  return context;
}

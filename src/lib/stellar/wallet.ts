
import { Keypair } from '@stellar/stellar-sdk';
import { horizonService } from './horizon';

export interface WalletData {
  publicKey: string;
  secretKey: string;
  funded: boolean;
}

export class WalletService {
  private static STORAGE_KEY = 'stellar_wallet';

  static generateKeypair(): Keypair {
    return Keypair.random();
  }

  static validateKeypair(secretKey: string): boolean {
    try {
      Keypair.fromSecret(secretKey);
      return true;
    } catch {
      return false;
    }
  }

  static saveWallet(keypair: Keypair): void {
    const walletData: WalletData = {
      publicKey: keypair.publicKey(),
      secretKey: keypair.secret(),
      funded: false
    };
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(walletData));
    }
  }

  static loadWallet(): WalletData | null {
    if (typeof window === 'undefined') return null;
    
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return null;
    
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }

  static clearWallet(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  static async fundWallet(publicKey: string): Promise<boolean> {
    try {
      await horizonService.fundAccount(publicKey);
      
      // Update stored wallet data
      const walletData = this.loadWallet();
      if (walletData && walletData.publicKey === publicKey) {
        walletData.funded = true;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(walletData));
      }
      
      return true;
    } catch (error) {
      console.error('Failed to fund wallet:', error);
      return false;
    }
  }

  static getKeypairFromWallet(): Keypair | null {
    const wallet = this.loadWallet();
    if (!wallet) return null;
    
    try {
      return Keypair.fromSecret(wallet.secretKey);
    } catch {
      return null;
    }
  }
}

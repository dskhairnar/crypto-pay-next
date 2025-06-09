
import { Horizon, Account, TransactionBuilder, Operation, Asset, Keypair, Memo } from '@stellar/stellar-sdk';
import { STELLAR_CONFIG } from './config';

export class HorizonService {
  private server: Horizon.Server;

  constructor() {
    this.server = new Horizon.Server(STELLAR_CONFIG.HORIZON_URL);
  }

  async getAccount(publicKey: string): Promise<Horizon.AccountResponse> {
    try {
      return await this.server.loadAccount(publicKey);
    } catch (error) {
      console.error('Error loading account:', error);
      throw new Error(`Failed to load account: ${publicKey}`);
    }
  }

  async getAccountBalances(publicKey: string) {
    try {
      const account = await this.getAccount(publicKey);
      return account.balances.map(balance => ({
        asset_type: balance.asset_type,
        asset_code: balance.asset_code || 'XLM',
        asset_issuer: balance.asset_issuer,
        balance: balance.balance,
        limit: balance.limit
      }));
    } catch (error) {
      console.error('Error getting balances:', error);
      return [];
    }
  }

  async getTransactionHistory(publicKey: string, limit = 10) {
    try {
      const transactions = await this.server
        .transactions()
        .forAccount(publicKey)
        .order('desc')
        .limit(limit)
        .call();

      return transactions.records.map(tx => ({
        id: tx.id,
        hash: tx.hash,
        created_at: tx.created_at,
        source_account: tx.source_account,
        successful: tx.successful,
        operation_count: tx.operation_count,
        memo: tx.memo,
        memo_type: tx.memo_type
      }));
    } catch (error) {
      console.error('Error getting transaction history:', error);
      return [];
    }
  }

  async submitTransaction(transaction: any) {
    try {
      const result = await this.server.submitTransaction(transaction);
      return {
        successful: true,
        hash: result.hash,
        ledger: result.ledger,
        envelope_xdr: result.envelope_xdr,
        result_xdr: result.result_xdr
      };
    } catch (error) {
      console.error('Error submitting transaction:', error);
      throw error;
    }
  }

  async fundAccount(publicKey: string) {
    try {
      const response = await fetch(`${STELLAR_CONFIG.FRIENDBOT_URL}?addr=${publicKey}`);
      if (!response.ok) {
        throw new Error('Failed to fund account');
      }
      return await response.json();
    } catch (error) {
      console.error('Error funding account:', error);
      throw error;
    }
  }

  async createPaymentTransaction(
    sourceKeypair: Keypair,
    destinationId: string,
    amount: string,
    asset: Asset = Asset.native(),
    memo?: string
  ) {
    try {
      const sourceAccount = await this.getAccount(sourceKeypair.publicKey());
      
      const transactionBuilder = new TransactionBuilder(sourceAccount, {
        fee: '100000',
        networkPassphrase: STELLAR_CONFIG.NETWORK_PASSPHRASE
      });

      transactionBuilder.addOperation(
        Operation.payment({
          destination: destinationId,
          asset: asset,
          amount: amount
        })
      );

      if (memo) {
        transactionBuilder.addMemo(Memo.text(memo));
      }

      const transaction = transactionBuilder.setTimeout(30).build();
      transaction.sign(sourceKeypair);

      return transaction;
    } catch (error) {
      console.error('Error creating payment transaction:', error);
      throw error;
    }
  }
}

export const horizonService = new HorizonService();

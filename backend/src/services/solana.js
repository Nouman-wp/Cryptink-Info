import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

class SolanaService {
  constructor() {
    const network = process.env.SOLANA_NETWORK || 'devnet';
    const rpcUrl = process.env.SOLANA_RPC_URL || clusterApiUrl(network);

    this.connection = new Connection(rpcUrl, 'confirmed');
    this.network = network;

    console.log(`✅ Solana connection established (${network})`);
  }

  /**
   * Get SOL balance for a wallet
   * @param {string} walletAddress - Wallet public key
   * @returns {Promise<number>} - Balance in SOL
   */
  async getBalance(walletAddress) {
    try {
      const publicKey = new PublicKey(walletAddress);
      const balance = await this.connection.getBalance(publicKey);
      return balance / 1e9; // Convert lamports to SOL
    } catch (error) {
      console.error('❌ Failed to get balance:', error);
      throw error;
    }
  }

  /**
   * Verify a transaction signature
   * @param {string} signature - Transaction signature
   * @returns {Promise<boolean>} - True if confirmed
   */
  async verifyTransaction(signature) {
    try {
      const status = await this.connection.getSignatureStatus(signature);
      return status?.value?.confirmationStatus === 'confirmed' ||
             status?.value?.confirmationStatus === 'finalized';
    } catch (error) {
      console.error('❌ Failed to verify transaction:', error);
      return false;
    }
  }

  /**
   * Get transaction details
   * @param {string} signature - Transaction signature
   * @returns {Promise<object>} - Transaction details
   */
  async getTransaction(signature) {
    try {
      const transaction = await this.connection.getTransaction(signature);
      return transaction;
    } catch (error) {
      console.error('❌ Failed to get transaction:', error);
      throw error;
    }
  }

  /**
   * Get account info
   * @param {string} walletAddress - Wallet public key
   * @returns {Promise<object>} - Account info
   */
  async getAccountInfo(walletAddress) {
    try {
      const publicKey = new PublicKey(walletAddress);
      const accountInfo = await this.connection.getAccountInfo(publicKey);
      return accountInfo;
    } catch (error) {
      console.error('❌ Failed to get account info:', error);
      throw error;
    }
  }
}

export default new SolanaService();

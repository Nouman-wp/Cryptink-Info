import Arweave from 'arweave';
import fs from 'fs';

class ArweaveService {
  constructor() {
    this.arweave = Arweave.init({
      host: 'arweave.net',
      port: 443,
      protocol: 'https'
    });

    this.wallet = null;
    this.loadWallet();
  }

  async loadWallet() {
    try {
      const walletPath = process.env.ARWEAVE_WALLET_PATH || './arweave-keyfile.json';

      if (fs.existsSync(walletPath)) {
        const keyfileContent = fs.readFileSync(walletPath, 'utf-8');
        this.wallet = JSON.parse(keyfileContent);
        console.log('✅ Arweave wallet loaded successfully');
      } else {
        console.warn('⚠️  Arweave wallet not found. Generate one with: arweave key-create');
      }
    } catch (error) {
      console.error('❌ Failed to load Arweave wallet:', error);
    }
  }

  /**
   * Upload encrypted chapter content to Arweave
   * @param {Buffer|string} content - The encrypted content
   * @param {object} metadata - Chapter metadata
   * @returns {Promise<string>} - Arweave transaction ID (ar://...)
   */
  async uploadEncryptedChapter(content, metadata) {
    if (!this.wallet) {
      throw new Error('Arweave wallet not loaded');
    }

    try {
      // Create transaction
      const transaction = await this.arweave.createTransaction({
        data: typeof content === 'string' ? content : content.toString()
      }, this.wallet);

      // Add tags for searchability and metadata
      transaction.addTag('Content-Type', 'application/octet-stream');
      transaction.addTag('App-Name', 'CryptInk');
      transaction.addTag('App-Version', '1.0.0');
      transaction.addTag('Project-ID', metadata.projectId || '');
      transaction.addTag('Chapter-ID', metadata.chapterId || '');
      transaction.addTag('Chapter-Number', metadata.chapterNumber?.toString() || '');
      transaction.addTag('Version', metadata.version?.toString() || '1');
      transaction.addTag('Encrypted', 'true');

      // Sign transaction
      await this.arweave.transactions.sign(transaction, this.wallet);

      // Post transaction
      const response = await this.arweave.transactions.post(transaction);

      if (response.status === 200) {
        console.log(`✅ Content uploaded to Arweave: ${transaction.id}`);
        return `ar://${transaction.id}`;
      } else {
        throw new Error(`Upload failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Arweave upload error:', error);
      throw error;
    }
  }

  /**
   * Download encrypted content from Arweave
   * @param {string} arweaveUri - The ar:// URI
   * @returns {Promise<Buffer>} - The encrypted content
   */
  async downloadEncryptedContent(arweaveUri) {
    try {
      const txId = arweaveUri.replace('ar://', '');

      const data = await this.arweave.transactions.getData(txId, {
        decode: true,
        string: false
      });

      return Buffer.from(data);
    } catch (error) {
      console.error('❌ Arweave download error:', error);
      throw error;
    }
  }

  /**
   * Get transaction status
   * @param {string} txId - Transaction ID
   * @returns {Promise<object>} - Transaction status
   */
  async getTransactionStatus(txId) {
    try {
      const status = await this.arweave.transactions.getStatus(txId);
      return status;
    } catch (error) {
      console.error('❌ Failed to get transaction status:', error);
      throw error;
    }
  }

  /**
   * Get wallet balance in AR
   * @returns {Promise<string>} - Balance in AR
   */
  async getWalletBalance() {
    if (!this.wallet) {
      throw new Error('Arweave wallet not loaded');
    }

    try {
      const address = await this.arweave.wallets.jwkToAddress(this.wallet);
      const balance = await this.arweave.wallets.getBalance(address);
      const ar = this.arweave.ar.winstonToAr(balance);
      return ar;
    } catch (error) {
      console.error('❌ Failed to get wallet balance:', error);
      throw error;
    }
  }
}

export default new ArweaveService();

import { PublicKey } from '@solana/web3.js';
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import User from '../models/User.js';

export default async function authRoutes(fastify, options) {
  // Verify wallet signature and create/login user
  fastify.post('/verify', async (request, reply) => {
    const { walletAddress, signature, message } = request.body;

    if (!walletAddress || !signature || !message) {
      return reply.code(400).send({ error: 'Missing required fields' });
    }

    try {
      // Verify the signature
      const messageBytes = new TextEncoder().encode(message);
      const signatureBytes = bs58.decode(signature);
      const publicKeyBytes = new PublicKey(walletAddress).toBytes();

      const verified = nacl.sign.detached.verify(
        messageBytes,
        signatureBytes,
        publicKeyBytes
      );

      if (!verified) {
        return reply.code(401).send({ error: 'Invalid signature' });
      }

      // Create or get user
      let user = await User.findOne({ walletAddress });

      if (!user) {
        user = await User.create({
          walletAddress,
          username: `user_${walletAddress.slice(0, 8)}`,
          createdAt: new Date()
        });
      } else {
        user.lastActive = new Date();
        await user.save();
      }

      // Generate JWT token
      const token = fastify.jwt.sign({
        userId: user._id,
        walletAddress: user.walletAddress
      });

      return {
        success: true,
        token,
        user: {
          id: user._id,
          walletAddress: user.walletAddress,
          username: user.username,
          reputation: user.reputation
        }
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Authentication failed' });
    }
  });

  // Get current user
  fastify.get('/me', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    try {
      const user = await User.findById(request.user.userId);

      if (!user) {
        return reply.code(404).send({ error: 'User not found' });
      }

      return {
        success: true,
        user: {
          id: user._id,
          walletAddress: user.walletAddress,
          username: user.username,
          bio: user.bio,
          avatar: user.avatar,
          reputation: user.reputation,
          tags: user.tags,
          socialLinks: user.socialLinks,
          createdAt: user.createdAt
        }
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to fetch user' });
    }
  });
}

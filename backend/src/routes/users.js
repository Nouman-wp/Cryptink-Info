import User from '../models/User.js';
import Project from '../models/Project.js';

export default async function userRoutes(fastify, options) {
  // Get user by wallet address
  fastify.get('/:walletAddress', async (request, reply) => {
    try {
      const user = await User.findOne({ walletAddress: request.params.walletAddress });

      if (!user) {
        return reply.code(404).send({ error: 'User not found' });
      }

      // Get user's public projects
      const projects = await Project.find({
        authorWallet: user.walletAddress,
        visibility: { $in: ['public', 'paid'] }
      }).limit(10);

      return {
        success: true,
        user: {
          walletAddress: user.walletAddress,
          username: user.username,
          bio: user.bio,
          avatar: user.avatar,
          reputation: user.reputation,
          tags: user.tags,
          socialLinks: user.socialLinks,
          createdAt: user.createdAt,
          projectCount: projects.length
        },
        recentProjects: projects
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to fetch user' });
    }
  });

  // Update user profile (authenticated)
  fastify.put('/me', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    try {
      const user = await User.findById(request.user.userId);

      if (!user) {
        return reply.code(404).send({ error: 'User not found' });
      }

      const { username, bio, avatar, tags, socialLinks } = request.body;

      if (username) user.username = username;
      if (bio !== undefined) user.bio = bio;
      if (avatar) user.avatar = avatar;
      if (tags) user.tags = tags;
      if (socialLinks) user.socialLinks = { ...user.socialLinks, ...socialLinks };

      await user.save();

      return { success: true, user };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to update profile' });
    }
  });

  // Get user stats
  fastify.get('/:walletAddress/stats', async (request, reply) => {
    try {
      const user = await User.findOne({ walletAddress: request.params.walletAddress });

      if (!user) {
        return reply.code(404).send({ error: 'User not found' });
      }

      const projects = await Project.find({ authorWallet: user.walletAddress });

      const stats = {
        totalProjects: projects.length,
        publishedProjects: projects.filter(p => p.status === 'published').length,
        totalEarnings: projects.reduce((sum, p) => sum + (p.stats.totalEarnings || 0), 0),
        totalReaders: projects.reduce((sum, p) => sum + (p.stats.totalReaders || 0), 0),
        reputation: user.reputation
      };

      return { success: true, stats };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to fetch stats' });
    }
  });
}

import Project from '../models/Project.js';
import Chapter from '../models/Chapter.js';

export default async function projectRoutes(fastify, options) {
  // Get all public projects
  fastify.get('/', async (request, reply) => {
    try {
      const { visibility = 'public', limit = 20, skip = 0 } = request.query;

      const projects = await Project.find({ visibility })
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(parseInt(skip));

      return { success: true, projects };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to fetch projects' });
    }
  });

  // Get project by ID
  fastify.get('/:id', async (request, reply) => {
    try {
      const project = await Project.findById(request.params.id);

      if (!project) {
        return reply.code(404).send({ error: 'Project not found' });
      }

      // Get chapter count
      const chapterCount = await Chapter.countDocuments({ projectId: project._id });

      return {
        success: true,
        project: {
          ...project.toObject(),
          chapterCount
        }
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to fetch project' });
    }
  });

  // Create new project (authenticated)
  fastify.post('/', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    try {
      const {
        title,
        description,
        genre,
        tags,
        visibility,
        price,
        coverColor
      } = request.body;

      if (!title) {
        return reply.code(400).send({ error: 'Title is required' });
      }

      const project = await Project.create({
        title,
        description,
        genre,
        tags: tags || [],
        authorWallet: request.user.walletAddress,
        visibility: visibility || 'private',
        price: price || 0,
        coverColor: coverColor || 'bg-gradient-to-br from-blue-500 to-purple-500',
        status: 'draft'
      });

      return reply.code(201).send({ success: true, project });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to create project' });
    }
  });

  // Update project (authenticated)
  fastify.put('/:id', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    try {
      const project = await Project.findById(request.params.id);

      if (!project) {
        return reply.code(404).send({ error: 'Project not found' });
      }

      if (project.authorWallet !== request.user.walletAddress) {
        return reply.code(403).send({ error: 'Unauthorized' });
      }

      const updates = request.body;
      Object.assign(project, updates);
      await project.save();

      return { success: true, project };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to update project' });
    }
  });

  // Delete project (authenticated)
  fastify.delete('/:id', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    try {
      const project = await Project.findById(request.params.id);

      if (!project) {
        return reply.code(404).send({ error: 'Project not found' });
      }

      if (project.authorWallet !== request.user.walletAddress) {
        return reply.code(403).send({ error: 'Unauthorized' });
      }

      await Project.findByIdAndDelete(request.params.id);
      await Chapter.deleteMany({ projectId: request.params.id });

      return { success: true, message: 'Project deleted' };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to delete project' });
    }
  });

  // Get user's projects
  fastify.get('/user/my-projects', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    try {
      const projects = await Project.find({ authorWallet: request.user.walletAddress })
        .sort({ createdAt: -1 });

      return { success: true, projects };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to fetch projects' });
    }
  });
}

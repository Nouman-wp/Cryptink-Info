import Chapter from '../models/Chapter.js';
import Project from '../models/Project.js';

export default async function chapterRoutes(fastify, options) {
  // Get chapters for a project
  fastify.get('/project/:projectId', async (request, reply) => {
    try {
      const chapters = await Chapter.find({ projectId: request.params.projectId })
        .sort({ chapterNumber: 1 });

      return { success: true, chapters };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to fetch chapters' });
    }
  });

  // Get single chapter
  fastify.get('/:id', async (request, reply) => {
    try {
      const chapter = await Chapter.findById(request.params.id);

      if (!chapter) {
        return reply.code(404).send({ error: 'Chapter not found' });
      }

      return { success: true, chapter };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to fetch chapter' });
    }
  });

  // Create chapter (authenticated)
  fastify.post('/', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    try {
      const {
        projectId,
        title,
        content,
        chapterNumber
      } = request.body;

      if (!projectId || !title || !chapterNumber) {
        return reply.code(400).send({ error: 'Missing required fields' });
      }

      // Verify project ownership
      const project = await Project.findById(projectId);
      if (!project) {
        return reply.code(404).send({ error: 'Project not found' });
      }

      if (project.authorWallet !== request.user.walletAddress) {
        // Check if user is a collaborator
        const isCollaborator = project.collaborators.some(
          c => c.walletAddress === request.user.walletAddress
        );

        if (!isCollaborator) {
          return reply.code(403).send({ error: 'Unauthorized' });
        }
      }

      const chapter = await Chapter.create({
        projectId,
        title,
        content: content || '',
        chapterNumber,
        authorWallet: request.user.walletAddress,
        status: 'draft'
      });

      return reply.code(201).send({ success: true, chapter });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to create chapter' });
    }
  });

  // Update chapter (authenticated)
  fastify.put('/:id', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    try {
      const chapter = await Chapter.findById(request.params.id);

      if (!chapter) {
        return reply.code(404).send({ error: 'Chapter not found' });
      }

      const project = await Project.findById(chapter.projectId);
      if (project.authorWallet !== request.user.walletAddress && chapter.authorWallet !== request.user.walletAddress) {
        return reply.code(403).send({ error: 'Unauthorized' });
      }

      const updates = request.body;
      Object.assign(chapter, updates);
      await chapter.save();

      return { success: true, chapter };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to update chapter' });
    }
  });

  // Delete chapter (authenticated)
  fastify.delete('/:id', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    try {
      const chapter = await Chapter.findById(request.params.id);

      if (!chapter) {
        return reply.code(404).send({ error: 'Chapter not found' });
      }

      const project = await Project.findById(chapter.projectId);
      if (project.authorWallet !== request.user.walletAddress) {
        return reply.code(403).send({ error: 'Unauthorized' });
      }

      await Chapter.findByIdAndDelete(request.params.id);

      return { success: true, message: 'Chapter deleted' };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to delete chapter' });
    }
  });
}

import groqService from '../services/groq.js';

export default async function aiRoutes(fastify, options) {
  // Get writing suggestions
  fastify.post('/suggestions', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { context, userInput } = request.body;

      if (!userInput) {
        return reply.code(400).send({ error: 'User input is required' });
      }

      const suggestions = await groqService.getSuggestions(context || '', userInput);

      return { success: true, suggestions };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        error: error.message || 'Failed to generate suggestions',
        hint: 'Make sure GROQ_API_KEY is set in your .env file'
      });
    }
  });

  // Grammar check
  fastify.post('/grammar-check', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { text } = request.body;

      if (!text) {
        return reply.code(400).send({ error: 'Text is required' });
      }

      const result = await groqService.checkGrammar(text);

      return { success: true, ...result };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        error: error.message || 'Failed to check grammar',
        hint: 'Make sure GROQ_API_KEY is set in your .env file'
      });
    }
  });

  // Plagiarism detection (simplified version)
  fastify.post('/plagiarism-check', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { text } = request.body;

      if (!text) {
        return reply.code(400).send({ error: 'Text is required' });
      }

      const result = await groqService.detectPlagiarism(text);

      return { success: true, ...result };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        error: error.message || 'Failed to check plagiarism',
        hint: 'Make sure GROQ_API_KEY is set in your .env file'
      });
    }
  });

  // Generate creative ideas
  fastify.post('/generate-ideas', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { prompt } = request.body;

      if (!prompt) {
        return reply.code(400).send({ error: 'Prompt is required' });
      }

      const ideas = await groqService.generateIdeas(prompt);

      return { success: true, ideas };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        error: error.message || 'Failed to generate ideas',
        hint: 'Make sure GROQ_API_KEY is set in your .env file'
      });
    }
  });
}

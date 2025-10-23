import Groq from 'groq-sdk';

class GroqService {
  constructor() {
    this.client = null;
    this.initialized = false;
  }

  // Lazy initialization - only create client when first needed
  _ensureInitialized() {
    if (this.initialized) return;

    if (!process.env.GROQ_API_KEY) {
      console.warn('⚠️  GROQ_API_KEY not found. AI features will be disabled.');
      console.warn('Get your free API key at: https://console.groq.com/');
      this.client = null;
      this.initialized = true;
      return;
    }

    this.client = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    console.log('✅ Groq AI service initialized (FREE & FAST)');
    this.initialized = true;
  }

  /**
   * Get writing suggestions using Groq (Llama 3)
   * @param {string} context - Previous text context
   * @param {string} userInput - Current text being written
   * @returns {Promise<string[]>} - Array of 3 suggestions
   */
  async getSuggestions(context, userInput) {
    this._ensureInitialized();

    if (!this.client) {
      throw new Error('Groq API key not configured');
    }

    try {
      const completion = await this.client.chat.completions.create({
        model: 'llama3-70b-8192', // Fast and high quality
        messages: [
          {
            role: 'system',
            content: 'You are a creative writing assistant. Provide 3 different ways to continue the user\'s sentence. Be concise and creative. Return only the continuations, numbered 1-3.'
          },
          {
            role: 'user',
            content: `Context: ${context || 'No context provided'}\n\nUser is writing: "${userInput}"\n\nProvide 3 creative ways to continue this sentence.`
          }
        ],
        temperature: 0.8,
        max_tokens: 200,
        top_p: 1,
        stream: false
      });

      const responseText = completion.choices[0]?.message?.content || '';

      // Parse numbered list (1., 2., 3.) or return as-is
      const suggestions = responseText
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .filter(line => line.length > 0)
        .slice(0, 3);

      return suggestions.length > 0 ? suggestions : [responseText];
    } catch (error) {
      console.error('❌ Groq API error:', error.message);
      throw new Error('Failed to generate suggestions');
    }
  }

  /**
   * Check grammar and style using Groq
   * @param {string} text - Text to check
   * @returns {Promise<object>} - Grammar corrections
   */
  async checkGrammar(text) {
    this._ensureInitialized();

    if (!this.client) {
      throw new Error('Groq API key not configured');
    }

    try {
      const completion = await this.client.chat.completions.create({
        model: 'llama3-70b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are a grammar and style checker. Analyze the text and provide specific corrections. Format your response as: "Issue: [description] | Original: [text] | Suggestion: [correction]". If no issues, respond with "No grammar issues found."'
          },
          {
            role: 'user',
            content: `Check this text for grammar and style issues:\n\n"${text}"`
          }
        ],
        temperature: 0.3,
        max_tokens: 500,
        top_p: 1,
        stream: false
      });

      const responseText = completion.choices[0]?.message?.content || 'No issues found.';

      // Parse corrections
      const corrections = [];
      const lines = responseText.split('\n').filter(line => line.includes('Issue:'));

      for (const line of lines) {
        const issueParts = line.split('|');
        if (issueParts.length >= 3) {
          corrections.push({
            issue: issueParts[0].replace('Issue:', '').trim(),
            original: issueParts[1].replace('Original:', '').trim(),
            suggestion: issueParts[2].replace('Suggestion:', '').trim()
          });
        }
      }

      return {
        hasIssues: corrections.length > 0,
        corrections,
        summary: corrections.length === 0 ? 'No grammar issues found.' : `Found ${corrections.length} issue(s).`
      };
    } catch (error) {
      console.error('❌ Groq API error:', error.message);
      throw new Error('Failed to check grammar');
    }
  }

  /**
   * Detect potential plagiarism (simplified)
   * Note: This is a basic implementation. For production, integrate with
   * a dedicated plagiarism detection service or vector database.
   * @param {string} text - Text to check
   * @returns {Promise<object>} - Plagiarism check result
   */
  async detectPlagiarism(text) {
    this._ensureInitialized();

    if (!this.client) {
      throw new Error('Groq API key not configured');
    }

    try {
      // For now, we'll use AI to detect common phrases and suggest originality
      const completion = await this.client.chat.completions.create({
        model: 'llama3-70b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are a plagiarism detector. Analyze if the text contains commonly used phrases, clichés, or potentially copied content. Provide an originality score from 0-100 and explain your reasoning.'
          },
          {
            role: 'user',
            content: `Analyze this text for originality:\n\n"${text.substring(0, 1000)}"`
          }
        ],
        temperature: 0.3,
        max_tokens: 300,
        top_p: 1,
        stream: false
      });

      const analysis = completion.choices[0]?.message?.content || '';

      // Extract score (look for number out of 100)
      const scoreMatch = analysis.match(/(\d+)\/100|(\d+)%|score.*?(\d+)/i);
      const originalityScore = scoreMatch ? parseInt(scoreMatch[1] || scoreMatch[2] || scoreMatch[3]) : 85;

      return {
        originalityScore,
        analysis,
        matches: [], // Would be populated with actual plagiarism detection service
        warning: originalityScore < 70 ? 'Low originality detected. Consider revising.' : null,
        note: 'For production use, integrate with a dedicated plagiarism detection API.'
      };
    } catch (error) {
      console.error('❌ Groq API error:', error.message);
      throw new Error('Failed to check plagiarism');
    }
  }

  /**
   * Generate creative content ideas
   * @param {string} prompt - Story/content prompt
   * @returns {Promise<string[]>} - Array of ideas
   */
  async generateIdeas(prompt) {
    this._ensureInitialized();

    if (!this.client) {
      throw new Error('Groq API key not configured');
    }

    try {
      const completion = await this.client.chat.completions.create({
        model: 'llama3-70b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are a creative writing brainstorming assistant. Generate 5 unique and interesting ideas based on the prompt.'
          },
          {
            role: 'user',
            content: `Generate 5 creative ideas for: ${prompt}`
          }
        ],
        temperature: 0.9,
        max_tokens: 400,
        top_p: 1,
        stream: false
      });

      const responseText = completion.choices[0]?.message?.content || '';
      const ideas = responseText
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .filter(line => line.length > 0)
        .slice(0, 5);

      return ideas;
    } catch (error) {
      console.error('❌ Groq API error:', error.message);
      throw new Error('Failed to generate ideas');
    }
  }
}

export default new GroqService();

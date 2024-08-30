
import Anthropic from '@anthropic-ai/sdk';

export const anthropicClient = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY, // defaults to process.env["ANTHROPIC_API_KEY"]
  });

  
  
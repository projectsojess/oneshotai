import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

export const OPENAI_TEXT_ASSISTENT: ChatCompletionMessageParam = {role: "system", content: "You are a helpful assistant."};

export const CREATE_TILE_DESC_QUERY: ChatCompletionMessageParam ={ role: 'system', content: "Give an appropriate title and description for above given conversation in JSON format { title: ${title}, description: ${description}}. Maximum two words for title and 5 words for description"}
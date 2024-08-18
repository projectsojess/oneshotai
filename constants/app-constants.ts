import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

export const OPENAI_TEXT_ASSISTENT: ChatCompletionMessageParam = {role: "system", content: "You are a helpful assistant."};

export const CREATE_TILE_DESC_QUERY: ChatCompletionMessageParam ={ role: 'system', content: "Give an appropriate title and description for above given conversation in JSON format { title: ${title}, description: ${description}}. Maximum two words for title and 5 words for description"}


export const AUDIO_MODEL_CONFIGS = {
    'tts-1' : {
   voices : ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'],
   default: 'alloy'
 },
 'tts-1-hd' : {
   voices : ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'],
   default: 'alloy'
 }
}



export const VARIATIONS = [1,2,3,4,5];


export const MODEL_CONFIGS = {
    'dall-e-2': {
      resolutions: ['256x256', '512x512', '1024x1024'],
      defaultResolution: '256x256',
      maxPromptLength: 1000,
      supportsVariations: true,
      supportImage: false
    },
    'dall-e-3': {
      resolutions: ['1024x1024', '1792x1024', '1024x1792'],
      defaultResolution: '1024x1024',
      maxPromptLength: 4000,
      supportsVariations: false,
      supportImage: false
    },
    'sd3-medium': {
      resolutions: ['1024x1024', '1024x576', '1024x439',"1024x1536","1024x682","1024x1280","1024x819","1024x1820","1024x2391"],
      defaultResolution: '1024x1024',
      maxPromptLength: 10000,
      supportsVariations: false,
      supportImage: true
    },
    'sd3-large': {
      resolutions: ['1024x1024', '1024x576', '1024x439',"1024x1536","1024x682","1024x1280","1024x819","1024x1820","1024x2391"],
      defaultResolution: '1024x1024',
      maxPromptLength: 10000,
      supportsVariations: false,
      supportImage: true

    },
    'sd3-large-turbo': {
      resolutions: ['1024x1024', '1024x576', '1024x439',"1024x1536","1024x682","1024x1280","1024x819","1024x1820","1024x2391"],
      defaultResolution: '1024x1024',
      maxPromptLength: 10000,
      supportsVariations: false,
      supportImage: true

    },
    'sd-image-ultra': {
      resolutions: ['1024x1024', '1024x576', '1024x439',"1024x1536","1024x682","1024x1280","1024x819","1024x1820","1024x2391"],
      defaultResolution: '1024x1024',
      maxPromptLength: 10000,
      supportsVariations: false,
      supportImage: false

    },
    'sd-image-core': {
      resolutions: ['1024x1024', '1024x576', '1024x439',"1024x1536","1024x682","1024x1280","1024x819","1024x1820","1024x2391"],
      defaultResolution: '1024x1024',
      maxPromptLength: 10000,
      supportsVariations: false,
      supportImage: false

    },
    'fal-ai/flux-pro':{
      resolutions: [
        '2048x2048',
        '1024x1024',
        '1024x1365',
        '1024x1820',
        '1365x1024',
        '1820x1024'
        ],

      defaultResolution: '1024x1024',
      maxPromptLength: 10000,
      supportsVariations: true,
      supportImage: false
    }
  };

export const OPEN_AI_IMAGE_MODELS = ['dall-e-3','dall-e-2'];

export const SD_IMAGE_MODELS = ['sd3-large-turbo','sd3-medium','sd3-large','sd-image-core','sd-image-ultra'];

export const FLUX_MODELS = ['fal-ai/flux-pro']


export const RESOLUTIONS = [
  "256x256",
  "512x512",
  "1024x1024",
  "1792x1024",
  "1024x1792",

];
export const DALL_E_2_RESOLUTIONS = ['256x256', '512x512', '1024x1024'];
export const DALL_E_3_RESOLUTIONS = ['1024x1024', '1792x1024', '1024x1792'];
export const WHISPER_SUPPORTED_FORMATS = ['flac', 'mp3', 'mp4', 'mpeg', 'mpga', 'm4a', 'ogg', 'wav',  'webm']


export const RESOLUTIONS_ASPECT_MAP = {
  "1024x576": "16:9" ,
  "1024x1024": "1:1" ,
  "1024x439": "21:9" ,
  "1024x1536": "2:3" ,
  "1024x682": "3:2" ,
  "1024x1280": "4:5" ,
  "1024x819": "5:4" ,
  "1024x1820": "9:16" ,
  "1024x2391": "9:21" 
}

export const FLUX_ASPECT_MAP = {
  '2048x2048': 'square_hd',
  '1024x1024': 'square',
  '1024x1365': 'portrait_4_3',
  '1024x1820': 'portrait_16_9',
  '1365x1024': 'landscape_4_3',
  '1820x1024': 'landscape_16_9'
};

export const creditsPerUSD = 100;
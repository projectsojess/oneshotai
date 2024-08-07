import { CREATE_TILE_DESC_QUERY, OPENAI_TEXT_ASSISTENT } from "@/constants/app-constants";
import { INTERNAL_SERVER_ERROR_MESSAGE, INVALID_DATA } from "@/constants/error-messages";
import { getUserServer } from "@/hooks/use-current-user";
import { logger } from "@/logger/logger";
import { PromptSchema } from "@/schemas/validation/prompt-schema";
import { checkUserLimit } from "@/utils/check-limit";
import { createServer } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { OpenAI} from 'openai';
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const openai = new OpenAI();
export async function POST(request: NextRequest) {
    
    try {
        const { values, projectId, icon } = await request.json();

        const validatedFields = PromptSchema.safeParse(values);

        if(!validatedFields.success){

            return NextResponse.json({
                message: INVALID_DATA
            }, {status:400})
        }

        const validValues = validatedFields.data;

        const supabase = createServer();

        const proceed = checkUserLimit(validValues.model);

        if(!proceed){

            return NextResponse.json({
                message: 'Limit exceeded'
            }, {status:403})
        }
    
        const messages: ChatCompletionMessageParam[] = [
            OPENAI_TEXT_ASSISTENT,
            {
                role:'user',
                content: validValues.prompt
            }
        ];


        const openAiResp = await openai.chat.completions.create({
            messages: messages,
            model: validValues.model
        })

        const [,...splitMessages] = messages;

        const {id, choices } = openAiResp;
        
        const { data, error } = await supabase.from("chats")
                                    .insert({
                                        project_id:projectId,
                                        model:values.model,
                                        icon,
                                        chat_id: id,
                                        title: validValues.title,
                                        description: validValues.description
                                    }).select();
        if(error){
            return NextResponse.json({
                message: INTERNAL_SERVER_ERROR_MESSAGE,
            },{status:500});
        }
        const chatId = data[0].id;
        const allMessages  = [...splitMessages, choices[0].message];

        const messageData = allMessages.map((message) => ({
            role: message.role,
            content:message.content,
            chat_id: chatId,
            model: validValues.model

        }))
        const resp = await supabase.from("chat_messages")
                                .insert(messageData);
         
        return NextResponse.json({
            chatId,
        },{status:200});
    } catch (error) {
        logger.error("Error creating new chat")
        return NextResponse.json({
            message: INTERNAL_SERVER_ERROR_MESSAGE
        }, {status:500});
    }
    }


    export async function GET(request: NextRequest) {

        try {
            const supabase = createServer();
            const user = await getUserServer();

            const { data, error } = await supabase.from('chats')
                                    .select('id,created_at,title,description,icon')
                                    .eq("user_id", user.id).limit(3);

            if(error){
                logger.error(`Error fetching all chats e: ${error.message}`)
                return NextResponse.json({
                    message: INTERNAL_SERVER_ERROR_MESSAGE,
                },{status:500});
            }
            return NextResponse.json({
                chats: data
            },{status:200});
        } catch (error) {
            
            logger.error("Error Fetching all chats")
            return NextResponse.json({
                message: INTERNAL_SERVER_ERROR_MESSAGE
            }, {status:500});
        }
    }
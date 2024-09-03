import {CLAUDE_TEXT_ASSISTENT, OPENAI_TEXT_ASSISTENT } from "@/constants/app-constants";
import { INTERNAL_SERVER_ERROR_MESSAGE, INVALID_DATA } from "@/constants/error-messages";
import { getUserPlanServer, getUserServer } from "@/hooks/use-current-user";
import { logger } from "@/logger/logger";
import { PromptSchema } from "@/schemas/validation/prompt-schema";
import { anthropicClient } from "@/utils/claude/claude-client";
import { calculateCreditValue } from "@/utils/claude/credit-usage";
import { getCostFormModel, updateUserCredits } from "@/utils/credit-utils";
import { createServer } from "@/utils/supabase/server";
import { ContentBlock, MessageParam } from "@anthropic-ai/sdk/resources/messages.mjs";
import { NextRequest, NextResponse } from "next/server";
import { OpenAI} from 'openai';
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const openai = new OpenAI();
export async function POST(request: NextRequest) {
    
    try {
        const { values, projectId, icon, description } = await request.json();

        const validatedFields = PromptSchema.safeParse(values);

        if(!validatedFields.success){

            return NextResponse.json({
                message: INVALID_DATA
            }, {status:400})
        }

        const validValues = validatedFields.data;

        const supabase = createServer();
        const { available_credits, purchased_credits,plan_credits  } = await getUserPlanServer();

        if( validValues.model !== 'claude-3-5-sonnet-20240620'){

            const cost = await getCostFormModel(validValues.model);    
    
            if(cost > available_credits){
    
                return NextResponse.json({
                    message: 'Limit exceeded'
                }, {status:403})
            }

            const messages: ChatCompletionMessageParam[] = [
                description && description !== '' ? {
                    role:'system',
                    content:description
                } : OPENAI_TEXT_ASSISTENT,
                {
                    role:'user',
                    content: validValues.prompt
                }
            ];
    
            
    
            const openAiResp = await openai.chat.completions.create({
                messages: messages,
                model: validValues.model
            })
    
            const {id, choices } = openAiResp;
            
            const { data, error } = await supabase.from("chats")
                                        .insert({
                                            project_id:projectId,
                                            model:values.model,
                                            icon,
                                            model_chat_id: id,
                                            title: validValues.title,
                                            description: validValues.description
                                        }).select();
            if(error){
                return NextResponse.json({
                    message: INTERNAL_SERVER_ERROR_MESSAGE,
                },{status:500});
            }
            const chatId = data[0].id;
            const allMessages  = [...messages, choices[0].message];
    
            const messageData = allMessages.map((message,index) => ({
                role: message.role,
                project_id:projectId,
                content:message.content,
                chat_id: chatId,
                model: validValues.model,
                order: index +1
    
            }))
            const resp = await supabase.from("chat_messages")
                                    .insert(messageData);
            
            var newAvailableCredits:number = 0;
            if(plan_credits > cost ){
    
                newAvailableCredits = plan_credits -cost;
                updateUserCredits(newAvailableCredits,cost, true);
            }else {
    
                newAvailableCredits = purchased_credits - cost;
                updateUserCredits(newAvailableCredits,cost, false);
            }
            return NextResponse.json({
                chatId,
            },{status:200});
        }else {
            
           const claudeResp = await  anthropicClient.messages.create({
                model: validValues.model,
                system: description  && description !=='' ? description : CLAUDE_TEXT_ASSISTENT,
                max_tokens:1024,
                messages: [
                   {
                    role:'user',
                    content: validValues.prompt
                   }
                ]
            })

            const {id, role, usage } = claudeResp;

            const inputTokens = usage.input_tokens;
            const outputTokens = usage.output_tokens;

            const cost = calculateCreditValue({input: inputTokens, output: outputTokens});

            if(cost > available_credits){
    
                return NextResponse.json({
                    message: 'Limit exceeded'
                }, {status:403})
            }

            const content:ContentBlock = claudeResp.content[0];

            const { data, error } = await supabase.from("chats")
                                        .insert({
                                            project_id:projectId,
                                            model:values.model,
                                            icon,
                                            model_chat_id: id,
                                            title: validValues.title,
                                            description: validValues.description
                                        }).select();
            
            if(error){
                return NextResponse.json({
                    message: INTERNAL_SERVER_ERROR_MESSAGE,
                },{status:500});
            }

            const messages: ChatCompletionMessageParam[] = [
                description && description !== '' ? {
                    role:'system',
                    content:description
                } : OPENAI_TEXT_ASSISTENT,
                {
                    role:'user',
                    content: validValues.prompt
                }
            ];

            const chatId = data[0].id;

            const allMessages  = [...messages, {role, content: content[0].text}];
    
            const messageData = allMessages.map((message,index) => ({
                role: message.role,
                project_id:projectId,
                content:message.content,
                chat_id: chatId,
                model: validValues.model,
                order: index +1
    
            }))

            const resp = await supabase.from("chat_messages")
                                    .insert(messageData);


            var newAvailableCredits:number = 0;
            if(plan_credits > cost ){
    
                newAvailableCredits = plan_credits -cost;
                updateUserCredits(newAvailableCredits,cost, true);
            }else {
    
                newAvailableCredits = purchased_credits - cost;
                updateUserCredits(newAvailableCredits,cost, false);
            }
            return NextResponse.json({
                chatId,
            },{status:200});
        }
        
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

            const { data, error } = await supabase.from('projects')
                                    .select('*')
                                    .eq("user_id", user.id);

            if(error){
                logger.error(`Error fetching all chats e: ${error.message}`)
                return NextResponse.json({
                    message: INTERNAL_SERVER_ERROR_MESSAGE,
                },{status:500});
            }
            let chatData=[];
            const promises = data.map(async (project) => {
                const { data, error } = await supabase.from("chats")
                    .select('id,title,icon')
                    .eq("project_id", project.id);
                if (data) {
                    return {
                        project: project.name,
                        projectId: project.id,
                        chats: data
                    };
                }
                return null;
            });
            chatData = await Promise.all(promises);
            chatData = chatData.filter(item => item !== null);
            return NextResponse.json({
                chats: chatData
            },{status:200});
        } catch (error) {
            
            logger.error("Error Fetching all chats")
            return NextResponse.json({
                message: INTERNAL_SERVER_ERROR_MESSAGE
            }, {status:500});
        }
    }
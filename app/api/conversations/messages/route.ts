import { INTERNAL_SERVER_ERROR_MESSAGE } from "@/constants/error-messages";
import { getUserPlanServer } from "@/hooks/use-current-user";
import { logger } from "@/logger/logger";
import { getCostFormModel, updateUserCredits } from "@/utils/credit-utils";
import { createServer } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { OpenAI} from 'openai';
const openai = new OpenAI();
export async function POST(request: NextRequest) {

    
    try {
        const {chatId , messages, model, projectId }= await request.json();
        const userPrompt = messages[messages.length -1];

        const messageLength = messages.length-1;

        const supabase = createServer();

        const cost = await getCostFormModel(model);

        const { available_credits } = await getUserPlanServer();

        if(available_credits < cost){

            return NextResponse.json({
                message: 'Limit exceeded'
            }, {status:403})
        }

        const openAiResp = await openai.chat.completions.create({
            messages:messages,
            model: model
        });

        const {choices } = openAiResp;
        const allMessages = [userPrompt,choices[0].message];

        const messageData = allMessages.map((message,index) => ({
            role: message.role,
            project_id:projectId,
            content:message.content,
            chat_id: chatId,
            model: model,
            order: index+ 1 + messageLength

        }));

        const { data, error } = await supabase.from("chat_messages")
                                .insert(messageData).select();

        if(error){

            return NextResponse.json({
                message: INTERNAL_SERVER_ERROR_MESSAGE,
            },{status:500});
        }

        const newAvailableCredits = available_credits - cost;
        updateUserCredits(newAvailableCredits,cost);
        
        return NextResponse.json({
            messages: data,
        },{status:200});
    } catch (error) {
        logger.error("Error creating new message")
        return NextResponse.json({
            message: INTERNAL_SERVER_ERROR_MESSAGE
        }, {status:500});
    }
}
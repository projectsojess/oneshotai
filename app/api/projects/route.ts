import { INTERNAL_SERVER_ERROR_MESSAGE, INVALID_DATA, INVALID_REQUEST } from "@/constants/error-messages";
import { logger } from "@/logger/logger";
import { NewProjectSchema } from "@/schemas/validation/new-project-schema";
import { createServer } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {

    try {

        const { values } = await request.json();

        const validatedFields = NewProjectSchema.safeParse(values);

        if(!validatedFields.success){

            return NextResponse.json({
                message: INVALID_DATA
            }, {status:400});
        }

        const validValues = validatedFields.data;

        const supabase = createServer();

        const { data, error} = await supabase.from("projects")
                                .insert({
                                    name: validValues.name,
                                    description: validValues.description
                                }).select();
        if(error){
            logger.error(`Error saving project e: ${error.message}`)
            return NextResponse.json({
                message: INTERNAL_SERVER_ERROR_MESSAGE
            }, {status:500});
        }
        const project = data[0];

        return NextResponse.json({
            projectId: project.id,
            message:'Success'
        }, {status:200})
    } catch (error) {

        logger.error("Error creating project")
        return NextResponse.json({
            message: INTERNAL_SERVER_ERROR_MESSAGE
        }, {status:500});
    }
}

export async function GET(request: NextRequest) {

    const supabase = createServer();
    const { data }= await supabase.auth.getUser();
    const { user } = data;
    try{

        if(user){

            const { data, error } = await supabase.from("projects")
                                    .select('*')
                                    .eq("user_id", user.id);
            if(error) {
                logger.error(`Error getting projects for user id:  ${user.id} e: ${error.message}`)
                return NextResponse.json({
                    message: INTERNAL_SERVER_ERROR_MESSAGE
                }, {status:500});
            }

            return NextResponse.json({
                projects: data
            }, {status:200})
            
        }

        return NextResponse.json({
            message: INVALID_REQUEST
        }, {status:400});
    }catch(error){

        logger.error(`Error getting projects for user id:  ${user.id}`)
        return NextResponse.json({
            message: INTERNAL_SERVER_ERROR_MESSAGE
        }, {status:500});
    }
}
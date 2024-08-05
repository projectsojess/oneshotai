import { INTERNAL_SERVER_ERROR_MESSAGE, INVALID_DATA, INVALID_REQUEST } from "@/constants/error-messages";
import { logger } from "@/logger/logger";
import { createServer } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest, context: any) {

    try {
        const { params } = context;
        const { projectId } = params;
        
        if(!projectId){

            return NextResponse.json({
                message:INVALID_REQUEST
            }, {status:400})
        }

        const supabase = createServer();

        const { data, error } = await supabase.from("projects")
                                .select('*')
                                .eq("id", projectId);
        if(error){
            return NextResponse.json({
                message: error.message,
            },{status:400})
        }

        const project = data[0];

        return NextResponse.json({
            project,
        },{status:200})
    } catch (error) {
        logger.error("Error fetching project")
        return NextResponse.json({
            message: INTERNAL_SERVER_ERROR_MESSAGE
        }, {status:500});
    }
}

export async function PUT(request: NextRequest, context: any) {
    const supabase = createServer();
    try {
        const { params } = context;
        const { projectId } = params;
        const {title, description} = await request.json();

        if(!projectId){

            return NextResponse.json({
                message:INVALID_REQUEST
            }, {status:400})
        }

        if(!title && !description){
            return NextResponse.json({
                message:INVALID_DATA
            }, {status:400})
        }

        if(title && !description){

            const { data, error } = await supabase.from('projects')
                                    .update({
                                        name: title
                                    }).eq("id",projectId).select();

            if(error){

                logger.error(`Error updating project title e: ${error.message}`)
                return NextResponse.json({
                    message: "Unable to update project title. Please try again later."
                }, {status:500});
            }

            return NextResponse.json({
                projectDetails: data[0]
            },{status:200});
        }
        if(description && !title){

            const { data, error } = await supabase.from('projects')
                                    .update({
                                        description,
                                    }).eq("id",projectId).select();
            
            if(error){

                logger.error(`Error updating project description e: ${error.message}`)
                return NextResponse.json({
                    message: "Unable to update project description. Please try again later."
                }, {status:500});
            }

            return NextResponse.json({
                projectDetails: data[0]
            },{status:200});
        }
        
        const { data, error } = await supabase.from('projects')
                                    .update({
                                        description,
                                        name: title
                                    }).eq("id",projectId).select();
        if(error){

            logger.error(`Error updating project details e: ${error.message}`)
            return NextResponse.json({
                message: "Unable to update project details. Please try again later."
            }, {status:500});
        }

        return NextResponse.json({
            projectDetails: data[0]
        },{status:200});

    } catch (error ) {
        
        logger.error("Error updating project")
        return NextResponse.json({
            message: INTERNAL_SERVER_ERROR_MESSAGE
        }, {status:500});
    }
}
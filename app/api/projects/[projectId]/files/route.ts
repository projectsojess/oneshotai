import { INTERNAL_SERVER_ERROR_MESSAGE, INVALID_REQUEST } from "@/constants/error-messages";
import { getUserServer } from "@/hooks/use-current-user";
import { logger } from "@/logger/logger";
import { createServer } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(request: NextRequest, context: any) {
    
    try {
        const { params } = context;
        const { projectId } = params;

        
        if(!projectId){

            return NextResponse.json({
                message: INVALID_REQUEST
            }, {status:400})
        }

        const supabase = createServer();
        
        const user = await getUserServer();

        const projectPath = `${user.id}/${projectId}`
        const fileTypes = ['IMAGES', 'AUDIOS', 'VIDEOS']
        let allFiles = []

        const listFilesInPath = async (path) => {
            let filesInPath = []
            for (const fileType of fileTypes) {
              const { data, error } = await supabase.storage
                .from('onestopai-bucket')
                .list(`${path}/${fileType}`)
                
              if (error) {
                console.error(`Error fetching ${fileType} in ${path}:`, error)
                continue
              }
              
                const filesWithUrls = await Promise.all(data.map(async (file) => {
                    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
                        .from('onestopai-bucket')
                        .createSignedUrl(`${path}/${fileType}/${file.name}`, 3600) // URL valid for 1 hour

                    if (signedUrlError) {
                        console.error(`Error creating signed URL for ${file.name}:`, signedUrlError)
                        return null
                    }

                    return {
                        ...file,
                        type: fileType,
                        url: signedUrlData.signedUrl,
                        path: `${path}/${fileType}/${file.name}`
                    }
                }))
        
              filesInPath = [...filesInPath, ...filesWithUrls]
            }
            return filesInPath
          }
          
            // First, try to list contents of the project folder
            const { data: projectContents, error: projectError } = await supabase.storage
            .from('onestopai-bucket')
            .list(projectPath)

            if (projectError) {
                logger.error('Error fetching project contents:')
                return NextResponse.json({
                    message: INTERNAL_SERVER_ERROR_MESSAGE
                }, {status:500});
            }

            // Check if there are chat folders or direct file type folders
            const chatFolders = projectContents.filter(item => item.metadata === null) // Folders have null metadata
            const directFileFolders = fileTypes.filter(type => 
                projectContents.some(item => item.name === type)
            )

            if (chatFolders.length > 0) {
                // If chat folders exist, list files in each chat folder
                for (const chatFolder of chatFolders) {
                  const chatFiles = await listFilesInPath(`${projectPath}/${chatFolder.name}`)
                  allFiles = [...allFiles, ...chatFiles]
                }
              } else if (directFileFolders.length > 0) {
                // If no chat folders, but file type folders exist directly in the project folder
                const projectFiles = await listFilesInPath(projectPath)
                allFiles = [...allFiles, ...projectFiles]
              }

              return NextResponse.json({
                files: allFiles
            }, {status:200});
    } catch (error) {
        
        logger.error("Error Fetching all files for project")
        return NextResponse.json({
            message: INTERNAL_SERVER_ERROR_MESSAGE
        }, {status:500});
    }
}


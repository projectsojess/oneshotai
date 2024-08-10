import React from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Plus } from 'lucide-react';
import ProjectDialog from '../dashboard/project-dialog';
interface CardTileProps {

  title?: string,
  description?: string,
  isButton?: boolean,
  handleClick? : () => void
}
const CardTile = ({ title, description, isButton = false,handleClick }: CardTileProps) => {

  const truncateText = (text: string, maxLength: number) => {
    if (text && text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };
  
    if (isButton) {
        return (
          <Card 
            className="w-[200px] h-[120px] flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors rounded-lg"
          >
            <CardHeader>
              <CardTitle className='justify-center items-center flex'>
                <ProjectDialog />
              </CardTitle>
              <CardDescription className='text-center text-primary'>
              New Project
            </CardDescription>
            </CardHeader>
          </Card>
        );
      }
    
      return (
        <Card 
      className="w-[200px] h-[120px] cursor-pointer hover:bg-gray-100 transition-colors rounded-lg overflow-hidden"
      onClick={handleClick}
    >
      <CardHeader className="h-full flex flex-col justify-between">
        <CardTitle className='text-xl truncate'>{truncateText(title || '', 20)}</CardTitle>
        <CardDescription className='line-clamp-2 overflow-hidden'>
          {truncateText(description || '', 50)}
        </CardDescription>
      </CardHeader>
    </Card>
      );
    };

export default CardTile

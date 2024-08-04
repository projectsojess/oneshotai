import React from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Plus } from 'lucide-react';
import ProjectDialog from '../dashboard/project-dialog';
interface CardTileProps {

  title?: string,
  description?: string,
  isButton?: boolean,
  onClick? : () => void
}
const CardTile = ({ title, description, isButton = false, onClick }: CardTileProps) => {
    if (isButton) {
        return (
          <Card 
            className="w-[200px] h-[120px] flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors rounded-lg"
            onClick={onClick}
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
        <Card className="w-[200px] h-[120px]">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
        </Card>
      );
    };

export default CardTile

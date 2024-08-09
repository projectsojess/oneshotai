import React, { useEffect, useRef, useState } from 'react';
import { PlayCircle, PauseCircle, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import toast from 'react-hot-toast';
import { INTERNAL_SERVER_ERROR_MESSAGE } from '@/constants/error-messages';

interface CustomAudioPlayerProps {
    audioSrc: string;
    fileName?: string;
  }

const CustomAudioPlayer: React.FC<CustomAudioPlayerProps> = ({ audioSrc, fileName = 'audio' }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioDuration = () => setDuration(audio.duration);
    const setAudioTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener('loadedmetadata', setAudioDuration);
    audio.addEventListener('timeupdate', setAudioTime);

    return () => {
      audio.removeEventListener('loadedmetadata', setAudioDuration);
      audio.removeEventListener('timeupdate', setAudioTime);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSliderChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const downloadAudio = () => {
    try {
        const link = document.createElement('a');
        link.href = audioSrc;
        link.download = `${fileName}.mp3`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        
      toast.error(INTERNAL_SERVER_ERROR_MESSAGE)
    }
  };


  return (
    <div className="bg-gray-700 rounded-lg p-4 mt-4">
      <audio ref={audioRef} src={audioSrc} />
      <div className="flex items-center justify-between mb-2">
        <Button
        type='button'
          onClick={togglePlayPause}
          variant="ghost"
          size="icon"
          className="text-gray-100 hover:text-green-500 transition-colors hover:bg-gray-700"
        >
          {isPlaying ? (
            <PauseCircle className="h-8 w-8" />
          ) : (
            <PlayCircle className="h-8 w-8" />
          )}
        </Button>
        <div className="text-gray-300 text-sm">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
        <Button
            type='button'
          onClick={downloadAudio}
          variant="ghost"
          size="icon"
          className="text-gray-100 hover:text-green-500 transition-colors hover:bg-gray-700"
        >
          <Download className="h-5 w-5" />
        </Button>
      </div>
      <Slider
        min={0}
        max={duration}
        step={0.1}
        value={[currentTime]}
        onValueChange={handleSliderChange}
        className="w-full"
      />
    </div>
  );
};

export default CustomAudioPlayer;
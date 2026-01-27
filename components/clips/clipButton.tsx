import { MailIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import RecordingInterface from "./RecordingInterface"
import { useState } from "react"
import { Clip } from '@prisma/client';


interface DashboardProps {
  initialClips: Clip[];
}

export default function ClipButton({ initialClips }: DashboardProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [clips, setClips] = useState<Clip[]>(initialClips);


  const handleRecordingComplete = async (blob: Blob, title: string) => {
    const formData = new FormData();
    formData.append('file', blob, `${title}.webm`);
    formData.append('title', title);
    formData.append('description', 'Screen recording');

    try {
      const response = await fetch('/api/clips/upload', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - let the browser set it with boundary
      });

      if (response.ok) {
        const newClip = await response.json();
        setClips((prev) => [newClip, ...prev]);
      } else {
        console.error('Upload failed:', await response.text());
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };
 
  return (
    <Dialog>
      <DialogTrigger asChild>
       <Button variant="default" className="bg-[#6347EA] hover:bg-primary/90 px-2 rounded-lg py-4 h-0 text-white">
                        New Clip
                      </Button>
      </DialogTrigger>
      <DialogContent className="absolute top-48 right-1 ml-auto max-w-[340px] w-[340px] " >
      <RecordingInterface
            onRecordingComplete={handleRecordingComplete}
            onRecordingStateChange={setIsRecording}
          />
      </DialogContent>
    </Dialog>
  )
}

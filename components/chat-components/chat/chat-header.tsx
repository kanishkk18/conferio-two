// import React from "react";
// import { Hash } from "lucide-react";

// import { MobileToggle } from "@/components/chat-components/mobile-toggle";
// import { UserAvatar } from "@/components/chat-components//user-avatar";
// import { SocketIndicatior } from "@/components/chat-components/socket-indicatior";
// import { ChatVideoButton } from "./chat-video-button";

import React from 'react';
import { Hash } from 'lucide-react';

import { MobileToggle } from '@/components/chat-components/mobile-toggle';
import { UserAvatar } from '@/components/chat-components/user-avatar';
import { SocketIndicatior } from '@/components/chat-components/socket-indicatior';
import { ChatVideoButton } from './chat-video-button';
import DynamicIslandDemo from '@/components/ui/DynamicIslandDemo';
import { Separator } from '@/components/ui/separator';
import UserComponent from '@/components/ui/comp-377';
import { TaskForm } from '@/components/tasks/task-form';
import { AnimateIcon } from '@/components/animate-ui/icons/icon';
import { Button } from '../ui/button';
import { CirclePlus } from '@/components/animate-ui/icons/circle-plus';

interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: 'channel' | 'conversation';
  image?: string;
}

export function ChatHeader({ name, serverId, type, image }: ChatHeaderProps) {
  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b">
      <MobileToggle serverId={serverId} />
      {type === 'channel' && (
        <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
      )}

      {type === 'conversation' && (
        <UserAvatar src={image} className="h-8 w-8 md:h-8 md:w-8 mr-2" />
      )}<SocketIndicatior />

      <p className="font-semibold text-md text-black dark:text-white">{name}</p>
      
      <div className="ml-auto flex items-center ">
        {type === 'conversation' && <ChatVideoButton />}
        <TaskForm>
          <AnimateIcon animateOnHover>
            <Button
              variant="ghost"
              className=" px-1.5 !py-1.5 h-fit rounded-md gap-1 flex justify-center items-center text-center"
            >
              <CirclePlus className="h-4 w-4"/>
              <p>New</p>
            </Button>
          </AnimateIcon>
        </TaskForm>
        <Separator orientation="vertical" className="mr-2 h-6" />
        <DynamicIslandDemo />
        <Separator orientation="vertical" className="mr-2 h-6" />
        <UserComponent />
      </div>
    </div>
  );
}

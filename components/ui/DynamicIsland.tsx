"use client"

import { ReactNode, useMemo } from "react"
import {
  Bell,
  CloudLightning,
  Music2,
  Pause,
  Phone,
  Play,
  SkipBack,
  SkipForward,
  Thermometer,
  Timer as TimerIcon,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useRouter } from 'next/navigation'
import { X, Maximize2, Minimize2 } from 'lucide-react'
import { ChannelType } from "@prisma/client"
import { ChatHeader } from "@/components/chat-components/chat/chat-header"
import { ChatInput } from "@/components/chat-components/chat/chat-input"
import { ChatMessages } from "@/components/chat-components/chat/chat-messages"
import { MediaRoom } from "@/components/chat-components/media-room"
import Image from 'next/image';
import MusicProvider from '@/components/music-components/music-provider';
// import Player from '../components/cards/player'
import { useContext, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { getSongsById } from '@/lib/fetch';
import { MusicContext } from 'hooks/use-context';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import {
  FloatingPanelCloseButton,
  FloatingPanelContent,
  FloatingPanelFooter,
  FloatingPanelForm,
  FloatingPanelLabel,
  FloatingPanelRoot,
  FloatingPanelSubmitButton,
  FloatingPanelTextarea,
  FloatingPanelTrigger,
} from "@/components/ui/floatingPanel"
import { AnimateIcon } from "../animate-ui/icons/icon"
import { Disc3 } from "../animate-ui/icons/disc-3"
import { PhoneCall } from "../animate-ui/icons/phone-call"
import { BellRing } from "../animate-ui/icons/bell-ring"
import { Timer } from "../animate-ui/icons/timer"
import { BotIcon } from "../animate-ui/icons/bot"
import { MessageCircleMore } from "../animate-ui/icons/message-circle-more"
import ClipButton from "../clips/clipButton"
import { Clip } from '@prisma/client';
import RecordingInterface from "../clips/RecordingInterface"
import { AnimatedList } from "@/components/ui/animated-list";

interface NotificationData {
  id: number
  name: string
  message: string
  timeAgo: string
  icon: string
}
type NotificationProps = {
  notification: NotificationData
}


interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  serverId: string;
}

interface User {
  id: string;
  name: string;
  imageUrl: string;
  email: string;
}

interface Member {
  id: string;
  role: string;
  userId: string;
  serverId: string;
  user: User;
}

interface DashboardProps {
  initialClips: Clip[];
}



// Animation variants
const ANIMATION_VARIANTS = {
  "ring-idle": { scale: 0.9, scaleX: 0.9, bounce: 0.5 },
  "timer-ring": { scale: 0.7, y: -7.5, bounce: 0.35 },
  "ring-timer": { scale: 1.4, y: 7.5, bounce: 0.35 },
  "timer-idle": { scale: 0.7, y: -7.5, bounce: 0.3 },
  "idle-timer": { scale: 1.2, y: 5, bounce: 0.3 },
  "idle-ring": { scale: 1.1, y: 3, bounce: 0.5 },
} as const

const BOUNCE_VARIANTS = {
  idle: 0.5,
  "ring-idle": 0.5,
  "timer-ring": 0.35,
  "ring-timer": 0.35,
  "timer-idle": 0.3,
  "idle-timer": 0.3,
  "idle-ring": 0.5,
} as const

const variants = {
  exit: (transition: any, custom: any) => {
    // custom is the animation variant, e.g., ANIMATION_VARIANTS[variantKey]
    // We'll pass the target view as custom.nextView
    if (custom && custom.nextView === "idle") {
      return {
        opacity: [1, 0],
        scale: 0.7,
        filter: "blur(5px)",
        transition: { duration: 0.18, ease: "ease-in" },
      }
    }
    return {
      ...transition,
      opacity: [1, 0],
      filter: "blur(5px)",
    }
  },
}

// Idle Component with Weather
const DefaultIdle = () => {
  const [showTemp, setShowTemp] = useState(false)

  return (
    <motion.div
      className="flex items-center gap-2 px-3 py-2"
      onHoverStart={() => setShowTemp(true)}
      onHoverEnd={() => setShowTemp(false)}
      layout
    >
      <AnimatePresence mode="wait">
        <motion.div
          key="storm"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="text-foreground"
        >
          <CloudLightning className="h-5 w-5 text-white" />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showTemp && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="flex items-center gap-1 overflow-hidden text-white"
          >
            <Thermometer className="h-3 w-3" />
            <span className="pointer-events-none text-xs whitespace-nowrap text-white">
              12°C
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Ring Component
const DefaultRing = () => {
  return (
    <div className="text-foreground flex w-64 items-center gap-3 overflow-hidden px-4 py-2">
      <Phone className="h-5 w-5 text-green-500" />
      <div className="flex-1">
        <p className="pointer-events-none text-sm font-medium text-white">
          Incoming Call
        </p>
        <p className="pointer-events-none text-xs text-white opacity-70">
          Guillermo Rauch
        </p>
      </div>
      <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
    </div>
  )
}

// Timer Component
const Chat = () => {
  const [time, setTime] = useState(60)
   const [isOpen, setIsOpen] = useState(true)
    const [isExpanded, setIsExpanded] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [channel, setChannel] = useState<Channel | null>(null)
    const [member, setMember] = useState<Member | null>(null)
    const [serverId, setServerId] = useState<string | null>(null)
    const [channelId, setChannelId] = useState<string | null>(null)
    const router = useRouter()

  // useMemo(() => {
  //   const timer = setInterval(() => {
  //     setTime((t) => (t > 0 ? t - 1 : 0))
  //   }, 1000)
  //   return () => clearInterval(timer)
  // }, [])

  useEffect(() => {
      const fetchDefaultChatData = async () => {
        try {
          setIsLoading(true)
          const response = await fetch('/api/chat/default')
          
          if (!response.ok) {
            throw new Error('Failed to fetch chat data')
          }
          
          const data = await response.json()
          
          if (data.serverId && data.channelId) {
            setServerId(data.serverId)
            setChannelId(data.channelId)
            
            // Fetch channel details
            const channelResponse = await fetch(`/api/channels/${data.channelId}`)
            if (channelResponse.ok) {
              const channelData = await channelResponse.json()
              setChannel(channelData)
            }
            
            // Fetch member details
            const memberResponse = await fetch(`/api/servers/${data.serverId}/member`)
            if (memberResponse.ok) {
              const memberData = await memberResponse.json()
              setMember(memberData)
            }
          }
        } catch (error) {
          console.error('Error fetching chat data:', error)
        } finally {
          setIsLoading(false)
        }
      }
  
      if (isOpen) {
        fetchDefaultChatData()
      }
    }, [isOpen])
  
    const handleOpenChatPage = () => {
      if (serverId && channelId) {
        router.push(`/servers/${serverId}/channels/${channelId}`)
      }
    }
  

  return (
    // <div className="text-foreground flex w-64 items-center gap-3 overflow-hidden px-4 py-2">
    //   <TimerIcon className="h-5 w-5 text-amber-500" />
    //   <div className="flex-1">
    //     <p className="pointer-events-none text-sm font-medium text-white">
    //       {time}s remaining
    //     </p>
    //   </div>
    //   <div className="h-1 w-24 overflow-hidden rounded-full bg-white/20">
    //     <motion.div
    //       className="h-full bg-amber-500"
    //       initial={{ width: "100%" }}
    //       animate={{ width: "0%" }}
    //       transition={{ duration: time, ease: "linear" }}
    //     />
    //   </div>
    // </div>
    
       
      // <FloatingPanelRoot>

      //   <FloatingPanelTrigger >Add Note</FloatingPanelTrigger>
      //   <FloatingPanelContent className="absolute mt-32 ml-14 px-6 min-w-2xl border top-5 w-[24.5rem] h-[610px] z-50">
         <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    className={`bg-white dark:bg-gray-800 overflow-hidden shadow-xl flex flex-col ${
                      isExpanded ? 'w-[24.5rem] h-[610px]' : 'w-[24.5rem] h-[610px]'
                    }`}
                  >
                    {/* Header */}
                    <div className="bg-blue-600 text-white p-2 px-3 flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">
                          {isLoading ? 'Loading...' : (channel ? channel.name : 'Unknown Channel')}
                        </h3>
                        <p className="text-xs text-blue-100">
                          {isLoading ? 'Connecting...' : 'Online'}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setIsOpen(false)}
                          className="p-1 rounded-full hover:bg-blue-500 transition-colors"
                        >
                          <X size={16} />
                        </button>
                        <button
                          onClick={handleOpenChatPage}
                          className="p-1 rounded-full hover:bg-blue-500 transition-colors"
                          title="Open in full page"
                        >
                          <Maximize2 size={16} />
                        </button>
                      </div>
                    </div>
    
                    {/* Chat Content */}
                    <div className="flex-1 overflow-hidden bg-white dark:bg-[#070709] flex flex-col">
                      {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                      ) : channel && member ? (
                        <>
                          <ChatHeader
                            name={channel.name}
                            serverId={channel.serverId}
                            type="channel"
                          />
                          {channel.type === ChannelType.TEXT && (
                            <>
                              <div className="flex-1 overflow-auto">
                                <ChatMessages
                                  member={member}
                                  name={channel.name}
                                  chatId={channel.id}
                                  type="channel"
                                  apiUrl="/api/messages"
                                  socketUrl="/api/socket/messages"
                                  socketQuery={{
                                    channelId: channel.id,
                                    serverId: channel.serverId
                                  }}
                                  paramKey="channelId"
                                  paramValue={channel.id}
                                />
                              </div>
                              <ChatInput
                                name={channel.name}
                                type="channel"
                                apiUrl="/api/socket/messages"
                                query={{
                                  channelId: channel.id,
                                  serverId: channel.serverId
                                }}
                              />
                            </>
                          )}
                          {channel.type === ChannelType.AUDIO && (
                            <MediaRoom chatId={channel.id} video={false} audio={true} />
                          )}
                          {channel.type === ChannelType.VIDEO && (
                            <MediaRoom chatId={channel.id} video={true} audio={true} />
                          )}
                        </>
                      ) : (
                        <div className="flex justify-center items-center h-full">
                          <p className="text-zinc-500">No channel selected</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
      //   {/* </FloatingPanelContent>
      // </FloatingPanelRoot> */}
            
          
  )
}

// Notification Component
const AnimatedNotification = ({ notification }: NotificationProps) => (
  // <div className="text-foreground flex w-64 items-center gap-3 overflow-hidden px-4 py-2">
  //   <Bell className="h-5 w-5 text-yellow-400" />
  //   <div className="flex-1">
  //     <p className="pointer-events-none text-sm font-medium text-white">
  //       New Message
  //     </p>
  //     <p className="pointer-events-none text-xs text-white opacity-70">
  //       You have a new notification!
  //     </p>
  //   </div>
  //   <span className="rounded-full bg-yellow-400/40 px-2 py-0.5 text-xs text-yellow-500">
  //     1
  //   </span>
  // </div>
   <div className="flex w-full max-w-[350px] items-center justify-between gap-4 rounded-2xl border border-neutral-50 bg-white p-3.5 shadow-xl shadow-neutral-200 dark:border-neutral-900 dark:bg-neutral-950 dark:shadow-neutral-950/70">
      <img
        src={notification.icon }
        alt={notification.name}
        className="h-10 w-10"
      />
      <div className="flex w-full flex-col">
        <div className="flex w-full items-start justify-between">
          <span className="text-sm font-medium">{notification.name}</span>
          <span className="text-xs text-neutral-400">
            {notification.timeAgo}
          </span>
        </div>
        <span className="text-sm text-neutral-600 dark:text-neutral-400">
          {notification.message}
        </span>
      </div>
    </div>
)

const DefaultTimer = () => {
const [time, setTime] = useState(60)


  useMemo(() => {
    const timer = setInterval(() => {
      setTime((t) => (t > 0 ? t - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
  <div className="text-foreground flex w-64 items-center gap-3 overflow-hidden px-4 py-2">
      <TimerIcon className="h-5 w-5 text-amber-500" />
      <div className="flex-1">
        <p className="pointer-events-none text-sm font-medium text-white">
          {time}s remaining
        </p>
      </div>
      <div className="h-1 w-24 overflow-hidden rounded-full bg-white/20">
        <motion.div
          className="h-full bg-amber-500"
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: time, ease: "linear" }}
        />
      </div>
    </div>
  )
}

const Record = () => {
 const [isRecording, setIsRecording] = useState(false);
  const [clips, setClips] = useState<Clip[]>([]);


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
  <div className="text-foreground flex w-64 !rounded-md items-center gap-3 overflow-hidden px-4 py-2 bg-red-500">
       <RecordingInterface
                   onRecordingComplete={handleRecordingComplete}
                   onRecordingStateChange={setIsRecording}
                 />
    </div>
  )
}

// Music Player Component
const MusicPlayer = () => {
  const [data, setData] = useState([]);
    const [playing, setPlaying] = useState(false);
    const audioRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [audioURL, setAudioURL] = useState('');
    const [isLooping, setIsLooping] = useState(false);
    const values = useContext(MusicContext);
    const displayName = typeof data?.name === 'string' ? data.name.slice(0, 12) : undefined;    
  
    
    const getSong = async () => {
      const get = await getSongsById(values.music);
      const data = await get.json();
      setData(data.data[0]);
      if (data?.data[0]?.downloadUrl[2]?.url) {
        setAudioURL(data?.data[0]?.downloadUrl[2]?.url);
      } else if (data?.data[0]?.downloadUrl[1]?.url) {
        setAudioURL(data?.data[0]?.downloadUrl[1]?.url);
      } else {
        setAudioURL(data?.data[0]?.downloadUrl[0]?.url);
      }
    };
  
  
    const togglePlayPause = () => {
      if (playing) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setPlaying(!playing);
    };
  
    const handleSeek = (e) => {
      const seekTime = e[0];
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    };
  

  useEffect(() => {
      if (values?.music) {
        getSong();
        const storedTime = localStorage.getItem('c');
  
        if (storedTime) {
          const time = parseFloat(storedTime);
          audioRef.current.currentTime = time + 1;
          localStorage.removeItem('c');
        }
  
        setPlaying(
          localStorage.getItem('p') === 'true' || !localStorage.getItem('p')
        );
  
        const handleTimeUpdate = () => {
          try {
            setCurrentTime(audioRef.current.currentTime);
            setDuration(audioRef.current.duration);
            localStorage.setItem('c', audioRef.current.currentTime); // <-- store current time
          } catch (e) {
            setPlaying(false);
          }
        };
  
        audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
  
        return () => {
          if (audioRef.current) {
            audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
          }
        };
      }
    }, [values?.music]);

  return (
     <div>
       <audio
                autoPlay={playing}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onLoadedData={() => setDuration(audioRef.current.duration)}
                src={audioURL}
                ref={audioRef}
              />
      {!values?.music ? (
         <div className="flex flex-col justify-between items-center gap-3 bg-gray-50 dark:bg-neutral-950 px-6 py-3 rounded-[14px] w-full max-w-xl mx-auto shadow-md">
                              <img
                                className="h-20 w-20 rounded-lg"
                                src="https://i.scdn.co/image/ab67616d0000b27354e544672baa16145d67612b"
                                alt="Default Music"
                              />
                              <div className="flex text-center flex-col flex-1">
                                <p className="text-[16px] font-bold">
                                  No music playing
                                </p>
                              </div>
                              <Link
                                href="/music/layout"
                                className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 transition"
                              >
                                Play Music
                              </Link>
                            </div>
                      ) : (
    <div className="text-foreground flex w-72 items-center gap-3 overflow-hidden px-3 py-2">
      <Image
                              className="h-8 w-8 rounded-full object-cover"
                              src={data?.image?.[2]?.url || 'https://c.saavncdn.com/408/Rockstar-Hindi-2011-20221212023139-500x500.jpg'}
                              alt={data?.name || 'cover'}
                              width={1000}
                              height={1000}
                            />
      <div className="min-w-0 flex-1">
        <p className="pointer-events-none truncate text-sm font-medium text-white">
          {(data?.name?.slice(0, 12) || (
                          <Skeleton className="h-4 w-32" />
                        )) + (data?.name?.length > 25 ? '...' : '')}
        </p>
        <p className="pointer-events-none truncate text-xs text-white opacity-70">
           {(data?.artists?.primary?.[0]?.name?.slice(0, 12) || (
                                    <Skeleton className="h-3 w-20" />
                                  )) +
                                    (data?.artists?.primary?.[0]?.name?.length > 18
                                      ? '...'
                                      : '')}
        </p>
      </div>
      <button
        onClick={() => setPlaying(false)}
        className="rounded-full p-1 hover:bg-white/30"
      >
        <SkipBack className="h-4 w-4 text-white" />
      </button>
      <button
        onClick={togglePlayPause}
        className="rounded-full p-1 hover:bg-white/30"
      >
        {playing ? (
          <Pause className="h-4 w-4 text-white" />
        ) : (
          <Play className="h-4 w-4 text-white" />
        )}
      </button>
      <button
        onClick={() => setPlaying(true)}
        className="rounded-full p-1 hover:bg-white/30"
      >
        <SkipForward className="h-4 w-4 text-white" />
      </button>
    </div>
     )}
    </div>
  )
}

type View = "idle" | "ring" | "timer" | "notification" | "music" | "chat" | "ask" | "record"

export interface DynamicIslandProps {
  view?: View
  onViewChange?: (view: View) => void
  idleContent?: ReactNode
  ringContent?: ReactNode
  timerContent?: ReactNode
  chatContent?: ReactNode
  className?: string
}

export default function DynamicIsland({
  view: controlledView,
  onViewChange,
  idleContent,
  ringContent,
  timerContent,
  chatContent,
  className = "",
}: DynamicIslandProps) {
  const [internalView, setInternalView] = useState<View>()
  const [variantKey, setVariantKey] = useState<string>()

  const view = controlledView ?? internalView

  const content = useMemo(() => {
    switch (view) {
      case "ring":
        return ringContent ?? <DefaultRing />
      case "chat":
        return chatContent ?? <Chat />
      case "notification":
        return <Notification />
         case "timer":
        return <DefaultTimer />
      case "music":
        return <MusicPlayer />
        case "record":
        return <Record />
      // default:
      //   return idleContent ?? <MusicPlayer />
    }
  }, [view, idleContent, ringContent, timerContent, chatContent])

  const handleViewChange = (newView: View) => {
    if (view === newView) return
    setVariantKey(`${view}-${newView}`)
    if (onViewChange) onViewChange(newView)
    else setInternalView(newView)
  }

  return (
    <MusicProvider>
    <div className={` h-full  ${className}`}>
      <div className="relative flex h-full w-full flex-col justify-center">
        <motion.div
          layout
          transition={{
            type: "spring",
            bounce:
              BOUNCE_VARIANTS[variantKey as keyof typeof BOUNCE_VARIANTS] ??
              0.5,
          }}
          style={{ borderRadius: 32 }}
          className=" w-fit absolute top-10 !-right-5 z-50 overflow-hidden rounded-full bg-black"
        >
          <motion.div
            transition={{
              type: "spring",
              bounce:
                BOUNCE_VARIANTS[variantKey as keyof typeof BOUNCE_VARIANTS] ??
                0.5,
            }}
            initial={{
              scale: 0.9,
              opacity: 0,
              filter: "blur(5px)",
              originX: 0.5,
              originY: 0.5,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              filter: "blur(0px)",
              originX: 0.5,
              originY: 0.5,
              transition: { delay: 0.05 },
            }}
            key={view}
          >
            {content}
          </motion.div>
        </motion.div>


        <div className=" z-10 flex justify-center rounded-full  gap-1 px-0">
          {[
            { key: "record", icon: <Disc3 className="size-4" /> },
            { key: "ring", icon: <PhoneCall className="size-4" /> },
            { key: "timer", icon: <Timer className="size-4" /> },
            { key: "chat", icon: <MessageCircleMore className="size-4" /> },
             { key: "ask", icon: <BotIcon className="size-4" /> },
            { key: "notification", icon: <BellRing className="size-4" /> },
            { key: "music", icon: <Music2 className="size-4" /> },
          ].map(({ key, icon }) => (
           <AnimateIcon animateOnHover>
             <button 
              type="button"
              className=" flex size-7 px-0 cursor-pointer hover:bg-red-500 items-center justify-center rounded-full "
              onClick={() => {
                if (view !== key) {
                  setVariantKey(`${view}-${key}`)
                  handleViewChange(key as View)
                }
              }}
              key={key}
              aria-label={key}
            >
              {icon}
            </button>
            </AnimateIcon>
          ))}
        </div>
        
      </div>
    </div>
    </MusicProvider>
  )
}


export function Notification() {
  const notifications: NotificationData[] = [
    {
      id: 1,
      name: "Location",
      message: "Thomas has arrived home",
      timeAgo: "2h ago",
      icon: "https://cdn.badtz-ui.com/components/notification-icons/icon-1.png",
    },
    {
      id: 2,
      name: "Fitness Tracker",
      message: "You've reached your daily step goal!",
      timeAgo: "1h ago",
      icon: "https://cdn.badtz-ui.com/components/notification-icons/icon-2.png",
    },
    {
      id: 3,
      name: "Calendar",
      message: "Meeting with team in 30 minutes",
      timeAgo: "45m ago",
      icon: "https://cdn.badtz-ui.com/components/notification-icons/icon-3.png",
    },
    {
      id: 4,
      name: "Task Manager",
      message: "3 tasks due today",
      timeAgo: "1d ago",
      icon: "https://cdn.badtz-ui.com/components/notification-icons/icon-4.png",
    },
    {
      id: 5,
      name: "Health",
      message: "Your heart rate is elevated.",
      timeAgo: "3h ago",
      icon: "https://cdn.badtz-ui.com/components/notification-icons/icon-5.png",
    },
    {
      id: 6,
      name: "Email",
      message: "New message from your manager",
      timeAgo: "5m ago",
      icon: "https://cdn.badtz-ui.com/components/notification-icons/icon-6.png",
    },
    {
      id: 7,
      name: "TikTok",
      message: "Your video got 1000 likes!",
      timeAgo: "2d ago",
      icon: "https://cdn.badtz-ui.com/components/notification-icons/icon-7.png",
    },
    {
      id: 8,
      name: "Grandpa",
      message: "How are you doing, my dear?",
      timeAgo: "1w ago",
      icon: "https://cdn.badtz-ui.com/components/notification-icons/icon-8.png",
    },
    {
      id: 9,
      name: "Clara",
      message: "Let's meet for coffee tomorrow!",
      timeAgo: "2d ago",
      icon: "https://cdn.badtz-ui.com/components/notification-icons/icon-9.png",
    },
    {
      id: 10,
      name: "Sarah",
      message: "Did you see the new movie?",
      timeAgo: "4h ago",
      icon: "https://cdn.badtz-ui.com/components/notification-icons/icon-10.png",
    },
  ]
  return (
    <div className="h-[500px] text-foreground flex w-[500px] items-center gap-3 overflow-hidden px-6 py-2">
      <AnimatedList
        stackGap={20}
        columnGap={85}
        scaleFactor={0.05}
        scrollDownDuration={5}
        formationDuration={1}
      >
        {notifications.map((notification) => (
          <AnimatedNotification key={notification.id} notification={notification} />
        ))}
      </AnimatedList>
    </div>
  )
}
'use client';

import { useState, useEffect } from 'react';
import { getSession, useSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import RecordingInterface from '@/components/clips/RecordingInterface';
import ClipGrid from '@/components/clips/ClipGrid';
import ClipList from '@/components/clips/ClipList';
import { Clip } from '@prisma/client';
import Mainsidebar from '@/components/ui/mainSideBar';
import ClipButton from '@/components/clips/clipButton';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Video } from 'lucide-react';
import { Sparkles, Search} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AnimateIcon } from '@/components/animate-ui/icons/icon';
import { ArrowRight } from '@/components/animate-ui/icons/arrow-right';
import { Clapperboard } from '@/components/animate-ui/icons/clapperboard';
import { AudioLines } from '@/components/animate-ui/icons/audio-lines';
import { PhoneCallIcon } from '@/components/animate-ui/icons/phone-call';
import { ClipboardList } from '@/components/animate-ui/icons/clipboard-list';
import { LayoutDashboard } from '@/components/animate-ui/icons/layout-dashboard';
import { ListIcon } from '@/components/animate-ui/icons/list';
import DynamicIslandDemo from "@/components/ui/DynamicIslandDemo";
import { TaskForm } from "@/components/tasks/task-form";
import UserComponent from "@/components/ui/comp-377";
import { PlusIcon } from "@/components/animate-ui/icons/plus";

interface DashboardProps {
  initialClips: Clip[];
}

export default function Dashboard({ initialClips }: DashboardProps) {
  const { data: session } = useSession();
  const [clips, setClips] = useState<Clip[]>(initialClips);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const refreshClips = async () => {
    const response = await fetch('/api/clips');
    const data = await response.json();
    setClips(data);
  };

  if (!session) {
    return <div>Please sign in to access the Clips</div>;
  }

  return (
    <div className=" flex max-h-screen w-full dark:bg-[#000000] !overflow-hidden">
      <Mainsidebar />
      <ScrollArea className="flex-1 flex flex-col overflow-x-auto pb-0">
        <div className="flex-1 flex flex-col">
          <div className="h-11 w-full dark:bg-[#111111] bg-[#f1f1f5] flex items-center justify-between px-4 border-b dark:border-neutral-700">
            {/* Left side - Breadcrumb */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-sm">
                <Video className="h-5 w-5 font-medium" />
                <span className="text-foreground font-medium">Clips</span>
              </div>
            </div>

            {/* Center - Search */}
            <div className=" max-w-lg ">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full h-8 bg-secondary border-none rounded-md pl-9 pr-16 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">AI</span>
                </div>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center">

              <TaskForm>
                <AnimateIcon animateOnHover>
                  <Button variant="ghost" className=" gap-1 !py-0 px-1 text-foreground">
                    <PlusIcon className="w-4 h-4" />
                    <span className="text-sm">New</span>
                  </Button>
                </AnimateIcon>
              </TaskForm>
              <Separator orientation="vertical" className="h-6 mr-1" />
              <DynamicIslandDemo />
              <Separator orientation="vertical" className="h-6 mr-2" />
              <UserComponent />
            </div>
          </div>
          <Tabs defaultValue="all">
            <div className="flex !justify-between items-center pb-0 pt-5 px-4">
              <TabsList className="mb-1 h-auto gap-2 rounded-none !bg-transparent px-0 py-1 text-foreground">
                <TabsTrigger
                  value="all"
                  className="relative dark:text-[#7B7B7B] after:absolute bg-transparent border-none after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none dark:data-[state=active]:after:bg-white data-[state=active]:hover:bg-accent"
                >
                  All
                </TabsTrigger>
                <AnimateIcon animateOnHover>
                  <TabsTrigger
                    value="video"
                    className="relative dark:text-[#7B7B7B] after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
                  >
                    <Clapperboard
                      className="-ms-0.5 dark:text-[#7B7B7B] "
                      aria-hidden="true"
                    />
                    Video Clips
                    <Badge
                      className=" min-w-5 bg-primary/15 px-1"
                      variant="secondary"
                    >
                      {clips.length}
                    </Badge>
                  </TabsTrigger></AnimateIcon>

                <AnimateIcon animateOnHover> <TabsTrigger
                  value="voice"
                  className="relative dark:text-[#7B7B7B] after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
                >
                  <AudioLines
                    className="-ms-0.5  dark:text-[#7B7B7B]"
                    size={16}
                    aria-hidden="true"
                  />
                  Voice Clips
                </TabsTrigger></AnimateIcon>
                <AnimateIcon animateOnHover> <TabsTrigger
                  value="tab-5"
                  className="relative after:absolute dark:text-[#7B7B7B] after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
                >
                  <PhoneCallIcon
                    className="-ms-0.5  dark:text-[#7B7B7B]"
                    size={16}
                    aria-hidden="true"
                  />
                  SyncUps
                </TabsTrigger></AnimateIcon>
                <AnimateIcon animateOnHover> <TabsTrigger
                  value="tab-6"
                  className="relative after:absolute dark:text-[#7B7B7B] after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
                >
                  <ClipboardList
                    className="-ms-0.5  dark:text-[#7B7B7B]"
                    size={18}
                    aria-hidden="true"
                  />
                  AI Notetaker
                </TabsTrigger>
                </AnimateIcon>
              </TabsList>

              <div className=" flex items-center justify-between">


                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
                    <Search className="w-4 h-4 text-muted-foreground" />
                  </button>

                  <AnimateIcon animateOnHover className="flex flex-col items-center gap-8">
                    <TabsList className='dark:bg-[#1D1D1D]'>
                      <div className="data-[state=active]:bg-[#813b3b] dark:data-[state=active]:text-[#D4D4D4] dark:hover:bg-[#0F0F0F] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:bg-[#0F0F0F] text-foreground dark:text-[#D4D4D4]] inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1 rounded-xl px-2 py-0.5 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                        onClick={() => setViewMode('grid')}>
                        <LayoutDashboard />
                      </div>
                      <div className="data-[state=active]:bg-[#312222] dark:data-[state=active]:text-[#D4D4D4] dark:hover:bg-[#0F0F0F] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:bg-[#0F0F0F] text-foreground dark:text-[#D4D4D4]] inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1 rounded-xl px-2 py-0.5 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                        onClick={() => setViewMode('list')}>
                        <ListIcon />
                      </div>
                    </TabsList>
                  </AnimateIcon>
                  <ClipButton initialClips={clips} />
                </div>
              </div>
            </div>
            <Separator />
            <TabsContent
              value="all"
              className="px-4 pt-2"
            >
              {viewMode === 'grid' ? (
                <div className="grid lg:grid-cols-5 md:grid-cols-4 gap-4">
                  <ClipGrid clips={clips} onClipUpdate={refreshClips} />
                </div>
              ) : (
                <ClipList clips={clips} onClipUpdate={refreshClips} />
              )}
            </TabsContent>
            <TabsContent value="video" className="px-4 pt-2 ">
              {viewMode === 'grid' ? (
                <div className="grid lg:grid-cols-5 md:grid-cols-4 gap-4">
                  <ClipGrid clips={clips} onClipUpdate={refreshClips} />
                </div>
              ) : (
                <ClipList clips={clips} onClipUpdate={refreshClips} />
              )}
            </TabsContent>
            {/* <TabsContent value="tab-3">
              <p className="pt-1 text-center text-xs text-muted-foreground">
                Content for Tab 3
              </p>
            </TabsContent>
            <TabsContent value="tab-4">
              <p className="pt-1 text-center text-xs text-muted-foreground">
                Content for Tab 4
              </p>
            </TabsContent>
            <TabsContent value="tab-5">
              <p className="pt-1 text-center text-xs text-muted-foreground">
                Content for Tab 5
              </p>
            </TabsContent> */}
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}

// Remove this problematic line and fix the component
export const ClipsMeetingcard = ({ initialClips = [] }: DashboardProps) => {
  const { data: session } = useSession();
  const [clips, setClips] = useState<Clip[]>(initialClips);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const refreshClips = async () => {
    const response = await fetch('/api/clips');
    const data = await response.json();
    setClips(data);
  };

  if (!session) {
    return <div>Please sign in to access the Clips</div>;
  }

  return (
    <div className="dark:bg-[#161616] bg-[#F4F4F5] max-h-full h-full p-1 rounded-xl">
      <div className="flex py-1.5 px-2 justify-start items-center gap-2">
        <div className="bg-gradient-to-r from-[#FF896D] to-[#D02020] rounded-sm p-1">
          <Video className="text-white h-5 w-5" />
        </div>
        <div className="">
          <p className="text-[13px] font-bold">Your Clips</p>
          <p className="text-[10px] text-gray-500">
            Here is a count of your clips
          </p>
        </div>
      </div>
      <Card className="relative h-fit py-1 rounded-xl border-0 overflow-hidden bg-gradient-to-br from-[#111] via-[#101010] to-[#000]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#2b6eff_0%,_transparent_40%),radial-gradient(circle_at_bottom_right,_#ff003c_0%,_transparent_50%)] opacity-70" />
        <CardContent className="relative z-10 text-white flex flex-col px-3 py-0 h-full">
          <Link
            href="/clips"
            className="text-sm self-end text-white rounded-full border-red-500/30 border-[1px] w-fit p-1"
          >
            <AnimateIcon animateOnHover>
              <ArrowRight className="h-4 w-4 -rotate-45" />
            </AnimateIcon>
          </Link>

          <div className="flex w-full items-end justify-between">
            <div>
              <p className="text-[10px] text-gray-400">Total Clips</p>
              <h1 className="text-5xl font-semibold">{clips.length || 0}</h1>
            </div>
            <div className="">
              <div className="bg-gradient-to-r from-red-600/90 to-[#480404] text-white text-xs px-3 py-1 rounded-full shadow-lg">
                +7 Clips
              </div>
              <p className="text-[8px] text-gray-400 text-right">
                Compare to Last week
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  // Fetch clips from API
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/clips`, {
    headers: {
      Cookie: context.req.headers.cookie || '',
    },
  });

  const clips = response.ok ? await response.json() : [];

  return {
    props: {
      initialClips: clips,
    },
  };
};

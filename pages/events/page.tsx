'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { Loader } from '@/components/loader';
import { cn } from '@/lib/utils';
import { Clock, Ellipsis } from 'lucide-react';
// import { toast } from 'sonner';
import { ExternalLink } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Badge } from 'react-daisyui';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Mainsidebar from '@/components/ui/mainSideBar';
import { Input } from '@/components/ui/input';
import { ArrowRight, Search } from 'lucide-react';
import UserAvatar from '@/components/ui/comp-377';
import CreateEvent from './create/page';
import {
  BoltIcon,
  CopyPlusIcon,
  FilesIcon,
  Layers2Icon,
  TrashIcon,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import EditEvent from './update/index';
import { Separator } from '@/components/ui/separator';
import UsernameSetup from '@/components/UsernameSetup';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import DynamicIslandDemo from '@/components/ui/DynamicIslandDemo';
import CircularText from '@/components/ui/CircularTextLoader';
import { Fragment, useId } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { AnimateIcon } from '@/components/animate-ui/icons/icon';
import { ExternalLinkIcon } from '@/components/animate-ui/icons/external-link';
import { LinkIcon } from '@/components/animate-ui/icons/link';
import { Check } from '@/components/animate-ui/icons/check';
import { EllipsisIcon } from '@/components/animate-ui/icons/ellipsis';
import { Header } from '@/components/doc-components/Header';

export default function Events() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState<boolean>(false);
  const id = useId();
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  const {
    data: events,
    isLoading,
    data,
  } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const response = await fetch('/api/event/all');
      if (!response.ok) throw new Error('Failed to fetch events');
      return response.json();
    },
    enabled: !!session,
  });

  const togglePrivacyMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const response = await fetch('/api/event/toggle-privacy', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId }),
      });
      if (!response.ok) throw new Error('Failed to toggle privacy');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const response = await fetch(`/api/event/${eventId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete event');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularText
          text="CONFERIO*CALLS*"
          onHover="speedUp"
          spinDuration={5}
          className="custom-class"
        />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  const handleCopy = async (event: any) => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/${events?.data?.username}/${event.slug}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleUserNameCopy = async (event: any) => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/${events?.data?.username}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="flex w-full full max-h-screen dark:bg-[#0F0F0F] !overflow-hidden">
      <Mainsidebar />
      <ScrollArea className="flex w-full flex-col overflow-auto">
         <Header/>
         <div className="w-full px-8 py-2 flex flex-wrap items-center justify-between">
         
          <div className="flex items-center justify-between w-full py-4 ">
            <div className="relative">
              <Input
                className="peer pe-20 ps-9 dark:border-neutral-700"
                placeholder="Search..."
                type="search"
              />
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                <Search size={16} strokeWidth={2} />
              </div>
              <button
                className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Submit search"
                type="submit"
              >
                <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
              </button>
            </div>

            <div className="flex justify-center items-center gap-0">
              <CreateEvent />
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                   
                    <Button
                    variant="outline"
                    className="bg-transparent px-2 dark:border-[#323232]"
                    size="sm"
                  >
                    <AnimateIcon animateOnHover>
                    <EllipsisIcon
                      size={16}
                      className="shrink-0 text-muted-foreground/80"
                      aria-hidden="true"
                    />
                    </AnimateIcon>
                  </Button>
                  
                </PopoverTrigger>
                <PopoverContent
                  className="w-full min-w-[var(--radix-popper-anchor-width)] border-input p-2"
                  align="start"
                >
                  <Command>
                    <CommandList>
                      <UsernameSetup />
                    </CommandList>
                    <CommandList>
                      <Link
                        href={`${window.location.origin}/${events.data.username}`}
                        className="text-[#004eba] flex justify-center gap-1 items-center text-center whitespace-nowrap 
                   overflow-hidden hover:underline truncate font-sans line-clamp-1 text-sm dark:text-gray-300 font-medium"
                      >
                        <ExternalLink
                          size={17}
                          className="dark:text-blue-700"
                        />
                        <span className="">Booking Page</span>
                      </Link>
                      
                    </CommandList>
                    <CommandList
                      className="disabled:opacity-100 shadow-none p-0 border-none bg-transparent overflow-hidden"
                      onClick={handleUserNameCopy}
                      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
                    >
                      <div
                        className={cn(
                          ' absolute transition-all',
                          copied
                            ? 'scale-100 opacity-100 p-0'
                            : 'scale-0 opacity-0'
                        )}
                      >
                        <CheckIcon
                          className="stroke-emerald-500"
                          size={16}
                          aria-hidden="true"
                        />
                      </div>
                      <div
                        className={cn(
                          'transition-all',
                          copied
                            ? 'scale-0 opacity-0 p-0'
                            : 'scale-100 opacity-100'
                        )}
                      >
                        <CopyIcon size={16} aria-hidden="true" />
                      </div>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <div className="w-full overflow-hidden shadow-none px-8">
          {events?.data?.events?.length > 0 ? (
            <div className="overflow-hidden rounded-md dark:border-[#323232] border-[0.2px]">
              {events.data.events.map((event: any) => (
                <Card
                  key={event.id}
                  className={cn(
                    `  rounded-none bg-transparent shadow-none !border-[0.2px] dark:border-[#323232] p-3 px-5 flex items-center justify-between`,
                    event.isPrivate && 'bg-transparent' 
                  )}
                >
                  <CardContent className="relative flex p-0 shadow-none">
                    <div
                      className={cn(
                        ` `,
                        event.isPrivate && 'bg-[rgb(178,178,178)]'
                      )}
                    ></div>

                    {/* {Event details} */}
                    <div className="w-full gap-2 flex flex-col">
                      <div className="flex justify-end items-end text-end">
                        <h2
                          className={cn(
                            `text-md flex justify-center items-end font-semibold dark:text-neutral-300`,
                            event.isPrivate && 'text-[rgba(109,107,107,0.61)]'
                          )}
                        >
                          {event.title}/
                          <p className="text-xs text-[#A3A3A3]">
                            {event.slug.replace(/-([a-z])/g, (_, c) =>
                              c.toUpperCase()
                            )}{' '}
                            • {event._count.meetings} bookings
                          </p>
                        </h2>
                      </div>
                      <p className="dark:text-[#ffffff] text-xs flex justify-center text-center items-center px-1 gap-1 rounded-sm w-fit dark:bg-neutral-600">
                        <Clock className="h-3 w-3" /> {event.duration}m
                      </p>
                    </div>
                  </CardContent>

                  <CardFooter className="flex p-0 gap-4 items-center justify-center">
                    <Badge className="dark:bg-[#323232] text-xs font-semibold">
                      {event.isPending ? (
                        <Loader size="sm" color="black" />
                      ) : (
                        <span className="">
                          {event.isPrivate ? 'Hidden' : ''}
                        </span>
                      )}
                    </Badge>

                    <Switch
                      className=""
                      checked={event.isPrivate}
                      onCheckedChange={() =>
                        togglePrivacyMutation.mutate(event.id)
                      }
                      disabled={togglePrivacyMutation.isPending}
                    />
                    <div className="flex justify-center items-center rounded-md border dark:border-[#323232]">
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                             <AnimateIcon animateOnHover>
                              <Button variant="ghost" size="icon" aria-label="">
                              <Link
                                href={`${window.location.origin}/${events.data.username}/${event.slug}`}
                                className={cn(
                                  `p-0`,
                                  event.isPrivate &&
                                    'pointer-events-none opacity-60'
                                )}
                              >
                                <ExternalLinkIcon className="h-4 w-4 text-[#FAFAFA]"/>
                              </Link>
                            </Button>
                            </AnimateIcon>
                          </TooltipTrigger>
                          <TooltipContent className="px-2 py-1 text-xs">
                            {' '}
                            View booking page{' '}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <div className="dark:bg-[#323232] bg-neutral-300 h-5 min-h-full w-[1px]"></div>
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AnimateIcon animateOnHover>
                              <Button
                              size="icon"
                              className="disabled:opacity-100 text-[#FAFAFA]"
                              onClick={() => handleCopy(event)}
                              aria-label={
                                copied ? 'Copied' : 'Copy to clipboard'
                              }
                              disabled={event.isPrivate}
                              variant="ghost"
                            >
                              <div
                                className={cn(
                                  'absolute transition-all',
                                  copied
                                    ? 'scale-100 opacity-100'
                                    : 'scale-0 opacity-0'
                                )}
                              >

                                <Check
                                  className="stroke-emerald-500"
                                  size={16}
                                  aria-hidden="true"
                                />
                              </div>
                              <div
                                className={cn(
                                  ' transition-all',
                                  copied
                                    ? 'scale-0 opacity-0'
                                    : 'scale-100 opacity-100'
                                )}
                              >
                               <LinkIcon />
                              </div>
                            </Button>
                            </AnimateIcon>
                          </TooltipTrigger>
                          <TooltipContent className="px-2 py-1 text-xs">
                            Click to copy
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <div className="dark:bg-[#323232] bg-neutral-300 h-5 min-h-full w-[1px]"></div>

                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                
                                  <Button
                                  variant="ghost"
                                  size="icon"
                                  aria-label=""
                                ><AnimateIcon animateOnHover>
                                <EllipsisIcon className="text-[#FAFAFA]"/>
                                 </AnimateIcon></Button>
                               
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuLabel>Label</DropdownMenuLabel>
                                <DropdownMenuGroup>
                                  <DropdownMenuItem
                                    onClick={() => handleCopy(event)}
                                  >
                                    <CopyPlusIcon
                                      size={16}
                                      className="opacity-60"
                                      aria-hidden="true"
                                    />
                                    Copy
                                  </DropdownMenuItem>
                                  <Dialog>
                                    <DialogTrigger>
                                      <BoltIcon
                                        size={16}
                                        className="opacity-60"
                                        aria-hidden="true"
                                      />
                                    </DialogTrigger>
                                    <DialogContent>
                                      <EditEvent event={event} />
                                    </DialogContent>
                                  </Dialog>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>Label</DropdownMenuLabel>
                                <DropdownMenuGroup>
                                  <DropdownMenuItem>
                                    <Layers2Icon
                                      size={16}
                                      className="opacity-60"
                                      aria-hidden="true"
                                    />
                                    Group
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <FilesIcon
                                      size={16}
                                      className="opacity-60"
                                      aria-hidden="true"
                                    />
                                    Clone
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      deleteEventMutation.mutate(event.id)
                                    }
                                    disabled={deleteEventMutation.isPending}
                                  >
                                    <TrashIcon size={16} aria-hidden="true" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuGroup>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TooltipTrigger>
                          <TooltipContent className="px-2 py-1 text-xs">
                            {' '}
                            View booking page{' '}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    {/* <EditEvent event={event} /> */}
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-screen max-h-[70%] w-full">
              <div
                className="flex flex-col items-center justify-center
               h-full w-full text-center"
              >
                <img
                  src="https://img.freepik.com/free-vector/date-picker-concept-illustration_114360-4495.jpg?t=st=1751978834~exp=1751982434~hmac=59e640f90ce63422b604bc75a4903ea45721e72af87ae5bfa38bf15b4dd016d3&w=2000"
                  alt={'Create events'}
                  className="w-[200px] rounded-md h-[200px] mb-3"
                />
                <h3 className="text-xl mb-[3px] font-semibold">
                  Create scheduling links with event types
                </h3>
                <p className="font-light">
                  Create event for schedule meetings with teams or collegues.
                </p>

                <div className="mt-5">
                  {/* <NewEventDialog btnVariant="default" /> */}
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

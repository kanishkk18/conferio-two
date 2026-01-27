// import { Send, Phone, Video, Mail, Smile } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { ChannelType } from "@prisma/client"
// import { ChatInput } from "@/components/chat-components/chat/chat-input"
// import { ChatMessages } from "@/components/chat-components/chat/chat-messages"
// import { MediaRoom } from "@/components/chat-components/media-room"

// interface Channel {
//   id: string;
//   name: string;
//   type: ChannelType;
//   serverId: string;
// }

// interface User {
//   id: string;
//   name: string;
//   imageUrl: string;
//   email: string;
// }

// interface Member {
//   id: string;
//   role: string;
//   userId: string;
//   serverId: string;
//   user: User;
// }

// const ChatInterface = () => {
//    const [isOpen, setIsOpen] = useState(true)
//     const [isLoading, setIsLoading] = useState(true)
//     const [channel, setChannel] = useState<Channel | null>(null)
//     const [member, setMember] = useState<Member | null>(null)
//     const [serverId, setServerId] = useState<string | null>(null)
//     const [channelId, setChannelId] = useState<string | null>(null)
//     const router = useRouter()

//      useEffect(() => {
//         const fetchDefaultChatData = async () => {
//           try {
//             setIsLoading(true)
//             const response = await fetch('/api/chat/default')

//             if (!response.ok) {
//               throw new Error('Failed to fetch chat data')
//             }

//             const data = await response.json()

//             if (data.serverId && data.channelId) {
//               setServerId(data.serverId)
//               setChannelId(data.channelId)

//               // Fetch channel details
//               const channelResponse = await fetch(`/api/channels/${data.channelId}`)
//               if (channelResponse.ok) {
//                 const channelData = await channelResponse.json()
//                 setChannel(channelData)
//               }

//               // Fetch member details
//               const memberResponse = await fetch(`/api/servers/${data.serverId}/member`)
//               if (memberResponse.ok) {
//                 const memberData = await memberResponse.json()
//                 setMember(memberData)
//               }
//             }
//           } catch (error) {
//             console.error('Error fetching chat data:', error)
//           } finally {
//             setIsLoading(false)
//           }
//         }

//         if (isOpen) {
//           fetchDefaultChatData()
//         }
//       }, [isOpen])

//       const handleOpenChatPage = () => {
//         if (serverId && channelId) {
//           router.push(`/servers/${serverId}/channels/${channelId}`)
//         }
//       }

//   return (
//     <Card className="flex flex-col h-full rounded-3xl border-none shadow-none">
//       <div className="flex items-center justify-between p-4 border-b border-border">
//         <div className="flex items-center gap-3">
//           <Avatar>
//             <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb" />
//             <AvatarFallback>EL</AvatarFallback>
//           </Avatar>
//           <div>
//             <h3 className="font-semibold"> {isLoading ? 'Loading...' : (channel ? channel.name : 'Unknown Channel')}</h3>
//             <p className="text-xs text-success">{isLoading ? 'Connecting...' : 'Online'}</p>
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           <Button variant="ghost" size="icon" className="rounded-full">
//             <Phone className="w-4 h-4" />
//           </Button>
//           <Button variant="ghost" size="icon" className="rounded-full">
//             <Video className="w-4 h-4" />
//           </Button>
//           <Button variant="ghost" size="icon" className="rounded-full">
//             <Mail className="w-4 h-4" />
//           </Button>
//         </div>
//       </div>

//          <div className="flex-1 overflow-hidden bg-white dark:bg-[#070709] flex flex-col">
//                           {isLoading ? (
//                             <div className="flex justify-center items-center h-full">
//                               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                             </div>
//                           ) : channel && member ? (
//                             <>
//                               {/* <ChatHeader
//                                 name={channel.name}
//                                 serverId={channel.serverId}
//                                 type="channel"
//                               /> */}
//                               {channel.type === ChannelType.TEXT && (
//                                 <>
//                                   <div className="flex-1 overflow-auto">
//                                     <ChatMessages
//                                       member={member}
//                                       name={channel.name}
//                                       chatId={channel.id}
//                                       type="channel"
//                                       apiUrl="/api/messages"
//                                       socketUrl="/api/socket/messages"
//                                       socketQuery={{
//                                         channelId: channel.id,
//                                         serverId: channel.serverId
//                                       }}
//                                       paramKey="channelId"
//                                       paramValue={channel.id}
//                                     />
//                                   </div>
//                                   <ChatInput
//                                     name={channel.name}
//                                     type="channel"
//                                     apiUrl="/api/socket/messages"
//                                     query={{
//                                       channelId: channel.id,
//                                       serverId: channel.serverId
//                                     }}
//                                   />
//                                 </>
//                               )}
//                               {channel.type === ChannelType.AUDIO && (
//                                 <MediaRoom chatId={channel.id} video={false} audio={true} />
//                               )}
//                               {channel.type === ChannelType.VIDEO && (
//                                 <MediaRoom chatId={channel.id} video={true} audio={true} />
//                               )}
//                             </>
//                           ) : (
//                             <div className="flex justify-center items-center h-full">
//                               <p className="text-zinc-500">No channel selected</p>
//                             </div>
//                           )}
//                         </div>
//     </Card>
//   );
// };

// export default ChatInterface;

// components/ChatInterface.tsx
import { Send, Phone, Video, Mail, Smile, MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ChannelType } from '@prisma/client';
import { ChatInput } from '@/components/chat-components/chat/chat-input';
import { ChatMessages } from '@/components/chat-components/chat/chat-messages';
import { MediaRoom } from '@/components/chat-components/media-room';
import { PhoneCall } from './animate-ui/icons/phone-call';
import { AnimateIcon } from './animate-ui/icons/icon';
import { SendIcon } from './animate-ui/icons/send';
import { Cctv } from './animate-ui/icons/cctv';

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

interface ChatInterfaceProps {
  selectedMemberId?: string;
  serverId?: string;
}

const ChatInterface = ({ selectedMemberId, serverId }: ChatInterfaceProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [channel, setChannel] = useState<Channel | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [conversationMember, setConversationMember] = useState<any>(null);
  const router = useRouter();

  // Fetch conversation data when memberId changes
  useEffect(() => {
    const fetchConversationData = async () => {
      try {
        setIsLoading(true);

        if (selectedMemberId && serverId) {
          // Fetch conversation member details
          const memberResponse = await fetch(
            `/api/members/${selectedMemberId}?serverId=${serverId}`
          );
          if (memberResponse.ok) {
            const memberData = await memberResponse.json();
            setConversationMember(memberData);
          }

          // Fetch current user member details
          const currentMemberResponse = await fetch(
            `/api/servers/${serverId}/member`
          );
          if (currentMemberResponse.ok) {
            const currentMemberData = await currentMemberResponse.json();
            setMember(currentMemberData);
          }

          // For direct messages, we might not have a traditional channel
          // You can create a virtual channel or use the conversation API
          setChannel({
            id: `conversation-${selectedMemberId}`,
            name: conversationMember?.user?.name || 'Direct Message',
            type: ChannelType.TEXT,
            serverId: serverId,
          });
        } else {
          // Fallback to default channel behavior
          const response = await fetch('/api/chat/default');

          if (response.ok) {
            const data = await response.json();

            if (data.serverId && data.channelId) {
              // Fetch channel details
              const channelResponse = await fetch(
                `/api/channels/${data.channelId}`
              );
              if (channelResponse.ok) {
                const channelData = await channelResponse.json();
                setChannel(channelData);
              }

              // Fetch member details
              const memberResponse = await fetch(
                `/api/servers/${data.serverId}/member`
              );
              if (memberResponse.ok) {
                const memberData = await memberResponse.json();
                setMember(memberData);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching conversation data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchConversationData();
    }
  }, [isOpen, selectedMemberId, serverId]);

  // Get display name and avatar for the chat header
  const getChatHeaderInfo = () => {
    if (conversationMember) {
      return {
        name: conversationMember.user.name,
        imageUrl: conversationMember.user.image,
        status: 'Online',
      };
    }

    return {
      name: channel ? channel.name : 'Select a conversation',
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
      status: 'Online',
    };
  };

  const headerInfo = getChatHeaderInfo();

  return (
    <Card className="flex flex-col bg-[#F5F6F7] dark:bg-[#171717] overflow-hidden max-h-screen h-full rounded-3xl border-none shadow-none">
      <div className="flex items-center justify-between p-4 border-b dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={headerInfo.imageUrl} />
            <AvatarFallback>
              {headerInfo.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">
              {isLoading ? 'Loading...' : headerInfo.name}
            </h3>
            <p className="text-xs text-success">
              {isLoading ? 'Connecting...' : headerInfo.status}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AnimateIcon animateOnHover>
            <Button variant="ghost" size="icon" className="rounded-full border ">
              <PhoneCall className="w-4 h-4"/>
            </Button>
          </AnimateIcon>
          <AnimateIcon animateOnHover>
            <Button variant="ghost" size="icon" className="rounded-full border ">
               <Cctv className="w-7 h-7 -rotate-[24deg]"/>
            </Button>
          </AnimateIcon>
          <AnimateIcon animateOnHover >
            <Button onClick={() => window.open('https://0.email/mail/inbox?isComposeOpen=true', '_blank')}
 variant="ghost" size="icon" className="rounded-full border ">
              <SendIcon className="w-4 h-4"/>
            </Button>
          </AnimateIcon>
        </div>
      </div>

      <div className="flex-1 overflow-hidden dark:bg-[#0A0A0A] flex flex-col">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : selectedMemberId && member ? (
          <>
            {/* Direct Message Chat */}
            <div className="flex-1 scrollbar-thin2 overflow-auto">
              <ChatMessages
                member={member}
                name={headerInfo.name}
                chatId={`conversation-${selectedMemberId}`}
                type="conversation"
                apiUrl="/api/direct-messages"
                socketUrl="/api/socket/direct-messages"
                socketQuery={{
                  conversationId: selectedMemberId,
                  serverId: serverId,
                }}
                paramKey="conversationId"
                paramValue={selectedMemberId}
              />
            </div>
            <ChatInput
              name={headerInfo.name}
              type="conversation"
              apiUrl="/api/socket/direct-messages"
              query={{
                conversationId: selectedMemberId,
                serverId: serverId,
              }}
            />
          </>
        ) : channel && member ? (
          <>
            {/* Channel Chat */}
            {channel.type === ChannelType.TEXT && (
              <>
                <div className="flex-1 scrollbar-thin2 overflow-auto">
                  <ChatMessages
                    member={member}
                    name={channel.name}
                    chatId={channel.id}
                    type="channel"
                    apiUrl="/api/messages"
                    socketUrl="/api/socket/messages"
                    socketQuery={{
                      channelId: channel.id,
                      serverId: channel.serverId,
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
                    serverId: channel.serverId,
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
          <div className="flex flex-col justify-center items-center h-full text-zinc-500">
            <MessageSquare className="w-12 h-12 mb-4 opacity-50" />
            <p>Select a team member to start chatting</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ChatInterface;

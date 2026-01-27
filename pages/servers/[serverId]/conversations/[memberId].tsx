import React from "react";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "utils/db";
import { getOrCreateConversation } from "@/lib/conversation";
import { NavigationSidebar } from "@/components/chat-components/navigation/navigation-sidebar";
import { ServerSidebar } from "@/components/chat-components/server/server-sidebar";
import { ChatHeader } from "@/components/chat-components/chat/chat-header";
import { ChatMessages } from "@/components/chat-components/chat/chat-messages";
import { ChatInput } from "@/components/chat-components/chat/chat-input";
import { MediaRoom } from "@/components/chat-components/media-room";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import ThinSidebar from '@/components/ui/thinSidebar';


interface MemberIdPageProps {
  serverId: string;
  memberId: string;
  conversation: any;
  currentMember: any;
  otherMember: any;
  video?: boolean;
}

export default function MemberIdPage({
  serverId,
  memberId,
  conversation,
  currentMember,
  otherMember,
  video
}: MemberIdPageProps) {
  return (
    <ResizablePanelGroup direction="horizontal" className="max-h-screen min-h-screen w-screen dark:bg-black">
        <ThinSidebar />
      <ResizablePanel defaultSize={5} minSize={4.5} maxSize={4.5} className="dark:bg-black">
        <NavigationSidebar />
      </ResizablePanel>
      <ResizableHandle className="bg-transparent " />
      <ResizablePanel defaultSize={22} minSize={18} maxSize={26} className="rounded-tl-2xl border dark:border-neutral-800 mt-6">
        <div className="flex h-full items-center justify-center">
          <ServerSidebar serverId={serverId} />
        </div>
      </ResizablePanel>

      <ResizableHandle className="bg-transparent" />
      <ResizablePanel defaultSize={75} className="border-t dark:border-neutral-800 mt-6">

        <div className="bg-white dark:bg-[#070709] flex flex-col h-full ">
          <ChatHeader
            image={otherMember.user.image}
            name={otherMember.user.name}
            serverId={serverId}
            type="conversation"
          />
          {video && <MediaRoom chatId={conversation.id} video audio />}
          {!video && (
            <>
              <ChatMessages
                member={currentMember}
                name={otherMember.user.name}
                chatId={conversation.id}
                type="conversation"
                apiUrl="/api/direct-messages"
                paramKey="conversationId"
                paramValue={conversation.id}
                socketUrl="/api/socket/direct-messages"
                socketQuery={{
                  conversationId: conversation.id
                }}
              />
              <ChatInput
                name={otherMember.user.name}
                type="conversation"
                apiUrl="/api/socket/direct-messages"
                query={{
                  conversationId: conversation.id
                }}
              />
            </>
          )}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { serverId, memberId } = context.params!;
  const { video } = context.query;
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session?.user?.id) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  const currentMember = await prisma.member.findFirst({
    where: {
      serverId: serverId as string,
      userId: user.id
    },
    include: {
      user: true
    }
  });

  if (!currentMember) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const conversation = await getOrCreateConversation(
    currentMember.id,
    memberId as string
  );

  if (!conversation) {
    return {
      redirect: {
        destination: `/servers/${serverId}`,
        permanent: false,
      },
    };
  }

  const { memberOne, memberTwo } = conversation;
  const otherMember = memberOne.userId === user.id ? memberTwo : memberOne;

  return {
    props: {
      serverId: serverId as string,
      memberId: memberId as string,
      conversation: JSON.parse(JSON.stringify(conversation)),
      currentMember: JSON.parse(JSON.stringify(currentMember)),
      otherMember: JSON.parse(JSON.stringify(otherMember)),
      video: video === "true" || false,
    },
  };
};
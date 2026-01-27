// components/TeamMembersView.tsx
import { useState, useEffect } from 'react';
import { Team } from '@prisma/client';
import { TeamMemberWithUser } from 'hooks/useTeamMembers';
import ProfileSidebar from './ProfileSidebar';
import LeadCard from './LeadCard';
import { useSession } from 'next-auth/react';
import useTeamMembers from 'hooks/useTeamMembers';
import { Loading, Error } from '@/components/shared';
import ChatInterface from './ChatInterface';
import { ScrollArea } from './ui/scroll-area';
import Mainsidebar from './ui/mainSideBar';
import DynamicIslandDemo from './ui/DynamicIslandDemo';
import { Separator } from './ui/separator';
import UserComponent from './ui/comp-377';
import { TaskForm } from './tasks/task-form';
import { Button } from './ui/button';
import { PlusIcon } from './animate-ui/icons/plus';
import { AnimateIcon } from './animate-ui/icons/icon';
import { ArrowLeft } from './animate-ui/icons/arrow-left';
import { ArrowRight } from './animate-ui/icons/arrow-right';
import { CirclePlus } from './animate-ui/icons/circle-plus';
import Members from './team/Members';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useTeams from 'hooks/useTeams';
import { ChevronUpDown } from './animate-ui/icons/chevron-up-down';
import { Sparkles } from './animate-ui/icons/sparkles';
import { Search } from './animate-ui/icons/search';
import { FileText } from 'lucide-react';
import { UsersRound } from './animate-ui/icons/users-round';

interface TeamMembersViewProps {
  team: Team;
}

const TeamMembersView = ({ team }: TeamMembersViewProps) => {
  const { data: session } = useSession();
  const [selectedMember, setSelectedMember] =
    useState<TeamMemberWithUser | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { teams } = useTeams();

  const { isLoading, isError, members, mutateTeamMembers } = useTeamMembers(
    team.slug
  );

  // Auto-select first member (other than current user) when members load
  useEffect(() => {
    if (members && members.length > 0 && !selectedMember) {
      const otherMembers = members.filter(
        (member) => member.userId !== session?.user?.id
      );
      const firstMember =
        otherMembers.length > 0 ? otherMembers[0] : members[0];
      setSelectedMember(firstMember);
      setIsSidebarOpen(true);
    }
  }, [members, selectedMember, session?.user?.id]);

  const handleMemberSelect = (member: TeamMemberWithUser) => {
    setSelectedMember(member);
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error message={isError.message} />;
  }

  if (!members) {
    return null;
  }

  return (
    <div className="min-h-screen flex dark:bg-[#000000] h-screen w-full">
      <div className="z-50">
        <Mainsidebar />
      </div>
      <ScrollArea className="scrollbar-thin2 pb-4">
         <div className="h-11 dark:bg-[#222222] bg-[#f3f3f4] flex items-center justify-between px-4">
                {/* Left side - Breadcrumb */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 text-sm">
                    <AnimateIcon animateOnHover>
                    <UsersRound className="w-4 h-4 text-muted-foreground" />
                    </AnimateIcon>

                    <span className="text-foreground font-medium">Members</span>
                  </div>
                </div>
        
                <AnimateIcon animateOnHover className='min-w-52 max-w-4xl !ml-32'>
                  <div className="w-full">
                    <div className="relative">
                      <Search className="absolute left-3 top-2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search"
                        className="w-full h-8 bg-transparent border rounded-md pl-9 pr-16 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <Sparkles className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">AI</span>
                      </div>
                    </div>
                  </div>
                </AnimateIcon>
        
                {/* Right side - Actions */}
               <div className="flex items-center justify-center">
            <TaskForm>
              <AnimateIcon animateOnHover>
                <Button
                  variant="ghost"
                  className="!p-1 hover:bg-red-500 h-6 w-6 rounded-full "
                >
                  <CirclePlus />
                </Button>
              </AnimateIcon>
            </TaskForm>
            <DynamicIslandDemo />
            <Separator orientation="vertical" className="h-6 mr-2" />
            <UserComponent />
          </div>
              </div>
        {/* <div className="w-full py-6 justify-between items-center px-3 flex gap-10 ">
         
          <div className="flex items-start gap-4">
            <AnimateIcon animateOnHover className="bg-white rounded-full p-3">
              <ArrowLeft className="h-4 w-4" />
            </AnimateIcon>
            <h1 className="text-3xl font-semibold capitalize flex flex-col ">
              {' '}
              <p className="font-semibold">Team</p>
              <DropdownMenu>
                <AnimateIcon animateOnHover>
                  <DropdownMenuTrigger className="capitalize flex justify-center items-center gap-1">
                    {team.name}
                    <ChevronUpDown className="h-5 w-5 mt-2" />
                  </DropdownMenuTrigger>
                </AnimateIcon>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Teams</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {teams &&
                    Array.isArray(teams) &&
                    teams.map((t: Team) => (
                      <DropdownMenuItem
                        key={t.slug}
                        onClick={() =>
                          (window.location.href = `/members/${t.slug}`)
                        }
                        className="capitalize"
                      >
                        {t.name}
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>{' '}
            </h1>
          </div>

          <div className="flex flex-grow items-center justify-center pl-10 gap-36">
            <div className="flex flex-col text-start items-start gap-1">
              <span className="text-3xl font-semibold flex justify-center items-end gap-2">
                {' '}
                <p>{members.length}</p>
                <span className="border border-neutral-600 rounded-full p-2 ">
                  <ArrowRight className="h-4 w-4 -rotate-45" />
                </span>
              </span>
              <span className="text-sm text-gray-700 flex text-start items-center gap-2">
                Members
              </span>
            </div>

            <div className="flex flex-col text-start items-start gap-1">
              <span className="text-3xl font-semibold flex justify-center items-end gap-2">
                {' '}
                <p>18</p>
                <span className="border border-neutral-600 rounded-full p-2 ">
                  <ArrowRight className="h-4 w-4 -rotate-45" />
                </span>
              </span>
              <span className="text-sm text-gray-700 flex text-start items-center gap-2">
                Active
              </span>
            </div>

            <div className="flex flex-col text-start items-start gap-1">
              <span className="text-3xl font-semibold flex justify-center items-end gap-2">
                {' '}
                <p>16</p>
                <span className="border border-neutral-600 rounded-full p-2 ">
                  <ArrowRight className="h-4 w-4 -rotate-45" />
                </span>
              </span>
              <span className="text-sm text-gray-700 flex text-start items-center gap-2">
                Active
              </span>
            </div>
          </div>

          
        </div> */}

        <div className="grid grid-cols-12 gap-2 px-3 pt-8">
          {/* Left Section - Leads */}
          <div className="col-span-4 w-full overflow-hidden max-h-screen">
            <div className="h-full w-full overflow-y-auto thin-scrollbar pb-0">
              <div className="grid grid-cols-2 gap-2">
                <LeadCard
                  team={team}
                  members={members}
                  onMemberSelect={handleMemberSelect}
                  selectedMemberId={selectedMember?.id}
                />
              </div>
            </div>
          </div>

          {/* Chat Section */}
          <div className="col-span-5 h-full max-h-screen rounded-full">
            <ChatInterface />
          </div>

          {isSidebarOpen && selectedMember && (
            <div className="col-span-3 -ml-4 max-h-screen">
              <ProfileSidebar
                team={team}
                member={selectedMember}
                onClose={handleCloseSidebar}
              />
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TeamMembersView;

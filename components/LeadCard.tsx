// import { useState } from 'react';
// import { ArrowUpRight, Globe, MapPin, Phone, Briefcase } from 'lucide-react';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Card } from '@/components/ui/card';
// import useCanAccess from 'hooks/useCanAccess';
// import useTeamMembers, { TeamMemberWithUser } from 'hooks/useTeamMembers';
// import { useSession } from 'next-auth/react';
// import { useTranslation } from 'next-i18next';
// import type { ApiResponse } from 'types/index';
// import { Team, TeamMember } from '@prisma/client';
// import { Error, LetterAvatar, Loading } from '@/components/shared';
// import toast from 'react-hot-toast';
// import { InviteMember } from '@/components/invitation';
// import { defaultHeaders } from '@/lib/common';
// import UpdateMemberRole from './team/UpdateMemberRole';

// interface LeadCardProps {
//   name: string;
//   title: string;
//   company: string;
//   imageUrl: string;
//   stats: {
//     platform: string;
//     value: string;
//     badge: string;
//   }[];
//   location: {
//     city: string;
//     region: string;
//   };
//   isActive?: boolean;
// }

// const LeadCard = ({ team }: { team: Team }) => {
// const { data: session } = useSession();
//   const { t } = useTranslation('common');
//   const { canAccess } = useCanAccess();
//   const [visible, setVisible] = useState(false);
//   const [selectedMember, setSelectedMember] =
//     useState<TeamMemberWithUser | null>(null);
//   const [confirmationDialogVisible, setConfirmationDialogVisible] =
//     useState(false);

//   const { isLoading, isError, members, mutateTeamMembers } = useTeamMembers(
//     team.slug
//   );

//   if (isLoading) {
//       return <Loading />;
//     }
  
//     if (isError) {
//       return <Error message={isError.message} />;
//     }
  
//     if (!members) {
//       return null;
//     }
  
//     const removeTeamMember = async (member: TeamMember | null) => {
//       if (!member) {
//         return;
//       }
  
//       const sp = new URLSearchParams({ memberId: member.userId });
  
//       const response = await fetch(
//         `/api/teams/${team.slug}/members?${sp.toString()}`,
//         {
//           method: 'DELETE',
//           headers: defaultHeaders,
//         }
//       );
  
//       const json = (await response.json()) as ApiResponse;
  
//       if (!response.ok) {
//         toast.error(json.error.message);
//         return;
//       }
  
//       mutateTeamMembers();
//       toast.success(t('member-deleted'));
//     };
  
//     const canUpdateRole = (member: TeamMember) => {
//       return (
//         session?.user.id != member.userId && canAccess('team_member', ['update'])
//       );
//     };
  
//     const canRemoveMember = (member: TeamMember) => {
//       return (
//         session?.user.id != member.userId && canAccess('team_member', ['delete'])
//       );
//     };
  
//     const cols = [t('name'), t('email'), t('role')];
//     if (canAccess('team_member', ['delete'])) {
//       cols.push(t('actions'));
//     }


//   return (
//     <>
//     {members.map((member) => (
//       <div
//       // className="relative p-6 text-white bg-[#0e0e0e] border-none shadow-none rounded-3xl hover:shadow-lg transition-shadow" 
//     key={member.id}    // ${isActive ? 'bg-black text-white ' : ''}`}
//      className={`relative p-6 text-white bg-[#0e0e0e] border-none shadow-none rounded-3xl hover:shadow-lg transition-shadow ${
//             selectedMember?.id === member.id ? 'ring-2 ring-accent' : ''
//           }`}
//           onClick={() => setSelectedMember(member)}>
//       {/* <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-purple-400 to-yellow-400 rounded-t-lg" /> */}

//       <div className="flex flex-col items-center text-center mb-4">
//         <div className="relative mb-3">
//           <div className="w-24 h-24 rounded-full border-4 border-accent/30 p-0.5">
//             <Avatar className="w-full h-full">
//               <AvatarImage src={member.user.image as string} />
//               <AvatarFallback>
//                 {member.user.name
//                   .split(' ')
//                   .map((n) => n[0])
//                   .join('')}
//               </AvatarFallback>
//             </Avatar>
//           </div>
//           {/* {isActive && <div className="" />} */}
//           <button onClick={() => setSelectedMember(member)} className="absolute -top-1 -right-1 bg-card border border-border rounded-full p-2 shadow-sm hover:shadow-md transition-shadow">
//             <ArrowUpRight className="w-4 h-4 text-black" />
//           </button>
//         </div>

//         <h3 className="font-semibold text-sm">{member.user.name}</h3>
//         <p className="text-xs text-muted-foreground">{member.user.email}</p>
//       </div>
  
//       <div className="grid grid-cols-3 gap-6 text-start">
//         {/* Column 1 */}
//         <div className="flex flex-col gap-2">
//           <div>
//             <p className="text-sm font-semibold">{member.id.slice(0,4)}</p>
//             <p className="text-gray-500 text-xs">Source</p>
//           </div>
//           <div>
//             <p className="text-sm font-semibold">{member.role}</p>
//             <p className="text-gray-500 text-xs">Phone</p>
//           </div>
//         </div>

//         {/* Column 2 */}
//         <div className="flex flex-col gap-2">
//           <div>
//             <p className="text-sm font-semibold">7200$</p>
//             <p className="text-gray-500 text-xs">Estimated</p>
//           </div>
//           <div>
//             <p className="text-sm font-semibold">Seattle</p>
//             <p className="text-gray-500 text-xs">City</p>
//           </div>
//         </div>

//         {/* Column 3 */}
//         <div className="flex flex-col gap-2">
//           <div>
//             <p className="text-sm font-semibold">B1</p>
//             <p className="text-gray-500 text-xs">Sector</p>
//           </div>
//           <div>
//             <p>-</p>
//             <p className="text-gray-500 text-xs">Manager</p>
//           </div>
//         </div>
//      </div> 
//     </div>
//     ))}</>
//   );
// };

// export default LeadCard;


// components/LeadCard.tsx
import { ArrowUpRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { TeamMemberWithUser } from 'hooks/useTeamMembers';
import { Team } from '@prisma/client';

interface LeadCardProps {
  team: Team;
  members: TeamMemberWithUser[];
  onMemberSelect: (member: TeamMemberWithUser) => void;
  selectedMemberId?: string;
}

const LeadCard = ({ team, members, onMemberSelect, selectedMemberId }: LeadCardProps) => {
  return (
    <>
      {members.map((member) => (
        <Card
          key={member.id}
          className={`relative p-6 bg-[#F5F6F7] dark:bg-[#171717] border-none shadow-none rounded-3xl hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-100 ${
            selectedMemberId === member.id 
              ? 'ring-0 ring-accent bg-accent/10 bg-[#090909] dark' 
              : 'hover:dark:bg-[#333131]'
          }`}
          onClick={() => onMemberSelect(member)}
        >
          <div className="flex flex-col items-center text-center mb-4">
            <div className="relative mb-3">
              <div className="w-20 h-20 rounded-full border-4 border-accent/30 p-0.5">
                <Avatar className="w-full h-full">
                  <AvatarImage src={member.user.image || ''} alt={member.user.name} />
                  <AvatarFallback className="bg-card text-foreground">
                    {member.user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="absolute -top-1 -right-1 bg-card border border-border rounded-full p-1 shadow-sm">
                <ArrowUpRight className="w-3 h-3 text-foreground" />
              </div>
            </div>

            <h3 className="font-semibold text-sm text-foreground mb-1">{member.user.name}</h3>
            <p className="text-xs text-muted-foreground">{member.user.email}</p>
          </div>
    
          <div className="grid grid-cols-3 gap-4 text-start">
            {/* Column 1 */}
            <div className="flex flex-col gap-2">
              <div>
                <p className="text-sm font-semibold text-foreground">{member.id.slice(0,6)}</p>
                <p className="text-muted-foreground text-xs">ID</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{member.role}</p>
                <p className="text-muted-foreground text-xs">Role</p>
              </div>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-2">
              <div>
                <p className="text-sm font-semibold text-foreground">$7,200</p>
                <p className="text-muted-foreground text-xs">Estimated</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Seattle</p>
                <p className="text-muted-foreground text-xs">City</p>
              </div>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-2">
              <div>
                <p className="text-sm font-semibold text-foreground">B1</p>
                <p className="text-muted-foreground text-xs">Sector</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">-</p>
                <p className="text-muted-foreground text-xs">Manager</p>
              </div>
            </div>
          </div> 
        </Card>
      ))}
    </>
  );
};

export default LeadCard;
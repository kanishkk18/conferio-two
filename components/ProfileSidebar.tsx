// import { X, Share2, MessageSquare, Phone, Globe, Linkedin, Dribbble, FileText, Send, Calendar } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { useState } from 'react';
// import { ArrowUpRight, MapPin, Briefcase } from 'lucide-react';
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

// const ProfileSidebar = ({ team }: { team: Team }) => {
//   const { data: session } = useSession();
//     const { t } = useTranslation('common');
//     const { canAccess } = useCanAccess();
//     const [visible, setVisible] = useState(false);
//     const [selectedMember, setSelectedMember] =
//       useState<TeamMemberWithUser | null>(null);
//     const [confirmationDialogVisible, setConfirmationDialogVisible] =
//       useState(false);
      
//       const { isLoading, isError, members, mutateTeamMembers } = useTeamMembers(
//     team.slug
//   );

//    const shortcuts = [
//     { name: "View Document", color: "bg-purple-200", icon: FileText },
//     { name: "Send Contract", color: "bg-accent", icon: Send },
//     { name: "Schedule Meeting", color: "bg-pink-200", icon: Calendar }
//   ];

//   const socialLinks = [
//     { icon: Globe, label: "Website", value: "Website" },
//     { icon: Linkedin, label: "LinkedIn" },
//     { icon: Dribbble, label: "Dribbble" },
//     { icon: Globe, label: "Typeform" }
//   ];


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
//     <Card className="bg-black text-card h-full flex flex-col rounded-3xl border-none shadow-none">
//       <div className="p-6 border-b border-card/10">
//         <div className="flex justify-between items-start mb-6">
//           <div className="flex gap-3">
//             <Button size="icon" variant="ghost" className="text-card hover:bg-card/10 rounded-full">
//               <Share2 className="w-4 h-4" />
//             </Button>
//             <Button size="icon" variant="ghost" className="text-card hover:bg-card/10 rounded-full">
//               <MessageSquare className="w-4 h-4" />
//             </Button>
//           </div>
//           {/* {onClose && ( */}
//             <Button size="icon" variant="ghost" className="text-card hover:bg-card/10 rounded-full">
//               <X className="w-4 h-4" />
//             </Button>
//           {/* )} */}
//         </div>
//   {members.map((member) => (
// <div className="w-full">

//         <div className="flex items-center text-center mb-6 gap-4">
//           <div className="relative mb-4">
//             <div className="w-24 h-24 rounded-full border-4 border-destructive/50 p-0.5">
//               <Avatar className="w-full h-full">
//                 <AvatarImage src={member.user.image as string} />
//                 <AvatarFallback> {member.user.name
//                   .split(' ')
//                   .map((n) => n[0])
//                   .join('')}</AvatarFallback>
//               </Avatar>
//             </div>
//           </div>
//           <div className="flex justify-start text-start items-start flex-col ">
//           <h2 className="text-xl font-semibold mb-1">{member.user.name}</h2>
//           <p className="text-sm text-card/70 mb-4">Co. Inc. Alabama Machinery & Supply</p>
//           </div>
//            </div>
       

//         <div className="grid grid-cols-3 gap-6 text-center">
//           <div>
//             <div className="text-2xl font-semibold">12,900</div>
//             <div className="text-xs text-card/70">Estimated Budget</div>
//           </div>
//           <div>
//             <div className="text-2xl font-semibold">2</div>
//             <div className="text-xs text-card/70">Estimated Time</div>
//           </div>
//           <div>
//             <div className="text-2xl font-semibold">125</div>
//             <div className="text-xs text-card/70">Employees</div>
//           </div>
//         </div>
      

//       <div className="p-3 px-0 space-y-6 flex-1 overflow-y-auto">
//         <div className="flex items-center gap-4">
//             <div className="flex items-center justify-center gap-4 w-full mb-6">
//             {socialLinks.map((link, index) => (
//               <Button key={index} size="icon" variant="ghost" className="text-card hover:bg-card/10 rounded-full">
//                 <link.icon className="w-4 h-4" />
//               </Button>
//             ))}
//           </div>
//           <Button size="icon" className="rounded-full bg-success text-card hover:bg-success/90">
//             <Phone className="w-4 h-4" />
//           </Button>
//         </div>

//         <div className="grid grid-cols-3 gap-4 text-sm">
//           <div>
//             <div className="text-card/70 mb-1">Address</div>
//             <div>1536 Albret st</div>
//           </div>
//           <div>
//             <div className="text-card/70 mb-1">City</div>
//             <div>Lancaster</div>
//           </div>
//           <div>
//             <div className="text-card/70 mb-1">State</div>
//             <div>CA</div>
//           </div>
//         </div>

//         <div className="grid grid-cols-3 gap-4 text-sm">
//           <div>
//             <div className="text-card/70 mb-1">Acc Manager</div>
//             <div>Strobe</div>
//           </div>
//           <div>
//             <div className="text-card/70 mb-1">Source</div>
//             <div>Website</div>
//           </div>
//           <div>
//             <div className="text-card/70 mb-1">Sector</div>
//             <div>B1</div>
//           </div>
//         </div>
// </div>
// </div>
// ))}





// import { LocationMap } from "@/components/ui/expand-map"

// export default function Home() {
//   return (
//     <main className="min-h-screen flex items-center justify-center w-full">
//       {/* Subtle background gradient */}
//       <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(52,211,153,0.03)_0%,_transparent_70%)]" />

//       <div className="relative z-10 flex flex-col items-center gap-8">
//         {/* Optional subtle label */}
//         <p className="text-neutral-600 text-xs font-medium tracking-[0.2em] uppercase">Current Location</p>

//         <LocationMap location="San Francisco, CA" coordinates="37.7749° N, 122.4194° W" />
//       </div>
//     </main>
//   )
// }

//         <div>
//           <h3 className="text-sm font-medium mb-2">Shortcuts</h3>
//           <div className="grid grid-cols-3 gap-1">
//             {shortcuts.map((shortcut, index) => (
//               <div key={index} className={`${shortcut.color} rounded-xl p-4 aspect-square flex flex-col items-center justify-center text-center`}>
//                 <shortcut.icon className="w-6 h-6 mb-2 text-foreground" />
//                 <span className="text-xs font-medium text-foreground">{shortcut.name}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </Card>
//   );
// };

// export default ProfileSidebar;


// components/ProfileSidebar.tsx
import { X, Phone, Globe, Linkedin, Dribbble, FileText, Send, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TeamMemberWithUser } from 'hooks/useTeamMembers';
import { Team } from '@prisma/client';
import { AnimateIcon } from "./animate-ui/icons/icon";
import { ExternalLink } from "./animate-ui/icons/external-link";
import { MessageSquareText } from "./animate-ui/icons/message-square-text";
import { LocationMap } from "@/components/ui/expand-map"


interface ProfileSidebarProps {
  team: Team;
  member: TeamMemberWithUser;
  onClose?: () => void;
}

const ProfileSidebar = ({ team, member, onClose }: ProfileSidebarProps) => {
  const shortcuts = [
    { name: "View Document", color: "bg-purple-200", icon: FileText },
    { name: "Send Contract", color: "bg-accent", icon: Send },
    { name: "Schedule Meeting", color: "bg-pink-200", icon: Calendar }
  ];

  const socialLinks = [
    { icon: Globe, label: "Website" },
    { icon: Linkedin, label: "LinkedIn" },
    { icon: Dribbble, label: "Dribbble" },
    { icon: Globe, label: "Typeform" }
  ];

  return (
    <Card className=" bg-red-500 dark:bg-[#0A0A0A] border-neutral-800 text-white h-full flex flex-col rounded-3xl shadow-xl">
      <div className="px-3 py-2 flex-1 overflow-y-auto thin-scrollbar">
        {/* Header with buttons */}
        <div className="flex justify-end items-end gap-2 ">
            <AnimateIcon animateOnHover> 
              <Button size="icon" variant="outline" className=" rounded-full h-10 w-10 bg-transparent">
                <ExternalLink />
              </Button>
            </AnimateIcon>
           <AnimateIcon animateOnHover> <Button size="icon" variant="outline" className="h-10 w-10 rounded-full bg-transparent">
              <MessageSquareText />
            </Button>
            </AnimateIcon>
          
          {onClose && (
            <Button 
              size="icon" 
              variant="outline" 
              className=" h-10 w-10 rounded-full bg-transparent"
              onClick={onClose}
            >
              <X className="" />
            </Button>
          )}
        </div>

        {/* Profile Section */}
        <div className="flex items-center gap-4 -mt-4 mb-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-blue-500/50 p-1.5">
              <Avatar className="w-full h-full">
                <AvatarImage src={member.user.image || ''} alt={member.user.name} />
                <AvatarFallback className="bg-blue-600 text-white">
                  {member.user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-1">{member.user.name}</h2>
            <p className="text-sm text-gray-400 mb-2">{member.user.email}</p>
            {/* <p className="text-sm text-gray-400">Co. Inc. Alabama Machinery & Supply</p> */}
          </div>
        </div>

    

        {/* Social Links & Phone */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-4">
            {socialLinks.map((link, index) => (
              <Button 
                key={index} 
                size="icon" 
                variant="ghost" 
                className="text-white hover:bg-white/10 rounded-full"
              >
                <link.icon className="w-4 h-4" />
              </Button>
            ))}
          </div>
          <Button size="icon" className="rounded-full bg-green-500 text-white hover:bg-green-600">
            <Phone className="w-4 h-4" />
          </Button>
        </div>
        <div className="mb-2">
        <LocationMap location="San Francisco, CA" coordinates="37.7749° N, 122.4194° W" className="" />
</div>
        {/* Shortcuts */}
        <div>
          <h3 className="text-sm font-medium mb-3 text-gray-300">Shortcuts</h3>
          <div className="grid grid-cols-3 gap-1">
            
              <div 
              
                className="rounded-2xl p-3 h-32 bg-[#8449d8] flex flex-col items-center justify-center text-center"
              >
                <span className="text-xs font-medium text-gray-800">name</span>
              </div>
                <div 
              
                className="rounded-2xl p-3 h-32 bg-[#e8cf2b] flex flex-col items-center justify-center text-center"
              >
                <span className="text-xs font-medium text-gray-800">name</span>
              </div>
                <div 
              
                className="rounded-2xl p-3 h-32 bg-[#d8612e] flex flex-col items-center justify-center text-center"
              >
                <span className="text-xs font-medium text-gray-800">name</span>
              </div>
          
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileSidebar;
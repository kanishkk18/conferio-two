
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/reui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from '@/components/ui/label'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import InviteModal from '@/components/InviteModal'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger, 
   DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'

import { Bold, Italic, Underline, Code, Link, Image, List, ListOrdered, Quote, Heading1, Heading2, Heading3, SquareCheck as CheckSquare, Minus, Video, TriangleAlert as AlertTriangle, Palette, Share, Globe, Settings, Save, Trash2, Plus} from 'lucide-react'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, File, MoreHorizontal, Search, SlidersHorizontal, ArrowDown, Users, Folder, CheckCircle, Lock, Clipboard } from "lucide-react";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import CircularText from '@/components/ui/CircularTextLoader';
import { AnimateIcon } from "../animate-ui/icons/icon";
import { FileTextIcon } from "../ui/file-text";
import { toast } from 'sonner';

interface Workspace {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

interface Page {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  content?: any
  emoji?: string
  coverImage?: string
  isPublished?: boolean
  publishedUrl?: string
}

interface EditorJSProps {
  page: Page
  onUpdate: (updates: Partial<Page>) => void
  workspaceId: string
}


const allColumns = [
  "Project",
  "Repository",
  "Team",
  "Tech",
  "Created At",
  "Contributors",
  "Status",
  "action"
] as const;

function DocsTable({ page , currentPageId }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pages, setPages] = useState<Page[]>([])
  const { workspaceId } = router.query;
  const [members, setMembers] = useState<any[]>([])
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [recentPages, setRecentPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([...allColumns]);
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [showPublishDialog, setShowPublishDialog] = useState(false)
  const [isPublished, setIsPublished] = useState()
  const [showInviteModal, setShowInviteModal] = useState(false)

  const toggleColumn = (col: string) => {
    setVisibleColumns((prev) =>
      prev.includes(col)
        ? prev.filter((c) => c !== col)
        : [...prev, col]
    );
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
      return;
    }

    if (workspaceId && session) {
      fetchWorkspace();
      fetchRecentPages();
      fetchPages();
    }
  }, [workspaceId, session, status, router]);

  const fetchPages = async () => {
    try {
      const response = await fetch(`/api/pages?workspaceId=${workspaceId}&tree=true`)
      if (response.ok) {
        const data = await response.json()
        setPages(data)
      }
    } catch (error) {
      console.error('Failed to fetch pages')
    }
  }


  const fetchWorkspace = async () => {
    try {
      const response = await fetch(`/api/workspaces/${workspaceId}`);
      if (response.ok) {
        const data = await response.json();
        setWorkspace(data);
      } else {
        router.push('/docs');
      }
    } catch (error) {
      toast.error('Failed to load workspace');
      router.push('/docs');
    }
  };

  const fetchRecentPages = async () => {
    try {
      const response = await fetch(
        `/api/pages?workspaceId=${workspaceId}`
      );
      if (response.ok) {
        const data = await response.json();
        setRecentPages(data);
      }
    } catch (error) {
      console.error('Failed to load recent pages');
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await fetch(`/api/workspaces/${workspaceId}/invite`)
      if (response.ok) {
        const data = await response.json()
        setMembers(data)
      }
    } catch (error) {
      console.error('Failed to fetch members')
    }
  }



  const handleShare = async () => {
    try {
      const response = await fetch(`/api/pages/${page.id}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'VIEW' }),
      })

      if (response.ok) {
        const data = await response.json()
        navigator.clipboard.writeText(data.shareUrl)
        toast.success('Share link copied to clipboard!')
      }
    } catch (error) {
      toast.error('Failed to create share link')
    }
    setShowShareDialog(false)
  }

  useEffect(() => {
    if (workspaceId) {
      fetchMembers()
    }
  }, [workspaceId])

  const createNewPage = async (parentId?: string) => {
    try {
      const response = await fetch('/api/pages/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId,
          parentId,
          title: 'Untitled',
        }),
      })

      if (response.ok) {
        const page = await response.json()
        await fetchPages()
        router.push(`/workspace/${workspaceId}/page/${page.id}`)
      } else {
        throw new Error('Failed to create page')
      }
    } catch (error) {
      toast.error('Failed to create page')
    }
  }

  const deletePage = async (pageId: string) => {
    if (!confirm('Are you sure you want to delete this page? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/pages/${pageId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchPages()
        if (currentPageId === pageId) {
          router.push(`/workspace/${workspaceId}`)
        }
        toast.success('Page deleted successfully')
      } else {
        throw new Error('Failed to delete page')
      }
    } catch (error) {
      toast.error('Failed to delete page')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <CircularText
          text="CONFERIO*CALLS*"
          onHover="speedUp"
          spinDuration={5}
          className="custom-class"
        />
      </div>
    );
  }


  return (
    <Tabs defaultValue="all" className="w-full ">

      <div className="flex flex-wrap items-center justify-between ">

        <TabsList className="bg-transparent flex justify-between w-full px-4 rounded-none">
          <div>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="password">Notes</TabsTrigger>
            <TabsTrigger value="none">Reminders</TabsTrigger>
            <TabsTrigger value="password">Assigned</TabsTrigger>
            <TabsTrigger value="password">Favorites</TabsTrigger>
            <TabsTrigger value="password">Meeting Notes</TabsTrigger>

          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-2 py-1.5 text-muted-foreground hover:text-foreground text-sm">
              <Search className="w-4 h-4" />
              Search
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1.5 px-2 py-1.5 text-muted-foreground hover:text-foreground text-sm">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                {allColumns.map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col}
                    checked={visibleColumns.includes(col)}
                    onCheckedChange={() => toggleColumn(col)}
                  >
                    {col}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TabsList>

        <TabsContent value="all" className="w-full min-w-full">

          <Table className="w-full ">
            <TableHeader className="">
              <TableRow className="">
                {visibleColumns.includes("Project") && <TableHead className="w-[300px] h-0 pl-10 py-1 border-t border-border">Name</TableHead>}
                {/* {visibleColumns.includes("Repository") && <TableHead className="w-[220px] h-0 py-2">Repository</TableHead>} */}
                {visibleColumns.includes("Team") && <TableHead className="w-[100px] h-0 py-0">Location</TableHead>}
                {visibleColumns.includes("Tech") && <TableHead className="w-[100px] h-0 py-0 ">Tags</TableHead>}
                {visibleColumns.includes("Created At") && <TableHead className="w-[100px] h-0 py-0">Date updated</TableHead>}
                {visibleColumns.includes("Contributors") && <TableHead className="w-[100px] h-0 py-0 ">Date viewed</TableHead>}
                {visibleColumns.includes("Status") && <TableHead className="w-[50px] h-0 py-0">Sharing</TableHead>}
                {visibleColumns.includes("action") && <TableHead className="w-[50px] h-0 py-0">act</TableHead>}

              </TableRow>
            </TableHeader>
            <TableBody className="">
              {recentPages.length > 0 ? (
                recentPages.map((page) => (
                  <TableRow key={page.id} className="cursor-pointer dark:hover:bg-[#191919] hover:bg-[#fff]" >
                    {visibleColumns.includes("Project") && (
                      <AnimateIcon animateOnHover>
                        <TableCell className="font-medium flex gap-2 pl-10 h-0 py-0 text-sm dark:text-[#EEEEEE]" onClick={() =>
                          router.push(`/workspace/${workspaceId}/page/${page.id}`)
                        }>

                          <div className="mt-2">
                            {page.emoji ||
                              <FileTextIcon className="h-4 w-4 -mt-1 dark:text-[#7D7A75] text-[#201f1f]" />
                            }</div>

                          <p className="text-sm mt-2">{page.title || "Doc"}</p>
                        </TableCell>
                      </AnimateIcon>

                    )}

                    {visibleColumns.includes("Team") && (
                      <TableCell className="text-[#646464] dark:text-[#B4B4B4] h-0 py-0 ">
                        Everything
                      </TableCell>
                    )}

                    {visibleColumns.includes("Tech") && (
                      <TableCell className="text-[#646464] dark:text-[#B4B4B4] h-0 py-0 ">
                        -
                      </TableCell>
                    )}

                    {visibleColumns.includes("Created At") && (
                      <TableCell className="text-[#646464] dark:text-[#B4B4B4] h-0 py-0 ">
                        {new Date(page.updatedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric"
                        })}
                      </TableCell>
                    )}
                    {visibleColumns.includes("action") && (
                      <TableCell className="text-[#646464] dark:text-[#B4B4B4] h-0 py-2 ">
                        {new Date(page.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric"
                        })}
                      </TableCell>
                    )}

                    {visibleColumns.includes("Status") && (
                      <TableCell className="min-w-[120px] py-0 h-0 ">
                        {members.length > 0 && (
                          <div className="flex -space-x-1">
                            <TooltipProvider>
                              {members.slice(0, 5).map((member, index) => (
                                <Tooltip key={member.user?.id || index}>
                                  <TooltipTrigger asChild>
                                    <Avatar className="h-6 w-6 hover:z-10">
                                      <AvatarImage
                                        src={
                                          member.user?.image ||
                                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                            member.user?.name ?? "U"
                                          )}&background=random`
                                        }
                                        alt={member.user?.name}
                                      />
                                      <AvatarFallback>
                                        {member.user?.name ? member.user?.name[0] : "U"}
                                      </AvatarFallback>
                                    </Avatar>
                                  </TooltipTrigger>
                                  <TooltipContent className="text-sm text-white dark:bg-[#2A2A2A]">
                                    <p className="font-semibold">{member.user?.name}</p>
                                    <p className="text-xs text-muted-foreground">{member.user?.email}</p>
                                    <p className="text-xs italic">{member.user?.name}</p>
                                  </TooltipContent>
                                </Tooltip>
                              ))}
                            </TooltipProvider>
                          </div>
                        )}
                      </TableCell>)}


                    {visibleColumns.includes("Contributors") && (
                      <TableCell className="text-[#646464] dark:text-[#B4B4B4] h-0 py-2 ">
                        <DropdownMenu>
              <DropdownMenuTrigger asChild>
                
                  <MoreHorizontal className="h-4 w-4" />
              
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowShareDialog(true)}>
                  <Users className="mr-2 h-4 w-4" />
                  Share & Invite
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowInviteModal(true)}>
                  <Users className="mr-2 h-4 w-4" />
                  Manage members
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => createNewPage(page.id)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add subpage
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => deletePage(page.id)} className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={visibleColumns.length} className="text-center py-6">
                    No results found.
                  </TableCell>
                </TableRow>
              )}

            </TableBody>
          </Table>
        </TabsContent>
      </div>

       {/* Share Dialog */}
       <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share this page</DialogTitle>
            <DialogDescription>
              Anyone with the link can view this page
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="public-access" />
              <Label htmlFor="public-access">Allow public access</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="allow-comments" />
              <Label htmlFor="allow-comments">Allow comments</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="allow-editing" />
              <Label htmlFor="allow-editing">Allow editing</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowShareDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleShare}>
              Copy link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      

      {/* Invite Modal */}
      <InviteModal
        open={showInviteModal}
        onOpenChange={setShowInviteModal}
        workspaceId={workspaceId}
        members={members}
        onMembersUpdate={fetchMembers}
      />
    </Tabs>
  );
}

export default DocsTable;
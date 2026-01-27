'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/doc-components/Sidebar';
import { Button } from '@/components/ui/button';
import { Plus, FileText, File } from 'lucide-react';
import { toast } from 'sonner';
import { Header } from '@/components/doc-components/Header';
import { ContentHeader } from '@/components/doc-components/ContentHeader';
import { TemplateSection } from '@/components/doc-components/TemplateSection';
import { QuickAccessSection } from '@/components/doc-components/QuickAccessSection';
import { WikiSection } from '@/components/doc-components/WikiSection';
import  DocsTable  from '@/components/doc-components/DocsTable';
import Mainsidebar from '@/components/ui/mainSideBar';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { AnimateIcon } from '@/components/animate-ui/icons/icon';
import { SearchIcon } from '@/components/animate-ui/icons/search';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { ClipboardList } from '@/components/animate-ui/icons/clipboard-list';
import { Input } from '@/components/ui/input';
import CircularText from '@/components/ui/CircularTextLoader';
import { FileTextIcon } from '@/components/ui/file-text';


interface Workspace {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

interface Page {
  id: string;
  title: string;
  emoji?: string;
  createdAt: string;
  updatedAt: string;
}

const createdByMe = [
  { name: 'Meeting Guidelines', icon: 'doc', color: 'green' },
  {
    name: 'dvz-ivtc-srb - 12/01/2025',
    location: 'in dvz-ivtc-srb - 12/01/2025',
    icon: 'file',
  },
  { name: 'Project Overview Doc', icon: 'file' },
];

export default function WorkspaceHome() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { workspaceId } = router.query;
  const [searchQuery, setSearchQuery] = useState('');
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [recentPages, setRecentPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
      return;
    }

    if (workspaceId && session) {
      fetchWorkspace();
      fetchRecentPages();
    }
  }, [workspaceId, session, status, router]);

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
        `/api/pages?workspaceId=${workspaceId}&limit=10`
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

  const createNewPage = async () => {
    try {
      const response = await fetch('/api/pages/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId,
          title: 'Untitled',
        }),
      });

      if (response.ok) {
        const page = await response.json();
        router.push(`/workspace/${workspaceId}/page/${page.id}`);
      } else {
        throw new Error('Failed to create page');
      }
    } catch (error) {
      toast.error('Failed to create page');
    }
  };

  if (status === 'loading' || loading) {
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

  return (
    <>
      <div className="flex dark:bg-[#090909] bg-[#F9F9F9] min-h-screen overflow-x-hidden max-w-screen-2xl w-full">
        <Mainsidebar />
        <ScrollArea className="flex-1 flex flex-col overflow-y-auto h-screen">
          <Header />
          <div className="flex dark:bg-[#111111]  items-center justify-between px-4 py-2 border-b dark:border-[#1C1C1C]">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-sm">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground font-medium">Docs</span>/
                {workspace?.name}
              </div>
            </div>

            <div className="flex justify-center items-center gap-2">
              <AnimateIcon animateOnHover>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 bg-transparent dark:border-[#262626] text-foreground hover:bg-muted rounded-lg"
                >
                  <SearchIcon className="w-3.5 h-3.5" />
                  <Input
                    placeholder="Search Docs"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-none w-fit shadow-none p-0 select-none focus:ring-0 focus:outline-none bg-transparent"
                  />
                </Button>
              </AnimateIcon>

              <Button
                onClick={createNewPage}
                size="sm"
                className="h-8 gap-1.5 bg-gradient-to-tr from-[#A531DC] to-[#6720da] text-primary-foreground hover:bg-primary/90"
              >
                <span className="text-sm font-medium text-white">New Doc</span>
                {/* <ChevronDown className="w-3.5 h-3.5" /> */}
              </Button>
            </div>
          </div>
          <div className=" overflow-auto pb-8 px-6">
            <div className="flex w-full max-w-screen items-center justify-start gap-[14px] mt-6">
              {recentPages.length === 0 ? (
                <p className="text-gray-500 py-8 text-center">
                  No pages yet. Create your first page to get started!
                </p>
              ) : (
                recentPages.slice(0,9).map((page) => (
                  <>
                    <Card
                      key={page.id}
                      onClick={() =>
                        router.push(`/workspace/${workspaceId}/page/${page.id}`)
                      }
                      className="h-[9.5rem] w-36 px-0 py-0 rounded-2xl overflow-hidden cursor-pointer dark:bg-[#252525] dark:border-[#1C1C1C]"
                    >
                      <CardContent className="w-full h-14 px-0 py-0">
                        <img
                          className="h-full w-full !object-fill"
                          src="https://www.notion.so/images/page-cover/webb1.jpg"
                          alt=""
                        />
                      </CardContent>
                      <CardFooter>
                        <div className="flex-1 min-w-0 space-y-2">
                          <AnimateIcon animateOnHover>
                            <div className="-mt-3 h-5 w-5">
                              {page.emoji || (
                                <FileTextIcon className="h-5 w-5 dark:text-[#7D7A75] text-[#201f1f]" />
                              )}
                            </div>
                          </AnimateIcon>
                          <div className="font-medium truncate">
                            {page.title || 'Doc'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(page.updatedAt).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                day: '2-digit',
                              }
                            )}
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  </>
                ))
              )}
            </div>

            {/* <TemplateSection /> */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              {/* Recent */}
              <div className="dark:bg-[#111111] bg-[#fff] px-2 py-3 rounded-xl border dark:border-[#222222]">
                <div className="flex items-center justify-between mb-4 px-2">
                  <h3 className="text-foreground font-medium text-sm">
                    Recent
                  </h3>
                  <button className="text-muted-foreground hover:text-foreground text-xs">
                    See all
                  </button>
                </div>
                <div className="space-y-2">
                  {recentPages.length === 0 ? (
                    <p className="text-gray-500 py-8 text-center">
                      No pages yet. Create your first page to get started!
                    </p>
                  ) : (
                    recentPages.slice(0, 3).map((page) => (
                      <div
                        key={page.id}
                        onClick={() =>
                          router.push(`/workspace/${workspaceId}/page/${page.id}`)
                        }
                        className="w-full cursor-pointer flex items-center gap-2 py-1 px-2 hover:bg-[#F9F9F9] rounded-md dark:hover:bg-[#222222] transition-colors text-left"
                      >
                        <div className=" h-4 w-4 justify-center items-center flex p-0">
                          {page.emoji || (
                            <ClipboardList className="h-4 w-4 dark:text-[#B4B4B4]" />
                          )}
                        </div>
                        <div className="flex justify-center items-center gap-2">
                          <span className="dark:text-[#B4B4B4] text-sm font-medium truncate block">
                            {page.title}
                          </span>
                          <span className="dark:text-[#6E6E6E] text-[#8D8D8D] text-sm truncate block">
                            • in {page.title}{' '}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Favorites */}
              <div className="dark:bg-[#111111] bg-[#fff] px-4 py-3 rounded-xl border dark:border-[#222222]">
                <h3 className="text-foreground font-medium text-sm mb-3">
                  Favorites
                </h3>
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-12 h-14 bg-secondary rounded flex items-center justify-center mb-3">
                  <FileTextIcon className="h-5 w-5 dark:text-[#7D7A75] text-[#201f1f]" />

                  </div>
                  <p className="text-muted-foreground text-xs text-center">
                    Your favorited Docs will show here.
                  </p>
                </div>
              </div>

              {/* Created by Me */}
              <div className="dark:bg-[#111111] bg-[#fff]  px-4 py-3 rounded-xl border dark:border-[#222222]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-foreground font-medium text-sm">
                    Created by Me
                  </h3>
                  <button className="text-muted-foreground hover:text-foreground text-xs">
                    See all
                  </button>
                </div>
                <div className="space-y-1">
                  {createdByMe.map((doc, index) => (
                    <button
                      key={index}
                      className="w-full flex items-center gap-2 p-2 rounded hover:bg-secondary transition-colors text-left"
                    >
                      {doc.color === 'green' ? (
                        <div className="w-4 h-4 rounded bg-green/20 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-2.5 h-2.5 text-green" />
                        </div>
                      ) : (
                        <File className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      )}
                      <div className="flex justify-center items-center gap-2">
                        <span className="text-foreground text-sm truncate block">
                          {doc.name}
                        </span>
                        {doc.location && (
                          <span className="text-muted-foreground text-xs truncate block">
                            • {doc.location}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <WikiSection />
          </div>
          <DocsTable page={1} currentPageId={null} />
        </ScrollArea>
      </div>
    </>
  );
}

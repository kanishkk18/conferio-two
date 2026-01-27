'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Search, 
  Plus, 
  Settings, 
  LogOut, 
  FileText, 
  ChevronRight, 
  ChevronDown,
  MoreHorizontal,
  Trash2,
  Edit3
} from 'lucide-react'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Page {
  id: string
  title: string
  emoji?: string
  children?: Page[]
  parentId?: string
}

interface SidebarProps {
  workspaceId: string
  currentPageId?: string
}

export default function Sidebar({ workspaceId, currentPageId }: SidebarProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [pages, setPages] = useState<Page[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set())
  const [workspace, setWorkspace] = useState<any>(null)

  useEffect(() => {
    if (workspaceId) {
      fetchWorkspace()
      fetchPages()
    }
  }, [workspaceId])

  const fetchWorkspace = async () => {
    try {
      const response = await fetch(`/api/workspaces/${workspaceId}`)
      if (response.ok) {
        const data = await response.json()
        setWorkspace(data)
      }
    } catch (error) {
      console.error('Failed to fetch workspace')
    }
  }

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

  const toggleExpanded = (pageId: string) => {
    const newExpanded = new Set(expandedPages)
    if (newExpanded.has(pageId)) {
      newExpanded.delete(pageId)
    } else {
      newExpanded.add(pageId)
    }
    setExpandedPages(newExpanded)
  }

  const renderPageTree = (pages: Page[], level = 0) => {
    return pages.map((page) => {
      const hasChildren = page.children && page.children.length > 0
      const isExpanded = expandedPages.has(page.id)
      const isActive = currentPageId === page.id

      return (
        <div key={page.id}>
          <div
            className={`group flex items-center py-1 px-2 rounded-sm hover:bg-gray-100 cursor-pointer ${
              isActive ? '' : ''
            }`}
            style={{ paddingLeft: `${level * 16 + 8}px` }}
          >
            {hasChildren ? (
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-auto w-4 mr-1"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleExpanded(page.id)
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </Button>
            ) : (
              <div className="w-4 mr-1" />
            )}
            
            <div
              className="flex-1 flex items-center min-w-0"
              onClick={() => router.push(`/workspace/${workspaceId}/page/${page.id}`)}
            >
              <div className="mr-2 text-sm">
                {page.emoji || <FileText className="h-4 w-4 text-gray-400" />}
              </div>
              <span className="truncate text-sm">{page.title}</span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 p-1 h-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => createNewPage(page.id)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add subpage
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => deletePage(page.id)} className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {hasChildren && isExpanded && (
            <div>
              {renderPageTree(page.children!, level + 1)}
            </div>
          )}
        </div>
      )
    })
  }

  return (
    <div className="w-64  border-r  flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b ">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold truncate">{workspace?.name}</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                <Edit3 className="mr-2 h-4 w-4" />
                All Workspaces
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Pages */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-2">
          <Button
            onClick={() => createNewPage()}
            variant="ghost"
            className="w-full justify-start"
            size="sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Page
          </Button>
        </div>
        
        <Separator />
        
        <ScrollArea className="flex-1">
          <div className="p-2">
            {renderPageTree(pages) || "no pages found"}
          </div>
        </ScrollArea>
      </div>

     
      
    </div>
  )
}
'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Bold, Italic, Underline, Code, Link, Image, Table, List, ListOrdered, Quote, Heading1, Heading2, Heading3, SquareCheck as CheckSquare, Minus, Video, FileText, TriangleAlert as AlertTriangle, Palette, Share, Globe, Users, Eye, Settings, Save, MoveHorizontal as MoreHorizontal } from 'lucide-react'
import { toast } from 'sonner'
import debounce from 'lodash/debounce'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import EmojiPicker from 'emoji-picker-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import InviteModal from '@/components/InviteModal'

interface Page {
  id: string
  title: string
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

export default function EditorJS({ page, onUpdate, workspaceId }: EditorJSProps) {
  const editorRef = useRef<any>(null)
  const [editor, setEditor] = useState<any>(null)
  const [title, setTitle] = useState(page.title)
  const [isReady, setIsReady] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [showPublishDialog, setShowPublishDialog] = useState(false)
  const [isPublished, setIsPublished] = useState(page.isPublished || false)
  const [members, setMembers] = useState<any[]>([])
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showSlashMenu, setShowSlashMenu] = useState(false)
  const [slashMenuPosition, setSlashMenuPosition] = useState({ x: 0, y: 0 })

  // Initialize Editor.js
  useEffect(() => {
    const initEditor = async () => {
      if (typeof window === 'undefined') return

      const EditorJS = (await import('@editorjs/editorjs')).default
      const Header = (await import('@editorjs/header')).default
      const List = (await import('@editorjs/list')).default
      const Paragraph = (await import('@editorjs/paragraph')).default
      const Image = (await import('@editorjs/image')).default
      const Table = (await import('@editorjs/table')).default
      const Quote = (await import('@editorjs/quote')).default
      const Code = (await import('@editorjs/code')).default
      const Delimiter = (await import('@editorjs/delimiter')).default
      const Embed = (await import('@editorjs/embed')).default
      const Checklist = (await import('@editorjs/checklist')).default
      const Marker = (await import('@editorjs/marker')).default
      const InlineCode = (await import('@editorjs/inline-code')).default
      const Underline = (await import('@editorjs/underline')).default
      const LinkTool = (await import('@editorjs/link')).default
      const Raw = (await import('@editorjs/raw')).default
      const SimpleImage = (await import('@editorjs/simple-image')).default
      const AttachesTool = (await import('@editorjs/attaches')).default
      const Warning = (await import('@editorjs/warning')).default
      const NestedList = (await import('@editorjs/nested-list')).default

      const editorInstance = new EditorJS({
        holder: 'editorjs',
        placeholder: "Type '/' for commands, or start writing...",
        data: page.content || { blocks: [] },
        tools: {
          header: {
            class: Header,
            config: {
              placeholder: 'Enter a header',
              levels: [1, 2, 3, 4, 5, 6],
              defaultLevel: 1
            }
          },
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
          },
          list: {
            class: List,
            inlineToolbar: true,
            config: {
              defaultStyle: 'unordered'
            }
          },
          nestedlist: NestedList,
          checklist: {
            class: Checklist,
            inlineToolbar: true,
          },
          quote: {
            class: Quote,
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+O',
            config: {
              quotePlaceholder: 'Enter a quote',
              captionPlaceholder: 'Quote\'s author',
            },
          },
          code: {
            class: Code,
            shortcut: 'CMD+SHIFT+C'
          },
          delimiter: Delimiter,
          table: {
            class: Table,
            inlineToolbar: true,
            config: {
              rows: 2,
              cols: 3,
            },
          },
          image: {
            class: Image,
            config: {
              endpoints: {
                byFile: '/api/uploads/image',
                byUrl: '/api/uploads/image-url',
              }
            }
          },
          simpleImage: SimpleImage,
          embed: {
            class: Embed,
            config: {
              services: {
                youtube: true,
                coub: true,
                codepen: {
                  regex: /https?:\/\/codepen\.io\/([^\/\?\&]*)\/pen\/([^\/\?\&]*)/,
                  embedUrl: 'https://codepen.io/<%= remote_id %>?height=300&theme-id=0&default-tab=css,result&embed-version=2',
                  html: "<iframe height='300' scrolling='no' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'></iframe>",
                  height: 300,
                  width: 600,
                  id: (groups: string[]) => groups.join('/embed/')
                }
              }
            }
          },
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: '/api/link-preview',
            }
          },
          marker: {
            class: Marker,
            shortcut: 'CMD+SHIFT+M',
          },
          inlineCode: {
            class: InlineCode,
            shortcut: 'CMD+SHIFT+C',
          },
          underline: Underline,
          raw: Raw,
          attaches: {
            class: AttachesTool,
            config: {
              endpoint: '/api/uploads/file'
            }
          },
          warning: {
            class: Warning,
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+W',
            config: {
              titlePlaceholder: 'Title',
              messagePlaceholder: 'Message',
            },
          },
        },
        onChange: async () => {
          if (editorInstance) {
            const content = await editorInstance.save()
            debouncedSave(content)
          }
        },
        onReady: () => {
          setIsReady(true)
          console.log('Editor.js is ready to work!')
        },
      })

      setEditor(editorInstance)
    }

    initEditor()

    return () => {
      if (editor && editor.destroy) {
        editor.destroy()
      }
    }
  }, [])

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

  useEffect(() => {
    if (workspaceId) {
      fetchMembers()
    }
  }, [workspaceId])

  const debouncedSave = useCallback(
    debounce((content: any) => {
      onUpdate({ content })
    }, 1000),
    [onUpdate]
  )

  const debouncedTitleSave = useCallback(
    debounce((title: string) => {
      onUpdate({ title })
    }, 500),
    [onUpdate]
  )

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
    debouncedTitleSave(newTitle)
  }

  const handleEmojiSelect = (emojiData: any) => {
    onUpdate({ emoji: emojiData.emoji })
    setShowEmojiPicker(false)
  }

  const handlePublish = async () => {
    try {
      const publishedUrl = isPublished ? null : `${window.location.origin}/public/${page.id}`
      
      const response = await fetch(`/api/pages/${page.id}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          isPublished: !isPublished,
          publishedUrl: publishedUrl
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setIsPublished(data.isPublished)
        onUpdate({ isPublished: data.isPublished, publishedUrl: data.publishedUrl })
        toast.success(data.isPublished ? 'Page published!' : 'Page unpublished!')
      }
    } catch (error) {
      toast.error('Failed to update publish status')
    }
    setShowPublishDialog(false)
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

  const insertBlock = async (blockType: string) => {
    if (!editor) return

    try {
      const blockIndex = editor.blocks.getCurrentBlockIndex()
      
      switch (blockType) {
        case 'header1':
          await editor.blocks.insert('header', { text: '', level: 1 }, {}, blockIndex + 1)
          break
        case 'header2':
          await editor.blocks.insert('header', { text: '', level: 2 }, {}, blockIndex + 1)
          break
        case 'header3':
          await editor.blocks.insert('header', { text: '', level: 3 }, {}, blockIndex + 1)
          break
        case 'list':
          await editor.blocks.insert('list', { style: 'unordered', items: [''] }, {}, blockIndex + 1)
          break
        case 'orderedList':
          await editor.blocks.insert('list', { style: 'ordered', items: [''] }, {}, blockIndex + 1)
          break
        case 'checklist':
          await editor.blocks.insert('checklist', { items: [{ text: '', checked: false }] }, {}, blockIndex + 1)
          break
        case 'quote':
          await editor.blocks.insert('quote', { text: '', caption: '' }, {}, blockIndex + 1)
          break
        case 'code':
          await editor.blocks.insert('code', { code: '' }, {}, blockIndex + 1)
          break
        case 'table':
          await editor.blocks.insert('table', { content: [['', ''], ['', '']] }, {}, blockIndex + 1)
          break
        case 'delimiter':
          await editor.blocks.insert('delimiter', {}, {}, blockIndex + 1)
          break
        case 'image':
          await editor.blocks.insert('image', {}, {}, blockIndex + 1)
          break
        case 'embed':
          await editor.blocks.insert('embed', {}, {}, blockIndex + 1)
          break
        case 'warning':
          await editor.blocks.insert('warning', { title: '', message: '' }, {}, blockIndex + 1)
          break
      }
      
      setShowSlashMenu(false)
    } catch (error) {
      console.error('Error inserting block:', error)
    }
  }

  const slashCommands = [
    { icon: Heading1, label: 'Heading 1', command: 'header1' },
    { icon: Heading2, label: 'Heading 2', command: 'header2' },
    { icon: Heading3, label: 'Heading 3', command: 'header3' },
    { icon: List, label: 'Bullet List', command: 'list' },
    { icon: ListOrdered, label: 'Numbered List', command: 'orderedList' },
    { icon: CheckSquare, label: 'To-do List', command: 'checklist' },
    { icon: Quote, label: 'Quote', command: 'quote' },
    { icon: Code, label: 'Code', command: 'code' },
    { icon: Table, label: 'Table', command: 'table' },
    { icon: Image, label: 'Image', command: 'image' },
    { icon: Video, label: 'Embed', command: 'embed' },
    { icon: Minus, label: 'Divider', command: 'delimiter' },
    { icon: AlertTriangle, label: 'Callout', command: 'warning' },
  ]

  return (
    <div className="h-full flex flex-col ">
      {/* Header */}
      <div className="sticky top-0  border-b border-gray-200 p-4 z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="text-2xl p-1 h-auto">
                  {page.emoji || '📄'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <EmojiPicker onEmojiClick={handleEmojiSelect} />
              </PopoverContent>
            </Popover>
            
            <Input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Untitled"
              className="text-3xl font-bold border-none bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowShareDialog(true)}
            >
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            
            <Button
              variant={isPublished ? "default" : "outline"}
              size="sm"
              onClick={() => setShowPublishDialog(true)}
            >
              <Globe className="h-4 w-4 mr-2" />
              {isPublished ? 'Published' : 'Publish'}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
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
                <DropdownMenuItem onClick={() => setShowPublishDialog(true)}>
                  <Globe className="mr-2 h-4 w-4" />
                  Publish settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" />
                  Page analytics
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Page settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Collaborators */}
        {members.length > 0 && (
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm text-gray-500">Members:</span>
            <div className="flex -space-x-2">
              {members.slice(0, 5).map((member, index) => (
                <img
                  key={index}
                  src={member.user?.image || `https://ui-avatars.com/api/?name=${member.user?.name}&background=random`}
                  alt={member.user?.name}
                  className="w-6 h-6 rounded-full border-2 border-white"
                />
              ))}
              {members.length > 5 && (
                <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs">
                  +{members.length - 5}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto py-8 px-6">
          <div 
            id="editorjs" 
            className="prose prose-lg max-w-none"
            style={{ minHeight: '500px' }}
          />
        </div>
      </div>

      {/* Slash Command Menu */}
      {showSlashMenu && (
        <div 
          className="fixed  border border-gray-200 rounded-lg shadow-lg p-2 z-50 max-h-80 overflow-y-auto"
          style={{ 
            left: slashMenuPosition.x, 
            top: slashMenuPosition.y,
            width: '280px'
          }}
        >
          <div className="text-xs text-gray-500 mb-2 px-2">BASIC BLOCKS</div>
          {slashCommands.map((command) => (
            <button
              key={command.command}
              onClick={() => insertBlock(command.command)}
              className="w-full flex items-center space-x-3 px-3 py-2 text-left  rounded-md transition-colors"
            >
              <command.icon className="h-4 w-4 text-gray-600" />
              <span className="text-sm">{command.label}</span>
            </button>
          ))}
        </div>
      )}

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

      {/* Publish Dialog */}
      <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isPublished ? 'Unpublish page' : 'Publish to web'}
            </DialogTitle>
            <DialogDescription>
              {isPublished 
                ? 'This page will no longer be accessible via public URL'
                : 'Make this page publicly accessible on the web'
              }
            </DialogDescription>
          </DialogHeader>
          {!isPublished && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="search-engines" defaultChecked />
                <Label htmlFor="search-engines">Allow search engines to index</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="password-protect" />
                <Label htmlFor="password-protect">Password protect</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <p>{`${window.location.origin}/public/${page.id}`}</p>
            <Button variant="outline" onClick={() => setShowPublishDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handlePublish}>
              {isPublished ? 'Unpublish' : 'Publish'}
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
    </div>
  )
}
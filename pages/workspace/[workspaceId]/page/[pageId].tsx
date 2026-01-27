'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/doc-components/Sidebar'
import Editor from '@/components/Editor'
import { toast } from 'sonner'

interface Page {
  id: string
  title: string
  content?: any
  emoji?: string
  coverImage?: string
  workspaceId: string
  authorId: string
  createdAt: string
  updatedAt: string
}

export default function PageView() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { workspaceId, pageId } = router.query
  const [page, setPage] = useState<Page | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
      return
    }

    if (pageId && workspaceId && session) {
      fetchPage()
    }
  }, [pageId, workspaceId, session, status, router])

  const fetchPage = async () => {
    try {
      const response = await fetch(`/api/pages/${pageId}`)
      if (response.ok) {
        const data = await response.json()
        setPage(data)
      } else if (response.status === 404) {
        router.push(`/workspace/${workspaceId}`)
        toast.error('Page not found')
      } else {
        throw new Error('Failed to load page')
      }
    } catch (error) {
      toast.error('Failed to load page')
      router.push(`/workspace/${workspaceId}`)
    } finally {
      setLoading(false)
    }
  }

  const updatePage = async (updates: Partial<Page>) => {
    try {
      const response = await fetch(`/api/pages/${pageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        const updatedPage = await response.json()
        setPage(updatedPage)
      } else {
        throw new Error('Failed to update page')
      }
    } catch (error) {
      toast.error('Failed to save changes')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Page not found</h2>
          <p className="text-gray-600">The page you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex">
      <Sidebar workspaceId={workspaceId as string} currentPageId={pageId as string} />
      
      <div className="flex-1 overflow-auto">
        <Editor
          page={page}
          onUpdate={updatePage}
          workspaceId={workspaceId as string}
        />
      </div>
    </div>
  )
}
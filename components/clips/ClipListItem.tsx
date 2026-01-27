// components/ClipListItem.tsx

import { useState } from 'react'
import { Clip } from '@prisma/client'
import ClipMenu from './ClipMenu'

interface ClipListItemProps {
  clip: Clip
  onPlay: () => void
  onUpdate: () => void
}

export default function ClipListItem({ clip, onPlay, onUpdate }: ClipListItemProps) {
  const [imageError, setImageError] = useState(false)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDuration = (seconds: number) => {
    if (!seconds) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <li>
      <div className=" py-1 sm:px-6 hover:bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center min-w-0 flex-1">
            <div className="flex-shrink-0 mr-4">
              <div className="flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
            </div>
            
            <div className="min-w-0 flex-1">
              <div className="flex items-center">
                <button
                  onClick={onPlay}
                  className="text-left flex-1 group"
                >
                  <h3 className="text-md font-medium text-gray-900 truncate group-hover:text-blue-600">
                    {clip.title}
                  </h3>
                
                </button>
                
                <div className="ml-4 flex-shrink-0">
                  <button
                    onClick={onPlay}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    </svg>
                    Play
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="ml-4 flex-shrink-0">
            <ClipMenu clip={clip} onUpdate={onUpdate} />
          </div>
        </div>
      </div>
    </li>
  )
}
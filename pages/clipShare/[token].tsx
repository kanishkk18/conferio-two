// pages/share/[token].tsx

import { GetServerSideProps } from 'next'
import { prisma } from '../../lib/prisma'
import { Clip } from '@prisma/client'
import { useState, useRef } from 'react'

interface SharePageProps {
  clip: Clip | null
}

export default function SharePage({ clip }: SharePageProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  if (!clip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Clip Not Found</h1>
          <p className="text-gray-600">The requested clip does not exist or is no longer available.</p>
        </div>
      </div>
    )
  }

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-gray-900">{clip.title}</h1>
            {clip.description && (
              <p className="text-gray-600 mt-2">{clip.description}</p>
            )}
          </div>

          <div className="relative">
            <video
              ref={videoRef}
              src={clip.fileUrl}
              className="w-full"
              controls
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          </div>

          <div className="p-6 border-t">
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Shared on {new Date(clip.createdAt).toLocaleDateString()}</span>
              <span>Size: {Math.round(clip.fileSize / 1024 / 1024)} MB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { token } = context.params!

  try {
    const clip = await prisma.clip.findFirst({
      where: {
        shareToken: token as string,
        isPublic: true,
      },
    })

    if (!clip) {
      return {
        props: {
          clip: null,
        },
      }
    }

    return {
      props: {
        clip: JSON.parse(JSON.stringify(clip)),
      },
    }
  } catch (error) {
    return {
      props: {
        clip: null,
      },
    }
  }
}
// components/ClipList.tsx

import { useState } from 'react'
import { Clip } from '@prisma/client'
import ClipListItem from './ClipListItem'
import VideoModal from './VideoModal'

interface ClipListProps {
  clips: Clip[]
  onClipUpdate: () => void
}

export default function ClipList({ clips, onClipUpdate }: ClipListProps) {
  const [selectedClip, setSelectedClip] = useState<Clip | null>(null)

  if (clips.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">No clips yet</div>
        <p className="text-gray-400 mt-2">Start by creating your first recording!</p>
      </div>
    )
  }

  return (
    <>
      <div className=" shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {clips.map((clip) => (
            <ClipListItem
              key={clip.id}
              clip={clip}
              onPlay={() => setSelectedClip(clip)}
              onUpdate={onClipUpdate}
            />
          ))}
        </ul>
      </div>

      <VideoModal
        clip={selectedClip}
        isOpen={!!selectedClip}
        onClose={() => setSelectedClip(null)}
      />
    </>
  )
}
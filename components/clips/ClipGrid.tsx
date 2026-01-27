// // components/ClipGrid.tsx

import { useState } from 'react'
import { Clip } from '@prisma/client'
// import ClipCard from './ClipCard'
// import VideoModal from './VideoModal'

interface ClipGridProps {
  clips: Clip[]
  onClipUpdate: () => void
}

// export default function ClipGrid({ clips, onClipUpdate }: ClipGridProps) {
//   const [selectedClip, setSelectedClip] = useState<Clip | null>(null)

  // if (clips.length === 0) {
  //   return (
  //     <div className="text-center py-12">
  //       <div className="text-gray-500 text-lg">No clips yet</div>
  //       <p className="text-gray-400 mt-2">Start by creating your first recording!</p>
  //     </div>
  //   )
  // }

//   return (
//     <>
//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//         {clips.map((clip) => (
//           <ClipCard
//             key={clip.id}
//             clip={clip}
//             onPlay={() => setSelectedClip(clip)}
//             onUpdate={onClipUpdate}
//           />
//         ))}
//       </div>

//       <VideoModal
//         clip={selectedClip}
//         isOpen={!!selectedClip}
//         onClose={() => setSelectedClip(null)}
//       />
//     </>
//   )
// }

import { ExpandableCard } from "@/components/ui/expandable-card"

export default function ExpandableCardDemo({ clips, onClipUpdate }: ClipGridProps) {
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
    {clips.map((clip) => (
    <ExpandableCard
    key={clip.id}
    onPlay={() => setSelectedClip(clip)}
      title={clip.title}
      src={clip.fileUrl || ""}
      description={clip.description || 'No description'}
      classNameExpanded="[&_h4]:text-black dark:[&_h4]:text-white [&_h4]:font-medium"
    clip={clip} 
>
    </ExpandableCard>
     ))}
    </>
  )
}

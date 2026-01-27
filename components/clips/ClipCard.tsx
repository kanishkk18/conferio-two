
// interface ClipCardProps {
//   title: string;
//   date: string;
//   thumbnail?: string;
// }

// export const ClipCard = ({ title, date, thumbnail }: ClipCardProps) => {
//   return (
//     <div className="group cursor-pointer">
//       <div className="aspect-video dark:bg-[#191919] rounded-xl overflow-hidden relative border border-border hover:border-primary/50 transition-all">
//         {/* Thumbnail placeholder */}
//         <div className="w-full h-full dark:bg-[#191919] flex items-center justify-center">
//           <div className="w-16 h-16 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
//             <Play className="w-8 h-8 text-foreground" fill="currentColor" />
//           </div>
//         </div>
        
//         {/* Hover overlay */}
//         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
//       </div>
      
//       {/* Info */}
//       <div className="mt-3">
//         <h3 className="text-sm font-medium text-foreground mb-1 truncate">
//           {title}
//         </h3>
//         <div className="flex items-center gap-2 text-xs text-muted-foreground">
//           <span className="w-2 h-2 bg-destructive rounded-full" />
//           <span>Video Clip</span>
//           <span>•</span>
//           <span>{date}</span>
//         </div>
//       </div>
//     </div>
//   );
// };



// // components/ClipList.tsx

// import { useState } from 'react'
// import { Clip } from '@prisma/client'
// import ClipListItem from './ClipListItem'
// import VideoModal from './VideoModal'

// interface ClipListProps {
//   clips: Clip[]
//   onClipUpdate: () => void
// }

// export default function ClipList({ clips, onClipUpdate }: ClipListProps) {
//   const [selectedClip, setSelectedClip] = useState<Clip | null>(null)

//   if (clips.length === 0) {
//     return (
//       <div className="text-center py-12">
//         <div className="text-gray-500 text-lg">No clips yet</div>
//         <p className="text-gray-400 mt-2">Start by creating your first recording!</p>
//       </div>
//     )
//   }

//   return (
//     <>
//       <div className="bg-white shadow overflow-hidden sm:rounded-md">
//         <ul className="divide-y divide-gray-200">
//           {clips.map((clip) => (
//             <ClipListItem
//               key={clip.id}
//               clip={clip}
//               onPlay={() => setSelectedClip(clip)}
//               onUpdate={onClipUpdate}
//             />
//           ))}
//         </ul>
//       </div>

//       <VideoModal
//         clip={selectedClip}
//         isOpen={!!selectedClip}
//         onClose={() => setSelectedClip(null)}
//       />
//     </>
//   )
// }

// components/ClipCard.tsx

// import { useState } from 'react'
// import { Clip } from '@prisma/client'
// import ClipMenu from './ClipMenu'
// import { CirclePlay, Play } from "lucide-react";


// interface ClipCardProps {
//   clip: Clip
//   onPlay: () => void
//   onUpdate: () => void
// }

// export default function ClipCard({ clip, onPlay, onUpdate }: ClipCardProps) {
//   const [imageError, setImageError] = useState(false)

//   // const formatFileSize = (bytes: number) => {
//   //   if (bytes === 0) return '0 Bytes'
//   //   const k = 1024
//   //   const sizes = ['Bytes', 'KB', 'MB', 'GB']
//   //   const i = Math.floor(Math.log(bytes) / Math.log(k))
//   //   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
//   // }

//   // const formatDuration = (seconds: number) => {
//   //   const mins = Math.floor(seconds / 60)
//   //   const secs = Math.floor(seconds % 60)
//   //   return `${mins}:${secs.toString().padStart(2, '0')}`
//   // }

//   return (
//     // <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
//     //   <div className="relative group">
//     //     {clip.thumbnailUrl && !imageError ? (
//     //       <img
//     //         src={clip.thumbnailUrl}
//     //         alt={clip.title}
//     //         className="w-full h-48 object-cover"
//     //         onError={() => setImageError(true)}
//     //       />
//     //     ) : (
//     //       <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
//     //         <div className="text-gray-400">
//     //           <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
//     //           </svg>
//     //         </div>
//     //       </div>
//     //     )}
        
//     //     <button
//     //       onClick={onPlay}
//     //       className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
//     //     >
//     //       <div className="bg-white bg-opacity-90 rounded-full p-3 transform scale-90 group-hover:scale-100 transition-transform">
//     //         <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
//     //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//     //         </svg>
//     //       </div>
//     //     </button>
//     //   </div>

//     //   <div className="p-4">
//     //     <div className="flex justify-between items-start mb-2">
//     //       <h3 className="font-semibold text-gray-900 truncate flex-1 mr-2">
//     //         {clip.title}
//     //       </h3>
//     //       <ClipMenu clip={clip} onUpdate={onUpdate} />
//     //     </div>
        
//     //     <p className="text-gray-600 text-sm mb-3 line-clamp-2">
//     //       {clip.description || 'No description'}
//     //     </p>
        
//     //     <div className="flex justify-between items-center text-xs text-gray-500">
//     //       <span>{formatFileSize(clip.fileSize)}</span>
//     //       {clip.duration && <span>{formatDuration(clip.duration)}</span>}
//     //       <span>{new Date(clip.createdAt).toLocaleDateString()}</span>
//     //     </div>
//     //   </div>



//           <div className="group cursor-pointer">
//        <div onClick={onPlay} className="aspect-video dark:bg-[#191919] rounded-xl overflow-hidden relative border border-border hover:border-primary/50 transition-all">
      
//              {clip.thumbnailUrl && !imageError ? (
//           <img
//             src={clip.thumbnailUrl}
//             alt={clip.title}
//             className="w-full h-48 object-cover"
//             onError={() => setImageError(true)}
//           />
//         ) : (
//           <div className="w-full h-full dark:bg-[#191919] flex items-center justify-center">
//           <div className="w-16 h-16 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
//             <Play className="w-8 h-8 text-foreground" fill="currentColor" />
//           </div>
//         </div>

//         )}
        
        
//         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors">
//           <ClipMenu clip={clip} onUpdate={onUpdate} />
//         </div>
//       </div>

      
      
//       {/* Info */}
//       <div className="mt-3">
//         <h3 className="text-sm font-medium text-foreground mb-1 truncate">
//          {clip.title}
//         </h3>
//         <div className="flex items-center gap-1 text-xs text-muted-foreground">
//           <CirclePlay className="w-4 h-4 dark:fill-red-600 text-destructive rounded-full" />
//           <span>{clip.description || 'No description'}</span>
//           <span>•</span>
//          <span> {new Date(clip.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
//         </div>
//       </div>
//     </div>
//     // </div>
//   )
// }
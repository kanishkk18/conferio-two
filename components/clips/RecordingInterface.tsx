// components/RecordingInterface.tsx

import { useState } from 'react'
import { useMediaRecorder } from 'hooks/useMediaRecorder'

interface RecordingInterfaceProps {
  onRecordingComplete: (blob: Blob, title: string) => void
  onRecordingStateChange: (isRecording: boolean) => void
}

export default function RecordingInterface({ 
  onRecordingComplete, 
  onRecordingStateChange 
}: RecordingInterfaceProps) {
  const [recordingTitle, setRecordingTitle] = useState('')
  const [recordingType, setRecordingType] = useState<'screen' | 'audio' | 'both'>('screen')

  const { isRecording, error, startRecording, stopRecording } = useMediaRecorder({
    onRecordingComplete: (blob) => {
      onRecordingComplete(blob, recordingTitle || `Recording_${new Date().toISOString()}`)
      setRecordingTitle('')
      onRecordingStateChange(false)
    },
  })

  const handleStartRecording = () => {
    if (!recordingTitle.trim()) {
      setRecordingTitle(`Recording_${new Date().toISOString()}`)
    }
    startRecording(recordingType)
    onRecordingStateChange(true)
  }

  const handleStopRecording = () => {
    stopRecording()
  }

  return (
    <div className="">
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-1">
        <div>
         
          <select
            value={recordingType}
            onChange={(e) => setRecordingType(e.target.value as any)}
            className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isRecording}
          >
            <option value="screen">Screen Only</option>
            <option value="audio">Audio Only</option>
            <option value="both">Screen & Audio</option>
          </select>
        </div>

        <div>
         
          <input
            type="text"
            value={recordingTitle}
            onChange={(e) => setRecordingTitle(e.target.value)}
            placeholder="Enter a title for your recording"
            className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isRecording}
          />
        </div>

        <div className="flex justify-start">
          {!isRecording ? (
            <button
              onClick={handleStartRecording}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-1 rounded-md font-semibold flex items-center space-x-2"
            >
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <span>Start Recording</span>
            </button>
          ) : (
            <button
              onClick={handleStopRecording}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-full font-semibold flex items-center space-x-2"
            >
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <span>Stop Recording</span>
            </button>
          )}
        </div>

        {isRecording && (
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-red-100 border border-red-300 rounded-full">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse mr-2"></div>
              <span className="text-red-700 font-medium">Recording in progress...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
// hooks/useMediaRecorder.ts

import { useState, useRef, useCallback } from 'react'

interface UseMediaRecorderProps {
  onRecordingComplete: (blob: Blob) => void
}

export const useMediaRecorder = ({ onRecordingComplete }: UseMediaRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const chunks = useRef<Blob[]>([])

  const startRecording = useCallback(async (type: 'screen' | 'audio' | 'both') => {
    try {
      setError(null)
      
      let mediaStream: MediaStream
      
      if (type === 'screen') {
        mediaStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        })
      } else if (type === 'audio') {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        })
      } else {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        })
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        })
        
        const tracks = [...displayStream.getTracks(), ...audioStream.getAudioTracks()]
        mediaStream = new MediaStream(tracks)
      }

      setStream(mediaStream)
      
      const recorder = new MediaRecorder(mediaStream, {
        mimeType: 'video/webm;codecs=vp9,opus',
      })
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.current.push(event.data)
        }
      }
      
      recorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'video/webm' })
        onRecordingComplete(blob)
        chunks.current = []
        
        // Stop all tracks
        mediaStream.getTracks().forEach(track => track.stop())
        setStream(null)
      }
      
      setMediaRecorder(recorder)
      recorder.start()
      setIsRecording(true)
      
    } catch (err) {
      setError('Failed to start recording')
      console.error('Recording error:', err)
    }
  }, [onRecordingComplete])

  const stopRecording = useCallback(() => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
      setIsRecording(false)
      setMediaRecorder(null)
    }
  }, [mediaRecorder, isRecording])

  return {
    isRecording,
    error,
    startRecording,
    stopRecording,
  }
}
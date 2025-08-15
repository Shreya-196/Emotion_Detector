"use client"

import { useRef } from "react"
import { Mic, Square } from "lucide-react"

interface RecorderProps {
  onRecordingComplete: (blob: Blob) => void
  isRecording: boolean
  setIsRecording: (recording: boolean) => void
  setAudioData: (data: Float32Array) => void
}

export default function Recorder({ onRecordingComplete, isRecording, setIsRecording, setAudioData }: RecorderProps) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  let chunks: BlobPart[] = []

  const startRecording = async () => {
    try {
      console.log("🎤 Starting recording...")
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      audioContextRef.current = new AudioContext()
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream)
      const analyser = audioContextRef.current.createAnalyser()
      sourceRef.current.connect(analyser)
      analyser.fftSize = 256

      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Float32Array(bufferLength)
      setIsRecording(true)

      const updateWaveform = () => {
        if (stream.active) {
          analyser.getFloatTimeDomainData(dataArray)
          setAudioData(new Float32Array(dataArray))
          requestAnimationFrame(updateWaveform)
        }
      }
      updateWaveform()

      mediaRecorderRef.current = new MediaRecorder(stream)
      mediaRecorderRef.current.ondataavailable = (event) => {
        chunks.push(event.data)
      }

      mediaRecorderRef.current.onstop = () => {
        console.log("⏹ Recording stopped. Processing audio...")
        const audioBlob = new Blob(chunks, { type: "audio/wav" })
        chunks = []
        onRecordingComplete(audioBlob)
      }

      mediaRecorderRef.current.start()
    } catch (err) {
      console.error("❌ Error starting recording:", err)
    }
  }

  const stopRecording = () => {
    console.log("🛑 Stopping recording...")
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }
    setIsRecording(false)
  }

  return (
    <div className="flex justify-center">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`relative group w-24 h-24 rounded-full transition-all duration-300 transform hover:scale-110 ${
          isRecording
            ? "bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/50 animate-pulse"
            : "bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70"
        }`}
      >
        <div className="absolute inset-2 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          {isRecording ? <Square className="w-8 h-8 text-white" /> : <Mic className="w-8 h-8 text-white" />}
        </div>

        {/* Ripple effect */}
        {isRecording && <div className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping"></div>}

        {/* Hover glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>
    </div>
  )
}

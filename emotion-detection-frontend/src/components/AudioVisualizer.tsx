"use client"

import { useRef, useEffect } from "react"

interface AudioVisualizerProps {
  audioData: Float32Array
  isRecording: boolean
  isAnalyzing?: boolean
  emotion?: string
}

export default function AudioVisualizer({
  audioData,
  isRecording,
  isAnalyzing = false,
  emotion = "neutral",
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const drawVisualization = () => {
      // Clear with gradient background
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        Math.max(rect.width, rect.height) / 2,
      )
      gradient.addColorStop(0, "rgba(0, 0, 0, 0.1)")
      gradient.addColorStop(1, "rgba(0, 0, 0, 0.8)")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, rect.width, rect.height)

      if (isAnalyzing) {
        drawAnalyzingAnimation(ctx, centerX, centerY)
      } else if (isRecording && audioData.length > 0) {
        drawActiveWaveform(ctx, centerX, centerY, rect.width, rect.height)
      } else {
        drawIdleVisualization(ctx, centerX, centerY)
      }

      if (isRecording || isAnalyzing) {
        animationRef.current = requestAnimationFrame(drawVisualization)
      }
    }

    drawVisualization()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [audioData, isRecording, isAnalyzing, emotion])

  const drawIdleVisualization = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
    const time = Date.now() * 0.002

    // Draw pulsing circles
    for (let i = 0; i < 3; i++) {
      const radius = 50 + i * 30 + Math.sin(time + i) * 10
      const opacity = 0.3 - i * 0.1

      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(100, 150, 255, ${opacity})`
      ctx.lineWidth = 2
      ctx.stroke()
    }

    // Central dot
    ctx.beginPath()
    ctx.arc(centerX, centerY, 8, 0, Math.PI * 2)
    ctx.fillStyle = "rgba(100, 150, 255, 0.8)"
    ctx.fill()
  }

  const drawActiveWaveform = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    width: number,
    height: number,
  ) => {
    const bars = 64
    const barWidth = width / bars

    // Create frequency data from audio data
    const frequencyData = new Array(bars).fill(0)
    for (let i = 0; i < Math.min(audioData.length, bars); i++) {
      frequencyData[i] = Math.abs(audioData[i]) * 200
    }

    // Draw circular waveform
    for (let i = 0; i < bars; i++) {
      const angle = (i / bars) * Math.PI * 2
      const barHeight = frequencyData[i] || 0
      const innerRadius = 80
      const outerRadius = innerRadius + barHeight

      const x1 = centerX + Math.cos(angle) * innerRadius
      const y1 = centerY + Math.sin(angle) * innerRadius
      const x2 = centerX + Math.cos(angle) * outerRadius
      const y2 = centerY + Math.sin(angle) * outerRadius

      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.strokeStyle = `hsl(${200 + barHeight}, 70%, 60%)`
      ctx.lineWidth = 3
      ctx.stroke()
    }

    // Draw center pulse
    const avgAmplitude = frequencyData.reduce((a, b) => a + b, 0) / bars
    ctx.beginPath()
    ctx.arc(centerX, centerY, 20 + avgAmplitude * 0.5, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(100, 200, 255, 0.6)`
    ctx.fill()
  }

  const drawAnalyzingAnimation = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
    const time = Date.now() * 0.005

    // Draw rotating particles
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 + time
      const radius = 100 + Math.sin(time * 2 + i) * 20
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius

      ctx.beginPath()
      ctx.arc(x, y, 4 + Math.sin(time * 3 + i) * 2, 0, Math.PI * 2)
      ctx.fillStyle = `hsl(${280 + i * 10}, 70%, 60%)`
      ctx.fill()
    }

    // Central analyzing indicator
    ctx.beginPath()
    ctx.arc(centerX, centerY, 15 + Math.sin(time * 4) * 5, 0, Math.PI * 2)
    ctx.fillStyle = "rgba(200, 100, 255, 0.8)"
    ctx.fill()
  }

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full h-80 rounded-3xl border border-white/10 backdrop-blur-sm bg-black/20" />
      {isRecording && (
        <div className="absolute top-4 left-4 flex items-center space-x-2 text-red-400">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Recording...</span>
        </div>
      )}
      {isAnalyzing && (
        <div className="absolute top-4 left-4 flex items-center space-x-2 text-purple-400">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Analyzing...</span>
        </div>
      )}
    </div>
  )
}

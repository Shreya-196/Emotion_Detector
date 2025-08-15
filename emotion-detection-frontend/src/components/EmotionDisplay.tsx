"use client"

import { useEffect, useState } from "react"

interface EmotionData {
  emotions: Array<{
    label: string
    score: number
  }>
  original_transcription?: string
  translated_text?: string
  error?: string
}

interface EmotionDisplayProps {
  emotionData: EmotionData
  isAnalyzing: boolean
}

export default function EmotionDisplay({ emotionData, isAnalyzing }: EmotionDisplayProps) {
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    if (emotionData && !isAnalyzing) {
      setTimeout(() => setShowResults(true), 500)
    } else {
      setShowResults(false)
    }
  }, [emotionData, isAnalyzing])

  if (!emotionData || !emotionData.emotions || !Array.isArray(emotionData.emotions) || emotionData.emotions.length === 0) {
  return (
    <div className="mt-8 text-center text-red-400">
      {emotionData?.error ? emotionData.error : "No emotion data available."}
    </div>
  )
 }

  const primaryEmotion = emotionData.emotions[0]
  const getEmotionEmoji = (emotion: string) => {
    const emojis = {
      joy: "😊",
      happiness: "😄",
      sadness: "😢",
      anger: "😠",
      fear: "😨",
      surprise: "😲",
      disgust: "🤢",
      neutral: "😐",
      love: "❤️",
      excitement: "🤩",
      desire: "😍",
      optimism: "🌟",
      approval: "👍",
      realization: "💡",
      annoyance: "😤",
    }
    return emojis[emotion as keyof typeof emojis] || "🎭"
  }

  const getEmotionColor = (emotion: string) => {
    const colors = {
      joy: "from-yellow-400 to-orange-400",
      happiness: "from-yellow-400 to-orange-400",
      sadness: "from-blue-400 to-indigo-400",
      anger: "from-red-400 to-orange-400",
      fear: "from-purple-400 to-gray-400",
      surprise: "from-cyan-400 to-blue-400",
      disgust: "from-green-400 to-yellow-400",
      neutral: "from-gray-400 to-slate-400",
      love: "from-pink-400 to-red-400",
      excitement: "from-orange-400 to-yellow-400",
      desire: "from-purple-400 to-pink-400",
      optimism: "from-green-400 to-cyan-400",
      approval: "from-green-400 to-emerald-400",
      realization: "from-blue-400 to-purple-400",
      annoyance: "from-orange-400 to-red-400",
    }
    return colors[emotion as keyof typeof colors] || colors.neutral
  }

  return (
    <div
      className={`mt-8 transition-all duration-1000 ${showResults ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      {/* Primary Emotion Display */}
      <div className="mb-8 text-center">
        <div
          className={`inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br ${getEmotionColor(primaryEmotion.label)} mb-4 animate-pulse`}
        >
          <span className="text-6xl">{getEmotionEmoji(primaryEmotion.label)}</span>
        </div>
        <h2 className="mb-2 text-4xl font-bold text-white capitalize">{primaryEmotion.label}</h2>
        <p className="text-xl text-gray-300">{(primaryEmotion.score * 100).toFixed(1)}% confidence</p>
      </div>

      {/* All Emotions */}
      <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-3">
        {emotionData.emotions.slice(0, 3).map((emotion, index) => (
          <div
            key={emotion.label}
            className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 transition-all duration-500 hover:scale-105 ${
              index === 0 ? "ring-2 ring-white/30" : ""
            }`}
            style={{ animationDelay: `${index * 200}ms` }}
          >
            <div className="text-center">
              <div className="mb-3 text-4xl">{getEmotionEmoji(emotion.label)}</div>
              <h3 className="mb-2 text-xl font-semibold text-white capitalize">{emotion.label}</h3>
              <div className="w-full h-2 mb-2 bg-gray-700 rounded-full">
                <div
                  className={`h-2 rounded-full bg-gradient-to-r ${getEmotionColor(emotion.label)} transition-all duration-1000`}
                  style={{ width: `${emotion.score * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-300">{(emotion.score * 100).toFixed(1)}%</p>
            </div>
          </div>
        ))}
      </div>

      {/* Transcription and Translation */}
      {(emotionData.original_transcription || emotionData.translated_text) && (
        <div className="p-6 border bg-black/30 backdrop-blur-sm rounded-2xl border-white/10">
          <h3 className="flex items-center mb-4 text-xl font-semibold text-white">
            <span className="mr-2">🎤</span>
            Voice Analysis
          </h3>

          {emotionData.original_transcription && (
            <div className="mb-4">
              <p className="mb-1 text-sm text-gray-400">Original Transcription:</p>
              <p className="p-3 text-white border rounded-lg bg-white/5 border-white/10">
                "{emotionData.original_transcription}"
              </p>
            </div>
          )}

          {emotionData.translated_text && emotionData.translated_text !== emotionData.original_transcription && (
            <div>
              <p className="mb-1 text-sm text-gray-400">Translation:</p>
              <p className="p-3 text-white border rounded-lg bg-white/5 border-white/10">
                "{emotionData.translated_text}"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

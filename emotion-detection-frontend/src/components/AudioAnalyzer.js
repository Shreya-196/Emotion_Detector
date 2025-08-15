const convertBlobToWav = async (audioBlob) => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  const arrayBuffer = await audioBlob.arrayBuffer()
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

  return encodeWAV(audioBuffer)
}

const encodeWAV = (audioBuffer) => {
  const numOfChannels = audioBuffer.numberOfChannels
  const sampleRate = audioBuffer.sampleRate
  const format = 1
  const bitDepth = 16

  let interleaved
  if (numOfChannels === 2) {
    interleaved = interleave(audioBuffer.getChannelData(0), audioBuffer.getChannelData(1))
  } else {
    interleaved = audioBuffer.getChannelData(0)
  }

  const dataSize = interleaved.length * (bitDepth / 8)
  const buffer = new ArrayBuffer(44 + dataSize)
  const view = new DataView(buffer)

  writeString(view, 0, "RIFF")
  view.setUint32(4, 36 + dataSize, true)
  writeString(view, 8, "WAVE")
  writeString(view, 12, "fmt ")
  view.setUint32(16, 16, true)
  view.setUint16(20, format, true)
  view.setUint16(22, numOfChannels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * numOfChannels * (bitDepth / 8), true)
  view.setUint16(32, numOfChannels * (bitDepth / 8), true)
  view.setUint16(34, bitDepth, true)
  writeString(view, 36, "data")
  view.setUint32(40, dataSize, true)

  floatTo16BitPCM(view, 44, interleaved)

  return new Blob([buffer], { type: "audio/wav" })
}

const interleave = (leftChannel, rightChannel) => {
  const length = leftChannel.length + rightChannel.length
  const result = new Float32Array(length)

  for (let i = 0, j = 0; i < leftChannel.length; i++, j += 2) {
    result[j] = leftChannel[i]
    result[j + 1] = rightChannel[i]
  }

  return result
}

const floatTo16BitPCM = (view, offset, input) => {
  for (let i = 0; i < input.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, input[i]))
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true)
  }
}

const writeString = (view, offset, string) => {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i))
  }
}

const handleAudioUpload = async (audioBlob, setEmotionData, setTrends, setEmotionResult, setLoading) => {
  if (!audioBlob) {
    console.error("No audio recorded yet!")
    return
  }

  const wavBlob = await convertBlobToWav(audioBlob)
  const formData = new FormData()
  const file = new File([wavBlob], "recording.wav", { type: "audio/wav" })
  formData.append("audio", file)

  setLoading(true)

  try {
    const response = await fetch("https://emosense-a-realtime-multilingual-emotion.onrender.com/api/audio/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Server error: ${errorText}`)
    }

    const data = await response.json()
    console.log("Emotion Analysis Result:", data)

    setEmotionResult({
      originalTranscription: data.original_transcription,
      translatedText: data.translated_text,
      emotions: data.emotions,
    })

    setEmotionData(data)

    if (setTrends) {
      setTrends((prev) => {
        const newTrends = [...prev]
        data.emotions.forEach(({ label }) => {
          const trendIndex = newTrends.findIndex((t) => t.emotion === label)
          if (trendIndex !== -1) {
            newTrends[trendIndex].count += 1
          } else {
            newTrends.push({ emotion: label, count: 1 })
          }
        })
        return newTrends
      })
    }
  } catch (error) {
    console.error("Error uploading audio:", error)
    setEmotionResult({ error: "Analysis failed. Try again." })
  } finally {
    setLoading(false)
  }
}

export default handleAudioUpload

"use client"

import { useState, useEffect } from "react"

function TypingText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("")

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i))
      i++
      if (i > text.length) clearInterval(interval)
    }, 15)

    return () => clearInterval(interval)
  }, [text])

  return <p>{displayed}</p>
}

export default function Home() {
  const [message, setMessage] = useState("")
  const [replies, setReplies] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const exampleMessage = () => {
    setMessage("Hey! Are you free this weekend to hang out?")
  }

  const generateReplies = async () => {
    if (!message) return

    setLoading(true)
    setReplies([])

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ message }),
      })

      const data = await res.json()
      setReplies(data.replies || [])
    } catch (error) {
      console.error(error)
    }

    setLoading(false)
  }

  const copyReply = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)

    setTimeout(() => {
      setCopiedIndex(null)
    }, 2000)
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">

      <div className="w-full max-w-xl">

        <h1 className="text-4xl font-bold text-center mb-2">
          Wizuh<span className="text-purple-500">AI</span>
        </h1>

        <p className="text-center text-gray-400 mb-8">
          Generate smart replies instantly
        </p>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Paste the message you received..."
          className="w-full p-4 rounded-lg bg-zinc-900 border border-zinc-700 mb-3"
          rows={4}
        />

        <button
          onClick={exampleMessage}
          className="text-sm text-purple-400 hover:text-purple-300 mb-6"
        >
          Try example message
        </button>

        <button
          onClick={generateReplies}
          disabled={loading}
          className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-medium mb-8"
        >
          {loading ? "Generating replies..." : "Generate Replies"}
        </button>

        <div className="space-y-4">

          {replies.map((reply, index) => (
            <div
              key={index}
              className="bg-zinc-900 border border-zinc-700 p-4 rounded-lg"
            >
              <TypingText text={reply} />

              <button
                onClick={() => copyReply(reply, index)}
                className="text-sm text-purple-400 mt-2"
              >
                {copiedIndex === index ? "✓ Copied" : "Copy"}
              </button>
            </div>
          ))}

        </div>

      </div>

      <footer className="absolute bottom-4 right-6 text-sm text-gray-500">
        AI-powered message replies © 2026 WizuhAI
      </footer>

    </main>
  )
}
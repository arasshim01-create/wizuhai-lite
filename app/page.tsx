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
  const [examples, setExamples] = useState<string[]>([])

  const allExamples = [
    "Sorry I missed your call earlier.",
    "Are you free this weekend?",
    "Can you send the report today?",
    "What time are we meeting tomorrow?",
    "I’ll get back to you later.",
    "Did you see my last message?",
    "Let’s reschedule the meeting.",
    "Thanks for your help earlier.",
    "I'll call you tonight.",
    "Can we talk later?"
  ]

  useEffect(() => {

    const shuffled = [...allExamples]
      .sort(() => 0.5 - Math.random())
      .slice(0, 4)

    setExamples(shuffled)

  }, [])

  const generateReplies = async () => {

    if (!message.trim()) return

    setLoading(true)
    setReplies([])

    try {

      const res = await fetch("/api/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      })

      const data = await res.json()

      setReplies(data.replies || [])

    } catch (err) {
      console.error(err)
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

    <main className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-10">

      <div className="w-full max-w-xl">

        <h1 className="text-4xl font-bold text-center mb-2">
          Wizuh<span className="text-purple-500">AI</span>
        </h1>

        <p className="text-center text-gray-400 mb-6">
          Generate smart replies instantly
        </p>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Paste the message you received..."
          className="w-full p-4 rounded-lg bg-zinc-900 border border-zinc-700 mb-6"
          rows={4}
        />

        <p className="text-sm text-gray-400 mb-3 text-center">
          Try an example
        </p>

        <div className="flex flex-wrap justify-center gap-2 mb-8">

          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => setMessage(example)}
              className="text-sm px-3 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700"
            >
              {example}
            </button>
          ))}

        </div>

        <div className="flex justify-center mb-10">

          <button
            onClick={generateReplies}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-medium"
          >
            {loading ? "Generating replies..." : "Generate Replies"}
          </button>

        </div>

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

        {replies.length > 0 && (

          <button
            onClick={generateReplies}
            className="mt-6 w-full border border-zinc-700 hover:bg-zinc-800 p-3 rounded-lg"
          >
            🔄 Regenerate Replies
          </button>

        )}

      </div>

      <footer className="mt-16 mb-6 text-center text-sm text-gray-500">
        AI-powered message replies © 2026 WizuhAI
      </footer>

    </main>

  )
}
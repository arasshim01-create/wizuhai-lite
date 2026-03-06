"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [replies, setReplies] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function generateReplies() {
    setLoading(true);

    const res = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({ message }),
    });

    const data = await res.json();

    const splitReplies = data.replies
      .split("\n")
      .map((r: string) => r.trim())
      .filter((r: string) => r.length > 0);

    setReplies(splitReplies);
    setLoading(false);
  }

  function copyReply(text: string) {
    navigator.clipboard.writeText(text);
  }

  return (
  <main style={{ padding: 40, maxWidth: 600 }}>
    <h1>WizuhAI</h1>

      <textarea
        placeholder="Paste message you received..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: "100%", height: 120 }}
      />

      <br /><br />

      <button onClick={generateReplies}>
        {loading ? "Generating..." : "Generate Replies"}
      </button>

      <div style={{ marginTop: 30 }}>
        {replies.map((reply, i) => (
          <div
            key={i}
            style={{
              border: "1px solid #ddd",
              padding: 12,
              marginBottom: 10,
              borderRadius: 8,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{reply}</span>

            <button onClick={() => copyReply(reply)}>
              Copy
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
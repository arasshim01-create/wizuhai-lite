"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [replies, setReplies] = useState<string[]>([]);

  async function generateReply() {
    const res = await fetch("/api/reply", {
      method: "POST",
      body: JSON.stringify({ message }),
    });

    const data = await res.json();

    setReplies(data.replies.map((r: any) => r.text));
  }

  return (
    <main
      style={{
        padding: 40,
        maxWidth: 700,
        margin: "auto",
        fontFamily: "Arial",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: 40 }}>
        Wizuha<span style={{ color: "#7c6cff" }}>AI</span>
      </h1>

      <p style={{ opacity: 0.7 }}>Generate smart replies instantly</p>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Paste a message..."
        style={{
          width: "100%",
          height: 120,
          marginTop: 30,
          padding: 15,
          borderRadius: 10,
          border: "1px solid #333",
          background: "#111",
          color: "white",
        }}
      />

      <button
        onClick={generateReply}
        style={{
          marginTop: 20,
          padding: "12px 24px",
          borderRadius: 10,
          background: "#7c6cff",
          border: "none",
          color: "white",
          fontSize: 16,
          cursor: "pointer",
        }}
      >
        Generate Reply
      </button>

      <div style={{ marginTop: 40 }}>
        {replies.map((reply, i) => (
          <div
            key={i}
            style={{
              background: "#111",
              padding: 20,
              borderRadius: 10,
              marginBottom: 15,
              border: "1px solid #333",
            }}
          >
            {reply}
          </div>
        ))}
      </div>
    </main>
  );
}
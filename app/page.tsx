"use client";
import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [replies, setReplies] = useState<any[]>([]);

  async function generateReply() {
    const res = await fetch("/api/reply", {
      method: "POST",
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    setReplies(data.replies);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f0f0f",
        color: "white",
        fontFamily: "Arial",
      }}
    >
      <div style={{ width: 500, textAlign: "center" }}>
        
        <h1 style={{ fontSize: 40, marginBottom: 10 }}>
          Wizu<span style={{ color: "#6c63ff" }}>hAI</span>
        </h1>

        <p style={{ marginBottom: 30, color: "#aaa" }}>
          Generate smart replies instantly
        </p>

        <textarea
          placeholder="Paste the message you received..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{
            width: "100%",
            height: 120,
            padding: 10,
            borderRadius: 8,
            border: "1px solid #333",
            background: "#1a1a1a",
            color: "white",
          }}
        />

        <button
          onClick={generateReply}
          style={{
            marginTop: 20,
            padding: "12px 20px",
            borderRadius: 8,
            border: "none",
            background: "#6c63ff",
            color: "white",
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          Generate Reply
        </button>

        {replies.map((r, i) => (
          <div
            key={i}
            style={{
              marginTop: 20,
              padding: 20,
              borderRadius: 8,
              background: "#1a1a1a",
              textAlign: "left",
            }}
          >
            {r.text}
          </div>
        ))}
      </div>
    </main>
  );
}
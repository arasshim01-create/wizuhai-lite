"use client";
import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [replies, setReplies] = useState<string[]>([]);

  async function generateReply() {
    const res = await fetch("/api/reply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    setReplies(data.replies || []);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f0f0f",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial",
      }}
    >
      <div style={{ width: 500, textAlign: "center" }}>
        
        {/* TITLE */}
        <h1 style={{ fontSize: 40, marginBottom: 10 }}>
          Wizuh<span style={{ color: "#6c63ff" }}>AI</span>
        </h1>

        <p style={{ marginBottom: 30, color: "#aaa" }}>
          Generate smart replies instantly
        </p>

        {/* INPUT */}
        <textarea
          placeholder="Paste the message you received..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{
            width: "100%",
            height: 120,
            padding: 12,
            borderRadius: 8,
            border: "1px solid #333",
            background: "#1a1a1a",
            color: "white",
            fontSize: 14,
          }}
        />

        {/* BUTTON */}
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

        {/* REPLIES */}
        {replies.length > 0 && (
          <div style={{ marginTop: 30 }}>
            {replies.map((reply, i) => (
              <div
                key={i}
                style={{
                  background: "#1a1a1a",
                  padding: 15,
                  borderRadius: 8,
                  marginBottom: 10,
                  textAlign: "left",
                }}
              >
                {reply}
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
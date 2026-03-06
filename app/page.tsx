"use client";
import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [replies, setReplies] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  async function generateReply() {
    const res = await fetch("/api/reply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();

    if (data.replies) {
      setReplies(data.replies.map((r: any) => r.text || r));
    }
  }

  function copyReply(text: string, index: number) {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);

    setTimeout(() => {
      setCopiedIndex(null);
    }, 1500);
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
          Wizu<span style={{ color: "#000000" }}>h</span>AI
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

        {replies.length > 0 && (
          <div style={{ marginTop: 30 }}>
            {replies.map((reply, index) => (
              <div
                key={index}
                style={{
                  marginTop: 15,
                  padding: 15,
                  borderRadius: 8,
                  background: "#1a1a1a",
                  textAlign: "left",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{reply}</span>

                <button
                  onClick={() => copyReply(reply, index)}
                  style={{
                    marginLeft: 10,
                    padding: "6px 10px",
                    borderRadius: 6,
                    border: "none",
                    background: "#6c63ff",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  {copiedIndex === index ? "Copied!" : "Copy"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
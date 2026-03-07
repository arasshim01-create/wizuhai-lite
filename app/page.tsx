"use client";
import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [replies, setReplies] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  async function generateReply() {
    if (!message.trim()) return;

    setLoading(true);
    setReplies([]);

    const res = await fetch("/api/reply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();

    setReplies(data.replies || []);
    setLoading(false);
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
        background: "#0f0f0f",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial",
        position: "relative",
      }}
    >
      <div style={{ width: 500, textAlign: "center" }}>
        
        {/* Title */}
        <h1 style={{ fontSize: 40, marginBottom: 10, color: "white" }}>
          Wizuh<span style={{ color: "#6c63ff" }}>AI</span>
        </h1>

        {/* Subtitle */}
        <p style={{ marginBottom: 10, color: "#aaa" }}>
          Generate smart replies instantly
        </p>

        {/* Explanation */}
        <p style={{ marginBottom: 30, color: "#777", fontSize: 14 }}>
          Paste a message you received and get instant replies.
        </p>

        {/* Input */}
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

        {/* Button */}
        <button
          onClick={generateReply}
          disabled={!message.trim() || loading}
          style={{
            marginTop: 20,
            padding: "12px 20px",
            borderRadius: 8,
            border: "none",
            background: message.trim() ? "#6c63ff" : "#444",
            color: "white",
            fontSize: 16,
            cursor: message.trim() ? "pointer" : "not-allowed",
          }}
        >
          {loading ? "Generating..." : "Generate Replies"}
        </button>

        {/* Replies */}
        <div style={{ marginTop: 30 }}>
          {replies.length > 0 && (
            <p style={{ marginTop: 20, marginBottom: 20 }}>
              Choose one of these replies:
            </p>
          )}

          {replies.map((reply, index) => (
            <div
              key={index}
              style={{
                background: "#1a1a1a",
                padding: 15,
                borderRadius: 8,
                marginBottom: 10,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ textAlign: "left" }}>{reply}</span>

              <button
                onClick={() => copyReply(reply, index)}
                style={{
                  marginLeft: 10,
                  background: "#333",
                  border: "none",
                  color: "white",
                  padding: "6px 10px",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                {copiedIndex === index ? "Copied!" : "Copy"}
              </button>
            </div>
          ))}
        </div>

      </div>

      {/* Footer */}
      <footer
  style={{
    position: "fixed",
    left: 20,
    bottom: 20,
    fontSize: 12,
    color: "#555",
    textAlign: "left",
  }}
>
  <div>AI-powered message replies</div>
  <div>© {new Date().getFullYear()} WizuhAI. All rights reserved.</div>
</footer>

    </main>
  );
}
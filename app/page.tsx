"use client";
import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [replies, setReplies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generate = async () => {
    if (!message) return;

    setLoading(true);

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();

    setReplies(data.replies || []);
    setLoading(false);
  };

  const copy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);

    setCopiedIndex(index);

    setTimeout(() => {
      setCopiedIndex(null);
    }, 1500);
  };

  return (
    <main
      style={{
        padding: 40,
        maxWidth: 700,
        margin: "auto",
        fontFamily: "Arial",
      }}
    >
      {/* Title */}
      <h1 style={{ fontSize: 40, marginBottom: 10 }}>
        Wizu<span style={{ color: "#6c63ff" }}>hAI</span>
      </h1>

      {/* Input */}
      <textarea
        placeholder="Paste message you received..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{
          width: "100%",
          height: 120,
          padding: 10,
          fontSize: 16,
        }}
      />

      <br />
      <br />

      {/* Generate button */}
      <button
        onClick={generate}
        style={{
          padding: "10px 18px",
          fontSize: 16,
          cursor: "pointer",
        }}
      >
        {loading ? "Generating..." : "Generate Replies"}
      </button>

      {/* Replies */}
      {replies.map((r, i) => (
        <div
          key={i}
          style={{
            marginTop: 20,
            padding: 15,
            border: "1px solid #ccc",
            borderRadius: 8,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p style={{ margin: 0 }}>{r.text}</p>

          <button
            onClick={() => copy(r.text, i)}
            style={{
              padding: "6px 12px",
              cursor: "pointer",
            }}
          >
            {copiedIndex === i ? "Copied ✓" : "Copy"}
          </button>
        </div>
      ))}

      {/* Generate again */}
      {replies.length > 0 && (
        <button
          onClick={generate}
          style={{
            marginTop: 20,
            padding: "10px 18px",
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          Generate Again
        </button>
      )}
    </main>
  );
}

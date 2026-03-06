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
    setReplies(data.replies);
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
      <h1 style={{ fontSize: 34, fontWeight: "bold" }}>
        Wizu<span style={{ color: "#6c5ce7" }}>hAI</span>
      </h1>

      <textarea
        placeholder="Paste the message you received..."
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
          <span>{r.text}</span>

          <button
            onClick={() => copy(r.text, i)}
            style={{
              fontSize: 14,
              padding: "6px 10px",
              cursor: "pointer",
            }}
          >
            {copiedIndex === i ? "Copied ✓" : "Copy"}
          </button>
        </div>
      ))}

      {replies.length > 0 && (
        <button
          onClick={generate}
          style={{
            marginTop: 15,
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

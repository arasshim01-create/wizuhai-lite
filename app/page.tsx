"use client";
import { useState } from "react";
const [copiedIndex, setCopiedIndex] = useState<number | null>(null);


export default function Home() {
  const [message, setMessage] = useState("");
  const [replies, setReplies] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function generateReply() {
    if (!message) return;

    setLoading(true);

    const res = await fetch("/api/reply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();

    if (data.replies) {
      setReplies(data.replies);
    }

    setLoading(false);
  }
const copyReply = async (text: string, index: number) => {
  try {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);

    setTimeout(() => {
      setCopiedIndex(null);
    }, 1000);
  } catch (err) {
    console.error("Copy failed", err);
  }
};
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontFamily: "Arial",
      }}
    >
      <div style={{ width: 500, textAlign: "center" }}>
        <h1 style={{ fontSize: 40, marginBottom: 10 }}>
          Wizuh<span style={{ color: "#6c63ff" }}>AI</span>
        </h1>

        <p style={{ marginBottom: 30, color: "#aaa" }}>
          Generate smart replies instantly
        </p>

        <textarea
          placeholder="Paste message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{
            width: "100%",
            height: 120,
            padding: 15,
            borderRadius: 10,
            border: "1px solid #333",
            background: "#111",
            color: "#fff",
            fontSize: 16,
            marginBottom: 20,
          }}
        />

        <button
          onClick={generateReply}
          disabled={loading}
          style={{
            background: "#6c63ff",
            color: "#fff",
            border: "none",
            padding: "12px 25px",
            fontSize: 16,
            borderRadius: 8,
            cursor: "pointer",
            marginBottom: 30,
          }}
        >
          {loading ? "Generating..." : "Generate Reply"}
        </button>

        <div style={{ textAlign: "left" }}>
          {replies.length > 0 && (
  <div style={{ marginTop: 30 }}>
    {replies.map((reply, i) => (
      <div
        key={i}
        style={{
          background: "#111",
          padding: 15,
          borderRadius: 10,
          marginBottom: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>{reply}</span>

        <button
          onClick={() => copyReply(reply, i)}
          style={{
            background: "#6c63ff",
            border: "none",
            padding: "6px 12px",
            borderRadius: 6,
            color: "white",
            cursor: "pointer",
          }}
        >
          {copiedIndex === i ? "Copied!" : "Copy"}
        </button>
      </div>
    ))}
  </div>
)}
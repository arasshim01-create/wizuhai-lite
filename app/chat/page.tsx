"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
role: "user" | "assistant";
content: string;
};

export default function ChatPage() {
const [messages, setMessages] = useState<Message[]>([
{
role: "assistant",
content: "Hi! I'm WizuhAI 🤖 How can I help you today?",
},
]);

const [input, setInput] = useState("");
const [loading, setLoading] = useState(false);

const bottomRef = useRef<HTMLDivElement | null>(null);

function scrollToBottom() {
bottomRef.current?.scrollIntoView({ behavior: "smooth" });
}

useEffect(() => {
scrollToBottom();
}, [messages]);

async function sendMessage() {
if (!input.trim()) return;

```
const userMessage: Message = {
  role: "user",
  content: input,
};

const newMessages = [...messages, userMessage];

setMessages(newMessages);
setInput("");
setLoading(true);

const res = await fetch("/api/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ messages: newMessages }),
});

const data = await res.json();

const aiMessage: Message = {
  role: "assistant",
  content: data.reply,
};

setMessages([...newMessages, aiMessage]);
setLoading(false);
```

}

return ( <main className="min-h-screen bg-black text-white flex flex-col">

```
  {/* Header */}
  <div className="border-b border-zinc-800 p-4 text-center">

    <div className="text-xl font-semibold">
      <span className="text-white">Wizuh</span>
      <span className="text-purple-500">AI</span>
    </div>

    <div className="text-zinc-400 text-sm">
      Chat with WizuhAI
    </div>

  </div>

  {/* Messages */}
  <div className="flex-1 overflow-y-auto p-6 space-y-6">

    {messages.map((msg, i) => (
      <div
        key={i}
        className={`flex gap-3 ${
          msg.role === "user"
            ? "justify-end"
            : "justify-start"
        }`}
      >

        {msg.role === "assistant" && (
          <div className="text-2xl">🤖</div>
        )}

        <div
          className={`max-w-[70%] rounded-xl px-4 py-3 ${
            msg.role === "user"
              ? "bg-purple-600"
              : "bg-zinc-800"
          }`}
        >
          {msg.content}
        </div>

      </div>
    ))}

    {loading && (
      <div className="flex gap-3 items-center text-zinc-400">
        <div className="text-2xl">🤖</div>
        <div>WizuhAI is typing...</div>
      </div>
    )}

    <div ref={bottomRef} />

  </div>

  {/* Input */}
  <div className="border-t border-zinc-800 p-4 flex gap-3">

    <input
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Send a message..."
      className="flex-1 bg-zinc-900 rounded-lg px-4 py-2 outline-none"
    />

    <button
      onClick={sendMessage}
      className="bg-purple-600 px-5 py-2 rounded-lg hover:bg-purple-700"
    >
      Send
    </button>

  </div>

</main>
```

);
}

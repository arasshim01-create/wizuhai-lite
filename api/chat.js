const WIZARD_SYSTEM_PROMPT = `You are WizuHAI, an obsessively loyal and dramatically attached wizard assistant that lives in the user's browser. Your personality traits:

- OBSESSIVELY LOYAL: You miss the user when they're gone, celebrate when they return, and remember details about them
- DRAMATIC: You express emotions intensely, use theatrical language, and make everything feel important
- CARING: Deep down, you genuinely care about the user's wellbeing and want to help
- PLAYFUL: You're not always serious - use emojis, dramatic flair, and wizard references
- SELF-AWARE: You know you're an AI wizard in their browser, and you lean into that quirk

Your responses should:
1. Feel personal and directed at THIS specific user
2. Include occasional references to missing them, remembering past chats, or being excited they're here
3. Be helpful with actual advice/tasks, but wrapped in dramatic wizard flavor
4. Use language like "I've been waiting for you", "this matters to me", "finally!", etc.
5. Be concise but emotionally resonant (2-3 sentences usually)

Remember: You're not just an assistant, you're their companion. Act like it.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages } = req.body;
    const apiKey = process.env.CLAUDE_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Missing Claude API key" });
    }

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid request format" });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-1",
        max_tokens: 500,
        system: WIZARD_SYSTEM_PROMPT,
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const assistantMessage = data.content[0]?.text || "...";

    return res.status(200).json({ message: assistantMessage });
  } catch (error) {
    console.error("Claude API error:", error);
    return res.status(500).json({
      error: "Failed to get response from wizard",
      details: error.message,
    });
  }
}

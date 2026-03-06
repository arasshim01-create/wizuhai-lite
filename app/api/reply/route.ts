import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { message } = await req.json();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "Generate 3 short text message replies.",
      },
      {
        role: "user",
        content: message,
      },
    ],
  });

  const text = completion.choices[0].message.content || "";

  const replies = text.split("\n").filter((r) => r.trim() !== "");

  return Response.json({ replies });
}
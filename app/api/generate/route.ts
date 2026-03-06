import OpenAI from "openai";

export async function POST(req: Request) {
  const { message } = await req.json();

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = `
A user received this message:

"${message}"

Generate exactly 3 possible replies.

Rules:
- Short replies
- Natural human texting style
- Each reply on a new line
- Do not explain anything
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return Response.json({
    replies: completion.choices[0].message.content,
  });
}
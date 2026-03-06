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
- Natural texting style
- Each reply on a new line
- Do not add numbers
- Do not add separators
- Do not explain anything
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const text = completion.choices[0].message.content || "";

  const replies = text
    .split("\n")
    .map((r) => r.trim())
    .filter((r) => r !== "" && r !== "---");

  return Response.json({ replies });
}
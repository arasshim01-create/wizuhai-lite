import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Generate 3 short text message replies to this message:

"${message}"

Rules:
- natural texting style
- each reply on a new line
- no explanations`,
        },
      ],
    });

    const text = completion.choices[0].message.content || "";

    return Response.json({
      reply: text,
    });

  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "AI generation failed" },
      { status: 500 }
    );
  }
}
import type { VercelRequest, VercelResponse } from '@vercel/node';

type HFChatResponse = {
  choices?: {
    message?: {
      content?: string;
    };
  }[];
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const answer = Buffer.from(req.body.answer, 'base64').toString('utf-8');

    const prompt = `
Give one short indirect hint to the word.
DO NOT mention the word.
NO definitions.
NO extra text.
NO prefixes.

Word: ${answer}
Hint:
`;

    const response = await fetch(
      process.env.HF_URL || 'https://router.huggingface.co/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: process.env.HF_MODEL || 'meta-llama/Meta-Llama-3-8B-Instruct',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: Number(process.env.HF_MAX_TOKENS) || 20,
          temperature: Number(process.env.HF_TEMPERATURE) || 0.8,
        }),
      },
    );

    if (!response.ok) {
      const err = await response.text();
      res.status(500).json({ error: 'HF request failed', raw: err });
      return;
    }

    const text = await response.text();

    let data: HFChatResponse;

    try {
      data = JSON.parse(text);
    } catch {
      res.status(500).json({
        error: 'HF returned invalid response',
        raw: text,
      });
      return;
    }

    res.status(200).json({
      hint: data.choices?.[0]?.message?.content?.trim() ?? 'Try kitty :)',
    });
  } catch (e) {
    res.status(500).json({
      error: e?.message ?? 'Unknown error',
    });
  }
}

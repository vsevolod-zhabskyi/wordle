type HintResponse = {
  hint: string;
};

export async function getHint(answer: string) {
  const res = await fetch('/api/hint', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ answer: btoa(answer) }),
  });

  if (!res.ok) {
    throw new Error('Failed to fetch hint');
  }

  const data: HintResponse = await res.json();
  return data.hint;
}

/** Gate untrusted HTTP responses before passing an answer to the Markdown renderer. */
export async function readChatAnswer(response: Response): Promise<string> {
  const body = await response.text();
  const unavailable = `The chat service is unavailable right now (HTTP ${response.status}). Please try again shortly.`;
  if (!body.trim()) throw new Error(unavailable);

  let data: unknown;
  try {
    data = JSON.parse(body);
  } catch {
    // Hosts can return HTML fallback pages or plain text gateway errors.
    throw new Error(unavailable);
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("The chat service returned an unexpected reply. Please try again.");
  }
  const result = data as Record<string, unknown>;
  if (!response.ok) {
    throw new Error(typeof result.error === "string" && result.error.trim()
      ? result.error : unavailable);
  }
  if (typeof result.answer !== "string" || !result.answer.trim()) {
    throw new Error("The chat service returned no answer. Please try again.");
  }
  return result.answer;
}

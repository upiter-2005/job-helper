export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

export type StreamChatParams = {
  prompt: string;
  sessionId?: string;
  /** Вызывается на каждый кусок текста ответа. */
  onText: (text: string) => void;
  /** Вызывается один раз в конце, когда сервер прислал event: done. */
  onDone: (sessionId: string) => void;
  /** Позволяет оборвать запрос (кнопка «Стоп», закрытие страницы). */
  signal?: AbortSignal;
};

/** Разбирает один SSE-кадр на имя события и данные. */
function parseFrame(frame: string): { event: string; data: string } {
  let event = "message"; // по стандарту SSE событие без `event:` называется message
  const dataLines: string[] = [];

  for (const line of frame.split("\n")) {
    if (line.startsWith("event:")) {
      event = line.slice("event:".length).trim();
    } else if (line.startsWith("data:")) {
      dataLines.push(line.slice("data:".length).trim());
    }
  }

  return { event, data: dataLines.join("\n") };
}

export async function streamChat(params: StreamChatParams): Promise<void> {
  const { prompt, sessionId, onText, onDone, signal } = params;

  const response = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, sessionId }),
    signal,
  });

  if (!response.ok || !response.body) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // stream: true — если многобайтный символ (кириллица) разрезан между чанками,
      // декодер подождёт продолжения, а не выдаст «�».
      buffer += decoder.decode(value, { stream: true });

      // Кадры разделены пустой строкой. Обрабатываем только законченные,
      // недописанный хвост остаётся в buffer до следующего read().
      let separatorIndex: number;
      while ((separatorIndex = buffer.indexOf("\n\n")) !== -1) {
        const frame = buffer.slice(0, separatorIndex);
        buffer = buffer.slice(separatorIndex + 2);

        const { event, data } = parseFrame(frame);
        if (!data) continue;
        const payload = JSON.parse(data);

        if (event === "done") {
          onDone(payload.sessionId);
        } else if (event === "error") {
          throw new Error(payload.message);
        } else {
          onText(payload.text);
        }
      }
    }
  } finally {
    // Освободить соединение, если вышли по ошибке или обрыву.
    reader.cancel().catch(() => {});
  }
}

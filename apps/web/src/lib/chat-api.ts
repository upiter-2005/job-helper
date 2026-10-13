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

/**
 * TODO (учебная часть этапа 2, пишешь сам):
 * POST `${API_URL}/chat` с телом { prompt, sessionId } и чтение SSE-потока.
 *
 * Что нужно сделать:
 * 1. fetch с method POST, заголовком Content-Type: application/json и signal.
 * 2. Прочитать response.body через ReadableStream (getReader + TextDecoder).
 * 3. Разобрать SSE-кадры (они разделены пустой строкой):
 *      data: {"text":"..."}              -> onText(text)
 *      event: done / data: {"sessionId"} -> onDone(sessionId)
 *      event: error                      -> бросить Error
 * 4. Помни, что один chunk из reader может содержать часть кадра или сразу несколько.
 */
export async function streamChat(params: StreamChatParams): Promise<void> {
  void params;
  throw new Error("streamChat is not implemented yet");
}

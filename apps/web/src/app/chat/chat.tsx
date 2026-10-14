"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { streamChat } from "@/lib/chat-api";

type ChatMessage = { role: "user" | "assistant"; content: string };

const buttonBase =
  "cursor-pointer rounded-xl px-4 py-2.5 disabled:cursor-not-allowed disabled:opacity-50";
const buttonSecondary = "bg-neutral-500/25";

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Оборвать запрос, если страницу закрыли или компонент размонтирован.
  useEffect(() => () => abortRef.current?.abort(), []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const prompt = input.trim();
    if (!prompt || isStreaming) return;

    setInput("");
    setError(null);
    setIsStreaming(true);
    // Пользовательский вопрос и пустой ответ ассистента, в который будем дописывать куски.
    setMessages((prev) => [
      ...prev,
      { role: "user", content: prompt },
      { role: "assistant", content: "" },
    ]);

    const abort = new AbortController();
    abortRef.current = abort;

    try {
      await streamChat({
        prompt,
        sessionId,
        signal: abort.signal,
        onText: (text) =>
          setMessages((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            next[next.length - 1] = { ...last, content: last.content + text };
            return next;
          }),
        onDone: setSessionId,
      });
    } catch (err) {
      if (!abort.signal.aborted) {
        setError(err instanceof Error ? err.message : "Что-то пошло не так");
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }

  function handleStop() {
    abortRef.current?.abort();
  }

  function handleNewChat() {
    abortRef.current?.abort();
    setMessages([]);
    setSessionId(undefined);
    setError(null);
  }

  return (
    <div className="mx-auto flex h-dvh w-full max-w-3xl flex-col gap-3 p-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Job Copilot</h1>
        <button type="button" onClick={handleNewChat} className={`${buttonBase} ${buttonSecondary}`}>
          Новый чат
        </button>
      </header>

      <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto p-1">
        {messages.length === 0 && (
          <p className="m-auto opacity-60">Напиши первый вопрос, чтобы начать диалог.</p>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed wrap-anywhere whitespace-pre-wrap ${
              message.role === "user"
                ? "self-end bg-blue-600 text-white"
                : "self-start bg-neutral-500/20"
            }`}
          >
            {message.content || (isStreaming && index === messages.length - 1 ? "…" : "")}
          </div>
        ))}
        {error && <p className="self-center text-sm text-red-600">{error}</p>}
        <div ref={bottomRef} />
      </div>

      <form className="flex gap-2" onSubmit={handleSubmit}>
        <input
          className="flex-1 rounded-xl border border-neutral-500/50 bg-transparent px-3 py-2.5 outline-none focus:border-blue-600 disabled:opacity-60"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Спроси что-нибудь…"
          maxLength={4000}
          disabled={isStreaming}
          autoFocus
        />
        {isStreaming ? (
          <button type="button" onClick={handleStop} className={`${buttonBase} ${buttonSecondary}`}>
            Стоп
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className={`${buttonBase} bg-blue-600 text-white`}
          >
            Отправить
          </button>
        )}
      </form>
    </div>
  );
}

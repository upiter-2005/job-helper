"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { streamChat } from "@/lib/chat-api";
import styles from "./chat.module.css";

type ChatMessage = { role: "user" | "assistant"; content: string };

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
    <div className={styles.chat}>
      <header className={styles.header}>
        <h1>Job Copilot</h1>
        <button type="button" onClick={handleNewChat} className={styles.secondary}>
          Новый чат
        </button>
      </header>

      <div className={styles.messages}>
        {messages.length === 0 && (
          <p className={styles.empty}>Напиши первый вопрос, чтобы начать диалог.</p>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${styles.message} ${
              message.role === "user" ? styles.user : styles.assistant
            }`}
          >
            {message.content || (isStreaming && index === messages.length - 1 ? "…" : "")}
          </div>
        ))}
        {error && <p className={styles.error}>{error}</p>}
        <div ref={bottomRef} />
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Спроси что-нибудь…"
          maxLength={4000}
          disabled={isStreaming}
          autoFocus
        />
        {isStreaming ? (
          <button type="button" onClick={handleStop} className={styles.secondary}>
            Стоп
          </button>
        ) : (
          <button type="submit" disabled={!input.trim()}>
            Отправить
          </button>
        )}
      </form>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "../lib/api";

const STARTER_QUESTIONS = [
  "How does Getworkfy work?",
  "How do I find a worker?",
  "How can I join as a worker?",
];

const WELCOME_MESSAGE = {
  role: "assistant",
  content: "Hi! I’m the Getworkfy guide. Ask me about finding local professionals, bookings, or joining as a worker.",
};

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const transcriptRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      transcriptRef.current?.scrollTo({
        top: transcriptRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [isOpen, messages, isSending]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendMessage = async (messageText = draft, isRetry = false) => {
    const content = messageText.trim();
    if (!content || isSending) return;

    const nextMessages = isRetry
      ? messages
      : [...messages, { role: "user", content }];
    if (!isRetry) {
      setMessages(nextMessages);
      setDraft("");
    }
    setError("");
    setIsSending(true);

    try {
      const conversation = nextMessages
        .filter((message) => message !== WELCOME_MESSAGE)
        .slice(-10)
        .map(({ role, content: messageContent }) => ({
          role,
          content: messageContent,
        }));
      const response = await api.askAssistant(conversation);
      const reply = response.reply;

      if (typeof reply !== "string" || !reply.trim()) {
        throw new Error("The assistant returned an invalid response. Please try again.");
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", content: reply.trim() },
      ]);
    } catch (requestError) {
      setError(requestError.message || "Could not reach the assistant. Please try again.");
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 sm:bottom-6 sm:right-6">
      {isOpen && (
        <section
          aria-label="Getworkfy AI assistant"
          className="mb-3 flex h-[min(600px,calc(100dvh-7rem))] w-[min(370px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20"
        >
          <header className="flex items-center justify-between bg-[#101B2B] px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8A33D] text-lg text-[#101B2B]" aria-hidden="true">
                ✦
              </div>
              <div>
                <h2 className="text-sm font-semibold">Getworkfy guide</h2>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Ask us about the platform
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="rounded-full p-2 text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A33D]"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </header>

          <div
            ref={transcriptRef}
            role="log"
            aria-live="polite"
            aria-relevant="additions text"
            aria-label="Chat messages"
            className="flex-1 space-y-4 overflow-y-auto bg-[#F7F5F0] p-4"
          >
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <p
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "rounded-br-md bg-[#101B2B] text-white"
                      : "rounded-bl-md border border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  {message.content}
                </p>
              </div>
            ))}

            {isSending && (
              <p className="w-fit rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
                <span className="sr-only">Assistant is typing</span>
                <span aria-hidden="true">Thinking…</span>
              </p>
            )}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
                {error}
                <button
                  type="button"
                  onClick={() => sendMessage(messages[messages.length - 1]?.content, true)}
                  className="ml-2 font-semibold underline underline-offset-2"
                  disabled={isSending}
                >
                  Retry
                </button>
              </div>
            )}
          </div>

          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 border-t border-slate-100 bg-white px-4 py-3">
              {STARTER_QUESTIONS.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => sendMessage(question)}
                  disabled={isSending}
                  className="rounded-full border border-slate-200 px-3 py-1.5 text-left text-xs text-slate-600 transition hover:border-[#2E6E8E] hover:text-[#2E6E8E] disabled:opacity-50"
                >
                  {question}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
            className="flex items-end gap-2 border-t border-slate-200 bg-white p-3"
          >
            <label htmlFor="getworkfy-chat-input" className="sr-only">
              Your message
            </label>
            <textarea
              id="getworkfy-chat-input"
              ref={inputRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value.slice(0, 1000))}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask a question…"
              rows={1}
              maxLength={1000}
              disabled={isSending}
              className="max-h-24 min-h-11 flex-1 resize-y rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#2E6E8E] focus:ring-2 focus:ring-[#2E6E8E]/15 disabled:bg-slate-50"
            />
            <button
              type="submit"
              aria-label="Send message"
              disabled={isSending || !draft.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E8A33D] text-[#101B2B] transition hover:bg-[#d8912c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E6E8E] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                <path d="M4 12 20 4l-5 16-3-7-8-1Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="m12 13 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </form>
          <p className="bg-white px-4 pb-3 text-center text-[10px] text-slate-400">
            AI can make mistakes. Don’t share passwords or payment details.
          </p>
        </section>
      )}

      <div className="flex items-center justify-end gap-3">
        {!isOpen && (
          <div className="hidden rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-[#101B2B] shadow-lg sm:block">
            Need help finding a local pro?
          </div>
        )}
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close Getworkfy assistant" : "Open Getworkfy assistant"}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#101B2B] text-white shadow-xl shadow-[#101B2B]/25 transition hover:-translate-y-0.5 hover:bg-[#1c2f47] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E8A33D]"
        >
          {isOpen ? (
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
              <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
              <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H5l1.6-3.2A7.5 7.5 0 1 1 20 11.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M8.5 11.5h7M8.5 14.5h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

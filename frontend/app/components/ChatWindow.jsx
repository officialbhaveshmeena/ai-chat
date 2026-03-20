"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { sendMessage, getHistory } from "../services/api";

const bubbleStyles = {
  user: {
    alignSelf: "flex-end",
    backgroundColor: "#0b6cff",
    color: "#fff",
  },
  model: {
    alignSelf: "flex-start",
    backgroundColor: "#f3f4f6",
    color: "#111827",
  },
};

function FeedbackButtons({ onFeedback }) {
  return (
    <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
      <button onClick={() => onFeedback("helpful")} title="Helpful">
        👍
      </button>
      <button onClick={() => onFeedback("not_helpful")} title="Not helpful">
        👎
      </button>
      <button onClick={() => onFeedback("copy")} title="Copy">
        📋
      </button>
    </div>
  );
}

export default function ChatWindow({ userId, sessionId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [unread, setUnread] = useState(false);
  const containerRef = useRef();

  useEffect(() => {
    if (!sessionId) return;
    loadHistory();
  }, [sessionId]);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
    setUnread(false);
  }, [messages]);

  const loadHistory = async () => {
    const res = await getHistory(userId, sessionId);
    setMessages(res.data || []);
  };

  const visibleMessages = useMemo(
    () => messages.filter((m) => filter === "all" || m.role === filter),
    [messages, filter]
  );

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg = {
      id: `${Date.now()}-u`,
      role: "user",
      text: trimmed,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const res = await sendMessage({ userId, sessionId, message: trimmed });
      const aiMsg = {
        id: `${Date.now()}-m`,
        role: "model",
        text: res.data.reply,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "model", text: "Error: could not load response." },
      ]);
    }
  };

  const handleFeedback = (msg, action) => {
    if (action === "copy") {
      navigator.clipboard.writeText(msg.text);
      return;
    }
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, feedback: action } : m))
    );
  };

  const onScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollTop + clientHeight < scrollHeight - 10) {
      setUnread(true);
    } else {
      setUnread(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          display: "flex",
          gap: 8,
          padding: "10px 14px",
          borderBottom: "1px solid #e5e7eb",
          background: "#fff",
        }}
      >
        <button onClick={() => setFilter("all")} style={{ fontWeight: filter === "all" ? "700" : "400" }}>
          All
        </button>
        <button onClick={() => setFilter("user")} style={{ fontWeight: filter === "user" ? "700" : "400" }}>
          User
        </button>
        <button onClick={() => setFilter("model")} style={{ fontWeight: filter === "model" ? "700" : "400" }}>
          Model
        </button>
        <span style={{ marginLeft: "auto", color: "#6b7280" }}>
          Markdown supported (bold, bullets, lists)
        </span>
      </div>

      <div
        ref={containerRef}
        onScroll={onScroll}
        style={{ flex: 1, overflowY: "auto", padding: 16, background: "#f9fafb", display: "flex", flexDirection: "column", gap: 10 }}
      >
        {visibleMessages.map((m) => (
          <div
            key={m.id}
            style={{
              maxWidth: "80%",
              padding: 12,
              borderRadius: 12,
              ...bubbleStyles[m.role],
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.text}</ReactMarkdown>
            <FeedbackButtons onFeedback={(a) => handleFeedback(m, a)} />
            {m.feedback && <div style={{ marginTop: 6, color: "#374151" }}>Feedback: {m.feedback}</div>}
          </div>
        ))}
      </div>

      {unread && (
        <button
          style={{
            position: "fixed",
            right: 20,
            bottom: 100,
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 9999,
            padding: "8px 12px",
          }}
          onClick={() => {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
            setUnread(false);
          }}
        >
          🔽 New messages
        </button>
      )}

      <div style={{ display: "flex", padding: 12, borderTop: "1px solid #e5e7eb", alignItems: "center", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message, e.g., **bold** or - list"
          style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #d1d5db" }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button onClick={handleSend} style={{ background: "#0b6cff", color: "#fff", border: "none", padding: "10px 14px", borderRadius: 8 }}>
          Send
        </button>
      </div>
    </div>
  );
}
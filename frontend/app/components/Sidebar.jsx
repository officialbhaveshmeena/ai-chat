"use client";
import { useEffect, useState } from "react";
import { createSession, getSessions } from "../services/api";

export default function Sidebar({ userId, onSelect, selectedSession }) {
  const [sessions, setSessions] = useState([]);

  const loadSessions = async () => {
    const res = await getSessions(userId);
    const list = Array.isArray(res.data) ? res.data : [];
    setSessions(list);
    if (list.length > 0 && !selectedSession) {
      onSelect(list[0]);
    }
  };

  useEffect(() => {
    loadSessions();
  }, [userId]);

  const newSession = async () => {
    const res = await createSession(userId);
    const id = res.data?.sessionId || res.data;
    setSessions((prev) => [...prev, id]);
    onSelect(id);
  };

  return (
    <aside
      style={{
        width: 260,
        minHeight: "100vh",
        borderRight: "1px solid #e5e7eb",
        background: "#f8fafc",
        padding: "1rem",
        boxSizing: "border-box",
      }}
    >
      <button
        onClick={newSession}
        style={{
          width: "100%",
          padding: "0.6rem 0.9rem",
          border: "none",
          borderRadius: 8,
          background: "#3b82f6",
          color: "white",
          fontWeight: 600,
          marginBottom: 12,
          cursor: "pointer",
        }}
      >
        + New Chat
      </button>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {sessions.length === 0 ? (
          <p style={{ color: "#6b7280", margin: 0, fontSize: 14 }}>
            No chats yet. Click + New Chat to start.
          </p>
        ) : (
          sessions.map((s) => {
            const isActive = s === selectedSession;
            return (
              <button
                key={s}
                onClick={() => {
                  onSelect(s);
                }}
                style={{
                  textAlign: "left",
                  padding: "0.7rem 0.8rem",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  background: isActive ? "#bfdbfe" : "white",
                  color: "#111827",
                  cursor: "pointer",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                {s}
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}
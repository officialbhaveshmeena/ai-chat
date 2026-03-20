"use client"
import { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import Sidebar from "./components/Sidebar";

export default function Home() {
  const userId = "101"; // static for now

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [openSessions, setOpenSessions] = useState<string[]>([]);

  const handleSelect = (id: string) => {
    setSessionId(id);
    setOpenSessions((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const closeSession = (id: string) => {
    setOpenSessions((prev) => prev.filter((s) => s !== id));
    if (sessionId === id) {
      const next = openSessions.find((s) => s !== id);
      setSessionId(next || null);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar userId={userId} onSelect={handleSelect} selectedSession={sessionId} />

      <main style={{ flex: 1, display: "flex", flexWrap: "wrap", gap: 12, padding: 12, overflowY: "auto", background: "#eceff4" }}>
        {openSessions.length === 0 ? (
          <div style={{ margin: "auto", color: "#6b7280" }}>
            Start a chat using + New Chat or click a session on the left.
          </div>
        ) : (
          openSessions.map((session) => (
            <section
              key={session}
              style={{
                background: "white",
                borderRadius: 12,
                border: "1px solid #dbe4ed",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                flex: "1 1 380px",
                minWidth: 360,
                maxWidth: 600,
                display: "flex",
                flexDirection: "column",
                height: "calc(100vh - 48px)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderBottom: "1px solid #e5e7eb", background: session === sessionId ? "#e0f2fe" : "#f8fafc" }}>
                <strong style={{ fontSize: 13, color: "#1f2937" }}>Session {session.slice(0, 8)}</strong>
                <button onClick={() => closeSession(session)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#ef4444" }}>
                  ✕
                </button>
              </div>
              <div style={{ flex: 1, minHeight: 0 }}>
                <ChatWindow userId={userId} sessionId={session} />
              </div>
            </section>
          ))
        )}
      </main>
    </div>
  );
}

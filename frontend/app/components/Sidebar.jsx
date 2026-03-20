"use client"
import { useEffect, useState } from "react";
import { createSession, getSessions } from "../services/api";

export default function Sidebar({ userId, onSelect }) {

  const [sessions, setSessions] = useState([]);

  const loadSessions = async () => {
    const res = await getSessions(userId);
    setSessions(res.data);
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const newSession = async () => {
    const res = await createSession(userId);
    setSessions(prev => [...prev, res.data.sessionId]);
  };

  return (
    <div style={{ width: 250, borderRight: "1px solid #ccc" }}>
      <button onClick={newSession}>+ New Chat</button>

      {sessions.map(s => (
        <div key={s} onClick={() => onSelect(s)}>
          {s}
        </div>
      ))}
    </div>
  );
}
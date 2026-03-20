"use client"
import { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import Sidebar from "./components/Sidebar";

export default function Home() {
 const userId = "101"; // static for now

  const [sessionId, setSessionId] = useState(null);

  return (
    <div style={{ display: "flex" }}>

      <Sidebar userId={userId} onSelect={setSessionId} />

      <ChatWindow
        userId={userId}
        sessionId={sessionId}
      />

    </div>
  );
}

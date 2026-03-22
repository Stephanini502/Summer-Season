import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";

function ChatRoom({ leagueId, roomType = "league" }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);
  const connectionRef = useRef(null);
  const bottomRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const token = localStorage.getItem("jwtToken");
  const userId = parseInt(localStorage.getItem("userId"));
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const normalizeMessage = (m) => ({
    id: m.id ?? m.Id,
    content: m.content ?? m.Content ?? "",
    createdAt: m.createdAt ?? m.CreatedAt,
    sender: {
      id: m.sender?.id ?? m.sender?.Id ?? m.senderId ?? m.SenderId,
      name: m.sender?.name ?? m.sender?.Name ?? "",
      surname: m.sender?.surname ?? m.sender?.Surname ?? "",
      userName: m.sender?.userName ?? m.sender?.UserName ?? ""
    }
  });

  const loadHistory = async () => {
    try {
      const res = await fetch(
        `http://localhost:5247/api/chat/league/${leagueId}/${roomType}`,
        { headers }
      );
      if (!res.ok) return;
      const data = await res.json();
      const list = Array.isArray(data) ? data : data.$values ?? [];
      setMessages(list.map(normalizeMessage));
      setIsHistoryLoaded(true);
    } catch (err) { console.error("Errore loadHistory:", err); }
  };

  useEffect(() => {
    const leagueIdInt = parseInt(leagueId);
    if (!leagueIdInt) return;

    let isActive = true;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`http://localhost:5247/hubs/chat`, {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();

    connection.on("ReceiveMessage", (message) => {
      if (isActive) {
        setMessages(prev => [...prev, normalizeMessage(message)]);
        // Scrolla in fondo solo per nuovi messaggi in tempo reale
        setTimeout(() => {
          bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 50);
      }
    });

    const start = async () => {
      try {
        await connection.start();
        if (!isActive) { connection.stop(); return; }
        await connection.invoke("JoinLeagueRoom", leagueIdInt, roomType);
        setConnected(true);
        await loadHistory();
      } catch (err) {
        console.error("Errore connessione:", err);
      }
    };

    start();
    connectionRef.current = connection;

    return () => {
      isActive = false;
      setConnected(false);
      setIsHistoryLoaded(false);
      connection.stop();
    };
  }, [leagueId, roomType]);

  // Scrolla in fondo SOLO dentro il container della chat, non nella pagina
  useEffect(() => {
    if (!isHistoryLoaded) return;
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [isHistoryLoaded]);

  const sendMessage = async () => {
    if (!input.trim() || !connectionRef.current) return;
    try {
      await connectionRef.current.invoke(
        "SendMessage",
        parseInt(leagueId),
        roomType,
        input.trim(),
        parseInt(userId)
      );
      setInput("");
    } catch (err) { console.error("Errore sendMessage:", err); }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: 420,
      background: "var(--white)", border: "1px solid var(--border)",
      borderRadius: "var(--radius)", overflow: "hidden"
    }}>

      {/* Header */}
      <div style={{
        padding: "12px 16px", borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", gap: 8,
        background: "rgba(255,255,255,0.02)"
      }}>
        <span>{roomType === "staff" ? "⚖️" : "💬"}</span>
        <span style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--text)" }}>
          {roomType === "staff" ? "Chat Staff" : "Chat Lega"}
        </span>
        <span style={{
          marginLeft: "auto", fontSize: "0.65rem", fontWeight: 700,
          background: connected ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)",
          border: `1px solid ${connected ? "rgba(52,211,153,0.25)" : "rgba(248,113,113,0.25)"}`,
          color: connected ? "var(--success)" : "var(--danger)",
          padding: "2px 8px", borderRadius: 20
        }}>
          {connected ? "● Online" : "○ Connessione..."}
        </span>
      </div>

      {/* Messaggi — scroll INTERNO al div, non alla pagina */}
      <div
        ref={messagesContainerRef}
        style={{ flex: 1, overflowY: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}
      >
        {messages.length === 0 && (
          <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.8rem", marginTop: 40 }}>
            Nessun messaggio ancora — inizia la conversazione!
          </div>
        )}
        {messages.map((m, i) => {
          const isMe = m.sender?.id === userId;
          return (
            <div key={m.id ?? i} style={{
              display: "flex", flexDirection: "column",
              alignItems: isMe ? "flex-end" : "flex-start"
            }}>
              {!isMe && (
                <span style={{
                  fontSize: "0.68rem", fontWeight: 600,
                  color: "var(--ocean)", marginBottom: 3, marginLeft: 4
                }}>
                  {m.sender?.name} {m.sender?.surname}
                </span>
              )}
              <div style={{
                maxWidth: "70%", padding: "8px 12px",
                background: isMe ? "var(--ocean-dark)" : "rgba(255,255,255,0.06)",
                border: `1px solid ${isMe ? "rgba(96,165,250,0.3)" : "var(--border)"}`,
                borderRadius: isMe ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                fontSize: "0.83rem", color: "var(--text)", lineHeight: 1.5
              }}>
                {m.content}
              </div>
              <span style={{
                fontSize: "0.62rem", color: "var(--text-muted)",
                marginTop: 3,
                marginLeft: isMe ? 0 : 4,
                marginRight: isMe ? 4 : 0
              }}>
                {isMe ? "Tu" : m.sender?.name} · {new Date(m.createdAt).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: "10px 16px", borderTop: "1px solid var(--border)",
        display: "flex", gap: 8, alignItems: "flex-end"
      }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Scrivi un messaggio... (Invio per inviare)"
          style={{
            flex: 1, resize: "none", minHeight: 38, maxHeight: 100,
            background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)", color: "var(--text)",
            padding: "8px 12px", fontSize: "0.83rem", outline: "none",
            fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.4
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || !connected}
          style={{
            padding: "9px 16px", borderRadius: "var(--radius-sm)", border: "none",
            background: "var(--ocean-dark)", color: "#fff", fontWeight: 700,
            fontSize: "0.82rem", cursor: "pointer", flexShrink: 0,
            opacity: (!input.trim() || !connected) ? 0.4 : 1,
            fontFamily: "'Plus Jakarta Sans', sans-serif"
          }}
        >
          ➤
        </button>
      </div>
    </div>
  );
}

export default ChatRoom;
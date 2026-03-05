import React, { useState, useEffect, useRef } from "react";

function ChatBox({ socket, roomId, isDrawer }) {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog]);

  useEffect(() => {
    // Listen for incoming messages (guesses or chat)
    socket.on("message", (msgData) => {
      setChatLog((prev) => [...prev, msgData]);
    });

    return () => socket.off("message");
  }, [socket]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // If it's the drawer, they can't guess, they just chat
    // If it's a player, the "guess" event handles the logic
    if (isDrawer) {
      socket.emit("send_message", { roomId, text: message });
    } else {
      socket.emit("guess", { roomId, text: message });
    }

    setMessage("");
  };

  return (
   <div className="flex flex-col h-[400px] lg:h-full bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
      <div className="p-3 border-b border-gray-700 font-bold text-center">Chat</div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 text-sm">
        {chatLog.map((msg, index) => (
          <div key={index} className={`p-2 rounded ${msg.type === 'system' ? 'bg-blue-900/30 text-blue-300 italic' : 'bg-gray-700 text-white'}`}>
            <span className="font-bold">{msg.user}: </span>
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={sendMessage} className="p-3 bg-gray-900 flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={isDrawer ? "Drawers can't guess..." : "Type your guess..."}
          disabled={isDrawer}
          className="flex-1 px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="bg-blue-600 px-4 py-2 rounded font-bold hover:bg-blue-500">
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatBox;
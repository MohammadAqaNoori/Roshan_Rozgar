/**
 * Job Chat — voice-first communication between customer and worker.
 * Messages can be text or voice (auto-transcribed by Gemini).
 */

import { useState } from "react";

export default function JobChat() {
  const [messages, setMessages] = useState([
    { id: 1, type: "text", content: "Aap kaun se time aa sakte hain?", sender: "customer" },
    { id: 2, type: "text", content: "2 baje aa jaunga", sender: "worker" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), type: "text", content: input, sender: "customer" }]);
    setInput("");
  };

  const handleVoice = () => {
    // TODO: MediaRecorder -> upload to /api/v1/messages/job/{id}/voice
    // Backend calls Gemini for transcription
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "customer" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-xl px-4 py-2 ${
                msg.sender === "customer"
                  ? "bg-brand text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              {msg.type === "voice" ? (
                <div className="flex items-center gap-2">
                  <span>▶️</span>
                  <span className="text-sm">Voice message</span>
                  {msg.transcript && (
                    <span className="text-xs opacity-70 italic">"{msg.transcript}"</span>
                  )}
                </div>
              ) : (
                <p>{msg.content}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input bar — text + voice */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-3 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type or speak..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-brand"
        />
        <button
          onClick={handleVoice}
          className="w-10 h-10 bg-brand text-white rounded-full flex items-center justify-center"
        >
          🎙️
        </button>
        <button
          onClick={handleSend}
          className="w-10 h-10 bg-accent text-brand rounded-full flex items-center justify-center font-bold"
        >
          ➤
        </button>
      </div>
    </div>
  );
}

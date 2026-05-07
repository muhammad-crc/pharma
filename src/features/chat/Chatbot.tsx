import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ai, CHATBOT_MODEL, SYSTEM_INSTRUCTION } from "../../lib/gemini";
import { useAuth } from "../auth/AuthContext";
import { cn } from "../../lib/utils";
import Markdown from "react-markdown";

interface Message {
  role: "user" | "model";
  parts: { text: string }[];
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", parts: [{ text: "Hello! I'm Pharmy, your AI health assistant. How can I help you today?" }] }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = { role: "user", parts: [{ text: input }] };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await ai.models.generateContent({
        model: CHATBOT_MODEL,
        contents: [...messages, userMsg].map(m => ({ role: m.role, parts: m.parts })),
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        }
      });

      const modelMsg: Message = { role: "model", parts: [{ text: response.text || "I'm sorry, I couldn't process that." }] };
      setMessages((prev) => [...prev, modelMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [...prev, { role: "model", parts: [{ text: "Oops, something went wrong. Please try again." }] }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-16 right-0 w-[85vw] max-w-[360px] h-[500px] glass rounded-[32px] overflow-hidden flex flex-col shadow-2xl border-primary-100 shadow-primary-100/20"
          >
            {/* Header */}
            <div className="bg-primary-600 p-4 flex items-center justify-between text-white shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Pharmy AI</h3>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-[10px] font-medium opacity-80">Always Active</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, idx) => (
                <div key={idx} className={cn("flex items-start gap-2", m.role === "user" ? "flex-row-reverse" : "")}>
                  <div className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0",
                    m.role === "user" ? "bg-neutral-200" : "bg-primary-100 text-primary-600"
                  )}>
                    {m.role === "user" ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={cn(
                    "max-w-[80%] p-3 text-sm rounded-2xl leading-relaxed",
                    m.role === "user" 
                      ? "bg-neutral-900 text-white rounded-tr-none" 
                      : "bg-white border border-neutral-100 text-neutral-800 rounded-tl-none shadow-sm markdown-body"
                  )}>
                    {m.role === "model" ? (
                      <Markdown>{m.parts[0].text}</Markdown>
                    ) : (
                      m.parts[0].text
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-start gap-2 animate-pulse">
                  <div className="w-8 h-8 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <div className="bg-white border border-neutral-100 p-3 rounded-2xl rounded-tl-none">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-primary-300 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce delay-75" />
                      <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce delay-150" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-neutral-100">
               <div className="relative">
                 <input 
                   type="text" 
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   onKeyDown={(e) => e.key === "Enter" && handleSend()}
                   placeholder="Ask about medicines..."
                   className="w-full bg-neutral-100 border-none rounded-2xl pl-4 pr-12 py-3 text-sm focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                 />
                 <button 
                   onClick={handleSend}
                   disabled={!input.trim() || isTyping}
                   className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary-600 text-white rounded-xl shadow-md hover:bg-primary-700 disabled:opacity-50 transition-all"
                 >
                   <Send size={16} />
                 </button>
               </div>
               <div className="mt-3 flex gap-2">
                 {["Check Order", "Side Effects"].map(p => (
                   <button 
                     key={p} 
                     onClick={() => setInput(p)}
                     className="text-[10px] font-bold text-neutral-500 px-2 py-1 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
                   >
                     {p}
                   </button>
                 ))}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-primary-600 text-white rounded-3xl flex items-center justify-center shadow-xl shadow-primary-200 border-2 border-white ring-4 ring-primary-100 transition-all"
      >
        {isOpen ? <X size={28} /> : <div className="relative"><MessageCircle size={28} /><Sparkles className="absolute -top-2 -right-2 text-primary-200 animate-pulse" size={16} /></div>}
      </motion.button>
    </div>
  );
}

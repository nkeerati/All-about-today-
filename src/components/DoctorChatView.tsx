import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  User, 
  Sparkles, 
  Loader2, 
  Trash2, 
  Paperclip, 
  HelpCircle,
  MessageSquare,
  Bot
} from "lucide-react";
import { ChatMessage, UserProfile } from "../types";
import { getDoctorResponse } from "../services/geminiService";

interface DoctorChatViewProps {
  profile: UserProfile;
  pm25: number;
  heatIndex: number;
  temperature: number;
}

export default function DoctorChatView({
  profile,
  pm25,
  heatIndex,
  temperature
}: DoctorChatViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init1",
      sender: "doctor",
      text: "สวัสดีครับคุณไข้ หมอ Dr. A ยินดีให้คำแนะนำสุขภาวะวันนี้ ดัชนีความร้อนและ PM2.5 ค่อนข้างพึ่งระวังครับ แนะนำว่าผู้ป่วยหอบหืด/โรคประจำตัวไม่ควรสู้แดดและต้องสวมหน้ากากครับ มีอาการเวียนหัว แสบคอ หรือต้องการตรวจเช็คสุขภาพเบื้องต้นด้านใด เล่าให้หมอฟังได้เลยนะ",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const starters = [
    { text: "ฝุ่น PM2.5 สูงวันนี้ควรสวมสไตล์หน้ากากแบบไหนดี?", value: "วันนี้ค่าฝุ่น PM2.5 สูง ควรสวมสวมหน้ากากประเภทไหนและดูแลตัวเองในบ้านอย่างไร?" },
    { text: "พึ่งตากแดดจัดแร็กเวียนศีรษะ อาเจียน", value: "ผม/ดิฉัน พึ่งเดินตากแดดจัดข้างนอกมาเมื่อกี้ รู้สึกเวียนหัว อยากอาเจียน และตัวร้อนมาก ควรรักษาปฐมพยาบาลเบื้องต้นอย่างไรคะ?" },
    { text: "ทำไมน้ำเปล่าต้านลมแดดได้เสถียร?", value: "ทำไมการจิบน้ำชดเชยเรื่อยๆ ถึงมีความจำเป็นมากในการต้านโรคลมแดดหรือฮีทสโตรกคะ?" }
  ];

  useEffect(() => {
    // Scroll chats with animations
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    
    setInputText("");
    
    const userMsg: ChatMessage = {
      id: "usrmsg_" + Date.now().toString(),
      sender: "user",
      text: textToSend,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const dbMetrics = { pm25, heatIndex, temperature };
      const chatHistoryForAPI = [...messages, userMsg].map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const reply = await getDoctorResponse(chatHistoryForAPI, profile, dbMetrics);

      const doctorMsg: ChatMessage = {
        id: "docmsg_" + Date.now().toString(),
        sender: "doctor",
        text: reply,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, doctorMsg]);
    } catch (e) {
      console.error(e);
      const errDoctorMsg: ChatMessage = {
        id: "docmsg_err_" + Date.now().toString(),
        sender: "doctor",
        text: "ขออภัยด้วยอย่างยิ่งครับ พอดีสัญญาณตรวจเช็คขาดหายไปชั่วคราว คุณไข้อย่าลืมดื่มน้ำเปล่า พักในร่ม และสังเกตสภาวะลมแดดด้วยนะครับ",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errDoctorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    if (confirm("ต้องการล้างประวัติการปรึกษากับหมอ Dr. A หรือไม่?")) {
      setMessages([
        {
          id: "init_restart",
          sender: "doctor",
          text: "ประวัติถูกรีเซ็ตเรียบร้อยครับ เล่าอาการใหม่มาได้เลยนะ หมอยินดีช่วยชี้แจงครับ",
          timestamp: new Date()
        }
      ]);
    }
  };

  return (
    <div id="doctor-chat-view-container" className="flex flex-col h-full bg-[#f8f9fa]">
      
      {/* Consult Doctor Info Bar (Matches Screen 6) */}
      <div id="doctor-header-status" className="bg-white px-4 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 bg-blue-50 rounded-full border border-blue-200 flex items-center justify-center text-xl shrink-0">
              👨‍⚕️
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">DR. A (แพทย์ผู้เชี่ยวชาญ)</div>
            <div id="online-indicator" className="text-[9px] text-[#2563eb] font-semibold flex items-center gap-1">
              • กำลังให้ความดูแลคำปรึกษา
            </div>
          </div>
        </div>

        <button 
          id="btn-clear-chat"
          onClick={handleClearChat}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
          title="ล้างประวัติคุย"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main chats messages visual stream */}
      <div id="chat-scroller-area" className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        
        {/* Helper smart banner identifying environment variables injected to Dr's smartness */}
        <div id="chat-env-hud" className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-3 border border-blue-100/50 text-center">
          <span className="text-[10px] text-slate-400 font-bold block mb-1">DATA INJECTED TO DR.A BRAIN:</span>
          <div className="flex justify-center gap-3 text-[10px] font-bold text-slate-700">
            <span className="text-orange-600 bg-white px-2 py-0.5 rounded-md border shadow-3xs">🌫️ ฝุ่น PM2.5: {pm25} µg/m³</span>
            <span className="text-rose-600 bg-white px-2 py-0.5 rounded-md border shadow-3xs">🔥 ดัชนีความร้อน: {heatIndex}°C</span>
          </div>
        </div>

        {/* Message Bubbles list */}
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          return (
            <div 
              key={msg.id} 
              className={`flex items-start gap-2 max-w-[85%] ${
                isUser ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 text-sm ${
                isUser 
                  ? "bg-blue-100 border-blue-200 text-blue-800"
                  : "bg-amber-50 border-amber-200 text-amber-700 font-sans"
              }`}>
                {isUser ? <User className="w-4 h-4 text-blue-800" /> : "🩺"}
              </div>

              <div className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-3xs ${
                isUser
                  ? "bg-[#2563eb] text-white rounded-tr-none"
                  : "bg-white text-slate-800 rounded-tl-none border border-slate-100"
              }`}>
                <div className="whitespace-pre-line">{msg.text}</div>
                <div className={`text-[8.5px] mt-1 text-right ${
                  isUser ? "text-blue-100" : "text-slate-400"
                }`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {loading && (
          <div className="flex items-start gap-2 mr-auto max-w-[85%] animate-pulse">
            <div className="w-8 h-8 rounded-full border bg-amber-50 border-amber-200 flex items-center justify-center text-sm shrink-0">
              🩺
            </div>
            <div className="p-3 bg-white text-slate-50 rounded-2xl rounded-tl-none border border-slate-100 flex items-center gap-1.5 text-xs shadow-3xs">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
              <span>Dr. A กำลังพิมพ์วิเคราะห์อาการ...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Starter questions pills list (at footer before entry box) */}
      {messages.length <= 2 && !loading && (
        <div id="starters-hud" className="px-4 py-2 bg-white/70 overflow-x-auto whitespace-nowrap shrink-0 flex gap-2 border-t border-slate-100 scrollbar-none">
          {starters.map((starter, index) => (
            <button
              id={`starter-btn-${index}`}
              key={index}
              onClick={() => handleSend(starter.value)}
              className="inline-block bg-blue-50/70 hover:bg-blue-100/70 border border-blue-100 text-blue-600 font-bold text-[10px] py-1.5 px-3 rounded-full transition-all shadow-3xs cursor-pointer focus:outline-none"
            >
              {starter.text}
            </button>
          ))}
        </div>
      )}

      {/* Bottom Text Input Area (Matches Screen 6 perfectly) */}
      <div id="chat-keyboard-area" className="bg-white p-3 border-t border-slate-100 shrink-0 flex items-center gap-2">
        <button 
          id="btn-chat-attach"
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl"
          title="แนบรูปถ่ายฝุ่นหรืออาการใบหน้า"
          onClick={() => alert("ระบบรองรับรูปภาพอยู่ระหว่างอัพเกรด พร้อมวิเคราะห์ด้วยพยากรณ์ Gemini Multimodal เร็วๆ นี้!")}
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <form 
          id="chat-submit-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputText);
          }}
          className="flex-1 flex gap-2"
        >
          <input
            id="chat-input-text"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="พิมพ์สอบถามอาการหรือคำแนะนำที่นี่..."
            className="flex-1 bg-slate-50 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#2563eb] focus:bg-white"
          />
          <button
            id="chat-send-submit"
            type="submit"
            disabled={!inputText.trim() || loading}
            className="bg-[#2563eb] hover:bg-blue-700 disabled:bg-slate-200 text-white p-2.5 rounded-xl transition-all shadow-3xs shrink-0 cursor-pointer flex items-center justify-center"
          >
            <Send className="w-4 h-4 fill-white text-white" />
          </button>
        </form>
      </div>

    </div>
  );
}

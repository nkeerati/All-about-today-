import React, { useState } from "react";
import { 
  Smile, 
  Meh, 
  Frown, 
  Sun, 
  Flame, 
  AlertTriangle,
  Info,
  ChevronRight,
  ShieldCheck,
  Smartphone
} from "lucide-react";

interface HomeViewProps {
  pm25: number;
  setPm25: (val: number) => void;
  heatIndex: number;
  setHeatIndex: (val: number) => void;
  temperature: number;
  setTemperature: (val: number) => void;
  onNavigateToKnowledge: (tab: 'pm25' | 'heatstroke') => void;
  onOpenSidebar: () => void;
}

export default function HomeView({
  pm25,
  setPm25,
  heatIndex,
  setHeatIndex,
  temperature,
  setTemperature,
  onNavigateToKnowledge,
  onOpenSidebar
}: HomeViewProps) {
  const [activeWarningTab, setActiveWarningTab] = useState<'PM2.5' | 'HEATSTROKE'>('PM2.5');

  // Interpret PM2.5
  const getPm25Status = (val: number) => {
    if (val <= 37.5) {
      return {
        level: "คุณภาพดีมาก",
        color: "text-green-600 bg-green-50 border-green-200",
        bg: "bg-green-100/40",
        face: "green",
        text: "อากาศสะอาด เหมาะสำหรับกิจกรรมกลางแจ้ง"
      };
    } else if (val <= 50) {
      return {
        level: "คุณภาพดี",
        color: "text-emerald-700 bg-emerald-50 border-emerald-100",
        bg: "bg-emerald-50",
        face: "green-light",
        text: "ระดับดี ดำเนินชีวิตกลางแจ้งได้ดี"
      };
    } else if (val <= 75) {
      return {
        level: "ปานกลาง",
        color: "text-amber-600 bg-amber-50 border-amber-200",
        bg: "bg-amber-100/30",
        face: "yellow",
        text: "เริ่มส่งผลต่อระบบทางเดินหายใจในคนกลุ่มเสี่ยง"
      };
    } else if (val <= 150) {
      return {
        level: "เริ่มมีผลกระทบต่อสุขภาพ",
        color: "text-orange-600 bg-orange-50 border-orange-200",
        bg: "bg-orange-50/70",
        face: "orange",
        text: "เริ่มมีผลกระทบ ควรหลีกเลี่ยงกิจกรรมกลางแจ้งเป็นเวลานาน"
      };
    } else {
      return {
        level: "มีผลกระทบต่อสุขภาพอย่างยิ่ง",
        color: "text-red-700 bg-red-50 border-red-200",
        bg: "bg-red-50",
        face: "red",
        text: "อันตราย วิกฤตหมอกควัน มลพิษสูงควรงดออกนอกอาคาร"
      };
    }
  };

  // Interpret Heat Index
  const getHeatIndexStatus = (val: number) => {
    if (val < 27) {
      return {
        level: "เฝ้าระวังต่ำ",
        color: "text-green-600 bg-green-50 border-green-200",
        bg: "bg-green-100/40",
        text: "อุณหภูมิสบาย ปลอดภัยสูง"
      };
    } else if (val <= 32.9) {
      return {
        level: "เฝ้าระวัง (Caution)",
        color: "text-amber-600 bg-amber-50 border-amber-100",
        bg: "bg-amber-50",
        text: "อ่อนล้าเมื่อออกแดดนาน พยายามหลีกเลี่ยงที่แดดจัด"
      };
    } else if (val <= 41.9) {
      return {
        level: "เตือนภัย (Extreme Caution)",
        color: "text-orange-600 bg-orange-50 border-orange-200",
        bg: "bg-orange-100/30",
        text: "เสี่ยงตะคริวแดด และอ่อนเพลียจากความร้อนจัด"
      };
    } else if (val <= 53.9) {
      return {
        level: "อันตราย (Danger)",
        color: "text-red-600 bg-red-50 border-red-200",
        bg: "bg-red-50/90",
        text: "อันตรายมาก เสี่ยงเกิดฮีทสโตรกหากทำกิจกรรมต่อเนื่อง"
      };
    } else {
      return {
        level: "อันตรายอย่างยิ่ง (Extreme Danger)",
        color: "text-rose-700 bg-rose-50 border-rose-200",
        bg: "bg-rose-100",
        text: "อันตรายระดับวิกฤตสูงมาก เสี่ยงลมแดดกะทันหันอย่างเฉลียบพลัน"
      };
    }
  };

  const pmInfo = getPm25Status(pm25);
  const heatInfo = getHeatIndexStatus(heatIndex);

  return (
    <div id="home-view-container" className="flex flex-col h-full bg-[#f8f9fa] overflow-y-auto pb-6">
      
      {/* Top Banner Tab selector to toggle mockup focus (corresponds to PM2.5 vs HEATSTROKE tab on Header) */}
      <div id="home-toggle-header" className="bg-white border-b border-gray-100 px-4 py-2 flex items-center justify-center gap-4">
        <button
          id="tab-select-pm25"
          onClick={() => {
            setActiveWarningTab('PM2.5');
            // Preset values for realistic PM2.5 highlight matching Screen 1 & 3 of mockup
            setPm25(82);
            setHeatIndex(41);
            setTemperature(36);
          }}
          className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-all text-center ${
            activeWarningTab === 'PM2.5'
              ? 'bg-orange-100 text-orange-600 shadow-3xs'
              : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          PM2.5โฟกัส
        </button>
        <button
          id="tab-select-heatstroke"
          onClick={() => {
            setActiveWarningTab('HEATSTROKE');
            // Preset values for realistic Heatstroke warning highlight matching Screen 4 & 5 of mockup
            setPm25(35);
            setHeatIndex(41);
            setTemperature(37);
          }}
          className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-all text-center ${
            activeWarningTab === 'HEATSTROKE'
              ? 'bg-rose-100 text-rose-600 shadow-3xs'
              : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          ฮีทสโตรกโฟกัส
        </button>
      </div>

      <div className="p-4 space-y-4">
        
        {/* Dynamic Warning Alert Screen / Attention card (Screen 3 & 5 style) */}
        {activeWarningTab === 'PM2.5' ? (
          <div id="attn-pm25-card" className="bg-[#fef3c7] border border-amber-200 rounded-3xl p-5 shadow-sm text-center relative overflow-hidden animate-fade-in">
            {/* Soft decorative background circles */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full blur-xl -mr-8 -mt-8" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-200/10 rounded-full blur-xl -ml-6 -mb-6" />
            
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-300">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            
            <div className="text-amber-800 text-xs font-semibold tracking-widest uppercase">ATTENTION</div>
            <div className="text-3xl font-bold text-gray-800 my-2">
              {pm25} <span className="text-lg font-medium text-gray-500">µg/m³</span>
            </div>
            <div className="text-amber-800 text-sm font-semibold mb-1">
              เริ่มมีผลกระทบต่อสุขภาพ
            </div>
            <div className="text-gray-600 text-[11px] max-w-[200px] mx-auto mb-4 leading-relaxed">
              สอดคล้องกับปริมาณฝุ่นละอองขนาดเกินพิกัด ควรมีมาตรการป้องกันที่เหมาะสม
            </div>
            
            <button
              id="attn-pm25-button"
              onClick={() => onNavigateToKnowledge('pm25')}
              className="text-amber-900 bg-amber-300 hover:bg-amber-400 font-semibold text-xs py-2 px-8 rounded-full shadow-2xs border border-amber-400/50 transition-all cursor-pointer"
            >
              คำแนะนำ
            </button>
          </div>
        ) : (
          <div id="attn-heat-card" className="bg-[#fee2e2] border border-red-200 rounded-3xl p-5 shadow-sm text-center relative overflow-hidden animate-fade-in">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-200/20 rounded-full blur-xl -mr-8 -mt-8" />
            
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center border border-rose-300">
                <Flame className="w-6 h-6 text-red-500" />
              </div>
            </div>
            
            <div className="text-red-800 text-xs font-semibold tracking-widest uppercase">ATTENTION</div>
            <div className="text-red-900 text-md font-bold mt-1.5 mb-1">
              ดัชนีความร้อนสูงมาก
            </div>
            <div className="text-5xl font-black text-rose-600 my-2">
              {heatIndex}°C
            </div>
            <div className="text-red-800 text-xs font-semibold mb-1">
              เสี่ยงต่อภาวะ Heatstroke
            </div>
            <div className="text-gray-600 text-[11px] max-w-[210px] mx-auto mb-4 leading-relaxed">
              ระดับอันตราย ควรงดกิจกรรมกิจกรรมกลางแจ้ง
            </div>
            
            <button
              id="attn-heat-button"
              onClick={() => onNavigateToKnowledge('heatstroke')}
              className="text-white bg-red-500 hover:bg-red-600 font-semibold text-xs py-2 px-8 rounded-full shadow-2xs border border-red-600/50 transition-all cursor-pointer"
            >
              คำแนะนำ
            </button>
          </div>
        )}

        {/* Home Screen 1 Dashboard indicators */}
        <div id="home-dashboard-layout" className="bg-white rounded-3xl p-5 shadow-xs border border-gray-100">
          <div className="text-xs text-gray-400 font-semibold tracking-wide mb-3">คุณภาพอากาศตอนนี้</div>
          
          <div className="grid grid-cols-12 gap-3 items-center mb-5">
            {/* PM2.5 Meter */}
            <div className="col-span-8 bg-[#fffbeb] border border-[#fef3c7] rounded-2xl p-4 flex flex-col justify-between h-[120px]">
              <div>
                <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">PM 2.5</span>
                <div className="text-3xl font-semibold text-gray-800 mt-2">
                  {pm25} <span className="text-xs font-normal text-gray-400">µg/m³</span>
                </div>
              </div>
              <div className="text-[10px] text-amber-700 font-semibold">
                เริ่มมีผลกระทบต่อสุขภาพ
              </div>
            </div>

            {/* Dynamic Face Emoji corresponding to air quality */}
            <div className="col-span-4 bg-gray-50 border border-gray-100 rounded-2xl p-3 flex flex-col items-center justify-center h-[120px]">
              <div className="text-amber-500 mb-1">
                {pm25 > 150 ? (
                  <Frown className="w-12 h-12 text-rose-600" />
                ) : pm25 > 75 ? (
                  <Frown className="w-12 h-12 text-amber-500" />
                ) : pm25 > 50 ? (
                  <Meh className="w-12 h-12 text-yellow-500" />
                ) : (
                  <Smile className="w-12 h-12 text-green-500" />
                )}
              </div>
              <div className="text-[9px] text-gray-400 text-center font-medium mt-1">
                {pmInfo.level}
              </div>
            </div>
          </div>

          {/* Heat Index & Temp grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Heat Index Detail Card */}
            <div className="bg-[#fef2f2] border border-rose-100 rounded-2xl p-3">
              <div className="text-[10px] text-rose-500 font-bold uppercase tracking-wide flex items-center gap-1">
                <Flame className="w-3 h-3" /> ดัชนีความร้อน
              </div>
              <div className="text-2xl font-black text-rose-600 my-1">
                {heatIndex}°C
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-rose-500 text-white rounded-md">
                อันตราย
              </span>
            </div>

            {/* Temperature Detail Card */}
            <div className="bg-[#fffbeb] border border-amber-100 rounded-2xl p-3">
              <div className="text-[10px] text-amber-600 font-bold uppercase tracking-wide flex items-center gap-1">
                <Sun className="w-3 h-3" /> อุณหภูมิ
              </div>
              <div className="text-2xl font-black text-amber-500 my-1">
                {temperature}°C
              </div>
              <div className="flex items-center gap-1 text-[10px] text-amber-700 font-medium">
                <span className="inline-block w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping" /> แดดจัดมากวันนี้
              </div>
            </div>
          </div>
        </div>

        {/* Personalized Medical Bullet Advice screen section (Screen 1 & 4) */}
        <div id="home-advice-panel" className="bg-white rounded-3xl p-5 shadow-xs border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-4 bg-[#2563eb] rounded-full" />
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide">คำแนะนำสำหรับคุณ</h3>
          </div>

          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2.5 p-2 bg-emerald-50/40 rounded-xl border border-emerald-100/50">
              <span className="text-lg leading-none">😷</span>
              <div>
                <span className="font-semibold text-xs text-gray-800">สวมหน้ากาก N95 เมื่อออกนอกบ้าน </span>
                <p className="text-[11px] text-gray-500 leading-tight">ป้องกันฝุ่นละอองขนาดจิ๋วสภามมลภาวะหนาแน่น</p>
              </div>
            </li>
            <li className="flex items-start gap-2.5 p-2 bg-amber-50/40 rounded-xl border border-amber-100/50">
              <span className="text-lg leading-none">☀️</span>
              <div>
                <span className="font-semibold text-xs text-gray-800">หลีกเลี่ยงกิจกรรมกลางแจ้ง </span>
                <p className="text-[11px] text-gray-500 leading-tight">ลดการสะสมความร้อนส่วนเกินและการกระตุ้นลมแดด</p>
              </div>
            </li>
            <li className="flex items-start gap-2.5 p-2 bg-blue-50/40 rounded-xl border border-blue-100/50">
              <span className="text-lg leading-none">💧</span>
              <div>
                <span className="font-semibold text-xs text-gray-800">ดื่มน้ำอย่างน้อย 8 แก้วต่อวัน </span>
                <p className="text-[11px] text-gray-500 leading-tight">ชดเชยการสูญเสียเกลือแร่ ขับล้างเหงื่อเพื่อคูลดาวน์</p>
              </div>
            </li>
            <li className="flex items-start gap-2.5 p-2 bg-purple-50/40 rounded-xl border border-purple-100/50">
              <span className="text-lg leading-none">🏡</span>
              <div>
                <span className="font-semibold text-xs text-gray-800">พักในที่ร่ม อากาศถ่ายเทสะดวก </span>
                <p className="text-[11px] text-gray-500 leading-tight">อยู่ในร่มเงาที่ร่มรื่น ม่านกั้นแสง หรือที่ติดพัดลม/แอร์</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Environmental Control Center Slider for awesome interactive mockup simulations */}
        <div id="simulation-cont-box" className="bg-[#eff6ff] rounded-2xl p-4 border border-blue-100 shadow-3xs ">
          <div className="flex items-center gap-2 mb-2 text-blue-700 font-bold text-[10px] uppercase tracking-wider">
            <Smartphone className="w-3.5 h-3.5" /> จำลองผู้ใช้กู้ภัยสถานการณ์ต่างๆ (Simulation Control Panel)
          </div>
          <p className="text-gray-500 text-[10px] mb-3 leading-relaxed">
            ทดลองขยับระดับฝุ่นหรือความร้อนที่จำลองจากเซ็นเซอร์ เพื่อเฝ้าระวังความเร็วหน้าเอปและใบหน้าประเมินภัยพิบัติ
          </p>

          <div className="space-y-4">
            {/* PM2.5 Slider */}
            <div>
              <div className="flex justify-between text-[11px] mb-1 font-semibold text-gray-700">
                <span>ฝุ่นละออง PM2.5 (µg/m³):</span>
                <span className="font-mono text-orange-600">{pm25} µg/m³</span>
              </div>
              <input 
                id="slider-pm25"
                type="range" 
                min="5" 
                max="250" 
                value={pm25} 
                onChange={(e) => setPm25(Number(e.target.value))}
                className="w-full cursor-pointer h-1 bg-gray-200 rounded-lg appearance-auto accent-orange-500"
              />
              <div className="flex justify-between text-[8px] text-gray-400 font-code px-1 mt-0.5">
                <span>ดีมาก (0)</span>
                <span>ปานกลาง (50)</span>
                <span>เริ่มอันตราย (75)</span>
                <span>วิกฤต (150+)</span>
              </div>
            </div>

            {/* Heat Index Slider */}
            <div>
              <div className="flex justify-between text-[11px] mb-1 font-semibold text-gray-700">
                <span>ดัชนีความร้อน (Heat Index):</span>
                <span className="font-mono text-rose-600">{heatIndex}°C</span>
              </div>
              <input 
                id="slider-heatindex"
                type="range" 
                min="20" 
                max="60" 
                value={heatIndex} 
                onChange={(e) => setHeatIndex(Number(e.target.value))}
                className="w-full cursor-pointer h-1 bg-gray-200 rounded-lg appearance-auto accent-rose-500"
              />
              <div className="flex justify-between text-[8px] text-gray-400 font-code px-1 mt-0.5">
                <span>เย็นสบาย (20)</span>
                <span>เริ่มระวัง (32)</span>
                <span>อันตรายจัด (41)</span>
                <span>เฉียบพลัน (54+)</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

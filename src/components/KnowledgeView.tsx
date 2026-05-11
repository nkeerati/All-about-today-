import React, { useState } from "react";
import { BookOpen, Info, ShieldAlert, Sparkles, AlertCircle } from "lucide-react";

interface KnowledgeViewProps {
  initialTab?: 'pm25' | 'heatstroke';
}

export default function KnowledgeView({ initialTab = 'pm25' }: KnowledgeViewProps) {
  const [activeTab, setActiveTab] = useState<'PM2.5' | 'HEATSTROKE'>(
    initialTab === 'pm25' ? 'PM2.5' : 'HEATSTROKE'
  );

  return (
    <div id="knowledge-view-container" className="flex flex-col h-full bg-white overflow-y-auto pb-10">
      
      {/* Header Knowledge navigation inside mobile view */}
      <div id="knowledge-tab-headers" className="grid grid-cols-2 bg-slate-50 border-b border-slate-100 p-2 gap-2 sticky top-0 z-10">
        <button
          id="btn-knowledge-pm25"
          onClick={() => setActiveTab('PM2.5')}
          className={`py-2 px-4 text-xs font-extrabold rounded-xl transition-all duration-200 uppercase tracking-wider text-center ${
            activeTab === 'PM2.5'
              ? 'bg-[#2563eb] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          PM2.5
        </button>
        <button
          id="btn-knowledge-heatstroke"
          onClick={() => setActiveTab('HEATSTROKE')}
          className={`py-2 px-4 text-xs font-extrabold rounded-xl transition-all duration-200 uppercase tracking-wider text-center ${
            activeTab === 'HEATSTROKE'
              ? 'bg-rose-500 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          HEATSTROKE
        </button>
      </div>

      <div className="p-4 space-y-5 animate-fade-in">
        {activeTab === 'PM2.5' ? (
          /* PM 2.5 Tab Content (Match Screen 2 of Mockup) */
          <div id="pm25-knowledge-details" className="space-y-5">
            {/* What is it section */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide border-b pb-1.5 flex items-center gap-1.5 ">
                <span className="w-1.5 h-3.5 bg-[#2563eb] rounded-full inline-block" />
                PM 2.5 คืออะไร
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed indent-4">
                PM 2.5 คือ ฝุ่นละอองขนาดเล็กที่มีเส้นผ่านศูนย์กลางไม่เกิน 2.5 ไมครอน สามารถเล็ดลอดผ่านขนจมูกเข้าสู่ระบบทางเดินหายใจ หลอดลมลึก และแพร่กระจายโดยตรงสู่กระแสเลือดได้ สามารถส่งผลกระทบต่อเนื่องที่เป็นอันตรายร้ายแรงต่อสุขภาพร่างกายได้ทันที
              </p>
            </div>

            {/* Dust comparison chart - Matches mockup graphic perfectly! */}
            <div id="dust-comparison-chart" className="border border-slate-200/60 bg-slate-50/70 p-4 rounded-2xl relative overflow-hidden">
              <div className="text-[10px] uppercase font-extrabold text-[#2563eb] tracking-wider mb-2 text-center">
                ขนาดฝุ่นเปรียบเทียบ
              </div>
              
              <div className="flex justify-around items-end pt-6 pb-4">
                {/* 1. Hair sphere */}
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-[70px] h-[70px] rounded-full bg-gray-400 border border-gray-500/30 flex items-center justify-center text-white font-mono text-[9px] text-center shadow-2xs">
                    50-70 µm
                  </div>
                  <div className="text-center">
                    <div className="text-[9px] font-bold text-gray-700">เส้นผม</div>
                    <div className="text-[8px] text-gray-400">50-70 µm</div>
                  </div>
                </div>

                {/* 2. PM10 sphere */}
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-[20px] h-[20px] rounded-full bg-yellow-400 border border-yellow-500/30 flex items-center justify-center font-mono text-[6px] text-gray-800 shadow-3xs">
                    &lt;10
                  </div>
                  <div className="text-center">
                    <div className="text-[9px] font-bold text-gray-700">ฝุ่น PM10</div>
                    <div className="text-[8px] text-gray-400">&lt; 10 µm</div>
                  </div>
                </div>

                {/* 3. PM2.5 sphere (tiny red dot) */}
                <div className="flex flex-col items-center space-y-2">
                  <div className="relative w-8 h-[70px] flex items-center justify-center">
                    {/* Line to point the tiny dot */}
                    <div className="absolute inset-x-0 bottom-12 border-t border-dashed border-red-400 text-center text-[7px] text-red-500 font-bold">
                      จิ๋วสุด!
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse shadow-xs" />
                  </div>
                  <div className="text-center">
                    <div className="text-[9px] font-bold text-red-600">ฝุ่น PM2.5</div>
                    <div className="text-[8px] text-gray-400">&lt; 2.5 µm</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Health Impact checklist */}
            <div id="pm25-effects-box" className="space-y-2">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide border-b pb-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-3.5 bg-yellow-500 rounded-full inline-block" />
                ผลกระทบต่อสุขภาพ
              </h3>
              <ul className="space-y-1.5 text-xs text-gray-600 pl-1">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                  <span>ระคายเคืองตา จมูก และคอ แสบคอ ไอจามบ่อยขึ้น</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                  <span>หายใจติดขัด หายใจลำบาก หรือเหนื่อยง่ายเมื่ออกแรง</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                  <span>เพิ่มความเสี่ยงอาการกำเริบของโรคหอบหืด โรคปอดอุดกั้นเรื้อรัง</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                  <span>เพิ่มอัตราความเสี่ยงโรคทางเดินหายใจ ตับ มะเร็งปอด และโรคหลอดเลือดสมองอุดตัน</span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          /* HEATSTROKE Tab Content (Match Screen 4 of Mockup) */
          <div id="heatstroke-knowledge-details" className="space-y-5">
            {/* What is it section */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-rose-600 uppercase tracking-wide border-b pb-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-3.5 bg-rose-500 rounded-full inline-block" />
                HEATSTROKE คืออะไร
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed indent-4">
                Heatstroke (โรคลมแดด) คือ ภาวะที่อุบัติจากการที่ร่างกายสูญเสียการทรงอุณหภูมิ มีอุณหภูมิแกนกลางร่างกายเพิ่มสูงขึ้นเกินไปในระบบควบคุม อุณหภูมิร่างกายปกติ ร่างกายระบายเหงื่อออกไม่ทัน ส่งผลให้อุณหภูมิร่างกายพุ่งสูงเกิน <strong className="text-rose-600">40 องศาเซลเซียส</strong> นับเป็นสภาวะฉุกเฉินวิกฤตทางการแพทย์ที่ต้องได้รับการรักษาและลดความร้อนโดยด่วนที่สุด
              </p>
            </div>

            {/* Patient Symptoms */}
            <div id="heatstroke-symptoms-box" className="p-4 bg-orange-50 border border-orange-100 rounded-2xl">
              <div className="text-[10px] font-bold text-orange-700 tracking-wider uppercase mb-1.5">
                อาการสำคัญของผู้ป่วย
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">
                ตัวร้อนจัดระอุ (แกนในตัวร้อนเกิน 40°C), ผิวหนังแห้ง แดงจัด, ปวดศีรษะตื้อ, เวียนศีรษะเฉียบพลัน, คลื่นไส้อาเจียนสับสน, พูดจาเลอะเลือนสับสน หรือหมดสติชั่ววูบ, ชีพจรเต้นรัวเร็ว หากรุนแรงและปฐมพยาบาลไม่ทัน อาจทำให้ระบบอวัยวะภายในส้มเหลวและเสียชีวิตได้ทันที
              </p>
            </div>

            {/* Comparison Table HEATSTROKE vs HEAT EXHAUSTION */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide border-b pb-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-3.5 bg-amber-500 rounded-full inline-block" />
                ความแตกต่าง HEATSTROKE vs เพลียแดด
              </h3>
              
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="border border-rose-200 bg-rose-50/50 rounded-xl p-3">
                  <div className="font-bold text-rose-700 mb-1">HEATSTROKE (ลมแดด)</div>
                  <ul className="space-y-1 text-gray-600 leading-tight">
                    <li>• ความรุนแรงสูงมาก (ฉุกเฉิน!)</li>
                    <li>• ร่างกายร้อนจัด &gt;40°C</li>
                    <li>• ชัก สับสน เลอะเลือน หมดสติ</li>
                    <li>• ตัวร้อนแดง ผิวแห้งสนิท ไร้เหงื่อ</li>
                  </ul>
                </div>

                <div className="border border-amber-200 bg-amber-50/50 rounded-xl p-3">
                  <div className="font-bold text-amber-700 mb-1">เพลียแดด (Heat Exhaustion)</div>
                  <ul className="space-y-1 text-gray-600 leading-tight">
                    <li>• ความรุนแรงปานกลาง</li>
                    <li>• อุณหภูมิร่างกายค่อนข้างสูง</li>
                    <li>• อ่อนล้า เพลีย เวียนหัวธรรมดา</li>
                    <li>• มีเหงื่อออกท่วมตัวอย่างเห็นได้ชัด</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Effects and Prevention details */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide border-b pb-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-3.5 bg-rose-500 rounded-full inline-block" />
                ผลกระทบต่อร่างกาย &amp; แนวทางป้องกัน
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                โรคลมแดดทำให้ตับและตับอ่อนทำงานล้มเหลว ไตคลายความเข้มข้นจนปัสสาวะเป็นเลือด และกระตุ้นกล้ามเนื้อลายสลายตัวอย่างรวดเร็ว (Rhabdomyolysis) ควรปฐมพยาบาลเบื้องต้นด้วยการพาคนไข้เข้าร่มทันที ประพรมน้ำอุณหภูมิปกติ และสวมเครื่องนุ่งห่มหลวมระบายอากาศ ดื่มน้ำสะอาดสม่ำเสมอ หลีกเลี่ยงแสงแดดที่มีความสุ่มเสี่ยง
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

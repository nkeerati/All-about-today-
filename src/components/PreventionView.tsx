import React, { useState } from "react";
import { Droplet, Check, ShieldAlert, BadgeInfo, Undo2, Award } from "lucide-react";
import { PREVENTION_TIPS } from "../constants";

export default function PreventionView() {
  const [completedTips, setCompletedTips] = useState<string[]>([]);
  const [waterMilliliters, setWaterMilliliters] = useState<number>(500); // starts with 500ml

  const toggleTip = (id: string) => {
    setCompletedTips(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const addWater = (amount: number) => {
    setWaterMilliliters(prev => Math.min(prev + amount, 3500));
  };

  const resetWater = () => {
    setWaterMilliliters(0);
  };

  const waterProgressPercent = Math.min((waterMilliliters / 2500) * 100, 100);

  return (
    <div id="prevention-view-container" className="flex flex-col h-full bg-[#f8f9fa] overflow-y-auto pb-12">
      <div className="p-4 space-y-4">
        
        {/* Interactive Hydration Cup Logger Card - Essential defense against Heatstroke! */}
        <div id="water-tracker-card" className="bg-gradient-to-br from-[#e0f2fe] to-[#bae6fd] border border-sky-100 rounded-3xl p-5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-300/20 rounded-full blur-xl -mr-6 -mt-6" />
          
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="text-sky-700 font-bold uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                <Droplet className="w-4 h-4 text-sky-500 fill-sky-500" /> ต้านภัยฮีทสโตรก ด้วยการเติมน้ำคูลดาวน์
              </div>
              <h4 className="text-sm font-black text-slate-800 mt-1">เครื่องคำนวณและวัดปริมาณการจิิบน้ำ</h4>
            </div>
            
            <button
              id="btn-undo-water"
              onClick={resetWater}
              className="text-slate-400 hover:text-slate-600 text-[10px] bg-white/60 p-1.5 rounded-lg border border-sky-200/50 hover:bg-white"
              title="รีเซ็ตการดื่มน้ำ"
            >
              รีเซ็ต
            </button>
          </div>

          <div className="my-4 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-[#0369a1] font-mono">{waterMilliliters}</span>
            <span className="text-xs text-slate-500 font-medium font-sans">มิลลิลิตร (ml) / เป้าหมาย 2,500 ml</span>
          </div>

          {/* Hydration progress gauge */}
          <div className="relative w-full h-3 bg-white/80 rounded-full overflow-hidden border border-sky-200">
            <div 
              id="water-bar"
              style={{ width: `${waterProgressPercent}%` }}
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full transition-all duration-500"
            />
          </div>

          <div className="flex justify-between text-[9px] text-sky-600 font-mono mt-1 px-0.5">
            <span>ต้านลมแดด (0ml)</span>
            <span>กึ่งกลาง (1,250ml)</span>
            <span className="font-bold flex items-center gap-0.5">
              {waterProgressPercent >= 100 && <Award className="w-3 h-3 text-amber-500" />} ครบสมดุล (2,500ml)
            </span>
          </div>

          {/* Quick interactive glass adds */}
          <div id="water-add-choices" className="grid grid-cols-3 gap-2 mt-4 pt-1">
            <button
              id="add-water-150"
              onClick={() => addWater(150)}
              className="bg-white/80 hover:bg-white border border-sky-200 hover:border-sky-300 font-semibold text-[10px] py-2 px-1.5 rounded-xl transition-all shadow-3xs cursor-pointer flex flex-col items-center"
            >
              <span className="text-base">🥛</span>
              <span className="text-slate-700 mt-0.5">+150 ml (จิบถ้วยแก้ว)</span>
            </button>
            <button
              id="add-water-250"
              onClick={() => addWater(250)}
              className="bg-white/80 hover:bg-white border border-sky-200 hover:border-sky-300 font-semibold text-[10px] py-2 px-1.5 rounded-xl transition-all shadow-3xs cursor-pointer flex flex-col items-center"
            >
              <span className="text-lg">🥤</span>
              <span className="text-slate-700 mt-0.5">+250 ml (แก้วปกติ)</span>
            </button>
            <button
              id="add-water-500"
              onClick={() => addWater(500)}
              className="bg-sky-500 hover:bg-sky-600 border border-sky-500 text-white font-semibold text-[10px] py-2 px-1.5 rounded-xl transition-all shadow-2xs cursor-pointer flex flex-col items-center"
            >
              <span className="text-lg">🫙</span>
              <span className="text-white mt-0.5">+500 ml (ขวดน้ำดื่ม)</span>
            </button>
          </div>
        </div>

        {/* Dynamic tips listing */}
        <div id="prevention-tips-details" className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <BadgeInfo className="w-4 h-4 text-blue-500" />
            <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest">เช็คลิสต์ตรวจความปลอดภัยประจำวัน</h5>
          </div>

          {PREVENTION_TIPS.map((sect) => (
            <div key={sect.id} className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 pb-2 border-b border-slate-100 flex items-center justify-between ">
                <span>{sect.title}</span>
                <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100/50">
                  คู่มือแพทย์แนะนำ
                </span>
              </h4>

              <div className="mt-3 space-y-3">
                {sect.bullets.map((bullet, idx) => {
                  const bulletId = `${sect.id}-${idx}`;
                  const isChecked = completedTips.includes(bulletId);
                  return (
                    <button
                      id={`tip-check-${bulletId}`}
                      key={idx}
                      onClick={() => toggleTip(bulletId)}
                      className="w-full text-left flex items-start gap-3 p-2 rounded-xl transition-all duration-150 hover:bg-slate-50 group cursor-pointer focus:outline-none"
                    >
                      <div className={`mt-0.5 w-[18px] h-[18px] rounded-md border flex items-center justify-center transition-all ${
                        isChecked 
                          ? 'bg-[#2563eb] border-[#2563eb] text-white shadow-3xs' 
                          : 'border-slate-200 group-hover:border-slate-300 bg-white'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className={`text-[12px] leading-relaxed flex-1 ${
                        isChecked ? 'line-through text-slate-400' : 'text-slate-700'
                      }`}>
                        {bullet}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

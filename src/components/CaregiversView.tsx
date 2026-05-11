import React, { useState } from "react";
import { MapPin, Phone, MessageSquare, Map, Navigation, Check, X, ShieldAlert, Star } from "lucide-react";
import { MOCK_CAREGIVERS } from "../constants";
import { Caregiver } from "../types";

export default function CaregiversView() {
  const [selectedCaregiver, setSelectedCaregiver] = useState<Caregiver | null>(MOCK_CAREGIVERS[0]);
  const [isCalling, setIsCalling] = useState<boolean>(false);
  const [callTimer, setCallTimer] = useState<string>("00:00");
  const [bookingStatus, setBookingStatus] = useState<'none' | 'success'>('none');

  const startMockCall = (cg: Caregiver) => {
    setSelectedCaregiver(cg);
    setIsCalling(true);
    // simulated calling clock
    let sec = 0;
    const interval = setInterval(() => {
      sec++;
      const m = Math.floor(sec / 60).toString().padStart(2, '0');
      const s = (sec % 60).toString().padStart(2, '0');
      setCallTimer(`${m}:${s}`);
    }, 1000);

    (window as any)._callInterval = interval;
  };

  const endMockCall = () => {
    setIsCalling(false);
    setCallTimer("00:00");
    if ((window as any)._callInterval) {
      clearInterval((window as any)._callInterval);
    }
  };

  const handleBookCaregiver = () => {
    setBookingStatus('success');
    setTimeout(() => {
      setBookingStatus('none');
    }, 4000);
  };

  return (
    <div id="caregivers-view-container" className="flex flex-col h-full bg-[#f8f9fa] overflow-hidden">
      
      {/* 1. Vector Map Simulation Container (Matches Screen 8 perfectly with actual interactive pins and radar!) */}
      <div id="map-simulation-container" className="relative h-[220px] w-full bg-[#e0f2fe] border-b border-gray-100 overflow-hidden shrink-0 shadow-inner">
        {/* SVG map background vectors */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Waterway (Chao Phraya River simulator) */}
          <path d="M-20,240 C100,200 80,60 120,0 L180,0 C140,80 160,220 10,240 Z" fill="#93c5fd" opacity="0.4" />
          
          {/* Parks / Green areas */}
          <rect x="200" y="30" width="120" height="60" rx="15" fill="#bbf7d0" opacity="0.4" />
          <circle cx="80" cy="180" r="30" fill="#bbf7d0" opacity="0.3" />

          {/* Road lines */}
          <line x1="0" y1="110" x2="400" y2="110" stroke="#ffffff" strokeWidth="8" />
          <line x1="0" y1="110" x2="400" y2="110" stroke="#f1f5f9" strokeWidth="4" />
          <line x1="160" y1="0" x2="160" y2="240" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />
          <line x1="160" y1="0" x2="160" y2="240" stroke="#f1f5f9" strokeWidth="4" strokeLinecap="round" />

          {/* Road labels */}
          <text x="50" y="103" fill="#94a3b8" fontSize="8" fontWeight="bold">ถนนวิภาวดีรังสิต Viphavadi Rd</text>
          <text x="170" y="50" fill="#94a3b8" fontSize="8" fontWeight="bold" transform="rotate(90 170 50)">ถนนลาดพร้าว Ladprao Rd</text>
        </svg>

        {/* Center / User locator blue radar ring */}
        <div className="absolute left-[160px] top-[110px] -ml-4 -mt-4 w-8 h-8 flex items-center justify-center pointer-events-none">
          <div className="absolute w-12 h-12 bg-blue-500/20 rounded-full animate-ping" />
          <div className="absolute w-8 h-8 bg-blue-500/40 rounded-full border-2 border-white" />
          <div className="w-3.5 h-3.5 bg-blue-600 rounded-full shadow-md shrink-0" />
        </div>

        {/* Dynamic coordinate marker Pins for Caregiver locations */}
        {MOCK_CAREGIVERS.map((cg, idx) => {
          // Calculate stylized offsets around user location so they fit beautifully
          const offsets = [
            { left: "100px", top: "60px" },
            { left: "220px", top: "140px" },
            { left: "50px", top: "150px" }
          ];
          const isSelected = selectedCaregiver?.id === cg.id;
          return (
            <button
              id={`map-pin-${cg.id}`}
              key={cg.id}
              onClick={() => setSelectedCaregiver(cg)}
              className="absolute group transition-transform duration-300 hover:scale-110 focus:outline-none"
              style={{ left: offsets[idx].left, top: offsets[idx].top }}
            >
              <div className="flex flex-col items-center">
                <div className={`px-2 py-0.5 rounded-md text-[8px] font-bold text-gray-800 bg-white shadow-md border whitespace-nowrap mb-0.5 max-w-[80px] truncate ${
                  isSelected ? 'border-rose-500 text-rose-600' : 'border-gray-200'
                }`}>
                  {cg.name.split(" ")[1] /* last name or first prefix */} กม. {cg.distance}
                </div>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm shadow-md transition-all ${
                  isSelected 
                    ? 'bg-rose-500 border-2 border-white text-white scale-110 ring-4 ring-rose-500/20' 
                    : 'bg-white border text-gray-600 hover:bg-rose-50 hover:text-rose-500'
                }`}>
                  📍
                </div>
              </div>
            </button>
          );
        })}

        {/* Small floating HUD alert */}
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-[10px] text-white py-1 px-2.5 rounded-lg font-mono flex items-center gap-1">
          <Navigation className="w-3 h-3 text-blue-400 fill-blue-400" /> Nearby GPS Locator
        </div>
      </div>

      {/* 2. Interactive Caregivers list below the map (Matches Screen 8 perfectly) */}
      <div id="caregivers-list-section" className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1">
            <span className="w-1 h-3 bg-[#2563eb] rounded-full inline-block" /> ผู้ดูแลฉุกเฉินใกล้เคียง
          </h4>
          <span className="text-[10px] font-semibold text-gray-400">ค้นพบผู้ช่วย 3 รายพร้อมบริการ</span>
        </div>

        {MOCK_CAREGIVERS.map((cg) => {
          const isSelected = selectedCaregiver?.id === cg.id;
          return (
            <div
              id={`cg-card-${cg.id}`}
              key={cg.id}
              onClick={() => setSelectedCaregiver(cg)}
              className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex gap-3 ${
                isSelected 
                  ? 'bg-blue-50/70 border-blue-200 ring-2 ring-blue-500/10' 
                  : 'bg-white border-slate-100 hover:border-slate-200'
              }`}
            >
              <div className="w-11 h-11 bg-blue-100 rounded-full border border-blue-200 flex items-center justify-center text-2xl shrink-0">
                {cg.avatar}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs min-w-0 truncate">{cg.name}</h5>
                    <span className="text-[10px] font-semibold text-blue-600 bg-blue-100/60 px-1.5 py-0.5 rounded-md mt-0.5 inline-block border border-blue-200/50">
                      {cg.role}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-orange-600 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full shrink-0">
                    {cg.distance} กม.
                  </span>
                </div>
                
                <p className="text-[10px] text-slate-500 leading-tight mt-1 mb-3">
                  {cg.experience}
                </p>

                {/* Compact Actions footer inside cards */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    id={`btn-cg-call-${cg.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      startMockCall(cg);
                    }}
                    className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 py-1.5 px-3 rounded-xl text-slate-700 font-bold text-[10px] flex items-center justify-center gap-1.5 transition-all shadow-3xs cursor-pointer"
                  >
                    <Phone className="w-3 h-3 text-blue-500" />
                    <span>โทรติดต่อ</span>
                  </button>
                  <button
                    id={`btn-cg-req-${cg.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCaregiver(cg);
                      handleBookCaregiver();
                    }}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 py-1.5 px-3 rounded-xl text-white font-extrabold text-[10px] flex items-center justify-center gap-1.5 transition-all shadow-3xs cursor-pointer"
                  >
                    <span>จ้างด่วนพิเศษ</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Call Simulator dialog (Screen Overlay mockup call panel) */}
      {isCalling && selectedCaregiver && (
        <div id="calling-modal" className="absolute inset-0 bg-slate-900/95 backdrop-blur-xs z-50 flex flex-col items-center justify-between py-12 px-6 text-white text-center">
          
          <div className="flex flex-col items-center space-y-2 mt-4">
            <span className="text-[10px] bg-emerald-500 text-white font-black px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">
              Calling Delivery Caregiver
            </span>
            <h4 className="text-md font-bold mt-4">{selectedCaregiver.name}</h4>
            <span className="text-xs text-gray-400">{selectedCaregiver.role}</span>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-5xl shadow-2xl relative">
              <div className="absolute inset-0 rounded-full border border-emerald-500/40 animate-ping" />
              {selectedCaregiver.avatar}
            </div>
            <div className="font-mono text-lg font-bold tracking-widest text-[#00b074]">
              {callTimer}
            </div>
            <span className="text-xs text-gray-500 max-w-[200px]">
              กำลังจำลองการโทรทดสอบบริการกู้ชีพฉุกเฉินและประสานส่งที่โรงพยาบาล...
            </span>
          </div>

          <button
            id="btn-close-call"
            onClick={endMockCall}
            className="w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all focus:outline-none cursor-pointer"
          >
            <X className="w-6 h-6 stroke-[3]" />
          </button>
        </div>
      )}

      {/* 4. Booking success toast/notification */}
      {bookingStatus === 'success' && selectedCaregiver && (
        <div id="booking-success-toast" className="absolute bottom-4 left-4 right-4 bg-emerald-900 border border-emerald-500/30 text-white p-4 rounded-2xl flex items-center gap-3 shadow-xl z-50 animate-slide-in">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 font-bold">
            ✓
          </div>
          <div className="flex-1">
            <div className="text-xs font-bold">ส่งมอบคำสั่งด่วนเรียบร้อย!</div>
            <p className="text-[9px] text-emerald-300">คุณหมอและผู้แล {selectedCaregiver.name} กำลังเร่งเดินทางมาหาคุณ</p>
          </div>
          <button 
            id="btn-close-toast"
            onClick={() => setBookingStatus('none')} 
            className="text-emerald-400 text-xs p-1"
          >
            ปิด
          </button>
        </div>
      )}

    </div>
  );
}

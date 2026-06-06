import React, { useState } from "react";
import { 
  MapPin, 
  Phone, 
  Map, 
  Navigation, 
  X, 
  PhoneCall, 
  Heart, 
  Building, 
  Activity, 
  ShieldAlert, 
  CheckCircle2, 
  Info,
  Clock,
  ExternalLink
} from "lucide-react";
import { MOCK_CAREGIVERS } from "../constants";
import { Caregiver } from "../types";

interface HospitalItem {
  id: string;
  name: string;
  type: string;
  distance: string;
  phone: string;
  fullPhone: string;
  avatar: string;
  address: string;
  specialty: string;
  latitude: number;
  longitude: number;
  status: "เปิดรักษา 24 ชม." | "เปิดบริการ";
}

const MOCK_HOSPITALS: HospitalItem[] = [
  {
    id: "h1",
    name: "โรงพยาบาลเปาโล พหลโยธิน",
    type: "โรงพยาบาลทั่วไปขนาดใหญ่ (เครือข่ายความดัน & หัวใจ)",
    distance: "0.8",
    phone: "1772",
    fullPhone: "02-271-7000",
    avatar: "🏥",
    address: "670/1 ถนนพหลโยธิน แขวงสามเสนใน เขตพญาไท กรุงเทพฯ",
    specialty: "แผนกเวชศาสตร์ฉุกเฉิน 24 ชั่วโมง, ไฮไลท์การวินิจฉัยโรคลมแดดเฉียบพลัน",
    latitude: 13.7863,
    longitude: 100.5208,
    status: "เปิดรักษา 24 ชม."
  },
  {
    id: "h2",
    name: "โรงพยาบาลพญาไท 2",
    type: "โรงพยาบาลเอกชนชั้นนำ (ศูนย์โรคปอดทางเดินหายใจ)",
    distance: "1.5",
    phone: "1772",
    fullPhone: "02-617-2444",
    avatar: "🏥",
    address: "943 ถนนพหลโยธิน แขวงสามเสนใน เขตพญาไท กรุงเทพฯ",
    specialty: "ศูนย์ตรวจวัดสมรรถภาพปอด, บำบัดสภาวะถุงลมโป่งพองและระคายเคืองจาก PM2.5",
    latitude: 13.7713,
    longitude: 100.5180,
    status: "เปิดรักษา 24 ชม."
  },
  {
    id: "h3",
    name: "โรงพยาบาลวิภาวดี",
    type: "โรงพยาบาลวิเคราะห์อุบัติเหตุและมลพิษ",
    distance: "3.2",
    phone: "02-561-1111",
    fullPhone: "02-561-1111",
    avatar: "🏥",
    address: "51/3 ถนนงามวงศ์วาน แขวงลาดยาว เขตจตุจักร กรุงเทพฯ",
    specialty: "ศูนย์ภัยทางด่วนความตึงเครียดความร้อน, ตู้อบปรับลดระดับอุณหภูมิร่างกาย",
    latitude: 13.8413,
    longitude: 100.5608,
    status: "เปิดรักษา 24 ชม."
  },
  {
    id: "h4",
    name: "โรงพยาบาลสงฆ์ (พญาไท)",
    type: "โรงพยาบาลของรัฐบาลและบริการสาธารณะ",
    distance: "2.1",
    phone: "02-644-9400",
    fullPhone: "02-644-9400",
    avatar: "🏥",
    address: "445 ถนนศรีอยุธยา แขวงทุ่งพญาไท เขตราชเทวี กรุงเทพฯ",
    specialty: "คลินิกพิเศษสู้ภัยฝุ่นพิษหอบหืด, บริการกู้พิกัดแพทย์ชุมชน",
    latitude: 13.7801,
    longitude: 100.5518,
    status: "เปิดบริการ"
  }
];

interface HotlineItem {
  number: string;
  name: string;
  desc: string;
  icon: string;
  tag: string;
  color: string;
  badgeColor: string;
}

const EMERGENCY_HOTLINES: HotlineItem[] = [
  {
    number: "1669",
    name: "สพฉ. สายด่วนช่วยชีวิตกู้ชีพฉุกเฉิน",
    desc: "ส่งรถกู้ชีพพยาบาลรับ-ส่งผู้ป่วยโรคลมแดด (Heatstroke) ชัก เกร็ง หรือหมดสติโดยด่วนที่สุด ฟรี 24 ชั่วโมง",
    icon: "🚨",
    tag: "สายด่วนฉุกเฉินหลัก",
    color: "bg-rose-50 border-rose-100 text-rose-800 hover:bg-rose-100/50",
    badgeColor: "bg-rose-600 text-white"
  },
  {
    number: "1422",
    name: "กรมควบคุมโรคพิทักษ์ปอด",
    desc: "สอบถามคำแนะนำการลดการอักเสบ ปัญหาระบบหายใจจากการเผาและค่าฝุ่นละออง PM2.5 สูงเกินเกณฑ์ลอยตัว",
    icon: "😷",
    tag: "ปรึกษาเรื่องมลพิษ",
    color: "bg-emerald-50 border-emerald-100 text-emerald-800 hover:bg-emerald-100/50",
    badgeColor: "bg-emerald-600 text-white"
  },
  {
    number: "1506",
    name: "สายด่วนสิทธิประกันสังคม",
    desc: "สำรวจสิทธิรักษาพยาบาลฉุกเฉิน 72 ชั่วโมงแรก และสอบถามสิทธิการเบิกจ่ายผ้าปิดปากอนามัยและเวชภัณฑ์",
    icon: "💳",
    tag: "สิทธิพยาบาล",
    color: "bg-blue-50 border-blue-100 text-blue-800 hover:bg-blue-100/50",
    badgeColor: "bg-blue-650 text-white"
  },
  {
    number: "1154",
    name: "หน่วยแพทย์เคลื่อนที่ช่วยเหลือนักท่องเที่ยวและราชการ",
    desc: "ประสานผู้เข้าพักแรมหรืออาคารใกล้เคียงที่มีคลื่นวิกฤตความร้อนสะสมเพื่อขอพัดลมไอเย็นและปฐมพยาบาลเบื้องต้น",
    icon: "☀️",
    tag: "เหตุภัยความร้อน",
    color: "bg-amber-50 border-amber-100 text-amber-800 hover:bg-amber-100/50",
    badgeColor: "bg-amber-600 text-white"
  },
  {
    number: "1323",
    name: "สายด่วนลดความเครียดสุขภาพจิต",
    desc: "ปรึกษาปัญหาจิตตกกังวลเรื่องสถานการณ์ฝุ่นพิษและความเดือดร้อนทางครอบครัวจากลมฟ้าแปรปรวน",
    icon: "🧠",
    tag: "ปรึกษาสุขภาพจิต",
    color: "bg-violet-50 border-violet-100 text-violet-800 hover:bg-violet-100/50",
    badgeColor: "bg-violet-600 text-white"
  }
];

export default function CaregiversView() {
  // Navigation tabs within view
  const [activeTab, setActiveTab] = useState<"caregivers" | "hospitals" | "hotlines">("hospitals");
  
  // Selection States
  const [selectedCaregiver, setSelectedCaregiver] = useState<Caregiver | null>(MOCK_CAREGIVERS[0]);
  const [selectedHospital, setSelectedHospital] = useState<HospitalItem | null>(MOCK_HOSPITALS[0]);

  // Calling States
  const [isCalling, setIsCalling] = useState<boolean>(false);
  const [callTimer, setCallTimer] = useState<string>("00:00");
  const [callPayload, setCallPayload] = useState<{
    name: string;
    subText: string;
    phone: string;
    avatar: string;
    type: "caregiver" | "hospital" | "hotline";
  } | null>(null);

  const [bookingStatus, setBookingStatus] = useState<'none' | 'success'>('none');
  const [bookingMessage, setBookingMessage] = useState<string>("");

  // Start Call Simulator Overlay
  const startCall = (name: string, subText: string, phone: string, avatar: string, type: "caregiver" | "hospital" | "hotline") => {
    setCallPayload({ name, subText, phone, avatar, type });
    setIsCalling(true);
    
    let sec = 0;
    const interval = setInterval(() => {
      sec++;
      const m = Math.floor(sec / 60).toString().padStart(2, '0');
      const s = (sec % 60).toString().padStart(2, '0');
      setCallTimer(`${m}:${s}`);
    }, 1000);

    (window as any)._hospitalCallInterval = interval;
  };

  // End Call Simulator
  const endCall = () => {
    setIsCalling(false);
    setCallTimer("00:00");
    if ((window as any)._hospitalCallInterval) {
      clearInterval((window as any)._hospitalCallInterval);
    }
    setCallPayload(null);
  };

  // Book action for caregivers/hospital reservation
  const handleBookService = (name: string, role: string) => {
    setBookingMessage(`ระบบ All About Today ได้รับเรื่องเพื่อประสานงานหา ${name} (${role}) ด่วนที่สุดแล้วค่ะ พลขับแพทย์ฉุกเฉินจะโทรกลับภายใน 2 นาที`);
    setBookingStatus('success');
    setTimeout(() => {
      setBookingStatus('none');
    }, 5000);
  };

  return (
    <div id="caregivers-and-med-view" className="flex flex-col h-full bg-[#f8f9fa] overflow-hidden">
      
      {/* 1. Dynamic Interactive Simulation Map (Dynamically displays Pins depending on the activeTab) */}
      <div id="hospital-map-hud" className="relative h-[230px] w-full bg-[#e0f2fe] border-b border-slate-200 overflow-hidden shrink-0 shadow-inner">
        
        {/* SVG map background vectors for coordinates */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* River line water decoration */}
          <path d="M-20,240 C120,210 90,80 130,0 L190,0 C150,90 170,230 20,240 Z" fill="#93c5fd" opacity="0.4" />
          
          {/* Park green zones */}
          <rect x="230" y="20" width="100" height="70" rx="12" fill="#86efac" opacity="0.3" />
          <circle cx="90" cy="190" r="35" fill="#86efac" opacity="0.25" />

          {/* Grids / Roads layout helper */}
          <line x1="0" y1="120" x2="600" y2="120" stroke="#ffffff" strokeWidth="6" />
          <line x1="0" y1="120" x2="600" y2="120" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="3 3" />
          
          <line x1="170" y1="0" x2="170" y2="300" stroke="#ffffff" strokeWidth="6" />
          <line x1="170" y1="0" x2="170" y2="300" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="3 3" />

          {/* Map labels */}
          <text x="45" y="113" fill="#64748b" fontSize="8" fontWeight="bold">ถนนพหลโยธิน Phahonyothin Rd</text>
          <text x="180" y="60" fill="#64748b" fontSize="8" fontWeight="bold" transform="rotate(90 180 60)">ถนนวิภาวดีรังสิต Vibhavadi</text>
        </svg>

        {/* Center blue radar marker indicator (User Location Point) */}
        <div className="absolute left-[170px] top-[120px] -ml-4 -mt-4 w-8 h-8 flex items-center justify-center pointer-events-none">
          <div className="absolute w-14 h-14 bg-blue-500/15 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
          <div className="absolute w-8 h-8 bg-blue-500/30 rounded-full border border-white" />
          <div className="w-3.5 h-3.5 bg-blue-600 rounded-full shadow-lg border-2 border-white shrink-0" />
        </div>

        {/* Floating current locate address bar */}
        <div className="absolute bottom-2 left-2 bg-slate-950/70 backdrop-blur-md rounded-xl py-1.5 px-3 border border-slate-700/50 flex items-center gap-1.5 shadow-sm max-w-[90%]">
          <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <p className="text-[9px] text-slate-100 truncate font-semibold">📍 ตำแหน่งปัจจุบันของคุณ: พญาไท / จตุจักร (กรุงเทพฯ)</p>
        </div>

        {/* Tab 1 Markers: Caregivers map pins */}
        {activeTab === "caregivers" && MOCK_CAREGIVERS.map((cg, idx) => {
          const coordOffsets = [
            { left: "110px", top: "50px" },
            { left: "220px", top: "150px" },
            { left: "70px", top: "160px" }
          ];
          const isSelected = selectedCaregiver?.id === cg.id;
          return (
            <button
              id={`map-pin-cg-${cg.id}`}
              key={cg.id}
              onClick={() => setSelectedCaregiver(cg)}
              className="absolute group transition-transform duration-300 hover:scale-115 focus:outline-none cursor-pointer"
              style={{ left: coordOffsets[idx].left, top: coordOffsets[idx].top }}
            >
              <div className="flex flex-col items-center">
                <div className={`px-2 py-0.5 rounded-md text-[8px] font-black shadow-md border whitespace-nowrap mb-0.5 max-w-[85px] truncate transition-colors ${
                  isSelected ? 'border-blue-500 bg-blue-600 text-white' : 'border-slate-250 bg-white text-slate-800'
                }`}>
                  {cg.name.split(" ")[1] || cg.name} ({cg.distance} กม.)
                </div>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm shadow-md transition-all ${
                  isSelected 
                    ? 'bg-blue-600 border-2 border-white text-white scale-110 ring-4 ring-blue-500/20' 
                    : 'bg-white border hover:bg-blue-50 text-slate-700'
                }`}>
                  {cg.avatar}
                </div>
              </div>
            </button>
          );
        })}

        {/* Tab 2 Markers: Hospitals map pins */}
        {activeTab === "hospitals" && MOCK_HOSPITALS.map((hosp, idx) => {
          const coordOffsets = [
            { left: "210px", top: "45px" },
            { left: "250px", top: "90px" },
            { left: "80px", top: "140px" },
            { left: "110px", top: "75px" }
          ];
          const isSelected = selectedHospital?.id === hosp.id;
          return (
            <button
              id={`map-pin-hosp-${hosp.id}`}
              key={hosp.id}
              onClick={() => setSelectedHospital(hosp)}
              className="absolute group transition-transform duration-300 hover:scale-115 focus:outline-none cursor-pointer"
              style={{ left: coordOffsets[idx].left, top: coordOffsets[idx].top }}
            >
              <div className="flex flex-col items-center">
                <div className={`px-2 py-0.5 rounded-md text-[8px] font-black shadow-md border whitespace-nowrap mb-0.5 max-w-[95px] truncate transition-colors ${
                  isSelected ? 'border-rose-500 bg-rose-600 text-white' : 'border-slate-250 bg-white text-slate-800'
                }`}>
                  {hosp.name} ({hosp.distance} กม.)
                </div>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm shadow-md transition-all ${
                  isSelected 
                    ? 'bg-rose-600 border-2 border-white text-white scale-115 ring-4 ring-rose-500/20' 
                    : 'bg-slate-900 border border-slate-700 hover:bg-slate-850 text-white'
                }`}>
                  🏥
                </div>
              </div>
            </button>
          );
        })}

        {/* Tab 3 Markers: Medical Hotlines map pins (Pulsating central hub mockup) */}
        {activeTab === "hotlines" && (
          <div className="absolute left-[260px] top-[140px] flex flex-col items-center pointer-events-none">
            <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center text-xl text-white shadow-lg animate-bounce border-2 border-white">
              🚨
            </div>
            <div className="px-2 py-1 bg-rose-950 font-black text-[9px] text-white border border-rose-500 rounded-lg shadow-sm whitespace-nowrap mt-1">
              สพฉ. 1669: ศูนย์ควบคุมฉุกเฉิน
            </div>
            <div className="absolute w-24 h-24 -top-7 bg-rose-500/10 rounded-full animate-ping pointer-events-none" style={{ animationDuration: '4s' }} />
          </div>
        )}

        {/* GPS Locator active header tag */}
        <div className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-md text-[10px] text-white py-1.5 px-3 rounded-xl border border-slate-700/50 flex items-center gap-1 font-mono hover:bg-slate-900 transition-colors">
          <Navigation className="w-3.5 h-3.5 text-blue-400 fill-blue-500 stroke-[2] animate-pulse" /> GPS Live: 13.7563, 100.5018
        </div>
      </div>

      {/* 2. Horizontal Primary Filter Tabs */}
      <div id="service-category-tabs" className="bg-white p-2.5 border-b border-slate-200 shadow-3xs flex gap-2 overflow-x-auto select-none shrink-0 scrollbar-none">
        
        {/* Hospitals tab */}
        <button
          id="tab-select-hospitals"
          onClick={() => setActiveTab("hospitals")}
          className={`px-3.5 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer border ${
            activeTab === "hospitals"
              ? "bg-rose-500 border-rose-600 text-white shadow-sm"
              : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600"
          }`}
        >
          <Building className="w-4 h-4 shrink-0" />
          สถานพยาบาล &amp; โรงพยาบาลใกล้เคียง
        </button>

        {/* Hotlines tab */}
        <button
          id="tab-select-hotlines"
          onClick={() => setActiveTab("hotlines")}
          className={`px-3.5 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer border ${
            activeTab === "hotlines"
              ? "bg-amber-600 border-amber-700 text-white shadow-sm"
              : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600"
          }`}
        >
          <PhoneCall className="w-4 h-4 shrink-0" />
          สายด่วนกู้ภัย &amp; โรงพยาบาล (24 ชม.)
        </button>

        {/* Caregivers tab */}
        <button
          id="tab-select-caregivers"
          onClick={() => setActiveTab("caregivers")}
          className={`px-3.5 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer border ${
            activeTab === "caregivers"
              ? "bg-blue-600 border-blue-700 text-white shadow-sm"
              : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600"
          }`}
        >
          <Activity className="w-4 h-4 shrink-0" />
          ผู้ดูแลฉุกเฉินส่วนตัวใกล้ใกล้คุณ
        </button>
      </div>

      {/* 3. Render list sections dynamically */}
      <div id="service-list-workspace" className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        
        {/* Booking alert feedback on demand */}
        {bookingStatus === 'success' && (
          <div id="booking-success-indicator" className="bg-emerald-50 border border-emerald-250 p-4 rounded-2xl flex items-start gap-3 shadow-md animate-fade-in">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h6 className="font-bold text-xs text-emerald-800">ประสานงานฉุกเฉินสำเร็จเรียบร้อย!</h6>
              <p className="text-[10px] text-emerald-700 font-medium leading-normal mt-0.5">{bookingMessage}</p>
            </div>
          </div>
        )}

        {/* TAB A: HOSPITALS LIST VIEW */}
        {activeTab === "hospitals" && (
          <div className="space-y-3.5 animate-fade-in text-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-3 bg-rose-500 rounded-full inline-block" /> โรงพยาบาลใกล้เคียง พญาไท-จตุจักร
                </h5>
                <p className="text-[9px] text-slate-400 font-medium mt-0.5">คัดเลือกโรงพยาบาลที่มีขีดความสามารถพร้อมช่วยเหลือระบบหายใจและโรคลมแดด</p>
              </div>
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100 uppercase shrink-0">
                {MOCK_HOSPITALS.length} แห่งในพิกัด
              </span>
            </div>

            {/* Hospitals loop cards rendering */}
            <div className="space-y-3">
              {MOCK_HOSPITALS.map((hosp) => {
                const isSelected = selectedHospital?.id === hosp.id;
                return (
                  <div
                    key={hosp.id}
                    id={`hospital-card-${hosp.id}`}
                    onClick={() => setSelectedHospital(hosp)}
                    className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col md:flex-row gap-4 justify-between md:items-center ${
                      isSelected 
                        ? 'bg-rose-50/65 border-rose-350 ring-2 ring-rose-500/5' 
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-3xs'
                    }`}
                  >
                    <div className="flex gap-3 min-w-0">
                      {/* Left icon avatar panel */}
                      <div className="w-12 h-12 bg-rose-100 text-rose-650 border border-rose-200/50 rounded-2xl flex items-center justify-center text-2xl shrink-0">
                        {hosp.avatar}
                      </div>

                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h6 className="font-extrabold text-xs text-slate-900 truncate leading-tight">{hosp.name}</h6>
                          <span className="text-[8px] font-black bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-250 shrink-0">
                            {hosp.status}
                          </span>
                        </div>
                        <p className="text-[9px] text-slate-400 font-semibold">{hosp.type}</p>
                        
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <p className="text-[10px] text-slate-500 truncate">{hosp.address}</p>
                        </div>

                        {/* Critical specialties feature pill */}
                        <div className="bg-slate-100 text-slate-650 border border-slate-200 rounded-lg p-2 mt-1">
                          <p className="text-[9px] font-bold text-slate-700">🩺 จุดเน้นรับมือเฉพาะด้าน:</p>
                          <p className="text-[9px] text-slate-500 leading-normal">{hosp.specialty}</p>
                        </div>
                      </div>
                    </div>

                    {/* Right side information & Action triggers */}
                    <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 gap-2 shrink-0">
                      <div className="text-right">
                        <span className="text-[9px] text-slate-400 block font-semibold leading-none">ระยะทางจากนี่</span>
                        <span className="text-xs font-black text-rose-600 font-mono inline-block mt-1 bg-rose-100/45 px-2 py-0.5 rounded-full border border-rose-200/30">
                          🚘 {hosp.distance} กม.
                        </span>
                      </div>

                      {/* Call and Book hospital buttons */}
                      <div className="flex gap-2 w-full md:w-auto">
                        <button
                          id={`btn-call-hosp-${hosp.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            startCall(hosp.name, hosp.type, hosp.fullPhone, hosp.avatar, "hospital");
                          }}
                          className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-bold text-[10px] flex items-center justify-center gap-1 shadow-3xs cursor-pointer hover:border-slate-350"
                        >
                          <Phone className="w-3 h-3 text-rose-500" />
                          <span>โทรสายตรง</span>
                        </button>
                        <button
                          id={`btn-book-hosp-${hosp.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBookService(hosp.name, "โรงพยาบาลเครือข่าย");
                          }}
                          className="px-3.5 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold text-[10px] flex items-center justify-center gap-1 shadow-3xs cursor-pointer"
                        >
                          <span>ประสานงานด่วน</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Hospital guideline warning */}
            <div className="bg-rose-50 border border-rose-250 rounded-2xl p-4 flex gap-3 text-rose-900 mt-2">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h6 className="font-extrabold text-xs">ข้อควรรู้ในการเลือกสถานพยาบาลยามค่าฝุ่นหนาแน่น / ร้อนจัด</h6>
                <p className="text-[10px] text-rose-700 leading-normal mt-0.5">
                  หากท่านมีประวัติการเป็นโรคภูมิแพ้ หรือเป็นกลุ่มเปราะบาง (ผู้สูงอายุ หรือผู้มีโรคความดันสูง) เมื่อดัชนีความร้อนถึงระดับส้ม-แดงและค่าฝุ่น PM2.5 เกินกว่า 75 µg/m³ ขอแนะนำให้เลือกติดต่อโรงพยาบาลศูนย์เฉพาะด้านหัวใจหรือเดินหายใจใกล้ที่สุดทันที
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB B: EMERGENCY CAREGIVERS VIEW */}
        {activeTab === "caregivers" && (
          <div className="space-y-4 animate-fade-in text-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-3 bg-blue-600 rounded-full inline-block" /> ทีมผู้ดูแลและพยาบาลวิชาชีพฉุกเฉินใกล้คุณ
                </h5>
                <p className="text-[9px] text-slate-400 font-medium mt-0.5">พยาบาลฉุกเฉินพร้อมเดินทางไปสนับสนุนออกซิเจนและการเช็ดตัวลดไข้โรงเรือนด่วน</p>
              </div>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 uppercase shrink-0">
                {MOCK_CAREGIVERS.length} ผู้ดูแลพร้อมบริการ
              </span>
            </div>

            {/* Loop rendering caregivers list */}
            <div className="space-y-3">
              {MOCK_CAREGIVERS.map((cg) => {
                const isSelected = selectedCaregiver?.id === cg.id;
                return (
                  <div
                    key={cg.id}
                    id={`caregiver-card-${cg.id}`}
                    onClick={() => setSelectedCaregiver(cg)}
                    className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col sm:flex-row gap-4 justify-between sm:items-center ${
                      isSelected 
                        ? 'bg-blue-50/65 border-blue-350 ring-2 ring-blue-500/5' 
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-3xs'
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="w-12 h-12 bg-blue-100 text-slate-850 rounded-full border border-blue-200/50 flex items-center justify-center text-2.5xl shrink-0">
                        {cg.avatar}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h6 className="font-extrabold text-xs text-slate-900 leading-tight">{cg.name}</h6>
                          <span className="text-[8px] font-black bg-blue-100/60 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200/50">
                            {cg.role}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-normal">{cg.experience}</p>
                        <p className="text-[9px] text-slate-400 font-bold">พิกัดความปลอดภัย: ใกล้เขตสามเสนใน</p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 gap-2 shrink-0">
                      <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 border border-orange-100 px-2.5 py-0.5 rounded-full">
                        🚗 {cg.distance} กม.
                      </span>

                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          id={`btn-call-cg-${cg.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            startCall(cg.name, cg.role, cg.phone, cg.avatar, "caregiver");
                          }}
                          className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-bold text-[10px] flex items-center justify-center gap-1 shadow-3xs cursor-pointer hover:border-slate-300"
                        >
                          <Phone className="w-3.5 h-3.5 text-blue-500" />
                          <span>โทรติดต่อ</span>
                        </button>
                        <button
                          id={`btn-book-cg-${cg.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBookService(cg.name, cg.role);
                          }}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-[10px] flex items-center justify-center gap-1 shadow-3xs cursor-pointer"
                        >
                          <span>จ้างดูแลด่วน</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB C: PUBLIC HEALTH EMERGENCY HOTLINES VIEW */}
        {activeTab === "hotlines" && (
          <div className="space-y-4 animate-fade-in text-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-3 bg-amber-600 rounded-full inline-block" /> สายด่วนช่วยเหลือทางปฐมพยาบาล &amp; บรรเทาสาธารณภัยโรงพยาบาล 24 ชม.
                </h5>
                <p className="text-[9px] text-slate-400 font-medium mt-0.5">เชื่อมต่อโทรออกสายด่วนทันทีเมื่อก้าวสู่ช่วงภาวะวิกฤตความร้อนจัดหรือมลพิษฝุ่นแดง</p>
              </div>
            </div>

            {/* Hotlines grids rendering */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {EMERGENCY_HOTLINES.map((hotline) => (
                <div
                  key={hotline.number}
                  id={`hotline-card-${hotline.number}`}
                  className="bg-white border border-slate-200 hover:border-slate-350 rounded-2.5xl p-4 flex flex-col justify-between transition-all shadow-3xs hover:shadow-xs group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-2.5xl">{hotline.icon}</span>
                        <span className="font-extrabold text-xs text-slate-900 group-hover:text-blue-600 transition-colors">
                          {hotline.name}
                        </span>
                      </div>
                      <span className="text-[8px] font-black bg-slate-100 text-slate-600 border border-slate-200 rounded px-1.5 py-0.5 uppercase tracking-wider shrink-0">
                        {hotline.tag}
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-500 leading-normal">
                      {hotline.desc}
                    </p>
                  </div>

                  {/* Hotline Action call bar */}
                  <div className="pt-3.5 border-t border-slate-100 mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping pointer-events-none" />
                      <span className="text-[9px] text-slate-400 font-bold uppercase">เครือข่ายตอบกลับทันควัน</span>
                    </div>

                    {/* Styled Hotline Call Trigger */}
                    <button
                      id={`btn-call-hotline-${hotline.number}`}
                      onClick={() => startCall(hotline.name, hotline.tag, hotline.number, hotline.icon, "hotline")}
                      className="px-4 py-2 bg-[#fcf8f2] hover:bg-amber-100/60 border border-amber-200 rounded-xl transition-all cursor-pointer text-amber-800 font-black text-xs flex items-center gap-1.5 shadow-3xs"
                    >
                      <Phone className="w-3.5 h-3.5 text-amber-500 stroke-[2.5]" />
                      <span>โทรด่วนเบอร์ {hotline.number}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Emergency instructions tip */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 text-amber-900 items-start">
              <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h6 className="font-extrabold text-xs">คำแนะนำการรับมือยามพบลมแดดเฉียบพลันก่อนโทร 1669</h6>
                <ul className="list-disc list-inside text-[10px] text-amber-800 space-y-1 pl-1">
                  <li>รีบนำผู้ป่วยเข้าที่ร่ม คลายปกเสื้อผ้าออกให้หลวมที่สุด</li>
                  <li>ใช้ผ้าชุบน้ำเย็นประคบตามข้อพับ ซอกคอ รักแร้ เพื่อช่วยระบายความร้อนโดยด่วน</li>
                  <li>หากหมดสติ ให้ยกขาขึ้นสูงเล็กน้อย และห้ามกรอกน้ำเข้าปากจนกว่าจะตื่นตัว</li>
                </ul>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 4. REAL-TIME TELEPHONE CALL SIMULATION POP-UP OVERLAY */}
      {isCalling && callPayload && (
        <div id="active-call-overlay" className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-55 flex flex-col items-center justify-between py-12 px-6 text-white text-center select-none animate-fade-in">
          
          {/* Upper Info Ring */}
          <div className="flex flex-col items-center space-y-1 mt-6">
            <div className="flex items-center gap-2 bg-rose-600 text-white font-black text-[9px] px-3.5 py-1 rounded-full uppercase tracking-widest animate-pulse shadow-md">
              <PhoneCall className="w-3 h-3 text-white spin-scale" />
              <span>สายโทรศัพท์เชื่อมต่อการแพทย์ All About Today</span>
            </div>
            <h4 className="text-md font-extrabold mt-6 text-slate-100">{callPayload.name}</h4>
            <span className="text-xs text-blue-400 font-bold bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-lg">
              {callPayload.subText}
            </span>
          </div>

          {/* Central Call Interaction Ripple Visualizer */}
          <div className="flex flex-col items-center space-y-5">
            <div className="w-28 h-28 rounded-full bg-blue-500/10 border-2 border-emerald-500 flex items-center justify-center text-5xl shadow-2xl relative">
              <div className="absolute inset-0 rounded-full border border-emerald-500/30 animate-ping" style={{ animationDuration: '2.5s' }} />
              <div className="absolute -inset-4 rounded-full border border-teal-500/20 animate-ping animate-pulse" style={{ animationDuration: '4s' }} />
              {callPayload.avatar}
            </div>

            {/* Timer stopwatch */}
            <div className="font-mono text-2xl font-black tracking-widest text-[#10b981] drop-shadow-sm">
              {callTimer}
            </div>
            
            <p className="text-[11px] text-slate-400 max-w-[280px] leading-relaxed">
              เบอร์โทรติดต่อ: <strong className="text-emerald-400 text-xs font-mono">{callPayload.phone}</strong>
              <span className="block text-[10px] text-slate-500 mt-2 font-medium">กำลังจำลองเชื่อมวิเคราะห์ตำแหน่งจีพีเอสร่วมรับมือฉุกเฉินและรายงานตัวเมือง...</span>
            </p>
          </div>

          {/* End/Hang-up Action button */}
          <div className="pb-4">
            <button
              id="btn-active-call-hang-up"
              onClick={endCall}
              className="w-16 h-16 bg-red-650 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-red-500/15 transition-all focus:outline-none pointer-events-auto cursor-pointer animate-pulse active:scale-95"
              title="วางสายโทรศัพท์"
            >
              <X className="w-7 h-7 stroke-[3]" />
            </button>
            <span className="text-[10px] text-slate-500 font-bold block mt-2 uppercase tracking-wide">กดเพื่อวางสายเสมือนจริง</span>
          </div>
        </div>
      )}

    </div>
  );
}

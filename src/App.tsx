import React, { useState, useEffect } from "react";
import { 
  Menu, 
  Bell, 
  BookOpen, 
  ClipboardCheck, 
  MessageSquare, 
  MapPin, 
  Home, 
  Smartphone, 
  SlidersHorizontal,
  ChevronRight,
  Info,
  ShieldCheck,
  CheckCircle,
  Clock,
  Heart,
  Droplet,
  ShieldAlert,
  Settings,
  User,
  LogOut,
  Coins
} from "lucide-react";
import { ViewType, UserProfile } from "./types";
import { DEFAULT_USER_PROFILE } from "./constants";

// Import modular screens
import HomeView from "./components/HomeView";
import KnowledgeView from "./components/KnowledgeView";
import ScreeningView from "./components/ScreeningView";
import PreventionView from "./components/PreventionView";
import CaregiversView from "./components/CaregiversView";
import DoctorChatView from "./components/DoctorChatView";
import { SettingsView, NotificationsView } from "./components/SettingsAndNotifViews";
import MenuSidebar from "./components/MenuSidebar";
import RegistrationView from "./components/RegistrationView";

const menuItems = [
  { id: 'home' as ViewType, label: 'หน้าแรก', icon: Home },
  { id: 'knowledge' as ViewType, label: 'ความรู้', icon: BookOpen },
  { id: 'screening' as ViewType, label: 'คัดกรองอาการ', icon: ClipboardCheck },
  { id: 'prevention' as ViewType, label: 'การป้องกัน', icon: ShieldAlert },
  { id: 'doctor' as ViewType, label: 'ปรึกษาแพทย์ออนไลน์', icon: MessageSquare },
  { id: 'caregivers' as ViewType, label: 'ผู้ดูแล & สถานพยาบาล', icon: MapPin },
  { id: 'notifications' as ViewType, label: 'การแจ้งเตือน', icon: Bell },
  { id: 'settings' as ViewType, label: 'ตั้งค่า', icon: Settings },
];

export default function App() {
  // Global State for Registration Onboarding
  const [isRegistered, setIsRegistered] = useState<boolean>(() => {
    return localStorage.getItem("health_is_registered") === "true";
  });

  // Global States
  const [currentView, setView] = useState<ViewType>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [knowledgeTabOverride, setKnowledgeTabOverride] = useState<'pm25' | 'heatstroke'>('pm25');
  
  // Environment Metrics Simulation inputs
  const [pm25, setPm25] = useState<number>(82); // default mockup dust value
  const [heatIndex, setHeatIndex] = useState<number>(41); // default mockup heat index
  const [temperature, setTemperature] = useState<number>(36); // default mockup temp

  // Daily Web Points & Streak State (Durable Persistence)
  const [userPoints, setUserPoints] = useState<number>(() => {
    return Number(localStorage.getItem("health_user_points") || "20"); // starts at 20 initial thank-you points
  });
  const [checkInStreak, setCheckInStreak] = useState<number>(() => {
    return Number(localStorage.getItem("health_check_in_streak") || "0");
  });
  const [lastCheckInDate, setLastCheckInDate] = useState<string | null>(() => {
    return localStorage.getItem("health_last_check_in_date");
  });

  // User Profile
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("health_user_profile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_USER_PROFILE;
      }
    }
    // Default to a partially blank state or Default mockup for a clean register sheet
    return {
      name: "",
      age: 48,
      gender: "ชาย",
      hasCongenitalDisease: false,
      congenitalDiseaseDetails: "",
    };
  });
  const [settingsSavedAlert, setSettingsSavedAlert] = useState(false);

  // Auto notification indicator based on sliders
  const isHighPM = pm25 >= 75;
  const isHighHeat = heatIndex >= 41;
  const hasCriticalWarning = isHighPM || isHighHeat;

  // Sync Knowledge view tab redirect helper
  const handleNavigateToKnowledge = (tab: 'pm25' | 'heatstroke') => {
    setKnowledgeTabOverride(tab);
    setView('knowledge');
  };

  const handleSaveSettings = () => {
    localStorage.setItem("health_user_profile", JSON.stringify(profile));
    setSettingsSavedAlert(true);
    setTimeout(() => {
      setSettingsSavedAlert(false);
    }, 3000);
  };

  const handleCompleteRegistration = () => {
    localStorage.setItem("health_is_registered", "true");
    localStorage.setItem("health_user_profile", JSON.stringify(profile));
    setIsRegistered(true);
  };

  const handleResetRegistration = () => {
    localStorage.removeItem("health_is_registered");
    localStorage.removeItem("health_user_profile");
    setProfile({
      name: "",
      age: 48,
      gender: "ชาย",
      hasCongenitalDisease: false,
      congenitalDiseaseDetails: "",
    });
    setIsRegistered(false);
    setView('home');
  };

  // Get view header corresponding exactly to the mockup design screens
  const getViewHeaderName = () => {
    switch (currentView) {
      case 'home':
        return "ALL ABOUT TODAY";
      case 'knowledge':
        return "ความรู้";
      case 'screening':
        return "คัดกรอง";
      case 'prevention':
        return "การป้องกัน";
      case 'doctor':
        return "ปรึกษาแพทย์";
      case 'caregivers':
        return "ผู้ดูแล & สถานพยาบาล";
      case 'notifications':
        return "การแจ้งเตือน";
      case 'settings':
        return "ตั้งค่าผู้ป่วย";
      default:
        return "ALL ABOUT TODAY";
    }
  };

  if (!isRegistered) {
    return (
      <RegistrationView 
        profile={profile}
        setProfile={setProfile}
        onComplete={handleCompleteRegistration}
      />
    );
  }

  return (
    <div id="web-portal-root" className="min-h-screen bg-[#f8fafc] font-sans antialiased text-slate-800 flex flex-col h-screen overflow-hidden">
      
      {/* PROFESSIONAL WEB PORTAL SYSTEM HEADER */}
      <header id="desktop-app-header" className="bg-[#0f172a] border-b border-slate-800 px-6 py-4 flex items-center justify-between shrink-0 shadow-md z-30 text-white select-none">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-2 md:p-2.5 rounded-2xl shadow-md shadow-blue-500/15">
            <Heart className="w-5 h-5 md:w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-extrabold tracking-tight flex items-center gap-2 text-slate-100">
              All About Today <span className="text-[9px] md:text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 py-0.5 px-2 rounded font-bold uppercase tracking-wider">Health Portal</span>
            </h1>
            <p className="text-[10px] md:text-xs text-slate-400 hidden sm:block font-medium">ระบบปัญญาประดิษฐ์วิเคราะห์ฝุ่น PM2.5 แดดจัด และความเสี่ยงลมแดง</p>
          </div>
        </div>

        {/* Global real-time sensors metrics indicators */}
        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex items-center gap-2 text-[11px] md:text-xs font-semibold">
            {/* PM2.5 Status Badge */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
              pm25 >= 75 
                ? "bg-amber-950/40 border-amber-500/30 text-amber-400" 
                : "bg-slate-800/80 border-slate-700 text-[#10b981]"
            }`}>
              <span className={`w-2 h-2 rounded-full ${pm25 >= 75 ? "bg-amber-500 animate-ping" : "bg-emerald-500"}`} />
              <span className="hidden sm:inline">ฝุ่นละออง PM2.5:</span> <strong>{pm25} µg/m³</strong>
            </div>

            {/* Heat Index Status Badge */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
              heatIndex >= 41 
                ? "bg-rose-950/40 border-rose-500/30 text-rose-400" 
                : "bg-slate-800/80 border-slate-700 text-[#10b981]"
            }`}>
              <span className={`w-2 h-2 rounded-full ${heatIndex >= 41 ? "bg-rose-500 animate-ping" : "bg-emerald-500"}`} />
              <span className="hidden sm:inline">ดัชนีความร้อน:</span> <strong>{heatIndex}°C</strong>
            </div>
          </div>

          {/* Real-time Coins Reward Balance */}
          <div 
            id="header-points-badge"
            onClick={() => setView('home')}
            className="flex bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 rounded-xl px-2.5 py-1.5 items-center gap-1.5 text-xs text-amber-400 font-bold font-mono cursor-pointer transition-colors"
            title="แต้มสะสมป้องภัยคัดกรองคลิกเพื่อกลับหน้าเช็คอิน"
          >
            <Coins className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="hidden sm:inline text-slate-300 font-sans font-semibold">แต้ม:</span>
            <span>{userPoints}</span>
          </div>

          {/* Toast Notification Bell with indicator */}
          <div className="relative">
            <button
              id="top-bell-nav-btn"
              onClick={() => setView('notifications')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:text-white transition-all cursor-pointer relative"
              aria-label="เปิดหน้าแจ้งเตือน"
            >
              <Bell className="w-4 h-4 md:w-5 h-5" />
              {hasCriticalWarning && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-slate-900 animate-bounce" />
              )}
            </button>
          </div>

          {/* Mobile hamburger menu draw trigger */}
          <button
            id="mobile-drawer-trigger-btn"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
            aria-label="เปิดแถบข้างเมนู"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* DASHBOARD SYSTEM WORKSPACE */}
      <div className="flex-1 flex min-h-0 relative">
        
        {/* DESKTOP STATIC CONTROLLER SIDE PANEL (Visible permanently only on desktop screens) */}
        <aside id="desktop-sidebar" className="hidden lg:flex w-64 bg-[#0f172a] text-slate-300 border-r border-[#1e293b] flex-col justify-between shrink-0 z-20">
          
          {/* User profile health index card widget */}
          <div className="p-4 border-b border-[#1e293b]">
            <div 
              id="desktop-profile-widget"
              onClick={() => setView('settings')}
              className="bg-[#1e293b] hover:bg-slate-800 rounded-2xl p-3 flex items-center gap-3 transition-colors cursor-pointer border border-[#1e293b]/50 group"
            >
              <div className="w-10 h-10 rounded-full border border-blue-500/30 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-lg text-white shadow-inner shrink-0">
                <User className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5 leading-none">ผู้ใช้ลงทะเบียน</p>
                <p className="font-semibold text-xs text-slate-100 truncate">{profile.name || "สมเกียรติ รักดี"}</p>
                <div className="flex items-center gap-1 mt-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded-md w-fit">
                  <Coins className="w-3 h-3 text-amber-500 shrink-0" />
                  <span className="text-[10px] font-bold font-mono leading-none">{userPoints} แต้ม</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation controls menu links */}
          <nav id="desktop-sidebar-nav" className="flex-1 py-4 space-y-0.5 overflow-y-auto scrollbar-none">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`desktop-menu-item-${item.id}`}
                  onClick={() => setView(item.id)}
                  className={`flex items-center gap-3.5 w-full px-5 py-3 text-left transition-all text-xs font-semibold border-l-4 ${
                    isActive 
                      ? "bg-[#1e293b] text-white font-bold border-blue-500" 
                      : "text-slate-400 hover:bg-[#1e293b]/40 hover:text-slate-200 border-transparent"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-slate-500"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick interactive situations simulator parameters for seamless test scenarios */}
          <div className="p-4 border-t border-[#1e293b] space-y-2 bg-[#090d16]">
            <p className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5 select-none">
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-500" /> จำลองสถานการณ์ด่วน:
            </p>
            
            <button
              id="desktop-preset-danger-heat"
              onClick={() => {
                setPm25(32);
                setHeatIndex(44);
                setTemperature(38);
                setView('home');
              }}
              className="w-full text-left bg-rose-950/25 hover:bg-rose-900/30 border border-red-950/80 px-2.5 py-2 rounded-xl transition-all block cursor-pointer group"
            >
              <div className="text-[10px] font-bold text-red-400 group-hover:text-red-350">สถานการณ์: แดดจัดอันตราย (44°C)</div>
              <div className="text-[8px] text-slate-400 mt-0.5">ฝุ่นละอองต่ำ (32) • ความร้อนสูงสุดวิกฤตความเสี่ยงฮีทสโตรก</div>
            </button>

            <button
              id="desktop-preset-danger-pm"
              onClick={() => {
                setPm25(165);
                setHeatIndex(28);
                setTemperature(26);
                setView('home');
              }}
              className="w-full text-left bg-orange-950/25 hover:bg-orange-900/30 border border-orange-950/80 px-2.5 py-2 rounded-xl transition-all block cursor-pointer group"
            >
              <div className="text-[10px] font-bold text-orange-400 group-hover:text-orange-350">สถานการณ์: หมอกควันฝุ่นส้ม (165)</div>
              <div className="text-[8px] text-slate-400 mt-0.5">ฝุ่นมลพิษสูงสุดเกณฑ์วิกฤต • อุณหภูมิฤดูหนาวปกติ (28°C)</div>
            </button>
          </div>

          {/* System versioning indicator */}
          <div className="p-4 border-t border-[#1e293b] flex items-center justify-between text-[9px] text-slate-500 select-none">
            <span className="font-mono">Web Portal Mode</span>
            <button
              onClick={() => {
                alert("ยินดีต้อนรับสู่ระบบประเมินความปลอดภัย 'All About Today' ในรูปแบบเว็บไซต์เต็มรูปแบบค่ะ!");
              }}
              className="text-blue-400 hover:text-blue-300 font-bold"
            >
              คู่มือแนะนำ
            </button>
          </div>
        </aside>

        {/* MOBILE OVERLAY DRAWER SIDEBAR (Operable on small screens only) */}
        <MenuSidebar 
          currentView={currentView}
          setView={setView}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          profile={profile}
        />

        {/* MAIN WEB LAYOUT CONTENT SCREEN VIEWPORT */}
        <main className="flex-1 min-w-0 bg-[#f8fafc] flex flex-col relative overflow-hidden">
          
          {/* Active View Subheader Title containing detailed guidelines and tags for professional design look */}
          <div className="px-6 py-4 bg-white border-b border-slate-250 flex flex-col sm:flex-row sm:items-center sm:justify-between shrink-0 gap-3 select-none">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-blue-600 rounded-full shrink-0" />
              <h2 className="text-xs md:text-sm font-extrabold text-slate-800 tracking-tight flex items-center gap-1.5">
                {getViewHeaderName()}
              </h2>
            </div>
            
            {/* Context action tip instructions */}
            <div className="text-[10px] text-slate-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-semibold w-fit">
              <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" /> ข้อมูลอัปเดตอัจฉริยะล่วงหน้าตามเวลาจริง
            </div>
          </div>

          {/* INTERNAL CONTENT VIEW CONTAINER - Elegant card framework filling the responsive screen workspace */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-none">
            
            {/* Custom save settings toast within viewport */}
            {settingsSavedAlert && (
              <div className="absolute top-4 left-6 right-6 bg-emerald-600 border border-emerald-500 shadow-xl text-white py-3 px-5 rounded-2xl flex items-center justify-center gap-2.5 z-45 animate-fade-in text-xs font-bold text-center">
                <CheckCircle className="w-5 h-5 text-white shrink-0" /> บันทึกข้อมูลประวัติสุขภาพผู้ป่วยเรียบร้อย! ข้อมูลดัชนีนำเข้าถูกปรับปรุงเสร็จสิ้น
              </div>
            )}

            {/* Render the selected view as a gorgeous responsive dashboard card */}
            <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200/70 shadow-xs overflow-hidden h-fit">
              {currentView === 'home' && (
                <HomeView 
                  pm25={pm25}
                  setPm25={setPm25}
                  heatIndex={heatIndex}
                  setHeatIndex={setHeatIndex}
                  temperature={temperature}
                  setTemperature={setTemperature}
                  onNavigateToKnowledge={handleNavigateToKnowledge}
                  onOpenSidebar={() => setSidebarOpen(true)}
                  userPoints={userPoints}
                  setUserPoints={setUserPoints}
                  checkInStreak={checkInStreak}
                  setCheckInStreak={setCheckInStreak}
                  lastCheckInDate={lastCheckInDate}
                  setLastCheckInDate={setLastCheckInDate}
                />
              )}

              {currentView === 'knowledge' && (
                <KnowledgeView initialTab={knowledgeTabOverride} />
              )}

              {currentView === 'screening' && (
                <ScreeningView 
                  profile={profile}
                  setProfile={setProfile}
                  pm25={pm25}
                  heatIndex={heatIndex}
                  temperature={temperature}
                  onNavigateToChat={() => setView('doctor')}
                />
              )}

              {currentView === 'prevention' && (
                <PreventionView />
              )}

              {currentView === 'doctor' && (
                <DoctorChatView 
                  profile={profile}
                  pm25={pm25}
                  heatIndex={heatIndex}
                  temperature={temperature}
                />
              )}

              {currentView === 'caregivers' && (
                <CaregiversView />
              )}

              {currentView === 'notifications' && (
                <NotificationsView 
                  pm25={pm25}
                  heatIndex={heatIndex}
                />
              )}

              {currentView === 'settings' && (
                <SettingsView 
                  profile={profile}
                  setProfile={setProfile}
                  onSave={handleSaveSettings}
                  onResetRegistration={handleResetRegistration}
                />
              )}
            </div>

          </div>

          {/* FOOTER - Trademark text with premium design styling */}
          <footer className="bg-white border-t border-slate-200 px-6 py-3 text-center text-[10px] text-slate-500 font-medium shrink-0">
            ระบบจัดทำและสนับสนุนดัชนีสุขภาพท้องถิ่น • พัฒนาขึ้นด้วยเทคโนโลยี Gemini AI คอยดูแลสุขภาพและลมแดด
          </footer>

          {/* Quick Responsive Mobile Bottom Navigation (Visible only on responsive breakpoint screens below lg:64vw) */}
          <div id="phone-bottom-nav-bar" className="lg:hidden bg-white border-t border-slate-150 shrink-0 h-16 pt-1 px-4 flex items-center justify-between z-30 select-none pb-2">
            {[
              { id: 'home', label: 'หน้าแรก', icon: Home },
              { id: 'knowledge', label: 'ความรู้', icon: BookOpen, action: () => setKnowledgeTabOverride('pm25') },
              { id: 'screening', label: 'คัดกรอง', icon: ClipboardCheck },
              { id: 'doctor', label: 'ปรึกษาแพทย์', icon: MessageSquare },
              { id: 'caregivers', label: 'ผู้ดูแลใกล้เคียง', icon: MapPin },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = currentView === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-btn-${tab.id}`}
                  onClick={() => {
                    if (tab.action) tab.action();
                    setView(tab.id as ViewType);
                  }}
                  className={`flex flex-col items-center justify-center flex-1 py-1 transition-all group cursor-pointer ${
                    isActive ? 'text-[#2563eb]' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2 group-hover:scale-105'}`} />
                  <span className="text-[9px] font-bold mt-0.5">{tab.label}</span>
                </button>
              );
            })}
          </div>

        </main>
      </div>

    </div>
  );
}

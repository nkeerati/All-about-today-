import React from "react";
import { 
  Home, 
  BookOpen, 
  ClipboardCheck, 
  ShieldAlert, 
  MessageSquare, 
  MapPin, 
  Bell, 
  Settings, 
  LogOut, 
  User,
  X
} from "lucide-react";
import { ViewType, UserProfile } from "../types";

interface MenuSidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
}

export default function MenuSidebar({
  currentView,
  setView,
  isOpen,
  onClose,
  profile
}: MenuSidebarProps) {
  if (!isOpen) return null;

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

  return (
    <div id="sidebar-overlay" className="absolute inset-0 z-50 flex transition-opacity duration-300">
      {/* Backdrop */}
      <div 
        id="sidebar-backdrop"
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />
      
      {/* Sidebar Content drawer */}
      <div 
        id="sidebar-drawer"
        className="relative flex flex-col w-[260px] max-w-[80%] h-full bg-[#0f172a] text-[#cbd5e1] shadow-2xl animate-slide-in overflow-hidden border-r border-[#1e293b]"
      >
        {/* Header Profile Section - Styled beautifully exactly like mockup with Dark Slate / Sapphire Blue theme */}
        <div id="sidebar-profile-header" className="bg-[#1e293b] text-white p-5 pt-8 flex items-center justify-between border-b border-[#0f172a]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border border-blue-500/50 bg-gradient-to-135 from-[#3b82f6] to-[#2563eb] flex items-center justify-center text-xl shadow-inner shrink-0">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Health Access Profile</div>
              <div className="font-semibold text-sm line-clamp-1 text-slate-200">{profile.name || "สมเกียรติ รักดี"}</div>
            </div>
          </div>
          <button 
            id="close-sidebar-btn"
            onClick={onClose} 
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            aria-label="ปิดเมนู"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Navigation Items */}
        <nav id="sidebar-nav" className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <li key={item.id}>
                  <button
                    id={`menu-item-${item.id}`}
                    onClick={() => {
                      setView(item.id);
                      onClose();
                    }}
                    className={`nav-menu-button flex items-center gap-4 w-full px-5 py-3.5 text-left transition-all duration-200 text-sm font-medium border-l-4 ${
                      isActive 
                        ? "bg-[#1e293b] text-[#f8fafc] font-semibold border-[#3b82f6]" 
                        : "text-[#cbd5e1] hover:bg-[#1e293b] hover:text-[#f8fafc] border-transparent"
                    }`}
                  >
                    <Icon className={`w-5 h-5 transition-colors ${isActive ? "text-[#3b82f6]" : "text-slate-400 group-hover:text-slate-200"}`} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer actions */}
        <div id="sidebar-footer" className="p-4 border-t border-[#1e293b]">
          <button
            id="logout-btn"
            onClick={() => {
              alert("ขอบคุณสำหรับการใช้งานแอปพลิเคชันคอยดูแลสุขภาพของ 'All About Today' ค่ะ!");
              onClose();
            }}
            className="flex items-center justify-center gap-2 w-full p-3 border border-red-900/50 bg-red-950/10 rounded-xl text-red-400 hover:bg-red-950/30 hover:border-red-800 font-medium text-xs transition-all tracking-wider"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            <span>ออกจากระบบ</span>
          </button>
          <div className="text-[10px] text-slate-500 text-center mt-3 font-mono">
            System v4.2.1-stable
          </div>
        </div>
      </div>
    </div>
  );
}

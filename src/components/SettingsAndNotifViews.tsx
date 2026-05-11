import React from "react";
import { User, ShieldAlert, Bell, Sliders, Check, Save, Sparkles } from "lucide-react";
import { UserProfile } from "../types";

interface SettingsViewProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  onSave: () => void;
  onResetRegistration?: () => void;
}

export function SettingsView({
  profile,
  setProfile,
  onSave,
  onResetRegistration
}: SettingsViewProps) {
  return (
    <div id="settings-view-container" className="flex flex-col h-full bg-[#f8f9fa] overflow-y-auto pb-12">
      <div className="p-4 space-y-4">
        
        {/* User profile setting fields */}
        <div id="settings-profile-card" className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-black text-slate-800">ข้อมูลส่วนตัวผู้ป่วย (เพื่อใช้วิเคราะห์อาการร่วมกับหมอ AI)</span>
            </div>
            {onResetRegistration && (
              <button 
                id="btn-re-register-trigger"
                onClick={onResetRegistration}
                className="text-[10px] text-slate-500 hover:text-rose-500 font-bold border border-slate-200 hover:border-rose-200 px-2.5 py-1 rounded-lg transition-all"
              >
                ลงทะเบียนใหม่
              </button>
            )}
          </div>

          <div className="space-y-3">
            {/* Field name */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">ชื่อผู้ใช้งาน:</label>
              <input 
                id="profile-field-name"
                type="text" 
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-slate-50 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
              />
            </div>

            {/* Grid row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">อายุ (ปี):</label>
                <input 
                  id="profile-field-age"
                  type="number" 
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
                  className="w-full bg-slate-50 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">เพศกำเนิด:</label>
                <select 
                  id="profile-field-gender"
                  value={profile.gender}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                  className="w-full bg-slate-50 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white text-slate-700"
                >
                  <option value="ชาย">ชาย (Male)</option>
                  <option value="หญิง">หญิง (Female)</option>
                  <option value="อื่นๆ">อื่นๆ (Other)</option>
                </select>
              </div>
            </div>

            {/* Congenital Disease */}
            <div className="space-y-1.5 pt-1.5">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input 
                  id="profile-has-disease-check"
                  type="checkbox"
                  checked={profile.hasCongenitalDisease}
                  onChange={(e) => setProfile({ ...profile, hasCongenitalDisease: e.target.checked })}
                  className="rounded-md w-4 h-4 border-slate-300 text-blue-600 accent-blue-600"
                />
                <span>ฉันมีกลุ่มเสี่ยง / โรคประจำตัวโรคทางสมอง-หัวใจ-ปอด</span>
              </label>

              {profile.hasCongenitalDisease && (
                <div className="animate-fade-in pt-1">
                  <label className="block text-[10px] font-bold text-red-500 mb-1">รายละเอียดโรคประจำตัว (ภาษาไทย):</label>
                  <textarea 
                    id="profile-field-disease-detail"
                    rows={2}
                    value={profile.congenitalDiseaseDetails}
                    onChange={(e) => setProfile({ ...profile, congenitalDiseaseDetails: e.target.value })}
                    className="w-full bg-slate-50 text-xs px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white text-slate-700 font-sans"
                    placeholder="เช่น หอบหืด, ความดันโลหิตสูง, โรคไต..."
                  />
                </div>
              )}
            </div>

          </div>

          <button
            id="btn-save-settings"
            onClick={onSave}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-extrabold py-3 rounded-2xl flex items-center justify-center gap-1.5 shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>บันทึกข้อมูลดาราการแพทย์</span>
          </button>
        </div>

        {/* Informational tip */}
        <div className="bg-[#eff6ff] border border-blue-100 p-4 rounded-2xl flex gap-3 text-xs text-blue-700">
          <Sparkles className="w-6 h-6 text-blue-500 shrink-0" />
          <p className="leading-relaxed">
            ข้อมูลโรคประจําตัวและอายุจะถูกประมูลรวมผลเพื่อพยากรณ์ความสมดุลการสูญเสียเกลือแร่และผลลัพธ์ดัชนีฝุ่น PM2.5 แบบแกร่งกล้ากับแพทย์ที่ดูแลความปลอดภัยของคุณ
          </p>
        </div>

      </div>
    </div>
  );
}

interface NotificationsViewProps {
  pm25: number;
  heatIndex: number;
}

export function NotificationsView({ pm25, heatIndex }: NotificationsViewProps) {
  const isPmHigh = pm25 >= 75;
  const isHeatHigh = heatIndex >= 41;

  const logs = [
    {
      id: "log1",
      title: "ระบบวัดระดับภัย PM2.5 ตรวจจับประจุสูงผิดปกติ",
      time: "สิบนาทีที่แล้ว",
      body: `เนื่องจากดัชนีฝุ่น PM2.5 วันนี้แตะ ${pm25} µg/m³ ซึ่งเริ่มส่งผลร้าย คุณหมอแนะนำให้รีบสวมหน้ากากและเปิดระดับกรองอากาศสูงที่สุดในบ้านเพื่อดักฝุ่น`,
      level: isPmHigh ? "danger" : "info"
    },
    {
      id: "log2",
      title: isHeatHigh ? "🔥 แจ้งเตือนสภาวะแดดจัด ดัชนีความร้อนระดับอันตราย!" : "อุณหภูมิความร้อนระดับเฝ้าระวังต่ำ",
      time: "วันนี้ 09:30 น.",
      body: `ตัวชี้วัดดัชนีความร้อนพุ่งสูงถึง ${heatIndex}°C ในตอนนี้ อาการขาดน้ำเฉียบพลันเกิดขึ้นง่ายมาก ควรรีบย้ายเข้าร่ม พัดลม อากาศถ่ายเท และจิบน้ำ 250ml ด่วนที่สุด`,
      level: isHeatHigh ? "danger" : "info"
    },
    {
      id: "log3",
      title: "ระบบการแจ้งเตือนจิบน้ำต้านภัยฮีทสโตรก",
      time: "เมื่อวานนี้",
      body: "ยินดีด้วยค่ะ ประวัติระบบตรวจพบการล็อกแก้วน้ำจิบที่ครบสมบูรณ์ ร่างกายของคุณยังคงพร้อมทนทุกสิ่งแวดล้อมได้ดีเยี่ยมในระดับพึงพอใจ",
      level: "success"
    }
  ];

  return (
    <div id="notif-view-container" className="flex flex-col h-full bg-[#f8f9fa] overflow-y-auto pb-12">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-blue-500 animate-bounce" /> ล็อกรายงานเตือนเหตุภัยประจำวันนี้
          </span>
          <span className="text-[9px] bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded-full">
            ภัยคุกคาม {isHeatHigh || isPmHigh ? "รุนแรง" : "ปกติ"}
          </span>
        </div>

        <div className="space-y-3">
          {logs.map((log) => (
            <div 
              key={log.id} 
              className={`p-4 rounded-3xl border text-xs relative ${
                log.level === "danger" 
                  ? "bg-red-50/70 border-red-200"
                  : log.level === "success"
                    ? "bg-green-50/70 border-green-200"
                    : "bg-white border-gray-100"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h5 className={`font-bold text-[12px] pr-8 ${
                  log.level === "danger" ? "text-red-700" : "text-gray-900"
                }`}>
                  {log.title}
                </h5>
                <span className="text-[9px] text-gray-400 shrink-0 font-medium">
                  {log.time}
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed font-sans text-xs">
                {log.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

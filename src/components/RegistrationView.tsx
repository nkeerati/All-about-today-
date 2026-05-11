import React, { useState } from "react";
import { UserProfile } from "../types";
import { 
  Heart, 
  User, 
  Activity, 
  Stethoscope, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  MapPin, 
  Thermometer, 
  Wind 
} from "lucide-react";
import { DEFAULT_USER_PROFILE } from "../constants";

interface RegistrationViewProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  onComplete: () => void;
}

export default function RegistrationView({ profile, setProfile, onComplete }: RegistrationViewProps) {
  const [formData, setFormData] = useState<UserProfile>({
    name: "",
    age: 35,
    gender: "ชาย",
    hasCongenitalDisease: false,
    congenitalDiseaseDetails: "",
  });

  const [errors, setErrors] = useState<{ name?: string; age?: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "age" ? parseInt(value) || 0 : value
    }));
    // Clear validation error on change
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleDiseaseDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      congenitalDiseaseDetails: e.target.value
    }));
  };

  const setDiseaseToggle = (hasDisease: boolean) => {
    setFormData(prev => ({
      ...prev,
      hasCongenitalDisease: hasDisease,
      congenitalDiseaseDetails: hasDisease ? prev.congenitalDiseaseDetails : ""
    }));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; age?: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "กรุณากรอกชื่อ-นามสกุลของคุณ";
    }
    if (formData.age <= 0 || formData.age > 120) {
      newErrors.age = "กรุณากรอกอายุที่ถูกต้อง (1-120 ปี)";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setProfile(formData);
    onComplete();
  };

  const handleLoadPreset = () => {
    setProfile(DEFAULT_USER_PROFILE);
    onComplete();
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 md:p-6 font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-950 -z-10" />
      
      {/* Dynamic particles mockup for aesthetic medical background */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />

      <div className="w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 animate-fade-in">
        
        {/* Left Side: Editorial Banner branding */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 relative select-none">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl" />
          
          <div className="space-y-6">
            {/* Main Application Logo Branding */}
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-2.5 rounded-2xl shadow-xl shadow-blue-500/10">
                <Heart className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-white tracking-tight">
                  All About Today
                </h1>
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Health Security Guard</p>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100 leading-tight">
                ยินดีต้อนรับสู่ระบบตรวจเช็คสุขภาพความตึงตัวส่วนบุคคล
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                กรอกข้อมูลพื้นฐานครั้งแรกเพื่อช่วยให้ระบบปัญญาประดิษฐ์และแพทย์ Dr. A วิเคราะห์ความเสี่ยงต่อมลภาวะ <strong className="text-orange-400 font-semibold">ฝุ่น PM2.5</strong> และการเกิดโรคลมพายุความร้อน <strong className="text-rose-400 font-semibold">ฮีทสโตรก (Heatstroke)</strong> ได้อย่างมีประสิทธิภาพและจำเพาะเจาะจงสูงสุด
              </p>
            </div>
          </div>

          {/* Value Props highlight ticks */}
          <div className="space-y-3.5 pt-8 lg:pt-0">
            <div className="flex items-start gap-3 text-xs text-slate-300">
              <div className="bg-blue-500/15 text-blue-400 p-1 rounded-lg shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold">คัดกรองแบบเรียลไทม์</h4>
                <p className="text-[10px] text-slate-500">วิเคราะห์ตามสภาพอากาศในพื้นที่จริง</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-slate-300">
              <div className="bg-emerald-500/15 text-emerald-400 p-1 rounded-lg shrink-0">
                <Stethoscope className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold">ปรึกษาอาจารย์แพทย์ AI</h4>
                <p className="text-[10px] text-slate-500">รับคำแนะนำฉับไวตามประวัติสุขภาพโรคประจำตัว</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-slate-300">
              <div className="bg-amber-500/15 text-amber-500 p-1 rounded-lg shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold">ระบบพหุผู้ดูแลใกล้คุณ</h4>
                <p className="text-[10px] text-slate-500">ระบุพิกัดจีพีเอสผู้ดูแลยามเกิดอุบัติเหตุวิกฤต</p>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 pt-6 border-t border-slate-900 hidden lg:block">
            © 2026 All About Today. พัฒนาขึ้นอย่างประณีตเพื่อความปลอดภัยสูงสุดในทุกๆ วัน
          </div>
        </div>

        {/* Right Side: High fidelity registration Form */}
        <div className="lg:col-span-7 bg-slate-900/40 p-6 sm:p-8 flex flex-col justify-center">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" /> ลงทะเบียนผู้ป่วยใหม่
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">กรุณากรอกข้อมูลเพื่อสร้างประวัติสุขภาพของคุณ</p>
            </div>

            <button
              id="btn-load-mock-preset"
              type="button"
              onClick={handleLoadPreset}
              className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-xl text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" /> ใช้ข้อมูลจำลองแนะนำ
            </button>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Name Input */}
            <div className="space-y-1.5">
              <label htmlFor="reg-name" className="block text-xs font-bold text-slate-300">
                ชื่อ - นามสกุล <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="lnr lnr-user w-4 h-4" />
                </div>
                <input
                  id="reg-name"
                  type="text"
                  name="name"
                  placeholder="เช่น สมชาย สุขสร้างสรรค์"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full bg-slate-950/80 border text-xs text-slate-200 placeholder-slate-600 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all ${
                    errors.name ? "border-rose-500/80" : "border-slate-800 focus:border-blue-500"
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-[10px] text-rose-500 font-medium">{errors.name}</p>
              )}
            </div>

            {/* Age & Gender Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Age Field */}
              <div className="space-y-1.5">
                <label htmlFor="reg-age" className="block text-xs font-bold text-slate-300">
                  อายุ (ปี) <span className="text-rose-500">*</span>
                </label>
                <input
                  id="reg-age"
                  type="number"
                  name="age"
                  min="1"
                  max="120"
                  value={formData.age}
                  onChange={handleInputChange}
                  className={`w-full bg-slate-950/80 border text-xs text-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all ${
                    errors.age ? "border-rose-500/80" : "border-slate-800 focus:border-blue-500"
                  }`}
                />
                {errors.age && (
                  <p className="text-[10px] text-rose-500 font-medium">{errors.age}</p>
                )}
              </div>

              {/* Gender select */}
              <div className="space-y-1.5">
                <label htmlFor="reg-gender" className="block text-xs font-bold text-slate-300">
                  เพศสรีระ <span className="text-rose-500">*</span>
                </label>
                <select
                  id="reg-gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950/80 border border-slate-800 text-xs text-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                >
                  <option value="ชาย" className="bg-slate-950">ชาย</option>
                  <option value="หญิง" className="bg-slate-950">หญิง</option>
                  <option value="อื่นๆ" className="bg-slate-950">อื่นๆ / ไม่ระบุ</option>
                </select>
              </div>
            </div>

            {/* Congenital Disease Choice Toggle */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">
                คุณมีโรคประจำตัว หรือประวัติทางการแพทย์หรือไม่?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  id="btn-disease-no"
                  type="button"
                  onClick={() => setDiseaseToggle(false)}
                  className={`py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    !formData.hasCongenitalDisease
                      ? "bg-blue-500/10 text-blue-400 border-blue-500/40 shadow-md shadow-blue-500/5"
                      : "bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-300 hover:bg-slate-950"
                  }`}
                >
                  ไม่มีโรคประจำตัว
                </button>
                <button
                  id="btn-disease-yes"
                  type="button"
                  onClick={() => setDiseaseToggle(true)}
                  className={`py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    formData.hasCongenitalDisease
                      ? "bg-rose-500/10 text-rose-400 border-rose-500/40 shadow-md shadow-rose-500/5"
                      : "bg-slate-950/60 text-slate-400 border-slate-800 hover:text-rose-400 hover:bg-slate-950"
                  }`}
                >
                  มีโรคประจำตัว
                </button>
              </div>
            </div>

            {/* Congenital Disease Details Conditional Textarea */}
            {formData.hasCongenitalDisease && (
              <div className="space-y-1.5 animate-fade-in">
                <label htmlFor="reg-disease-details" className="block text-xs font-bold text-slate-300">
                  ระบุชื่อโรคหรือการรักษาประจำเป็นระยะ <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="reg-disease-details"
                  rows={2}
                  placeholder="เช่น โรคหัวใจขาดเลือด ความดันสูง ทานยารักษาสม่ำเสมอ หรือมีประวัติเป็นฮีทสโตรก"
                  value={formData.congenitalDiseaseDetails}
                  onChange={handleDiseaseDetailsChange}
                  required
                  className="w-full bg-slate-950/80 border border-slate-800 text-xs text-slate-200 placeholder-slate-700 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all resize-none"
                />
              </div>
            )}

            {/* Submit Registration button */}
            <div className="pt-2">
              <button
                id="btn-submit-registration"
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs py-3.5 rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/15 transition-all text-center flex items-center justify-center gap-2 group cursor-pointer"
              >
                บันทึกคัดกรอง &amp; เริ่มดูแลสุขภาพทันที 
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

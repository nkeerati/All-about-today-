import React, { useState } from "react";
import { 
  ClipboardCheck, 
  HelpCircle, 
  AlertTriangle, 
  CheckCircle,
  Clock, 
  Loader2, 
  ChevronRight,
  Sparkles,
  RefreshCw,
  UserCheck
} from "lucide-react";
import { ScreeningAnswer, UserProfile } from "../types";
import { getSmartAssessment } from "../services/geminiService";

interface ScreeningViewProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  pm25: number;
  heatIndex: number;
  temperature: number;
  onNavigateToChat: () => void;
}

export default function ScreeningView({
  profile,
  setProfile,
  pm25,
  heatIndex,
  temperature,
  onNavigateToChat
}: ScreeningViewProps) {
  const [answers, setAnswers] = useState<ScreeningAnswer>({
    q1: false,
    q2: false,
    q3: false,
    q4: false,
  });

  const [localReport, setLocalReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorLocal, setErrorLocal] = useState<string | null>(null);

  const handleToggle = (question: keyof ScreeningAnswer, val: boolean) => {
    setAnswers(prev => ({
      ...prev,
      [question]: val
    }));
    // Clear old reports when they change answers to avoid confusion
    if (localReport) setLocalReport(null);
  };

  const calculateCheckedCount = () => {
    return Object.values(answers).filter(Boolean).length;
  };

  const handleLocalEvaluate = () => {
    const count = calculateCheckedCount();
    let risk = "ต่ำ";
    let desc = "ร่างกายปกติ แนะนำตรวจสอบดัชนีฝุ่นและความร้อนอย่างสม่ำเสมอ";
    
    if (count >= 3) {
      risk = "สูงมาก เฝ้าระวังฮีทสโตรกอย่างใกล้ชิด!";
    } else if (count >= 1) {
      risk = "เสี่ยงปานกลาง";
      desc = "คุณเริ่มมีอาการอ่อนล้าหรือขาดน้ำอันเนื่องจากสภาพแวดล้อม แนะนำพักในที่ร่ม พัดลมระบายอากาศจิบน้ำทันที";
    }

    const generated = `### 🩺 ผลการประเมินเบื้องต้นภายในระบบ
*ประเมินสำหรับ: คุณ **${profile.name || "สมเกียรติ รักดี"}** (อายุ ${profile.age} ปี โรคประจำตัว: ${profile.hasCongenitalDisease ? profile.congenitalDiseaseDetails : "ไม่มี"})*

**ระดับความเสี่ยง: ${risk}** 
*   **มีอาการสอดคล้อง:** ${count}/4 ประเด็น
*   **คำแนะนำ:** ${count >= 3 ? "หลีกเลี่ยงกิจกรรมกลางแดดจัดเฉียบพลัน ดื่มน้ำเปล่าผสมผงเกลือแร่โออาร์เอส เช็ดตัวคลายความร้อน และถ้าตัวยังร้อนระอุ เหงื่อไม่ออก ให้สังเกตภาวะชักตื้อ คลื่นไส้รุนแรง รีบนำส่งโรงพยาบาลฉุกเฉินเด็ดขาด" : desc}

*ข้อแนะนำ: กดปุ่ม "ขอคำปรึกษาเจาะลึกด้วย AI แพทย์ (Dr. A Analytical)" ด้านล่าง เพื่อเชื่อมโยงสภาพฝุ่นละออง PM2.5 และอายุเพื่อรายงานผลแม่นยำยิ่งขึ้น*`;
    
    setLocalReport(generated);
  };

  const handleGeminiAssessment = async () => {
    setLoading(true);
    setLocalReport(null);
    setErrorLocal(null);
    try {
      const response = await getSmartAssessment(answers, profile, {
        pm25,
        heatIndex,
        temperature
      });
      setLocalReport(response);
    } catch (e) {
      console.error(e);
      setErrorLocal("ไม่สามารถจัดทำผลสรุปจาก AI ในเวลานี้ได้ค่ะ กรุณาลองวิธีประเมินแบบธรรมดาแทน");
    } finally {
      setLoading(false);
    }
  };

  const checkedCount = calculateCheckedCount();

  return (
    <div id="screening-view-container" className="flex flex-col h-full bg-[#f8f9fa] overflow-y-auto pb-12">
      
      {/* Background panel */}
      <div className="p-4 space-y-4">
        
        {/* Screening Instruction card (Screen 7 of Mockup) */}
        <div id="screening-banner-top" className="bg-[#fffbeb] border border-amber-200 rounded-3xl p-5 flex items-center gap-4 shadow-3xs">
          <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-3xl shadow-2xs border border-amber-300/40">
            📋
          </div>
          <div className="flex-1">
            <h4 id="screening-title" className="font-bold text-gray-800 text-sm">คุณเคยมีอาการเหล่านี้หรือไม่</h4>
            <p className="text-[11px] text-gray-500 leading-tight mt-1">
              ทำแบบประเมินเช็คสโตรก เพื่อตรวจเช็คความผิดปกติภายนอกร่างกายเบื้องต้นก่อนภัยร้ายทำลายอวัยวะ
            </p>
          </div>
        </div>

        {/* Diagnostic Form checklist */}
        <div id="screening-questions-box" className="bg-white rounded-3xl p-5 shadow-xs border border-gray-100 space-y-4">
          
          {/* Question 1 */}
          <div className="space-y-1.5 pb-3 border-b border-gray-100">
            <div className="text-[12px] font-bold text-gray-800 flex items-start gap-1">
              <span className="text-amber-500 font-mono">1.</span>
              <span>คลื่นไส้/อาเจียน เวียนหัว มึนงง</span>
            </div>
            <div className="flex items-center gap-4 pl-4 pt-1">
              <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                <input 
                  type="radio" 
                  name="q1" 
                  checked={answers.q1 === true}
                  onChange={() => handleToggle('q1', true)}
                  className="rounded-full w-4 h-4 border-gray-300 text-blue-600 accent-blue-600"
                />
                <span>เคย</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                <input 
                  type="radio" 
                  name="q1" 
                  checked={answers.q1 === false}
                  onChange={() => handleToggle('q1', false)}
                  className="rounded-full w-4 h-4 border-gray-300 text-gray-400 accent-blue-600"
                />
                <span>ไม่เคย</span>
              </label>
            </div>
          </div>

          {/* Question 2 */}
          <div className="space-y-1.5 pb-3 border-b border-gray-100">
            <div className="text-[12px] font-bold text-gray-800 flex items-start gap-1">
              <span className="text-amber-500 font-mono">2.</span>
              <span>กระหายน้ำมากเป็นพิเศษ</span>
            </div>
            <div className="flex items-center gap-4 pl-4 pt-1">
              <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                <input 
                  type="radio" 
                  name="q2" 
                  checked={answers.q2 === true}
                  onChange={() => handleToggle('q2', true)}
                  className="rounded-full w-4 h-4 border-gray-300 text-blue-600 accent-blue-600"
                />
                <span>เคย</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                <input 
                  type="radio" 
                  name="q2" 
                  checked={answers.q2 === false}
                  onChange={() => handleToggle('q2', false)}
                  className="rounded-full w-4 h-4 border-gray-300 text-gray-400 accent-blue-600"
                />
                <span>ไม่เคย</span>
              </label>
            </div>
          </div>

          {/* Question 3 */}
          <div className="space-y-1.5 pb-3 border-b border-gray-100">
            <div className="text-[12px] font-bold text-gray-800 flex items-start gap-1">
              <span className="text-amber-500 font-mono">3.</span>
              <span>ชีพจรเร็วสั่นระรัว หายใจเร็ว ตื้นๆ</span>
            </div>
            <div className="flex items-center gap-4 pl-4 pt-1">
              <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                <input 
                  type="radio" 
                  name="q3" 
                  checked={answers.q3 === true}
                  onChange={() => handleToggle('q3', true)}
                  className="rounded-full w-4 h-4 border-gray-300 text-blue-600 accent-blue-600"
                />
                <span>เคย</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                <input 
                  type="radio" 
                  name="q3" 
                  checked={answers.q3 === false}
                  onChange={() => handleToggle('q3', false)}
                  className="rounded-full w-4 h-4 border-gray-300 text-gray-400 accent-blue-600"
                />
                <span>ไม่เคย</span>
              </label>
            </div>
          </div>

          {/* Question 4 */}
          <div className="space-y-1.5">
            <div className="text-[12px] font-bold text-gray-800 flex items-start gap-1">
              <span className="text-amber-500 font-mono">4.</span>
              <span>วิงเวียน ตาพร่ามัว หน้ามืด เป็นลม</span>
            </div>
            <div className="flex items-center gap-4 pl-4 pt-1">
              <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                <input 
                  type="radio" 
                  name="q4" 
                  checked={answers.q4 === true}
                  onChange={() => handleToggle('q4', true)}
                  className="rounded-full w-4 h-4 border-gray-300 text-blue-600 accent-blue-600"
                />
                <span>เคย</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                <input 
                  type="radio" 
                  name="q4" 
                  checked={answers.q4 === false}
                  onChange={() => handleToggle('q4', false)}
                  className="rounded-full w-4 h-4 border-gray-300 text-gray-400 accent-blue-600"
                />
                <span>ไม่เคย</span>
              </label>
            </div>
          </div>

        </div>

        {/* User context confirmation before analysis */}
        <div id="screening-profile-summary" className="bg-white rounded-2xl p-4 border border-gray-100 shadow-3xs flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span className="text-gray-500">ประเมินโดยใช้อายุและข้อมูลโรคที่มีหรือไม่:</span>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100/50">
            {profile.name} (อายุ {profile.age} ปี)
          </span>
        </div>

        {/* Buttons Action Panel */}
        <div id="screening-actions-panel" className="flex flex-col gap-2 pt-2">
          <button
            id="btn-evaluate-standard"
            onClick={handleLocalEvaluate}
            className="w-full bg-[#1e293b] hover:bg-[#0f172a] text-white font-semibold text-xs py-3 rounded-2xl shadow-xs transition-colors tracking-wider text-center cursor-pointer"
          >
            ประเมินความปลอดภัยด่วน
          </button>

          <button
            id="btn-evaluate-gemini"
            disabled={loading}
            onClick={handleGeminiAssessment}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-300 disabled:to-indigo-300 text-white font-extrabold text-xs py-3 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 tracking-wider cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>คุณหมอ AI กำลังวิเคราะห์เจาะลึก...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-blue-100" />
                <span>วิเคราะห์เจาะลึกพิเศษด้วย AI (Dr. A Report)</span>
              </>
            )}
          </button>
        </div>

        {/* Generated Report output */}
        {localReport && (
          <div id="screening-report-card" className="bg-[#eff6ff] border border-blue-200 rounded-3xl p-5 shadow-sm mt-3 animate-slide-in relative">
            <div className="absolute top-4 right-4 text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3 h-3" /> รายงานลับเวชศาสตร์
            </div>

            <div className="prose prose-sm text-xs text-slate-800 leading-relaxed whitespace-pre-line">
              {/* Parse headers nicely manually since react-markdown can be slow in layout */}
              {localReport}
            </div>

            <div id="report-care-box" className="mt-5 border-t border-blue-200/50 pt-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <span className="text-[10px] text-blue-500 font-medium">ต้องการส่งผลรีพอร์ตนี้ไปเก็บประวัติกับคุณหมอเสริมไหมคะ?</span>
              <button
                id="btn-report-consult"
                onClick={onNavigateToChat}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold py-1.5 px-4 rounded-xl flex items-center justify-center gap-1 transition-all shadow-3xs cursor-pointer"
              >
                <span>ปรึกษาแพทย์ Dr. A ต่อทันที</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {errorLocal && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl text-xs text-center">
            {errorLocal}
          </div>
        )}

      </div>
    </div>
  );
}

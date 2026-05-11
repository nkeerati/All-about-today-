import { GoogleGenAI } from "@google/genai";
import { UserProfile, ScreeningAnswer } from "../types";

let aiInstance: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("GEMINI_API_KEY is missing. Using simulated local engine.");
    }
    aiInstance = new GoogleGenAI({ apiKey: key || "MOCK_KEY" });
  }
  return aiInstance;
}

/**
 * Get dynamic smart assessment from Gemini based on user's screening responses
 */
export async function getSmartAssessment(
  answers: ScreeningAnswer,
  profile: UserProfile,
  envMetrics: { pm25: number; heatIndex: number; temperature: number }
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Return friendly local simulated diagnostic report if key is missing
    return simulateHealthAssessment(answers, profile, envMetrics);
  }

  try {
    const ai = getAIClient();
    const checkedCount = Object.values(answers).filter(Boolean).length;
    
    const prompt = `คุณคือ Dr. A แพทย์ที่ปรึกษาด้านสุขภาพและสภาพแวดล้อม (PM2.5 และดัชนีความร้อน/ฮีทสโตรก)
ข้อมูลผู้ป่วย:
- ชื่อ: ${profile.name || "ผู้ใช้งาน"}
- อายุ: ${profile.age} ปี
- เพศ: ${profile.gender}
- มีโรคประจำตัว: ${profile.hasCongenitalDisease ? `ใช่ (${profile.congenitalDiseaseDetails})` : "ไม่มี"}

ข้อมูลสภาพสิ่งแวดล้อมปัจจุบัน:
- ปริมาณฝุ่น PM2.5: ${envMetrics.pm25} µg/m³
- ดัชนีความร้อน (Heat Index): ${envMetrics.heatIndex}°C
- อุณหภูมิโดยละเอียด: ${envMetrics.temperature}°C

อาการที่ผู้ป่วยเลือกเป็น "เคยมีอาการ" (เช็คลิสต์คัดกรอง 4 ข้อมูลสำคัญ):
1. คลื่นไส้/อาเจียน เวียนหัว มึนงง: ${answers.q1 ? "เคยมีอาการ" : "ไม่เคย"}
2. กระหายน้ำมาก: ${answers.q2 ? "เคยมีอาการ" : "ไม่เคย"}
3. ชีพจรเร็ว หายใจเร็ว: ${answers.q3 ? "เคยมีอาการ" : "ไม่เคย"}
4. วิงเวียน หน้ามืด เป็นลม: ${answers.q4 ? "เคยมีอาการ" : "ไม่เคย"}
(มีอาการรวมกัน ${checkedCount} อย่างจาก 4 อย่าง)

กรุณาประเมินความเสี่ยงต่อสุขภาพ (โดยเฉพาะโรคหน้ามืด/ลมแดด/ฮีทสโตรก และ ปอด/ทางเดินหายใจจากฝุ่น PM2.5) เป็นภาษาไทยที่สละสลวย อารมณ์เป็นมิตร อบอุ่น และปลอบโยน (clean calm friendly) โดยจัดกลุ่มเป็นหัวข้อดังนี้:
1. สรุปความเสี่ยงโดยภาพรวมสำหรับข้อมูลนี้ (เสี่ยงสูง/ปานกลาง/ต่ำ) พร้อมคำอธิบาย
2. ข้อแนะนำในการดูแลตัวเองทันทีตามสภาพอากาศ (เช่น การดื่มน้ำ, ยา, สภาพห้อง)
3. สิ่งที่ควรสังเกตเพิ่มเติม (อาการสำคัญพึงระวัง)
4. เมื่อไหร่ที่ต้องรีบไปพบแพทย์กะทันหันหรือเรียกรถฉุกเฉิน`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "คุณคือ Dr. A หมอพูดสละสลวย ใจดี อบอุ่น สุภาพ และให้คำปรึกษาเน้นความปลอดภัย",
        temperature: 0.7,
      }
    });

    return response.text || "ขออภัยด้วยค่ะ ระบบประเมินผลขัดข้องชั่วคราว กรุณาลองอีกครั้ง";
  } catch (err) {
    console.error("Gemini API Error:", err);
    return simulateHealthAssessment(answers, profile, envMetrics);
  }
}

/**
 * Real-time Chat generation with DR. A
 */
export async function getDoctorResponse(
  chatHistory: { sender: 'user' | 'doctor'; text: string }[],
  profile: UserProfile,
  envMetrics: { pm25: number; heatIndex: number; temperature: number }
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return simulateDoctorChatResponse(chatHistory[chatHistory.length - 1].text);
  }

  try {
    const ai = getAIClient();
    
    // Prepare conversation context
    const formattedHistory = chatHistory.map(msg => 
      `${msg.sender === "user" ? "ผู้ป่วย" : "หมอ Dr. A"}: ${msg.text}`
    ).join("\n");

    const prompt = `คุณคือ Dr. A หมอใจดี สุภาพ สันทัดด้านเวชศาสตร์ป้องกัน สิ่งแวดล้อม และฝุ่น PM2.5 / ภัยความร้อน ฮีทสโตรก คอยให้คำปรึกษาที่เป็นมิตร อุ่นใจ และเข้าใจง่ายแก่คนไข้ชาวไทย
ข้อมูลผู้ป่วยปัจจุบัน:
- ชื่อ: ${profile.name || "ผู้ใช้ทั่วไป"}
- อายุ: ${profile.age} ปี
- เพศ: ${profile.gender}
- โรคประจำตัว: ${profile.hasCongenitalDisease ? profile.congenitalDiseaseDetails : "ไม่มี"}

ข้อมูลด้านสภาพแวดล้อมวันนี้:
- ฝุ่น PM2.5: ${envMetrics.pm25} µg/m³
- ดัชนีความร้อน: ${envMetrics.heatIndex}°C

ประวัติบทสนทนาที่ผ่านมา:
${formattedHistory}

กรุณาเขียนตอบคำถามล่าสุดของผู้ป่วยด้วยสไตล์ "clean, calm & friendly" คล้ายคำพูดของคุณหมอใจดีในโรงพยาบาล อารมณ์ปลอบโยน ให้คำแนะนำสั้นกระทัดรัด เข้าใจง่าย มีประโยชน์เชิงปฏิบัติ ไม่สร้างความตระหนกตกใจแต่ให้ระวังที่จำเป็น`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "คุณคือ Dr. A คุณหมอใจดีที่จะคอยรักษา ปลอบโยน แนะนำให้ดื่มน้ำ พักผ่อน หรือใส่หน้ากากป้องกันภัยเงียบ",
        temperature: 0.8,
      }
    });

    return response.text || "หมอได้ยินแล้วครับ หากมีคำอธิบายหรืออาการพึงระวัง สามารถเล่าให้หมอฟังเพิ่มได้เลยนะ";
  } catch (e) {
    console.error("Gemini Chat Error:", e);
    return simulateDoctorChatResponse(chatHistory[chatHistory.length - 1].text);
  }
}

// Fallbacks for offline / missing API key
function simulateHealthAssessment(
  answers: ScreeningAnswer,
  profile: UserProfile,
  envMetrics: { pm25: number; heatIndex: number; temperature: number }
): string {
  const checked = Object.values(answers).filter(Boolean).length;
  let riskLevel = "ต่ำ";
  let color = "เขียว";
  let description = "คุณสุขภาพแข็งแรงดีและไม่มีอาการน่าเป็นห่วงในวันนี้ค่ะ";

  if (checked >= 3) {
    riskLevel = "สูงมาก เฝ้าระวังฮีทสโตรก!";
    color = "แดง";
    description = "คุณกำลังมีสัดส่วนของกลุ่มอาการที่เสี่ยงต่อการเกิดโรคลมแดดหรือฮีทสโตรกสูงมาก เนื่องจากอุณหภูมิร่างกายระบายความร้อนไม่ทันจากการสัมผัสกับอากาศร้อนจัด";
  } else if (checked >= 1) {
    riskLevel = "ปานกลาง เฝ้าระวัง";
    color = "ส้ม";
    description = "คุณเริ่มมีอาการอ่อนล้าหรือขาดน้ำอันเนื่องมาจากความร้อนและสภาวะฝุ่นละออง ควรย้ายเข้าที่ร่มและดื่มน้ำในปริมาณมากเพื่อลดอุณหภูมิผิว";
  }

  const pmAdvice = envMetrics.pm25 >= 50 
    ? "⚠️ วันนี้ปริมาณฝุ่น PM2.5 สูงเป็นอันตรายอยู่นะคะ (${envMetrics.pm25} µg/m³) ควรหลีกเลี่ยงกิจกรรมกลางแจ้งและสวมหน้ากาก N95 ค่ะ"
    : "🍀 อากาศในส่วนของฝุ่น PM2.5 วันนี้ปกติดีค่ะ";

  const heatAdvice = envMetrics.heatIndex >= 35
    ? "🥵 ดัชนีความร้อนแตะสูงถึง ${envMetrics.heatIndex}°C พยายามเพิ่มรอบจิบน้ำทีละน้อย และห้ามทำกิจกรรมหักโหมกลางแดดนะคะ"
    : "🌡️ ดัชนีความร้อนจัดอยู่ในระดับปลอดภัยค่ะ";

  return `### 🩺 ผลการประเมินเบื้องต้นโดย Dr. A (Simulated)

**ระดับความเสี่ยงของคุณ: ${riskLevel}** 

**บทวิเคราะห์จากคุณหมอถึงคุณ ${profile.name || "ผู้ป่วย"}:**
- ${description}
- ${pmAdvice}
- ${heatAdvice}

---

### 🏥 คำแนะนำและขั้นตอนปฐมพยาบาลด่วน:
1. **ดื่มน้ำสะอาดทันที:** แนะนำให้จิบน้ำอุ่นหรืออุณหภูมิห้องบ่อยๆ ไม่ควรดื่มน้ำเย็นจัดรวดเดียว
2. **ปรับสภาวะแวดล้อม:** ย้ายตัวเองเข้าไปในห้องแอร์ อากาศถ่ายเทสะดวก พักผ่อนและลดการใช้แรง
3. **การคลายความร้อนในร่างกาย:** หากรู้สึกตัวร้อนระอุ ให้ใช้ผ้าชุบน้ำเช็ดตามข้อพับ ซอกคอ รักแร้ เพื่อระบายความร้อนออก
4. **เฝ้าระวัง:** งดออกไปข้างนอกเด็ดขาดตราบใดที่สภาพอากาศยังเตือนสีส้มหรือสีแดง

*หากมีอาการสับสน ตัวร้อนจัดเหงื่อไม่ออก ชักเกร็ง หรือหมดสติชั่ววูบ ขอให้รีบโทรและส่งโรงพยาบาลสายด่วน 1669 ทันทีด้วยนะคะ ด้วยความห่วงใยค่ะ*`;
}

function simulateDoctorChatResponse(text: string): string {
  const query = text.toLowerCase();
  if (query.includes("ฝุ่น") || query.includes("pm")) {
    return "สวัสดีครับคุณไข้ เกี่ยวกับเรื่องฝุ่น PM2.5 ในวันนี้มีแนวโน้มรบกวนระบบทางเดินหายใจได้ง่ายครับ หมอแนะนำให้รีบสวมหน้ากาก N95 ตลอดเวลาที่อยู่นอกตัวอาคาร และถ้ารู้สึกแสบคอ มีน้ำมูก หรือหอบเหนื่อย ให้พยายามใช้เครื่องฟอกอากาศในบ้านนะครับ มีอาการแสบตาด้วยไหมครับ?";
  }
  if (query.includes("ร้อน") || query.includes("แดด") || query.includes("เวียนหัว") || query.includes("คลื่นไส้")) {
    return "ใจเย็นๆ นะครับคุณไข้ อาการเวียนหัวและคลื่นไส้หลังจากเจอแดดร้อนจัด เป็นสัญญาณเตือนเรื่องสภาวะขาดน้ำและการควบคุมความร้อนในร่างกายผิดปกติครับ หมอขอแนะนำให้คุณหาร่มเงาพักด่วนที่สุด เช็ดตัวด้วยผ้าชุบน้ำอุณหภูมิปกติ และจิบน้ำผสมเกลือแร่หรือน้ำเปล่าแก้วโตๆ นะครับ ห้ามฝืนสู้แดดต่อนะครับ!";
  }
  if (query.includes("น้ำ")) {
    return "การดื่มน้ำสำคัญมหาศาลเลยครับ ยิ่งในสภาพอากาศอันตราย ดัชนีความร้อนพุ่งสูง ร่างกายจะขับเหงื่อมากโดยไม่รู้ตัว หมอแนะนำให้ตั้งเป้าดื่มน้ำชั่วโมงละ 1-2 แก้ว เพื่อรักษาอุณหภูมิสมดุลให้หัวใจและสมองทำงานดีนะครับ";
  }
  return "สวัสดีครับ หมอ Dr. A ยินดีต้อนรับครับ วันนี้คุณรู้สึกมีอาการไม่สบายตัวตรงไหนบ้างไหมครับ เช่น คลื่นไส้ เวียนหัว หรือต้องการปรึกษาวิธีรับมือฝุ่นละอองและรังสีความร้อนในวันนี้เป็นพิเศษ สามารถเล่าให้หมอฟังได้เลยนะครับ ยินดีดูแลเสมอครับ";
}

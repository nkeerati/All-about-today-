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
    const weightVal = profile.weight || 75;
    const heightVal = profile.height || 170;
    const heightM = heightVal / 100;
    const bmi = weightVal / (heightM * heightM);
    
    let bmiCategory = "ปกติ (Normal)";
    let bmiRiskImpact = "ดัชนีความร้อนและ PM2.5 อยู่ในเกณฑ์ความเสี่ยงมาตรฐานทั่วไป";
    if (bmi >= 30) {
      bmiCategory = "อ้วนรุนแรง (Obese)";
      bmiRiskImpact = "เสี่ยงเกิดลมแดด (Heatstroke) พุ่งสูงขึ้น 1.8 เท่า เนื่องจากชั้นไขมันหนาบดบังการระบายความร้อนแกนกลาง (Heat dissipation barrier) หัวใจต้องสูบฉีดพยายามปั๊มเหงื่อหนักขึ้นสองเท่า และเสี่ยงอักเสบจาก PM2.5 รุนแรงขึ้นจากระดับการอักเสบในเซลล์ (low-grade systemic inflammation) ที่คอยขับไซโตไคน์อักเสบขัดขวางสมรรถนะปอด";
    } else if (bmi >= 25) {
      bmiCategory = "น้ำหนักเกินมาตรฐาน (Overweight)";
      bmiRiskImpact = "เสี่ยงเกิดลมแดดยอดฝุ่น PM2.5 สูงขึ้น 1.3 เท่า เนื่องจากร่างกายหนาจัดกระตุ้นการสูญเสียเหงื่อระเหิดไอน้ำช้าลง และกระตุ้นสภาวะความตึงหลอดเลือดสูงกว่าปานกลาง";
    } else if (bmi < 18.5) {
      bmiCategory = "น้ำหนักต่ำกว่าเกณฑ์ (Underweight)";
      bmiRiskImpact = "ระบบปรับระดับสมดุลน้ำในกล้ามเนื้อต่ำลง อาจเหนื่อยเพลียง่ายกว่าปกติในช่วงความร้อนเตือนภัย";
    }

    const prompt = `คุณคือ Dr. A แพทย์ที่ปรึกษาด้านสุขภาพและสภาพแวดล้อม (PM2.5 และดัชนีความร้อน/ฮีทสโตรก)
ข้อมูลผู้ป่วย:
- ชื่อ: ${profile.name || "ผู้ใช้งาน"}
- อายุ: ${profile.age} ปี
- เพศ: ${profile.gender}
- มีโรคประจำตัว: ${profile.hasCongenitalDisease ? `ใช่ (${profile.congenitalDiseaseDetails})` : "ไม่มี"}
- ข้อมูลร่างกายเพิ่มเติม: น้ำหนัก ${weightVal} กก., ส่วนสูง ${heightVal} ซม.
- ดัชนีมวลกาย (BMI): ${bmi.toFixed(1)} [สถานะเกณฑ์: ${bmiCategory}]
- ความเสี่ยงจาก BMI: ${bmiRiskImpact}

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

กรุณาประเมินความเสี่ยงต่อสุขภาพ (โดยเฉพาะการประเมินความเสี่ยงโรคลมแดด/ฮีทสโตรก และปอดจากการฝอยฝุ่น PM2.5 โดยรวมผลร่วมกับค่า BMI ของคนไข้) เป็นภาษาไทยที่สละสลวย อารมณ์เป็นมิตร อบอุ่น และปลอบโยน (clean calm friendly) โดยจัดกลุ่มเป็นหัวข้อดังนี้:
1. วิเคราะห์ความเสี่ยงโดยภาพรวม (เปรียบเทียบอาการร่วมกับสภาพฝุ่นละออง ความร้อน และค่า BMI ของวันนี้)
2. ข้อแนะนำในการดูแลตัวเองทันทีตามสภาพอากาศและสัดส่วน BMI (เช่น ปริมาณน้ำควรจิบเป้าหมายกี่ลิตรกี่ซีซีต่อวัน)
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
  const weightVal = profile.weight || 75;
  const heightVal = profile.height || 170;
  const heightM = heightVal / 100;
  const bmi = weightVal / (heightM * heightM);

  let bmiCategory = "ปกติ (Normal)";
  let bmiHeatstrokeMultiplier = "1.0x (เกณฑ์ปกติ)";
  let bmiPm25Risk = "เสี่ยงมาตรฐานตามระดับความหนาแน่นฝุ่นละอองทั่วไป";
  let bmiDescription = "";

  if (bmi >= 30) {
    bmiCategory = "อ้วนรุนแรง (Obese)";
    bmiHeatstrokeMultiplier = "1.8x (เสี่ยงสูงวิกฤต)";
    bmiPm25Risk = "เสี่ยงเกิดการอักเสบในเซลล์ (systemic inflammation) สูงขึ้นอย่างรวดเร็ว ทำให้อากาศอุดกั้นหลอดอาหารปอดฉับพลัน";
    bmiDescription = "ชั้นไขมันใต้ผิวหน้าที่หนาทำหน้าที่คล้ายเสื้อกันหนาวกักเก็บอุณหภูมิแกนกลาง (Heat trap) ทำให้การกระจายความร้อนออกช้าลงมาก หัวใจต้องเร่งสูบฉีดเลือดปั๊มเหงื่อหนักขึ้นสองเท่า";
  } else if (bmi >= 25) {
    bmiCategory = "น้ำหนักเกินเกณฑ์ (Overweight)";
    bmiHeatstrokeMultiplier = "1.3x (เสี่ยงสูง)";
    bmiPm25Risk = "ระบบหายใจตอบโจทย์ไวต่อปฏิกิริยาเม็ดฝุ่นละออง PM2.5 สูงกว่าเกณฑ์ปานกลาง";
    bmiDescription = "เนื้อเยื่อกระตุ้นเก็บความร้อนใต้รอบตึงผิวหนังลดความยืดหยุ่นในการกระจายอุณหภูมิเหงื่อระบายช้าลงเล็กน้อย";
  } else if (bmi < 18.5) {
    bmiCategory = "น้ำหนักต่ำกว่าเกณฑ์ (Underweight)";
    bmiHeatstrokeMultiplier = "1.1x (เสี่ยงปกติแต่เพลียง่าย)";
    bmiPm25Risk = "ความแกร่งหลอดลมเฉลี่ยต่ำพึงระมัดระวังการสูดมลพิษ";
    bmiDescription = "เนื้อเกราะกล้ามเนื้อและสมดุลน้ำสำรองค่อนข้างต่ำ ร่างกายอาจทนสภาวะแดดแผดเผาได้สั้นกว่าคนปกติ";
  } else {
    bmiDescription = "โครงสร้างร่างกายมีความต้านทานระบายความร้อนได้ดีเยี่ยมตามสรีระทั่วไป และทนต่อสารกระตุ้นระคายฝุ่นได้ตามเกณฑ์ปกติ";
  }

  let riskLevel = "ต่ำ";
  let description = "คุณสุขภาพแข็งแรงดีไม่มีอาการน่าห่วงในวันนี้ค่ะ มีดัชนีมวลกายสมดุลดี";

  if (checked >= 3) {
    riskLevel = bmi >= 25 ? "สูงวิกฤตเฉียบพลัน! (สะสมร่วมกับปัจจัย BMI เกณฑ์สูง)" : "สูงมาก เฝ้าระวังฮีทสโตรก!";
    description = "คุณกำลังมีสัดส่วนของกลุ่มอาการที่เสี่ยงต่อโรคลมแดดรุนแรงมาก และอุณหภูมิร่างกายพร้อมวิกฤตระเบิดไข้เนื่องจากกลไกสรีรวิทยาสูญเสียเหงื่อเตือนภัย";
  } else if (checked >= 1) {
    riskLevel = bmi >= 25 ? "เสี่ยงสูงปานกลางบวกสะสมร่างกายกึ่งหนา" : "ปานกลาง เฝ้าระวัง";
    description = "ร่างกายเริ่มส่งผลตอบสนองต่อสภาวะขาดน้ำและแดดเผาเฉียบพลัน แนะนำรีบย้ายเข้าสู่ร่มพัดลมแอร์ จิบน้ำทดแทนด่วน";
  } else {
    if (bmi >= 25) {
      riskLevel = "เฝ้าระวังความเฉื่อยความร้อน (BMI โดดเด่น)";
      description = "แม้ไม่มีสัญญาณแสดงอาการภายนอก แต่ดัชนีมวลกายที่หนากกว่าเกณฑ์ปกตินี้ทำให้ร่างกายอมแดดได้ไวขึ้น กรุณาพกขวดน้ำจิบอย่างสม่ำเสมอ";
    }
  }

  const pmAdvice = envMetrics.pm25 >= 50 
    ? `⚠️ วันนี้ปริมาณฝุ่น PM2.5 สูงสะสมเป็นภัย (${envMetrics.pm25} µg/m³) ซึ่งเกณฑ์ร่างกายของคุณคัดกรองเสี่ยงอักเสบหลอดลมได้ไวเป็นพิเศษ หลีกเลี่ยงกิจกรรมแจ้งด่วนที่สุดและสวมใส่หน้ากาก N95 ค่ะ`
    : "🍀 อากาศฝุ่นละอองละแวกคุณในระดับค่าคุณภาพดีเยี่ยมค่ะ";

  const heatAdvice = envMetrics.heatIndex >= 35
    ? `🥵 ดัชนีความร้อนพุ่งสูงระอุแตะ (${envMetrics.heatIndex}°C) ด้วยระดับ BMI ของคุณที่ทำให้ร่างกายระเหิดอุณหภูมิช้าลง แนะนำบังคับตัวเองจิบน้ำเปล่าแก้วใหญ่ทุก 45 นาทีค่ะ ห้ามออกแดด`
    : `🌡️ ระดับดัชนีความร้อนทั่วไปปลอดภัยอบอุ่นดีชิวๆ (${envMetrics.heatIndex}°C) ค่ะ`;

  return `### 🩺 ผลการประเมินเบื้องต้นโดย Dr. A (Simulated Risk Report)

**ระบบวิเคราะห์ร่างกาย:**
*   น้ำหนักปัจจุบัน: **${weightVal} กิโลกรัม**
*   ส่วนสูงปัจจุบัน: **${heightVal} เซนติเมตร**
*   **ค่าดัชนีมวลกาย (BMI): ${bmi.toFixed(1)}** [เกณฑ์: **${bmiCategory}**]

**ความเสี่ยงสะสมต่อภัยพิบัติสิ่งแวดล้อม:**
*   🔥 **ตัวคูณความเสี่ยงโรคลมแดด (Heatstroke Multiplier):** **${bmiHeatstrokeMultiplier}** 
    *   *คำอธิบายสรีระ:* ${bmiDescription}
*   😷 **ดัชนีความเสี่ยงต่อฝุ่นละออง PM2.5:** **${bmiPm25Risk}**

---

**ระดับความปลอดภัยของคุณวันนี้: ${riskLevel}** 

**สรุปวิเคราะห์ทางการแพทย์:**
*   ${description}
*   ${pmAdvice}
*   ${heatAdvice}

---

### 🏥 แนวทางปฐมพยาบาลด่วนเฉพาะบุคคล (BMI-Optimized Protocol):
1. **ล็อกเป้าหมายการจิบน้ำเปล่า:** จิบน้ำอุณหภูมิห้องคอยรักษาอาการแห้งตึงเฉลี่ย 2.5 - 3.0 ลิตรต่อวัน (ในวันเกราะฝุ่นความร้อนหนา)
2. **ห้ามอาบน้ำเย็นจัดทันที:** ป้องกันภาวะช็อกความต่างอุณหภูมิหลอดลมของคนไข้โรคอ้วน
3. **เปิดสวิตช์เครื่องฟอกอากาศระเบับสูงสุด:** ร่วมกับการสวมหน้ากากกรองฝุ่นยืดหยุ่นสามมิติ N95
4. **เฝ้าระวังร่วมผู้ดูแล:** บันทึกปุ่มเช็คอินรับคะแนนเพื่อแจ้งตำแหน่งแก่โรงพยาบาลฉุกเฉินยามวิกฤต

*หากรู้สึกหน้ามืด ตาตลายืด เหงื่อหดหาย ผิวหนังแห้งแต่เหนียวสั่น ขอให้โทรตามสายด่วนการแพทย์ฉุกเฉิน 1669 ทันทีด้วยนะคะ ด้วยรักและดูแลค่ะ*`;
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

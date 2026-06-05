import React, { useState, useEffect } from "react";
import { 
  Coins, 
  Calendar, 
  Flame, 
  Sparkles, 
  CheckCircle, 
  Gift, 
  ShoppingBag, 
  ArrowRight,
  Info,
  Award,
  CircleCheck,
  QrCode,
  Tag,
  Clock,
  HeartCrack
} from "lucide-react";

interface DailyCheckInWidgetProps {
  userPoints: number;
  setUserPoints: (points: number | ((prev: number) => number)) => void;
  checkInStreak: number;
  setCheckInStreak: (streak: number | ((prev: number) => number)) => void;
  lastCheckInDate: string | null;
  setLastCheckInDate: (date: string | null) => void;
}

interface RewardItem {
  id: string;
  title: string;
  pointsCost: number;
  description: string;
  category: "pm25" | "heatstroke" | "consultation" | "tools";
  iconText: string;
  stock: number;
}

const HEALTH_REWARDS: RewardItem[] = [
  {
    id: "r1",
    title: "หน้ากากอนามัยชนิดคาร์บอน N95 (กรองฝุ่น 99%)",
    pointsCost: 80,
    description: "ป้องกันฝุ่นละอองขนาดจิ๋ว PM2.5 และกลิ่นเคมีหนาแน่นได้อย่างเต็มประสิทธิภาพ",
    category: "pm25",
    iconText: "😷",
    stock: 24
  },
  {
    id: "r2",
    title: "ผงเกลือแร่กู้คืนพลังงานรสเลมอน ORS (3 ซอง)",
    pointsCost: 50,
    description: "ชดเชยน้ำและการสูญเสียเกลือแร่จากความชื้นและความร้อนจัด ป้องกันภาวะช็อกตะคริวแดด",
    category: "heatstroke",
    iconText: "🥤",
    stock: 45
  },
  {
    id: "r3",
    title: "โค้ดปรึกษาแพทย์กับหมอ AI สมเกียรติ พรินิวอิล (VIP)",
    pointsCost: 150,
    description: "รับสิทธิ์ในการวิเคราะห์โรคประจำตัวและมลพิษโดยตรงแบบไม่มีโฆษณาคั่นและตอบกลับทันที",
    category: "consultation",
    iconText: "🏥",
    stock: 99
  },
  {
    id: "r4",
    title: "สติ๊กเกอร์ออนเซนวัดไข้และอุณหภูมิผิวหนังแบบสัมผัสเร็ว",
    pointsCost: 200,
    description: "แผ่นสติ๊กเกอร์ตรวจจับความร้อนบนผิวหนัง เตือนพฤติกรรมความเสี่ยงก่อนร่างกายโอเวอร์ฮีท",
    category: "tools",
    iconText: "🌡️",
    stock: 12
  },
  {
    id: "r5",
    title: "ร่มกันรังสี UV พิเศษ ป้องกันแสงแดดความตึงสะท้อน 100%",
    pointsCost: 350,
    description: "ลดความร้อนใต้ร่มเงาลงถึง 4 องศาเซลเซียส พกพาสะดวกสำหรับการเดินกลางแสงจ้า",
    category: "heatstroke",
    iconText: "⛱️",
    stock: 5
  }
];

export default function DailyCheckInWidget({
  userPoints,
  setUserPoints,
  checkInStreak,
  setCheckInStreak,
  lastCheckInDate,
  setLastCheckInDate
}: DailyCheckInWidgetProps) {
  // Local UI status states
  const [justCheckedIn, setJustCheckedIn] = useState(false);
  const [checkInRewardGained, setCheckInRewardGained] = useState(0);
  const [activeTab, setActiveTab] = useState<"checkin" | "store" | "my_coupons">("checkin");
  const [redeemedCoupons, setRedeemedCoupons] = useState<Array<{
    id: string;
    rewardTitle: string;
    pointsSpent: number;
    code: string;
    date: string;
    used: boolean;
    categoryIcon: string;
  }>>(() => {
    const saved = localStorage.getItem("health_redeemed_coupons");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [];
  });

  const [activeCouponDetail, setActiveCouponDetail] = useState<any | null>(null);
  const [redemptionSuccessMsg, setRedemptionSuccessMsg] = useState<string | null>(null);

  // Sync redeemed coupons to storage
  useEffect(() => {
    localStorage.setItem("health_redeemed_coupons", JSON.stringify(redeemedCoupons));
  }, [redeemedCoupons]);

  // Compute today date string formatted: YYYY-MM-DD in local time
  const getTodayDateString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const todayStr = getTodayDateString();
  const hasCheckedInToday = lastCheckInDate === todayStr;

  // Streak points multiplier setup
  const getDailyPointsGained = (dayNum: number) => {
    const pointsMap: Record<number, number> = {
      1: 10,
      2: 15,
      3: 20,
      4: 25,
      5: 35,
      6: 50,
      7: 80
    };
    return pointsMap[dayNum] || 15;
  };

  // Perform daily check-in action
  const handlePerformCheckIn = () => {
    if (hasCheckedInToday) return;

    // Evaluate streak duration
    let newStreak = 1;
    if (lastCheckInDate) {
      const lastDate = new Date(lastCheckInDate);
      const todayDate = new Date(todayStr);
      const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // Checked in yesterday, continue streak
        const currentStreakMod = (checkInStreak % 7) + 1;
        newStreak = checkInStreak + 1;
      } else {
        // Broke streak, reset to 1
        newStreak = 1;
      }
    } else {
      // First check in ever
      newStreak = 1;
    }

    // Days representation count 1-7
    const dayIndexInWeek = ((newStreak - 1) % 7) + 1;
    const pointsGained = getDailyPointsGained(dayIndexInWeek);

    // Update global state & storage
    setUserPoints(prev => prev + pointsGained);
    setCheckInStreak(newStreak);
    setLastCheckInDate(todayStr);

    // Save locally
    localStorage.setItem("health_user_points", String(userPoints + pointsGained));
    localStorage.setItem("health_check_in_streak", String(newStreak));
    localStorage.setItem("health_last_check_in_date", todayStr);

    // Animation trigger
    setCheckInRewardGained(pointsGained);
    setJustCheckedIn(true);
    
    // Auto clear congrats sheet after 4 seconds
    setTimeout(() => {
      setJustCheckedIn(false);
    }, 4000);
  };

  // Redeem a health reward
  const handleRedeemReward = (reward: RewardItem) => {
    if (userPoints < reward.pointsCost) {
      alert("ขออภัยค่ะ! แต้มสะสมของคุณครบรังวัดไม่เพียงพอ");
      return;
    }

    // Deduct points
    setUserPoints(prev => prev - reward.pointsCost);
    localStorage.setItem("health_user_points", String(userPoints - reward.pointsCost));

    // Generate random Coupon code
    const randomCode = "AT-" + Math.floor(100000 + Math.random() * 900000);
    const newCoupon = {
      id: "coupon-" + Date.now(),
      rewardTitle: reward.title,
      pointsSpent: reward.pointsCost,
      code: randomCode,
      date: new Date().toLocaleDateString("th-TH", {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      }),
      used: false,
      categoryIcon: reward.iconText
    };

    setRedeemedCoupons(prev => [newCoupon, ...prev]);
    setRedemptionSuccessMsg(`ยินดีด้วยค่ะ! แลกรับ "${reward.title}" เรียบร้อย สามารถเข้าดูรหัสคูปองของคุณได้ที่แท็บ "คูปองของฉัน"`);
    
    setTimeout(() => {
      setRedemptionSuccessMsg(null);
    }, 5000);
  };

  // Convert day number into Thai short day names for 7-day visual grid
  const daysOfStreak = [1, 2, 3, 4, 5, 6, 7];
  const currentDaysIndex = ((checkInStreak - 1) % 7) + 1;

  return (
    <div className="w-full bg-[#fafbfc] border border-slate-200/80 rounded-3xl p-5 md:p-6 space-y-5 shadow-inner">
      
      {/* Header and Point Balance Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-amber-100 border border-amber-200 text-amber-600 p-2.5 rounded-2xl">
            <Coins className="w-5 h-5 md:w-6 h-6 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <h4 id="checkin-title" className="text-xs md:text-sm font-extrabold text-slate-800 tracking-tight flex items-center gap-1.5">
              ระบบเช็คอินแสนดีรายวัน <span className="text-[9px] bg-emerald-500/10 text-emerald-600 border border-emerald-500/25 px-1.5 py-0.5 rounded font-black uppercase">Points System</span>
            </h4>
            <p className="text-[10px] text-slate-500 font-medium">เข้าประเมินดูแลตัวเองสม่ำเสมอ แลกสิ่งของจำลองป้องกันความปลอดภัยฟรี!</p>
          </div>
        </div>

        {/* Current Total Point pill indicator */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 px-4 py-2 rounded-2xl">
          <div className="text-right">
            <p className="text-[8px] text-amber-700 font-bold uppercase tracking-wider leading-none">แต้มสะสมทั้งหมดของคุณ</p>
            <p className="text-lg font-black text-amber-600 font-mono leading-none mt-1">{userPoints} <span className="text-[10px] font-sans font-bold">แต้ม</span></p>
          </div>
          <Coins className="w-5 h-5 text-amber-500" />
        </div>
      </div>

      {/* Internal Navigation Tabs inside Checkin Area */}
      <div className="flex bg-slate-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab("checkin")}
          className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === "checkin"
              ? "bg-white text-blue-600 shadow-3xs"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          เช็คอินรายวัน
        </button>
        <button
          onClick={() => setActiveTab("store")}
          className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === "store"
              ? "bg-white text-blue-600 shadow-3xs"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Gift className="w-3.5 h-3.5" />
          ร้านค้าแลกรางวัล
        </button>
        <button
          onClick={() => setActiveTab("my_coupons")}
          className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 relative ${
            activeTab === "my_coupons"
              ? "bg-white text-blue-600 shadow-3xs"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          คูปองของฉัน
          {redeemedCoupons.length > 0 && (
            <span className="absolute top-1.5 right-4 w-2 h-2 bg-rose-500 rounded-full" />
          )}
        </button>
      </div>

      {/* Tab 1: Check-in Activity Workspace */}
      {activeTab === "checkin" && (
        <div className="space-y-4 animate-fade-in text-slate-800">
          
          {/* Congrats Alert Box on Just success check-in */}
          {justCheckedIn && (
            <div className="bg-emerald-500 border border-emerald-400 text-white p-4 rounded-2xl flex items-center gap-3 shadow-md animate-bounce">
              <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse shrink-0" />
              <div>
                <p className="font-extrabold text-xs">เช็คอินสุขภาพวันนี้รับแต้มเรียบร้อย!</p>
                <p className="text-[10px] text-emerald-100">แต้มทวีคูณต่อเนื่องสะสมสำเร็จแล้ว <strong className="text-white">+{checkInRewardGained} แต้ม</strong> รักษาวินัยต่อไปนะคะ!</p>
              </div>
            </div>
          )}

          {/* Core Invitation Message */}
          <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 justify-between">
            <div className="space-y-1 text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
                <span className="text-[10px] text-orange-600 bg-orange-100/50 px-2.5 py-0.5 rounded-full font-bold">เช็คอินสะสม {checkInStreak} วันต่อเนื่อง</span>
              </div>
              <h5 className="font-bold text-xs text-slate-700">สะสมพลังความรับผิดชอบสุขภาพ</h5>
              <p className="text-[10px] text-slate-500 leading-tight">เข้าร่วมตรวจสอบสุขภาพฝุ่นละออง PM2.5 และความร้อนช่วยคุ้มครองตัวเมืองและแลกของรางวัลสุขภาพ</p>
            </div>

            {/* Main Interactive Checkin Trigger Button */}
            <button
              id="btn-perform-daily-checkin"
              onClick={handlePerformCheckIn}
              disabled={hasCheckedInToday}
              className={`px-6 py-3.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md shrink-0 w-full md:w-auto justify-center ${
                hasCheckedInToday
                  ? "bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed shadow-none"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white hover:shadow-lg hover:shadow-blue-500/10 active:scale-95"
              }`}
            >
              {hasCheckedInToday ? (
                <>
                  <CircleCheck className="w-4 h-4 text-slate-400" />
                  วันนี้เช็คอินสะสมเรียบร้อยแล้ว
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                  กดรับแต้มเช็คอินวันนี้ (+{getDailyPointsGained(currentDaysIndex)} แต้ม)
                </>
              )}
            </button>
          </div>

          {/* Gamified 7-day streak road progress display */}
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2.5">ตารางเช็คอินต่อเนื่องรายสัปดาห์ (Day 1 - Day 7)</p>
            <div className="grid grid-cols-7 gap-2">
              {daysOfStreak.map((day) => {
                const isPast = day < currentDaysIndex || (day === currentDaysIndex && hasCheckedInToday);
                const isCurrentActive = day === currentDaysIndex && !hasCheckedInToday;
                const points = getDailyPointsGained(day);
                
                return (
                  <div 
                    key={day}
                    className={`flex flex-col items-center p-2 rounded-xl border text-center transition-all ${
                      isPast 
                        ? "bg-emerald-50 border-emerald-250 text-emerald-800"
                        : isCurrentActive
                          ? "bg-blue-50 border-blue-400 text-blue-700 animate-pulse ring-2 ring-blue-500/10"
                          : "bg-white border-slate-200 text-slate-400"
                    }`}
                  >
                    <span className="text-[8px] font-bold uppercase leading-none block mb-1">วันที่ {day}</span>
                    <div className="my-1.5">
                      {isPast ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <span className={`text-[11px] font-black ${isCurrentActive ? "text-blue-500" : "text-amber-500"}`}>
                          +{points}
                        </span>
                      )}
                    </div>
                    <span className={`text-[8px] font-bold ${isPast ? "text-emerald-600" : isCurrentActive ? "text-blue-600" : "text-slate-400"}`}>
                      {isPast ? "สำเร็จ" : "แต้ม"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick FAQ / Info block for user trust */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3 flex gap-2.5">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-[10px] text-blue-800 leading-normal">
              <strong>เคล็ดลับน่ารู้:</strong> แต้มสะสมไม่มีวันหมดอายุค่ะ! คุณสามารถเปิดเว็บไซต์เช็คอินสะสมได้ในทุกอุปกรณ์ และหากเช็คอินต่อเนื่องครบ 7 วัน จะได้รับโบนัสแจ็คพอตสูงถึง <strong className="text-amber-600 font-bold">80 แต้ม</strong> ในวันที่ 7 ของรอบด้วยนะคะ!
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Health Rewards Store catalogue */}
      {activeTab === "store" && (
        <div className="space-y-4 animate-fade-in">
          
          {/* Redemption success banner message */}
          {redemptionSuccessMsg && (
            <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2.5 shadow-xs">
              <CircleCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{redemptionSuccessMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {HEALTH_REWARDS.map((reward) => {
              const isAffordable = userPoints >= reward.pointsCost;
              return (
                <div 
                  key={reward.id} 
                  id={`reward-card-${reward.id}`}
                  className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-4 flex flex-col justify-between transition-all shadow-3xs group hover:shadow-xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl select-none">{reward.iconText}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        reward.category === 'pm25' 
                          ? 'bg-orange-100 text-orange-700' 
                          : reward.category === 'heatstroke' 
                            ? 'bg-rose-100 text-rose-700' 
                            : reward.category === 'consultation'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-indigo-100 text-indigo-700'
                      }`}>
                        {reward.category === 'pm25' ? "ซีรีส์ฝุ่นละออง" : reward.category === 'heatstroke' ? "ซีรีส์ลมแดด" : reward.category === 'consultation' ? "ซีรีส์พบแพทย์" : "ยาและเครื่องมือ"}
                      </span>
                    </div>

                    <h6 className="font-bold text-xs text-slate-800 mt-1 leading-snug group-hover:text-blue-600 transition-colors">{reward.title}</h6>
                    <p className="text-[10px] text-slate-500 leading-normal">{reward.description}</p>
                    <p className="text-[9px] text-slate-400 font-semibold">จำนวนคลังคงเหลือจำลอง: <span className="font-mono text-slate-600">{reward.stock} ชิ้น</span></p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between">
                    {/* Cost Indicator */}
                    <div className="flex items-center gap-1.5">
                      <Coins className="w-4 h-4 text-amber-500 animate-bounce" style={{ animationDuration: '3s' }} />
                      <span className="text-xs font-black text-amber-600 font-mono">{reward.pointsCost} <span className="font-sans font-bold text-[10px]">แต้ม</span></span>
                    </div>

                    {/* Action Redeem button */}
                    <button
                      onClick={() => handleRedeemReward(reward)}
                      disabled={!isAffordable}
                      className={`px-3 py-1.5 rounded-xl font-bold text-[10px] transition-all flex items-center gap-1 cursor-pointer ${
                        isAffordable
                          ? "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-3xs"
                          : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                      }`}
                    >
                      <span>{isAffordable ? "กดแลกรับของรางวัล" : "แต้มไม่เพียงพอ"}</span>
                      {isAffordable && <ArrowRight className="w-3 h-3 text-white" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Redeemed Coupons verification tracker */}
      {activeTab === "my_coupons" && (
        <div className="space-y-4 animate-fade-in text-slate-800">
          {redeemedCoupons.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 border border-slate-150 rounded-2xl text-slate-400 space-y-2">
              <HeartCrack className="w-8 h-8 text-slate-300 mx-auto animate-pulse" />
              <p className="font-bold text-xs text-slate-500">ยังไม่มีประวัติการแลกคูปองค่ะ</p>
              <p className="text-[10px] text-slate-400">เช็คอินสะสมแต้มแวะไปเลือกของรางวัลที่แท็บ "ร้านค้าแลกรางวัล" กันได้เลย!</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">คูปองความพยายามและการดูแลของฉัน ({redeemedCoupons.length})</p>
              
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {redeemedCoupons.map((coupon) => (
                  <div 
                    key={coupon.id}
                    className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-3xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-2xl select-none shrink-0">{coupon.categoryIcon}</span>
                      <div className="min-w-0">
                        <h6 className="font-bold text-xs text-slate-800 truncate leading-tight">{coupon.rewardTitle}</h6>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-[9px] text-[#2563eb] font-bold bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded leading-none flex items-center gap-1">
                            <Tag className="w-2.5 h-2.5" /> รหัส: {coupon.code}
                          </span>
                          <span className="text-[9px] text-slate-400 flex items-center gap-1 leading-none">
                            <Clock className="w-2.5 h-2.5" /> {coupon.date}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* View Button to slide modal details */}
                    <button
                      onClick={() => setActiveCouponDetail(coupon)}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-xl text-[10px] font-semibold transition-all shrink-0 cursor-pointer"
                    >
                      แสดงใบแลกรับ
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pop-up dialog detail coupon presentation */}
      {activeCouponDetail && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in backdrop-blur-2xs select-none">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 text-center space-y-4 shadow-2xl relative">
            <button 
              onClick={() => setActiveCouponDetail(null)}
              className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full p-1.5 w-7 h-7 flex items-center justify-center font-bold text-xs cursor-pointer transition-colors"
            >
              ✕
            </button>

            <span className="text-4xl block animate-bounce">{activeCouponDetail.categoryIcon}</span>
            <div className="space-y-1">
              <h5 className="font-extrabold text-xs text-slate-900 leading-tight pr-4">ตั๋วแลกรับรางวัลรหัสสุขภาพเพื่อความมั่นคง</h5>
              <p className="text-[10px] text-slate-500">{activeCouponDetail.rewardTitle}</p>
            </div>

            {/* Simulated QR barcode view block for high reality styling */}
            <div className="bg-slate-50 p-4 border border-slate-150 rounded-2xl space-y-2 flex flex-col items-center">
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <QrCode className="w-24 h-24 text-slate-800 animate-pulse" style={{ animationDuration: '4s' }} />
              </div>
              <p className="text-[11px] font-bold tracking-widest text-[#2563eb] font-mono select-all">รหัสอนุมัติ: {activeCouponDetail.code}</p>
              <p className="text-[8px] text-slate-400">แลกรับสิทธิ์ที่ อสม. / รพ.สต. ใกล้เคียง ด้วยรหัสตรวจสอบข้างต้น</p>
            </div>

            <div className="text-[9px] text-slate-400 leading-normal">
              คูปองนี้ได้รับการรับรองสิทธิ์โดยกระทรวงสาธารณสุขจำลอง All About Today เพื่อผลัดเปลี่ยนมวลสารความปลอดภัยส่วนบุคคล
            </div>

            <button
              onClick={() => setActiveCouponDetail(null)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
            >
              ปิดหน้าต่างตั๋วคูปอง
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

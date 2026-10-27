import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Heart, 
  CheckCircle2, 
  Sparkles, 
  Send, 
  MessageSquare, 
  Star, 
  User, 
  HelpCircle,
  Activity,
  Smile,
  Frown,
  Meh,
  ThumbsUp,
  ThumbsDown,
  XCircle,
  Share2,
  AlertCircle,
  RefreshCw,
  Building,
  Clock,
  Briefcase,
  Shield,
  History,
  ArrowLeft,
  LayoutGrid,
  Lock,
  Calendar
} from 'lucide-react';
import { Campaign, Question, RespondentDemographics, SurveySubmission } from '../types';
import { STATION_INFO } from '../data/initialData';
import { computeSubmissionScorePercent } from '../utils/scoring';
import { checkCampaignStatus, formatThaiDate, getCampaignTheme } from '../utils/campaignHelper';

interface ClientSurveyViewProps {
  campaign: Campaign;
  onSubmitSurvey: (submission: SurveySubmission) => void;
  onBackToSelect?: () => void;
  isKioskMode?: boolean;
}

const SMILEY_OPTIONS = [
  { value: 1, label: 'น้อยที่สุด', sublabel: '1 ดาว', icon: Frown, color: 'text-rose-500', bg: 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-700', activeBg: 'bg-rose-500 text-white shadow-rose-500/30' },
  { value: 2, label: 'น้อย', sublabel: '2 ดาว', icon: Frown, color: 'text-orange-500', bg: 'bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-700', activeBg: 'bg-orange-500 text-white shadow-orange-500/30' },
  { value: 3, label: 'ปานกลาง', sublabel: '3 ดาว', icon: Meh, color: 'text-amber-500', bg: 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-700', activeBg: 'bg-amber-500 text-white shadow-amber-500/30' },
  { value: 4, label: 'มาก', sublabel: '4 ดาว', icon: Smile, color: 'text-teal-600', bg: 'bg-teal-50 hover:bg-teal-100 border-teal-200 text-teal-700', activeBg: 'bg-teal-600 text-white shadow-teal-600/30' },
  { value: 5, label: 'มากที่สุด', sublabel: '5 ดาว', icon: Sparkles, color: 'text-emerald-600', bg: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700', activeBg: 'bg-emerald-600 text-white shadow-emerald-600/30' },
];

export const getAgeRangeLabel = (age?: number): string => {
  if (age === undefined || isNaN(age)) return 'ไม่ระบุ';
  if (age < 20) return 'ต่ำกว่า 20 ปี';
  if (age <= 35) return '20 - 35 ปี';
  if (age <= 50) return '36 - 50 ปี';
  if (age <= 60) return '51 - 60 ปี';
  return 'มากกว่า 60 ปี';
};

export const ClientSurveyView: React.FC<ClientSurveyViewProps> = ({
  campaign,
  onSubmitSurvey,
  onBackToSelect,
  isKioskMode = false,
}) => {
  const theme = getCampaignTheme(campaign);
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [demographics, setDemographics] = useState<RespondentDemographics>({
    gender: 'ไม่ระบุ',
    age: 35,
    ageRange: '20 - 35 ปี',
    occupation: 'อาจารย์/พนักงานมหาวิทยาลัยอุบล',
    coverage: 'ข้าราชการ/กรมบัญชีกลาง',
    visitHistory: 'รับบริการตรวจสุขภาพมากกว่า 1 ครั้ง',
    serviceType: 'ตรวจสุขภาพประจำปี',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submittedScore, setSubmittedScore] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const scoredQuestions = campaign.questions.filter(
    (q) => q.type === 'rating5' || q.type === 'smiley5' || q.type === 'yesno'
  );

  const answeredScoredCount = scoredQuestions.filter((q) => answers[q.id] !== undefined).length;
  const progressPercent = scoredQuestions.length > 0
    ? Math.round((answeredScoredCount / scoredQuestions.length) * 100)
    : 100;

  const currentEstimatedScore = computeSubmissionScorePercent(
    answers,
    campaign.questions,
    campaign.scoringScaleMax || 5
  );

  const handleSelectScore = (questionId: string, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleTextChange = (questionId: string, text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: text,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required questions
    const missingRequired = campaign.questions.filter(
      (q) => q.required && (answers[q.id] === undefined || answers[q.id] === '')
    );

    if (missingRequired.length > 0) {
      setErrorMessage(`กรุณาตอบคำถามที่จำเป็นให้ครบถ้วน (ยังขาดอีก ${missingRequired.length} ข้อ)`);
      // Scroll to first unanswered question
      const firstEl = document.getElementById(`q-box-${missingRequired[0].id}`);
      if (firstEl) {
        firstEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const finalScore = computeSubmissionScorePercent(
      answers,
      campaign.questions,
      campaign.scoringScaleMax || 5
    );

    const submission: SurveySubmission = {
      id: `resp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      campaignId: campaign.id,
      submittedAt: new Date().toISOString(),
      demographics,
      answers,
      overallScorePercent: finalScore,
    };

    onSubmitSurvey(submission);
    setSubmittedScore(finalScore);
    setSubmitted(true);

    // Delightful Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0d9488', '#10b981', '#3b82f6', '#f59e0b'],
      });
    } catch (e) {
      console.log('confetti not supported', e);
    }
  };

  const handleResetForNextRespondent = () => {
    setAnswers({});
    setSubmitted(false);
    setSubmittedScore(0);
    setErrorMessage(null);
    setDemographics({
      gender: 'ไม่ระบุ',
      age: undefined,
      ageRange: undefined,
      occupation: 'อาจารย์/พนักงานมหาวิทยาลัยอุบล',
      coverage: 'ข้าราชการ/กรมบัญชีกลาง',
      visitHistory: 'รับบริการตรวจสุขภาพมากกว่า 1 ครั้ง',
      serviceType: 'ตรวจสุขภาพประจำปี',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const statusCheck = checkCampaignStatus(campaign);

  if (!statusCheck.isOpen) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 sm:py-16">
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200 text-center relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-48 h-48 bg-rose-50 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-amber-50 rounded-full blur-2xl pointer-events-none" />

          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-rose-50 border-2 border-rose-200 rounded-3xl mx-auto flex items-center justify-center text-rose-600 shadow-md shadow-rose-500/10 mb-5">
            <Lock className="w-9 h-9" />
          </div>

          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border mb-3 ${statusCheck.badgeClass}`}>
            <span className={`w-2 h-2 rounded-full ${statusCheck.dotClass}`} />
            {statusCheck.statusLabel}
          </span>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2 font-['Prompt']">
            {campaign.title}
          </h2>

          <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto leading-relaxed">
            {statusCheck.reason || 'แบบประเมินสำหรับกิจกรรมนี้ปิดรับคำตอบอยู่ หรืออยู่นอกช่วงเวลาที่เปิดให้ประเมิน'}
          </p>

          {(campaign.startDate || campaign.endDate) && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 text-left max-w-sm mx-auto text-xs text-slate-600 space-y-1.5">
              <div className="font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
                <Calendar className="w-4 h-4 text-emerald-600" />
                กำหนดการช่วงเวลาประเมิน:
              </div>
              <div className="flex justify-between text-slate-600">
                <span>เริ่มเปิดระบบ:</span>
                <span className="font-medium text-slate-800">{formatThaiDate(campaign.startDate) || 'ไม่ระบุ'}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>สิ้นสุดกำหนด:</span>
                <span className="font-medium text-slate-800">{formatThaiDate(campaign.endDate) || 'ไม่ระบุ'}</span>
              </div>
            </div>
          )}

          {onBackToSelect && (
            <button
              onClick={onBackToSelect}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 shadow-md shadow-emerald-700/20 transition transform active:scale-98 text-sm"
            >
              <LayoutGrid className="w-4 h-4" />
              <span>เลือกกิจกรรมตรวจสุขภาพอื่น</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className={`min-h-screen ${theme.pageBgGradient} py-12 sm:py-16 relative overflow-hidden flex items-center justify-center transition-colors duration-500`}>
        {/* Dynamic Ambient Color Orbs */}
        <div className={`fixed -right-24 top-16 w-96 h-96 rounded-full blur-3xl pointer-events-none ${theme.pageAmbientGlow1} -z-0`} />
        <div className={`fixed -left-24 bottom-16 w-96 h-96 rounded-full blur-3xl pointer-events-none ${theme.pageAmbientGlow2} -z-0`} />

        <div className="max-w-2xl w-full mx-auto px-4 relative z-10">
          <div className={`bg-white/95 backdrop-blur-xs rounded-3xl p-8 sm:p-12 shadow-xl ${theme.cardBorder} text-center relative overflow-hidden`}>
            {/* Top Distinct Activity Signature Stripe */}
            <div className={`h-2.5 w-full ${theme.cardTopStripe} absolute top-0 left-0`} />
            <div className={`absolute -right-16 -top-16 w-48 h-48 ${theme.pageAmbientGlow1} rounded-full blur-2xl pointer-events-none`} />
            <div className={`absolute -left-16 -bottom-16 w-48 h-48 ${theme.pageAmbientGlow2} rounded-full blur-2xl pointer-events-none`} />

            <div className={`w-20 h-20 bg-gradient-to-tr ${theme.progressGradient} rounded-3xl mx-auto flex items-center justify-center text-white shadow-lg mb-6 animate-bounce`}>
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 font-['Prompt']">
              ขอบพระคุณสำหรับความคิดเห็นของท่าน
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto mb-6">
              {campaign.thankYouMessage || 'ข้อมูลการประเมินของท่านได้รับการบันทึกสู่ระบบแบบเรียลไทม์เพื่อพัฒนาคุณภาพบริการตรวจสุขภาพอย่างต่อเนื่อง'}
            </p>

            {/* Score Badge */}
            <div className={`inline-flex flex-col items-center p-4 sm:p-5 rounded-2xl border mb-8 min-w-[220px] ${theme.periodBg}`}>
              <span className={`text-xs font-semibold uppercase tracking-wider ${theme.accentTextColor}`}>
                คะแนนความพึงพอใจการประเมินของท่าน
              </span>
              <div className={`flex items-baseline gap-1 mt-1 font-extrabold text-3xl sm:text-4xl ${theme.accentTextColor}`}>
                <span>{submittedScore.toFixed(1)}%</span>
                <span className="text-xs font-medium opacity-80">ร้อยละ</span>
              </div>
              <span className={`text-xs mt-1 flex items-center gap-1 font-medium ${theme.accentTextColor}`}>
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                กิจกรรม: {campaign.title}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleResetForNextRespondent}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white ${theme.btnBg} shadow-md transition transform active:scale-98 text-sm`}
              >
                <RefreshCw className="w-4 h-4" />
                <span>ทำแบบประเมินท่านถัดไป (กิจกรรมเดิม)</span>
              </button>

              {onBackToSelect && (
                <button
                  onClick={onBackToSelect}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition text-sm"
                >
                  <LayoutGrid className="w-4 h-4 text-slate-500" />
                  <span>กลับสู่หน้าเลือกกิจกรรม</span>
                </button>
              )}
            </div>
            
            {isKioskMode && (
              <p className="text-xs text-slate-400 mt-4">
                * สำหรับโหมดตู้คีออสก์หรือแท็บเล็ตจุดพักคอย
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.pageBgGradient} py-6 sm:py-10 transition-colors duration-500 relative overflow-hidden`}>
      {/* Dynamic Ambient Background Color Orbs */}
      <div className={`fixed -right-28 top-12 w-96 h-96 rounded-full blur-3xl pointer-events-none ${theme.pageAmbientGlow1} -z-0`} />
      <div className={`fixed -left-28 bottom-12 w-96 h-96 rounded-full blur-3xl pointer-events-none ${theme.pageAmbientGlow2} -z-0`} />

      <div className="max-w-3xl mx-auto px-4 relative z-10">
        
        {/* Campaign Banner Header with Distinct Activity Color Scheme */}
        <div className={`bg-white/95 backdrop-blur-xs rounded-3xl p-6 sm:p-8 shadow-sm ${theme.cardBorder} mb-6 relative overflow-hidden`}>
          {/* Top Activity Signature Color Stripe */}
          <div className={`h-2.5 w-full ${theme.cardTopStripe} absolute top-0 left-0`} />
          <div className={`absolute top-0 right-0 w-64 h-64 ${theme.pageAmbientGlow1} rounded-bl-full -z-0 pointer-events-none`} />
          
          <div className="relative z-10">
            {/* Back to activity selection button & Mode indicator */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              {onBackToSelect ? (
                <button
                  type="button"
                  onClick={onBackToSelect}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-100/90 hover:bg-slate-200 px-3.5 py-1.5 rounded-xl border border-slate-200 transition shadow-2xs group"
                  title="กลับสู่หน้าแรกเพื่อเลือกกิจกรรมอื่น"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-slate-600 group-hover:-translate-x-0.5 transition-transform" />
                  <span>← เปลี่ยนกิจกรรมตรวจสุขภาพ (กลับหน้าแรก)</span>
                </button>
              ) : <div />}

              {/* Patient Mode Badge with Activity Signature Colors */}
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-2xs ${theme.badgeBg}`}>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ring-2 ring-emerald-200" />
                <span>โหมดผู้รับบริการ (Patient Evaluation)</span>
              </div>
            </div>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-2xs ${theme.badgeBg}`}>
              <Activity className="w-3.5 h-3.5 shrink-0" />
              <span>{campaign.code}</span>
            </span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold border ${theme.chipClass}`}>
              {theme.name.split(' ')[0]}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold text-emerald-900 bg-amber-50/80 border border-amber-300/70 shadow-2xs">
              <Sparkles className="w-3 h-3 text-amber-500" />
              งานอาชีวเวชกรรม กลุ่มงานบริการปฐมภูมิ
            </span>
            <span className="text-xs font-medium text-slate-500">
              หน่วยบริการ: {campaign.targetUnit}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight font-['Prompt'] mb-2">
            {campaign.title}
          </h1>
          
          <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
            {campaign.description || 'ขอความร่วมมือตอบแบบประเมินความพึงพอใจเพื่อพัฒนาคุณภาพการให้บริการตรวจสุขภาพให้ดียิ่งขึ้น'}
          </p>

          {/* General Demographics Selector */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-800">
              <User className="w-3.5 h-3.5 text-teal-600" />
              <span>ข้อมูลทั่วไปของผู้รับบริการ</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-slate-700">
              {/* 1. เพศ */}
              <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/70">
                <span className="font-medium text-slate-600 block mb-1.5">เพศ:</span>
                <div className="inline-flex w-full rounded-lg bg-slate-200/70 p-0.5">
                  {(['ชาย', 'หญิง', 'ไม่ระบุ'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setDemographics((d) => ({ ...d, gender: g }))}
                      className={`flex-1 py-1 text-xs font-medium rounded-md transition text-center ${
                        demographics.gender === g
                          ? 'bg-white text-slate-900 shadow-xs font-semibold'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. อายุ (ระบุเป็นตัวเลข) */}
              <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/70">
                <label className="font-medium text-slate-600 block mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-teal-600" />
                    <span>อายุ (ปี):</span>
                  </span>
                  {demographics.age !== undefined && !isNaN(demographics.age) && (
                    <span className="text-[10px] text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200 font-medium">
                      {getAgeRangeLabel(demographics.age)}
                    </span>
                  )}
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={demographics.age !== undefined ? demographics.age : ''}
                    onChange={(e) => {
                      const raw = e.target.value.trim();
                      const val = raw === '' ? undefined : parseInt(raw, 10);
                      setDemographics((d) => ({
                        ...d,
                        age: val,
                        ageRange: val !== undefined ? getAgeRangeLabel(val) : undefined,
                      }));
                    }}
                    placeholder="กรอกอายุเป็นตัวเลข เช่น 35"
                    className="w-full bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 shadow-2xs"
                  />
                  <span className="absolute right-2.5 text-xs text-slate-400 pointer-events-none font-medium">
                    ปี
                  </span>
                </div>
              </div>

              {/* 3. อาชีพ */}
              <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/70">
                <label className="font-medium text-slate-600 block mb-1.5 flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-teal-600" />
                  <span>อาชีพ:</span>
                </label>
                <select
                  value={demographics.occupation || 'อาจารย์/พนักงานมหาวิทยาลัยอุบล'}
                  onChange={(e) => setDemographics((d) => ({ ...d, occupation: e.target.value as any }))}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 truncate"
                >
                  <option value="ข้าราชการ/พนักงานรัฐ">ข้าราชการ/พนักงานรัฐ</option>
                  <option value="อาจารย์/พนักงานมหาวิทยาลัยอุบล">อาจารย์/พนักงานมหาวิทยาลัยอุบล</option>
                  <option value="รัฐวิสาหกิจ">รัฐวิสาหกิจ</option>
                  <option value="พนักงานเอกชน">พนักงานเอกชน</option>
                  <option value="ธุรกิจส่วนตัว/ค้าขาย">ธุรกิจส่วนตัว/ค้าขาย</option>
                  <option value="นักเรียน/นักศึกษา">นักเรียน/นักศึกษา</option>
                  <option value="อื่นๆ">อื่นๆ</option>
                </select>
              </div>

              {/* 4. สิทธิการรักษา */}
              <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/70">
                <label className="font-medium text-slate-600 block mb-1.5 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-teal-600" />
                  <span>สิทธิการรักษา:</span>
                </label>
                <select
                  value={demographics.coverage || 'ข้าราชการ/กรมบัญชีกลาง'}
                  onChange={(e) => setDemographics((d) => ({ ...d, coverage: e.target.value as any }))}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 truncate"
                >
                  <option value="ข้าราชการ/กรมบัญชีกลาง">ข้าราชการ/กรมบัญชีกลาง</option>
                  <option value="อปท">อปท</option>
                  <option value="รัฐวิสาหกิจ">รัฐวิสาหกิจ</option>
                  <option value="ประกันสังคม">ประกันสังคม</option>
                  <option value="หลักประกันสุขภาพแห่งชาติ(บัตรทอง)">หลักประกันสุขภาพแห่งชาติ(บัตรทอง)</option>
                  <option value="สปสช">สปสช</option>
                  <option value="ชำระเงินเอง">ชำระเงินเอง</option>
                </select>
              </div>

              {/* 5. ประวัติการรับบริการ */}
              <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/70 sm:col-span-2">
                <span className="font-medium text-slate-600 block mb-1.5 flex items-center gap-1">
                  <History className="w-3.5 h-3.5 text-teal-600" />
                  <span>ประวัติการรับบริการ:</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'รับบริการตรวจสุขภาพมากกว่า 1 ครั้ง',
                    'มารับบริการครั้งแรก',
                  ].map((hist) => {
                    const isSelected = demographics.visitHistory === hist;
                    return (
                      <button
                        key={hist}
                        type="button"
                        onClick={() => setDemographics((d) => ({ ...d, visitHistory: hist as any }))}
                        className={`py-1.5 px-3 rounded-lg text-xs font-medium border text-center transition ${
                          isSelected
                            ? 'bg-teal-600 text-white border-teal-600 font-semibold shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {hist}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Progress & Live Rating Score Indicator */}
      <div className="sticky top-16 sm:top-20 z-30 bg-slate-50/95 backdrop-blur-md py-3 px-2 mb-6 border-b border-slate-200/60 flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs font-medium text-slate-600 mb-1.5">
            <span>ความคืบหน้าการตอบ ({answeredScoredCount}/{scoredQuestions.length} ข้อ)</span>
            <span className="font-bold text-slate-800">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${theme.progressGradient} transition-all duration-300 rounded-full`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {answeredScoredCount > 0 && (
          <div className="hidden sm:flex items-center gap-2 bg-slate-100/80 border border-slate-200 px-3 py-1.5 rounded-xl">
            <span className="text-xs text-slate-700 font-medium">คะแนนร้อยละเฉลี่ย:</span>
            <span className="text-sm font-bold text-slate-900">{currentEstimatedScore.toFixed(0)}%</span>
          </div>
        )}
      </div>

      {/* Questions Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {campaign.questions.map((question, index) => {
          const isAnswered = answers[question.id] !== undefined;
          const isCustom = question.category === 'dimension_other' || Boolean(question.customCategoryName) || !STATION_INFO[question.category];
          const displayDimName = question.customCategoryName || STATION_INFO[question.category]?.nameTh || question.category;
          const badgeClass = isCustom 
            ? 'bg-fuchsia-50 text-fuchsia-800 border border-fuchsia-300 font-medium' 
            : (STATION_INFO[question.category]?.badgeClass || 'bg-slate-100 text-slate-700 font-medium');

          return (
            <div
              key={`survey_q_${question.id}_${index}`}
              id={`q-box-${question.id}`}
              className={`bg-white rounded-2xl p-5 sm:p-7 shadow-xs border transition-all ${
                isAnswered
                  ? 'border-slate-200'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-md ${badgeClass}`}>
                      {displayDimName}
                    </span>
                    {question.required && (
                      <span className="text-rose-500 text-xs font-medium" title="จำเป็นต้องตอบ">
                        *จำเป็น
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 leading-snug font-['Prompt']">
                    {question.text}
                  </h3>
                  
                  {question.description && (
                    <p className="text-xs text-slate-500 mt-1">
                      {question.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Question Input based on Type */}
              <div className="mt-4">
                
                {/* 5-Smiley Rating */}
                {(question.type === 'smiley5' || question.type === 'rating5') && (
                  <div className="grid grid-cols-5 gap-2 sm:gap-3">
                    {SMILEY_OPTIONS.map((opt) => {
                      const isSelected = answers[question.id] === opt.value;
                      const Icon = opt.icon;

                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleSelectScore(question.id, opt.value)}
                          className={`flex flex-col items-center justify-center p-2.5 sm:p-4 rounded-xl border transition-all group ${
                            isSelected
                              ? `${opt.activeBg} font-bold shadow-md scale-102 ring-2 ring-teal-500/20`
                              : `${opt.bg} hover:scale-101`
                          }`}
                        >
                          <Icon className={`w-6 h-6 sm:w-8 sm:h-8 mb-1 transition ${isSelected ? 'text-white' : opt.color}`} />
                          <span className="text-xs sm:text-sm text-center leading-tight">
                            {opt.label}
                          </span>
                          <span className={`text-[10px] mt-0.5 hidden sm:inline ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                            {opt.value} คะแนน
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Yes / No */}
                {question.type === 'yesno' && (
                  <div className="grid grid-cols-2 gap-3 max-w-sm">
                    {[
                      { value: 5, label: 'พึงพอใจ / เรียบร้อย' },
                      { value: 1, label: 'ไม่พึงพอใจ / ควรปรับปรุง' },
                    ].map((opt) => {
                      const isSelected = answers[question.id] === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleSelectScore(question.id, opt.value)}
                          className={`py-3 px-4 rounded-xl border text-sm font-semibold transition ${
                            isSelected
                              ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Recommend Intent: ตั้งใจแนะนำ / ไม่ตั้งใจแนะนำ */}
                {question.type === 'recommend_intent' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
                    {[
                      { 
                        value: 5, 
                        label: 'ตั้งใจแนะนำ', 
                        sub: 'ยินดีบอกต่อแก่ครอบครัวและคนใกล้ชิด',
                        icon: ThumbsUp,
                        activeCls: 'bg-teal-600 text-white border-teal-600 shadow-md ring-2 ring-teal-500/30'
                      },
                      { 
                        value: 1, 
                        label: 'ไม่ตั้งใจแนะนำ', 
                        sub: 'ยังไม่พร้อมแนะนำแก่ผู้อื่นในขณะนี้',
                        icon: ThumbsDown,
                        activeCls: 'bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-500/30'
                      },
                    ].map((opt) => {
                      const isSelected = answers[question.id] === opt.value;
                      const IconComp = opt.icon;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleSelectScore(question.id, opt.value)}
                          className={`flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border text-left transition-all ${
                            isSelected
                              ? opt.activeCls
                              : 'bg-slate-50/80 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                          }`}
                        >
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-white border border-slate-200 text-slate-600 shadow-2xs'
                          }`}>
                            <IconComp className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-sm font-bold block leading-snug">
                              {opt.label}
                            </span>
                            <span className={`text-[11px] block mt-0.5 leading-tight ${isSelected ? 'text-white/85' : 'text-slate-400'}`}>
                              {opt.sub}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Return Intent: ตั้งใจกลับมาใช้บริการ / ไม่ตั้งใจกลับมาใช้บริการ */}
                {question.type === 'return_intent' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
                    {[
                      { 
                        value: 5, 
                        label: 'ตั้งใจกลับมาใช้บริการ', 
                        sub: 'จะกลับมาตรวจสุขภาพที่นี่อีกในครั้งต่อไป',
                        icon: RefreshCw,
                        activeCls: 'bg-teal-600 text-white border-teal-600 shadow-md ring-2 ring-teal-500/30'
                      },
                      { 
                        value: 1, 
                        label: 'ไม่ตั้งใจกลับมาใช้บริการ', 
                        sub: 'ยังไม่แน่ใจหรืออาจพิจารณาที่อื่น',
                        icon: XCircle,
                        activeCls: 'bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-500/30'
                      },
                    ].map((opt) => {
                      const isSelected = answers[question.id] === opt.value;
                      const IconComp = opt.icon;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleSelectScore(question.id, opt.value)}
                          className={`flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border text-left transition-all ${
                            isSelected
                              ? opt.activeCls
                              : 'bg-slate-50/80 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                          }`}
                        >
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-white border border-slate-200 text-slate-600 shadow-2xs'
                          }`}>
                            <IconComp className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-sm font-bold block leading-snug">
                              {opt.label}
                            </span>
                            <span className={`text-[11px] block mt-0.5 leading-tight ${isSelected ? 'text-white/85' : 'text-slate-400'}`}>
                              {opt.sub}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Free Text / Feedback */}
                {question.type === 'text' && (
                  <div>
                    <textarea
                      rows={3}
                      value={String(answers[question.id] || '')}
                      onChange={(e) => handleTextChange(question.id, e.target.value)}
                      placeholder="เขียนข้อเสนอแนะ ข้อประทับใจ หรือสิ่งที่ต้องการให้โรงพยาบาลปรับปรุงเพิ่มเติม..."
                      className="w-full p-3.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-slate-800 placeholder-slate-400"
                    />
                  </div>
                )}

              </div>

            </div>
          );
        })}

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-3 text-sm font-medium animate-pulse">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Submit Actions */}
        <div className="pt-4 pb-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            <span>ระบบรวบรวมและวิเคราะห์ผลแบบเรียลไทม์ • ปลอดภัยและไม่ระบุตัวตน</span>
          </div>
          <button
            type="submit"
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white ${theme.btnBg} transition transform active:scale-98`}
          >
            <Send className="w-5 h-5" />
            <span>ส่งแบบประเมินความพึงพอใจ</span>
          </button>
        </div>
      </form>
    </div>
  </div>
);
};

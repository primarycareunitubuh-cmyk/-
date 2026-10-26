import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Calendar, 
  Truck, 
  Stethoscope, 
  Building, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Search, 
  Sparkles,
  ShieldCheck,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { Campaign } from '../types';

interface CampaignSelectorLandingProps {
  campaigns: Campaign[];
  onSelectCampaign: (campaignId: string) => void;
  onRequestStaffLogin: () => void;
  isStaff: boolean;
  onGoToAdmin: () => void;
}

export const CampaignSelectorLanding: React.FC<CampaignSelectorLandingProps> = ({
  campaigns,
  onSelectCampaign,
  onRequestStaffLogin,
  isStaff,
  onGoToAdmin,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCampaigns = campaigns.filter(camp => {
    const matchesSearch = 
      camp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      camp.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      camp.targetUnit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (camp.description && camp.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  // Helper icon for campaign type
  const getCampaignIcon = (camp: Campaign) => {
    if (camp.code.includes('MOBILE') || camp.title.includes('เคลื่อนที่')) {
      return <Truck className="w-6 h-6 text-emerald-600" />;
    }
    if (camp.code.includes('PRE') || camp.title.includes('เข้าทำงาน') || camp.title.includes('ใบรับรองแพทย์')) {
      return <Stethoscope className="w-6 h-6 text-blue-600" />;
    }
    return <Calendar className="w-6 h-6 text-teal-600" />;
  };

  const getCampaignTheme = (camp: Campaign) => {
    if (camp.code.includes('MOBILE') || camp.title.includes('เคลื่อนที่')) {
      return {
        badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
        iconBg: 'bg-gradient-to-br from-emerald-100 to-teal-100 border-emerald-300 text-emerald-700',
        btnBg: 'bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 hover:from-emerald-800 hover:to-teal-800 focus:ring-emerald-500 shadow-emerald-700/25',
        hoverBorder: 'hover:border-emerald-400 group-hover:text-emerald-800',
        glowBg: 'from-emerald-500/5 to-transparent',
      };
    }
    if (camp.code.includes('PRE') || camp.title.includes('เข้าทำงาน') || camp.title.includes('ใบรับรองแพทย์')) {
      return {
        badgeBg: 'bg-amber-50 text-amber-900 border-amber-300/80',
        iconBg: 'bg-gradient-to-br from-amber-100 to-emerald-100 border-amber-300/80 text-amber-800',
        btnBg: 'bg-gradient-to-r from-slate-900 via-emerald-900 to-teal-900 hover:from-slate-800 hover:to-emerald-800 focus:ring-teal-500 shadow-slate-900/20',
        hoverBorder: 'hover:border-amber-400 group-hover:text-emerald-800',
        glowBg: 'from-amber-500/5 to-transparent',
      };
    }
    return {
      badgeBg: 'bg-teal-50 text-teal-800 border-teal-300',
      iconBg: 'bg-gradient-to-br from-teal-100 to-emerald-100 border-teal-300 text-teal-700',
      btnBg: 'bg-gradient-to-r from-teal-700 via-emerald-700 to-teal-800 hover:from-teal-800 hover:to-emerald-800 focus:ring-teal-500 shadow-teal-700/25',
      hoverBorder: 'hover:border-teal-400 group-hover:text-teal-800',
      glowBg: 'from-teal-500/5 to-transparent',
    };
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col justify-center items-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        
        {/* Header Hero Section (Centered & Luxurious) */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          {/* Official Department Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-50 via-emerald-50 to-teal-50 border border-amber-300/80 text-emerald-950 text-xs sm:text-sm font-semibold shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse ring-2 ring-amber-200"></span>
            <Building className="w-4 h-4 text-emerald-700" />
            <span>งานอาชีวเวชกรรม กลุ่มงานบริการปฐมภูมิ</span>
          </div>

          {/* System Name */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-['Prompt']">
              ระบบประเมินความพึงพอใจ
            </h1>
            <p className="text-base sm:text-lg font-semibold text-emerald-800 font-['Prompt'] flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>กรุณาเลือกกิจกรรมตรวจสุขภาพเพื่อเริ่มการประเมิน</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
            ขอเชิญผู้รับบริการร่วมประเมินความพึงพอใจ เพื่อนำข้อคิดเห็นและข้อเสนอแนะไปพัฒนาคุณภาพการบริการตรวจสุขภาพและการดูแลด้านอาชีวอนามัยให้มีมาตรฐานสูงสุด
          </p>

          {/* Quick Search if campaigns >= 3 */}
          {campaigns.length > 2 && (
            <div className="relative max-w-md mx-auto pt-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none mt-1" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหาชื่อกิจกรรมหรือรหัสโครงการ..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-xs"
              />
            </div>
          )}
        </div>

        {/* Campaign Cards List (Centered Grid with Luxurious Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCampaigns.map((camp) => {
            const theme = getCampaignTheme(camp);
            const questionCount = camp.questions?.length || 0;
            const isActive = camp.status === 'active';

            return (
              <div
                key={camp.id}
                onClick={() => onSelectCampaign(camp.id)}
                className={`group relative bg-gradient-to-b from-white via-white to-emerald-50/20 rounded-3xl p-6 sm:p-7 border-2 border-slate-200/80 shadow-xs hover:shadow-xl hover:border-emerald-300/90 transition-all duration-300 cursor-pointer flex flex-col justify-between ${theme.hoverBorder} hover:-translate-y-1.5`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${theme.iconBg} shadow-xs`}>
                        {getCampaignIcon(camp)}
                      </div>
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shadow-2xs ${theme.badgeBg}`}>
                        {camp.code}
                      </span>
                    </div>

                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-2xs ${
                      isActive 
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300/80' 
                        : 'bg-amber-50 text-amber-800 border border-amber-300/80'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500 ring-2 ring-emerald-200' : 'bg-amber-500 ring-2 ring-amber-200'}`}></span>
                      {isActive ? 'เปิดให้ประเมิน' : 'พักชั่วคราว'}
                    </span>
                  </div>

                  {/* Campaign Title */}
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 font-['Prompt'] group-hover:text-emerald-900 transition-colors line-clamp-2 mb-2">
                    {camp.title}
                  </h3>

                  {/* Target Unit */}
                  <div className="flex items-center gap-1.5 text-xs text-emerald-800/80 font-medium mb-3">
                    <Building className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{camp.targetUnit}</span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {camp.description || 'แบบประเมินความพึงพอใจการให้บริการตรวจสุขภาพ ครอบคลุมขั้นตอนและความสะดวก'}
                  </p>
                </div>

                {/* Footer Info & Action Button */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-medium text-emerald-900/80">
                      <ClipboardCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{questionCount} ข้อคำถาม</span>
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>~1-2 นาที</span>
                    </span>
                  </div>

                  <button
                    type="button"
                    className={`w-full py-3 px-4 rounded-xl text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition shadow-md group-hover:shadow-lg ${theme.btnBg}`}
                  >
                    <span>เข้าทำแบบประเมิน</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredCampaigns.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
            <ClipboardCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">ไม่พบกิจกรรมที่ค้นหา</h3>
            <p className="text-xs text-slate-500 mt-1">กรุณาลองพิมพ์ค้นหาด้วยคำอื่น หรือกดล้างการค้นหา</p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition border border-emerald-200"
            >
              แสดงกิจกรรมทั้งหมด
            </button>
          </div>
        )}

        {/* Bottom Staff Portal Link */}
        <div className="pt-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/90 border border-slate-200/90 shadow-2xs text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>สำหรับเจ้าหน้าที่โรงพยาบาล:</span>
            {isStaff ? (
              <button
                onClick={onGoToAdmin}
                className="font-semibold text-emerald-800 hover:text-emerald-900 underline inline-flex items-center gap-1"
              >
                <span>เข้าสู่แดชบอร์ดเจ้าหน้าที่</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onRequestStaffLogin}
                className="font-semibold text-emerald-800 hover:text-emerald-900 underline inline-flex items-center gap-1"
              >
                <span>เข้าสู่ระบบเจ้าหน้าที่ (VOC Staff)</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

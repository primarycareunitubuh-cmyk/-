import React from 'react';
import { 
  ClipboardCheck, 
  ShieldCheck, 
  Tablet, 
  Sparkles, 
  LogOut,
  Hospital,
  ChevronLeft,
  UserCheck,
  LayoutGrid
} from 'lucide-react';
import { Campaign } from '../types';
import { getCampaignTheme } from '../utils/campaignHelper';

export type AppView = 'landing' | 'survey' | 'admin' | 'kiosk';

interface HeaderProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  activeCampaign: Campaign | null;
  allCampaigns: Campaign[];
  onSelectCampaign: (campaignId: string) => void;
  isStaff: boolean;
  onStaffLogout: () => void;
  onRequestStaffLogin: () => void;
  onBackToLanding: () => void;
  isRealtimeActive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  activeCampaign,
  allCampaigns,
  onSelectCampaign,
  isStaff,
  onStaffLogout,
  onRequestStaffLogin,
  onBackToLanding,
  isRealtimeActive = true,
}) => {
  const isPatientMode = currentView === 'landing' || currentView === 'survey';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)]">
      {/* Luxurious Top Signature Stripe matching active activity */}
      <div 
        className={`h-[3.5px] w-full transition-colors duration-500 ${
          currentView === 'survey' && activeCampaign 
            ? getCampaignTheme(activeCampaign).cardTopStripe 
            : 'bg-gradient-to-r from-emerald-700 via-amber-400 to-teal-700'
        }`} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          
          {/* Brand Logo & Title: ระบบประเมินความพึงพอใจ งานอาชีวเวชกรรม กลุ่มงานบริการปฐมภูมิ */}
          <div 
            className="flex items-center gap-3 sm:gap-3.5 cursor-pointer select-none group" 
            onClick={onBackToLanding}
            title="กลับสู่หน้าแรกเลือกกิจกรรม"
          >
            <div className="relative">
              <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-gradient-to-br from-emerald-800 via-teal-700 to-emerald-950 flex items-center justify-center text-amber-300 shadow-md shadow-emerald-950/20 ring-2 ring-amber-400/40 group-hover:ring-amber-400/70 transition-all duration-300">
                <ClipboardCheck className="w-6 h-6 sm:w-7 sm:h-7 text-amber-300" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400 border border-white"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-xl font-bold tracking-tight text-slate-900 font-['Prompt'] group-hover:text-emerald-900 transition-colors">
                  ระบบประเมินความพึงพอใจ
                </span>
                <span className="hidden lg:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gradient-to-r from-amber-50 to-emerald-50 text-emerald-900 border border-amber-300/60 shadow-2xs">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  มาตรฐานบริการ
                </span>
              </div>
              <p className="text-xs sm:text-[13px] font-semibold text-emerald-800/90 flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                <span>งานอาชีวเวชกรรม กลุ่มงานบริการปฐมภูมิ</span>
              </p>
            </div>
          </div>

          {/* Center Mode Indicator (Eliminates confusion between patient and staff views) */}
          <div className="flex items-center gap-2">
            {isPatientMode ? (
              <div className="flex items-center gap-2">
                {/* Patient Mode Badge: Luxurious Emerald & Amber */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-300/80 text-emerald-900 text-xs sm:text-sm font-semibold shadow-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse ring-2 ring-emerald-300"></span>
                  <UserCheck className="w-4 h-4 text-emerald-700" />
                  <span>โหมดผู้รับบริการ</span>
                </div>

                {/* If in survey view, show current activity badge + switch button */}
                {currentView === 'survey' && activeCampaign && (
                  <>
                    {(() => {
                      const activeTheme = getCampaignTheme(activeCampaign);
                      return (
                        <div className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${activeTheme.chipClass}`}>
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeTheme.hex }} />
                          <span className="max-w-[140px] truncate">{activeCampaign.code}</span>
                        </div>
                      );
                    })()}
                    <button
                      onClick={onBackToLanding}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200/80 hover:border-emerald-200 transition shadow-2xs"
                      title="กลับไปเลือกกิจกรรมตรวจสุขภาพอื่น"
                    >
                      <LayoutGrid className="w-3.5 h-3.5 text-slate-500" />
                      <span className="hidden sm:inline">เปลี่ยนกิจกรรม</span>
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white border border-amber-400/40 text-xs sm:text-sm font-bold shadow-md shadow-slate-950/20">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>โหมดเจ้าหน้าที่และผู้ดูแลระบบ</span>
              </div>
            )}

            {/* Cloud Real-Time Indicator */}
            {isRealtimeActive && (
              <div 
                className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300/70 shadow-2xs"
                title="ระบบเชื่อมต่อฐานข้อมูลคลาวด์เรียลไทม์ ซิงค์ข้อมูลข้ามทุกอุปกรณ์อัตโนมัติ"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>ซิงค์เรียลไทม์ (Live Sync)</span>
              </div>
            )}
          </div>

          {/* Navigation Controls: Staff & Kiosk */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* If in admin view, button to preview / return to patient mode */}
            {currentView === 'admin' && (
              <button
                onClick={onBackToLanding}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition shadow-2xs"
              >
                <UserCheck className="w-4 h-4 text-emerald-700" />
                <span className="hidden sm:inline">ดูหน้าผู้รับบริการ</span>
                <span className="sm:hidden">ผู้รับบริการ</span>
              </button>
            )}

            {/* Kiosk Mode Button */}
            <button
              onClick={() => onNavigate('kiosk')}
              title="เปิดโหมดตั้งโต๊ะสำหรับตู้หรือแท็บเล็ตรอคอย"
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                currentView === 'kiosk'
                  ? 'bg-slate-900 text-white shadow-sm ring-1 ring-amber-400/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
              }`}
            >
              <Tablet className="w-4 h-4" />
              <span>โหมดคีออสก์</span>
            </button>

            {/* Staff / Admin Access Button (Dedicated and luxurious) */}
            {isStaff ? (
              <div className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 rounded-xl p-1 shadow-2xs">
                <button
                  onClick={() => onNavigate('admin')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                    currentView === 'admin'
                      ? 'bg-gradient-to-r from-emerald-700 to-teal-700 text-white shadow-xs'
                      : 'text-emerald-900 hover:bg-emerald-100/70'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                  <span>ระบบเจ้าหน้าที่</span>
                </button>
                <button
                  onClick={onStaffLogout}
                  title="ออกจากระบบเจ้าหน้าที่"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onRequestStaffLogin}
                className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 hover:from-slate-900 hover:to-emerald-900 text-white border border-amber-400/30 shadow-md shadow-slate-950/20 transition active:scale-98"
                title="เข้าสู่ระบบสำหรับเจ้าหน้าที่และบุคลากรโรงพยาบาล"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>ระบบเจ้าหน้าที่</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};

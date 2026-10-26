import React, { useState } from 'react';
import { 
  QrCode, 
  Copy, 
  Check, 
  ExternalLink, 
  Tablet, 
  Printer, 
  Hospital, 
  RotateCcw,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { Campaign } from '../../types';

interface ShareQrTabProps {
  campaign: Campaign;
  onLaunchKiosk: () => void;
  onResetAllData: () => void;
}

export const ShareQrTab: React.FC<ShareQrTabProps> = ({
  campaign,
  onLaunchKiosk,
  onResetAllData,
}) => {
  const [copied, setCopied] = useState(false);
  const currentUrl = window.location.href.split('?')[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrintPoster = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Overview Card */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-teal-600" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-['Prompt']">
                เผยแพร่แบบประเมิน & ป้าย QR Code จุดบริการ
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              นำลิงก์หรือพิมพ์ป้ายตั้งโต๊ะ เพื่อให้ผู้รับบริการสแกนทำแบบประเมินผ่านมือถือ หรือเปิดบนแท็บเล็ต
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onLaunchKiosk}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-xs transition"
            >
              <Tablet className="w-4 h-4 text-emerald-400" />
              <span>เปิดโหมดตู้คีออสก์ / แท็บเล็ต</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: Printable Standee / QR Poster preview */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center text-center">
          <div className="w-full max-w-sm p-6 rounded-2xl border-2 border-dashed border-teal-300 bg-gradient-to-b from-teal-50/50 to-white shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center mx-auto mb-2 shadow-xs">
              <Hospital className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-['Prompt']">
              สแกนประเมินความพึงพอใจ
            </h3>
            <p className="text-xs font-semibold text-teal-700 mt-0.5">
              บริการตรวจสุขภาพ ({campaign.code})
            </p>
            <p className="text-[11px] text-slate-500 mb-4">
              {campaign.title}
            </p>

            {/* Crisp QR Code Graphic */}
            <div className="w-48 h-48 bg-white p-3 rounded-2xl border border-slate-200 mx-auto shadow-inner flex items-center justify-center">
              <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                {/* QR Finder Corners */}
                <rect x="10" y="10" width="24" height="24" rx="3" fill="#0d9488" />
                <rect x="14" y="14" width="16" height="16" rx="2" fill="white" />
                <rect x="18" y="18" width="8" height="8" rx="1" fill="#0d9488" />

                <rect x="66" y="10" width="24" height="24" rx="3" fill="#0d9488" />
                <rect x="70" y="14" width="16" height="16" rx="2" fill="white" />
                <rect x="74" y="18" width="8" height="8" rx="1" fill="#0d9488" />

                <rect x="10" y="66" width="24" height="24" rx="3" fill="#0d9488" />
                <rect x="14" y="70" width="16" height="16" rx="2" fill="white" />
                <rect x="18" y="74" width="8" height="8" rx="1" fill="#0d9488" />

                {/* QR Data Grid simulated dots */}
                <rect x="40" y="12" width="6" height="6" rx="1" />
                <rect x="52" y="12" width="6" height="6" rx="1" />
                <rect x="44" y="24" width="8" height="6" rx="1" />
                <rect x="40" y="34" width="6" height="6" rx="1" />
                <rect x="52" y="34" width="8" height="6" rx="1" />
                <rect x="12" y="44" width="6" height="8" rx="1" />
                <rect x="24" y="44" width="8" height="6" rx="1" />
                <rect x="66" y="44" width="6" height="6" rx="1" />
                <rect x="78" y="44" width="8" height="8" rx="1" />
                <rect x="40" y="48" width="12" height="12" rx="2" fill="#0f766e" />
                <rect x="56" y="48" width="6" height="6" rx="1" />
                <rect x="40" y="66" width="8" height="8" rx="1" />
                <rect x="52" y="68" width="6" height="6" rx="1" />
                <rect x="68" y="66" width="6" height="8" rx="1" />
                <rect x="80" y="66" width="8" height="6" rx="1" />
                <rect x="68" y="80" width="8" height="8" rx="1" />
                <rect x="82" y="78" width="6" height="8" rx="1" />
                <rect x="44" y="80" width="10" height="6" rx="1" />
              </svg>
            </div>

            <p className="text-[11px] font-semibold text-slate-600 mt-4">
              ใช้กล้องมือถือสแกนเพื่อประเมินได้ทันที
            </p>
            <p className="text-[10px] text-slate-400">
              ใช้เวลาเพียง 1-2 นาที • ไม่ต้องลงชื่อเข้าใช้
            </p>
          </div>

          <button
            onClick={handlePrintPoster}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
          >
            <Printer className="w-4 h-4" />
            <span>พิมพ์ป้ายตั้งโต๊ะจุดตรวจ (Print Sign)</span>
          </button>
        </div>

        {/* Right: Direct Link & Kiosk Deployment Guide */}
        <div className="space-y-4">
          
          {/* Direct URL */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 mb-2">
              ลิงก์ทำแบบประเมินออนไลน์ (Direct Survey Link)
            </h4>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="flex-1 bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600 p-2.5 rounded-xl truncate"
              />
              <button
                onClick={handleCopy}
                className="px-3 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shrink-0"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              สามารถส่งในกลุ่ม LINE องค์กร หรือแนบไปกับลิงก์แจ้งผลตรวจสุขภาพทาง SMS
            </p>
          </div>

          {/* Kiosk Mode Info */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Tablet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  แนะนำการใช้งานโหมดตู้คีออสก์ (Kiosk Mode)
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  สำหรับแท็บเล็ต iPad / Android ที่วางไว้ประจำจุดตรวจ เช่น จุดส่งเอกสาร หรือเคาน์เตอร์จ่ายเงิน มีปุ่ม "ทำแบบประเมินท่านถัดไป" เพื่อรีเซ็ตหน้าจออัตโนมัติอย่างราบรื่น
                </p>
                <button
                  onClick={onLaunchKiosk}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800"
                >
                  <span>เข้าสู่โหมดตู้คีออสก์ทันที &rarr;</span>
                </button>
              </div>
            </div>
          </div>

          {/* System Reset & Data Backup Tool */}
          <div className="bg-white p-5 rounded-2xl border border-rose-100 bg-rose-50/20 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  รีเซ็ตข้อมูลเริ่มต้น (Reset to Default Seed)
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  หากต้องการคืนค่าแบบสอบถามและข้อมูลตัวอย่างเริ่มต้นของระบบ
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('คุณต้องการรีเซ็ตข้อมูลทั้งหมดกลับสู่ค่าเริ่มต้นใช่หรือไม่?')) {
                      onResetAllData();
                    }
                  }}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 underline"
                >
                  <span>ล้างข้อมูลและคืนค่าเริ่มต้น</span>
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { 
  BarChart3, 
  Layers, 
  Sliders, 
  History, 
  QrCode, 
  ShieldCheck, 
  Activity, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { Campaign, SurveySubmission } from '../types';
import { AnalyticsTab } from './admin/AnalyticsTab';
import { CampaignBuilderTab } from './admin/CampaignBuilderTab';
import { CriteriaSettingsTab } from './admin/CriteriaSettingsTab';
import { ResponsesHistoryTab } from './admin/ResponsesHistoryTab';
import { ShareQrTab } from './admin/ShareQrTab';

interface AdminDashboardProps {
  campaigns: Campaign[];
  activeCampaignId: string;
  onSelectCampaign: (id: string) => void;
  onUpdateCampaigns: (campaigns: Campaign[]) => void;
  allResponses: SurveySubmission[];
  onDeleteResponse: (id: string) => void;
  onAddSampleResponses: () => void;
  onLaunchKiosk: () => void;
  onResetAllData: () => void;
}

type AdminSubTab = 'analytics' | 'campaigns' | 'criteria' | 'responses' | 'share';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  campaigns,
  activeCampaignId,
  onSelectCampaign,
  onUpdateCampaigns,
  allResponses,
  onDeleteResponse,
  onAddSampleResponses,
  onLaunchKiosk,
  onResetAllData,
}) => {
  const [activeTab, setActiveTab] = useState<AdminSubTab>('analytics');

  const currentCampaign = campaigns.find(c => c.id === activeCampaignId) || campaigns[0];

  const handleUpdateCurrentCampaign = (updatedCampaign: Campaign) => {
    const updated = campaigns.map(c => (c.id === updatedCampaign.id ? updatedCampaign : c));
    onUpdateCampaigns(updated);
  };

  const navItems = [
    { id: 'analytics', label: 'สรุปผล & กราฟสถิติ', icon: BarChart3 },
    { id: 'campaigns', label: 'จัดการแบบสอบถาม & คำถามเรียลไทม์', icon: Layers },
    { id: 'criteria', label: 'กำหนดเกณฑ์ให้คะแนน', icon: Sliders },
    { id: 'responses', label: 'ประวัติผู้ตอบ & รายงานย้อนหลัง', icon: History },
    { id: 'share', label: 'QR Code & เผยแพร่', icon: QrCode },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      {/* Top Banner / Welcome info (Luxurious Velvet Emerald & Amber) */}
      <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-800/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-amber-400/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-500/20 to-emerald-500/20 text-amber-300 border border-amber-400/30">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                ระบบจัดการเจ้าหน้าที่ (Staff Portal)
              </span>
              <span className="text-xs text-emerald-200/80 font-medium">
                งานอาชีวเวชกรรม กลุ่มงานบริการปฐมภูมิ
              </span>
            </div>
            
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight font-['Prompt'] text-white">
              ระบบประเมินความพึงพอใจ • แดชบอร์ดบริหารคุณภาพ
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              วิเคราะห์ความพึงพอใจ แปลงเป็นคะแนนร้อยละอัตโนมัติทั้งรายข้อและภาพรวม พร้อมสรุปตัวชี้วัดความตั้งใจแนะนำและกลับมาใช้บริการ
            </p>
          </div>

          {/* Quick Active Campaign Switcher Badge */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-amber-400/20 shadow-lg min-w-[260px]">
            <span className="text-[11px] uppercase tracking-wider text-amber-200/90 font-semibold block mb-1">
              กำลังดูข้อมูลกิจกรรม:
            </span>
            <select
              value={currentCampaign.id}
              onChange={(e) => onSelectCampaign(e.target.value)}
              className="w-full bg-slate-900/90 text-white text-xs sm:text-sm font-semibold rounded-xl px-3 py-2 border border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              {campaigns.map((camp) => (
                <option key={camp.id} value={camp.id}>
                  {camp.title} ({camp.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tab Navigation Pill Bar */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs flex items-center overflow-x-auto gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as AdminSubTab)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div>
        {activeTab === 'analytics' && (
          <AnalyticsTab
            campaign={currentCampaign}
            allResponses={allResponses}
          />
        )}

        {activeTab === 'campaigns' && (
          <CampaignBuilderTab
            campaigns={campaigns}
            activeCampaignId={currentCampaign.id}
            onSelectCampaign={onSelectCampaign}
            onUpdateCampaigns={onUpdateCampaigns}
          />
        )}

        {activeTab === 'criteria' && (
          <CriteriaSettingsTab
            campaign={currentCampaign}
            onUpdateCampaign={handleUpdateCurrentCampaign}
          />
        )}

        {activeTab === 'responses' && (
          <ResponsesHistoryTab
            campaign={currentCampaign}
            allResponses={allResponses}
            onDeleteResponse={onDeleteResponse}
            onAddSampleResponses={onAddSampleResponses}
          />
        )}

        {activeTab === 'share' && (
          <ShareQrTab
            campaign={currentCampaign}
            onLaunchKiosk={onLaunchKiosk}
            onResetAllData={onResetAllData}
          />
        )}
      </div>

    </div>
  );
};

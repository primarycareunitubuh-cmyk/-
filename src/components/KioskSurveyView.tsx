import React, { useState, useEffect } from 'react';
import { Tablet, X, RefreshCw, Hospital, CheckCircle2, Heart } from 'lucide-react';
import { Campaign, SurveySubmission } from '../types';
import { ClientSurveyView } from './ClientSurveyView';

interface KioskSurveyViewProps {
  campaign: Campaign;
  onSubmitSurvey: (submission: SurveySubmission) => void;
  onExitKiosk: () => void;
}

export const KioskSurveyView: React.FC<KioskSurveyViewProps> = ({
  campaign,
  onSubmitSurvey,
  onExitKiosk,
}) => {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Kiosk Bar */}
      <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Tablet className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold">โหมดตู้คีออสก์ / แท็บเล็ตตั้งโต๊ะจุดบริการ</span>
          <span className="text-slate-400 hidden sm:inline">• {campaign.title}</span>
        </div>
        
        <button
          onClick={onExitKiosk}
          className="flex items-center gap-1 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-lg transition"
        >
          <X className="w-3.5 h-3.5" />
          <span>ออกจากโหมดคีออสก์</span>
        </button>
      </div>

      {/* Survey Content */}
      <div className="flex-1 overflow-y-auto">
        <ClientSurveyView
          campaign={campaign}
          onSubmitSurvey={onSubmitSurvey}
          isKioskMode={true}
        />
      </div>
    </div>
  );
};

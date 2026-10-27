import React from 'react';
import { Printer, X, Hospital, Award, CheckCircle2, Calendar, FileText } from 'lucide-react';
import { Campaign, SurveySubmission } from '../../types';
import { calculateCampaignStats } from '../../utils/scoring';
import { STATION_INFO } from '../../data/initialData';

interface PrintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign;
  allResponses: SurveySubmission[];
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({
  isOpen,
  onClose,
  campaign,
  allResponses,
}) => {
  if (!isOpen) return null;

  const stats = calculateCampaignStats(campaign, allResponses);

  const handlePrint = () => {
    window.print();
  };

  const currentDateThai = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Modal Action Bar (not printed) */}
        <div className="p-4 bg-slate-800 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-400" />
            <span className="font-semibold text-sm">แบบรายงานสรุปผลการประเมินความพึงพอใจทางการแพทย์</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-xs transition"
            >
              <Printer className="w-4 h-4" />
              <span>พิมพ์รายงาน (Print / Save as PDF)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div className="p-8 sm:p-12 overflow-y-auto print:p-0 print:overflow-visible text-slate-800 font-['Sarabun','Prompt',sans-serif]">
          
          {/* Official Document Header */}
          <div className="border-b-2 border-slate-800 pb-4 mb-6 text-center">
            <div className="flex justify-center items-center gap-2 mb-2">
              <Hospital className="w-8 h-8 text-teal-700" />
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                รายงานผลการประเมินความพึงพอใจการบริการตรวจสุขภาพ
              </h1>
            </div>
            <h2 className="text-base font-semibold text-slate-700">
              {campaign.title} ({campaign.code})
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              หน่วยงานรับผิดชอบ: {campaign.targetUnit} • วันที่พิมพ์รายงาน: {currentDateThai}
            </p>
          </div>

          {/* Executive Summary Metrics Box */}
          <div className="grid grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 mb-6 text-center">
            <div>
              <span className="text-xs text-slate-500">จำนวนผู้ตอบแบบสอบถาม</span>
              <p className="text-xl font-bold text-slate-900 mt-0.5">{stats.totalRespondents} ท่าน</p>
            </div>
            <div>
              <span className="text-xs text-slate-500">ความพึงพอใจภาพรวม</span>
              <p className="text-xl font-extrabold text-teal-700 mt-0.5">{stats.overallScorePercent.toFixed(1)}%</p>
            </div>
            <div>
              <span className="text-xs text-slate-500">เกณฑ์การแปลผล</span>
              <p className="text-sm font-bold text-emerald-800 mt-1">{stats.ratingCriterion?.label || '-'}</p>
            </div>
            <div>
              <span className="text-xs text-slate-500">เป้าหมายคุณภาพ</span>
              <p className="text-sm font-bold mt-1 text-slate-800">
                {stats.isGoalMet ? '✓ บรรลุเป้าหมาย' : '✗ ยังไม่บรรลุ'} ({campaign.targetGoalPercent}%)
              </p>
            </div>
          </div>

          {/* Station / Section Breakdown Table */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-900 mb-2 border-l-4 border-teal-600 pl-2">
              1. สรุปผลคะแนนจำแนกตามด้านการประเมินความพึงพอใจ
            </h3>
            <table className="w-full text-xs text-left border border-slate-200">
              <thead className="bg-slate-100 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2 px-3">ด้านการประเมินความพึงพอใจ</th>
                  <th className="py-2 px-3 text-center">จำนวนข้อ</th>
                  <th className="py-2 px-3 text-center">คะแนนเฉลี่ย (เต็ม 5)</th>
                  <th className="py-2 px-3 text-right">คะแนนร้อยละ (%)</th>
                  <th className="py-2 px-3 text-center">การบรรลุเป้าหมาย ({campaign.targetGoalPercent}%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {stats.stationStats.map((st) => (
                  <tr key={st.station}>
                    <td className="py-2 px-3 font-medium">{st.stationName}</td>
                    <td className="py-2 px-3 text-center">{st.questionCount}</td>
                    <td className="py-2 px-3 text-center">{st.avgScore.toFixed(2)}</td>
                    <td className="py-2 px-3 text-right font-bold">{st.percentageScore.toFixed(1)}%</td>
                    <td className="py-2 px-3 text-center font-medium">
                      {st.percentageScore >= campaign.targetGoalPercent ? (
                        <span className="text-emerald-700">ผ่านเกณฑ์</span>
                      ) : (
                        <span className="text-rose-600">ต้องปรับปรุง</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Question Level Table */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-900 mb-2 border-l-4 border-teal-600 pl-2">
              2. ผลการประเมินรายข้อคำถาม (Question Breakdown)
            </h3>
            <table className="w-full text-xs text-left border border-slate-200">
              <thead className="bg-slate-100 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2 px-2 text-center w-8">ข้อ</th>
                  <th className="py-2 px-3">หัวข้อคำถาม</th>
                  <th className="py-2 px-3">ด้านการประเมิน</th>
                  <th className="py-2 px-2 text-center">ผู้ตอบ</th>
                  <th className="py-2 px-2 text-center">คะแนนเฉลี่ย</th>
                  <th className="py-2 px-3 text-right">คะแนนร้อยละ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {stats.questionStats.map((q, idx) => (
                  <tr key={q.question.id}>
                    <td className="py-2 px-2 text-center font-bold text-slate-500">{idx + 1}</td>
                    <td className="py-2 px-3 font-medium">{q.question.text}</td>
                    <td className="py-2 px-3 text-slate-600">
                      {q.question.customCategoryName || STATION_INFO[q.question.category]?.nameTh || q.question.category}
                    </td>
                    <td className="py-2 px-2 text-center">{q.responseCount}</td>
                    <td className="py-2 px-2 text-center">
                      {q.question.type !== 'text' ? q.avgScore.toFixed(2) : '-'}
                    </td>
                    <td className="py-2 px-3 text-right font-bold">
                      {q.question.type !== 'text' ? `${q.percentageScore.toFixed(1)}%` : 'ข้อเสนอแนะ'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Voice of Customer / Top Feedback */}
          {stats.recentComments.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-bold text-slate-900 mb-2 border-l-4 border-teal-600 pl-2">
                3. ข้อเสนอแนะและความคิดเห็นสำคัญจากผู้รับบริการ
              </h3>
              <div className="space-y-1.5 text-xs text-slate-700">
                {stats.recentComments.slice(0, 5).map((c, i) => (
                  <div key={c.id} className="p-2 bg-slate-50 rounded border border-slate-200">
                    <span className="font-semibold text-slate-900">#{i + 1}: </span>
                    "{c.comment}"
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Signature Signoff */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs">
            <div>
              <p className="mb-10 text-slate-500">ผู้จัดทำและวิเคราะห์รายงาน</p>
              <p className="font-semibold">...................................................................</p>
              <p className="text-slate-600 mt-1">( เจ้าหน้าที่วิเคราะห์คุณภาพบริการ )</p>
            </div>
            <div>
              <p className="mb-10 text-slate-500">ผู้รับรองรายงานการประเมิน</p>
              <p className="font-semibold">...................................................................</p>
              <p className="text-slate-600 mt-1">( หัวหน้ากลุ่มงานตรวจสุขภาพ )</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

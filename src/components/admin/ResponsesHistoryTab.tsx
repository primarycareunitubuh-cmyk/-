import React, { useState } from 'react';
import { 
  History, 
  Download, 
  Printer, 
  Search, 
  Trash2, 
  Eye, 
  Sparkles, 
  Filter, 
  Calendar, 
  User, 
  CheckCircle2,
  FileSpreadsheet,
  X,
  PlusCircle
} from 'lucide-react';
import { Campaign, SurveySubmission } from '../../types';
import { getCriterionForPercent } from '../../utils/scoring';
import { STATION_INFO } from '../../data/initialData';
import { PrintReportModal } from './PrintReportModal';

interface ResponsesHistoryTabProps {
  campaign: Campaign;
  allResponses: SurveySubmission[];
  onDeleteResponse: (responseId: string) => void;
  onAddSampleResponses: () => void;
}

export const ResponsesHistoryTab: React.FC<ResponsesHistoryTabProps> = ({
  campaign,
  allResponses,
  onDeleteResponse,
  onAddSampleResponses,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [scoreFilter, setScoreFilter] = useState<'all' | 'high' | 'mid' | 'low'>('all');
  const [selectedResponse, setSelectedResponse] = useState<SurveySubmission | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Filter responses belonging to this campaign
  const campaignResponses = allResponses.filter(r => r.campaignId === campaign.id);

  // Apply search & score filters
  const filteredResponses = campaignResponses.filter(r => {
    // Score filter
    if (scoreFilter === 'high' && r.overallScorePercent < 85) return false;
    if (scoreFilter === 'mid' && (r.overallScorePercent < 70 || r.overallScorePercent >= 85)) return false;
    if (scoreFilter === 'low' && r.overallScorePercent >= 70) return false;

    // Search term
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const commentMatch = (r.comment || '').toLowerCase().includes(term);
    const genderMatch = (r.demographics?.gender || '').toLowerCase().includes(term);
    const ageMatch = (r.demographics?.ageRange || '').toLowerCase().includes(term);
    const occMatch = (r.demographics?.occupation || '').toLowerCase().includes(term);
    const covMatch = (r.demographics?.coverage || '').toLowerCase().includes(term);
    const histMatch = (r.demographics?.visitHistory || '').toLowerCase().includes(term);
    
    // check answers values
    const answerMatch = Object.values(r.answers).some(val => 
      String(val).toLowerCase().includes(term)
    );

    return commentMatch || genderMatch || ageMatch || occMatch || covMatch || histMatch || answerMatch;
  });

  // Export CSV
  const handleExportCSV = () => {
    if (campaignResponses.length === 0) {
      alert('ไม่มีข้อมูลการประเมินเพื่อส่งออก');
      return;
    }

    // Prepare headers
    const scoredQuestions = campaign.questions;
    const headers = [
      'รหัสแบบประเมิน',
      'วันที่และเวลา',
      'เพศ',
      'ช่วงอายุ',
      'อาชีพ',
      'สิทธิการรักษา',
      'ประวัติการรับบริการ',
      'ประเภทบริการ',
      'คะแนนภาพรวมร้อยละ (%)',
      ...scoredQuestions.map(q => `[${STATION_INFO[q.category]?.nameTh || q.category}] ${q.text.replace(/,/g, ' ')}`),
      'ข้อเสนอแนะเพิ่มเติม',
    ];

    const rows = campaignResponses.map(r => {
      const answersCols = scoredQuestions.map(q => {
        const val = r.answers[q.id];
        let displayVal = val !== undefined ? String(val) : '';
        if (q.type === 'recommend_intent') {
          displayVal = val === 5 ? 'ตั้งใจแนะนำ (5)' : val === 1 ? 'ไม่ตั้งใจแนะนำ (1)' : String(val ?? '');
        } else if (q.type === 'return_intent') {
          displayVal = val === 5 ? 'ตั้งใจกลับมาใช้บริการ (5)' : val === 1 ? 'ไม่ตั้งใจกลับมาใช้บริการ (1)' : String(val ?? '');
        }
        return `"${displayVal.replace(/"/g, '""')}"`;
      });

      return [
        `"${r.id}"`,
        `"${new Date(r.submittedAt).toLocaleString('th-TH')}"`,
        `"${r.demographics?.gender || '-'}"`,
        `"${r.demographics?.ageRange || '-'}"`,
        `"${r.demographics?.occupation || '-'}"`,
        `"${r.demographics?.coverage || '-'}"`,
        `"${r.demographics?.visitHistory || '-'}"`,
        `"${r.demographics?.serviceType || '-'}"`,
        r.overallScorePercent.toFixed(1),
        ...answersCols,
        `"${(r.comment || '').replace(/"/g, '""')}"`,
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VOC_Checkup_${campaign.code}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Toolbar */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-teal-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 font-['Prompt']">
              เรียกดูรายงานสถิติย้อนหลังและข้อมูลการประเมิน
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            กิจกรรม: <strong className="text-slate-800">{campaign.title}</strong>
            {' '}• พบประวัติทั้งหมด {campaignResponses.length} รายการ
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Add Sample responses button */}
          <button
            onClick={onAddSampleResponses}
            title="เพิ่มข้อมูลทดสอบเพื่อจำลองกราฟสถิติ"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>+ จำลองข้อมูล 5 รายการ</span>
          </button>

          {/* Print Formal Report Button */}
          <button
            onClick={() => setShowPrintModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-xs transition"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>พิมพ์รายงานสรุป A4</span>
          </button>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>ส่งออก CSV (Excel)</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาข้อเสนอแนะ, กลุ่มอายุ, คำสำคัญ..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">ระดับคะแนน:</span>
          <select
            value={scoreFilter}
            onChange={(e) => setScoreFilter(e.target.value as any)}
            className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 text-slate-700 focus:ring-1 focus:ring-teal-500"
          >
            <option value="all">ทั้งหมด ({campaignResponses.length})</option>
            <option value="high">คะแนนสูง (&gt;= 85%)</option>
            <option value="mid">คะแนนปานกลาง (70-84%)</option>
            <option value="low">คะแนนควรปรับปรุง (&lt; 70%)</option>
          </select>
        </div>
      </div>

      {/* Table of Submissions */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredResponses.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="font-semibold text-sm">ไม่พบรายการประเมินตามเงื่อนไขที่เลือก</p>
            <p className="text-xs text-slate-400 mt-1">
              ลองเปลี่ยนคำค้นหา หรือกดปุ่ม "จำลองข้อมูล" เพื่อทดสอบระบบ
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3.5">วันที่และเวลา</th>
                  <th className="py-3 px-3">ข้อมูลผู้รับบริการ</th>
                  <th className="py-3 px-3 text-center">คะแนนร้อยละ (%)</th>
                  <th className="py-3 px-3 text-center">การแปลผล</th>
                  <th className="py-3 px-4">ข้อเสนอแนะ (Feedback)</th>
                  <th className="py-3 px-3 text-center w-24">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredResponses.map((item) => {
                  const criterion = getCriterionForPercent(item.overallScorePercent, campaign.criteria);
                  const isHigh = item.overallScorePercent >= campaign.targetGoalPercent;

                  // Find feedback text
                  let commentText = item.comment || '';
                  if (!commentText) {
                    campaign.questions.forEach(q => {
                      if (q.type === 'text' && item.answers[q.id]) {
                        commentText = String(item.answers[q.id]);
                      }
                    });
                  }

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-3.5 whitespace-nowrap text-slate-600">
                        {new Date(item.submittedAt).toLocaleDateString('th-TH', {
                          day: 'numeric',
                          month: 'short',
                          year: '2-digit',
                        })}{' '}
                        <span className="text-[11px] text-slate-400">
                          {new Date(item.submittedAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
                        </span>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="text-slate-800 font-medium">
                          {item.demographics?.gender || 'ไม่ระบุเพศ'} • {item.demographics?.ageRange || '-'}
                        </div>
                        <div className="text-[11px] text-teal-700 font-semibold">
                          {item.demographics?.occupation || '-'}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          สิทธิ: {item.demographics?.coverage || '-'} • {item.demographics?.visitHistory || '-'}
                        </div>
                      </td>

                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className={`text-base font-bold ${isHigh ? 'text-teal-700' : 'text-amber-600'}`}>
                          {item.overallScorePercent.toFixed(1)}%
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${criterion?.badgeClass || 'bg-slate-100 text-slate-700'}`}>
                          {criterion?.label || '-'}
                        </span>
                      </td>

                      <td className="py-3 px-4 max-w-xs truncate text-slate-600">
                        {commentText ? (
                          <span title={commentText}>"{commentText}"</span>
                        ) : (
                          <span className="text-slate-300 italic">- ไม่มีข้อความ -</span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => setSelectedResponse(item)}
                            className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition"
                            title="ดูคำตอบทุกข้อ"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm('ต้องการลบประวัติการประเมินนี้หรือไม่?')) {
                                onDeleteResponse(item.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="ลบรายการนี้"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAIL DRAWER / MODAL: Inspect Response */}
      {selectedResponse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-['Prompt']">
                  รายละเอียดผลการประเมินรายบุคคล
                </h3>
                <p className="text-xs text-slate-500">
                  รหัส: {selectedResponse.id} • บันทึกเมื่อ {new Date(selectedResponse.submittedAt).toLocaleString('th-TH')}
                </p>
              </div>
              <button
                onClick={() => setSelectedResponse(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              
              {/* Demographics Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">เพศ:</span>
                  <strong className="text-slate-800">{selectedResponse.demographics?.gender || '-'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">ช่วงอายุ:</span>
                  <strong className="text-slate-800">{selectedResponse.demographics?.ageRange || '-'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">อาชีพ:</span>
                  <strong className="text-slate-800">{selectedResponse.demographics?.occupation || '-'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">สิทธิการรักษา:</span>
                  <strong className="text-slate-800">{selectedResponse.demographics?.coverage || '-'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">ประวัติการรับบริการ:</span>
                  <strong className="text-slate-800">{selectedResponse.demographics?.visitHistory || '-'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">คะแนนภาพรวม:</span>
                  <strong className="text-teal-700 text-sm font-bold">{selectedResponse.overallScorePercent.toFixed(1)}%</strong>
                </div>
              </div>

              {/* Answers Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  คำตอบจำแนกรายข้อ
                </h4>
                {campaign.questions.map((q, idx) => {
                  const val = selectedResponse.answers[q.id];
                  const stInfo = STATION_INFO[q.category];

                  return (
                    <div
                      key={q.id}
                      className="p-3 rounded-xl bg-white border border-slate-200 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1">
                          <span>ข้อ {idx + 1}</span>
                          <span>•</span>
                          <span>{stInfo?.nameTh || q.category}</span>
                        </div>
                        <p className="font-semibold text-slate-800">{q.text}</p>
                      </div>

                      <div className="text-right shrink-0">
                        {q.type !== 'text' ? (
                          val !== undefined ? (
                            <span className="inline-block px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 font-bold">
                              {q.type === 'recommend_intent'
                                ? (val === 5 ? '👍 ตั้งใจแนะนำ (5/5)' : '👎 ไม่ตั้งใจแนะนำ (1/5)')
                                : q.type === 'return_intent'
                                ? (val === 5 ? '🔄 ตั้งใจกลับมาใช้บริการ (5/5)' : '❌ ไม่ตั้งใจกลับมาใช้บริการ (1/5)')
                                : `${val} / 5 คะแนน`}
                            </span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )
                        ) : (
                          <span className="italic text-slate-600 max-w-[200px] block text-left">
                            "{val || 'ไม่มีข้อเสนอแนะ'}"
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedResponse(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs sm:text-sm"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Report Modal */}
      <PrintReportModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        campaign={campaign}
        allResponses={allResponses}
      />

    </div>
  );
};

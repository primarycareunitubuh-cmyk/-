import React, { useState } from 'react';
import { 
  Award, 
  Sliders, 
  Plus, 
  Trash2, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles,
  Info,
  ShieldCheck,
  Target
} from 'lucide-react';
import { Campaign, ScoringCriterion } from '../../types';
import { DEFAULT_CRITERIA } from '../../data/initialData';

interface CriteriaSettingsTabProps {
  campaign: Campaign;
  onUpdateCampaign: (updatedCampaign: Campaign) => void;
}

const CRITERIA_TEMPLATES: { name: string; description: string; goal: number; criteria: ScoringCriterion[] }[] = [
  {
    name: 'เกณฑ์มาตรฐานคุณภาพโรงพยาบาล (HA 5 ระดับ)',
    description: 'แบ่ง 5 ระดับ: ดีเยี่ยม (>=90%), ดีมาก (>=80%), ดี (>=70%), พอใช้ (>=60%), ต้องปรับปรุง (<60%)',
    goal: 85,
    criteria: DEFAULT_CRITERIA,
  },
  {
    name: 'เกณฑ์ตัวชี้วัดกระทรวงสาธารณสุข / สปสช. (80% ผ่านเกณฑ์)',
    description: 'เน้นเกณฑ์ผ่านตัวชี้วัดความพึงพอใจ 80% ขึ้นไป',
    goal: 80,
    criteria: [
      {
        id: 'crit_pass_high',
        minScorePercent: 85,
        maxScorePercent: 100,
        label: 'ดีเด่นเกินเกณฑ์ตัวชี้วัด',
        color: '#059669',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        description: 'คะแนนสูงกว่า 85% เกินเป้าหมายตัวชี้วัดประจำปี',
      },
      {
        id: 'crit_pass_std',
        minScorePercent: 80,
        maxScorePercent: 84.99,
        label: 'ผ่านเกณฑ์มาตรฐานตัวชี้วัด',
        color: '#0d9488',
        badgeClass: 'bg-teal-100 text-teal-800 border-teal-300',
        description: 'บรรลุเกณฑ์เป้าหมายขั้นต่ำของกระทรวงสาธารณสุข',
      },
      {
        id: 'crit_warn',
        minScorePercent: 70,
        maxScorePercent: 79.99,
        label: 'เฝ้าระวังคุณภาพ',
        color: '#d97706',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
        description: 'ยังไม่ถึงเป้าหมาย 80% ต้องวางแผนปรับปรุงการบริการ',
      },
      {
        id: 'crit_fail',
        minScorePercent: 0,
        maxScorePercent: 69.99,
        label: 'ไม่ผ่านเกณฑ์มาตรฐาน',
        color: '#dc2626',
        badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
        description: 'คะแนนต่ำกว่าเกณฑ์ ต้องวิเคราะห์สาเหตุเชิงลึกเร่งด่วน',
      },
    ],
  },
  {
    name: 'เกณฑ์ความพึงพอใจ 3 ระดับ (ระดับบริการด่วน/งานเคลื่อนที่)',
    description: 'ประเมิน 3 ระดับ เหมาะกับกิจกรรมตรวจสุขภาพนอกสถานที่หรือคัดกรองด่วน',
    goal: 75,
    criteria: [
      {
        id: 'crit_3_high',
        minScorePercent: 80,
        maxScorePercent: 100,
        label: 'พึงพอใจสูงมาก',
        color: '#059669',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        description: 'ผู้รับบริการพึงพอใจอย่างยิ่ง',
      },
      {
        id: 'crit_3_mid',
        minScorePercent: 65,
        maxScorePercent: 79.99,
        label: 'พึงพอใจปานกลาง',
        color: '#2563eb',
        badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
        description: 'การบริการอยู่ในระดับน่าพอใจ',
      },
      {
        id: 'crit_3_low',
        minScorePercent: 0,
        maxScorePercent: 64.99,
        label: 'ควรพัฒนาบริการ',
        color: '#dc2626',
        badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
        description: 'มีข้อติดขัดหรือความล่าช้าในการให้บริการ',
      },
    ],
  },
];

export const CriteriaSettingsTab: React.FC<CriteriaSettingsTabProps> = ({
  campaign,
  onUpdateCampaign,
}) => {
  const [targetGoal, setTargetGoal] = useState<number>(campaign.targetGoalPercent);
  const [criteria, setCriteria] = useState<ScoringCriterion[]>(campaign.criteria || DEFAULT_CRITERIA);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleUpdateCriterion = (index: number, field: keyof ScoringCriterion, value: any) => {
    setCriteria(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
    setSavedSuccess(false);
  };

  const handleAddCriterion = () => {
    const newCrit: ScoringCriterion = {
      id: `crit_${Date.now()}`,
      minScorePercent: 50,
      maxScorePercent: 59.99,
      label: 'ระดับใหม่',
      color: '#64748b',
      badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
      description: 'คำอธิบายเกณฑ์ประเมิน',
    };
    setCriteria([...criteria, newCrit]);
    setSavedSuccess(false);
  };

  const handleDeleteCriterion = (index: number) => {
    if (criteria.length <= 2) {
      alert('ควรมีเกณฑ์การประเมินอย่างน้อย 2 ระดับ');
      return;
    }
    setCriteria(criteria.filter((_, i) => i !== index));
    setSavedSuccess(false);
  };

  const handleApplyTemplate = (tmpl: typeof CRITERIA_TEMPLATES[0]) => {
    setCriteria(tmpl.criteria);
    setTargetGoal(tmpl.goal);
    setSavedSuccess(false);
  };

  const handleSave = () => {
    // Sort criteria by minScorePercent descending
    const sorted = [...criteria].sort((a, b) => b.minScorePercent - a.minScorePercent);

    const updated: Campaign = {
      ...campaign,
      targetGoalPercent: targetGoal,
      criteria: sorted,
    };

    onUpdateCampaign(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Intro Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-teal-600" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-['Prompt']">
                กำหนดเกณฑ์ให้คะแนนตามความต้องการของกิจกรรม
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              กิจกรรม: <strong className="text-slate-800">{campaign.title}</strong>
              {' '}— สามารถกำหนดระดับคะแนนร้อยละ เกณฑ์เป้าหมาย และช่วงตัดเกรดได้อิสระ
            </p>
          </div>

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20 transition"
          >
            <Save className="w-4 h-4" />
            <span>บันทึกเกณฑ์คะแนนของกิจกรรมนี้</span>
          </button>
        </div>

        {savedSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            บันทึกเกณฑ์คะแนนของกิจกรรมเรียบร้อยแล้ว แดชบอร์ดและรายงานจะใช้เกณฑ์นี้ทันที
          </div>
        )}
      </div>

      {/* Target Goal Setting */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-md">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-4 h-4 text-teal-600" />
              ค่าเป้าหมายความพึงพอใจของกิจกรรม (Target Goal %)
            </span>
            <h3 className="text-sm font-bold text-slate-900 mt-1">
              กำหนดเกณฑ์ชี้วัดขั้นต่ำสำหรับกิจกรรมนี้
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              หากคะแนนร้อยละภาพรวมถึงหรือเกินค่านี้ ระบบจะแสดงสถานะ "บรรลุเป้าหมายคุณภาพ" ในรายงาน
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-50 border border-slate-300 rounded-xl px-3 py-2">
              <input
                type="number"
                min="1"
                max="100"
                value={targetGoal}
                onChange={(e) => {
                  setTargetGoal(Number(e.target.value));
                  setSavedSuccess(false);
                }}
                className="w-16 text-lg font-bold text-slate-900 bg-transparent text-right focus:outline-none"
              />
              <span className="text-sm font-bold text-slate-600 ml-1">%</span>
            </div>
            <span className="text-xs text-slate-400 hidden sm:inline">(แนะนำ 80% - 90%)</span>
          </div>
        </div>
      </div>

      {/* Quick Template Presets */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-3">
          <Sparkles className="w-4 h-4 text-amber-500" />
          เลือกใช้แม่แบบเกณฑ์มาตรฐานที่พร้อมใช้ (Preset Templates):
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {CRITERIA_TEMPLATES.map((tmpl, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-teal-300 transition flex flex-col justify-between"
            >
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-800 mb-1">
                  {tmpl.name}
                </h4>
                <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
                  {tmpl.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleApplyTemplate(tmpl)}
                className="w-full text-xs font-semibold py-1.5 px-3 rounded-lg bg-white border border-slate-300 text-teal-700 hover:bg-teal-50 hover:border-teal-400 transition"
              >
                นำแม่แบบนี้ไปใช้
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Editable Criteria Bands Table */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-600" />
              ช่วงคะแนนร้อยละและระดับการแปลผล (Scoring Cut-off Bands)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              แก้ไขชื่อระดับ ช่วงคะแนนร้อยละขั้นต่ำ และคำอธิบายความหมายสำหรับกิจกรรมนี้
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddCriterion}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>เพิ่มช่วงคะแนน</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3 w-12 text-center">ลำดับ</th>
                <th className="py-2.5 px-3 w-40">คะแนนร้อยละขั้นต่ำ (%)</th>
                <th className="py-2.5 px-3">ชื่อระดับการประเมิน (Label)</th>
                <th className="py-2.5 px-3">คำอธิบายความหมาย</th>
                <th className="py-2.5 px-3 w-28 text-center">ตัวอย่างป้าย</th>
                <th className="py-2.5 px-3 w-12 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {criteria.map((crit, idx) => (
                <tr key={crit.id || idx} className="hover:bg-slate-50/60 transition">
                  <td className="py-3 px-3 text-center font-bold text-slate-400">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-slate-500">ตั้งแต่</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={crit.minScorePercent}
                        onChange={(e) => handleUpdateCriterion(idx, 'minScorePercent', Number(e.target.value))}
                        className="w-16 p-1.5 border border-slate-300 rounded-lg text-xs font-bold text-center focus:ring-1 focus:ring-teal-500"
                      />
                      <span className="text-xs text-slate-500">% ขึ้นไป</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <input
                      type="text"
                      value={crit.label}
                      onChange={(e) => handleUpdateCriterion(idx, 'label', e.target.value)}
                      className="w-full p-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:ring-1 focus:ring-teal-500"
                    />
                  </td>
                  <td className="py-3 px-3">
                    <input
                      type="text"
                      value={crit.description}
                      onChange={(e) => handleUpdateCriterion(idx, 'description', e.target.value)}
                      placeholder="คำอธิบายเกณฑ์..."
                      className="w-full p-1.5 border border-slate-300 rounded-lg text-xs text-slate-600 focus:ring-1 focus:ring-teal-500"
                    />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${crit.badgeClass || 'bg-slate-100 text-slate-800'}`}>
                      {crit.label}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleDeleteCriterion(idx)}
                      disabled={criteria.length <= 2}
                      className="text-slate-400 hover:text-rose-600 disabled:opacity-30 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

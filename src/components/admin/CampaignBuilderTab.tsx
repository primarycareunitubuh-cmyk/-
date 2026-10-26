import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  Copy, 
  FolderPlus, 
  Layers, 
  Sparkles, 
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Calendar,
  Settings2,
  FileQuestion,
  X
} from 'lucide-react';
import { Campaign, Question, QuestionType, ServiceStation } from '../../types';
import { STATION_INFO, DEFAULT_CRITERIA, SERVICE_DIMENSIONS_LIST } from '../../data/initialData';

interface CampaignBuilderTabProps {
  campaigns: Campaign[];
  activeCampaignId: string;
  onSelectCampaign: (id: string) => void;
  onUpdateCampaigns: (campaigns: Campaign[]) => void;
}

const PRESET_QUESTIONS: { text: string; category: ServiceStation; type: QuestionType; description?: string }[] = [
  {
    text: 'ความสุภาพ นุ่มนวล การให้เกียรติ และความกระตือรือร้นในการให้บริการของเจ้าหน้าที่',
    category: 'dimension_staff',
    type: 'smiley5',
    description: 'ด้านที่ 1: การให้บริการของเจ้าหน้าที่ (หน้างาน)',
  },
  {
    text: 'ความสะดวก รวดเร็ว และความชัดเจนของขั้นตอนการลงทะเบียนและการจัดคิวรับบริการ',
    category: 'dimension_process_time',
    type: 'smiley5',
    description: 'ด้านที่ 2: ระบบขั้นตอนและระยะเวลาการให้บริการ',
  },
  {
    text: 'ความสะอาด ปลอดภัย และสุขอนามัยของห้องตรวจ ที่นั่งพักคอย น้ำดื่ม และห้องสุขา',
    category: 'dimension_facility',
    type: 'rating5',
    description: 'ด้านที่ 3: สถานที่และสิ่งอำนวยความสะดวก',
  },
  {
    text: 'ความสะดวกรวดเร็วของระบบแจ้งผลการตรวจสุขภาพ และการให้คำแนะนำดูแลต่อเนื่อง',
    category: 'dimension_result_followup',
    type: 'rating5',
    description: 'ด้านที่ 4: ระบบแจ้งผลและการติดตามดูแลต่อเนื่อง',
  },
  {
    text: 'ภาพรวมความพึงพอใจต่อการเข้ารับบริการตรวจสุขภาพในครั้งนี้',
    category: 'dimension_overall',
    type: 'smiley5',
    description: 'ด้านที่ 5: ความพึงพอใจโดยรวม',
  },
  {
    text: 'ท่านตั้งใจที่จะแนะนำให้ญาติ เพื่อนร่วมงาน หรือผู้อื่นมารับบริการตรวจสุขภาพที่นี่หรือไม่',
    category: 'dimension_loyalty_recommend',
    type: 'recommend_intent',
    description: 'ความตั้งใจแนะนำ (ตั้งใจแนะนำ / ไม่ตั้งใจแนะนำ)',
  },
  {
    text: 'ท่านตั้งใจที่จะกลับมาใช้บริการตรวจสุขภาพที่นี่อีกในโอกาสต่อไปหรือไม่',
    category: 'dimension_loyalty_recommend',
    type: 'return_intent',
    description: 'ความตั้งใจกลับมาใช้บริการซ้ำ (ตั้งใจกลับมาใช้บริการ / ไม่ตั้งใจกลับมาใช้บริการ)',
  },
  {
    text: 'ข้อคิดเห็นและข้อเสนอแนะเพิ่มเติมเพื่อการปรับปรุงและพัฒนาบริการตรวจสุขภาพ',
    category: 'dimension_feedback_suggestion',
    type: 'text',
    description: 'ด้านข้อคิดเห็นและข้อเสนอแนะ',
  },
];

export const CampaignBuilderTab: React.FC<CampaignBuilderTabProps> = ({
  campaigns,
  activeCampaignId,
  onSelectCampaign,
  onUpdateCampaigns,
}) => {
  const currentCampaign = campaigns.find(c => c.id === activeCampaignId) || campaigns[0];

  // Modals & form state
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);
  const [showNewQuestionModal, setShowNewQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // New Campaign Form
  const [newCampTitle, setNewCampTitle] = useState('');
  const [newCampCode, setNewCampCode] = useState('');
  const [newCampUnit, setNewCampUnit] = useState('กลุ่มงานตรวจสุขภาพ');
  const [newCampGoal, setNewCampGoal] = useState<number>(85);
  const [newCampDesc, setNewCampDesc] = useState('');

  // New/Edit Question Form
  const [qText, setQText] = useState('');
  const [qCategory, setQCategory] = useState<ServiceStation>('dimension_staff');
  const [qType, setQType] = useState<QuestionType>('smiley5');
  const [qRequired, setQRequired] = useState(true);
  const [qDesc, setQDesc] = useState('');

  // Save changes to current campaign helper
  const updateCurrentCampaign = (updater: (camp: Campaign) => Campaign) => {
    const updated = campaigns.map(c => (c.id === currentCampaign.id ? updater(c) : c));
    onUpdateCampaigns(updated);
  };

  // Set as public active campaign
  const handleSetActive = (campId: string) => {
    onSelectCampaign(campId);
    const updated = campaigns.map(c => ({
      ...c,
      status: c.id === campId ? ('active' as const) : c.status,
    }));
    onUpdateCampaigns(updated);
  };

  // Create Campaign
  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampTitle.trim()) return;

    const newId = `camp_${Date.now()}`;
    const newCamp: Campaign = {
      id: newId,
      title: newCampTitle.trim(),
      code: newCampCode.trim() || `CHK-${Date.now().toString().slice(-4)}`,
      subtitle: newCampUnit.trim(),
      targetUnit: newCampUnit.trim(),
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString().split('T')[0],
      status: 'active',
      description: newCampDesc.trim() || 'แบบประเมินความพึงพอใจการบริการตรวจสุขภาพ',
      targetGoalPercent: newCampGoal,
      scoringScaleMax: 5,
      criteria: DEFAULT_CRITERIA,
      createdAt: new Date().toISOString(),
      questions: [
        {
          id: `q_${Date.now()}_1`,
          text: 'ความสุภาพ นุ่มนวล และความใส่ใจของเจ้าหน้าที่ผู้ให้บริการ',
          category: 'dimension_staff',
          type: 'smiley5',
          required: true,
          order: 1,
        },
        {
          id: `q_${Date.now()}_2`,
          text: 'ความสะดวกและรวดเร็วในขั้นตอนและระยะเวลาการให้บริการ',
          category: 'dimension_process_time',
          type: 'rating5',
          required: true,
          order: 2,
        },
        {
          id: `q_${Date.now()}_3`,
          text: 'ความสะอาด เป็นระเบียบ และสิ่งอำนวยความสะดวกของสถานที่',
          category: 'dimension_facility',
          type: 'rating5',
          required: true,
          order: 3,
        },
        {
          id: `q_${Date.now()}_4`,
          text: 'ความชัดเจนของระบบแจ้งผลการตรวจและการติดตามดูแลต่อเนื่อง',
          category: 'dimension_result_followup',
          type: 'rating5',
          required: true,
          order: 4,
        },
        {
          id: `q_${Date.now()}_5`,
          text: 'ภาพรวมความพึงพอใจต่อการเข้ารับบริการตรวจสุขภาพในครั้งนี้',
          category: 'dimension_overall',
          type: 'smiley5',
          required: true,
          order: 5,
        },
        {
          id: `q_${Date.now()}_6`,
          text: 'ความตั้งใจที่จะกลับมาใช้บริการตรวจสุขภาพอีกในครั้งต่อไป หรือแนะนำบอกต่อแก่ผู้อื่น',
          category: 'dimension_loyalty_recommend',
          type: 'smiley5',
          required: true,
          order: 6,
        },
        {
          id: `q_${Date.now()}_7`,
          text: 'ข้อคิดเห็นและข้อเสนอแนะเพิ่มเติมเพื่อการปรับปรุงและพัฒนาบริการตรวจสุขภาพ',
          category: 'dimension_feedback_suggestion',
          type: 'text',
          required: false,
          order: 7,
        },
      ],
    };

    const updated = [newCamp, ...campaigns];
    onUpdateCampaigns(updated);
    onSelectCampaign(newId);
    setShowNewCampaignModal(false);
    setNewCampTitle('');
    setNewCampCode('');
    setNewCampDesc('');
  };

  // Duplicate Campaign
  const handleDuplicateCampaign = (camp: Campaign) => {
    const clonedId = `camp_${Date.now()}`;
    const cloned: Campaign = {
      ...camp,
      id: clonedId,
      title: `${camp.title} (สำเนาชุดใหม่)`,
      code: `${camp.code}-COPY`,
      createdAt: new Date().toISOString(),
      questions: camp.questions.map(q => ({
        ...q,
        id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      })),
    };
    const updated = [cloned, ...campaigns];
    onUpdateCampaigns(updated);
    onSelectCampaign(clonedId);
  };

  // Delete Campaign
  const handleDeleteCampaign = (campId: string) => {
    if (campaigns.length <= 1) {
      alert('ต้องมีแบบสอบถามอย่างน้อย 1 ชุดในระบบ');
      return;
    }
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบชุดแบบสอบถามนี้?')) {
      const updated = campaigns.filter(c => c.id !== campId);
      onUpdateCampaigns(updated);
      onSelectCampaign(updated[0].id);
    }
  };

  // Add / Edit Question
  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qText.trim()) return;

    if (editingQuestion) {
      // update
      updateCurrentCampaign(camp => ({
        ...camp,
        questions: camp.questions.map(q =>
          q.id === editingQuestion.id
            ? {
                ...q,
                text: qText.trim(),
                category: qCategory,
                type: qType,
                required: qRequired,
                description: qDesc.trim() || undefined,
              }
            : q
        ),
      }));
      setEditingQuestion(null);
    } else {
      // create new
      const newQuestion: Question = {
        id: `q_${Date.now()}`,
        text: qText.trim(),
        category: qCategory,
        type: qType,
        required: qRequired,
        order: currentCampaign.questions.length + 1,
        description: qDesc.trim() || undefined,
      };
      updateCurrentCampaign(camp => ({
        ...camp,
        questions: [...camp.questions, newQuestion],
      }));
      setShowNewQuestionModal(false);
    }

    setQText('');
    setQDesc('');
    setQCategory('dimension_staff');
    setQType('smiley5');
    setQRequired(true);
  };

  // Open Edit Question
  const handleOpenEdit = (q: Question) => {
    setEditingQuestion(q);
    setQText(q.text);
    setQDesc(q.description || '');
    setQCategory(q.category);
    setQType(q.type);
    setQRequired(q.required);
  };

  // Delete Question in Real-time
  const handleDeleteQuestion = (questionId: string) => {
    if (confirm('ต้องการลบข้อคำถามนี้ออกจากแบบประเมินแบบเรียลไทม์หรือไม่?')) {
      updateCurrentCampaign(camp => ({
        ...camp,
        questions: camp.questions.filter(q => q.id !== questionId),
      }));
    }
  };

  // Move Question Order
  const handleMoveOrder = (index: number, direction: 'up' | 'down') => {
    const list = [...currentCampaign.questions];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    // re-assign order numbers
    const reordered = list.map((item, i) => ({ ...item, order: i + 1 }));
    updateCurrentCampaign(camp => ({
      ...camp,
      questions: reordered,
    }));
  };

  // Add from preset
  const handleAddPreset = (preset: typeof PRESET_QUESTIONS[0]) => {
    const newQ: Question = {
      id: `q_${Date.now()}`,
      text: preset.text,
      category: preset.category,
      type: preset.type,
      required: true,
      order: currentCampaign.questions.length + 1,
      description: preset.description,
    };
    updateCurrentCampaign(camp => ({
      ...camp,
      questions: [...camp.questions, newQ],
    }));
  };

  return (
    <div className="space-y-8">
      
      {/* 1. Campaign Selection & Creation Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-teal-600" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-['Prompt']">
                รังสรรค์แบบสอบถามหลายชุดกิจกรรม (Multi-Campaign Management)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              เลือกชุดกิจกรรมเพื่อแก้ไขคำถาม หรือสร้างแบบประเมินกิจกรรมตรวจสุขภาพชุดใหม่
            </p>
          </div>

          <button
            onClick={() => setShowNewCampaignModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-xs transition"
          >
            <FolderPlus className="w-4 h-4" />
            <span>สร้างชุดแบบสอบถามใหม่</span>
          </button>
        </div>

        {/* Campaign Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {campaigns.map((camp) => {
            const isCurrent = camp.id === currentCampaign.id;
            return (
              <div
                key={camp.id}
                onClick={() => onSelectCampaign(camp.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isCurrent
                    ? 'border-teal-500 bg-teal-50/40 ring-2 ring-teal-500/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {camp.code}
                  </span>
                  <div className="flex items-center gap-1">
                    {isCurrent && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-600 text-white flex items-center gap-1">
                        <Check className="w-3 h-3" /> กำลังเปิดใช้งาน
                      </span>
                    )}
                  </div>
                </div>

                <h4 className="text-sm font-bold text-slate-900 line-clamp-1 mb-1 font-['Prompt']">
                  {camp.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-1 mb-3">
                  {camp.subtitle || camp.targetUnit}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  <span>{camp.questions.length} ข้อคำถาม</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicateCampaign(camp);
                      }}
                      title="คัดลอกเป็นชุดใหม่"
                      className="text-slate-400 hover:text-slate-700 p-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {campaigns.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCampaign(camp.id);
                        }}
                        title="ลบชุดนี้"
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Real-Time Question Management Section */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <FileQuestion className="w-5 h-5 text-teal-600" />
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-['Prompt']">
                จัดการข้อคำถามแบบเรียลไทม์ (Real-Time Question Editor)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              กำลังจัดการคำถามในชุด: <strong className="text-slate-800">{currentCampaign.title}</strong>
              <span className="text-teal-600 ml-2">(การเปลี่ยนแปลงจะมีผลต่อหน้าตอบแบบประเมินทันที)</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditingQuestion(null);
                setQText('');
                setQDesc('');
                setQCategory('dimension_staff');
                setQType('smiley5');
                setQRequired(true);
                setShowNewQuestionModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มข้อคำถามใหม่</span>
            </button>
          </div>
        </div>

        {/* Quick Presets Recommendation */}
        <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            คำถามแนะนำตามมาตรฐานการตรวจสุขภาพ (กดเพื่อเพิ่มทันที):
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_QUESTIONS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAddPreset(preset)}
                className="text-xs bg-white hover:bg-teal-50 hover:border-teal-300 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700 transition flex items-center gap-1.5"
              >
                <Plus className="w-3 h-3 text-teal-600" />
                <span className="max-w-[280px] truncate">{preset.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Question List */}
        <div className="space-y-3">
          {currentCampaign.questions.map((question, index) => {
            const stInfo = STATION_INFO[question.category] || { nameTh: question.category, color: 'slate' };

            return (
              <div
                key={question.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition flex items-start justify-between gap-3 group"
              >
                {/* Order & Drag Controls */}
                <div className="flex items-center gap-1">
                  <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <div className="flex flex-col">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveOrder(index, 'up')}
                      className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={index === currentCampaign.questions.length - 1}
                      onClick={() => handleMoveOrder(index, 'down')}
                      className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${stInfo.badgeClass || 'bg-slate-100 text-slate-700'}`}>
                      {stInfo.nameTh}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                      {question.type === 'smiley5'
                        ? 'คะแนน 5 ระดับ (อิโมจิ)'
                        : question.type === 'rating5'
                        ? 'คะแนน 5 ดาว'
                        : question.type === 'yesno'
                        ? 'ใช่ / ไม่ใช่'
                        : question.type === 'recommend_intent'
                        ? 'ตั้งใจแนะนำ / ไม่ตั้งใจแนะนำ'
                        : question.type === 'return_intent'
                        ? 'ตั้งใจกลับมาใช้บริการ / ไม่ตั้งใจกลับมาใช้บริการ'
                        : 'ข้อความปลายเปิด'}
                    </span>
                    {question.required ? (
                      <span className="text-[11px] text-rose-600 font-medium">*จำเป็น</span>
                    ) : (
                      <span className="text-[11px] text-slate-400">ตัวเลือก</span>
                    )}
                  </div>
                  
                  <h4 className="text-sm font-semibold text-slate-900 leading-snug">
                    {question.text}
                  </h4>
                  {question.description && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      {question.description}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(question)}
                    className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition"
                    title="แก้ไขข้อคำถาม"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(question.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="ลบคำถามแบบเรียลไทม์"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* MODAL: New Campaign */}
      {showNewCampaignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 font-['Prompt']">
                สร้างชุดแบบประเมินกิจกรรมตรวจสุขภาพใหม่
              </h3>
              <button onClick={() => setShowNewCampaignModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="p-5 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ชื่อโครงการ / กิจกรรมตรวจสุขภาพ *
                </label>
                <input
                  type="text"
                  required
                  value={newCampTitle}
                  onChange={(e) => setNewCampTitle(e.target.value)}
                  placeholder="เช่น ตรวจสุขภาพนักศึกษาแรกเข้า ประจำปี 2569"
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    รหัสกิจกรรม (Code)
                  </label>
                  <input
                    type="text"
                    value={newCampCode}
                    onChange={(e) => setNewCampCode(e.target.value)}
                    placeholder="เช่น CHK-STUDENT-26"
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    เป้าหมายความพึงพอใจ (%)
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    value={newCampGoal}
                    onChange={(e) => setNewCampGoal(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  หน่วยงานที่รับผิดชอบ
                </label>
                <input
                  type="text"
                  value={newCampUnit}
                  onChange={(e) => setNewCampUnit(e.target.value)}
                  placeholder="เช่น ศูนย์สุขภาพปฐมภูมิ โรงพยาบาลมหาวิทยาลัยอุบลราชธานี"
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  คำอธิบายหรือวัตถุประสงค์
                </label>
                <textarea
                  rows={2}
                  value={newCampDesc}
                  onChange={(e) => setNewCampDesc(e.target.value)}
                  placeholder="แบบประเมินความพึงพอใจการให้บริการตรวจสุขภาพ..."
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewCampaignModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-xs"
                >
                  สร้างกิจกรรม
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add or Edit Question */}
      {(showNewQuestionModal || editingQuestion) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 font-['Prompt']">
                {editingQuestion ? 'แก้ไขข้อคำถาม' : 'เพิ่มข้อคำถามใหม่'}
              </h3>
              <button
                onClick={() => {
                  setShowNewQuestionModal(false);
                  setEditingQuestion(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="p-5 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ข้อความคำถาม *
                </label>
                <textarea
                  rows={2}
                  required
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                  placeholder="เช่น ความสะดวกรวดเร็วในการตรวจเอกซเรย์ทรวงอก..."
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  คำอธิบายเพิ่มเติม (ถ้ามี)
                </label>
                <input
                  type="text"
                  value={qDesc}
                  onChange={(e) => setQDesc(e.target.value)}
                  placeholder="เช่น การจัดคิวและการแนะนำการเปลี่ยนชุด"
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    ด้านการประเมินความพึงพอใจ *
                  </label>
                  <select
                    value={qCategory}
                    onChange={(e) => setQCategory(e.target.value as ServiceStation)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 font-medium text-slate-800"
                  >
                    {SERVICE_DIMENSIONS_LIST.map((dim) => (
                      <option key={dim.key} value={dim.key}>
                        {dim.nameTh}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    รูปแบบการตอบ
                  </label>
                  <select
                    value={qType}
                    onChange={(e) => setQType(e.target.value as QuestionType)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 font-medium text-slate-800"
                  >
                    <option value="smiley5">คะแนน 5 ระดับ (อิโมจิ หน้ายิ้ม)</option>
                    <option value="rating5">คะแนน 5 ดาว (Star Rating)</option>
                    <option value="yesno">ใช่ / ไม่ใช่ (พอใจ / ไม่พอใจ)</option>
                    <option value="recommend_intent">ตั้งใจแนะนำ / ไม่ตั้งใจแนะนำ</option>
                    <option value="return_intent">ตั้งใจกลับมาใช้บริการ / ไม่ตั้งใจกลับมาใช้บริการ</option>
                    <option value="text">ข้อความเสนอแนะปลายเปิด</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="chk-req"
                  checked={qRequired}
                  onChange={(e) => setQRequired(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                />
                <label htmlFor="chk-req" className="font-medium text-slate-700 cursor-pointer">
                  จำเป็นต้องตอบข้อนี้ (Required)
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewQuestionModal(false);
                    setEditingQuestion(null);
                  }}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-xs"
                >
                  {editingQuestion ? 'บันทึกการแก้ไข' : 'เพิ่มคำถาม'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

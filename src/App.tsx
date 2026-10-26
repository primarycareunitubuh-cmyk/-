import React, { useState, useEffect } from 'react';
import { 
  getStoredCampaigns, 
  saveStoredCampaigns, 
  getStoredActiveCampaignId, 
  setStoredActiveCampaignId, 
  getStoredResponses, 
  saveStoredResponses, 
  addStoredSubmission, 
  isStaffAuthenticated, 
  setStaffAuthenticated,
  resetAllDataToDefault,
  STAFF_PASSWORD
} from './utils/storage';
import { Campaign, SurveySubmission } from './types';
import { Header, AppView } from './components/Header';
import { CampaignSelectorLanding } from './components/CampaignSelectorLanding';
import { ClientSurveyView } from './components/ClientSurveyView';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { KioskSurveyView } from './components/KioskSurveyView';
import { computeSubmissionScorePercent } from './utils/scoring';
import { Hospital, Heart, ShieldCheck } from 'lucide-react';

export default function App() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => getStoredCampaigns());
  const [activeCampaignId, setActiveCampaignId] = useState<string>(() => getStoredActiveCampaignId());
  const [allResponses, setAllResponses] = useState<SurveySubmission[]>(() => getStoredResponses());
  // The first screen is now the centered Activity Selection Landing page
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [isStaff, setIsStaff] = useState<boolean>(() => isStaffAuthenticated());
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  // Sync active campaign
  const activeCampaign = campaigns.find(c => c.id === activeCampaignId) || campaigns[0] || null;

  const handleSelectCampaign = (campId: string) => {
    setActiveCampaignId(campId);
    setStoredActiveCampaignId(campId);
  };

  // Called when user clicks an activity card on the landing page
  const handleChooseCampaignFromLanding = (campId: string) => {
    setActiveCampaignId(campId);
    setStoredActiveCampaignId(campId);
    setCurrentView('survey');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateCampaigns = (updatedCampaigns: Campaign[]) => {
    setCampaigns(updatedCampaigns);
    saveStoredCampaigns(updatedCampaigns);
  };

  const handleSubmitSurvey = (submission: SurveySubmission) => {
    addStoredSubmission(submission);
    setAllResponses(prev => [submission, ...prev]);
  };

  const handleDeleteResponse = (responseId: string) => {
    const updated = allResponses.filter(r => r.id !== responseId);
    setAllResponses(updated);
    saveStoredResponses(updated);
  };

  // Add 5 realistic sample submissions to test statistics
  const handleAddSampleResponses = () => {
    if (!activeCampaign) return;

    const sampleGenders: ('ชาย' | 'หญิง' | 'ไม่ระบุ')[] = ['ชาย', 'หญิง', 'หญิง', 'ชาย', 'หญิง'];
    const sampleAges: ('20 - 35 ปี' | '36 - 50 ปี' | '51 - 60 ปี' | 'มากกว่า 60 ปี')[] = [
      '20 - 35 ปี',
      '36 - 50 ปี',
      '51 - 60 ปี',
      '20 - 35 ปี',
      'มากกว่า 60 ปี',
    ];
    const sampleComments = [
      'เจ้าหน้าที่พูดจาไพเราะ ยิ้มแย้มแจ่มใส ให้ข้อมูลชัดเจนมากครับ',
      'จุดตรวจเจาะเลือดบริการเร็วมาก ไม่ต้องรอนานเหมือนปีก่อน ประทับใจค่ะ',
      'สถานที่สะอาด เรียบร้อย มีน้ำและอาหารว่างรองรับอย่างดี ขอบคุณค่ะ',
      'คุณหมออธิบายผลตรวจสุขภาพและแนะนำการปรับอาหารได้ละเอียดเข้าใจง่าย',
      'บริการดีเยี่ยม รวดเร็ว มีขั้นตอนที่ไม่ซับซ้อน สะดวกสบายมากครับ',
    ];

    const sampleOccupations = [
      'อาจารย์/พนักงานมหาวิทยาลัยอุบล',
      'ข้าราชการ/พนักงานรัฐ',
      'พนักงานเอกชน',
      'นักเรียน/นักศึกษา',
      'ธุรกิจส่วนตัว/ค้าขาย',
    ];
    const sampleCoverages = [
      'ข้าราชการ/กรมบัญชีกลาง',
      'ประกันสังคม',
      'หลักประกันสุขภาพแห่งชาติ(บัตรทอง)',
      'อปท',
      'ชำระเงินเอง',
    ];
    const sampleHistories = [
      'รับบริการตรวจสุขภาพมากกว่า 1 ครั้ง',
      'มารับบริการครั้งแรก',
      'รับบริการตรวจสุขภาพมากกว่า 1 ครั้ง',
      'รับบริการตรวจสุขภาพมากกว่า 1 ครั้ง',
      'มารับบริการครั้งแรก',
    ];

    const newSamples: SurveySubmission[] = Array.from({ length: 5 }).map((_, idx) => {
      const answers: Record<string, number | string> = {};
      activeCampaign.questions.forEach(q => {
        if (q.type === 'text') {
          answers[q.id] = sampleComments[idx % sampleComments.length];
        } else if (q.type === 'recommend_intent' || q.type === 'return_intent') {
          // Mostly positive intent (5), occasionally (1)
          answers[q.id] = Math.random() > 0.15 ? 5 : 1;
        } else {
          // generate 4 or 5 score mostly
          const randScore = Math.random() > 0.25 ? 5 : (Math.random() > 0.4 ? 4 : 3);
          answers[q.id] = randScore;
        }
      });

      const scorePercent = computeSubmissionScorePercent(
        answers,
        activeCampaign.questions,
        activeCampaign.scoringScaleMax || 5
      );

      return {
        id: `sample_${Date.now()}_${idx}`,
        campaignId: activeCampaign.id,
        submittedAt: new Date(Date.now() - idx * 3600 * 1000 * 3).toISOString(),
        demographics: {
          gender: sampleGenders[idx % sampleGenders.length],
          ageRange: sampleAges[idx % sampleAges.length],
          occupation: sampleOccupations[idx % sampleOccupations.length],
          coverage: sampleCoverages[idx % sampleCoverages.length],
          visitHistory: sampleHistories[idx % sampleHistories.length],
          serviceType: 'ตรวจสุขภาพประจำปี',
        },
        answers,
        overallScorePercent: scorePercent,
        comment: sampleComments[idx % sampleComments.length],
      };
    });

    const updated = [...newSamples, ...allResponses];
    setAllResponses(updated);
    saveStoredResponses(updated);
  };

  const handleResetAllData = () => {
    resetAllDataToDefault();
    setCampaigns(getStoredCampaigns());
    setActiveCampaignId(getStoredActiveCampaignId());
    setAllResponses(getStoredResponses());
  };

  const handleStaffLogout = () => {
    setStaffAuthenticated(false);
    setIsStaff(false);
    if (currentView === 'admin') {
      setCurrentView('landing');
    }
  };

  const handleStaffLoginSuccess = () => {
    setIsStaff(true);
    setShowLoginModal(false);
    setCurrentView('admin');
  };

  const handleNavigate = (view: AppView) => {
    if (view === 'admin') {
      if (!isStaff) {
        setShowLoginModal(true);
        return;
      }
    }
    setCurrentView(view);
  };

  // Kiosk View has full screen presentation
  if (currentView === 'kiosk' && activeCampaign) {
    return (
      <KioskSurveyView
        campaign={activeCampaign}
        onSubmitSurvey={handleSubmitSurvey}
        onExitKiosk={() => setCurrentView('landing')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-['Prompt',sans-serif]">
      {/* Top Header Navbar */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        activeCampaign={activeCampaign}
        allCampaigns={campaigns}
        onSelectCampaign={handleSelectCampaign}
        isStaff={isStaff}
        onStaffLogout={handleStaffLogout}
        onRequestStaffLogin={() => setShowLoginModal(true)}
        onBackToLanding={handleBackToLanding}
      />

      {/* Main Container */}
      <main className="flex-1">
        {/* Landing View: Centered Activity Selection Screen */}
        {currentView === 'landing' && (
          <CampaignSelectorLanding
            campaigns={campaigns}
            onSelectCampaign={handleChooseCampaignFromLanding}
            onRequestStaffLogin={() => setShowLoginModal(true)}
            isStaff={isStaff}
            onGoToAdmin={() => setCurrentView('admin')}
          />
        )}

        {/* Survey View: Current Satisfaction Assessment Form */}
        {currentView === 'survey' && activeCampaign && (
          <ClientSurveyView
            campaign={activeCampaign}
            onSubmitSurvey={handleSubmitSurvey}
            onBackToSelect={handleBackToLanding}
          />
        )}

        {/* Admin Dashboard: Staff Management Portal */}
        {currentView === 'admin' && activeCampaign && isStaff && (
          <AdminDashboard
            campaigns={campaigns}
            activeCampaignId={activeCampaignId}
            onSelectCampaign={handleSelectCampaign}
            onUpdateCampaigns={handleUpdateCampaigns}
            allResponses={allResponses}
            onDeleteResponse={handleDeleteResponse}
            onAddSampleResponses={handleAddSampleResponses}
            onLaunchKiosk={() => setCurrentView('kiosk')}
            onResetAllData={handleResetAllData}
          />
        )}
      </main>

      {/* Luxurious Footer */}
      <footer className="bg-white/95 border-t border-slate-200/90 py-6 text-xs text-slate-500 text-center relative">
        <div className="h-[1.5px] w-full bg-gradient-to-r from-emerald-600 via-amber-400 to-teal-600 absolute top-0 left-0" />
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Hospital className="w-4 h-4 text-emerald-700" />
            <span className="font-semibold text-slate-800">
              ระบบประเมินความพึงพอใจ • งานอาชีวเวชกรรม กลุ่มงานบริการปฐมภูมิ
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <button
              onClick={() => handleNavigate('admin')}
              className="text-slate-600 hover:text-emerald-800 font-semibold transition"
            >
              สำหรับเจ้าหน้าที่โรงพยาบาล (Staff Portal)
            </button>
          </div>
        </div>
      </footer>

      {/* Staff Login Modal */}
      <AdminLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleStaffLoginSuccess}
      />
    </div>
  );
}

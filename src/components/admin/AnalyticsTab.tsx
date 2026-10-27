import React, { useState } from 'react';
import { 
  Users, 
  TrendingUp, 
  Award, 
  Target, 
  Filter, 
  Calendar, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle,
  Building,
  Star,
  Activity,
  MessageSquare,
  Sparkles,
  Briefcase,
  Shield,
  History,
  UserCheck
} from 'lucide-react';
import { Campaign, SurveySubmission } from '../../types';
import { calculateCampaignStats } from '../../utils/scoring';
import { STATION_INFO, SERVICE_DIMENSIONS_LIST } from '../../data/initialData';
import { getCampaignTheme } from '../../utils/campaignHelper';

interface AnalyticsTabProps {
  campaign: Campaign;
  allResponses: SurveySubmission[];
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({
  campaign,
  allResponses,
}) => {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedStationFilter, setSelectedStationFilter] = useState<string>('all');
  const campaignTheme = getCampaignTheme(campaign);

  const stats = calculateCampaignStats(campaign, allResponses, dateFrom, dateTo);

  const filteredQuestionStats = selectedStationFilter === 'all'
    ? stats.questionStats
    : stats.questionStats.filter(q => {
        if (selectedStationFilter.startsWith('custom:')) {
          const targetName = selectedStationFilter.replace('custom:', '');
          return q.question.customCategoryName === targetName;
        }
        return q.question.category === selectedStationFilter;
      });

  // Demographics breakdown calculation
  let relevantResponses = allResponses.filter(r => r.campaignId === campaign.id);
  if (dateFrom) relevantResponses = relevantResponses.filter(r => new Date(r.submittedAt) >= new Date(dateFrom));
  if (dateTo) {
    const toDate = new Date(dateTo);
    toDate.setHours(23, 59, 59, 999);
    relevantResponses = relevantResponses.filter(r => new Date(r.submittedAt) <= toDate);
  }

  const totalCount = relevantResponses.length || 1;

  // Age statistics calculation
  const validAges = relevantResponses
    .map(r => r.demographics?.age)
    .filter((a): a is number => typeof a === 'number' && !isNaN(a) && a > 0);

  const hasAgeData = validAges.length > 0;
  const avgAge = hasAgeData ? (validAges.reduce((sum, a) => sum + a, 0) / validAges.length) : null;
  const minAge = hasAgeData ? Math.min(...validAges) : null;
  const maxAge = hasAgeData ? Math.max(...validAges) : null;

  const ageGroupOrder = [
    'ต่ำกว่า 20 ปี',
    '20 - 35 ปี',
    '36 - 50 ปี',
    '51 - 60 ปี',
    'มากกว่า 60 ปี',
  ];

  const ageGroupStats = relevantResponses.reduce<Record<string, number>>((acc, r) => {
    let group = r.demographics?.ageRange;
    if (!group && typeof r.demographics?.age === 'number') {
      const a = r.demographics.age;
      if (a < 20) group = 'ต่ำกว่า 20 ปี';
      else if (a <= 35) group = '20 - 35 ปี';
      else if (a <= 50) group = '36 - 50 ปี';
      else if (a <= 60) group = '51 - 60 ปี';
      else group = 'มากกว่า 60 ปี';
    }
    const key = group || 'ไม่ระบุ';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const occupationStats = relevantResponses.reduce<Record<string, number>>((acc, r) => {
    const key = r.demographics?.occupation || 'ไม่ระบุ';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const coverageStats = relevantResponses.reduce<Record<string, number>>((acc, r) => {
    const key = r.demographics?.coverage || 'ไม่ระบุ';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const historyStats = relevantResponses.reduce<Record<string, number>>((acc, r) => {
    const key = r.demographics?.visitHistory || 'ไม่ระบุ';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const resetFilters = () => {
    setDateFrom('');
    setDateTo('');
    setSelectedStationFilter('all');
  };

  return (
    <div className="space-y-6">
      
      {/* Activity Context Header & Filter Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Active Activity Indicator Badge */}
          <div className="flex items-center gap-2 pr-3 border-r border-slate-200">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${campaignTheme.badgeBg}`}>
              <Activity className="w-3.5 h-3.5" />
              <span>{campaign.code}</span>
            </span>
            <span className={`hidden md:inline-flex text-[11px] font-semibold px-2 py-0.5 rounded border ${campaignTheme.chipClass}`}>
              {campaignTheme.name.split(' ')[0]}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Filter className="w-4 h-4 text-teal-600" />
            <span>กรองข้อมูล:</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <span className="text-xs text-slate-400">ถึง</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <select
            value={selectedStationFilter}
            onChange={(e) => setSelectedStationFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
          >
            <option value="all">ทุกด้านการประเมิน (ครบทุกมิติ)</option>
            {SERVICE_DIMENSIONS_LIST.filter(d => d.key !== 'dimension_other').map((dim) => (
              <option key={dim.key} value={dim.key}>
                {dim.nameTh}
              </option>
            ))}
            {/* Any custom dimensions present in this campaign */}
            {Array.from(new Set(campaign.questions.map(q => q.customCategoryName?.trim()).filter((n): n is string => Boolean(n)))).map((cName, idx) => (
              <option key={`filter_custom_${cName}_${idx}`} value={`custom:${cName}`}>
                ด้านกำหนดเอง: {cName}
              </option>
            ))}
            <option value="dimension_other">ด้านอื่นๆ ทั้งหมด</option>
          </select>
        </div>

        {(dateFrom || dateTo || selectedStationFilter !== 'all') && (
          <button
            onClick={resetFilters}
            className="text-xs text-rose-600 hover:text-rose-700 font-medium underline"
          >
            ล้างตัวกรอง
          </button>
        )}
      </div>

      {/* Top Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Metric 1: Total Respondents */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              ผู้ตอบแบบสอบถาม
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-['Prompt']">
              {stats.totalRespondents}
            </span>
            <span className="text-xs text-slate-500">คน</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            กิจกรรม: {campaign.code}
          </p>
        </div>

        {/* Metric 2: Overall Score Percent */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              ความพึงพอใจภาพรวม
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-teal-700 font-['Prompt']">
              {stats.overallScorePercent.toFixed(1)}%
            </span>
            <span className="text-xs text-slate-500">({stats.overallAvgScore.toFixed(2)}/5)</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px]">
            <span className="text-slate-500">เกณฑ์เป้าหมาย:</span>
            <span className="font-semibold text-slate-700">{campaign.targetGoalPercent}%</span>
          </div>
        </div>

        {/* Metric 3: Evaluation Level Criterion */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              ระดับการประเมินที่ได้
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${stats.ratingCriterion?.badgeClass || 'bg-slate-100 text-slate-800'}`}>
              {stats.ratingCriterion?.label || 'รอการประเมิน'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 truncate">
            {stats.ratingCriterion?.description || 'คำนวณตามเกณฑ์ที่กำหนด'}
          </p>
        </div>

        {/* Metric 4: Goal Achievement */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              สถานะเป้าหมายคุณภาพ
            </span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stats.isGoalMet ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              {stats.isGoalMet ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            </div>
          </div>
          <div className="mt-3">
            <span className={`text-base font-bold flex items-center gap-1.5 ${stats.isGoalMet ? 'text-emerald-700' : 'text-rose-600'}`}>
              {stats.isGoalMet ? 'บรรลุเป้าหมายคุณภาพ' : 'ยังไม่บรรลุเป้าหมาย'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {stats.isGoalMet
              ? `เกินเป้าหมาย +${(stats.overallScorePercent - campaign.targetGoalPercent).toFixed(1)}%`
              : `ขาดอีก ${(campaign.targetGoalPercent - stats.overallScorePercent).toFixed(1)}%`}
          </p>
        </div>

      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Overall Satisfaction Gauge & Rating Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600" />
            การกระจายตัวของระดับคะแนน (5 ระดับ)
          </h3>

          {/* Big Score Gauge representation */}
          <div className="flex items-center justify-center py-4">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#e2e8f0"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#0d9488"
                  strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - Math.min(stats.overallScorePercent, 100) / 100)}`}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-extrabold text-slate-900 font-['Prompt']">
                  {stats.overallScorePercent.toFixed(1)}%
                </span>
                <span className="text-[11px] font-medium text-teal-700">
                  ร้อยละความพึงพอใจ
                </span>
              </div>
            </div>
          </div>

          {/* Rating Distribution Breakdown */}
          <div className="space-y-2.5 mt-2">
            {stats.ratingDistribution.map((item) => (
              <div key={item.score} className="space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-1.5 font-medium">
                    <span className="w-4 text-slate-800 font-bold">{item.score}</span>
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{item.score === 5 ? 'มากที่สุด' : item.score === 4 ? 'มาก' : item.score === 3 ? 'ปานกลาง' : item.score === 2 ? 'น้อย' : 'น้อยที่สุด'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">{item.count} ครั้ง</span>
                    <span className="font-semibold text-slate-800 w-10 text-right">{item.percentage}%</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.score >= 4 ? 'bg-teal-500' : item.score === 3 ? 'bg-amber-400' : 'bg-rose-400'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Center: Department / Station Score Ranking */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Building className="w-4 h-4 text-teal-600" />
                คะแนนร้อยละจำแนกตามด้านการประเมินความพึงพอใจ
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                เปรียบเทียบคะแนนความพึงพอใจในแต่ละมิติของคุณภาพบริการตรวจสุขภาพ
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700">
              เป้าหมาย: {campaign.targetGoalPercent}%
            </span>
          </div>

          <div className="space-y-4 mt-4">
            {stats.stationStats.map((st, idx) => {
              const isAboveGoal = st.percentageScore >= campaign.targetGoalPercent;
              const dimMeta = STATION_INFO[st.station] || STATION_INFO[st.rawCategory || ''] || STATION_INFO['dimension_other'];
              const isCustom = st.station.startsWith('custom') || st.station === 'dimension_other' || !STATION_INFO[st.station];
              const barGradient = dimMeta?.barGradient || (isCustom ? 'from-fuchsia-500 to-pink-600' : (isAboveGoal ? 'from-teal-500 to-emerald-500' : 'from-amber-400 to-orange-500'));
              const badgeClass = isCustom 
                ? 'bg-fuchsia-50 text-fuchsia-800 border border-fuchsia-300 font-medium' 
                : (dimMeta?.badgeClass || 'bg-slate-100 text-slate-700');

              return (
                <div key={`st_${st.station}_${st.stationName}_${idx}`} className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-2.5 h-2.5 rounded-full shrink-0 ring-1 ring-slate-300" 
                        style={{ backgroundColor: dimMeta?.hex || (isCustom ? '#c026d3' : '#0d9488') }} 
                      />
                      <span className="text-xs sm:text-sm font-semibold text-slate-800">
                        {st.stationName}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded border ${badgeClass}`}>
                        {st.questionCount} คำถาม
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-slate-500">เฉลี่ย {st.avgScore.toFixed(2)}/5</span>
                      <span className={`text-sm sm:text-base font-bold ${isAboveGoal ? 'text-teal-700' : 'text-amber-600'}`}>
                        {st.percentageScore.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Station Progress Bar with Distinct Color & Target Marker */}
                  <div className="relative w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${barGradient}`}
                      style={{ width: `${Math.min(st.percentageScore, 100)}%` }}
                    />
                    {/* Goal Marker Line */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-slate-900 z-10"
                      style={{ left: `${campaign.targetGoalPercent}%` }}
                      title={`เกณฑ์เป้าหมาย ${campaign.targetGoalPercent}%`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* Demographic Breakdown: Occupations, Health Coverage, Visit History */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-teal-600" />
              สถิติกลุ่มประชากรผู้รับบริการ (Demographic Analysis)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              ข้อมูลจำแนกตามอายุเป็นตัวเลข, อาชีพ, สิทธิการรักษา และประวัติการรับบริการตรวจสุขภาพ
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
            รวม {relevantResponses.length} ท่าน
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. Age Demographics */}
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  <span>สถิติอายุผู้รับบริการ</span>
                </h4>
                {hasAgeData && (
                  <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 font-bold">
                    เฉลี่ย {avgAge?.toFixed(1)} ปี
                  </span>
                )}
              </div>

              {/* Age Summary Stats */}
              <div className="grid grid-cols-2 gap-2 mb-3 bg-white p-2 rounded-lg border border-slate-200/70 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 block">อายุเฉลี่ย</span>
                  <span className="text-xs font-bold text-amber-700">
                    {hasAgeData ? `${avgAge?.toFixed(1)} ปี` : 'ตามช่วงอายุ'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">ต่ำสุด - สูงสุด</span>
                  <span className="text-xs font-bold text-slate-800">
                    {minAge !== null && maxAge !== null ? `${minAge} - ${maxAge} ปี` : '-'}
                  </span>
                </div>
              </div>

              {/* Age Bracket Distribution */}
              <div className="space-y-2 text-xs">
                {ageGroupOrder.map((grp) => {
                  const count = ageGroupStats[grp] || 0;
                  const pct = Math.round((count / totalCount) * 100);
                  return (
                    <div key={grp} className="space-y-1">
                      <div className="flex justify-between text-slate-600">
                        <span className="truncate pr-1 font-medium">{grp}</span>
                        <span className="font-semibold text-slate-800 shrink-0">{count} ({pct}%)</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {/* 1. Occupation */}
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
            <h4 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-blue-600" />
              <span>จำแนกตามอาชีพ</span>
            </h4>
            <div className="space-y-2.5 text-xs">
              {Object.entries(occupationStats)
                .sort((a, b) => b[1] - a[1])
                .map(([occ, count]) => {
                  const pct = Math.round((count / totalCount) * 100);
                  return (
                    <div key={occ} className="space-y-1">
                      <div className="flex justify-between text-slate-600">
                        <span className="truncate pr-1 font-medium">{occ}</span>
                        <span className="font-semibold text-slate-800 shrink-0">{count} ({pct}%)</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* 2. Health Coverage */}
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
            <h4 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-teal-600" />
              <span>จำแนกตามสิทธิการรักษา</span>
            </h4>
            <div className="space-y-2.5 text-xs">
              {Object.entries(coverageStats)
                .sort((a, b) => b[1] - a[1])
                .map(([cov, count]) => {
                  const pct = Math.round((count / totalCount) * 100);
                  return (
                    <div key={cov} className="space-y-1">
                      <div className="flex justify-between text-slate-600">
                        <span className="truncate pr-1 font-medium">{cov}</span>
                        <span className="font-semibold text-slate-800 shrink-0">{count} ({pct}%)</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* 3. Visit History */}
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
            <h4 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-purple-600" />
              <span>ประวัติการรับบริการ</span>
            </h4>
            <div className="space-y-2.5 text-xs">
              {Object.entries(historyStats)
                .sort((a, b) => b[1] - a[1])
                .map(([hist, count]) => {
                  const pct = Math.round((count / totalCount) * 100);
                  return (
                    <div key={hist} className="space-y-1">
                      <div className="flex justify-between text-slate-600">
                        <span className="truncate pr-1 font-medium">{hist}</span>
                        <span className="font-semibold text-slate-800 shrink-0">{count} ({pct}%)</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      {/* Question by Question Detailed Table / Ranking */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-600" />
              สรุปผลคะแนนและร้อยละรายข้อคำถาม (Question-Level Breakdown)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              วิเคราะห์จุดเด่นและจุดที่ควรปรับปรุงเพื่อพัฒนาบริการตรวจสุขภาพ
            </p>
          </div>
          <div className="text-xs text-slate-500">
            แสดง {filteredQuestionStats.length} ข้อคำถาม
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-y border-slate-200">
              <tr>
                <th className="py-3 px-3 w-10 text-center">#</th>
                <th className="py-3 px-3">ข้อคำถามแบบประเมิน</th>
                <th className="py-3 px-3">ด้านการประเมิน</th>
                <th className="py-3 px-3 text-center">ผู้ตอบ</th>
                <th className="py-3 px-3 text-center">คะแนนเฉลี่ย</th>
                <th className="py-3 px-3 text-right">คะแนนร้อยละ (%)</th>
                <th className="py-3 px-3 w-36">กราฟร้อยละ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredQuestionStats.map((item, idx) => {
                const isScored = item.question.type !== 'text';
                const isCustom = item.question.category === 'dimension_other' || Boolean(item.question.customCategoryName) || !STATION_INFO[item.question.category];
                const dimName = item.question.customCategoryName || STATION_INFO[item.question.category]?.nameTh || item.question.category;
                const dimMeta = STATION_INFO[item.question.category];
                const badgeClass = isCustom 
                  ? 'bg-fuchsia-50 text-fuchsia-800 border border-fuchsia-300 font-medium' 
                  : (dimMeta?.badgeClass || 'bg-slate-100 text-slate-700 font-medium');
                const barGradient = dimMeta?.barGradient || (isCustom ? 'from-fuchsia-500 to-pink-600' : 'from-teal-500 to-emerald-500');
                const isAbove = item.percentageScore >= campaign.targetGoalPercent;

                return (
                  <tr key={`qstat_${item.question.id}_${idx}`} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-3 text-center font-bold text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="py-3.5 px-3">
                      <p className="font-medium text-slate-900">
                        {item.question.text}
                      </p>
                      {item.question.description && (
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {item.question.description}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold ${badgeClass}`}>
                        {dimName}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center text-slate-600">
                      {item.responseCount}
                    </td>
                    <td className="py-3.5 px-3 text-center font-semibold text-slate-800">
                      {isScored ? `${item.avgScore.toFixed(2)}/5` : '-'}
                    </td>
                    <td className="py-3.5 px-3 text-right font-bold whitespace-nowrap">
                      {isScored ? (
                        <span className={isAbove ? 'text-teal-700' : 'text-amber-600'}>
                          {item.percentageScore.toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-slate-400">ข้อความ</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3">
                      {isScored ? (
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${barGradient}`}
                            style={{ width: `${Math.min(item.percentageScore, 100)}%` }}
                          />
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">คำถามปลายเปิด</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Qualitative Feedback & Suggestions */}
      {stats.recentComments.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-teal-600" />
              ข้อเสนอแนะและเสียงสะท้อนจากผู้รับบริการ (Voice of Customer)
            </h3>
            <span className="text-xs text-slate-500">
              ทั้งหมด {stats.recentComments.length} ข้อความ
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {stats.recentComments.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:shadow-xs transition"
              >
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>{new Date(item.submittedAt).toLocaleDateString('th-TH', { dateStyle: 'medium' })}</span>
                  <span className="font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    ให้คะแนน {item.overallScorePercent.toFixed(0)}%
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                  "{item.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

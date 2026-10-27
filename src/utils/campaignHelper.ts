import { Campaign } from '../types';

export interface CampaignStatusCheck {
  isOpen: boolean;
  statusLabel: string;
  badgeClass: string;
  dotClass: string;
  reason?: string;
}

export interface CampaignTheme {
  id: string;
  name: string;
  primaryColor: string; // e.g. 'emerald', 'blue', 'amber', 'purple', 'rose', 'teal'
  hex: string;
  badgeBg: string;
  iconBg: string;
  iconText: string;
  borderHover: string;
  cardBorder: string;          // Distinct border color for card
  cardBgGradient: string;      // Distinctive, vibrant background gradient for the card
  cardGlow: string;            // Ambient corner glow
  cardTopStripe: string;       // Colored top accent bar for the card
  pageBgGradient: string;      // Full background for the survey page
  pageAmbientGlow1: string;     // First glowing ambient backdrop orb
  pageAmbientGlow2: string;     // Second glowing ambient backdrop orb
  accentTextColor: string;     // Text color for category/department highlights
  accentIconColor: string;     // Icon color for accents
  periodBg: string;            // Background for the scheduled period pill
  btnBg: string;
  progressGradient: string;
  bannerGradient: string;
  tagClass: string;
  chipClass: string;
}

export const CAMPAIGN_THEMES: CampaignTheme[] = [
  {
    id: 'emerald',
    name: 'มรกต-ทอง (ตรวจสุขภาพประจำปี)',
    primaryColor: 'emerald',
    hex: '#059669',
    badgeBg: 'bg-emerald-100/90 text-emerald-900 border-emerald-300 font-bold',
    iconBg: 'bg-gradient-to-br from-emerald-100 to-teal-100 border-emerald-300 text-emerald-800',
    iconText: 'text-emerald-700',
    borderHover: 'hover:border-emerald-500 group-hover:text-emerald-950',
    cardBorder: 'border-2 border-emerald-200/90 hover:border-emerald-500 shadow-md shadow-emerald-700/5 hover:shadow-xl hover:shadow-emerald-700/15',
    cardBgGradient: 'from-emerald-50 via-teal-50/50 to-white',
    cardGlow: 'bg-emerald-400/25',
    cardTopStripe: 'bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700',
    pageBgGradient: 'bg-gradient-to-b from-emerald-100/70 via-teal-50/40 to-slate-50',
    pageAmbientGlow1: 'bg-emerald-300/25',
    pageAmbientGlow2: 'bg-teal-300/20',
    accentTextColor: 'text-emerald-800',
    accentIconColor: 'text-emerald-600',
    periodBg: 'bg-emerald-50/90 border-emerald-200 text-emerald-900',
    btnBg: 'bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 hover:from-emerald-800 hover:to-teal-800 focus:ring-emerald-500 shadow-emerald-700/30',
    progressGradient: 'from-emerald-600 to-teal-600',
    bannerGradient: 'from-emerald-900 via-teal-900 to-emerald-950',
    tagClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    chipClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold',
  },
  {
    id: 'blue',
    name: 'น้ำเงินคราม-ฟ้าสว่าง (หน่วยเคลื่อนที่)',
    primaryColor: 'blue',
    hex: '#2563eb',
    badgeBg: 'bg-blue-100/90 text-blue-900 border-blue-300 font-bold',
    iconBg: 'bg-gradient-to-br from-blue-100 to-sky-100 border-blue-300 text-blue-800',
    iconText: 'text-blue-700',
    borderHover: 'hover:border-blue-500 group-hover:text-blue-950',
    cardBorder: 'border-2 border-blue-200/90 hover:border-blue-500 shadow-md shadow-blue-700/5 hover:shadow-xl hover:shadow-blue-700/15',
    cardBgGradient: 'from-blue-50 via-sky-50/50 to-white',
    cardGlow: 'bg-blue-400/25',
    cardTopStripe: 'bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-700',
    pageBgGradient: 'bg-gradient-to-b from-blue-100/70 via-sky-50/40 to-slate-50',
    pageAmbientGlow1: 'bg-blue-300/25',
    pageAmbientGlow2: 'bg-sky-300/20',
    accentTextColor: 'text-blue-800',
    accentIconColor: 'text-blue-600',
    periodBg: 'bg-blue-50/90 border-blue-200 text-blue-900',
    btnBg: 'bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 hover:from-blue-800 hover:to-indigo-800 focus:ring-blue-500 shadow-blue-700/30',
    progressGradient: 'from-blue-600 to-sky-600',
    bannerGradient: 'from-blue-950 via-slate-900 to-indigo-950',
    tagClass: 'bg-blue-100 text-blue-900 border-blue-300',
    chipClass: 'bg-blue-100 text-blue-800 border-blue-300 font-semibold',
  },
  {
    id: 'amber',
    name: 'ทองอำพัน-บรอนซ์ (ก่อนเข้าทำงาน/ใบรับรองแพทย์)',
    primaryColor: 'amber',
    hex: '#d97706',
    badgeBg: 'bg-amber-100/90 text-amber-950 border-amber-300 font-bold',
    iconBg: 'bg-gradient-to-br from-amber-100 to-orange-100 border-amber-300 text-amber-900',
    iconText: 'text-amber-700',
    borderHover: 'hover:border-amber-500 group-hover:text-amber-950',
    cardBorder: 'border-2 border-amber-200/90 hover:border-amber-500 shadow-md shadow-amber-700/5 hover:shadow-xl hover:shadow-amber-700/15',
    cardBgGradient: 'from-amber-50 via-orange-50/50 to-white',
    cardGlow: 'bg-amber-400/25',
    cardTopStripe: 'bg-gradient-to-r from-amber-600 via-orange-500 to-yellow-600',
    pageBgGradient: 'bg-gradient-to-b from-amber-100/70 via-orange-50/40 to-slate-50',
    pageAmbientGlow1: 'bg-amber-300/25',
    pageAmbientGlow2: 'bg-orange-300/20',
    accentTextColor: 'text-amber-900',
    accentIconColor: 'text-amber-600',
    periodBg: 'bg-amber-50/90 border-amber-200 text-amber-950',
    btnBg: 'bg-gradient-to-r from-amber-700 via-orange-700 to-amber-800 hover:from-amber-800 hover:to-orange-800 focus:ring-amber-500 shadow-amber-700/30',
    progressGradient: 'from-amber-500 to-orange-500',
    bannerGradient: 'from-slate-950 via-amber-950 to-stone-900',
    tagClass: 'bg-amber-100 text-amber-900 border-amber-300',
    chipClass: 'bg-amber-100 text-amber-900 border-amber-300 font-semibold',
  },
  {
    id: 'purple',
    name: 'อเมทิสต์-ม่วงสง่างาม (คัดกรองพิเศษ/เฉพาะทาง)',
    primaryColor: 'purple',
    hex: '#7c3aed',
    badgeBg: 'bg-purple-100/90 text-purple-900 border-purple-300 font-bold',
    iconBg: 'bg-gradient-to-br from-purple-100 to-violet-100 border-purple-300 text-purple-800',
    iconText: 'text-purple-700',
    borderHover: 'hover:border-purple-500 group-hover:text-purple-950',
    cardBorder: 'border-2 border-purple-200/90 hover:border-purple-500 shadow-md shadow-purple-700/5 hover:shadow-xl hover:shadow-purple-700/15',
    cardBgGradient: 'from-purple-50 via-violet-50/50 to-white',
    cardGlow: 'bg-purple-400/25',
    cardTopStripe: 'bg-gradient-to-r from-purple-600 via-violet-500 to-fuchsia-600',
    pageBgGradient: 'bg-gradient-to-b from-purple-100/70 via-violet-50/40 to-slate-50',
    pageAmbientGlow1: 'bg-purple-300/25',
    pageAmbientGlow2: 'bg-violet-300/20',
    accentTextColor: 'text-purple-800',
    accentIconColor: 'text-purple-600',
    periodBg: 'bg-purple-50/90 border-purple-200 text-purple-900',
    btnBg: 'bg-gradient-to-r from-purple-700 via-violet-700 to-purple-800 hover:from-purple-800 hover:to-violet-800 focus:ring-purple-500 shadow-purple-700/30',
    progressGradient: 'from-purple-600 to-violet-600',
    bannerGradient: 'from-slate-950 via-purple-950 to-violet-950',
    tagClass: 'bg-purple-100 text-purple-900 border-purple-300',
    chipClass: 'bg-purple-100 text-purple-800 border-purple-300 font-semibold',
  },
  {
    id: 'rose',
    name: 'ทับทิม-คอรัล (สุขภาพชุมชน/กลุ่มเสี่ยง)',
    primaryColor: 'rose',
    hex: '#e11d48',
    badgeBg: 'bg-rose-100/90 text-rose-900 border-rose-300 font-bold',
    iconBg: 'bg-gradient-to-br from-rose-100 to-pink-100 border-rose-300 text-rose-800',
    iconText: 'text-rose-700',
    borderHover: 'hover:border-rose-500 group-hover:text-rose-950',
    cardBorder: 'border-2 border-rose-200/90 hover:border-rose-500 shadow-md shadow-rose-700/5 hover:shadow-xl hover:shadow-rose-700/15',
    cardBgGradient: 'from-rose-50 via-pink-50/50 to-white',
    cardGlow: 'bg-rose-400/25',
    cardTopStripe: 'bg-gradient-to-r from-rose-600 via-pink-500 to-red-600',
    pageBgGradient: 'bg-gradient-to-b from-rose-100/70 via-pink-50/40 to-slate-50',
    pageAmbientGlow1: 'bg-rose-300/25',
    pageAmbientGlow2: 'bg-pink-300/20',
    accentTextColor: 'text-rose-800',
    accentIconColor: 'text-rose-600',
    periodBg: 'bg-rose-50/90 border-rose-200 text-rose-900',
    btnBg: 'bg-gradient-to-r from-rose-700 via-pink-700 to-rose-800 hover:from-rose-800 hover:to-pink-800 focus:ring-rose-500 shadow-rose-700/30',
    progressGradient: 'from-rose-500 to-pink-500',
    bannerGradient: 'from-slate-950 via-rose-950 to-stone-900',
    tagClass: 'bg-rose-100 text-rose-900 border-rose-300',
    chipClass: 'bg-rose-100 text-rose-800 border-rose-300 font-semibold',
  },
  {
    id: 'teal',
    name: 'เขียวหัวเป็ด-เทอร์ควอยซ์ (บริการทั่วไป)',
    primaryColor: 'teal',
    hex: '#0d9488',
    badgeBg: 'bg-teal-100/90 text-teal-900 border-teal-300 font-bold',
    iconBg: 'bg-gradient-to-br from-teal-100 to-cyan-100 border-teal-300 text-teal-800',
    iconText: 'text-teal-700',
    borderHover: 'hover:border-teal-500 group-hover:text-teal-950',
    cardBorder: 'border-2 border-teal-200/90 hover:border-teal-500 shadow-md shadow-teal-700/5 hover:shadow-xl hover:shadow-teal-700/15',
    cardBgGradient: 'from-teal-50 via-cyan-50/50 to-white',
    cardGlow: 'bg-teal-400/25',
    cardTopStripe: 'bg-gradient-to-r from-teal-600 via-cyan-500 to-emerald-700',
    pageBgGradient: 'bg-gradient-to-b from-teal-100/70 via-cyan-50/40 to-slate-50',
    pageAmbientGlow1: 'bg-teal-300/25',
    pageAmbientGlow2: 'bg-cyan-300/20',
    accentTextColor: 'text-teal-800',
    accentIconColor: 'text-teal-600',
    periodBg: 'bg-teal-50/90 border-teal-200 text-teal-900',
    btnBg: 'bg-gradient-to-r from-teal-700 via-cyan-700 to-teal-800 hover:from-teal-800 hover:to-cyan-800 focus:ring-teal-500 shadow-teal-700/30',
    progressGradient: 'from-teal-600 to-cyan-600',
    bannerGradient: 'from-slate-950 via-teal-950 to-slate-900',
    tagClass: 'bg-teal-100 text-teal-900 border-teal-300',
    chipClass: 'bg-teal-100 text-teal-800 border-teal-300 font-semibold',
  },
];

/**
 * Returns a distinct, deterministic color theme for any campaign/activity
 * so patients and staff can immediately distinguish each activity.
 */
export function getCampaignTheme(campaign?: Campaign | null, fallbackIndex: number = 0): CampaignTheme {
  if (!campaign) return CAMPAIGN_THEMES[0];

  const code = (campaign.code || '').toUpperCase();
  const title = campaign.title || '';

  // 1. Check by typical keywords
  if (code.includes('ANNUAL') || title.includes('ประจำปี')) {
    return CAMPAIGN_THEMES[0]; // Emerald
  }
  if (code.includes('MOBILE') || title.includes('เคลื่อนที่') || title.includes('เชิงรุก')) {
    return CAMPAIGN_THEMES[1]; // Royal Blue
  }
  if (code.includes('PRE') || title.includes('เข้าทำงาน') || title.includes('ใบรับรองแพทย์')) {
    return CAMPAIGN_THEMES[2]; // Amber
  }
  if (title.includes('ผู้บริหาร') || title.includes('พิเศษ') || title.includes('คัดกรองความเสี่ยง')) {
    return CAMPAIGN_THEMES[3]; // Purple
  }
  if (title.includes('ชุมชน') || title.includes('สิทธิบัตรทอง') || title.includes('ประกันสังคม')) {
    return CAMPAIGN_THEMES[4]; // Rose
  }

  // 2. Hash ID/Code to distribute custom campaigns across distinct themes
  const hashStr = campaign.id + campaign.code + campaign.title;
  let hash = 0;
  for (let i = 0; i < hashStr.length; i++) {
    hash = (hash << 5) - hash + hashStr.charCodeAt(i);
    hash |= 0;
  }
  const themeIndex = Math.abs(hash + fallbackIndex) % CAMPAIGN_THEMES.length;
  return CAMPAIGN_THEMES[themeIndex];
}

/**
 * Formats a YYYY-MM-DD date string to Thai readable format (e.g. 25 ต.ค. 2569)
 */
export function formatThaiDate(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);

    const THAI_MONTHS = [
      '', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];

    const thaiYear = year > 2500 ? year : year + 543;
    return `${day} ${THAI_MONTHS[month] || ''} ${thaiYear}`;
  } catch {
    return dateStr;
  }
}

/**
 * Checks if a campaign is currently open for respondents based on:
 * 1. Manual status toggle ('active' vs 'paused' / 'archived')
 * 2. Scheduled date period (startDate to endDate)
 */
export function checkCampaignStatus(campaign: Campaign): CampaignStatusCheck {
  if (campaign.status === 'paused') {
    return {
      isOpen: false,
      statusLabel: 'ปิดระบบใช้งาน',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
      dotClass: 'bg-rose-500',
      reason: 'กิจกรรมนี้ปิดระบบรับการประเมินชั่วคราวโดยเจ้าหน้าที่',
    };
  }

  if (campaign.status === 'archived') {
    return {
      isOpen: false,
      statusLabel: 'สิ้นสุดโครงการ',
      badgeClass: 'bg-slate-100 text-slate-600 border-slate-300',
      dotClass: 'bg-slate-400',
      reason: 'โครงการตรวจสุขภาพนี้สิ้นสุดระยะเวลาดำเนินการแล้ว',
    };
  }

  // Check scheduled dates
  if (campaign.startDate && campaign.endDate) {
    const today = new Date().toISOString().split('T')[0];
    if (today < campaign.startDate) {
      return {
        isOpen: false,
        statusLabel: 'ยังไม่ถึงกำหนดเปิดรับ',
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-300',
        dotClass: 'bg-amber-500',
        reason: `จะเปิดรับแบบประเมินตั้งแต่วันที่ ${formatThaiDate(campaign.startDate)} เป็นต้นไป`,
      };
    }
    if (today > campaign.endDate) {
      return {
        isOpen: false,
        statusLabel: 'หมดเวลารับการประเมิน',
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
        dotClass: 'bg-slate-500',
        reason: `สิ้นสุดระยะเวลารับแบบประเมินเมื่อวันที่ ${formatThaiDate(campaign.endDate)}`,
      };
    }
  }

  return {
    isOpen: true,
    statusLabel: 'เปิดรับการประเมิน',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300/80',
    dotClass: 'bg-emerald-500',
  };
}

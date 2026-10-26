import { Campaign } from '../types';

export interface CampaignStatusCheck {
  isOpen: boolean;
  statusLabel: string;
  badgeClass: string;
  dotClass: string;
  reason?: string;
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

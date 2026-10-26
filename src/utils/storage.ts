import { Campaign, Question, ScoringCriterion, SurveySubmission } from '../types';
import { INITIAL_CAMPAIGNS, INITIAL_RESPONSES } from '../data/initialData';

const STORAGE_KEYS = {
  CAMPAIGNS: 'voc_checkup_campaigns_v4',
  ACTIVE_CAMPAIGN_ID: 'voc_checkup_active_camp_id_v4',
  RESPONSES: 'voc_checkup_responses_v4',
  STAFF_AUTH: 'voc_checkup_staff_session_v1',
};

export const STAFF_PASSWORD = 'voccheckup';

const migrateCategoryToDimension = (cat: string): any => {
  switch (cat) {
    case 'registration':
    case 'speed':
    case 'xray':
      return 'dimension_process_time';
    case 'lab_blood':
    case 'doctor':
      return 'dimension_staff';
    case 'place_facility':
      return 'dimension_facility';
    case 'general':
      return 'dimension_overall';
    default:
      return cat;
  }
};

export const getStoredCampaigns = (): Campaign[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CAMPAIGNS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(INITIAL_CAMPAIGNS));
      return INITIAL_CAMPAIGNS;
    }
    const parsed: Campaign[] = JSON.parse(raw);
    const migrated = parsed.map(c => ({
      ...c,
      questions: c.questions.map(q => ({
        ...q,
        category: migrateCategoryToDimension(q.category),
      })),
    }));
    return migrated;
  } catch (err) {
    console.error('Failed to load campaigns from storage', err);
    return INITIAL_CAMPAIGNS;
  }
};

export const saveStoredCampaigns = (campaigns: Campaign[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
  } catch (err) {
    console.error('Failed to save campaigns to storage', err);
  }
};

export const getStoredActiveCampaignId = (): string => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_CAMPAIGN_ID);
    if (raw) return raw;
    const campaigns = getStoredCampaigns();
    const active = campaigns.find(c => c.status === 'active') || campaigns[0];
    if (active) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_CAMPAIGN_ID, active.id);
      return active.id;
    }
  } catch (err) {
    console.error(err);
  }
  return INITIAL_CAMPAIGNS[0].id;
};

export const setStoredActiveCampaignId = (id: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_CAMPAIGN_ID, id);
  } catch (err) {
    console.error(err);
  }
};

export const getStoredResponses = (): SurveySubmission[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RESPONSES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.RESPONSES, JSON.stringify(INITIAL_RESPONSES));
      return INITIAL_RESPONSES;
    }
    const parsed: SurveySubmission[] = JSON.parse(raw);
    return parsed.map((item, idx) => ({
      ...item,
      demographics: {
        gender: item.demographics?.gender || 'ไม่ระบุ',
        ageRange: item.demographics?.ageRange || '20 - 35 ปี',
        occupation: item.demographics?.occupation || 'อาจารย์/พนักงานมหาวิทยาลัยอุบล',
        coverage: item.demographics?.coverage || 'ข้าราชการ/กรมบัญชีกลาง',
        visitHistory: item.demographics?.visitHistory || (idx % 2 === 0 ? 'รับบริการตรวจสุขภาพมากกว่า 1 ครั้ง' : 'มารับบริการครั้งแรก'),
        serviceType: item.demographics?.serviceType || 'ตรวจสุขภาพประจำปี',
      },
    }));
  } catch (err) {
    console.error('Failed to load responses from storage', err);
    return INITIAL_RESPONSES;
  }
};

export const saveStoredResponses = (responses: SurveySubmission[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.RESPONSES, JSON.stringify(responses));
  } catch (err) {
    console.error('Failed to save responses to storage', err);
  }
};

export const addStoredSubmission = (submission: SurveySubmission): void => {
  const current = getStoredResponses();
  const updated = [submission, ...current];
  saveStoredResponses(updated);
};

export const isStaffAuthenticated = (): boolean => {
  try {
    return sessionStorage.getItem(STORAGE_KEYS.STAFF_AUTH) === 'true';
  } catch {
    return false;
  }
};

export const setStaffAuthenticated = (isAuth: boolean): void => {
  try {
    if (isAuth) {
      sessionStorage.setItem(STORAGE_KEYS.STAFF_AUTH, 'true');
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.STAFF_AUTH);
    }
  } catch (err) {
    console.error(err);
  }
};

export const resetAllDataToDefault = (): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(INITIAL_CAMPAIGNS));
    localStorage.setItem(STORAGE_KEYS.RESPONSES, JSON.stringify(INITIAL_RESPONSES));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_CAMPAIGN_ID, INITIAL_CAMPAIGNS[0].id);
  } catch (err) {
    console.error(err);
  }
};

export type QuestionType = 
  | 'rating5' 
  | 'smiley5' 
  | 'yesno' 
  | 'recommend_intent'    // ตั้งใจแนะนำ / ไม่ตั้งใจแนะนำ
  | 'return_intent'       // ตั้งใจกลับมาใช้บริการ / ไม่ตั้งใจกลับมาใช้บริการ
  | 'choice' 
  | 'text';

export type ServiceDimension = 
  | 'dimension_staff'              // ด้านที่ 1: การให้บริการของเจ้าหน้าที่ (หน้างาน)
  | 'dimension_process_time'       // ด้านที่ 2: ระบบขั้นตอนและระยะเวลาการให้บริการ
  | 'dimension_facility'           // ด้านที่ 3: สถานที่และสิ่งอำนวยความสะดวก
  | 'dimension_result_followup'    // ด้านที่ 4: ระบบแจ้งผลและการติดตามดูแลต่อเนื่อง
  | 'dimension_overall'            // ด้านที่ 5: ความพึงพอใจโดยรวม
  | 'dimension_loyalty_recommend'  // ด้านความตั้งใจใช้บริการและบอกต่อ
  | 'dimension_feedback_suggestion' // ด้านข้อคิดเห็นและข้อเสนอแนะ
  | 'dimension_other'              // ด้านอื่นๆ (ระบุด้านด้วยตนเอง)
  | string;

export type ServiceStation = ServiceDimension;

export interface Question {
  id: string;
  text: string;
  category: ServiceStation;
  customCategoryName?: string; // ชื่อด้านการประเมินที่กำหนดเองเมื่อเลือก dimension_other
  type: QuestionType;
  required: boolean;
  order: number;
  options?: string[]; // for 'choice' type
  description?: string;
}

export interface ScoringCriterion {
  id: string;
  minScorePercent: number; // e.g. 90
  maxScorePercent: number; // e.g. 100
  label: string; // e.g. "ดีเยี่ยม (Excellent)"
  color: string; // e.g. "#10b981"
  badgeClass: string;
  description: string;
}

export interface Campaign {
  id: string;
  title: string;
  code: string;
  subtitle: string;
  targetUnit: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'paused' | 'archived';
  description: string;
  targetGoalPercent: number; // e.g. 85%
  scoringScaleMax: number; // default 5
  criteria: ScoringCriterion[];
  questions: Question[];
  welcomeMessage?: string;
  thankYouMessage?: string;
  createdAt: string;
}

export type OccupationType = 
  | 'ข้าราชการ/พนักงานรัฐ'
  | 'อาจารย์/พนักงานมหาวิทยาลัยอุบล'
  | 'รัฐวิสาหกิจ'
  | 'พนักงานเอกชน'
  | 'ธุรกิจส่วนตัว/ค้าขาย'
  | 'นักเรียน/นักศึกษา'
  | 'อื่นๆ';

export type HealthCoverageType =
  | 'ข้าราชการ/กรมบัญชีกลาง'
  | 'อปท'
  | 'รัฐวิสาหกิจ'
  | 'ประกันสังคม'
  | 'หลักประกันสุขภาพแห่งชาติ(บัตรทอง)'
  | 'สปสช'
  | 'ชำระเงินเอง'
  | 'อื่นๆ';

export type VisitHistoryType = 
  | 'รับบริการตรวจสุขภาพมากกว่า 1 ครั้ง'
  | 'มารับบริการครั้งแรก';

export interface RespondentDemographics {
  gender?: 'ชาย' | 'หญิง' | 'ไม่ระบุ';
  ageRange?: 'ต่ำกว่า 20 ปี' | '20 - 35 ปี' | '36 - 50 ปี' | '51 - 60 ปี' | 'มากกว่า 60 ปี';
  occupation?: OccupationType | string;
  coverage?: HealthCoverageType | string;
  visitHistory?: VisitHistoryType | string;
  serviceType?: 'ตรวจสุขภาพประจำปี' | 'ตรวจสุขภาพก่อนเข้าทำงาน' | 'ตรวจคัดกรองความเสี่ยง' | 'ตรวจสุขภาพสิทธิบัตรทอง/ปกส.' | 'อื่นๆ';
}

export interface SurveySubmission {
  id: string;
  campaignId: string;
  submittedAt: string; // ISO date
  demographics?: RespondentDemographics;
  answers: Record<string, number | string>; // questionId -> value (1-5 or text)
  overallScorePercent: number; // calculated %
  comment?: string;
}

export interface StationStats {
  station: ServiceStation;
  stationName: string;
  avgScore: number;
  percentScore: number;
  questionCount: number;
  totalResponses: number;
}

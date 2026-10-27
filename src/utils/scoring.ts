import { Campaign, Question, ScoringCriterion, ServiceStation, SurveySubmission } from '../types';
import { STATION_INFO } from '../data/initialData';

export interface QuestionStat {
  question: Question;
  responseCount: number;
  avgScore: number;
  percentageScore: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  textResponses?: string[];
}

export interface CampaignSummaryStats {
  campaignId: string;
  totalRespondents: number;
  overallScorePercent: number;
  overallAvgScore: number;
  ratingCriterion: ScoringCriterion | null;
  targetGoalPercent: number;
  isGoalMet: boolean;
  questionStats: QuestionStat[];
  stationStats: {
    station: ServiceStation;
    stationName: string;
    avgScore: number;
    percentageScore: number;
    color: string;
    questionCount: number;
  }[];
  ratingDistribution: {
    score: number;
    count: number;
    percentage: number;
  }[];
  recentComments: {
    id: string;
    submittedAt: string;
    comment: string;
    overallScorePercent: number;
  }[];
  dateTrends: {
    date: string;
    count: number;
    avgPercent: number;
  }[];
}

export const getCriterionForPercent = (
  percent: number,
  criteria: ScoringCriterion[]
): ScoringCriterion | null => {
  if (!criteria || criteria.length === 0) return null;
  const sorted = [...criteria].sort((a, b) => b.minScorePercent - a.minScorePercent);
  for (const crit of sorted) {
    if (percent >= crit.minScorePercent) {
      return crit;
    }
  }
  return sorted[sorted.length - 1] || null;
};

export const calculateCampaignStats = (
  campaign: Campaign,
  allResponses: SurveySubmission[],
  filterDateFrom?: string,
  filterDateTo?: string
): CampaignSummaryStats => {
  let responses = allResponses.filter(r => r.campaignId === campaign.id);

  if (filterDateFrom) {
    responses = responses.filter(r => new Date(r.submittedAt) >= new Date(filterDateFrom));
  }
  if (filterDateTo) {
    const toDate = new Date(filterDateTo);
    toDate.setHours(23, 59, 59, 999);
    responses = responses.filter(r => new Date(r.submittedAt) <= toDate);
  }

  const totalRespondents = responses.length;
  const scaleMax = campaign.scoringScaleMax || 5;

  const scoreQuestions = campaign.questions.filter(
    q => q.type === 'rating5' || q.type === 'smiley5' || q.type === 'yesno' || q.type === 'recommend_intent' || q.type === 'return_intent'
  );

  const questionStats: QuestionStat[] = campaign.questions.map(q => {
    const isScored = q.type === 'rating5' || q.type === 'smiley5' || q.type === 'yesno' || q.type === 'recommend_intent' || q.type === 'return_intent';
    const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;
    let count = 0;
    const textResponses: string[] = [];

    responses.forEach(resp => {
      const val = resp.answers[q.id];
      if (val !== undefined && val !== null && val !== '') {
        if (isScored) {
          const numVal = Number(val);
          if (!isNaN(numVal) && numVal >= 1 && numVal <= 5) {
            sum += numVal;
            count += 1;
            const floored = Math.round(numVal) as 1 | 2 | 3 | 4 | 5;
            if (dist[floored] !== undefined) {
              dist[floored] += 1;
            }
          }
        } else {
          textResponses.push(String(val));
        }
      }
    });

    const avgScore = count > 0 ? Number((sum / count).toFixed(2)) : 0;
    const percentageScore = count > 0 ? Number(((avgScore / scaleMax) * 100).toFixed(2)) : 0;

    return {
      question: q,
      responseCount: count || textResponses.length,
      avgScore,
      percentageScore,
      distribution: dist,
      textResponses: textResponses.length > 0 ? textResponses : undefined,
    };
  });

  // Calculate Overall
  let overallSumScores = 0;
  let overallCountScores = 0;
  const totalRatingDist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  responses.forEach(resp => {
    scoreQuestions.forEach(q => {
      const val = resp.answers[q.id];
      if (val !== undefined && val !== null && !isNaN(Number(val))) {
        const num = Number(val);
        overallSumScores += num;
        overallCountScores += 1;
        const rounded = Math.round(num);
        if (totalRatingDist[rounded] !== undefined) {
          totalRatingDist[rounded] += 1;
        }
      }
    });
  });

  const overallAvgScore = overallCountScores > 0 ? Number((overallSumScores / overallCountScores).toFixed(2)) : 0;
  const overallScorePercent = overallCountScores > 0 ? Number(((overallAvgScore / scaleMax) * 100).toFixed(2)) : 0;

  const ratingCriterion = getCriterionForPercent(overallScorePercent, campaign.criteria);
  const isGoalMet = overallScorePercent >= campaign.targetGoalPercent;

  // Station breakdown (support custom dimension names)
  const getStationKey = (q: Question) => {
    if ((q.category === 'dimension_other' || !STATION_INFO[q.category]) && q.customCategoryName) {
      return `custom_${q.customCategoryName}`;
    }
    return q.category;
  };

  const getStationDisplayName = (q: Question) => {
    if (q.customCategoryName) {
      return q.customCategoryName;
    }
    return STATION_INFO[q.category]?.nameTh || q.category;
  };

  const stationKeys = Array.from(new Set(scoreQuestions.map(getStationKey)));
  const stationStats = stationKeys.map(key => {
    const stQuestions = scoreQuestions.filter(q => getStationKey(q) === key);
    let stSum = 0;
    let stCount = 0;

    responses.forEach(resp => {
      stQuestions.forEach(q => {
        const val = resp.answers[q.id];
        if (val !== undefined && !isNaN(Number(val))) {
          stSum += Number(val);
          stCount += 1;
        }
      });
    });

    const avg = stCount > 0 ? Number((stSum / stCount).toFixed(2)) : 0;
    const percent = stCount > 0 ? Number(((avg / scaleMax) * 100).toFixed(2)) : 0;
    const sampleQ = stQuestions[0];
    const stationName = getStationDisplayName(sampleQ);
    const info = STATION_INFO[sampleQ.category] || { nameTh: stationName, color: 'indigo' };

    return {
      station: (key.startsWith('custom_') ? 'dimension_other' : key) as ServiceStation,
      stationName,
      avgScore: avg,
      percentageScore: percent,
      color: info.color || 'indigo',
      questionCount: stQuestions.length,
    };
  }).sort((a, b) => b.percentageScore - a.percentageScore);

  // Overall distribution array
  const ratingDistribution = [5, 4, 3, 2, 1].map(score => {
    const count = totalRatingDist[score] || 0;
    const percentage = overallCountScores > 0 ? Number(((count / overallCountScores) * 100).toFixed(1)) : 0;
    return { score, count, percentage };
  });

  // Recent comments
  const recentComments: {
    id: string;
    submittedAt: string;
    comment: string;
    overallScorePercent: number;
  }[] = [];

  responses.forEach(resp => {
    let commentText = resp.comment || '';
    if (!commentText) {
      // check text questions
      campaign.questions.forEach(q => {
        if (q.type === 'text' && resp.answers[q.id]) {
          commentText = String(resp.answers[q.id]);
        }
      });
    }
    if (commentText.trim()) {
      recentComments.push({
        id: resp.id,
        submittedAt: resp.submittedAt,
        comment: commentText.trim(),
        overallScorePercent: resp.overallScorePercent || 0,
      });
    }
  });

  // Date Trends (by day)
  const dateGroups: Record<string, { count: number; sumPercent: number }> = {};
  responses.forEach(resp => {
    const day = resp.submittedAt.split('T')[0] || 'Unknown';
    if (!dateGroups[day]) {
      dateGroups[day] = { count: 0, sumPercent: 0 };
    }
    dateGroups[day].count += 1;
    dateGroups[day].sumPercent += resp.overallScorePercent || 0;
  });

  const dateTrends = Object.entries(dateGroups)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .slice(-10)
    .map(([date, data]) => ({
      date,
      count: data.count,
      avgPercent: Number((data.sumPercent / data.count).toFixed(1)),
    }));

  return {
    campaignId: campaign.id,
    totalRespondents,
    overallScorePercent,
    overallAvgScore,
    ratingCriterion,
    targetGoalPercent: campaign.targetGoalPercent,
    isGoalMet,
    questionStats,
    stationStats,
    ratingDistribution,
    recentComments,
    dateTrends,
  };
};

export const computeSubmissionScorePercent = (
  answers: Record<string, number | string>,
  questions: Question[],
  scaleMax: number = 5
): number => {
  const scoredQuestions = questions.filter(
    q => q.type === 'rating5' || q.type === 'smiley5' || q.type === 'yesno' || q.type === 'recommend_intent' || q.type === 'return_intent'
  );
  if (scoredQuestions.length === 0) return 100;

  let sum = 0;
  let count = 0;
  scoredQuestions.forEach(q => {
    const val = answers[q.id];
    if (val !== undefined && val !== null && !isNaN(Number(val))) {
      sum += Number(val);
      count += 1;
    }
  });

  if (count === 0) return 0;
  const avg = sum / count;
  return Number(((avg / scaleMax) * 100).toFixed(2));
};

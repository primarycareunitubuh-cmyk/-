import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  deleteDoc, 
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './config';
import { Campaign, SurveySubmission } from '../types';
import { INITIAL_CAMPAIGNS, INITIAL_RESPONSES } from '../data/initialData';

const CAMPAIGNS_COLLECTION = 'campaigns';
const SUBMISSIONS_COLLECTION = 'submissions';
const SETTINGS_COLLECTION = 'settings';

/**
 * Deep cleans an object/array to remove any undefined properties
 * before saving to Firestore, preventing runtime exceptions like:
 * "Unsupported field value: undefined"
 */
export function cleanForFirestore<T>(data: T): T {
  if (data === undefined) {
    return null as any;
  }
  if (data === null || typeof data !== 'object') {
    return data;
  }
  if (Array.isArray(data)) {
    return data.map((item) => cleanForFirestore(item)) as any;
  }
  const cleanObj: Record<string, any> = {};
  for (const [key, val] of Object.entries(data)) {
    if (val !== undefined) {
      cleanObj[key] = cleanForFirestore(val);
    }
  }
  return cleanObj as T;
}

/**
 * Seed initial campaigns to Firestore if the collection is currently empty
 */
async function seedInitialCampaignsIfEmpty() {
  try {
    const snap = await getDocs(collection(db, CAMPAIGNS_COLLECTION));
    if (snap.empty) {
      console.log('Seeding initial campaigns to Firestore...');
      const batch = writeBatch(db);
      for (const camp of INITIAL_CAMPAIGNS) {
        const ref = doc(db, CAMPAIGNS_COLLECTION, camp.id);
        batch.set(ref, cleanForFirestore(camp));
      }
      await batch.commit();
      console.log('Initial campaigns seeded successfully.');
    }
  } catch (error) {
    console.warn('Could not seed initial campaigns to Firestore:', error);
  }
}

/**
 * Seed initial sample responses if empty so analytics dashboard has baseline data
 */
async function seedInitialSubmissionsIfEmpty() {
  try {
    const snap = await getDocs(collection(db, SUBMISSIONS_COLLECTION));
    if (snap.empty && INITIAL_RESPONSES.length > 0) {
      console.log('Seeding initial sample responses to Firestore...');
      const batch = writeBatch(db);
      // Seed first 10 responses as initial demo baseline
      for (const resp of INITIAL_RESPONSES.slice(0, 10)) {
        const ref = doc(db, SUBMISSIONS_COLLECTION, resp.id);
        batch.set(ref, resp);
      }
      await batch.commit();
      console.log('Sample responses seeded.');
    }
  } catch (error) {
    console.warn('Could not seed sample submissions:', error);
  }
}

/**
 * Real-time listener for campaigns across all devices
 */
export function subscribeToRealtimeCampaigns(
  onUpdate: (campaigns: Campaign[]) => void,
  onError?: (err: unknown) => void
): () => void {
  // Check and seed if empty in background
  seedInitialCampaignsIfEmpty();

  const unsubscribe = onSnapshot(
    collection(db, CAMPAIGNS_COLLECTION),
    (snapshot) => {
      if (!snapshot.empty) {
        const list: Campaign[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as Campaign;
          const questions = Array.isArray(data.questions) ? data.questions : [];
          // Ensure questions are cleanly preserved and ordered
          questions.sort((a, b) => (a.order || 0) - (b.order || 0));
          list.push({
            ...data,
            questions,
          });
        });
        onUpdate(list);
      } else {
        onUpdate(INITIAL_CAMPAIGNS);
      }
    },
    (error) => {
      console.error('Error listening to campaigns:', error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, CAMPAIGNS_COLLECTION);
    }
  );

  return unsubscribe;
}

/**
 * Real-time listener for survey submissions across all devices
 */
export function subscribeToRealtimeSubmissions(
  onUpdate: (submissions: SurveySubmission[]) => void,
  onError?: (err: unknown) => void
): () => void {
  seedInitialSubmissionsIfEmpty();

  const unsubscribe = onSnapshot(
    collection(db, SUBMISSIONS_COLLECTION),
    (snapshot) => {
      const list: SurveySubmission[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as SurveySubmission);
      });
      // Sort newest first
      list.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
      onUpdate(list);
    },
    (error) => {
      console.error('Error listening to submissions:', error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, SUBMISSIONS_COLLECTION);
    }
  );

  return unsubscribe;
}

/**
 * Real-time listener for the active campaign ID
 */
export function subscribeToActiveCampaignId(
  onUpdate: (activeId: string) => void
): () => void {
  const unsubscribe = onSnapshot(
    doc(db, SETTINGS_COLLECTION, 'activeCampaign'),
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data?.value) {
          onUpdate(data.value);
        }
      }
    },
    (error) => {
      console.warn('Error listening to activeCampaign setting:', error);
    }
  );

  return unsubscribe;
}

/**
 * Save or update a campaign to Firestore (syncs to all devices)
 */
export async function saveCampaignRemote(campaign: Campaign): Promise<void> {
  try {
    const docRef = doc(db, CAMPAIGNS_COLLECTION, campaign.id);
    const cleaned = cleanForFirestore({
      ...campaign,
      updatedAt: new Date().toISOString(),
    });
    await setDoc(docRef, cleaned, { merge: true });
  } catch (error) {
    console.error('Failed to save campaign remotely:', error);
    handleFirestoreError(error, OperationType.WRITE, `${CAMPAIGNS_COLLECTION}/${campaign.id}`);
  }
}

/**
 * Save multiple campaigns to Firestore with batch and individual fallback
 */
export async function saveCampaignsRemote(campaigns: Campaign[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    for (const c of campaigns) {
      const ref = doc(db, CAMPAIGNS_COLLECTION, c.id);
      const cleaned = cleanForFirestore({
        ...c,
        updatedAt: new Date().toISOString(),
      });
      batch.set(ref, cleaned, { merge: true });
    }
    await batch.commit();
  } catch (error) {
    console.warn('Batch write failed, trying individual setDoc fallback:', error);
    try {
      for (const c of campaigns) {
        const ref = doc(db, CAMPAIGNS_COLLECTION, c.id);
        const cleaned = cleanForFirestore({
          ...c,
          updatedAt: new Date().toISOString(),
        });
        await setDoc(ref, cleaned, { merge: true });
      }
    } catch (innerError) {
      console.error('Fallback save also failed:', innerError);
      handleFirestoreError(innerError, OperationType.WRITE, CAMPAIGNS_COLLECTION);
    }
  }
}

/**
 * Delete a campaign permanently from Firestore
 */
export async function deleteCampaignRemote(campaignId: string): Promise<void> {
  try {
    const docRef = doc(db, CAMPAIGNS_COLLECTION, campaignId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${CAMPAIGNS_COLLECTION}/${campaignId}`);
  }
}

/**
 * Add a new survey submission (patient response) to Firestore
 * All connected staff dashboards will instantly receive and render this!
 */
export async function addSubmissionRemote(submission: SurveySubmission): Promise<void> {
  try {
    const docRef = doc(db, SUBMISSIONS_COLLECTION, submission.id);
    await setDoc(docRef, submission);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${SUBMISSIONS_COLLECTION}/${submission.id}`);
  }
}

/**
 * Delete a submission from Firestore
 */
export async function deleteSubmissionRemote(submissionId: string): Promise<void> {
  try {
    const docRef = doc(db, SUBMISSIONS_COLLECTION, submissionId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${SUBMISSIONS_COLLECTION}/${submissionId}`);
  }
}

/**
 * Set the active campaign ID globally across devices
 */
export async function setActiveCampaignIdRemote(campaignId: string): Promise<void> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, 'activeCampaign');
    await setDoc(docRef, {
      id: 'activeCampaign',
      value: campaignId,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('Could not save activeCampaign remotely:', error);
  }
}

/**
 * Reset all Firestore data to defaults
 */
export async function resetAllDataToDefaultRemote(): Promise<void> {
  try {
    // Delete all submissions
    const subSnap = await getDocs(collection(db, SUBMISSIONS_COLLECTION));
    const batch1 = writeBatch(db);
    subSnap.forEach((d) => batch1.delete(d.ref));
    await batch1.commit();

    // Re-seed campaigns
    const batch2 = writeBatch(db);
    for (const c of INITIAL_CAMPAIGNS) {
      batch2.set(doc(db, CAMPAIGNS_COLLECTION, c.id), c);
    }
    await batch2.commit();

    // Reset active campaign
    await setActiveCampaignIdRemote(INITIAL_CAMPAIGNS[0].id);
  } catch (error) {
    console.error('Failed to reset all data remotely:', error);
  }
}

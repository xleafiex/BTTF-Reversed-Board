import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db, getOrCreateDeviceId } from './firebase';
import { BugReport, FeatureRequest, BugStatus, FeatureStatus } from '../types';

const BUGS_COLLECTION = 'bugs';
const FEATURES_COLLECTION = 'features';

/**
 * Real-time listener for bug reports across all community users
 */
export function subscribeToBugs(
  onUpdate: (bugs: BugReport[]) => void,
  onError?: (err: Error) => void
) {
  const deviceId = getOrCreateDeviceId();
  const q = query(collection(db, BUGS_COLLECTION), orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const bugList: BugReport[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const voterIds: string[] = data.voterIds || [];
        bugList.push({
          id: docSnap.id,
          date: data.date || '10/24/85',
          fullDate: data.fullDate || '10/24/1985',
          severity: data.severity || 'MAJOR',
          title: data.title || '',
          status: data.status || 'REPORTED',
          description: data.description || '',
          location: data.location || '',
          reproductionSteps: data.reproductionSteps || [],
          reportedBy: data.reportedBy || 'Anonymous',
          votes: typeof data.votes === 'number' ? data.votes : 0,
          voterIds,
          hasVoted: voterIds.includes(deviceId),
          screenshots: data.screenshots || [],
          systemLog: data.systemLog || '',
          createdAt: data.createdAt || 0,
        });
      });
      onUpdate(bugList);
    },
    (err) => {
      console.error('Firestore bugs subscription error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Real-time listener for feature requests across all community users
 */
export function subscribeToFeatures(
  onUpdate: (features: FeatureRequest[]) => void,
  onError?: (err: Error) => void
) {
  const deviceId = getOrCreateDeviceId();
  const q = query(collection(db, FEATURES_COLLECTION), orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const featList: FeatureRequest[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const voterIds: string[] = data.voterIds || [];
        featList.push({
          id: docSnap.id,
          date: data.date || '10/24/85',
          fullDate: data.fullDate || '10/24/1985',
          votes: typeof data.votes === 'number' ? data.votes : 0,
          voterIds,
          hasVoted: voterIds.includes(deviceId),
          title: data.title || '',
          status: data.status || 'SUGGESTED',
          description: data.description || '',
          suggestedBy: data.suggestedBy || 'Community Innovator',
          category: data.category || 'General',
          plannedTimeline: data.plannedTimeline || 'Community Backlog',
          screenshots: data.screenshots || [],
          createdAt: data.createdAt || 0,
        });
      });
      onUpdate(featList);
    },
    (err) => {
      console.error('Firestore features subscription error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Submit a new bug report to Firestore so everyone sees it
 */
export async function createBugReport(bug: BugReport): Promise<void> {
  const deviceId = getOrCreateDeviceId();
  const docRef = doc(db, BUGS_COLLECTION, bug.id);
  const now = Date.now();

  const dataToSave = {
    date: bug.date || '10/24/85',
    fullDate: bug.fullDate || '10/24/1985',
    severity: bug.severity,
    title: bug.title,
    status: bug.status,
    description: bug.description,
    location: bug.location || '',
    reproductionSteps: bug.reproductionSteps || [],
    reportedBy: bug.reportedBy || 'Anonymous',
    votes: 1,
    voterIds: [deviceId],
    screenshots: bug.screenshots || [],
    systemLog: bug.systemLog || '',
    createdAt: bug.createdAt || now,
  };

  await setDoc(docRef, dataToSave);
}

/**
 * Submit a new feature request to Firestore so everyone sees it
 */
export async function createFeatureRequest(feat: FeatureRequest): Promise<void> {
  const deviceId = getOrCreateDeviceId();
  const docRef = doc(db, FEATURES_COLLECTION, feat.id);
  const now = Date.now();

  const dataToSave = {
    date: feat.date || '10/24/85',
    fullDate: feat.fullDate || '10/24/1985',
    title: feat.title,
    status: feat.status,
    description: feat.description,
    suggestedBy: feat.suggestedBy || 'Community Innovator',
    category: feat.category || 'General',
    plannedTimeline: feat.plannedTimeline || 'Community Backlog',
    votes: 1,
    voterIds: [deviceId],
    screenshots: feat.screenshots || [],
    createdAt: feat.createdAt || now,
  };

  await setDoc(docRef, dataToSave);
}

/**
 * Toggle vote for a bug report in Firestore (real-time sync)
 */
export async function toggleBugVote(bug: BugReport): Promise<boolean> {
  const deviceId = getOrCreateDeviceId();
  const docRef = doc(db, BUGS_COLLECTION, bug.id);
  const currentVoters: string[] = bug.voterIds || [];
  const hasVoted = currentVoters.includes(deviceId);

  let newVoters: string[];
  let newVotes: number;

  if (hasVoted) {
    newVoters = currentVoters.filter((id) => id !== deviceId);
    newVotes = Math.max(0, (bug.votes || 1) - 1);
  } else {
    newVoters = [...currentVoters, deviceId];
    newVotes = (bug.votes || 0) + 1;
  }

  await updateDoc(docRef, {
    votes: newVotes,
    voterIds: newVoters,
  });

  return !hasVoted;
}

/**
 * Toggle vote for a feature request in Firestore (real-time sync)
 */
export async function toggleFeatureVote(feat: FeatureRequest): Promise<boolean> {
  const deviceId = getOrCreateDeviceId();
  const docRef = doc(db, FEATURES_COLLECTION, feat.id);
  const currentVoters: string[] = feat.voterIds || [];
  const hasVoted = currentVoters.includes(deviceId);

  let newVoters: string[];
  let newVotes: number;

  if (hasVoted) {
    newVoters = currentVoters.filter((id) => id !== deviceId);
    newVotes = Math.max(0, (feat.votes || 1) - 1);
  } else {
    newVoters = [...currentVoters, deviceId];
    newVotes = (feat.votes || 0) + 1;
  }

  await updateDoc(docRef, {
    votes: newVotes,
    voterIds: newVoters,
  });

  return !hasVoted;
}

/**
 * Admin updates status of an item in Firestore
 */
export async function updateItemStatus(
  id: string,
  newStatus: string,
  isBug: boolean
): Promise<void> {
  const collectionName = isBug ? BUGS_COLLECTION : FEATURES_COLLECTION;
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, {
    status: newStatus as BugStatus | FeatureStatus,
  });
}

/**
 * Admin deletes an item in Firestore
 */
export async function deleteItem(id: string, isBug: boolean): Promise<void> {
  const collectionName = isBug ? BUGS_COLLECTION : FEATURES_COLLECTION;
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
}

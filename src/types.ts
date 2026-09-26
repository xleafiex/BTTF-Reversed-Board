/**
 * Back to the Future: Reversed - Community Development Board Types
 */

export type Severity = 'MINOR' | 'MAJOR' | 'CRITICAL';
export type BugStatus = 'REPORTED' | 'CONFIRMED' | 'FIXING' | 'FIXED';
export type FeatureStatus = 'SUGGESTED' | 'CONSIDERING' | 'WORKING ON' | 'PLANNED';

export interface ScreenshotItem {
  id: string;
  url: string;
  title: string;
  caption?: string;
  location?: string;
}

export interface BugReport {
  id: string;
  date: string; // e.g. "10/23/85"
  fullDate: string; // e.g. "10/23/1985"
  severity: Severity;
  title: string;
  status: BugStatus;
  description: string;
  location?: string;
  reproductionSteps?: string[];
  reportedBy?: string;
  votes: number;
  hasVoted?: boolean;
  voterIds?: string[];
  screenshots: ScreenshotItem[];
  systemLog?: string;
  createdAt?: number;
}

export interface FeatureRequest {
  id: string;
  date: string; // e.g. "10/23/85"
  fullDate: string; // e.g. "10/23/1985"
  votes: number;
  hasVoted?: boolean;
  voterIds?: string[];
  title: string;
  status: FeatureStatus;
  description: string;
  suggestedBy?: string;
  category?: string;
  plannedTimeline?: string;
  screenshots: ScreenshotItem[];
  createdAt?: number;
}

export type ActivePanel = 'bugs' | 'features';

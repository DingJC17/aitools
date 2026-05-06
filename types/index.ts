import type { Route } from 'next';

export type ToolKey = 'document-extract' | 'document-summary' | 'review-analysis' | 'brainstorm';

export type ToolCardItem = {
  key: ToolKey;
  title: string;
  description: string;
  href: Route;
  trialLimit: string;
  highlights: string[];
};

export type ContactAction = 'wechat_click' | 'github_click' | 'lead_submit' | 'tool_trial_click';

export type LeadRecord = {
  name: string;
  wechat: string;
  email?: string;
  industry: string;
  problem: string;
  currentProcess: string;
  inputType: string;
  expectedOutput: string;
  volume: string;
  deliveryType: string;
  privateDeployment: boolean;
  budget?: string;
  remark?: string;
  source?: string;
};

export type DocumentExtractField = {
  name: string;
  value: string;
  note: string;
};

export type DocumentExtractResult = {
  documentType: string;
  fields: DocumentExtractField[];
  rawTextPreview?: string;
};

export type DocumentSummaryMode = 'general' | 'meeting' | 'briefing' | 'action-items';

export type DocumentSummaryResult = {
  title: string;
  summary: string;
  keyPoints: string[];
  actionItems: string[];
  risks: string[];
  shareableBrief: string;
  outline: string[];
};

export type ReviewAnalysisResult = {
  positivePoints: string[];
  negativeReasons: string[];
  buyingMotivations: string[];
  painPoints: string[];
  productSuggestions: string[];
  marketingAngles: string[];
  contentIdeas: string[];
};

export type ApiSuccess<T> = {
  success: true;
  data: T;
  usage?: Record<string, string | number | boolean | null>;
};

export type ApiFailure = {
  success: false;
  message: string;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

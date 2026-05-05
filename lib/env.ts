import { siteConfig } from '@/lib/site';

export function getBaseUrl() {
  return siteConfig.url.replace(/\/$/, '');
}

export function isMockAiEnabled() {
  return (process.env.NEXT_PUBLIC_ENABLE_MOCK_AI || 'true') === 'true' || !process.env.OPENAI_API_KEY;
}

export function getMaxFileSizeBytes() {
  const mb = Number(process.env.MAX_FILE_SIZE_MB || '5');
  return mb * 1024 * 1024;
}

export function getMaxTextInputChars() {
  return Number(process.env.MAX_TEXT_INPUT_CHARS || '12000');
}

export function getMaxDailyTrialsPerTool(tool?: string) {
  const defaults: Record<string, number> = {
    'document-extract': 3,
    'document-summary': 5,
    'review-analysis': 5,
  };
  const envDefault = Number(process.env.MAX_DAILY_TRIALS_PER_TOOL || '0');
  if (tool && defaults[tool] !== undefined) {
    return envDefault || defaults[tool];
  }
  return envDefault || 5;
}

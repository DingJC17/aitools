import { DocumentSummaryMode } from '@/types';
import { getMaxFileSizeBytes, getMaxTextInputChars } from '@/lib/env';
import { trimLines } from '@/lib/utils';

const documentMimeTypes = new Set(['application/pdf', 'image/png', 'image/jpeg']);
const summaryMimeTypes = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
]);

export function assertFileSize(size: number) {
  if (size > getMaxFileSizeBytes()) {
    throw new Error(`文件过大，请上传 ${Math.round(getMaxFileSizeBytes() / 1024 / 1024)}MB 以内的文件`);
  }
}

export function assertDocumentExtractFileType(type: string) {
  if (!documentMimeTypes.has(type)) {
    throw new Error('仅支持 PDF、PNG、JPG、JPEG 文件');
  }
}

export function assertSummaryFileType(type: string) {
  if (!summaryMimeTypes.has(type)) {
    throw new Error('仅支持 PDF、DOCX、PPTX 或纯文本文件');
  }
}

export function assertTextLimit(value: string, max = getMaxTextInputChars()) {
  if (!value.trim()) {
    throw new Error('请输入内容后再试');
  }
  if (value.length > max) {
    throw new Error(`内容过长，请控制在 ${max} 字以内`);
  }
}

export function parseFieldLines(value: string) {
  const fields = trimLines(value).slice(0, 8);
  if (fields.length === 0) {
    return [];
  }
  return fields;
}

export function assertReviewInput(reviews: string) {
  assertTextLimit(reviews, 5000);
  const lines = trimLines(reviews);
  if (lines.length > 20) {
    throw new Error('单次最多提交 20 条评论');
  }
  return lines;
}

export function assertSummaryMode(mode: string): DocumentSummaryMode {
  const modes: DocumentSummaryMode[] = ['general', 'meeting', 'briefing', 'action-items'];
  if (!modes.includes(mode as DocumentSummaryMode)) {
    return 'general';
  }
  return mode as DocumentSummaryMode;
}

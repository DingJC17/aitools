import { NextResponse } from 'next/server';
import { fail, ok, summarizeDocument } from '@/lib/ai';
import { extractTextFromFile } from '@/lib/documents/extract-text';
import { checkUserUsage, recordUserUsage } from '@/lib/rateLimit';
import { assertFileSize, assertSummaryFileType, assertSummaryMode, assertTextLimit } from '@/lib/validators';

export async function POST(request: Request) {
  let fileName: string | null = null;
  let fileSize: number | null = null;

  try {
    const contentType = request.headers.get('content-type') || '';
    let mode = 'general';
    let content = '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file');
      mode = String(formData.get('mode') || 'general');

      if (!(file instanceof File)) {
        return NextResponse.json(fail('请上传文件或直接粘贴文本'), { status: 400 });
      }

      fileName = file.name;
      fileSize = file.size;
      assertFileSize(file.size);
      assertSummaryFileType(file.type);
      content = await extractTextFromFile(file);
    } else {
      const body = await request.json();
      mode = String(body.mode || 'general');
      content = String(body.content || '');
      assertTextLimit(content);
    }

    const normalizedMode = assertSummaryMode(mode);
    const usage = await checkUserUsage('document-summary');
    if (usage.blocked) {
      return NextResponse.json(fail(usage.message || ""), { status: 429 });
    }

    const result = await summarizeDocument(normalizedMode, content);
    await recordUserUsage('document-summary');

    return NextResponse.json(ok(result, { remaining: usage.remaining || 0, fileName, fileSize }));
  } catch (error) {
    const message = error instanceof Error ? error.message : '处理失败，请稍后重试';
    return NextResponse.json(fail(message), { status: 400 });
  }
}
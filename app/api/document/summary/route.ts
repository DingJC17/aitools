import { NextResponse } from 'next/server';
import { fail, ok, summarizeDocument } from '@/lib/ai';
import { extractTextFromFile } from '@/lib/documents/extract-text';
import { getMaxDailyTrialsPerTool } from '@/lib/env';
import { checkRateLimit } from '@/lib/rateLimit';
import { getRequestMeta, trackToolUsage } from '@/lib/tracking';
import { assertFileSize, assertSummaryFileType, assertSummaryMode, assertTextLimit } from '@/lib/validators';

export async function POST(request: Request) {
  let fileName: string | null = null;
  let fileSize: number | null = null;

  try {
    const contentType = request.headers.get('content-type') || '';
    let mode = 'general';
    let content = '';
    let inputType = 'text';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file');
      mode = String(formData.get('mode') || 'general');

      if (!(file instanceof File)) {
        return NextResponse.json(fail('请上传文件或直接粘贴文本'), { status: 400 });
      }

      fileName = file.name;
      fileSize = file.size;
      inputType = file.type;
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
    const meta = await getRequestMeta();
    const rate = checkRateLimit(`${meta.ipHash}:document-summary`, getMaxDailyTrialsPerTool('document-summary'));
    if (!rate.allowed) {
      return NextResponse.json(fail('今日试用次数已用完，请明天再试或添加微信沟通定制'), { status: 429 });
    }

    const result = await summarizeDocument(normalizedMode, content);
    await trackToolUsage({
      toolName: 'document-summary',
      inputType,
      inputLength: content.length,
      fileName,
      fileSize,
      success: true,
    });

    return NextResponse.json(ok(result, { remaining: rate.remaining, fileName, fileSize }));
  } catch (error) {
    const message = error instanceof Error ? error.message : '处理失败，请稍后重试';
    await trackToolUsage({
      toolName: 'document-summary',
      inputType: 'mixed',
      fileName,
      fileSize,
      success: false,
      errorMessage: message,
    });
    return NextResponse.json(fail(message), { status: 400 });
  }
}

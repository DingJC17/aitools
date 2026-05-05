import { NextResponse } from 'next/server';
import { extractDocumentData, fail, ok } from '@/lib/ai';
import { getMaxDailyTrialsPerTool } from '@/lib/env';
import { checkRateLimit } from '@/lib/rateLimit';
import { trackToolUsage, getRequestMeta } from '@/lib/tracking';
import { assertDocumentExtractFileType, assertFileSize, parseFieldLines } from '@/lib/validators';
import { parsePdf } from '@/lib/documents/extract-text';

export async function POST(request: Request) {
  let fileName: string | null = null;
  let fileSize: number | null = null;

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const documentType = String(formData.get('documentType') || '通用文档');
    const fields = parseFieldLines(String(formData.get('fields') || ''));

    if (!(file instanceof File)) {
      return NextResponse.json(fail('请上传文件'), { status: 400 });
    }

    fileName = file.name;
    fileSize = file.size;

    assertFileSize(file.size);
    assertDocumentExtractFileType(file.type);

    const meta = await getRequestMeta();
    const rate = checkRateLimit(`${meta.ipHash}:document-extract`, getMaxDailyTrialsPerTool('document-extract'));
    if (!rate.allowed) {
      return NextResponse.json(fail('今日试用次数已用完，请明天再试或添加微信沟通定制'), { status: 429 });
    }

    const content = file.type === 'application/pdf'
      ? await parsePdf(Buffer.from(await file.arrayBuffer()))
      : `图片文件：${file.name}。当前版本建议在接入真实多模态模型后用于正式识别。`;

    const result = await extractDocumentData(documentType, fields.length ? fields : ['字段 1', '字段 2'], content);
    await trackToolUsage({
      toolName: 'document-extract',
      inputType: file.type,
      fileName,
      fileSize,
      success: true,
    });

    return NextResponse.json(ok(result, { fileName: file.name, fileSize: file.size, remaining: rate.remaining }));
  } catch (error) {
    const message = error instanceof Error ? error.message : '识别失败，请稍后重试';
    await trackToolUsage({
      toolName: 'document-extract',
      inputType: 'file',
      fileName,
      fileSize,
      success: false,
      errorMessage: message,
    });
    return NextResponse.json(fail(message), { status: 400 });
  }
}

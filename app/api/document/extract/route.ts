import { NextResponse } from 'next/server';
import { extractDocumentData, fail, ok } from '@/lib/ai';
import { checkUserUsage, recordUserUsage } from '@/lib/rateLimit';
import { assertDocumentExtractFileType, assertFileSize, parseFieldLines } from '@/lib/validators';
import { parsePdf } from '@/lib/documents/extract-text';

export async function POST(request: Request) {
  let fileName: string | null = null;
  let fileSize: number | null = null;

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const documentType = String(formData.get('documentType') || '通用文档');
    const fieldsText = String(formData.get('fields') || '');

    if (!(file instanceof File)) {
      return NextResponse.json(fail('请上传文件'), { status: 400 });
    }

    fileName = file.name;
    fileSize = file.size;

    assertFileSize(file.size);
    assertDocumentExtractFileType(file.type);

    const usage = await checkUserUsage('document-extract');
    if (usage.blocked) {
      return NextResponse.json(fail(usage.message || ""), { status: 429 });
    }

    const content = file.type === 'application/pdf'
      ? await parsePdf(Buffer.from(await file.arrayBuffer()))
      : '图片文件：' + file.name + '。当前版本建议在接入真实多模态模型后用于正式识别。';

    const fields = parseFieldLines(fieldsText);
    const result = await extractDocumentData(documentType, fields, content);
    await recordUserUsage('document-extract');

    return NextResponse.json(ok(result, { remaining: usage.remaining || 0, fileName, fileSize }));
  } catch (error) {
    const message = error instanceof Error ? error.message : '处理失败，请稍后重试';
    return NextResponse.json(fail(message), { status: 400 });
  }
}
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import JSZip from 'jszip';

function decodeXmlText(xml: string) {
  return xml
    .replace(/<a:tab\/>/g, '\t')
    .replace(/<a:br\/>/g, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function parsePdf(buffer: Buffer) {
  const parsed = await pdfParse(buffer);
  return parsed.text.trim();
}

export async function parseDocx(buffer: Buffer) {
  const result = await mammoth.extractRawText({ buffer });
  return result.value.trim();
}

export async function parsePptx(buffer: Buffer) {
  const zip = await JSZip.loadAsync(buffer);
  const slidePaths = Object.keys(zip.files)
    .filter((fileName) => /^ppt\/slides\/slide\d+\.xml$/.test(fileName))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const slideTexts = await Promise.all(
    slidePaths.map(async (path) => {
      const xml = await zip.files[path].async('string');
      return decodeXmlText(xml);
    }),
  );

  return slideTexts.filter(Boolean).join('\n\n').trim();
}

export async function extractTextFromFile(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());

  switch (file.type) {
    case 'application/pdf':
      return parsePdf(buffer);
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return parseDocx(buffer);
    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      return parsePptx(buffer);
    case 'text/plain':
      return buffer.toString('utf8').trim();
    default:
      throw new Error('暂不支持该文件格式');
  }
}

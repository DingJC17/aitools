'use client';

import { useState } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { WechatCTA } from '@/components/WechatCTA';
import { documentTypes } from '@/lib/site';
import { ApiResponse, DocumentExtractResult } from '@/types';

export function DocumentExtractForm() {
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState(documentTypes[0]);
  const [fields, setFields] = useState('发票号码\n开票日期\n购买方名称\n销售方名称\n金额\n税额\n价税合计\n备注');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<DocumentExtractResult | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) {
      setError('请先上传文件');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    formData.append('fields', fields);

    const response = await fetch('/api/document/extract', {
      method: 'POST',
      body: formData,
    });
    const data = (await response.json()) as ApiResponse<DocumentExtractResult>;

    setLoading(false);
    if (!data.success) {
      setError(data.message);
      return;
    }
    setResult(data.data);
  }

  return (
    <div className="space-y-10">
      <form onSubmit={handleSubmit} className="panel space-y-6 p-6 sm:p-8">
        <div>
          <h1 className="section-title">AI 文档转表格</h1>
          <p className="mt-3 body-muted">上传 PDF、图片、发票、合同或表单，自动提取字段并整理为结构化表格。</p>
        </div>

        <FileUploader accept=".pdf,.png,.jpg,.jpeg" helper="支持 PDF、PNG、JPG、JPEG，单次 1 个文件，5MB 内" onFileChange={setFile} />

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            文档类型
            <select className="input-base" value={documentType} onChange={(e) => setDocumentType(e.target.value)}>
              {documentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-600">
            免费试用限制：最多识别 8 个字段，仅展示预览结果，不长期保存上传文件。
          </div>
        </div>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          识别字段（每行一个，最多 8 个）
          <textarea className="textarea-base" value={fields} onChange={(e) => setFields(e.target.value)} />
        </label>

        {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p> : null}

        <button type="submit" disabled={loading} className="btn-primary disabled:cursor-not-allowed disabled:opacity-70">
          {loading ? '识别中...' : '开始识别'}
        </button>
      </form>

      {result ? (
        <section className="panel overflow-hidden p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">识别结果</h2>
              <p className="mt-2 text-sm text-slate-500">文档类型：{result.documentType}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" className="btn-secondary" onClick={() => navigator.clipboard.writeText(JSON.stringify(result.fields, null, 2))}>
                复制结果
              </button>
              <button type="button" className="btn-secondary" onClick={() => downloadCsv(result.fields)}>
                导出 CSV
              </button>
            </div>
          </div>
          <div className="mt-6 overflow-hidden rounded-[24px] border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 bg-white text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">字段</th>
                  <th className="px-4 py-3 font-medium">识别结果</th>
                  <th className="px-4 py-3 font-medium">备注</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {result.fields.map((field) => (
                  <tr key={field.name}>
                    <td className="px-4 py-3 font-medium text-ink">{field.name}</td>
                    <td className="px-4 py-3 text-slate-700">{field.value}</td>
                    <td className="px-4 py-3 text-slate-500">{field.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <WechatCTA
        title="需要批量识别多个 PDF、固定 Excel 模板或本地部署？"
        description="免费试用适合验证方向。如果你需要批量处理、自定义字段、导出指定模板或搭内部后台，可以直接添加微信沟通。"
        sourcePage="document-to-table"
      />
    </div>
  );
}

function downloadCsv(fields: Array<{ name: string; value: string; note: string }>) {
  const header = '﻿字段,识别结果,备注';
  const rows = fields.map((f) => `"${f.name}","${f.value}","${f.note}"`).join('\n');
  const blob = new Blob([header + '\n' + rows], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'extracted-fields.csv';
  a.click();
  URL.revokeObjectURL(url);
}

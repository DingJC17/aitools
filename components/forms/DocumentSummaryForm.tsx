'use client';

import { useMemo, useState } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { WechatCTA } from '@/components/WechatCTA';
import { summaryModes } from '@/lib/site';
import { ApiResponse, DocumentSummaryMode, DocumentSummaryResult } from '@/types';

export function DocumentSummaryForm() {
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState('');
  const [mode, setMode] = useState<DocumentSummaryMode>('general');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<DocumentSummaryResult | null>(null);

  const modeDescription = useMemo(() => {
    if (mode === 'meeting') return '适合会议记录、复盘纪要、同步结论';
    if (mode === 'briefing') return '适合整理成汇报提纲和口头汇报结构';
    if (mode === 'action-items') return '优先提取待办、负责人和需确认事项';
    return '适合合同、方案、周报、说明文档的快速阅读摘要';
  }, [mode]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    let response: Response;

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('mode', mode);
      response = await fetch('/api/document/summary', { method: 'POST', body: formData });
    } else {
      response = await fetch('/api/document/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, mode }),
      });
    }

    const data = (await response.json()) as ApiResponse<DocumentSummaryResult>;
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
          <h1 className="section-title">AI Office 文档摘要提取</h1>
          <p className="mt-3 body-muted">上传 PDF、Word、PPT 或直接粘贴文本，快速生成摘要、重点、待办和适合转发的简版结论。</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <FileUploader accept=".pdf,.docx,.pptx,.txt" helper="支持 PDF、DOCX、PPTX、TXT，单次 1 个文件，5MB 内" onFileChange={setFile} />
          <label className="space-y-2 text-sm font-medium text-slate-700">
            或直接粘贴文本
            <textarea
              className="textarea-base min-h-[220px]"
              placeholder="可粘贴会议纪要、方案文档、周报、产品说明等文本内容"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </label>
        </div>

        <div className="grid gap-5 sm:grid-cols-[1fr_1.2fr]">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            输出模式
            <select className="input-base" value={mode} onChange={(e) => setMode(e.target.value as DocumentSummaryMode)}>
              {summaryModes.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-600">
            <p className="font-semibold text-ink">当前模式说明</p>
            <p className="mt-2">{modeDescription}</p>
          </div>
        </div>

        {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p> : null}

        <button type="submit" disabled={loading} className="btn-primary disabled:cursor-not-allowed disabled:opacity-70">
          {loading ? '分析中...' : '开始提取'}
        </button>
      </form>

      {result ? (
        <section className="panel space-y-6 p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">{result.title}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">{result.summary}</p>
            </div>
            <button type="button" className="btn-secondary" onClick={() => navigator.clipboard.writeText(JSON.stringify(result, null, 2))}>
              复制结果
            </button>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <ResultList title="关键要点" items={result.keyPoints} />
            <ResultList title="待办事项" items={result.actionItems} />
            <ResultList title="风险 / 需确认事项" items={result.risks} />
            <ResultList title="汇报提纲" items={result.outline} />
          </div>
          <div className="rounded-[24px] border border-accent/15 bg-accent/8 px-5 py-5">
            <p className="text-sm font-semibold text-accentDeep">适合转发的简版结论</p>
            <p className="mt-2 text-sm leading-7 text-slate-700">{result.shareableBrief}</p>
          </div>
        </section>
      ) : null}

      <WechatCTA
        title="需要批量处理合同、周报、会议纪要或内部知识库？"
        description="我们可以按你的输出模板、知识分类、日报周报格式或私有化部署要求，做成内部可直接使用的文档自动化工具。"
        sourcePage="document-summary"
      />
    </div>
  );
}

function ResultList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5">
      <p className="text-sm font-semibold text-ink">{title}</p>
      {items.length ? (
        <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-600">
          {items.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-slate-400">当前无可展示内容</p>
      )}
    </div>
  );
}

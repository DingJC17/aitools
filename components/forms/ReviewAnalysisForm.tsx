'use client';

import { useState } from 'react';
import { WechatCTA } from '@/components/WechatCTA';
import { reviewPlatforms } from '@/lib/site';
import { ApiResponse, ReviewAnalysisResult } from '@/types';

export function ReviewAnalysisForm() {
  const [platform, setPlatform] = useState(reviewPlatforms[0]);
  const [productType, setProductType] = useState('蓝牙耳机');
  const [reviews, setReviews] = useState('音质不错，佩戴也舒服。\n物流有点慢，包装一般。\n降噪效果超出预期，适合通勤。');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<ReviewAnalysisResult | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    const response = await fetch('/api/review/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ platform, productType, reviews }),
    });
    const data = (await response.json()) as ApiResponse<ReviewAnalysisResult>;

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
          <h1 className="section-title">AI 商品评论分析</h1>
          <p className="mt-3 body-muted">粘贴评论或用户反馈，快速归纳用户喜欢点、差评原因、购买动机和内容方向。</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            平台
            <select className="input-base" value={platform} onChange={(e) => setPlatform(e.target.value)}>
              {reviewPlatforms.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            商品类型
            <input className="input-base" value={productType} onChange={(e) => setProductType(e.target.value)} />
          </label>
        </div>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          评论内容（每行一条，最多 20 条）
          <textarea className="textarea-base min-h-[220px]" value={reviews} onChange={(e) => setReviews(e.target.value)} />
        </label>

        {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p> : null}

        <button type="submit" disabled={loading} className="btn-primary disabled:cursor-not-allowed disabled:opacity-70">
          {loading ? '分析中...' : '开始分析'}
        </button>
      </form>

      {result ? (
        <section className="grid gap-5 lg:grid-cols-2">
          <ResultBlock title="高频好评点" items={result.positivePoints} />
          <ResultBlock title="高频差评原因" items={result.negativeReasons} />
          <ResultBlock title="用户购买动机" items={result.buyingMotivations} />
          <ResultBlock title="用户主要痛点" items={result.painPoints} />
          <ResultBlock title="产品优化建议" items={result.productSuggestions} />
          <ResultBlock title="营销卖点与内容角度" items={[...result.marketingAngles, ...result.contentIdeas]} />
        </section>
      ) : null}

      <WechatCTA
        title="需要批量分析评论、竞品对比或多语言归类？"
        description="可以继续扩成完整运营分析工具，包括批量导入、报表导出、竞品维度拆分和定期复盘报告。"
        sourcePage="review-analysis"
      />
    </div>
  );
}

function ResultBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="panel p-6">
      <p className="text-sm font-semibold text-ink">{title}</p>
      <ul className="mt-4 space-y-2 text-sm leading-7 text-slate-600">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}

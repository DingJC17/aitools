import { NextResponse } from 'next/server';
import { analyzeReviews, fail, ok } from '@/lib/ai';
import { checkUserUsage, recordUserUsage } from '@/lib/rateLimit';
import { assertReviewInput } from '@/lib/validators';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const platform = String(body.platform || '其他');
    const productType = String(body.productType || '未填写');
    const reviews = String(body.reviews || '');
    assertReviewInput(reviews);

    const usage = await checkUserUsage('review-analysis');
    if (usage.blocked) {
      return NextResponse.json(fail(usage.message || ""), { status: 429 });
    }

    const result = await analyzeReviews(platform, productType, reviews);
    await recordUserUsage('review-analysis');

    return NextResponse.json(ok(result, { remaining: usage.remaining || 0 }));
  } catch (error) {
    const message = error instanceof Error ? error.message : '分析失败，请稍后重试';
    return NextResponse.json(fail(message), { status: 400 });
  }
}
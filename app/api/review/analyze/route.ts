import { NextResponse } from 'next/server';
import { analyzeReviews, fail, ok } from '@/lib/ai';
import { getMaxDailyTrialsPerTool } from '@/lib/env';
import { checkRateLimit } from '@/lib/rateLimit';
import { getRequestMeta, trackToolUsage } from '@/lib/tracking';
import { assertReviewInput } from '@/lib/validators';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const platform = String(body.platform || '其他');
    const productType = String(body.productType || '未填写');
    const reviews = String(body.reviews || '');
    assertReviewInput(reviews);

    const meta = await getRequestMeta();
    const rate = checkRateLimit(`${meta.ipHash}:review-analysis`, getMaxDailyTrialsPerTool('review-analysis'));
    if (!rate.allowed) {
      return NextResponse.json(fail('今日试用次数已用完，请明天再试或添加微信沟通定制'), { status: 429 });
    }

    const result = await analyzeReviews(platform, productType, reviews);
    await trackToolUsage({
      toolName: 'review-analysis',
      inputType: platform,
      inputLength: reviews.length,
      success: true,
    });
    return NextResponse.json(ok(result, { remaining: rate.remaining }));
  } catch (error) {
    const message = error instanceof Error ? error.message : '分析失败，请稍后重试';
    await trackToolUsage({
      toolName: 'review-analysis',
      success: false,
      errorMessage: message,
    });
    return NextResponse.json(fail(message), { status: 400 });
  }
}

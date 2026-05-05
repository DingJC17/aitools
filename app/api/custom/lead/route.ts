import { NextResponse } from 'next/server';
import { saveLead, trackContactClick } from '@/lib/tracking';

function required(body: Record<string, unknown>, keys: string[]) {
  return keys.every((key) => String(body[key] || '').trim());
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (
      !required(body, [
        'name',
        'wechat',
        'industry',
        'problem',
        'currentProcess',
        'inputType',
        'expectedOutput',
        'volume',
        'deliveryType',
      ])
    ) {
      return NextResponse.json({ success: false, message: '请补充所有必填项' }, { status: 400 });
    }

    await saveLead({
      name: body.name,
      wechat: body.wechat,
      email: body.email,
      industry: body.industry,
      problem: body.problem,
      currentProcess: body.currentProcess,
      inputType: body.inputType,
      expectedOutput: body.expectedOutput,
      volume: body.volume,
      deliveryType: body.deliveryType,
      privateDeployment: Boolean(body.privateDeployment),
      budget: body.budget,
      remark: body.remark,
      source: 'website',
    });

    await trackContactClick('lead_submit', 'custom');
    return NextResponse.json({ success: true, message: '需求已提交，请添加微信进一步沟通' });
  } catch (error) {
    const message = error instanceof Error ? error.message : '提交失败，请稍后重试';
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}

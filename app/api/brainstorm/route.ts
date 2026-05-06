import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getBrainstormSystemPrompt } from '@/lib/prompts';
import OpenAI from 'openai';

function getAiClient() {
  const provider = (process.env.AI_PROVIDER || 'openai').toLowerCase();
  if (provider === 'deepseek') {
    return new OpenAI({ baseURL: 'https://api.deepseek.com/v1', apiKey: process.env.DEEPSEEK_API_KEY! });
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

function getModel() {
  return (process.env.AI_PROVIDER || 'openai').toLowerCase() === 'deepseek'
    ? (process.env.DEEPSEEK_MODEL || 'deepseek-chat')
    : (process.env.OPENAI_MODEL || 'gpt-4.1-mini');
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ success: false, message: '请先登录' }, { status: 401 });
    }

    const admin = createAdminClient();
    const { count } = await admin.from('tool_usages').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('tool_name', 'brainstorm');
    if ((count || 0) >= 1) {
      return NextResponse.json({ success: false, message: '头脑风暴仅限使用 1 次' }, { status: 403 });
    }

    const body = await request.json() as { messages: Array<{ role: string; content: string }> };

    const client = getAiClient();
    const response = await client.chat.completions.create({
      model: getModel(),
      messages: [
        { role: 'system', content: getBrainstormSystemPrompt() },
        ...body.messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      ],
      temperature: 0.7,
    });

    const reply = response.choices[0]?.message?.content || '请再说明一下你的想法？';
    const isDone = body.messages.length >= 5 || reply.includes('【需求确认】');

    if (isDone) {
      await admin.from('tool_usages').insert({ user_id: user.id, tool_name: 'brainstorm', ip_hash: '' });
    }

    return NextResponse.json({ success: true, data: { reply, done: isDone, remaining: isDone ? 0 : 1 } });
  } catch (error) {
    const message = error instanceof Error ? error.message : '请求失败';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

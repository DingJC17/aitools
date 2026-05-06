import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tool = searchParams.get('tool') || '';

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ success: false, message: '请先登录' }, { status: 401 });
  }

  const admin = createAdminClient();
  const { count } = await admin.from('tool_usages').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('tool_name', tool);
  const used = count || 0;
  const max = tool === 'brainstorm' ? 1 : 3;
  return NextResponse.json({ success: true, data: { used, max, remaining: max - used } });
}

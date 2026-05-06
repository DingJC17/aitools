import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function checkUserUsage(tool: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { allowed: false, blocked: true, message: '请先登录后使用工具' };

    const admin = createAdminClient();
    const { count } = await admin.from('tool_usages').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('tool', tool);
    const used = count || 0;
    const max = tool === 'brainstorm' ? 1 : 3;
    const remaining = max - used;

    if (remaining <= 0) {
      return { allowed: false, blocked: true, message: tool === 'brainstorm' ? '头脑风暴仅限使用 1 次' : '试用次数已用完（' + max + ' 次），如需继续使用请添加微信沟通定制' };
    }
    return { allowed: true, blocked: false, remaining: remaining || 0 };
  } catch {
    return { allowed: false, blocked: true, message: '系统异常，请稍后重试' };
  }
}

export async function recordUserUsage(tool: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const admin = createAdminClient();
    await admin.from('tool_usages').insert({ user_id: user.id, tool, ip_hash: '' });
  } catch { /* non-critical */ }
}

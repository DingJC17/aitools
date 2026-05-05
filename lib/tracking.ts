import { createHash } from 'node:crypto';
import { headers } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/admin';
import { ContactAction, LeadRecord, ToolKey } from '@/types';

function hashValue(value: string) {
  const salt = process.env.IP_HASH_SALT || 'dev-salt';
  return createHash('sha256').update(`${salt}:${value}`).digest('hex');
}

export async function getRequestMeta() {
  const headerStore = await headers();
  const forwarded = headerStore.get('x-forwarded-for') || '';
  const ip = forwarded.split(',')[0]?.trim() || '127.0.0.1';
  const userAgent = headerStore.get('user-agent') || 'unknown';
  return {
    ipHash: hashValue(ip),
    userAgent,
  };
}

export async function trackToolUsage(params: {
  toolName: ToolKey;
  inputType?: string;
  inputLength?: number;
  fileName?: string | null;
  fileSize?: number | null;
  success: boolean;
  errorMessage?: string | null;
}) {
  try {
    const supabase = createAdminClient();
    const meta = await getRequestMeta();
    await supabase.from('tool_usages').insert({
      tool_name: params.toolName,
      input_type: params.inputType || null,
      input_length: params.inputLength || null,
      file_name: params.fileName || null,
      file_size: params.fileSize || null,
      success: params.success,
      error_message: params.errorMessage || null,
      ip_hash: meta.ipHash,
      user_agent: meta.userAgent,
    });
  } catch {
    // noop in preview/local without Supabase
  }
}

export async function trackContactClick(action: ContactAction, page: string, toolName?: ToolKey) {
  try {
    const supabase = createAdminClient();
    const meta = await getRequestMeta();
    await supabase.from('contact_clicks').insert({
      action,
      page,
      tool_name: toolName || null,
      ip_hash: meta.ipHash,
      user_agent: meta.userAgent,
    });
  } catch {
    // noop in preview/local without Supabase
  }
}

export async function saveLead(record: LeadRecord) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('leads').insert({
    name: record.name,
    wechat: record.wechat,
    email: record.email || null,
    industry: record.industry,
    problem: record.problem,
    current_process: record.currentProcess,
    input_type: record.inputType,
    expected_output: record.expectedOutput,
    volume: record.volume,
    delivery_type: record.deliveryType,
    private_deployment: record.privateDeployment,
    budget: record.budget || null,
    remark: record.remark || null,
    source: record.source || 'website',
  });

  if (error) {
    throw new Error('线索保存失败，请稍后重试');
  }
}

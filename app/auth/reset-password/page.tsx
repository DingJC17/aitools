'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';

let supabase: ReturnType<typeof createBrowserClient>;
function getSupabase() {
  if (!supabase) supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  return supabase;
}

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await getSupabase().auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/auth/callback?next=/tools',
    });
    setLoading(false);
    if (error) { setMsg(error.message); return; }
    setSent(true);
  }

  if (sent) {
    return (
      <main className='section-shell'><div className='container-shell max-w-sm panel p-6 sm:p-8 text-center space-y-4'>
        <h1 className='font-display text-2xl font-semibold tracking-tight text-ink'>邮件已发送</h1>
        <p className='text-sm text-slate-600'>重置密码链接已发送至 <strong>{email}</strong></p>
        <Link href='/auth/login' className='btn-primary inline-block'>返回登录</Link>
      </div></main>
    );
  }

  return (
    <main className='section-shell'><div className='container-shell max-w-sm'>
      <form onSubmit={handleSubmit} className='panel space-y-5 p-6 sm:p-8'>
        <div><h1 className='font-display text-2xl font-semibold tracking-tight text-ink'>重置密码</h1>
          <p className='mt-2 text-sm text-slate-500'>输入注册邮箱，我们会发送重置链接。</p></div>
        <label className='space-y-1.5 text-sm font-medium text-slate-700'>邮箱
          <input type='email' className='input-base' value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        {msg ? <p className='rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600'>{msg}</p> : null}
        <button type='submit' disabled={loading} className='btn-primary w-full disabled:opacity-70'>{loading ? '发送中...' : '发送重置链接'}</button>
        <p className='text-center text-sm text-slate-500'><Link href='/auth/login' className='text-accentDeep font-medium hover:underline'>返回登录</Link></p>
      </form>
    </div></main>
  );
}
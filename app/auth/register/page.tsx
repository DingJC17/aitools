'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

let supabase: ReturnType<typeof createBrowserClient>;

function getSupabase() {
  if (!supabase) {
    supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }
  return supabase;
}

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    getSupabase().auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/tools');
      else setChecking(false);
    });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirm) { setError('两次输入的密码不一致'); setLoading(false); return; }
    if (password.length < 6) { setError('密码至少 6 个字符'); setLoading(false); return; }

    const { error: err } = await getSupabase().auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    setLoading(false);
    if (err) { setError(err.message.includes('already') ? '该邮箱已注册' : err.message); return; }
    setSuccess(true);
  }

  if (checking) return <main className="section-shell"><div className="container-shell max-w-sm"><p className="text-center text-slate-500">加载中...</p></div></main>;

  if (success) {
    return (
      <main className="section-shell">
        <div className="container-shell max-w-sm panel p-6 sm:p-8 text-center space-y-4">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">注册成功</h1>
          <p className="text-sm text-slate-600">验证邮件已发送至 <strong>{email}</strong>，请点击邮件中的链接完成验证。</p>
          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
            没收到？检查垃圾邮件箱，或 <Link href="/auth/register" className="text-accentDeep font-medium hover:underline">换邮箱重试</Link>
          </div>
          <Link href="/auth/login" className="btn-primary inline-block">返回登录</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="section-shell">
      <div className="container-shell max-w-sm">
        <form onSubmit={handleSubmit} className="panel space-y-5 p-6 sm:p-8">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">注册</h1>
            <p className="mt-2 text-sm text-slate-500">注册后即可试用工具，每个账号 3 次免费机会。</p>
          </div>
          <label className="space-y-1.5 text-sm font-medium text-slate-700">
            邮箱 <input type="email" className="input-base" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label className="space-y-1.5 text-sm font-medium text-slate-700">
            密码 <input type="password" className="input-base" placeholder="至少 6 位" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <label className="space-y-1.5 text-sm font-medium text-slate-700">
            确认密码 <input type="password" className="input-base" placeholder="再次输入密码" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          </label>
          {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p> : null}
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-70">{loading ? '注册中...' : '注册'}</button>
          <p className="text-center text-sm text-slate-500">已有账号？<Link href="/auth/login" className="text-accentDeep font-medium hover:underline">登录</Link></p>
        </form>
      </div>
    </main>
  );
}

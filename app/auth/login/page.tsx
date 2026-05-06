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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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

    const { error: err } = await getSupabase().auth.signInWithPassword({ email, password });
    setLoading(false);

    if (err) {
      setError(err.message === 'Invalid login credentials' ? '邮箱或密码错误' : err.message);
      return;
    }
    router.push('/tools');
    router.refresh();
  }

  if (checking) {
    return <main className="section-shell"><div className="container-shell max-w-sm"><p className="text-center text-slate-500">加载中...</p></div></main>;
  }

  return (
    <main className="section-shell">
      <div className="container-shell max-w-sm">
        <form onSubmit={handleSubmit} className="panel space-y-5 p-6 sm:p-8">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">登录</h1>
            <p className="mt-2 text-sm text-slate-500">登录后使用工具，每个账号有 3 次免费试用机会。</p>
          </div>

          <label className="space-y-1.5 text-sm font-medium text-slate-700">
            邮箱
            <input type="email" className="input-base" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>

          <label className="space-y-1.5 text-sm font-medium text-slate-700">
            密码
            <input type="password" className="input-base" placeholder="输入密码" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>

          {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p> : null}

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-70">
            {loading ? '登录中...' : '登录'}
          </button>

          <div className="text-center text-sm text-slate-500 space-y-2">
            <p><Link href="/auth/register" className="text-accentDeep font-medium hover:underline">没有账号？注册</Link></p>
            <p><Link href="/auth/reset-password" className="text-accentDeep font-medium hover:underline">忘记密码？</Link></p>
          </div>
        </form>
      </div>
    </main>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';

let supabase: ReturnType<typeof createBrowserClient>;
function getSupabase() {
  if (!supabase) supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  return supabase;
}

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(true);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    getSupabase().auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/tools');
      else setChecking(false);
    });
  }, [router]);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes('@')) { setError('请输入有效邮箱'); return; }
    setLoading(true);
    setError('');
    const { error: err } = await getSupabase().auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setSent(true);
    setCountdown(60);
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    if (code.length < 6) { setError('请输入 6 位验证码'); return; }
    setLoading(true);
    setError('');
    const { error: err } = await getSupabase().auth.verifyOtp({
      email,
      token: code,
      type: 'email',
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    router.push('/tools');
    router.refresh();
  }

  if (checking) return <main className='section-shell'><div className='container-shell max-w-sm'><p className='text-center text-slate-500'>加载中…</p></div></main>;

  return (
    <main className='section-shell'>
      <div className='container-shell max-w-sm'>
        {!sent ? (
          <form onSubmit={sendCode} className='panel space-y-5 p-6 sm:p-8'>
            <div>
              <h1 className='font-display text-2xl font-semibold tracking-tight text-ink'>登录 / 注册</h1>
              <p className='mt-2 text-sm text-slate-500'>输入邮箱，验证码登录。新用户自动注册。</p>
            </div>
            <label className='space-y-1.5 text-sm font-medium text-slate-700'>
              邮箱 <input type='email' className='input-base' placeholder='your@email.com' value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            {error ? <p className='rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600'>{error}</p> : null}
            <button type='submit' disabled={loading} className='btn-primary w-full disabled:opacity-70'>{loading ? '发送中…' : '发送验证码'}</button>
          </form>
        ) : (
          <form onSubmit={verifyCode} className='panel space-y-5 p-6 sm:p-8'>
            <div>
              <h1 className='font-display text-2xl font-semibold tracking-tight text-ink'>输入验证码</h1>
              <p className='mt-2 text-sm text-slate-500'>6 位验证码已发送至 <strong>{email}</strong></p>
            </div>
            <label className='space-y-1.5 text-sm font-medium text-slate-700'>
              验证码 <input type='text' className='input-base text-center text-2xl tracking-[0.5em]' placeholder='000000' maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/D/g,''))} required />
            </label>
            {error ? <p className='rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600'>{error}</p> : null}
            <button type='submit' disabled={loading} className='btn-primary w-full disabled:opacity-70'>{loading ? '验证中…' : '确认登录'}</button>
            <div className='text-center text-sm text-slate-500'>
              {countdown > 0 ? (
                <span className='text-slate-400'>重新发送（{countdown}s）</span>
              ) : (
                <button type='button' onClick={sendCode} className='text-accentDeep font-medium hover:underline'>重新发送验证码</button>
              )}
              <br /><button type='button' onClick={() => setSent(false)} className='mt-1 text-slate-400 hover:underline'>更换邮箱</button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
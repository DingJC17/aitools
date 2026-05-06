'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bot, Send } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import type { ApiResponse } from '@/types';

interface Message { role: 'user' | 'assistant'; content: string }

let supabase;
function getSupabase() {
  if (!supabase) supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  return supabase;
}

export default function BrainstormPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [remaining, setRemaining] = useState(-1);
  const [done, setDone] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getSupabase().auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/auth/login'); return; }
      fetch('/api/auth/usage?tool=brainstorm').then(r => r.json()).then(d => {
        if (d.success) { setRemaining(d.data.remaining); if (d.data.remaining <= 0) setDone(true); }
      }).finally(() => setChecking(false));
    });
  }, [router]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading || done) return;
    const userMsg: Message = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/brainstorm', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })) }),
      });
      const data = await res.json() as ApiResponse<{ reply: string; done: boolean; remaining: number }>;
      if (data.success && data.data) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.data!.reply }]);
        setRemaining(data.data.remaining);
        if (data.data.done) setDone(true);
      }
    } catch {}
    setLoading(false);
  }

  if (checking) return <main className="section-shell"><div className="container-shell max-w-2xl"><p className="text-center text-slate-500">加载中…</p></div></main>;

  return (
    <main className="section-shell">
      <div className="container-shell max-w-2xl">
        <div className="panel flex flex-col" style={{ height: 'calc(100vh - 180px)' }}>
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div><h1 className="font-display text-xl font-semibold tracking-tight text-ink">AI 头脑风暴</h1><p className="mt-0.5 text-sm text-slate-500">多轮对话，帮你理清需求方向</p></div>
            {remaining >= 0 ? <span className={"rounded-full px-4 py-1.5 text-sm font-medium " + (done ? 'bg-rose-50 text-rose-600' : remaining === 0 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600')}>{done ? '已用完' : '剩余 ' + remaining + ' 次'}</span> : null}
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-accent/10"><Bot className="h-8 w-8 text-accent" /></div>
                <p className="text-lg font-semibold text-ink">你想做什么项目或工具？</p>
                <p className="text-sm text-slate-500 max-w-md">告诉我你的想法，比如：我想做一个自动生成周报的工具、我需要批量处理客户邮件…我会通过多轮对话帮你理清需求，确认最终的实现方向。</p>
              </div>
            ) : null}
            {messages.map((m, i) => (
              <div key={i} className={"flex " + (m.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div className={"max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-7 " + (m.role === 'user' ? 'bg-accent text-white' : 'bg-slate-100 text-slate-700')}>{m.content}</div>
              </div>
            ))}
            {done ? <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">需求梳理已完成！如需定制实现，可 <Link href="/custom" className="font-semibold underline">提交定制需求</Link>。</div> : null}
            <div ref={bottomRef} />
          </div>
          <form onSubmit={handleSend} className="flex items-center gap-3 border-t border-slate-100 px-6 py-4">
            <input type="text" className="input-base flex-1" placeholder={done ? '需求梳理已完成' : loading ? 'AI 思考中…' : '输入你的想法…'} value={input} onChange={(e) => setInput(e.target.value)} disabled={loading || done} />
            <button type="submit" disabled={loading || done || !input.trim()} className="btn-primary px-5 disabled:opacity-50"><Send className="h-4 w-4" /></button>
          </form>
        </div>
      </div>
    </main>
  );
}
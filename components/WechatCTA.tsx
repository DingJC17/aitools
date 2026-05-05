'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Copy, Github } from 'lucide-react';
import { siteConfig } from '@/lib/site';

export function WechatCTA({
  title,
  description,
  sourcePage,
}: {
  title: string;
  description: string;
  sourcePage: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(siteConfig.wechat);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);

    void fetch('/api/tracking/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'wechat_click', page: sourcePage }),
    });
  }

  return (
    <section className="panel grid gap-8 overflow-hidden bg-[linear-gradient(135deg,#0d2431_0%,#173648_58%,#20586a_100%)] p-8 text-white sm:p-10 lg:grid-cols-[1fr_260px] lg:items-center">
      <div>
        <p className="badge border-white/10 bg-white/10 text-white">添加微信定制</p>
        <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/78 sm:text-base">{description}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={handleCopy} className="btn-primary bg-white text-ink hover:bg-slate-100">
            <Copy className="mr-2 h-4 w-4" />
            {copied ? '已复制微信号' : '复制微信号'}
          </button>
          <a href={siteConfig.githubUrl} target="_blank" className="btn-secondary border-white/15 bg-white/10 text-white hover:border-white/30 hover:text-white">
            <Github className="mr-2 h-4 w-4" />
            查看 GitHub
          </a>
        </div>
      </div>
      <div className="rounded-[28px] border border-white/10 bg-white/8 p-6 text-center backdrop-blur">
        <Image src="/images/wechat-qr.png" alt="微信二维码" width={176} height={176} className="mx-auto rounded-[20px]" />
        <p className="mt-5 text-sm font-semibold">微信号：{siteConfig.wechat}</p>
        <p className="mt-2 text-xs leading-6 text-white/65">添加时请备注：AI 工具定制</p>
      </div>
    </section>
  );
}

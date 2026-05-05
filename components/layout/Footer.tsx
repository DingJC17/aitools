import Link from 'next/link';
import { siteConfig } from '@/lib/site';

export function Footer() {
  return (
    <footer className="border-t border-white/60 bg-white/70 py-10 backdrop-blur">
      <div className="container-shell flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-2xl font-semibold text-ink">{siteConfig.name}</p>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
            免费试用 AI 文档转表格、Office 文档摘要、评论分析工具。需要批量处理、私有化部署或模板适配，可直接添加微信沟通。
          </p>
        </div>
        <div className="space-y-1 text-sm text-slate-600 sm:text-right">
          <p>微信：{siteConfig.wechat}</p>
          <p>邮箱：{siteConfig.email}</p>
          <div className="flex gap-4 sm:justify-end">
            <Link href="/privacy" className="hover:text-accentDeep">
              隐私说明
            </Link>
            <Link href="/disclaimer" className="hover:text-accentDeep">
              免责声明
            </Link>
            <a href={siteConfig.githubUrl} target="_blank" rel="noreferrer" className="hover:text-accentDeep">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

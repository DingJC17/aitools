import Link from 'next/link';
import { ArrowRight, Bot, FileSpreadsheet, FileText, MessageSquareText } from 'lucide-react';
import { WechatCTA } from '@/components/WechatCTA';
import { ToolCard } from '@/components/ToolCard';
import { CaseStudySection } from '@/components/sections/CaseStudySection';
import { customServiceTags, toolCards } from '@/lib/site';

export default function HomePage() {
  return (
    <main>
      <section className="section-shell pt-12 sm:pt-16">
        <div className="container-shell grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <div className="badge">AI 自动化工具箱</div>
            <div className="space-y-5">
              <h1 className="headline">免费试用文档转表格、Office 文档摘要和评论分析工具。</h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                面向个人、小团队和中小企业的高频办公自动化入口。免费体验核心功能后，如需自定义字段、适配模板、批量处理或私有化部署，可进一步沟通定制方案。
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/tools" className="btn-primary">
                免费试用工具
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/custom" className="btn-secondary">
                添加微信定制
              </Link>
              <Link href="/about" className="btn-secondary">
                查看 GitHub 与联系方式
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="panel p-4">
                <FileSpreadsheet className="h-6 w-6 text-accent" />
                <p className="mt-3 text-sm font-semibold">文档转表格</p>
                <p className="mt-1 text-sm text-slate-600">发票、合同、表单字段快速提取</p>
              </div>
              <div className="panel p-4">
                <FileText className="h-6 w-6 text-accent" />
                <p className="mt-3 text-sm font-semibold">Office 文档摘要</p>
                <p className="mt-1 text-sm text-slate-600">PDF、Word、PPT 提炼重点与待办</p>
              </div>
              <div className="panel p-4">
                <MessageSquareText className="h-6 w-6 text-accent" />
                <p className="mt-3 text-sm font-semibold">评论分析</p>
                <p className="mt-1 text-sm text-slate-600">归纳差评原因与营销卖点</p>
              </div>
            </div>
          </div>
          <div className="panel overflow-hidden border-0 bg-ink p-1 shadow-card">
            <div className="rounded-[26px] bg-[linear-gradient(180deg,#16384a_0%,#0f2431_100%)] p-7 text-white">
              <div className="flex items-center justify-between text-sm text-white/70">
                <span>演示工作台</span>
                <Bot className="h-5 w-5 text-accent" />
              </div>
              <div className="mt-6 space-y-4">
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-accent">文档转表格</p>
                  <p className="mt-2 text-sm leading-7 text-white/80">
                    上传发票 PDF，AI 自动提取发票号码、金额、日期、购销方等字段，整理为结构化表格。
                  </p>
                </div>
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-accent">文档摘要提取</p>
                  <p className="mt-2 text-sm leading-7 text-white/80">
                    上传方案文档或会议纪要，自动提炼摘要、关键要点、待办事项和适合转发的简版结论。
                  </p>
                </div>
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-accent">评论分析</p>
                  <p className="mt-2 text-sm leading-7 text-white/80">
                    粘贴商品评论，自动归纳好评点、差评原因、用户痛点、产品优化建议和营销内容角度。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="container-shell">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="badge">免费工具</p>
              <h2 className="section-title mt-4">先用 3 个高频办公场景的 AI 工具免费试用，快速判断自动化是否适合你的业务。</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-600">
              每个工具均提供免费试用入口，试用结果页可直接添加微信，沟通批量处理、模板定制和私有化部署需求。
            </p>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {toolCards.map((tool) => (
              <ToolCard key={tool.key} item={tool} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="container-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="space-y-5">
            <p className="badge">定制方向</p>
            <h2 className="section-title">免费试用用于验证 AI 能力，真实业务落地需要根据你的流程、系统和数据格式进行适配。</h2>
            <p className="body-muted">
              如需批量处理文件、适配固定模板、搭建 Web 后台、对接企业微信/飞书/钉钉，或不希望敏感数据上传公网，欢迎沟通定制方案。
            </p>
          </div>
          <div className="panel p-6 sm:p-8">
            <div className="flex flex-wrap gap-3">
              {customServiceTags.map((tag) => (
                <span key={tag} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CaseStudySection />

      <section className="section-shell pt-0">
        <div className="container-shell">
          <WechatCTA
            title="需要批量处理、私有化部署或固定模板输出？"
            description="把你的样例文件、输入输出格式和当前处理流程发过来，我们可以直接按你的业务场景定制。"
            sourcePage="home"
          />
        </div>
      </section>
    </main>
  );
}


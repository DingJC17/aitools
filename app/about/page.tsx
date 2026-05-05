import { siteConfig } from '@/lib/site';

export default function AboutPage() {
  return (
    <main className="section-shell">
      <div className="container-shell grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="panel p-6 sm:p-8">
          <p className="badge">关于 / 联系方式</p>
          <h1 className="section-title mt-4">专注于文档、表格、评论与办公自动化的 AI 工具开发。</h1>
          <p className="mt-4 body-muted">
            适合中小企业、个体商家、工作室和个人效率场景。重点是把重复、耗时、容易出错的处理流程，做成能稳定复用的本地工具或 Web 工具。
          </p>
        </section>
        <section className="panel p-6 sm:p-8">
          <dl className="space-y-4 text-sm leading-7 text-slate-600">
            <div>
              <dt className="font-semibold text-ink">微信</dt>
              <dd>{siteConfig.wechat}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">邮箱</dt>
              <dd>{siteConfig.email}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">GitHub</dt>
              <dd>
                <a href={siteConfig.githubUrl} target="_blank" rel="noreferrer" className="text-accentDeep hover:underline">
                  {siteConfig.githubUrl}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">说明</dt>
              <dd>ICP备案信息、Logo、二维码、域名等站点资料可后续通过环境变量与素材文件替换。</dd>
            </div>
          </dl>
        </section>
      </div>
    </main>
  );
}

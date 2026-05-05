import { LeadForm } from '@/components/LeadForm';
import { WechatCTA } from '@/components/WechatCTA';

const deliverables = ['Python 脚本', '本地 exe 工具', 'Web 工具', '企微 / 飞书 / 钉钉机器人', 'Docker 私有化部署'];
const customNeeds = ['批量处理文件', '固定模板输出', '合同 / 标书摘要', '周报月报整理', '评论分析报表', '内部知识库整理', '数据库对接', '私有化部署'];
const workflow = ['发送样例文件或业务流程', '确认输入、输出和验收标准', '给出方案与报价', '开发测试并交付', '后续维护和迭代'];

export default function CustomPage() {
  return (
    <main className="section-shell">
      <div className="container-shell space-y-10">
        <section className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-5">
            <p className="badge">定制服务</p>
            <h1 className="section-title">免费试用负责验证方向，真实业务落地需要把流程、模板和部署方式一起设计。</h1>
            <p className="body-muted">
              适合需要批量处理文档、固定输出模板、飞书/企微对接、本地部署或内部后台的小团队、中小企业和工作室。
            </p>
            <div className="panel p-6">
              <p className="text-sm font-semibold text-ink">参考报价区间</p>
              <div className="mt-4 space-y-2 text-sm leading-7 text-slate-600">
                <p>简单脚本：¥300 - ¥1500</p>
                <p>Excel / PDF 自动化：¥1000 - ¥5000</p>
                <p>小型 Web 工具：¥3000 - ¥15000</p>
                <p>企业内部 AI 工具：¥10000+</p>
              </div>
            </div>
          </div>
          <LeadForm />
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <InfoCard title="适合定制的需求类型" items={customNeeds} />
          <InfoCard title="常见交付形式" items={deliverables} />
          <InfoCard title="合作流程" items={workflow} ordered />
        </section>

        <WechatCTA
          title="想先发样例文件或流程截图也可以。"
          description="如果当前还不方便填完整表单，可以先加微信，把样例文档、表格、评论数据或当前流程发过来，我们再一起收敛需求。"
          sourcePage="custom"
        />
      </div>
    </main>
  );
}

function InfoCard({ title, items, ordered = false }: { title: string; items: string[]; ordered?: boolean }) {
  const ListTag = ordered ? 'ol' : 'ul';
  return (
    <section className="panel p-6 sm:p-7">
      <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">{title}</h2>
      <ListTag className="mt-5 space-y-2 text-sm leading-7 text-slate-600">
        {items.map((item, index) => (
          <li key={item}>{ordered ? `${index + 1}. ${item}` : `• ${item}`}</li>
        ))}
      </ListTag>
    </section>
  );
}

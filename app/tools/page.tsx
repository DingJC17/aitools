import { ToolCard } from '@/components/ToolCard';
import { toolCards } from '@/lib/site';

export default function ToolsPage() {
  return (
    <main className="section-shell">
      <div className="container-shell">
        <div className="max-w-3xl">
          <p className="badge">免费工具列表</p>
          <h1 className="section-title mt-4">围绕文档、表格、办公自动化和运营分析的 3 个核心试用入口。</h1>
          <p className="mt-4 body-muted">
            所有工具都支持匿名试用，重点是让用户在几分钟内判断 AI 自动化是否值得继续投入，再进入定制沟通。
          </p>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {toolCards.map((tool) => (
            <ToolCard key={tool.key} item={tool} />
          ))}
        </div>
      </div>
    </main>
  );
}

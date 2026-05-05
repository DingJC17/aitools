import { CaseStudySection } from '@/components/sections/CaseStudySection';
import { WechatCTA } from '@/components/WechatCTA';

export default function CasesPage() {
  return (
    <main>
      <CaseStudySection />
      <section className="section-shell pt-0">
        <div className="container-shell">
          <WechatCTA
            title="如果你也有类似流程，可以直接做成你的内部版本。"
            description="示例案例主要用于展示能力，真正交付时会按你的字段、模板、流程节点和部署环境重做。"
            sourcePage="cases"
          />
        </div>
      </section>
    </main>
  );
}

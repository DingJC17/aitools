export default function DisclaimerPage() {
  return (
    <main className="section-shell">
      <div className="container-shell max-w-4xl">
        <section className="panel p-6 sm:p-8">
          <p className="badge">免责声明</p>
          <h1 className="section-title mt-4">AI 输出结果仅供辅助参考，关键业务内容请人工复核。</h1>
          <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
            <p>1. 网站提供的识别、摘要和分析结果仅供辅助参考，不保证完全准确。</p>
            <p>2. 合同、财务、法律、医疗等场景的内容，应由专业人士进一步审核确认。</p>
            <p>3. 用户需确保其上传或输入的内容合法合规，并拥有相应处理权限。</p>
            <p>4. 网站不对因用户直接依据 AI 输出结果而产生的损失承担责任。</p>
          </div>
        </section>
      </div>
    </main>
  );
}

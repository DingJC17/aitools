export default function PrivacyPage() {
  return (
    <main className="section-shell">
      <div className="container-shell max-w-4xl">
        <section className="panel p-6 sm:p-8">
          <p className="badge">隐私说明</p>
          <h1 className="section-title mt-4">免费试用仅用于本次 AI 处理，不建议上传敏感文件。</h1>
          <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
            <p>1. 用户上传或输入的内容仅用于本次试用处理，不建议上传身份证、银行卡、医疗记录、涉密文件或商业核心机密。</p>
            <p>2. 初版默认不长期保存上传文件；如接入临时存储，仅用于解析并应在 24 小时内删除。</p>
            <p>3. 需求表单中的联系方式仅用于后续沟通定制需求，不会用于无关用途。</p>
            <p>4. 网站可能记录必要的访问日志和工具使用日志，用于限流、排障与功能优化。</p>
            <p>5. 第三方 AI API 处理数据时可能涉及外部模型服务，具体以所选服务商的隐私政策为准。</p>
          </div>
        </section>
      </div>
    </main>
  );
}

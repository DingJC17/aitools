# AI 自动化工具箱

面向个人、小团队和中小企业的 AI 自动化工具试用站。当前版本包含 3 个核心试用工具：

- AI 文档转表格
- AI Office 文档摘要提取
- AI 商品评论分析

站点目标不是做复杂 SaaS，而是通过可试用工具展示能力，并通过微信 / 表单承接批量处理、固定模板、私有化部署和办公自动化定制需求。

## 技术栈

- Next.js App Router
- TypeScript
- Tailwind CSS
- Netlify 部署
- Supabase Postgres + Storage
- OpenAI Responses API（支持 mock 模式）

## 本地启动

```bash
npm install
cp .env.example .env.local
npm run dev
```

打开 `http://127.0.0.1:3000`。

## 环境变量

参考 `.env.example`，关键变量包括：

- `NEXT_PUBLIC_SITE_NAME`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_GITHUB_URL`
- `NEXT_PUBLIC_CONTACT_WECHAT`
- `NEXT_PUBLIC_CONTACT_EMAIL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `MAX_FILE_SIZE_MB`
- `MAX_TEXT_INPUT_CHARS`
- `IP_HASH_SALT`

如果不填 `OPENAI_API_KEY`，项目会默认进入 mock 演示模式，三个工具都能展示完整交互。

## Supabase 初始化

在 Supabase SQL Editor 或迁移流程中执行：

1. `supabase/migrations/001_init.sql`
2. `supabase/migrations/002_storage.sql`

说明：

- `leads` 保存定制需求线索
- `tool_usages` 记录工具试用情况
- `contact_clicks` 记录微信 / GitHub / 提交需求行为
- `trial-uploads` 为私有 bucket，仅服务端使用

## Netlify 部署

1. 将仓库连接到 Netlify
2. Build command 使用 `npm run build`
3. 保持 `@netlify/plugin-nextjs` 插件生效
4. 在 Netlify 环境变量中配置 `.env.example` 对应值
5. 生产环境与预览环境建议分别指向不同 Supabase 项目

## 项目结构

```text
app/
  api/
  tools/
  custom/
  cases/
  about/
  privacy/
  disclaimer/
components/
  forms/
  layout/
  sections/
lib/
  ai.ts
  prompts.ts
  validators.ts
  tracking.ts
  rateLimit.ts
  documents/
  supabase/
supabase/
  migrations/
```

## 已实现功能

- 首页、工具列表页、定制服务页、案例页、关于页、隐私页、免责声明页
- 文档转表格试用接口
- Office 文档摘要提取试用接口
- 评论分析试用接口
- 微信 CTA 与需求表单
- 基础埋点与内存限流
- Supabase SQL 与 RLS 初始配置
- `sitemap.xml` 与 `robots.txt`

## 当前限制

- 文档转表格里的图片识别在未接入真实多模态模型时，以 mock / 演示链路为主
- `DOCX / PPTX / PDF` 解析依赖 Node 包，复杂格式文件仍可能需要后续增强
- Storage 清理策略需要在生产环境配合 Supabase 定时任务或运维策略实现

## 后续建议

1. 增加 Excel 独立工具，而不是塞进 Office 摘要工具
2. 将内存限流改为数据库或 Redis 级别
3. 增加 CSV 导出与后台统计页
4. 为文档解析补充 OCR / 多模态增强

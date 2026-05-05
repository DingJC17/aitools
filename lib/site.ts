import { ToolCardItem } from '@/types';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'AI 自动化工具箱';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com';
const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/yourname';
const wechat = process.env.NEXT_PUBLIC_CONTACT_WECHAT || 'your_wechat_id';
const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'your@email.com';
const tagline = process.env.NEXT_PUBLIC_TAGLINE || '免费试用文档转表格、Office 文档摘要、评论分析工具';

export const siteConfig = {
  name: siteName,
  url: siteUrl,
  githubUrl,
  wechat,
  email,
  tagline,
  description:
    '免费试用 AI 文档转表格、Office 文档摘要提取、商品评论分析工具。支持批量处理、自定义字段、私有化部署和办公自动化定制。',
};

export const toolCards: ToolCardItem[] = [
  {
    key: 'document-extract',
    title: 'AI 文档转表格',
    description: '上传 PDF、图片、发票或表单，自动提取关键字段并整理成表格。',
    href: '/tools/document-to-table',
    trialLimit: '单次 1 个文件，最多 8 个字段',
    highlights: ['发票/合同/表单提取', '可自定义字段', '预览结果可复制'],
  },
  {
    key: 'document-summary',
    title: 'AI Office 文档摘要提取',
    description: '上传 PDF、Word、PPT，快速提取摘要、重点、待办和汇报结论。',
    href: '/tools/document-summary',
    trialLimit: '单次 1 个文件或 1 段文本',
    highlights: ['支持 PDF / DOCX / PPTX', '会议纪要与汇报提纲', '办公自动化场景'],
  },
  {
    key: 'review-analysis',
    title: 'AI 商品评论分析',
    description: '粘贴用户评论或反馈，快速归纳差评原因、购买动机和营销卖点。',
    href: '/tools/review-analysis',
    trialLimit: '单次最多 20 条评论',
    highlights: ['运营复盘', '竞品灵感', '内容选题建议'],
  },
];

export const customServiceTags = [
  '批量处理',
  '固定模板输出',
  'Excel 模板适配',
  '本地 exe',
  'Web 后台',
  '私有化部署',
  '企微/飞书/钉钉对接',
  '自动日报/周报',
  '知识库整理',
];

export const summaryModes = [
  { label: '通用摘要', value: 'general' },
  { label: '会议纪要', value: 'meeting' },
  { label: '汇报提纲', value: 'briefing' },
  { label: '待办提取', value: 'action-items' },
] as const;

export const documentTypes = ['发票', '合同', '简历', '订单', '报价单', '通用文档', '其他'];

export const reviewPlatforms = ['淘宝/天猫', '京东', '抖店', '小红书', '亚马逊', '独立站', 'App 用户反馈', '其他'];

export const caseStudies = [
  {
    id: 'invoice',
    title: '100 份 PDF 发票自动整理成 Excel',
    industry: '财务 / 行政',
    pain: '人工打开 PDF 逐条录入发票号码、金额、日期、购销方信息到 Excel，每份耗时 2-3 分钟，100 份需要半天，且容易看错行或漏填。',
    process: '上传 PDF 发票 → AI 自动识别关键字段 → 输出结构化表格 → 人工复核确认',
    outcome: '上传文件后自动识别字段并形成结构化结果表，支持按发票号码、金额、日期排序和筛选。',
    timeSaved: '原本 4 小时的手动录入工作缩短到 20 分钟复核确认。',
    customPoints: ['批量处理 100+ 文件', '自定义提取字段', '导出指定 Excel 模板', '对接财务系统'],
  },
  {
    id: 'summary',
    title: '方案文档与会议纪要自动提炼摘要与待办',
    industry: '小团队 / 工作室',
    pain: '方案文档、会议纪要、客户需求说明分散在各处，每次复述和转发需要重新阅读全文，内部同步耗时且容易遗漏关键信息。',
    process: '上传 PDF / Word / PPT → AI 阅读全文 → 生成摘要、要点、待办和简版结论 → 一键复制转发',
    outcome: '上传文档后自动生成摘要、关键要点、待办事项和适合转发的简版结论，可按会议纪要、汇报提纲等模式切换输出格式。',
    timeSaved: '内部同步时间从每次 30 分钟压缩到 5 分钟，信息传递更完整。',
    customPoints: ['固定模板摘要', '周报月报自动整理', '知识库归档', '对接企微/飞书推送'],
  },
  {
    id: 'review',
    title: '300 条商品评论自动分析差评原因与营销角度',
    industry: '电商 / 跨境电商',
    pain: '运营人员需要逐条阅读大量评论来发现用户痛点和产品问题，半天只能处理几十条，难以系统性地提炼营销卖点和内容选题。',
    process: '粘贴评论数据 → AI 多维分析 → 生成分析报告 → 输出运营建议和内容方向',
    outcome: '自动归纳好评点、差评原因、用户购买动机、产品优化建议、营销卖点和短视频内容角度，形成可供团队使用的运营分析报告。',
    timeSaved: '半天的评论复盘压缩到 15 分钟拿到结构化初稿，运营精力集中在策略和创意。',
    customPoints: ['批量导入店铺评论', '多语言评论分析', '竞品对比', '定期运营报表'],
  },
];

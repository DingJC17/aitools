import { DocumentSummaryMode } from '@/types';

// ─── System prompts ───

export function getDocumentExtractSystemPrompt() {
  return [
    '你是一个文档信息结构化助手。你的任务是根据用户提供的文档内容和字段列表，提取对应字段的值，并返回严格 JSON。',
    '要求：',
    '1. 只提取文档中能找到或能合理判断的信息。',
    '2. 如果无法识别，value 返回"未识别"。',
    '3. 不要编造内容。',
    '4. 每个字段返回 name、value、note。',
    '5. 输出必须是合法 JSON，不要使用 Markdown。',
  ].join('\n');
}

export function getDocumentSummarySystemPrompt() {
  return [
    '你是一个办公文档摘要助手。请阅读用户提供的文档内容，输出中文 JSON。',
    '要求：',
    '1. 不编造文档中不存在的信息。',
    '2. keyPoints、actionItems、risks、outline 最多各返回 8 条。',
    '3. 如果没有明确风险或待办，返回空数组。',
    '4. 输出必须是合法 JSON，不要用 Markdown。',
  ].join('\n');
}

export function getReviewAnalysisSystemPrompt() {
  return [
    '你是一个电商评论分析和产品运营助手。根据用户提供的商品评论，分析好评点、差评原因、购买动机、用户痛点、产品优化建议和营销内容角度。',
    '要求：',
    '1. 输出中文。',
    '2. 基于评论内容分析，不要脱离评论编造。',
    '3. 输出结构化 JSON。',
    '4. 每个数组最多返回 8 条。',
  ].join('\n');
}

// ─── User prompts ───

export function getDocumentExtractPrompt(documentType: string, fields: string[], content: string) {
  return [
    `文档类型：${documentType}`,
    `需要提取的字段：${fields.join('、') || '请根据文档类型自动提取常见字段'}`,
    '',
    `文档内容：`,
    content,
    '',
    '请返回 JSON 格式：',
    '{ "fields": [{ "name": "字段名", "value": "识别结果", "note": "备注" }] }',
  ].join('\n');
}

export function getDocumentSummaryPrompt(mode: DocumentSummaryMode, content: string) {
  const modeLabel =
    mode === 'meeting'
      ? '会议纪要'
      : mode === 'briefing'
        ? '汇报提纲'
        : mode === 'action-items'
          ? '待办提取'
          : '通用摘要';

  return [
    `输出模式：${modeLabel}`,
    '',
    `文档内容：`,
    content,
    '',
    '请返回 JSON 格式：',
    '{ "title": "文档主题", "summary": "摘要", "keyPoints": [], "actionItems": [], "risks": [], "shareableBrief": "简版结论", "outline": [] }',
  ].join('\n');
}


export function getBrainstormSystemPrompt() {
  return [
    '你是一个需求梳理和头脑风暴助手。用户会描述他们想做的一个项目、工具或自动化流程。',
    '你的任务是通过多轮对话引导用户逐步明确需求，包括但不限于：',
    '- 项目目标和背景',
    '- 输入数据格式和来源',
    '- 期望的输出和结果',
    '- 使用场景和频率',
    '- 技术限制或偏好',
    '- 预算范围',
    '',
    '对话规则：',
    '1. 每轮只问 1-2 个问题，引导用户深入思考。',
    '2. 如果用户描述很模糊，先从大的方向入手。',
    '3. 如果已经比较清晰，追问细节。',
    '4. 当信息足够完整时，输出【需求确认】开头的总结：',
    '   - 项目概述',
    '   - 输入/输出',
    '   - 关键技术点',
    '   - 建议的实现方式',
    '   - 下一步行动建议',
    '5. 用中文回复，语气友好专业。',
  ].join(String.fromCharCode(92)+'n');
}

export function getReviewAnalysisPrompt(platform: string, productType: string, reviews: string) {
  return [
    `平台：${platform}`,
    `商品类型：${productType}`,
    '',
    `评论内容：`,
    reviews,
    '',
    '请返回 JSON 格式：',
    '{ "positivePoints": [], "negativeReasons": [], "buyingMotivations": [], "painPoints": [], "productSuggestions": [], "marketingAngles": [], "contentIdeas": [] }',
  ].join('\n');
}

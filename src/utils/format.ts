/** 将 ISO 日期格式化为「2025年1月15日」 */
export function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

/** 估算阅读时长（分钟），中文按 400 字/分钟、英文按 200 词/分钟 */
export function readingTime(markdown: string): number {
  const withoutCode = markdown.replace(/```[\s\S]*?```/g, '')
  const cn = (withoutCode.match(/[\u4e00-\u9fa5]/g) ?? []).length
  const en = (withoutCode.replace(/[\u4e00-\u9fa5]/g, '').match(/\w+/g) ?? []).length
  return Math.max(1, Math.round(cn / 400 + en / 200))
}

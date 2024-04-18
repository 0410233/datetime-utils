import formatDatetime from "./formatDatetime"

/**
 * 格式化最新时间
 */
export default function formatNow(format: string, lang: 'zh'|'en' = 'zh') {
  return formatDatetime(new Date(), format, lang)
}

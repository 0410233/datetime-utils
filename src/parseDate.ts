/**
 * 转换字符串或数值为日期
 */
export default function parseDate(value: unknown) {
  if (value instanceof Date) {
    return value
  }
  if (typeof value === 'number' || (typeof value === 'string' && /^\d+$/.test(value))) {
    return new Date(Number(value))
  }
  return new Date('' + value)
}

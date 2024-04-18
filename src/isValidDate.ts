
/**
 * 判断是否有效的日期
 */
export default function isValidDate(date: unknown): date is Date {
  return date instanceof Date && !isNaN(date.getTime())
}

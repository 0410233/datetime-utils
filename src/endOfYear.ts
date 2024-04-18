import parseDate from "./parseDate"


/**
 * 指定日期的年份结束时间
 */
export default function endOfYear(date: unknown) {
  const year = parseDate(date).getFullYear()
  return new Date(year+1, 0, 1, 0, 0, 0, -1)
}

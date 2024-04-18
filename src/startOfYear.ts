import parseDate from "./parseDate"


/**
 * 指定日期的年份开始时间
 */
export default function startOfYear(date: unknown) {
  const year = parseDate(date).getFullYear()
  return new Date(year, 0, 1)
}

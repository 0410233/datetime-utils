import parseDate from "./parseDate"

/**
 * 日期时间转数组
 */
export default function dateToArray(date: unknown): number[] {
  const time = parseDate(date)
  return [
    time.getFullYear(),
    time.getMonth() + 1,
    time.getDate(),
    time.getHours(),
    time.getMinutes(),
    time.getSeconds(),
    time.getMilliseconds(),
  ]
}

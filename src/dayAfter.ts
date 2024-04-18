import dateToArray from "./dateToArray"


/**
 * 指定日期的 n 天之后
 */
export default function dayAfter(date: unknown, days: number) {
  const [y, m, d, h, min, s, ms] = dateToArray(date)
  return new Date(y, m-1, d+days, h, min, s, ms)
}

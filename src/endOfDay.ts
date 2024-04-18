import dateToArray from "./dateToArray"


/**
 * 指定日期的结束时间
 */
export default function endOfDay(date: unknown) {
  const [year, month, day] = dateToArray(date)
  return new Date(year, month-1, day+1, 0, 0, 0, -1)
}

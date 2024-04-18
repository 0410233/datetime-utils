import dateToArray from "./dateToArray"


/**
 * 指定日期的开始时间
 */
export default function startOfDay(date: unknown) {
  const [year, month, day] = dateToArray(date)
  return new Date(year, month-1, day)
}

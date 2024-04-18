import dateToArray from "./dateToArray"


/**
 * 指定日期的月份开始时间
 */
export default function startOfMonth(date: unknown) {
  const [year, month] = dateToArray(date)
  return new Date(year, month-1, 1)
}

import parseDate from "./parseDate"
import isValidDate from "./isValidDate"
import dateToArray from "./dateToArray"


/**
 * 计算年龄
 */
export default function getAge(birthday: unknown): number {
  const time = parseDate(birthday)
  if (!isValidDate(time)) {
    return 0
  }
  const [year, month, date] = dateToArray(time)
  const [thisYear, thisMonth, thisDate] = dateToArray(new Date())
  if (thisYear <= year) {
    return 0
  }
  let age = thisYear - year - 1
  if (thisMonth > month || (thisMonth === month && thisDate >= date)) {
    age += 1
  }
  return age
}

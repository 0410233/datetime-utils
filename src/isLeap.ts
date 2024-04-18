
/**
 * 判断是否闰年
 */
export default function isLeap(year: number) {
  return (year%4 === 0 && year%100 !== 0) || year%400 === 0
}

import parseDate from "./parseDate"
import isValidDate from "./isValidDate"
import startOfDay from "./startOfDay"
import formatDatetime from "./formatDatetime"


/**
 * 格式化过去时间
 */
export default function formatAgo(timeago: unknown, now?: number) {
  const time = parseDate(timeago)
  if (!isValidDate(time)) {
    return ''
  }
  // console.log('formatAgo', timeago, time)
  now = now || Date.now()
  const delta = now - time.getTime()

  const minute = 1000 * 60
  const hour = minute * 60
  const day = hour * 24

  // 1 分钟内
  if (delta < minute) {
    return '刚刚'
  }
  // 当天内，返回时间
  let start = startOfDay(now)
  if (time >= start) {
    return formatDatetime(time, 'HH:mm')
  }
  // 昨天
  if (time.getTime() >= start.getTime() - day) {
    return '昨天 ' + formatDatetime(time, 'HH:mm')
  }
  // 一周内
  if (time.getTime() >= start.getTime() - day*6) {
    return formatDatetime(time, 'ddd HH:mm')
  }
  // 年内
  start = new Date((new Date()).getFullYear(), 0, 1);
  if (time >= start) {
    return formatDatetime(time, 'M月D日 HH:mm')
  }
  // 更早
  return formatDatetime(time, 'YYYY年M月D日 HH:mm')
}

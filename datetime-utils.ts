
/** 超简单的数字前面补零 */
function formatNumber(n: number|string) {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

type timestamp = number
type DateSource = string|timestamp|Date

/**
 * 转换字符串或数值为日期
 */
export function parseDate(value: DateSource) {
  if (value instanceof Date) {
    return value
  }
  if (typeof value === 'string' && /^\d+$/.test(value)) {
    value = Number(value)
  }
  return new Date(value)
}

/**
 * 判断是否有效的日期
 */
export function isValidDate(date: unknown) {
  return date instanceof Date && !isNaN(date.getTime())
}

/**
 * 判断是否闰年
 */
export function isLeap(year: number) {
  return (year%4 == 0 && year%100 != 0)||(year%400 == 0)
}

const weekMap = {
  'zh': {
    name: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
    abbrev: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
  },
  'en': {
    name: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    abbrev: ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'],
  },
}

const monthMap = {
  'zh': {
    name: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
    abbrev: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
  },
  'en': {
    name: ['January','February','March','April','May','June','July','August','September','October','November','December'],
    abbrev: ['Jan.','Feb.','Mar.','Apr.','May.','Jun.','Jul.','Aug.','Sept.','Oct.','Nov.','Dec.'],
  },
}

/** 获取序数词缀 */
function getOrdinalAffix(num: number) {
  return ['th','st','nd','rd'][num%10] || 'th'
}

/**
 * 将日期转换为指定格式的字符串
 *
 * 格式化字符参考 https://momentjs.com/docs/#/displaying/format/
 */
export function formatDatetime(
  value: DateSource,
  format: string = "YYYY-MM-DD HH:mm",
  lang: 'zh'|'en' = 'zh'
) {
  const date = parseDate(value)
  if (!isValidDate(date)) {
    return ''
  }

  let result = format

  // 年
  const year = date.getFullYear()
  result = result.replace(/Y+/g, match => {
    return String(year).slice(-1 * match.length)
  })

  // 月
  const month = date.getMonth()
  result = result.replace(/(M+)(o?)/g, (match, m1, m2) => {
    switch (m1.length) {
      case 1:
        const affix = m2 ? getOrdinalAffix(month+1) : ''
        return String(month+1) + affix
      case 2:
        return formatNumber(month+1)
      case 3:
        return monthMap[lang]['abbrev'][month]
      default:
        return monthMap[lang]['name'][month]
    }
  })

  // 日
  const day = date.getDate()
  result = result.replace(/(D+)(o?)/g, (match, m1, m2) => {
    if (m1.length === 1) {
      const affix = m2 ? getOrdinalAffix(month+1) : ''
      return day + affix
    }
    return formatNumber(day)
  })

  // 时
  const hours = date.getHours();
  result = result.replace(/H+/g, match => {
    return match.length > 1 ? formatNumber(hours) : String(hours);
  })

  // 分
  const mins = date.getMinutes();
  result = result.replace(/m+/g, match => {
    return match.length > 1 ? formatNumber(mins) : String(mins);
  })

  // 秒
  const secs = date.getSeconds();
  result = result.replace(/s+/g, match => {
    return match.length > 1 ? formatNumber(secs) : String(secs);
  })

  // 周
  const weekday = date.getDay();
  result = result.replace(/(d+)(o?)/g, (match, m1, m2) => {
    switch (m1.length) {
      case 1:
        const affix = m2 ? getOrdinalAffix(weekday) : ''
        return weekday + affix
      case 2:
        return weekMap[lang]['abbrev'][weekday]
      default:
        return weekMap[lang]['name'][weekday]
    }
  })

  return result
}

/**
 * 格式化过去时间
 */
export function formatAgo(timeago: DateSource, now?: number) {
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

/**
 * 格式化最新时间
 */
export function formatNow(format: string, lang: 'zh'|'en') {
  return formatDatetime(new Date(), format, lang)
}

/**
 * 日期时间转数组
 */
export function dateToArray(date: DateSource): number[] {
  date = parseDate(date)
  return [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds(),
  ]
}

/**
 * 计算年龄
 */
export function getAge(birthday: DateSource): number {
  birthday = parseDate(birthday)
  if (!isValidDate(birthday)) {
    return 0
  }
  const [year, month, date] = dateToArray(birthday)
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

/**
 * 指定日期的 n 天之后
 */
export function dayAfter(date: DateSource, days: number) {
  const [y, m, d, h, min, s, ms] = dateToArray(parseDate(date))
  return new Date(y, m-1, d+days, h, min, s, ms)
}

/**
 * 指定日期的开始时间
 */
export function startOfDay(date: DateSource) {
  const [year, month, day] = dateToArray(parseDate(date))
  return new Date(year, month-1, day)
}

/**
 * 指定日期的结束时间
 */
export function endOfDay(date: DateSource) {
  const [year, month, day] = dateToArray(parseDate(date))
  return new Date(year, month-1, day+1, 0, 0, 0, -1)
}

/**
 * 指定日期的月份开始时间
 */
export function startOfMonth(date: DateSource) {
  const [year, month] = dateToArray(parseDate(date))
  return new Date(year, month-1, 1)
}

/**
 * 指定日期的月份结束时间
 */
export function endOfMonth(date: DateSource) {
  const [year, month] = dateToArray(parseDate(date))
  return new Date(year, month, 1, 0, 0, 0, -1)
}

/**
 * 指定日期的年份开始时间
 */
export function startOfYear(date: DateSource) {
  const year = parseDate(date).getFullYear()
  return new Date(year, 0, 1)
}

/**
 * 指定日期的年份结束时间
 */
export function endOfYear(date: DateSource) {
  const year = parseDate(date).getFullYear()
  return new Date(year+1, 0, 1, 0, 0, 0, -1)
}

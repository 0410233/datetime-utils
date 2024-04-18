import isValidDate from "./isValidDate"
import parseDate from "./parseDate"

/** 超简单的数字前面补零 */
function formatNumber(n: number|string) {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

/** 获取序数词缀 */
function getOrdinalAffix(num: number) {
  return ['th','st','nd','rd'][num%10] || 'th'
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

/**
 * 将日期转换为指定格式的字符串
 *
 * 格式化字符参考 https://momentjs.com/docs/#/displaying/format/
 */
export default function formatDatetime(
  value: unknown,
  format: string = "YYYY-MM-DD HH:mm:ss",
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

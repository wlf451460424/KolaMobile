import moment from 'moment'

export default {
  FunGetDateStr (p_count) {
    var dd = new Date()
    dd.setDate(dd.getDate() + p_count)// 获取p_count天后的日期
    var y = dd.getFullYear()
    var m = dd.getMonth() + 1// 获取当前月份的日期
    // if( m <10){
    //     m = '0'+m;
    // }
    var d = dd.getDate()
    // if( d <10){
    //     d = '0'+d;
    // }
    return y + '-' + m + '-' + d
  },
  getDaysInMonth (year, month) {
    month = parseInt(month, 10)
    var temp = new Date(year, month, 0)
    return temp.getDate()
  },
  getTheMonthLastDay (year, month) {
    var nextMonthDayOne = new Date(year, month, 1)
    var minusDate = 1000 * 60 * 60 * 24
    var current = new Date(nextMonthDayOne.getTime() - minusDate)
    return current.getDate()
  },
  getNowFormatDate (n) {
    var day = new Date()
    var Year = 0
    var Month = 0
    var Day = 0
    var CurrentDate = ''
    if (n === 3) {
      Year = day.getFullYear()
      Month = day.getMonth() + 1

      if (day.getDate() === this.getDaysInMonth(Year, Month)) {
        Day = 1
      } else {
        if (Month === 1) {
          Month = 12
          Year = Year - 1
        } else {
          Month = Month - 1
        }
        Day = day.getDate() + 1
      }
    }
    if (n === 6) {
      Year = day.getFullYear()
      Month = day.getMonth() + 1

      if (day.getDate() === this.getDaysInMonth(Year, Month)) {
        Day = 1
      } else {
        if (Month === 1) {
          Month = 12
          Year = Year - 1
        } else {
          Month = Month - 1
        }
        Day = day.getDate()
      }
    }
    if (n === 2) {
      Year = day.getFullYear()
      Month = day.getMonth() + 1
      Day = 1
    }
    if (n === 1) {
      Year = day.getFullYear()
      Month = day.getMonth() + 1
      Day = day.getDate()
    }
    if (n === -1) {
      Year = day.getFullYear()
      Month = day.getMonth() + 1
      Day = day.getDate()
      if (Day === 1) {
        if (Month === 1) {
          Year = Year - 1
          Month = 12
          Day = Day + this.getDaysInMonth(Year, Month) - 1
        } else {
          Month = Month - 1
          Day = Day + this.getDaysInMonth(Year, Month) - 1
        }
      } else {
        Day = Day - 1
      }
    }
    if (n === 4) {
      var Nowdate = new Date()
      var WeekFirstDay = new Date(Nowdate - (Nowdate.getDay() - 1) * 86400000)
      if (Nowdate.getDay() === 0) {
        WeekFirstDay = new Date(Nowdate - 6 * 86400000)
      }
      Year = WeekFirstDay.getFullYear()
      Month = WeekFirstDay.getMonth() + 1
      Day = WeekFirstDay.getDate()
    }
    if (n === 5) {
      Year = day.getFullYear()
      Month = day.getMonth()
      if (Month === 0) {
        Month = 12
        Year = Year - 1
      }
      Day = this.getTheMonthLastDay(Year, Month)
    }
    if (n === 9) {
      Year = day.getFullYear()
      Month = day.getMonth()
      if (Month === 0) {
        Month = 12
        Year = Year - 1
      }
      Day = 1
    }
    if (n === -7) {
      Year = day.getFullYear()
      Month = day.getMonth() + 1
      Day = day.getDate()
      if (Day < 8) {
        if (Month === 1) {
          Year = Year - 1
          Month = 12
          Day = Day + this.getDaysInMonth(Year, Month) - 7
        } else {
          Month = Month - 1
          Day = Day + this.getDaysInMonth(Year, Month) - 7
        }
      } else {
        Day = Day - 7
      }
    }
    if (n === -8) {
      Year = day.getFullYear()
      Month = day.getMonth() + 1
      Day = day.getDate()
      if (Day < 9) {
        if (Month === 1) {
          Year = Year - 1
          Month = 12
          Day = Day + this.getDaysInMonth(Year, Month) - 8
        } else {
          Month = Month - 1
          Day = Day + this.getDaysInMonth(Year, Month) - 8
        }
      } else {
        Day = Day - 8
      }
    }
    if (n === -3) {
      Year = day.getFullYear()
      Month = day.getMonth() + 1
      Day = day.getDate()
      if (Day < 4) {
        if (Month === 1) {
          Year = Year - 1
          Month = 12
          Day = Day + this.getDaysInMonth(Year, Month) - 3
        } else {
          Month = Month - 1
          Day = Day + this.getDaysInMonth(Year, Month) - 3
        }
      } else {
        Day = Day - 3
      }
    }
    if (n === -2) {
      Year = day.getFullYear()
      Month = day.getMonth() + 1
      Day = day.getDate()
      if (Day < 3) {
        if (Month === 1) {
          Year = Year - 1
          Month = 12
          Day = Day + this.getDaysInMonth(Year, Month) - 2
        } else {
          Month = Month - 1
          Day = Day + this.getDaysInMonth(Year, Month) - 2
        }
      } else {
        Day = Day - 2
      }
    }
    if (n === -4) {
      Year = day.getFullYear()
      Month = day.getMonth() + 1
      Day = day.getDate()
      if (Day < 5) {
        if (Month === 1) {
          Year = Year - 1
          Month = 12
          Day = Day + this.getDaysInMonth(Year, Month) - 4
        } else {
          Month = Month - 1
          Day = Day + this.getDaysInMonth(Year, Month) - 4
        }
      } else {
        Day = Day - 4
      }
    }

    CurrentDate += Year + '-'
    if (Month >= 10) {
      CurrentDate += Month + '-'
    } else {
      CurrentDate += '0' + Month + '-'
    }

    if (Day >= 10) {
      CurrentDate += Day
    } else {
      CurrentDate += '0' + Day
    }
    return CurrentDate
  },
  /**
   * 0 当前时间 -3 历史三天 -4 历史四天
   */
  getDate (num) {
    if (!num) {
      num = 0
    }
    var day = 1000 * 60 * 60 * 24
    var date = +new Date()
    var d = date = date + num * day
    d = new Date(d)
    var year = d.getFullYear()
    var month = (d.getMonth() + 1) < 10 ? ('0' + (d.getMonth() + 1)) : (d.getMonth() + 1)
    var dd = d.getDate() < 10 ? ('0' + d.getDate()) : d.getDate()
    return year + '-' + month + '-' + dd
  },
  /**
   * 时间戳转日期
   * @param {*} timestamp 时间戳
   * @param {*} format 格式化字符串
   */
  stampToDate (timestamp, format) {
    format = !format ? 'YYYY-MM-DD HH:mm:ss' : format
    return moment(new Date(timestamp * 1000)).format(format)
  },
  /**
   * 日期转Unix时间戳
   * @param {*} date 日期格式
   * @param {*} i 0：转换成秒  1：转换成毫秒
   */
  dateToStamp (date, i) {
    var timestamp = moment(new Date(date).getTime()).valueOf()
    if (i === 0) {
      timestamp = timestamp / 1000
    }
    return timestamp
  }
}

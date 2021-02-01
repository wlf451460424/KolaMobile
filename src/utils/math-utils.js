import * as math from 'mathjs'

import { BigNumber } from 'bignumber.js'

export default {
  /**
   * 两数相加
   * @param { Number } n1
   * @param { Number } n2
   */
  add (n1, n2) {
    return math.number(math.format(math.add(math.bignumber(n1), math.bignumber(n2))))
  },
  // add (_num1, _num2, precision) {
  //   if (!precision) {
  //     precision = 2
  //   }
  //   return this.moveLeft(
  //     this.moveRight(_num1, precision) + this.moveRight(_num2, precision),
  //     precision
  //   )
  // },
  /**
   * 两数相减
   * @param { Number } n1
   * @param { Number } n2
   */
  minus (n1, n2) {
    return math.number(math.format(math.subtract(math.bignumber(n1), math.bignumber(n2))))
  },
  // minus (minuend, reduction, precision) {
  //   if (!precision) {
  //     precision = 2
  //   }
  //   return this.moveLeft(
  //     this.moveRight(minuend, precision) - this.moveRight(reduction, precision),
  //     precision
  //   )
  // },
  /**
   * 两数相乘
   * @param { Number } n1
   * @param { Number } n2
   */
  multiply (n1, n2) {
    return math.number(math.format(math.multiply(math.bignumber(n1), math.bignumber(n2))))
  },
  // multiply (_num1, _num2, precision) {
  //   if (!precision) {
  //     precision = 2
  //   }
  //   return this.moveLeft(
  //     this.moveRight(_num1, precision) * this.moveRight(_num2, precision),
  //     precision * 2
  //   )
  // },
  /**
   * 两数相除
   * @param { Number } n1
   * @param { Number } n2
   */
  divide (n1, n2) {
    return math.number(math.format(math.divide(math.bignumber(n1), (math.bignumber(n2)))))
  },
  // divide (_num1, _num2, precision) {
  //   if (!precision) {
  //     precision = 2
  //   }
  //   return this.moveRight(_num1, precision) / this.moveRight(_num2, precision)
  // },
  /**
   * 两数取整
   * @param { Number } n1
   * @param { Number } n2
   */
  dividedToInt (n1, n2) {
    return math.number(math.format(math.bignumber(n1).dividedToIntegerBy(math.bignumber(n2))))
  },
  /**
   * 阶和
   * @param { Number } n
   */
  getSum (n) {
    if (n <= 0) return 0
    return n < 2 ? 1 : n + this.getSum(n - 1)
  },
  /**
   * Cm n
   * @param { Number } m
   * @param { Number } n
   */
  // getCCombination (m, n) {
  //   return math.combinations(m, n)
  // },
  getCCombination (m, n) {
    const i = m - n
    if (i < 0) {
      return 0
    } else if (i === 0) {
      return 1
    } else {
      if (i < n) {
        const b = this.getNtoMMultiplySum(n, m)
        const bigBumberB = new BigNumber(b)
        const c = this.getMultiplySum(i)
        const bigBumberC = new BigNumber(c)
        return Math.floor(bigBumberB.dividedBy(bigBumberC))
      } else {
        const b = this.getNtoMMultiplySum(i, m)
        const bigBumberB = new BigNumber(b)
        const c = this.getMultiplySum(n)
        const bigBumberC = new BigNumber(c)
        return Math.floor(bigBumberB.dividedBy(bigBumberC))
      }
    }
  },
  /**
   * 计算从(n+1)*(n+2)*(n+3)*...*m的值 m>n
   */
  getNtoMMultiplySum (n, m) {
    let sum = new BigNumber(1)
    if (m < n) {
      return 0
    }
    if (m === n) {
      return 1
    }
    for (let i = n + 1; i <= m; i++) {
      const bigInteger = new BigNumber(i)
      sum = bigInteger.times(sum)
    }
    return sum
  },
  /**
   * An n的计算方法 计算从1*2*3*...*n的值 n>=1
   */
  getMultiplySum (n) {
    return this.getNtoMMultiplySum(1, n)
  },
  /**
   * Am n
   * @param { Number } m
   * @param { Number } n
   */
  getACombination (m, n) {
    // return math.multiply(math.combinations(m, n), math.factorial(n))
    return this.getNtoMMultiplySum(m - n, m)
  },
  /**
   * 从数组中随机选择n个不同的数
   * @param { Number } n
   * @param { Array } arr
   */
  getDifferentNumsFromArray (n, arr) {
    return math.pickRandom(arr, n)
  },
  /**
   * 从[m, n]中随机选择1个数
   * @param { Number } m
   * @param { Number } n
   */
  getRandomNum (m, n) {
    return math.randomInt(m, n)
  },
  /**
   * 返回[m, n] 的一个数组
   * @param { Number } m
   * @param { Number } n
   */
  getArray (m, n) {
    return Array.from(Array(n - m + 1), (v, i) => i + m)
  },
  /**
   * 从[m, n]中选择k个数，组成数组，这k个数彼此不同
   * @param { Number } m
   * @param { Number } n
   * @param { Number } k
   */
  getDifferentNums (m, n, k) {
    return this.getDifferentNumsFromArray(this.getArray(m, n), k)
  },
  /**
   * 从[m, n]中选择k个数，组成数组，这k个数中可以有相同的数
   * @param { Number } m
   * @param { Number } n
   * @param { Number } k
   */
  getNums (m, n, k) {
    let arr = []
    for (let i = 0; i < k; i++) {
      arr.push(this.getRandomNum(m, n))
    }
    return arr
  },
  /**
   * 组合数
   * @param {*} n
   * @param {*} arr1
   * @param {*} arr2
   */
  getArraySelect (n, arr1, arr2) {
    let result = 0
    for (let i = 0; i < arr1.length; i++) {
      let m = 0
      for (let j = 0; j < arr2.length; j++) {
        if (arr1[i].ballValue !== arr2[j].ballValue) {
          m++
        }
      }
      result += this.getCCombination(m, n)
    }
    return result
  },
  cominationSum (candidates, target, sum, arr, start, results, n) {
    if (arr.length > n) {
      return
    }
    if (target < sum) {
      return
    }
    if (target === sum && arr.length === n) {
      return results.push(arr.slice())
    } else {
      for (let i = start; i < candidates.length; i++) {
        arr.push(candidates[i])
        this.cominationSum(candidates, target, sum + candidates[i], arr, i, results, n)
        arr.pop()
      }
    }
  },
  /**
   * 求和值注数
   * @param { Array } candidates  参与计算的数值
   * @param { Number } target    和值
   * @param { Number } n    三星/二星
   * @param { Boolean } flag   直选/组选
   */
  getCombinationSum (candidates, target, n, flag) {
    let results = []
    let temp = []
    this.cominationSum(candidates, target, 0, temp, 0, results, n)
    let notes = 0
    for (let i = 0; i < results.length; i++) {
      const element = results[i]
      let uniqueArray = Array.from(new Set(element))
      if (uniqueArray.length === 1) {
        if (flag) {
          notes += 1
        }
      } else if (uniqueArray.length === 2) { //
        if (flag) { // 直选
          if (n === 3) { // 三星组三
            notes += 3
          } else if (n === 2) { // 二星
            notes += 2
          }
        } else { // 组选
          notes += 1
        }
      } else if (uniqueArray.length === 3) { // 组六
        if (flag) {
          notes += 6
        } else {
          notes += 1
        }
      }
    }
    return notes
  },
  /**
   * 投注模式转换显示文字
   */
  modeTransferName  (val) {
    let str = ''
    if (val === 4) str = '元'
    if (val === 2) str = '角'
    if (val === 1) str = '分'
    if (val === 8) str = '厘'
    return str
  },
  modeTransferMoney (val) {
    let value = 2
    if (val === 4) value = 2
    if (val === 2) value = 0.2
    if (val === 1) value = 0.02
    if (val === 8) value = 0.002
    return value
  },
  /**
   * 投注模式转换显示文字
   */
  floatPointProcess (val) {
    var value = parseFloat(val)
    if (isNaN(value)) {
      return false
    }
    value = Math.round(val * 100) / 100
    var s = value.toString()
    var rs = s.indexOf('.')
    if (rs < 0) {
      rs = s.length
      s += '.'
    }
    while (s.length <= rs + 2) {
      s += '0'
    }
    return s
  },
  /**
   * 计算组合数个数
   */
  Cnm (n, m) {
    // 7 25
    var fangzi = 1
    var fengmu = 1
    for (var i = 1; i <= n; i += 1) {
      fengmu = fengmu * i
    }
    for (var j = 0; j < n; j += 1) {
      fangzi = fangzi * (m - j)
    }
    return fangzi / fengmu
  },
  getSanKuadu (num) {
    let temp = 0
    switch (num) {
      case 0:
        temp = 10
        break
      case 1:
      case 9:
        temp = 54
        break
      case 2:
      case 8:
        temp = 96
        break
      case 3:
      case 7:
        temp = 126
        break
      case 4:
      case 6:
        temp = 144
        break
      case 5:
        temp = 150
        break
    }
    return temp
  },

  /**
   * 计算二星直选跨度
   */
  getErKuadu (num) {
    let temp = 0
    switch (num) {
      case 0:
      case 5:
        temp = 10
        break
      case 1:
        temp = 18
        break
      case 2:
        temp = 16
        break
      case 3:
        temp = 14
        break
      case 4:
        temp = 12
        break
      case 6:
        temp = 8
        break
      case 7:
        temp = 6
        break
      case 8:
        temp = 4
        break
      case 9:
        temp = 2
        break
    }
    return temp
  },
  /**
   * 计算二星直选和值的注数
   *
   * @param num
   * @return
   */
  getErXingZhiXuanHeZhiNote (num) {
    let temp = 0
    switch (num) {
      case 0:
      case 18:
        temp = 1
        break
      case 1:
      case 17:
        temp = 2
        break
      case 2:
      case 16:
        temp = 3
        break
      case 3:
      case 15:
        temp = 4
        break
      case 4:
      case 14:
        temp = 5
        break
      case 5:
      case 13:
        temp = 6
        break
      case 6:
      case 12:
        temp = 7
        break
      case 7:
      case 11:
        temp = 8
        break
      case 8:
      case 10:
        temp = 9
        break
      case 9:
        temp = 10
        break
      default:
        break
    }
    return temp
  },

  /**
   * 计算二星组选和值的注数
   *
   * @param num
   * @return
   */
  getErXingZuXuanHeZhiNote (num) {
    let temp = 0
    switch (num) {
      case 0:
      case 1:
      case 2:
      case 16:
      case 17:
      case 18:
        temp = 1
        break
      case 3:
      case 4:
      case 14:
      case 15:
        temp = 2
        break
      case 5:
      case 6:
      case 12:
      case 13:
        temp = 3
        break
      case 7:
      case 8:
      case 10:
      case 11:
        temp = 4
        break
      case 9:
        temp = 5
        break
      default:
        break
    }
    return temp
  },
  /**
   * 计算排列3，福彩3D直选和值的注数
   *
   * @param num
   * @return
   */
  getZhiXuanHeZhiNote (num) {
    let temp = 0
    switch (num) {
      case 0:
      case 27:
        temp = 1
        break
      case 1:
      case 26:
        temp = 3
        break
      case 2:
      case 25:
        temp = 6
        break
      case 3:
      case 24:
        temp = 10
        break
      case 4:
      case 23:
        temp = 15
        break
      case 5:
      case 22:
        temp = 21
        break
      case 6:
      case 21:
        temp = 28
        break
      case 7:
      case 20:
        temp = 36
        break
      case 8:
      case 19:
        temp = 45
        break
      case 9:
      case 18:
        temp = 55
        break
      case 10:
      case 17:
        temp = 63
        break
      case 11:
      case 16:
        temp = 69
        break
      case 12:
      case 15:
        temp = 73
        break
      case 13:
      case 14:
        temp = 75
        break
      default:
        break
    }
    return temp
  },
  /**
   * 计算三星组选和值的注数
   *
   * @param num
   * @return
   */
  getSanXingZuXuanHeZhiNote (num) {
    let temp = 0
    switch (num) {
      case 1:
      case 26:
        temp = 1
        break
      case 2:
      case 3:
      case 24:
      case 25:
        temp = 2
        break
      case 4:
      case 23:
        temp = 4
        break
      case 5:
      case 22:
        temp = 5
        break
      case 6:
      case 21:
        temp = 6
        break
      case 7:
      case 20:
        temp = 8
        break
      case 8:
      case 19:
        temp = 10
        break
      case 9:
      case 18:
        temp = 11
        break
      case 10:
      case 17:
        temp = 13
        break
      case 11:
      case 12:
      case 15:
      case 16:
        temp = 14
        break
      case 13:
      case 14:
        temp = 15
        break
      default:
        break
    }

    return temp
  },
  fomatFloat (src, n) {
    src = src + ''
    if (!n) n = 2 // 默认保留两位小数、
    if (src.indexOf('.') === -1) return src
    return src.substr(0, src.indexOf('.') + (n + 1))
  },
  moveRight (_number, _pointcount) {
    let flag = 1
    if (_number < 0) {
      flag = -1
      _number = _number * -1
    }
    const numStr = _number.toString()
    const strArr = numStr.split('.')
    let rightStr = strArr.length > 1 ? strArr[1] : ''
    // 在不足移动的位数后补0;
    if (rightStr.length < _pointcount) {
      const addZero = []
      for (let i = rightStr.length; i < _pointcount; i++) {
        addZero.push('0')
      }
      rightStr = rightStr + addZero.join('')
    }
    return (
      Number(
        strArr[0] +
        rightStr.substring(0, _pointcount) +
        '.' +
        rightStr.substr(_pointcount)
      ) * flag
    )
  },
  moveLeft (_number, _pointcount) {
    let flag = 1
    if (_number < 0) {
      flag = -1
      _number = _number * -1
    }
    // number转换为string ,方便后续操作。
    const numStr = _number.toString()
    // 按照小数点分隔字符串,
    const strArr = numStr.split('.')
    let num = 0
    const zeroArr = []
    // 生成移动位数+1的0 ,补到分隔后的第一个字符串中,兼容0.XXX的情况。开头多余的零会在调用Number方法时去掉。
    while (num < _pointcount + 1) {
      zeroArr.push('0')
      num++
    }
    const leftStr = zeroArr.join('') + strArr[0]
    const leftArr = leftStr.split('')
    // 插入移动后的小数点。
    leftArr.splice(leftStr.length - _pointcount, 0, '.')
    let result = leftArr.join('')
    // 拼接原始值小数点后的数字
    if (strArr.length > 1) {
      result += strArr[1]
    }
    return Number(result) * flag
  },
  /**
   * 计算A n m组合个树
   */
  Anm (n, m) {
    if (n > m) return 0
    return this.factorial(m) / this.factorial(m - n)
  },
  /**
   * 计算n的阶乘、
   */
  factorial (n) {
    return n > 1 ? n * this.factorial(n - 1) : 1
  }
}

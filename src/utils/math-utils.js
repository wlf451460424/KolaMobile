import * as math from 'mathjs'

export default {
  /**
   * 两数相加
   * @param { Number } n1
   * @param { Number } n2
   */
  add (n1, n2) {
    return math.number(math.format(math.add(math.bignumber(n1), math.bignumber(n2))))
  },
  /**
   * 两数相减
   * @param { Number } n1
   * @param { Number } n2
   */
  minus (n1, n2) {
    return math.number(math.format(math.subtract(math.bignumber(n1), math.bignumber(n2))))
  },
  /**
   * 两数相乘
   * @param { Number } n1
   * @param { Number } n2
   */
  multiply (n1, n2) {
    return math.number(math.format(math.multiply(math.bignumber(n1), math.bignumber(n2))))
  },
  /**
   * 两数相除
   * @param { Number } n1
   * @param { Number } n2
   */
  divide (n1, n2) {
    return math.number(math.format(math.divide(math.bignumber(n1), (math.bignumber(n2)))))
  },
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
  getCCombination (m, n) {
    return math.combinations(m, n)
  },
  /**
   * Am n
   * @param { Number } m
   * @param { Number } n
   */
  getACombination (m, n) {
    return math.multiply(math.combinations(m, n), math.factorial(n))
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
    for (let n1 in arr1) {
      let count = 0
      for (let n2 in arr2) {
        if (n1 !== n2) {
          count++
        }
      }
      result = +this.getCCombination(count, n)
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
  }
}

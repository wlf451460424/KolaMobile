import LotteryApi from '@api/lottery'
import MathUtils from '@utils/math-utils'
import ToastUtils from '@common/toast'
import store from '@store'

export default {
  playId: '',
  awardInfo: [],
  textareaArr: [],
  textContent: '',
  playPrize: 0,
  maxBetMultiple: 9999,
  orderNo: '',
  singleMode: 0, // 单期风险控制提醒
  singleQuota: 0, // 单期最高奖金
  soloMode: 0, // 单挑风险控制提醒
  soloCount: 0,
  soloAmt: 0,
  soloMaxAmt: 0,
  lotteryList: [],
  supportedMode: 1,
  getBetRebate () {
    const userRebate = store.state.userInfo.rebate
    const merchantRebate = store.state.lottery.merchant_rebate
    const lotteryRebate = store.state.lottery.lottery_rebate
    return MathUtils.minus(lotteryRebate, MathUtils.minus(merchantRebate, userRebate))
  },
  /**
   * 获取任选二三四的球位置、
   */
  getOptionalLocation (num, betArray) {
    if (!num) num = 5
    var arr = []
    arr.push(betArray[0].length === 0 ? '*' : betArray[0].map(ball => {
      return ball.ballText
    }).join(','))
    arr.push(betArray[1].length === 0 ? '*' : betArray[1].map(ball => {
      return ball.ballText
    }).join(','))
    arr.push(betArray[2].length === 0 ? '*' : betArray[2].map(ball => {
      return ball.ballText
    }).join(','))
    if (num === 5) {
      arr.push(betArray[3].length === 0 ? '*' : betArray[3].map(ball => {
        return ball.ballText
      }).join(','))
      arr.push(betArray[4].length === 0 ? '*' : betArray[4].map(ball => {
        return ball.ballText
      }).join(','))
    }
    return arr.join('|')
  },
  getUnit (unit) {
    if (unit === 1) {
      return 1
    } else if (unit === 2) {
      return 0.1
    } else if (unit === 3) {
      return 0.01
    } else {
      return 0.001
    }
  },
  calculateMoney (vueObj) {
    const nodeNum = vueObj.notes
    const multiple = vueObj.multipleValue
    const unit = vueObj.mode[0] + 1
    const rebate = this.getBetRebate()
    const playId = this.getPlayId()
    const tm1 = MathUtils.multiply(nodeNum, multiple)
    const tm2 = MathUtils.multiply(tm1, this.getUnit(unit))
    const totalMoney = MathUtils.multiply(tm2, this.getSingleAmount())
    this.playId = playId
    const awardArr = this.awardInfo
    if (awardArr.length === 0) {
      return false
    }
    let maxPrize = this.getCalculatePrize(awardArr[0], rebate, multiple) // 预期奖金
    maxPrize = this.fomatMode(maxPrize, unit)
    let expectProfit = 0
    if (nodeNum >= 1) {
      if (awardArr.length === 1) {
        expectProfit = MathUtils.minus(maxPrize, totalMoney)
        expectProfit = MathUtils.fomatFloat(expectProfit, 4)
      } else {
        let minPrize = this.getCalculatePrize(awardArr[1], rebate, multiple)
        minPrize = this.fomatMode(minPrize, unit)
        expectProfit =
        MathUtils.fomatFloat(MathUtils.minus(minPrize, totalMoney), 4) +
          '~' +
          MathUtils.fomatFloat(MathUtils.minus(maxPrize, totalMoney), 4)
      }
    }
    vueObj.bonus = MathUtils.fomatFloat(totalMoney, 4)
    vueObj.profit = expectProfit
  },
  /**
   * 元模式情况的奖金
   * @param award
   * @param rebate
   * @param multiple
   * @returns
   */
  getCalculatePrize (award, rebate, multiple) {
    const tempv1 = MathUtils.multiply(award, rebate)
    const tempv2 = MathUtils.multiply(tempv1, multiple)
    return MathUtils.divide(tempv2, 1000)
  },
  /**
   * 元模式保留两位、
   * 最小的厘模式最多保留4位、
   * @param maxPrize
   * @param unit
   * @returns
   */
  fomatMode (maxPrize, unit) {
    let prize = MathUtils.fomatFloat(maxPrize, 2) // 元模式的金额保留两位小数、作为原始数据、
    prize = MathUtils.multiply(parseFloat(prize), this.getUnit(unit))
    const decimalArr = prize.toString().split('.')
    prize = prize.toString()
    if (decimalArr.length > 1 && decimalArr[1].length > 4) {
      prize = prize.substr(0, prize.length - 1) // 厘模式最多保留4位小数、
      prize = MathUtils.fomatFloat(prize, 4)
    }
    return prize
  },
  textareaAssist (that, flag_type, vue) {
    const selectPlayId = that.getPlayId()
    switch (that.getType()) {
      case 1:
        that.transformArr(
          that.getRegMacthForSSC(selectPlayId),
          flag_type,
          vue
        )
        break
      case 8:
        that.transformArr(
          that.getRegMacthForWelfare3D(selectPlayId),
          flag_type,
          vue
        )
        break
      case 9:
        that.transformArr(that.getRegMacthForPermutation5(), flag_type, vue)
        break
      case 5:
        that.transformArr(
          that.getRegMacthForSHSSL(selectPlayId),
          flag_type,
          vue
        )
        break
      case 2:
      case 4:
        that.getDoubleVerification(selectPlayId, flag_type, vue)
        break
      default:
        throw new Error('hanlder textarea mouseout type is error...')
    }
  },
  /**
   * 时时彩、3d…………
   * 校验并计算文本框注数
   */
  transformArr (reg, flag_type, vue) {
    const selectPlayId = this.getPlayId()
    const _lotteryType = this.getType()
    const content = this.getTextContent().ballValues
    const errorArr = []
    let beforeVerificationArr = []
    let verified
    this.textareaArr = content.split(/\s+|\/,|\/，|\/;|；/)
    if (flag_type === 0) {
      if (_lotteryType === 8 && selectPlayId === 6) {
        for (let i = 0; i < this.textareaArr.length; i++) {
          if (this.textareaArr[i].trim()) {
            verified = this.miming3D(this.textareaArr[i])
          }
          if (!verified) {
            errorArr.push(this.textareaArr[i])
          } else {
            beforeVerificationArr.push(this.textareaArr[i])
          }
        }
      } else if (_lotteryType === 1 && (selectPlayId === 96 || selectPlayId === 97)) {
        for (let i = 0; i < this.textareaArr.length; i++) {
          if (this.textareaArr[i].trim()) {
            verified = this.randomOption3Single(this.textareaArr[i])
          }
          if (!verified) {
            errorArr.push(this.textareaArr[i])
          } else {
            beforeVerificationArr.push(this.textareaArr[i])
          }
        }
      } else {
        for (var i = 0; i < this.textareaArr.length; i++) {
          if (this.textareaArr[i].trim()) {
            verified = this.textareaArr[i].match(reg)
          }
          if (!verified) {
            errorArr.push(this.textareaArr[i])
          } else {
            beforeVerificationArr.push(this.textareaArr[i])
          }
        }
      }
    } else {
      beforeVerificationArr = this.textareaArr
    }
    this.handlerRepeat(beforeVerificationArr, errorArr, flag_type, vue)
  },
  /**
   * 时时彩正则验证
   */
  getRegMacthForSSC (playId) {
    var reg = ''
    if (playId === 4) {
      /* 五星直选 */
      reg = /^\d{5}$/
    } else if (playId === 13 || playId === 19) {
      /* 四星前四（后四）直选 */
      reg = /^\d{4}$/
    } else if (playId === 25 || playId === 36 || playId === 47) {
      /* 三星前三（中三、后三）直选 */
      reg = /^\d{3}$/
    } else if (playId === 30 || playId === 41 || playId === 52) {
      /* 三星前三（中三、后三）混合组选----- */
      reg = /^(?=\d+)(?!([\d])\1{2})[\d]{3}$/
      // msg= "  格式不正确(不能有豹子号)";
    } else if (playId === 58 || playId === 65) {
      /* 前二（后二）直选 */
      reg = /^\d{2}$/
    } else if (playId === 88) {
      /* 任选二直选单式 */
      reg = /^\d{2}$/
    } else if (playId === 91) {
      /* 任选二组选单式 */
      reg = /^(?=\d+)(?!([\d])\1{1})[\d]{2}$/
      // msg = "  格式不正确(不能有对子号)"
    } else if (playId === 94) {
      /* 任选三直选单式 */
      reg = /^\d{3}$/
    } else if (playId === 97) {
      /* 任选三组三单式 */
      // reg = /^\d{3}$/;
    } else if (playId === 99) {
      /* 任选三组六单式----- */
      reg = /^(?!\d*?(\d)\d*?\1)\d{3}$/
    } else if (playId === 100) {
      /* 任选三混合组选 */
      reg = /^(?=\d+)(?!([\d])\1{2})[\d]{3}$/
    } else if (playId === 103) {
      /* 任选四直选单式----- */
      reg = /^\d{4}$/
    }
    return reg
  },
  /**
   * 任选三组三单式、
   * @param msg
   * @returns {Boolean}
   */
  randomOption3Single (msg) {
    var a = msg.split('')
    if (!msg.match(/^\d{3}$/)) return false
    if (
      (a[0] === a[1] && a[0] !== a[2]) ||
      (a[0] === a[2] && a[1] !== a[2]) ||
      (a[2] === a[1] && a[0] !== a[2])
    ) {
      return true
    }
  },
  /**
   * 数组去重、
   * @param arr 原始错误数组
   * @param reg 正则
   */
  handlerRepeat (beforeVerificationArr, errorArr, flag_type, vue) {
    const selectPlayId = this.getPlayId()
    const repeatArr = []
    let errorFlag = false
    const obj = {}
    const that = this
    var msgRepeat = ''
    var msgError = ''
    if (flag_type === 0) {
      var _errLength = errorArr.length
      if (_errLength > 0 && _errLength <= 50) {
        msgError =
          '以下错误号码，已自动过滤：<br/>' + errorArr.join(',') + '<br/>'
        errorFlag = true
      } else if (_errLength > 50) {
        msgError = '输入框中存在错误号码，已自动过滤'
        errorFlag = true
      }
    } else {
      this.isCompositionPlay(selectPlayId + '', true) &&
        (beforeVerificationArr = this.fifterRepeat(beforeVerificationArr))
      for (var i = 0; i < beforeVerificationArr.length; i++) {
        var _key = beforeVerificationArr[i].trim().replace(/(\s)+/g, '')
        if (!obj[_key]) {
          obj[_key] = _key
        } else {
          repeatArr.push(beforeVerificationArr[i])
        }
      }
      var _repeatLength = repeatArr.length
      if (_repeatLength > 0 && _repeatLength <= 50) {
        msgRepeat =
          '以下重复号码，已自动过滤：<br/>' + repeatArr.join(',') + '<br/>'
        errorFlag = true
      } else if (_repeatLength > 50) {
        msgRepeat = '重复号码，已自动过滤'
        errorFlag = true
      }
    }
    if (errorFlag) {
      that.textareaArr = []
      if (flag_type === 0) {
        that.textareaArr = beforeVerificationArr
      } else {
        for (var o in obj) {
          that.textareaArr.push(o)
        }
      }
      ToastUtils.showText(msgError || msgRepeat)
    }
    this.reCalNote(vue)
  },
  fifterRepeat (orginalArr) {
    const _lotteryType = this.getType()
    const resultArr = []
    const isDouble = this.getJoiner(_lotteryType)
    let reg
    let joiner
    if (isDouble) {
      reg = /[\s+]/g
      joiner = ' '
    } else {
      joiner = reg = ''
    }
    for (let i = 0; i < orginalArr.length; i++) {
      const record = orginalArr[i]
      const sortedArr = record.split(reg).sort((a, b) => {
        return parseInt(a) > parseInt(b) ? 1 : -1
      })
      resultArr.push(sortedArr.join(joiner))
    }

    return resultArr
  },
  /**
   * 判断是否任选单式、
   * 任选单式需要排序、
   */
  isCompositionPlay (pid, isTextarea) {
    var compositionFlag = false
    const _lotteryType = this.getType()
    if (_lotteryType === 1) {
      if (isTextarea && pid.match(/^(30|41|52|91|97|99|100)$/)) {
        compositionFlag = true
      }
    } else if (_lotteryType === 2 || _lotteryType === 4) {
      if (isTextarea && pid.match(/^(5|6|7|18|19|20|21|22|23|24|25|26|27|28|29|30|31|32|33|34|35|36|37|38|39|40)$/)) {
        compositionFlag = true
      }
    } else if (_lotteryType === 5) {
      if (isTextarea && pid.match(/^(13|15)$/)) {
        compositionFlag = true
      }
    } else if (_lotteryType === 8) {
      if (isTextarea && pid.match(/^(16)$/)) {
        compositionFlag = true
      }
    }
    return compositionFlag
  },
  /**
   * 计算textarea 的注数与金额、
   */
  reCalNote (vue) {
    const selectPlayId = this.getPlayId()
    const that = this
    const arr = that.textareaArr
    let resultArr = []
    for (let i = 0; i < arr.length; i++) {
      arr[i] && resultArr.push(arr[i])
    }
    this.isCompositionPlay(selectPlayId + '', true) &&
      (resultArr = this.fifterRepeat(resultArr))
    const num = resultArr.length
    // 判断是否是任选 //$('#_w').attr('id')
    if (vue.isOptional) {
      var total = that.calculateOptionalNum(vue)
      vue.notes = num * total
    } else {
      vue.notes = num
    }

    var separator = that.getJoiner(that.getType()) ? ',' : ' '
    this.textContent = resultArr.join(separator)
    that.calculateMoney(vue)
  },
  /**
   * 11X5 pk10
   * type 2 ， 4 用【，】分割
   */
  getJoiner (type) {
    return [2, 4].includes(type)
  },
  /**
     * 计算任选注数
     */
  calculateOptionalNum (vue) {
    let totle = 0
    const p = this.getPlayId()
    const checkboxCheckedLength = this.getBallsPosition().length
    if (p === 88 || p === 91) {
      // 任选二组选单式
      totle = MathUtils.Cnm(2, checkboxCheckedLength)
    } else if (p === 94 || p === 97 || p === 99 || p === 100) {
      // 任选三混合组选
      totle = MathUtils.Cnm(3, checkboxCheckedLength)
    } else if (p === 103) {
      // 任选四直选单式
      totle = MathUtils.Cnm(4, checkboxCheckedLength)
    }
    return totle
  },
  getPlayId () {
    return store.state.lottery.lottery_play_id
  },
  // 获取商户配置的单注金额
  getSingleAmount () {
    return store.state.lottery.bet_single_amount
  },
  getType () {
    /**
   * 时时彩--》1
   * 11x5--》2
   * 快乐8--》3
   * PK10--》4
   * 时时乐--》5
   * 快乐十分--》6
   * 快三--》 7
   * 3D--》8
   * 排列五 --》9
   */
    return store.state.lottery.lottery_type
  },
  getLotteryId () {
    return store.state.lottery.lottery_no
  },
  getTextContent () {
    let ballTexts, ballValues
    let betArray = store.state.lottery.selectedBalls
    ballTexts = betArray[0].map(item => {
      return item.ballText
    }).join(' ')
    ballValues = betArray[0].map(item => {
      return item.ballValue
    }).join(' ')
    return { ballTexts, ballValues }
  },
  /**
   *
   * @param {*} betArray
   * @param {*} isOptional 任选
   */
  getContent (betArray, isOptional) {
    const _lotteryId = this.getLotteryId()
    const _lotteryType = this.getType()
    let betContent
    const playId = this.getPlayId()
    const PlayCode = _lotteryId + '' + this.playId
    let arrFinal = []
    let arrContent = []
    let ballTexts = betArray[0].map(item => {
      return item.ballText
    })
    var originalContent = ballTexts[0]
    var resultArr = this.str2Arr(originalContent)
    var arr = resultArr[0]
    switch (_lotteryType) {
      case 1:
        // let ballTexts = betArray[0].map(item => {
        //   return item.ballText
        // })
        // var originalContent = ballTexts[0]
        // var resultArr = this.str2Arr(originalContent)
        // var arr = resultArr[0]
        var CombinationArr = [30, 41, 52] // 时时彩混合组选id
        var isCombination = CombinationArr.includes(playId)
        if (playId === 4) {
          betContent = arr.join(' ')
        } else {
          for (var i = 0; i < arr.length; i++) {
            var item = arr[i]
            if (isOptional) {
              /* 任选粘贴 */
              arrFinal = this.optionalConcat(arrFinal, item, ',')
            } else if (isCombination) {
              arrFinal = this.optionalConcat(arrFinal, item, ',')
            } else {
              /* 非五星粘贴 */
              arrFinal = this.optionalConcat(arrFinal, item, '|')
            }
          }
          if (isOptional) {
            /* 任选粘贴 */
            betContent = arrFinal.join(' ') + '#' + this.getBallsPosition().join('')
          } else {
            betContent = arrFinal.join(' ')
          }
        }
        break
      case 2:
      case 4:
        arrContent = originalContent.split(',')
        arr = []
        for (let i = 0; i < arrContent.length; i++) {
          item = arrContent[i].trim() // $.trim( 去空格
          // 只能匹配数字 逗号 空格/[0-9,\s]+/
          if (item === '') {
            /* 输入格式有误、 */
            return false
          }

          var tempArr = item.split(/[\s+]/g)
          if (tempArr.length <= 1) {
            tempArr = item.match(/(\d){2}/g)
          }
          var optionalParseArr = [26, 27, 28, 29, 30, 31, 32, 33] // 任选单式
          var simplexArr = [1, 2, 3, 4, 8, 9, 10, 11] // 前二单式、前三单式、
          var multipleArr = [5, 6, 7, 12, 13, 14] // 前二组选、前三组选、
          var pk10arr = [2, 3, 4, 5, 6, 7, 8, 9]
          var pk10Boolean = pk10arr.includes(this.playId) && _lotteryType === 4
          // tempArr = this.add0ForArr(tempArr)
          if (optionalParseArr.includes(this.playId)) {
            arr.push(tempArr.join(','))
          } else if (simplexArr.includes(this.playId) || pk10Boolean) {
            arr.push(tempArr.join('|'))
          } else if (multipleArr.includes(this.playId)) {
            arr.push(tempArr.join(','))
          }
        }
        betContent = arr.join(' ')
        break
      case 8: // 福彩3d、排列3
      case 9: // 排列5
      case 5: // 上海时时乐
        resultArr = this.str2Arr(originalContent)
        arr = resultArr[0]
        arrFinal = []
        if (resultArr[1]) {
          /* 输入格式有误、 */
          return false
        }

        for (let i = 0; i < arr.length; i++) {
          var _playCode = PlayCode * 1
          switch (_playCode) {
            case 336: // 3D三星混合组选
            case 279: // 上海时时乐前二组选
            case 2710:
            case 2714: // 上海时时乐后二组选
            case 2715:
            case 335: // 3d组六单式
            case 345: // 排列三组六单式
              arrFinal.push(arr[i].split('').join(','))
              break
            default:
              // 直选单式
              arrFinal.push(arr[i].split('').join('|'))
              break
          }
        }
        betContent = arrFinal.join(' ')
        break
      default:
        break
    }
    return betContent
  },
  /**
   * 字符串转数组、
   */
  str2Arr (originalContent) {
    var arrContent = originalContent.split(' ')
    var arr = []
    var flag = false
    var result = []
    for (var i = 0; i < arrContent.length; i++) {
      var item = arrContent[i].trim()
      if (!/^\d*$/.test(item) || item === '') {
        flag = true
      } else {
        arr.push(item)
      }
    }
    result.push(arr)
    result.push(flag)
    return result
  },
  /**
   * 组装粘贴区域的格式、
   */
  optionalConcat (arrFinal, item, connector) {
    arrFinal = arrFinal.concat(item.split('').join(connector))
    return arrFinal
  },
  getBallsPosition () {
    return store.state.lottery.selectedBallsPosition
  },
  /**
   * 替换任选的投注内容
   */
  replaceLocation (content) {
    if (content.indexOf('#')) {
      content = content.replace('#', '$')
    }
    if (content.indexOf('万位')) {
      content = content.replace('万位', '0')
    }
    if (content.indexOf('千位')) {
      content = content.replace('千位', '1')
    }
    if (content.indexOf('百位')) {
      content = content.replace('百位', '2')
    }
    if (content.indexOf('十位')) {
      content = content.replace('十位', '3')
    }
    if (content.indexOf('个位')) {
      content = content.replace('个位', '4')
    }
    return content
  },
  fixedPlayPrize (unit, rebate) {
    if (this.awardInfo.length === 1) {
      this.playPrize = this.fomatMode(
        this.getOriginalPrize(this.awardInfo[0], rebate),
        unit
      )
    } else {
      this.playPrize = this.fomatMode(
        this.getOriginalPrize(this.awardInfo[1], rebate),
        unit
      ) + '~' +
      this.fomatMode(
        this.getOriginalPrize(this.awardInfo[0], rebate),
        unit
      )
    }
    return this.playPrize
  },
  getOriginalPrize (prize, rebate) {
    const tempv1 = MathUtils.multiply(prize, rebate)
    return MathUtils.divide(tempv1, 1000)
  },
  getMultiple (expectPercent, beforeTotal, prize, singleMoney) {
    expectPercent = MathUtils.divide(expectPercent, 100)
    expectPercent = MathUtils.add(expectPercent, 1)
    var denominator = MathUtils.multiply(expectPercent, beforeTotal)
    var molecule = MathUtils.multiply(expectPercent, singleMoney)
    molecule = MathUtils.minus(prize, molecule)
    var result = MathUtils.divide(denominator, molecule)
    return Math.ceil(result)
  },
  getExpectMoney (prize, multipleNum, beforeTotal) {
    return MathUtils.minus((MathUtils.multiply(prize, multipleNum)), beforeTotal) * 1
  },
  getYieldRate (expectMoney, beforeTotal) {
    return MathUtils.multiply(MathUtils.divide(expectMoney, beforeTotal), 100).toFixed(2)
  },
  getShoppingBasket () {
    return store.state.lottery.shoppingBasket
  },
  /**
   * pk10正则、
   */
  getPK10Reg (playId) {
    var reg = ''
    switch (playId) {
      case 3: // 猜冠亚军
        reg = /^((0[1-9])|10)(\|?((0[1-9])|10)){1}$/
        break
      case 5: // 猜前三名
        reg = /^((0[1-9])|10)(\|?((0[1-9])|10)){2}$/
        break
      case 7: // 猜前四名
        reg = /^((0[1-9])|10)(\|?((0[1-9])|10)){3}$/
        break
      case 9: // 猜前五名
        reg = /^((0[1-9])|10)(\|?((0[1-9])|10)){4}$/
        break
      default:
        break
    }
    return reg
  },
  /**
   * 11x5正则校验
   */
  get11x5Reg (playId) {
    var reg = ''
    if (playId === 18 || playId === 26) { // 任选一中一(复式、单式)
      reg = /^((0[1-9])|1[01]){1}$/
    } else if ((playId >= 8 && playId <= 14) || playId === 19 || playId === 27 || playId === 34) { // 任选二、前二
      reg = /^((0[1-9])|1[01])(\|?((0[1-9])|1[01])){1}$/
    } else if ((playId >= 1 && playId <= 7) || playId === 20 || playId === 28 || playId === 35) { // 任选三、前三
      reg = /^((0[1-9])|1[01])(\|?((0[1-9])|1[01])){2}$/
    } else if (playId === 21 || playId === 29 || playId === 36) {
      reg = /^((0[1-9])|1[01])(\|?((0[1-9])|1[01])){3}$/
    } else if (playId === 22 || playId === 30 || playId === 37) {
      reg = /^((0[1-9])|1[01])(\|?((0[1-9])|1[01])){4}$/
    } else if (playId === 23 || playId === 31 || playId === 38) {
      reg = /^((0[1-9])|1[01])(\|?((0[1-9])|1[01])){5}$/
    } else if (playId === 24 || playId === 32 || playId === 39) {
      reg = /^((0[1-9])|1[01])(\|?((0[1-9])|1[01])){6}$/
    } else if (playId === 25 || playId === 33 || playId === 40) {
      reg = /^((0[1-9])|1[01])(\|?((0[1-9])|1[01])){7}$/
    }
    return reg
  },
  /**
   * 对于双号进行验证、
   * type 【2， 4】
   */
  getDoubleVerification (playId, flag_type, vue) {
    const _lotteryType = this.getType()
    let content = this.getTextContent().ballValues
    var errorArr = []
    var beforeVerificationArr = []
    content = content.replace(/(,|，|；|;|\n)/g, '*')
    this.textareaArr = content.split('*')
    if (flag_type === 0) {
      var reg = ''
      if (_lotteryType === 2) {
        reg = this.get11x5Reg(playId)
      } else if (_lotteryType === 4) {
        reg = this.getPK10Reg(playId)
      } else {
        return false
      }
      for (var i = 0; i < this.textareaArr.length; i++) {
        var record = this.textareaArr[i].trim()
        if (record === '') continue
        var item = record.replace(/[\s+|\\,+]/g, '|')
        if (reg.test(item) && item.indexOf('|') <= 0) {
          item = item.match(/(\d){2}/g).join('|')
        }
        if (item.match(reg) && !this.repeatInnerRecord11x5(item, reg)) {
          beforeVerificationArr.push(item.split('|').join(' '))
        } else {
          errorArr.push(record)
        }
      }
    } else {
      beforeVerificationArr = this.textareaArr
    }
    this.handlerRepeat(beforeVerificationArr, errorArr, flag_type, vue)
  },
  /**
   * 判断行记录有没有重复
   * @param msg
   * @returns {Boolean} true 有重复
   */
  repeatInnerRecord11x5 (msg, playReg) {
    var reg = /^\d{2}$/
    var a = msg.split(/[\s+|\\,+]/g)
    if (!playReg.test(msg)) {
      return true
    }
    if (a.length <= 1) {
      a = msg.match(/(\d){2}/g)
    }
    a.sort((a, b) => {
      return parseInt(a) > parseInt(b) ? 1 : -1
    })
    for (var i = 0; i < a.length - 1; i++) {
      if (a[i].match(reg) && (a[i] === a[i + 1])) {
        return true
      }
    }
    return false
  },
  // 获取单挑相关信息
  getLotterySoloInfo (playCode) {
    const _data = {
      lottery_no: this.getLotteryId(),
      play_code: playCode
    }
    LotteryApi.getSoloInfo(_data).then(res => {
      const result = res.data
      if (result.code === 200) {
        this.soloCount = result.data.count
        this.soloAmt = result.data.bonus
        this.soloMaxAmt = result.data.single_quota
      }
    })
  },
  // 记录查询 彩种下拉
  getSaleLotteryList () {
    let list = []
    this.lotteryList = [{
      text: '全部',
      value: 0
    }]
    LotteryApi.getMerchSaleLotteryList().then(res => {
      list = res.data.data
      list.forEach(item => {
        this.lotteryList.push({
          text: item.lottery_name,
          value: item.lottery_no
        })
      })
    })
    return this.lotteryList
  },
  getOdds (playId, lotteryAwardList) {
    const award = this.getPlayAward(playId, lotteryAwardList)
    if (award) {
      return MathUtils.fomatFloat(MathUtils.multiply(award, MathUtils.divide(this.getBetRebate(), 2000)), 4)
    } else {
      return 0
    }
  },
  getPlayAward (playId, lotteryAwardList) {
    let award = 0
    lotteryAwardList.forEach(item => {
      if (item.play_code === Number(playId)) {
        award = item.award_amount
      }
    })
    return award
  },
  // 投注参数
  getBetParams (lotteryMode) {
    var paramList = []
    if (lotteryMode === 0) {
      this.getShoppingBasket().map(
        item => {
          var checkoutParam = {
            toString: function () {
              return JSON.stringify(this)
            }
          }
          checkoutParam.bet_count = item.notes
          checkoutParam.bet_multiple = item.multipleValue
          checkoutParam.bet_amount = item.totalMoney
          checkoutParam.bet_content = item.betContent.ballValues
          if (checkoutParam.bet_content.indexOf('#') > -1 && this.getType() === 1) {
            checkoutParam.bet_content = this.replaceLocation(checkoutParam.bet_content)
          }
          checkoutParam.bet_rebate = this.getBetRebate()
          checkoutParam.play_code = Number(item.play.playId)
          checkoutParam.currency_mode = item.mode[0] + 1
          paramList.push(checkoutParam)
        }
      )
    } else {
      this.getShoppingBasket().map(
        item => {
          var checkoutParam = {
            toString: function () {
              return JSON.stringify(this)
            }
          }
          checkoutParam.bet_count = item.notes
          checkoutParam.bet_multiple = item.multipleValue
          checkoutParam.bet_amount = item.totalMoney
          checkoutParam.bet_content = item.rowLabel + '-' + item.ballText
          checkoutParam.bet_rebate = this.getBetRebate()
          checkoutParam.play_code = item.playCode
          checkoutParam.currency_mode = 1
          checkoutParam.odds = item.ballOdd
          paramList.push(checkoutParam)
        }
      )
    }
    return paramList
  }
}

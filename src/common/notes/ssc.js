import LotteryUtils from '@utils/lottery-utils'
import MathUtils from '@utils/math-utils'
import store from '@store'

export default function sscCalcNotes (playId) {
  let result = 0
  let betArray = store.state.lottery.selectedBalls
  switch (parseInt(playId)) {
    // 五星 直选/通选 复式
    case 1:
    case 3:
      result = betArray
        .map(item => {
          return item.length
        })
        .reduce((prev, cur) => {
          return prev * cur
        }, 1)
      break
    case 5: //  五星组选120
      result = MathUtils.getCCombination(betArray[0].length, 5)
      break
    case 6: //  五星组选60
      result = MathUtils.getArraySelect(3, betArray[0], betArray[1])
      break
    case 7: //  五星组选30
      result = MathUtils.getArraySelect(2, betArray[1], betArray[0])
      break
    case 8: //  五星组选20
    case 15: //  后四组选12
    case 21: //  前四组选12
      result = MathUtils.getArraySelect(2, betArray[0], betArray[1])
      break
    case 9: //  五星组选10
    case 10: //  五星组选5
    case 17: //  后四组选4 6 7 13
    case 23: //  前四组选4 6 7 13
      result = MathUtils.getArraySelect(1, betArray[0], betArray[1])
      break
    case 12: //  四星直选
    case 18:
      result = betArray[0].length * betArray[1].length * betArray[2].length * betArray[3].length
      break
    case 14: //  后四组选24
    case 20: //  前四组选24
      result = MathUtils.getCCombination(betArray[0].length, 4)
      break
    case 16: //  后四组选6
    case 22: //  后四组选6
      result = MathUtils.getCCombination(betArray[0].length, 2)
      break
    case 24:
    case 35: //  三星直选
    case 46:
      result = betArray[0].length * betArray[1].length * betArray[2].length
      break
    case 26:
    case 37: //  三星直选和值
    case 48:
      for (let i = 0; i < betArray[0].length; i += 1) {
        let numzhu = 0
        for (let j = 0; j < 10; j += 1) {
          for (let k = 0; k < 10; k += 1) {
            for (let x = 0; x < 10; x += 1) {
              if (j + k + x === Number(betArray[0][i].ballValue)) {
                numzhu = numzhu + 1
              }
            }
          }
        }
        result += numzhu
      }
      break
    case 28:
    case 39: //  三星组三
    case 50:
      result = betArray[0].length * (betArray[0].length - 1)
      break
    case 96: //  任选三组三
      result =
            MathUtils.getACombination(betArray[0].length, 2) *
            MathUtils.getCCombination(LotteryUtils.getBallsPosition().length, 3)
      break
    case 29:
    case 40: //  三星组六
    case 51:
      result = MathUtils.Cnm(3, betArray[0].length)
      break
    case 98: //  任选三组六
      result =
            MathUtils.getCCombination(betArray[0].length, 3) *
            MathUtils.getCCombination(LotteryUtils.getBallsPosition().length, 3)
      break
    case 31:
    case 42: //  三星组选和值
    case 52:
    case 53:
      for (let i = 0; i < betArray[0].length; i += 1) {
        let numzhu = 0
        let numzhu1 = 0
        for (let j = 0; j < 10; j += 1) {
          for (let k = 0; k < 10; k += 1) {
            for (let x = 0; x < 10; x += 1) {
              if (!(j === k && k === x)) {
                if (j === k || k === x || j === x) {
                  if (j + k + x === Number(betArray[0][i].ballValue)) {
                    numzhu += 1
                  }
                } else {
                  if (j + k + x === Number(betArray[0][i].ballValue)) {
                    numzhu1 = numzhu1 + 1
                  }
                }
              }
            }
          }
        }
        result += numzhu / 3 + numzhu1 / 6
      }
      break
    case 57: //  二星直选
    case 64:
      result = betArray[0].length * betArray[1].length
      break
    case 59: //  二星直选和值
    case 66:
      for (let i = 0; i < betArray[0].length; i += 1) {
        let numzhu = 0
        for (let j = 0; j < 10; j += 1) {
          for (let k = 0; k < 10; k += 1) {
            if (j + k === Number(betArray[0][i].ballValue)) {
              numzhu = numzhu + 1
            }
          }
        }
        result += numzhu
      }
      break
    case 61: //  二星组选
    case 68:
      result = MathUtils.Cnm(2, betArray[0].length)
      break
    case 62: //  二星组选和值
    case 69:
      for (let i = 0; i < betArray[0].length; i += 1) {
        let numzhu = 0
        for (let j = 0; j < 10; j += 1) {
          for (let k = 0; k < 10; k += 1) {
            if (j !== k) {
              if (j + k === Number(betArray[0][i].ballValue)) {
                numzhu = numzhu + 1
              }
            }
          }
        }
        result += numzhu
      }
      result = result / 2
      break
    case 74: //  前三一码
    case 72: //  后三一码
    case 76: //  后四一码
    case 78: //  前四一码
    case 80: //  五星一码
    case 108: //  趣味-一帆风顺
    case 109: //  趣味-好事成双
    case 110: //  趣味-三星报喜
    case 111: //  趣味-四季发财
    case 11: //  五星-总和大小单双
    case 33: //  后三-和值尾数
    case 34: //  后三-特殊号
    case 44: //  中三-和值尾数
    case 45: //  中三-特殊号
    case 55: //  前三-和值尾数
    case 56: //  前三-特殊号
    case 112: //  龙虎_万千
    case 113: //  龙虎_万百
    case 114: //  龙虎_万十
    case 115: //  龙虎_万个
    case 116: //  龙虎_千百
    case 117: //  龙虎_千十
    case 118: //  龙虎_千个
    case 119: //  龙虎_百十
    case 120: //  龙虎_百个
    case 121: //  龙虎_十个
    case 122: //  龙虎_万千
    case 123: //  龙虎_万百
    case 124: //  龙虎_万十
    case 125: //  龙虎_万个
    case 126: //  龙虎_千百
    case 127: //  龙虎_千十
    case 128: //  龙虎_千个
    case 129: //  龙虎_百十
    case 130: //  龙虎_百个
    case 131: //  龙虎_十个
      result = betArray[0].length
      break
    case 73: // 后三二码不定位
    case 75: // 前三三二码不定位
    case 77: // 后四二码不定位
    case 79: // 前四二码不定位
    case 81: // 五星二码不定位
      result = MathUtils.Cnm(2, betArray[0].length)
      break
    case 82: // 五星三码不定位
      result = MathUtils.Cnm(3, betArray[0].length)
      break
    case 27: // 三星前三直选跨度
    case 38: // 三星中三直选跨度
    case 49: // 三星后三直选跨度
      for (let i = 0; i < betArray[0].length; i++) {
        result += MathUtils.getSanKuadu(Number(betArray[0][i].ballValue))
      }
      break
    case 60: // 后二直选跨度
    case 67: // 前二直选跨度
      for (let i = 0; i < betArray[0].length; i++) {
        result += MathUtils.getErKuadu(Number(betArray[0][i].ballValue))
      }
      break
    case 85: //  后二大小单双
    case 86: //  前二大小单双
      result = betArray[0].length * betArray[1].length
      break
    case 83: //  后三大小单双
    case 84: //  前三大小单双
      result = betArray[0].length * betArray[1].length * betArray[2].length
      break
    case 71: // 定位胆
      result =
          betArray[0].length +
          betArray[1].length +
          betArray[2].length +
          betArray[3].length +
          betArray[4].length
      break
    case 87: //  任选二直选单式、复式
      result =
          betArray[0].length * betArray[1].length +
          betArray[0].length * betArray[2].length +
          betArray[0].length * betArray[3].length +
          betArray[0].length * betArray[4].length +
          betArray[1].length * betArray[2].length +
          betArray[1].length * betArray[3].length +
          betArray[1].length * betArray[4].length +
          betArray[2].length * betArray[3].length +
          betArray[2].length * betArray[4].length +
          betArray[3].length * betArray[4].length
      break
    case 93: //  任选三直选
      result =
          betArray[0].length * betArray[1].length * betArray[2].length +
          betArray[0].length * betArray[2].length * betArray[3].length +
          betArray[0].length * betArray[3].length * betArray[1].length +
          betArray[0].length * betArray[4].length * betArray[1].length +
          betArray[1].length * betArray[2].length * betArray[3].length +
          betArray[1].length * betArray[3].length * betArray[4].length +
          betArray[1].length * betArray[4].length * betArray[2].length +
          betArray[2].length * betArray[3].length * betArray[4].length +
          betArray[2].length * betArray[4].length * betArray[0].length +
          betArray[3].length * betArray[4].length * betArray[0].length
      break
    case 89: //  任选二直选和值
      for (let i = 0; i < betArray[0].length; i++) {
        result += MathUtils.getErXingZhiXuanHeZhiNote(Number(betArray[0][i].ballValue))
      }
      result *= MathUtils.getCCombination(LotteryUtils.getBallsPosition().length, 2)
      break
    case 90: //  任选二组选复式
      result =
          MathUtils.getCCombination(betArray[0].length, 2) *
          MathUtils.getCCombination(LotteryUtils.getBallsPosition().length, 2)
      break
    case 92: //  任选二组选和值
      for (let i = 0; i < betArray[0].length; i++) {
        result += MathUtils.getErXingZuXuanHeZhiNote(Number(betArray[0][i].ballValue))
      }
      result *= MathUtils.getCCombination(LotteryUtils.getBallsPosition().length, 2)
      break
    case 95: //  任选三直选和值
      for (let i = 0; i < betArray[0].length; i++) {
        result += MathUtils.getZhiXuanHeZhiNote(Number(betArray[0][i].ballValue))
      }
      result *= MathUtils.getCCombination(LotteryUtils.getBallsPosition().length, 3)
      break
    case 100: //  任选三混合组选
      break
    case 101: //  任选三组选和值
      for (let i = 0; i < betArray[0].length; i++) {
        result += MathUtils.getSanXingZuXuanHeZhiNote(Number(betArray[0][i].ballValue))
      }
      result *= MathUtils.getCCombination(LotteryUtils.getBallsPosition().length, 3)
      break
    case 102: //  任选四直选复式
      result =
          betArray[0].length * betArray[1].length * betArray[2].length * betArray[3].length +
          betArray[0].length * betArray[1].length * betArray[2].length * betArray[4].length +
          betArray[0].length * betArray[1].length * betArray[3].length * betArray[4].length +
          betArray[0].length * betArray[2].length * betArray[3].length * betArray[4].length +
          betArray[1].length * betArray[2].length * betArray[3].length * betArray[4].length
      break
    case 104: //  任选四组选24
      result =
          MathUtils.getCCombination(betArray[0].length, 4) *
          MathUtils.getCCombination(LotteryUtils.getBallsPosition().length, 4)
      break
    case 105: //  任选四组选12
      if (betArray[0].length >= 1 && betArray[1].length >= 2) {
        result =
            MathUtils.getArraySelect(2, betArray[0], betArray[1]) *
            MathUtils.getCCombination(LotteryUtils.getBallsPosition().length, 4)
      }
      break
    case 106: //  任选四组选6
      result =
          MathUtils.getCCombination(betArray[0].length, 2) *
          MathUtils.getCCombination(LotteryUtils.getBallsPosition().length, 4)
      break
    case 107: //  任选四组选4
      if (betArray[0].length >= 1 && betArray[1].length >= 1) {
        result =
            MathUtils.getArraySelect(1, betArray[0], betArray[1]) *
            MathUtils.getCCombination(LotteryUtils.getBallsPosition().length, 4)
      }
      break
    case 32: //  后三组选包胆
    case 43: //  中三组选包胆
    case 54: //  前三组选包胆
      result = 54
      break
    case 63: //  后二组选包胆
    case 70: //  前二组选包胆
      result = 9
      break
    default:
      break
  }
  return result
}

// import LotteryUtils from '@utils/lottery-utils'

import MathUtils from '@utils/math-utils'
import store from '@store'

export default function syx5CalcNotes (playId) {
  let result = 0
  let betArray = store.state.lottery.selectedBalls
  let dcount = betArray[0].length
  switch (parseInt(playId)) {
    // 直选复式
    case 1:
      for (let i = 0; i < betArray[0].length; i++) {
        for (let j = 0; j < betArray[1].length; j++) {
          for (var k = 0; k < betArray[2].length; k++) {
            if (
              betArray[0][i].ballValue !== betArray[1][j].ballValue &&
              betArray[0][i].ballValue !== betArray[2][k].ballValue &&
              betArray[1][j].ballValue !== betArray[2][k].ballValue
            ) {
              result = result + 1
            }
          }
        }
      }
      break
    case 3: //  前三直选组合
      result = MathUtils.Anm(3, betArray[0].length)
      break
    case 4: // 前三直选胆拖
      if (dcount === 1) {
        result = MathUtils.Cnm(2, betArray[1].length) * 6
      } else if (dcount === 2) {
        result = betArray[1].length * 6
      }
      break
    case 5: // 前三组选复式
      result = MathUtils.Cnm(3, betArray[0].length)
      break
    case 7: // 前三组选胆拖
      if (dcount === 1) {
        result = MathUtils.Cnm(2, betArray[1].length)
      } else if (dcount === 2) {
        result = betArray[1].length
      }
      break
    case 8: // 前二直选复式
      for (var i = 0; i < betArray[0].length; i++) {
        for (var j = 0; j < betArray[1].length; j++) {
          if (betArray[0][i].ballValue !== betArray[1][j].ballValue) {
            result = result + 1
          }
        }
      }
      break
    case 10: // 前二直选组合
      result = MathUtils.Anm(2, betArray[0].length)
      break
    case 11: // 前二直选胆拖
      result = betArray[0].length * betArray[1].length * 2
      break
    case 12: // 前二组选复式
      result = MathUtils.Cnm(2, betArray[0].length)
      break
    case 14: // 前二组选胆拖
      result = betArray[0].length * betArray[1].length
      break
    case 15: // 前一复式
    case 17: // 前三不定位
      result = betArray[0].length
      break
    case 16: // 定位胆
      result = betArray[0].length + betArray[1].length + betArray[2].length
      break
    case 18: // 任选一中一复式
      result = MathUtils.Cnm(1, betArray[0].length)
      break
    case 19: // 任选二中二复式
      result = MathUtils.Cnm(2, betArray[0].length)
      break
    case 34: // 任选二中二胆拖
      if (dcount === 1) result = betArray[1].length
      break
    case 20: // 任选三中三复式
      result = MathUtils.Cnm(3, betArray[0].length)
      break
    case 35: // 任选三中三胆拖
      result = MathUtils.Cnm(3 - dcount, betArray[1].length)
      break
    case 21: // 任选四中四复式
      result = MathUtils.Cnm(4, betArray[0].length)
      break
    case 36: // 任选四中四胆拖
      result = MathUtils.Cnm(4 - dcount, betArray[1].length)
      break
    case 22: // 任选五中五复式
      result = MathUtils.Cnm(5, betArray[0].length)
      break
    case 37: // 任选五中五胆拖
      result = MathUtils.Cnm(5 - dcount, betArray[1].length)
      break
    case 23: // 任选六中五复式
      result = MathUtils.Cnm(6, betArray[0].length)
      break
    case 38: // 任选六中五胆拖
      result = MathUtils.Cnm(6 - dcount, betArray[1].length)
      break
    case 24: // 任选七中五复式
      result = MathUtils.Cnm(7, betArray[0].length)
      break
    case 39: // 任选七中五胆拖
      result = MathUtils.Cnm(7 - dcount, betArray[1].length)
      break
    case 25: // 任选八中五复式
      result = MathUtils.Cnm(8, betArray[0].length)
      break
    case 40: // 任选八中五胆拖
      result = MathUtils.Cnm(8 - dcount, betArray[1].length)
      break
    default:
      break
  }
  return result
}

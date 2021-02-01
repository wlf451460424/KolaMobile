import LotteryUtils from '@utils/lottery-utils'
import store from '@store'

export default function getSSCBetContent (playId) {
  let ballTexts, ballValues
  let betArray = store.state.lottery.selectedBalls
  let arrContent = []
  if (betArray[0].length > 0) {
    arrContent.push(betArray[0])
  }
  if (betArray[1].length > 0) {
    arrContent.push(betArray[1])
  }
  if (betArray[2].length > 0) {
    arrContent.push(betArray[2])
  }
  if (betArray[3].length > 0) {
    arrContent.push(betArray[3])
  }
  if (betArray[4].length > 0) {
    arrContent.push(betArray[4])
  }
  switch (parseInt(playId)) {
    case 1:
    case 3: // 五星直选复式
    case 6: // 组选60
    case 7: // 组选30
    case 8: // 组选20
    case 9: // 组选10
    case 10: // 组选5
    case 12:// 四星直选复式
    case 15: // 组选12
    case 17: // 组选4
    case 21:
    case 23:
    case 18:
    case 24: // 三星直选复式
    case 35:
    case 46:
    case 57: // 二星直选复式
    case 64:
    case 83: // 大小单双
    case 84:
    case 85:
    case 86:
      ballTexts = arrContent.map(item => {
        return item.map(ball => {
          if (ball.ballText) {
            return ball.ballText
          }
        }).join(',')
      }).join('|')
      ballValues = arrContent.map(item => {
        return item.map(ball => {
          if (ball.ballValue) {
            return ball.ballValue
          }
        }).join(',')
      }).join('|')
      break
    case 71:// 定位胆
    case 87:// 任选二直选复式
    case 93:// 任选三直选复式
    case 102:// 任选四直选复式
      ballTexts = LotteryUtils.getOptionalLocation(5, betArray)
      ballValues = LotteryUtils.getOptionalLocation(5, betArray)
      break
    case 4:// 单式 混合组选
    case 13:
    case 19:
    case 25:
    case 30:
    case 36:
    case 41:
    case 47:
    case 52:
    case 58:
    case 65:
      ballTexts = LotteryUtils.getContent(betArray)
      ballValues = LotteryUtils.getContent(betArray)
      break
    case 88:// 任选单式
    case 91:
    case 94:
    case 97:
    case 99:
    case 100:
    case 103:
      ballTexts = LotteryUtils.getContent(betArray, true)
      ballValues = LotteryUtils.getContent(betArray, true)
      break
    case 96: //  任选三组三复式
    case 98: // 任选三组六复式
    case 89: //  任选二直选和值
    case 90: //  任选二直选组选复式
    case 92: //  任选二组选和值
    case 95: //  任选三和值
    case 101: //  任选三组选和值
    case 104: //  任选四组选24
    case 106: //  任选四组选6
      ballTexts = betArray[0].map(item => {
        return item.ballText
      }).join(',') + '#' + LotteryUtils.getBallsPosition().join('')
      ballValues = betArray[0].map(item => {
        return item.ballValue
      }).join(',') + '#' + LotteryUtils.getBallsPosition().join('')
      break
    case 105:// 任选四 组选12 组选4
    case 107:
      ballTexts = arrContent.map(item => {
        return item.map(ball => {
          if (ball.ballText) {
            return ball.ballText
          }
        }).join(',')
      }).join('|') + '#' + LotteryUtils.getBallsPosition().join('')
      ballValues = arrContent.map(item => {
        return item.map(ball => {
          if (ball.ballValue) {
            return ball.ballValue
          }
        }).join(',')
      }).join('|') + '#' + LotteryUtils.getBallsPosition().join('')
      break
    default:
      ballTexts = betArray[0].map(item => {
        return item.ballText
      }).join(',')
      ballValues = betArray[0].map(item => {
        return item.ballValue
      }).join(',')
      break
  }
  return { ballTexts, ballValues }
}

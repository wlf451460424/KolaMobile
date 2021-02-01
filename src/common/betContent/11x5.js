import LotteryUtils from '@utils/lottery-utils'
import store from '@store'

export default function get11x5BetContent (playId) {
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
    case 8: // 直选复式
    case 16:
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
    case 2:// 单式
    case 6:
    case 9:
    case 13:
    case 26:
    case 27:
    case 28:
    case 29:
    case 30:
    case 31:
    case 32:
    case 33:
      ballTexts = LotteryUtils.getContent(betArray)
      ballValues = LotteryUtils.getContent(betArray)
      break
    case 4:// 胆拖
    case 7:
    case 11:
    case 14:
    case 34:
    case 35:
    case 36:
    case 37:
    case 38:
    case 39:
    case 40:
      ballTexts = arrContent.map(item => {
        return item.map(ball => {
          if (ball.ballText) {
            return ball.ballText
          }
        }).join(',')
      }).join('#')
      ballValues = arrContent.map(item => {
        return item.map(ball => {
          if (ball.ballValue) {
            return ball.ballValue
          }
        }).join(',')
      }).join('#')
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

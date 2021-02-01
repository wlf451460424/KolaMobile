import MathUtils from '@utils/math-utils'
import store from '@store'

export default function kl8CalcNotes (playId) {
  let result = 0
  let betArray = store.state.lottery.selectedBalls
  switch (playId) {
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
      result = MathUtils.Cnm(playId, betArray[0].length)
      break
    default:
      result = betArray[0].length
      break
  }
  return result
}

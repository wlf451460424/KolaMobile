import get11x5BetContent from './11x5'
import getKl8BetContent from './kl8'
import getSSCBetContent from './ssc'

export default function getBetContent (lotteryKindIndex, playId) {
  switch (parseInt(lotteryKindIndex)) {
    case 0:
      return getSSCBetContent(playId)
    case 1:
      return get11x5BetContent(playId)
    case 2:
      return getKl8BetContent(playId)
    default:
      break
  }
}

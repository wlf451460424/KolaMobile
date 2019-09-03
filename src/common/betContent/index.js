import getSSCBetContent from './ssc'
export default function getBetContent (lotteryKindIndex, playId) {
  switch (parseInt(lotteryKindIndex)) {
    case 0:
      return getSSCBetContent(playId)

    default:
      break
  }
}

import sscCalcNotes from './ssc'
export default function calcLotteryNotes (lotteryKindIndex, playId) {
  switch (parseInt(lotteryKindIndex)) {
    case 0:
      return sscCalcNotes(playId)

    default:
      break
  }
}

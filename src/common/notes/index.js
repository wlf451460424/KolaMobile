import kl8CalcNotes from './kl8'
import sscCalcNotes from './ssc'
import syx5CalcNotes from './11x5'

// import LotteryUtils from '@utils/lottery-utils'
// const lottery_type = LotteryUtils.getType()
export default function calcLotteryNotes (lotteryKindIndex, playId) {
  switch (parseInt(lotteryKindIndex)) {
    case 0:
      return sscCalcNotes(playId)
    case 1:
      return syx5CalcNotes(playId)
    case 2:
      return kl8CalcNotes(playId)
    default:
      break
  }
}

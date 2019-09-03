import store from '@store'

export default function getSSCBetContent (playId) {
  let ballTexts, ballValues
  switch (parseInt(playId)) {
    case 1:
      ballTexts = store.state.lottery.selectedBalls.map(item => {
        return item.map(ball => {
          return ball.ballText
        }).join(',')
      }).join('|')
      ballValues = store.state.lottery.selectedBalls.map(item => {
        return item.map(ball => {
          return ball.ballValue
        }).join(',')
      }).join('|')
      break
    default:
      break
  }
  return { ballTexts, ballValues }
}

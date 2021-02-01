import store from '@store'

export default function getKl8BetContent (playId) {
  let ballTexts, ballValues
  let betArray = store.state.lottery.selectedBalls
  switch (parseInt(playId)) {
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

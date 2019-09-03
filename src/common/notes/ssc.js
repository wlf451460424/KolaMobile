// import MathUtils from '@utils/math-utils'
import store from '@store'

// for (let i = 0; i<= 27; i++) { // 如时时彩 三星直选和值
//   let result = MathUtils.getCombinationSum([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], i, 3, true)
//   console.log(result)
// }
// for (let i = 1; i<= 26; i++) { // 如时时彩 三星组选和值
//   let result = MathUtils.getCombinationSum([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], i, 3, false)
//   console.log(result)
// }
// for (let i = 0; i<= 18; i++) { // 如时时彩  二星直选和值
//   let result = MathUtils.getCombinationSum([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], i, 2, true)
//   console.log(result)
// }
// for (let i = 1; i<= 17; i++) { // 如时时彩 二星组选和值
//   let result = MathUtils.getCombinationSum([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], i, 2, false)
//   console.log(result)
// },

export default function sscCalcNotes (playId) {
  let result = 0
  let betArray = store.state.lottery.selectedBalls
  switch (parseInt(playId)) {
    // 五星 直选/通选 复式
    case 1:
      result = betArray
        .map(item => {
          return item.length
        })
        .reduce((prev, cur) => {
          return prev * cur
        }, 1)
      break
    default:
      break
  }
  return result
}

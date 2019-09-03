import * as login from './login/mutation-types'
import * as lottery from './lottery/mutation-types'
import * as record from './record/mutation-types'
import * as userInfo from './userInfo/mutation-types'

export default {
  ...login,
  ...lottery,
  ...record,
  ...userInfo
}

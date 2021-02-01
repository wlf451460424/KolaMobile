<template>
  <div class="loginForm">
    <span class="">Koala手机web系统</span>
    <cube-input
      v-model.trim="uname"
      :clearable="true"
      placeholder="请输入用户名"
      :autofocus="true"
    />
    <cube-input
      v-model.trim="passwd"
      :clearable="true"
      placeholder="请输入密码"
      type="password"
      :eye="eye"
      :autofocus="true"
    />
    <cube-button @click="login">
      登录
    </cube-button>
  </div>
</template>

<script>
import types from '@store/modules/mutation-types'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      uname: '',
      passwd: '',
      eye: {
        open: true,
        reverse: false
      }
    }
  },
  methods: {
    login () {
      // this.$api.login.login({ 'msg': 123 }).then(res => {
      //   this.save(res.data.data)
      //   this.$router.replace({ path: '/' })
      // }).catch(err => {
      //   this.$toast.showText(err.msg || '登录失败')
      // })
      this.$router.replace({ path: '/' })
    },
    ...mapMutations('userInfo', {
      save: types.SAVE_TOKEN
    })
  }
}
</script>

<style scoped lang="scss">
.loginForm {
  margin: 10px;
  ::v-deep .cube-btn {
    background-color: $color-light-green;
  }
}
</style>

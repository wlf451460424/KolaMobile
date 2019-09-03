<template>
  <div class="menu">
    <div class="topUser">
      <img src="@assets/portrait@2x.png">
      <span>Guest001</span>
      <p>余额：￥10000.00</p>
    </div>
    <div class="menuItem">
      <ul>
        <li>
          <img src="@assets/diaryCount@2x.png">
          每日统计
          <i class="cubeic-arrow" />
        </li>
        <li>
          <img src="@assets/prizeRecord@2x.png">
          投注记录
          <i class="cubeic-arrow" />
        </li>
        <li>
          <img src="@assets/chaseRecord@2x.png">
          追号记录
          <i class="cubeic-arrow" />
        </li>
        <li>
          <img src="@assets/transferRecord@2x.png">
          转账记录
          <i class="cubeic-arrow" />
        </li>
        <li>
          <img src="@assets/accountRecord@2x.png">
          账变记录
          <i class="cubeic-arrow" />
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {

}
</script>
<style lang="scss" scoped>
@import '@styles/_var.scss';
.menu {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: $color-dark-blue;
  .topUser {
    height: 426px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    img {
      width: 140px;
      height: 140px;
    }
    span {
      color: white;
      margin-top: 14px;
      font-size: 28px;
    }
    p {
      color: $color-yellow;
      margin-top: 14px;
      font-size: 28px;
    }
  }
  .menuItem {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    ul li {
      height: 90px;
      display: flex;
      color: white;
      align-items: center;
      line-height: 80px;
      color: $color-gray-blue;
      img {
        width:42px;
        height: 42px;
        margin-right: 68px;
        margin-left: 50px;
      }
      i {
        margin-left: auto;
        margin-right: 52px;
      }
    }
  }
}
</style>

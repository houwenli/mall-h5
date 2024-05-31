<template>
  <div class="appIndex">
    <div class="queshen-box">
      <img src="../../assets/img/queShen.png" alt="" style="width:180px;height:180px" />
      <p>万顺福商城即将开启，敬请期待~~</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index.vue',
}
</script>

<style scoped>
.appIndex {
  position: absolute;
  height: 100vh;
  width: 100%;
  background: #FAFAFB;
}
.queshen-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30%;
}
p {
  font-size: 15px;
  color: #999999;
  margin-top: 10px;
  font-weight: bold;
  line-height: 18px;
}
</style>

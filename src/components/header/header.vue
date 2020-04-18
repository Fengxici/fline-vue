<template>
  <div>
    <a-layout-header class="header">
      <div class="logo">
        <svg class="logo-icon" aria-hidden="true">
          <use xlink:href="#iconlogo"></use>
        </svg>
        非线前端VUE模板项目
      </div>
      <div>
        <span>admin</span>
        <span>(管理员)</span>
        <span class="separator">|</span>
        <span><a href="javascript:;">退出</a></span>
      </div>
    </a-layout-header>
  </div>
</template>

<script>
  export default {

  }
</script>

<style>
  #components-layout-demo-top-side-2 .logo {
    height: 31px;
    margin: 16px 28px 16px 0;
    float: left;
    line-height: 31px;
    color: #394ECF;
    font-weight: bold;
    font-size: 20px;
  }

  .ant-layout-header {
    display: flex;
    justify-content: space-between;
    background: #fff;
    color: #000;
  }

  .separator {
    margin: 0 15px;
  }

  .logo-icon {
    width: 25px;
    height: 25px;
    vertical-align: middle;
  }
</style>

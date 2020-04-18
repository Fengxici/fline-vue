<template>
  <a-layout id="components-layout-demo-top-side-2">
    <!-- 头 -->
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
        <span><a href="javascript:;" @click="logout">退出</a></span>
      </div>
    </a-layout-header>
    <!-- menu-nav -->
    <a-layout>
      <a-layout-sider width="256" >
        <menuList />
      </a-layout-sider>
      <a-layout style="padding: 0 24px 24px">
        <!-- 分页导航 -->
        <breadcrumb />
        <!-- content -->
        <a-layout-content :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }">
          <router-view></router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>
<script>
  import { mapActions } from 'vuex'
  import { ACCESS_TOKEN } from '@/store/mutation-types'
  import breadcrumb from '@/components/breadcrumb/breadcrumb'
  import menuList from '@/components/menuList/menuList'
  export default {
    data () {
      return {
      }
    },
    components: {
      breadcrumb,
      menuList,
    },
    methods: {
      ...mapActions(['Logout']),
      // 退出
      logout() {
        this.Logout()
        .then(res => {
          this.$router.push('/login');
          window.location.reload()
        })
      }
    },
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

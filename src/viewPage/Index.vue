<template>
    <a-layout id="components-layout-demo-fixed">
        <a-layout-header>
            <span class='fontSize20'>
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#iconlogo"></use>
                </svg>非线前端VUE模板项目
            </span>
            <div class='pull-right'>
                <a-icon type="bell" />
                <span>欢迎您，{{userName}}</span>
                <span class='paddingLR10'>|</span>
                <span @click="logout">退出</span>
            </div>
            <!-- <a-menu class='f_headMenu' mode="horizontal" :defaultSelectedKeys='defaultSelectedKeys'>
                <a-sub-menu v-for='(item,index) in topMenuData' :key="'topMain'+index">
                    <span slot="title" class="submenu-title-wrapper">
                        <a-icon type="setting" class='color2ED2C8'/>{{item.name}}
                    </span>
                    <a-menu-item v-for='(element,num) in item.children' :key='"topChild"+num' @click='clickMenuTitle(item,element)'>
                        {{element.name}}
                    </a-menu-item>
                </a-sub-menu>
            </a-menu> -->
        </a-layout-header>
        <a-layout>
            <a-layout-sider width='256'>
                <a-menu mode="inline" :defaultSelectedKeys="['child00']" :openKeys="openKeys" @openChange="onOpenChange">
                    <a-sub-menu v-for='(item,index) in leftMenuData' :key="'main'+index">
                        <span slot="title"><a-icon :type="item.icon"/><span>{{item.name}}</span></span>
                        <a-menu-item @click='clickMenuTitle(item,element)' v-for='(element,num) in item.children' :key='"child"+index+num'>
                            {{element.name}}
                        </a-menu-item>
                    </a-sub-menu>
                </a-menu>
            </a-layout-sider>
            <a-layout class='padding20'>
                <a-breadcrumb class='marginB10'>
                    <a-breadcrumb-item>
                        <span  @click='backMainPage("tablePage")'><a-icon type="home"/>首页</span>
                    </a-breadcrumb-item>
                    <a-breadcrumb-item v-for='(item,index) in breadcrumbData' :key='index'>
                        {{item.name}}
                    </a-breadcrumb-item>
                </a-breadcrumb>
                <a-layout-content>
                    <router-view :src='src'></router-view>
                </a-layout-content>
            </a-layout>
        </a-layout>
    </a-layout>
</template>

<script>
export default {
  data () {
    return {
      rootSubmenuKeys: ['1', '2'],
      openKeys: ['main0'],
      defaultSelectedKeys: ['0'],
      topMenuData: [
        {
          name: '数据管理',
          path: '',
          icon: '',
          children: [
            {name: '数据元', path: 'iframeView', src: '/demo.html'},
            {name: '资源目录', path: ''}
          ]
        }
      ],
      leftMenuData: [
        {name: '表格相关页面',
          path: '',
          icon: 'codepen-circle',
          children: [
            {name: '基础表格crud', path: 'tablePage'}
          ]},
        {name: '系统管理',
          path: '',
          icon: 'setting',
          children: [
            {name: '用户管理--单角色分配', path: 'userManagement'},
            {name: '用户管理--多角色分配', path: 'userManagementRoles'}
          ]}
      ],
      breadcrumbData: [], // 面包屑数据
      userName: '', // 用户名
      src: ''// 集成html页面地址
    }
  },
  watch: {
  },
  created () {
    this.$router.push({name: 'tablePage'})
    this.breadcrumbData.push(this.leftMenuData[0])
    this.breadcrumbData.push(this.leftMenuData[0].children[0])
    // this.loadCurrentUser();
  },
  methods: {
    loadCurrentUser () {
      this.$axios.post('/fline/userSessionAction!loadCurrentUser.action').then(res => {
        if (res.data != null && res.data.name) {
          this.userName = res.data.name
          this.roleName = res.data.orgPName
        } else {
          this.$router.push({name: 'login'})
        }
      }).catch(error => {
        this.$router.push({name: 'login'})
      })
    },
    clickMenuTitle (item, element) { // 路由跳转，面包屑设置
      this.breadcrumbData = []
      this.breadcrumbData.push(item)
      if (element) {
        this.breadcrumbData.push(element)
      }
      if (element && element.path != '' || item.path != '') {
        this.$router.push({name: element ? element.path : item.path})
      } else {
        this.$message.error('快马加班赶制中！')
      }
      // 集成html
      if (element && element.src) {
        this.src = element.src ? element.src : ''
      }
    },
    onOpenChange (openKeys) { // 菜单只打开选中的
      const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1)
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.openKeys = openKeys
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : []
      }
    },
    backMainPage (localName) { // 面包屑点击事件
      this.$router.push({name: localName})
      this.breadcrumbData = []
    },
    // 退出登录
    logout () {
      this.$axios.post('/fline/logout').then(res => {
        this.$router.push('/login')
        this.$message.success('注销成功！')
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style>

</style>

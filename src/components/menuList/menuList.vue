<template>
  <div>
    <a-menu theme="dark" mode="inline" :defaultOpenKeys="['1']" :style="{ height: '100%', borderRight: 0 }">
      <a-menu-item v-for='element in menuList' v-if='!element.children' :key="element.id">
        <router-link :to='element.path'>
          <a-icon :type="element.icon" />
          {{element.name}}
        </router-link>
      </a-menu-item>
      <a-sub-menu v-for='element in menuList' v-if='element.children' :key="element.id" >
        <span slot="title">
          <a-icon :type="element.icon" />
          {{element.name}}
          </span>
        <a-menu-item v-for='item in element.children' :key='item.id' >
          <router-link :to='item.path'>
            <a-icon :type="item.icon" />
            {{item.name}}
          </router-link>
        </a-menu-item>
      </a-sub-menu>
    </a-menu>
  </div>
</template>

<script>
export default {
  data () {
    return {
      menuList: [
        {
          id: '0',
          name: '首页',
          icon: 'dashboard',
          path: '/dashboard'
        },
        {
          id: '1',
          name: '系统设置',
          icon: 'setting',
          children: [{
            id: '13',
            name: '用户管理',
            icon: 'user',
            path: '/user'
          },{
            id: '11',
            name: '角色管理',
            icon: 'user',
            path: '/roles'
          }, {
            id: '12',
            name: '菜单管理',
            icon: 'user',
            path: '/permission'
          }, {
            id: '14',
            name: '部门管理',
            icon: 'user',
            path: '/department'
          }, ]
        },
        ]
    }
  }
}
</script>

<style>
</style>

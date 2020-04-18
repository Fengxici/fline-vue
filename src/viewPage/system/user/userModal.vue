<template>
  <div>
    <a-modal title="分配角色" @ok="handleOk" v-model="visible">
      <!-- 分配角色 -->
      <a-form :form='form'>
        <a-form-item label="角色列表">
          <a-select v-decorator="['roles']" placeholder="请选择角色" mode='multiple' @change='change'>
            <a-select-option v-for='item in rolesList' :key='item.id' :value='item.id'>{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-button type='primary' @click='giveRoles'>分配</a-button>
      </a-form>
      <!-- 当前角色 -->
      <div class="user-roles-content">
        <span class="roles-label">用户当前角色:</span>
        <a-tag closable @close="log" v-for='item in  userInfo' :key='item.id'>{{item.name}}</a-tag>
      </div>
    </a-modal>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        form: this.$form.createForm(this),
        visible: false,
        userInfo:{},
        rolesList: [],
        rolesIdList:[]
      };
    },
    props: {
      show: {
        type: Boolean,
        default: false
      },
      userId: {
        type: String,
        default:null
      },
    },
    watch: {
      show: function() {
        this.visible = !this.visible;
        this.getRoles();
        this.getUserById();
        this.form.resetFields()
        
      }
    },
    methods: {
      // 关闭弹框
      handleOk(e) {
        this.visible = false;
        this.form.resetFields()
      },
      // id查询用户角色
      async getUserById() {
        const {data:res} = await this.$axios.get(this.$api.BASE_ROLE_URL+'/user',{params:{userId: this.userId}})
        if(res.code != 200)  return this.userInfo = [];
        this.userInfo = res.data;
      },
      // 获取角色
      async getRoles() {
        const data = { params: { pageNum: 1, pageSize: 10 } }
        const { data: res } = await this.$axios.get(this.$api.BASE_ROLE_URL+'/page', data)
        if (res.code != 200) return this.$message.error('很抱歉,暂时无法为你查询到相关数据!')
        this.rolesList = res.data.records
      },

      // select回调
      change(value, option) {
        this.rolesIdList = value
      },
      // 标签回调
      log(e) {
        console.log(e);
      },

      // 分配权限
      async giveRoles() {
        const data = this.rolesIdList
        const { data: res } = await this.$axios.post(this.$api.BASE_USER_URL+'/assignRoles/'+this.userId, data)
        if(res.code==200){
          this.$message.success("分配成功")
          this.visible=false;
        }else{ this.$message.error(res.msg)}
      },
    },
  };
</script>

<style scoped>
  .user-roles-content{
    margin: 20px 0;
  }
  .roles-label{
    margin-right: 15px;
  }
</style>

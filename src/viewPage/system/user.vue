<template>
  <div>
    <!-- 查询 -->
    <div class="top-search-box">
      <div></div>
      <div>
        <a-button type='primary' @click='showAdd'>新增</a-button>
      </div>
    </div>
    <div>
      <!-- 表格数据 -->
      <a-table :columns="columns" :dataSource="userList"  :rowKey="record => record.id" bordered
        :pagination='pagination' @change='tableChange'>
        <template #sex='text,rows'>
          {{text == 1?'男':'女'}}
        </template>
        <template #active='text,rows'>
          <span :style="text | colorFilter">{{text == true?'启用':'禁用'}}</span>
        </template>
        <template #action='text,rows'>
          <a href="javascript:;" class="marginR10" @click="confirm(rows)">删除</a>
          <a href="javascript:;" class="marginR10" @click='showUpdate(rows)'>修改</a>
          <a href="javascript:;" class="marginR10" @click='resetPassword(rows)'>重置密码</a>
          <a href="javascript:;" class="marginR10" @click='showGiveRoles(rows)'>分配角色</a>
        </template>
      </a-table>

       <!-- 角色modal -->
       <rolesModal :show='rolesModalVisible' :userId='userId'/>
      <!-- 新增modal -->
      <a-modal title="新增用户" @ok="addhandleOk" v-model="addvisible" width='600px' :bodyStyle='{height:"400px",overflow:"auto"}'>
        <a-form :form="form" >
          <a-form-item label="用户名">
            <a-input  v-decorator="['username', ]" placeholder="请输入用户名" />
          </a-form-item>
          <a-form-item label="姓名">
            <a-input  v-decorator="['name', ]" placeholder="请输入姓名" />
          </a-form-item>
          <a-form-item label="密码">
            <a-input  v-decorator="['password', ]" placeholder="请输入密码" />
          </a-form-item>
          <a-form-item label="手机号">
            <a-input  v-decorator="['mobilePhone', ]" placeholder="请输入手机号" />
          </a-form-item>
          <a-form-item label="状态">
            <a-select v-decorator="['active']" placeholder="请选择状态">
              <a-select-option :value='1'>启用</a-select-option>
              <a-select-option :value="0">禁用</a-select-option>
              </a-select>
          </a-form-item>
          <a-form-item label="性别">
            <a-select v-decorator="['sex']" placeholder="请选择性别">
              <a-select-option :value="1">男</a-select-option>
              <a-select-option :value="0">女</a-select-option>
              </a-select>
          </a-form-item>
        </a-form>
      </a-modal>

      <!-- 更新modal -->
      <a-modal title="更新用户" @ok="updatehandleOk" v-model="updatevisible" width='600px' :bodyStyle='{height:"400px",overflow:"auto"}'>
        <a-form :form="form" >
          <a-form-item label="编号" v-show="false">
            <a-input  v-decorator="['id', ]" placeholder="请输入编号" />
          </a-form-item>
          <a-form-item label="用户名">
            <a-input  v-decorator="['username', ]" placeholder="请输入用户名" />
          </a-form-item>
          <a-form-item label="姓名">
            <a-input  v-decorator="['name', ]" placeholder="请输入姓名" />
          </a-form-item>
          <a-form-item label="手机号">
            <a-input  v-decorator="['mobilePhone', ]" placeholder="请输入手机号" />
          </a-form-item>
          <a-form-item label="状态">
            <a-select v-decorator="['active']" placeholder="请选择状态">
              <a-select-option :value='1'>启用</a-select-option>
              <a-select-option :value="0">禁用</a-select-option>
              </a-select>
          </a-form-item>
          <a-form-item label="性别">
            <a-select v-decorator="['sex']" placeholder="请选择性别">
              <a-select-option :value="1">男</a-select-option>
              <a-select-option :value="0">女</a-select-option>
              </a-select>
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </div>
</template>

<script>
  import rolesModal from '@/viewPage/system/user/userModal'
  const columns = [
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '性别',
        dataIndex: 'sex',
        key: 'sex',
        scopedSlots: { customRender: 'sex' },
      },
      {
        title: '手机号',
        dataIndex: 'mobilePhone',
        key: 'mobilePhone',
      },
      {
        title: '状态',
        dataIndex: 'active',
        key: 'active',
        scopedSlots: { customRender: 'active' },
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        scopedSlots: { customRender: 'action' },
      },
  ]
  export default {
    data() {
      return {
        form:this.$form.createForm(this),
        userList:[],
        columns,
        addvisible:false,
        updatevisible:false,
        rolesModalVisible:false,
        userId:'',
        pagination:{
          pageSizeOptions: ['10', '20', '30', '40', '50'],
          current:1,
          pageSize:10,
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0,
          showTotal: (total, range) => `共 ${total} 条记录`
        },
      }
    },
    created() {
      this.getUserList()
    },
    components:{
      rolesModal
    },
    methods: {
      tableChange(pagination) {
        this.pagination = pagination;
        this.getUserList()
      },
      // 新增弹框确定事件
      addhandleOk(e) { this.addUser(); },
      updatehandleOk(e) { this.updateUser(); },
      showAdd() { this.addvisible = true; },
      showUpdate(rows) { this.updatevisible = true; this.fillValues(rows) },
      showReset(rows){
        // todo 重置密码
        this.$message.warn('请补充!')
      },
      // 用户列表
      async getUserList() {
        const data = {}
        data.pageSize = this.pagination.pageSize
        data.pageNum = this.pagination.current
        const {data:res} = await this.$axios.get(this.$api.BASE_USER_URL+'/page', {  params: data })
        if(res.code != 200)  return this.$message.error('很抱歉,暂时无法为你查询到相关数据!')
        this.userList = res.data.records;
        const pagination = { ...this.pagination }
        pagination.total = Number(res.data.total)
        this.pagination = pagination
      },
      // 新增用户
      addUser() {
        this.form.validateFields((err, values) => {
          if (!err) {
            const addData = { ...values }
            // 处理表单值为布尔类型报错
            addData.active == 1?addData.active=true:addData.active=false;
            const { $axios, $qs, $message } = this;
            $axios.post(this.$api.BASE_USER_URL+'/create',addData)
              .then(res => {
                if(res.data.code == 200) {
                  $message.info('恭喜你,已为你新增用户信息!')
                  this.getUserList()
                  this.form.resetFields()
                  this.addvisible = false; 
                } else $message.error(res.data.msg)
              })
            .catch(err => console.log(err))
          }
        })
      },
      showAddModal() {this.addShow = !this.addShow},
      // 删除提示
      confirm(rows) {
        this.$confirm({
          title: '提示',
          content: '确定要删除当前数据吗?',
          onOk: () => this.deleteUser(rows),
          onCancel() {},
        });
      },
      // 删除用户
      deleteUser(rows) {
        const { $axios, $qs, $message } = this;
        $axios.delete(this.$api.BASE_USER_URL+"/remove?userId="+rows.id)
        .then(res => {
          if(res.data.code == 200) {
            $message.info('恭喜你,已经为你删除当前用户信息!')
            this.getUserList()
          } else $message.error('删除失败,请检查删除操作是否正确!')
        })
      },
      // 更新用户信息
      updateUser() {
        this.form.validateFields((err, values) => {
          if (!err) {
            const addData = { ...values }
            // 处理表单值为布尔类型报错
            addData.active == 1?addData.active=true:addData.active=false;
            const { $axios, $qs, $message } = this;
            $axios.put(this.$api.BASE_USER_URL+'/update',addData)
              .then(res => {
                if(res.data.code == 200) {
                  $message.info('恭喜你,已为你更新用户信息!')
                  this.getUserList()
                  this.form.resetFields()
                  this.updatevisible = false;  
                } else $message.error('更新失败,请检查表单信息是否填写正确!')
              })
            .catch(err => console.log(err))
          }
        })
      },
      resetPassword(row){
        this.$axios.put(this.$api.BASE_USER_URL+'/resetPassword?id='+row.id)
          .then(res => {
            if(res.data.code == 200) {
              this.$message.info('密码重置成功!')
              this.getUserList()
            } else this.$message.error('密码重置失败!')
          })
        .catch(err => console.log(err))
      },
      // 分配角色
      showGiveRoles(rows) {
        this.userId = rows.id;
        this.rolesModalVisible = !this.rolesModalVisible
      },
      // 填充表单
      fillValues(rows) {
        this.$nextTick(()=>{
          this.form.setFieldsValue({
            id:rows.id,
            username:rows.username,
            password:rows.password,
            name:rows.name,
            mobilePhone:rows.mobilePhone,
            active:rows.active==true?1:0,
            sex:rows.sex,
          })
        });
      },
    },
    // 过滤器
    filters: {
      colorFilter: function(value) {
        if (!value) return 'color:red';
        else if (value) return '';
      }
    },
  }
</script>

<style scoped>
.top-search-box{
  display: flex;justify-content: space-between;margin: 15px 0;
}
</style>

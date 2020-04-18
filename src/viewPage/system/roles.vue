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
      <a-table :columns="columns" :dataSource="roleList" :rowKey="record => record.id" :pagination="pagination" @change="handleTableChange" bordered>
        <template #active='text'>
          <span :style="text | colorFilter">{{text == true?'启用':'禁用'}}</span>
        </template>
        <template #action='text,rows'>
          <a href="javascript:;" class="marginR10" @click='confirm(rows)'>删除</a>
          <a href="javascript:;" class="marginR10" @click='showUpdate(rows)'>修改</a>
          <a href="javascript:;" @click="showPermission(rows)">分配权限</a>
        </template>
      </a-table>
      <!-- 新增modal -->
      <a-modal title="新增角色" @ok="addhandleOk" v-model="addvisible" width='600px' :bodyStyle='{height:"400px",overflow:"auto"}'>
        <a-form :form="form" >
          <a-form-item label="编码">
            <a-input  v-decorator="['code', ]" placeholder="请输入编码" />
          </a-form-item>
          <a-form-item label="名称">
            <a-input  v-decorator="['name', ]" placeholder="请输入名称" />
          </a-form-item>
          <a-form-item label="描述">
            <a-input  v-decorator="['description', ]" placeholder="请输入描述" />
          </a-form-item>
          <a-form-item label="状态">
            <a-select v-decorator="['active']" placeholder="请选择状态">
              <a-select-option :value='1'>启用</a-select-option>
              <a-select-option :value="0">禁用</a-select-option>
              </a-select>
          </a-form-item>
        </a-form>
      </a-modal>
     <!-- 分配权限 -->
      <a-modal title="分配权限" @ok="navHandOk" v-model="navvisible" >
         <a-tree @expand="onExpand" checkable  v-model="treeCheckedKeys" :expandedKeys="expandedKeys"  :autoExpandParent="autoExpandParent" :treeData="dataTree"></a-tree>
      </a-modal>
      <!-- 更新modal -->
      <a-modal title="更新角色" @ok="updatehandleOk" v-model="updatevisible" width='600px' :bodyStyle='{height:"400px",overflow:"auto"}'>
        <a-form :form="form" >
          <a-form-item label="id" hidden>
            <a-input  v-decorator="['id', ]" />
          </a-form-item>
          <a-form-item label="编码">
            <a-input  v-decorator="['code', ]" placeholder="请输入编码" />
          </a-form-item>
          <a-form-item label="名称">
            <a-input  v-decorator="['name', ]" placeholder="请输入名称" />
          </a-form-item>
          <a-form-item label="描述">
            <a-input  v-decorator="['description', ]" placeholder="请输入描述" />
          </a-form-item>
          <a-form-item label="状态">
            <a-select v-decorator="['active']" placeholder="请选择状态">
              <a-select-option :value='1'>启用</a-select-option>
              <a-select-option :value="0">禁用</a-select-option>
              </a-select>
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </div>
</template>

<script>
  const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '编码',
        dataIndex: 'code',
        key: 'code',
      },
      {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
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
        roleList:[],
        trueValue:true,
        columns,
        pagination: {current:1,pageSize:10,total:0,showSizeChanger:true},
        updatevisible:false,
        addvisible:false,
        navvisible:false,
        dataTree:[],
        roleId:null,
        expandedKeys: [],//菜单树展开数据
        autoExpandParent: true,
        treeCheckedKeys: [],//菜单树选择数据
      }
    },

    created() {
      this.getRoleList();
    },

    methods: {

      // 分配权限
      navHandOk() {this.givePermission()},

      // 更新
      updatehandleOk() { this.updateRole(); },

      // 新增弹框确定事件
      addhandleOk(e) {  this.addRoles(); },

      // 新增角色
      showAdd() { this.addvisible = true; },

      // 更新弹框
      showUpdate(rows) { this.updatevisible = true; this.fillValues(rows) },

      // 分配权限
      showPermission(rows) {
        this.navvisible = true; 
        this.roleId = rows.id;
        this.getMenuTree()
      },

      // 角色列表
      async getRoleList() {
        const data = {  params:{  pageNum: this.pagination.current,  pageSize: this.pagination.pageSize }  }
        const {data:res} = await this.$axios.get(this.$api.BASE_ROLE_URL+'/page', data)
        if(res.code != 200)  return this.$message.error('暂无数据!')
        {
          this.roleList = res.data.records;
          this.pagination.total=parseInt(res.data.total);
        }
      },

      // 表格改变回调
      handleTableChange(pagination, filters, sorter) {
        console.log(pagination);
        const pager = { ...this.pagination };
        pager.current = pagination.current;
        pager.pageSize = pagination.pageSize;
        this.pagination = pager;
        this.getRoleList();
      },

      // 新增角色
      addRoles() {
        this.form.validateFields((err, values) => {
          if (!err) {
            const addData = { ...values }
            // 处理表单值为布尔类型报错
            addData.active == 1?addData.active=true:addData.active=false;
            const { $axios, $qs, $message } = this;
            $axios.post(this.$api.BASE_ROLE_URL+'/create',addData)
              .then(res => {
                if(res.data.code == 200) {
                  $message.info('恭喜你,已为你新增角色信息!')
                  this.getRoleList()
                  this.addvisible = false;
                  this.form.resetFields() 
                } else $message.error('新增失败,请检查表单信息是否填写正确!')
              })
            .catch(err => console.log(err))
          }
        })
      },

      // 更新角色信息
      updateRole() {
        this.form.validateFields((err, values) => {
          if (!err) {
            const addData = { ...values }
            // 处理表单值为布尔类型报错
            addData.active == 1?addData.active=true:addData.active=false;
            const { $axios, $qs, $message } = this;
            $axios.put(this.$api.BASE_ROLE_URL+'/update',addData)
              .then(res => {
                if(res.data.code == 200) {
                  $message.info('恭喜你,已为你更新角色信息!')
                  this.getRoleList()
                  this.updatevisible = false;  
                } else $message.error('更新失败,请检查表单信息是否填写正确!')
              })
            .catch(err => console.log(err))
          }
        })
      },

      // 删除提示
      confirm(rows) {
        this.$confirm({
          title: '提示',
          content: '确定要删除当前数据吗?',
          onOk: () => this.deleteRole(rows),
          onCancel() {},
        });
      },

      // 删除角色
      deleteRole(rows) {
        const { $axios, $qs, $message } = this;
        $axios.delete(this.$api.BASE_ROLE_URL+'/remove?roleId='+rows.id)
        .then(res => {
          if(res.data.code == 200) {
            $message.info('恭喜你,已经为你删除当前角色信息!')
            this.getRoleList()
          } else $message.error('删除失败,请检查删除操作是否正确!')
        })
      },

      // 获取菜单树
      getMenuTree() {
        this.dataTree = []
        this.treeCheckedKeys = []
        this.$axios.get(this.$api.BASE_PERMISSION_URL+'/menu/tree/role', {params:{roleId:this.roleId}})
        .then(res=>{
          if(res){
            var data = res.data.data
            if(data.permissionTree)
              this.dataTree = data.permissionTree
             if(data.hasList)
              this.treeCheckedKeys=data.hasList
          }
        })
        .catch(err=>this.$message.error(err))
      },
      onExpand  (expandedKeys) {
        this.expandedKeys = expandedKeys
        this.autoExpandParent = false
      },
      // 分配权限
      givePermission() {
        const data = this.treeCheckedKeys
        this.$axios.post(this.$api.BASE_ROLE_URL+'/assignPermission/'+this.roleId, data)
        .then(res=>{
          if(res.data.code==200){
            this.navvisible = false; 
            this.$message.success("分配成功")
          }else{
            this.$message.error(res.data.msg);
          }
        })
      },

      // 填充表单
      fillValues(rows) {
        this.$nextTick(()=>{
          this.form.setFieldsValue({
            id: rows.id,
            name: rows.name,
            code:  rows.code,
            description:  rows.description,
            active:rows.active==true?1:0,
          })
        });
      },
    },

    filters: {
      colorFilter: function(value) {
        if (!value) return 'color:red';
        else if (value) return '';
      }
    }
  }
</script>

<style scoped>
  .top-search-box{
    display: flex;
    justify-content: space-between;
    margin: 15px 0;
  }
</style>

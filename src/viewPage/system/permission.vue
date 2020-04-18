<template>
  <div class="permission-container">
    <div class="nav-container">
      <div>
        <a-radio-group value="small">
          <a-radio-button @click='add'>新增</a-radio-button>
          <a-radio-button @click='deleteTree'>删除</a-radio-button>
        </a-radio-group>
      </div>
      <a-tree
         :showLine="true"
         :treeData="treeData"
         defaultExpandAll
         :autoExpandParent="true"
         @select="onSelect"
       >
       </a-tree>
    </div>
    <div class="add-container">
        <a-form :form="form" ref='add'>
           <a-form-item v-bind="formItemLayout">
              <a-input hidden v-decorator="['id',]"/>
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="父级ID">
              <a-input
              disabled
                v-decorator="[
                  'parentId',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请选择一个要增加菜单的父级菜单项!',
                      },
                    ],
                  },
                ]"
                placeholder="请输入父级ID"
              />
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="名称">
              <a-input
                v-decorator="[
                  'name',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入名字',
                      },
                    ],
                  },
                ]"
                placeholder="请输入名字"
              />
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="图标">
              <a-input
                v-decorator="[
                  'icon',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入图标',
                      },
                    ],
                  },
                ]"
                placeholder="请输入图标"
              />
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="类型">
              <a-select v-decorator="['type',{
                    rules: [
                      {
                        required: true,
                        message: '请选择类型',
                      },
                    ],
                  },]" placeholder="请选择类型">
                <a-select-option :value='0'>菜单</a-select-option>
                <a-select-option :value="1">按钮</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="编码">
              <a-input
                v-decorator="[
                  'code',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入编码',
                      },
                    ],
                  },
                ]"
                placeholder="请输入编码"
              />
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="路径">
              <a-input
                v-decorator="[
                  'location',
                ]"
                placeholder="请输入路径"
              />
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="描述">
              <a-input
                v-decorator="[
                  'memo',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入描述',
                      },
                    ],
                  },
                ]"
                placeholder="请输入描述"
              />
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="排序">
              <a-input
                v-decorator="[
                  'ordinal',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入排序',
                      },
                    ],
                  },
                ]"
                placeholder="请输入排序"
              />
            </a-form-item>
          </a-form>
        <div class="add-button">
          <a-button type='primary' @click='addPermissions'>保存</a-button>
        </div>
    </div>
  </div>
</template>

<script>
  import pick from 'lodash.pick'

  export default {

    data() {
      return {
        form:this.$form.createForm(this),
        checkedKey: null,
        treeData: [{
          title: '根目录',
          key: "0",
          children: []
        }],
        confirmDirty: false,
        autoCompleteResult: [],
        formItemLayout: {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
          },
        },
        updateVisible:false,
      }
    },

    created() {
      this.getMenuTree()
    },

    methods: {
      // 获取菜单树
      async getMenuTree() {
        const { data: res } = await this.$axios.get(this.$api.BASE_PERMISSION_URL+'/menu/tree', {})
        if (res.code != 200) return this.$message.error('暂时无法查询到相关数据!')
        this.treeData[0].children = res.data
      },
      onSelect(checkedKeys, info) {
        this.checkedKey = checkedKeys[0]
        if(!this.checkedKey||this.checkedKey=="0")
          this.fillFormOne()
        else
          this.getpermissionById()
      },

      // 删除
      async deleteTree() {
        const { data: res } = await this.$axios.delete(this.$api.BASE_PERMISSION_URL+"/remove?id="+this.checkedKey)
        if (res.code != 200) return this.$message.error('删除出错!!')
        this.getMenuTree();
        this.checkedKey=null
        this.$message.info('已经为你成功删除!')
      },

      // 保存
      async addPermissions() {
        this.form.validateFields((err, values) => {
          if (!err) {
            const { $axios, $qs, $message } = this;
            !values.parentId?values.parentId="0":values.parentId=values.parentId
            if(values.id){
              $axios.put(this.$api.BASE_PERMISSION_URL+'/update', values)
              .then(res => {
                if(res.data.code == 200) {
                  $message.info('恭喜你,已为你修改权限信息!')
                  this.getMenuTree()
                } else $message.error('修改失败,请检查表单信息是否填写正确!')
              })
              .catch(err => console.log(err))
            }else{
              $axios.post(this.$api.BASE_PERMISSION_URL+'/create', values)
              .then(res => {
                if(res.data.code == 200) {
                  $message.info('恭喜你,已为你新增权限信息!')
                  this.getMenuTree()
                } else $message.error(res.data.msg)
              })
            .catch(err => console.log(err))
            }            
          }
        })
      },

      async getpermissionById() {
        if(!this.checkedKey) {
          this.$message.warn("请选择一个菜单")
          return 
        }
        const { data: res } = await this.$axios.get(this.$api.BASE_PERMISSION_URL+"/"+this.checkedKey)
        if (res.code != 200) return this.$message.error('请选择要修改的菜单!')
        if(res.data){
          delete res.data.createBy
          delete res.data.createTime
          delete res.data.updateBy
          delete res.data.updateTime
          this.fillForm(res.data)
        }
      },

      fillFormOne() {
        this.form.resetFields()
        if(!this.checkedKey)
          this.checkedKey='0'
        this.$nextTick(()=>{
          this.form.setFieldsValue({parentId:this.checkedKey})
        });
      },
      // 填充
      fillForm(rows) {
        this.form.resetFields()
        this.$nextTick(()=>{
          this.form.setFieldsValue(pick(rows, 'id','name','code','memo','icon','ordinal','parentId','type'))
        });
      },
      // 添加
      add() {
        this.fillFormOne()
      },
    }
  }
</script>

<style scoped lang="less">

  .permission-container {
    display: flex;
    justify-content: space-between;

      .nav-container {
        width: 43%;
        padding: 20px;
        border-right: 1px solid #ccc;
      }

      .add-container {
        width: 53%;
        padding: 20px;

          /deep/ .ant-form-horizontal {
            width: 70%;
          }

        .add-button {
          text-align: right;
          margin: 20px 0;
        }
      }
  }


    .custom-tree {

        /deep/ .ant-menu-item-group-title {
          position: relative;
          &:hover {
            .btn {
              display: block;
            }
          }
        }

        /deep/ .ant-menu-item {
          &:hover {
            .btn {
              display: block;
            }
          }
        }

        /deep/ .btn {
          display: none;
          position: absolute;
          top: 0;
          right: 10px;
          width: 20px;
          height: 40px;
          line-height: 40px;
          z-index: 1050;

          &:hover {
            transform: scale(1.2);
            transition: 0.5s all;
          }
        }
      }

</style>

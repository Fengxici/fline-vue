<template>
  <div class="department-container">
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
            <a-form-item v-bind="formItemLayout" label="上级部门ID">
              <a-input
              disabled
                v-decorator="[
                  'parentId',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请选择一个要增加部门的上级部门!',
                      },
                    ],
                  },
                ]"
                placeholder="请选择上级部门"
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
                        message: '请输入名称',
                      },
                    ],
                  },
                ]"
                placeholder="请输入名称"
              />
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
          </a-form>
        <div class="add-button">
          <a-button type='primary' @click='addDepartment'>保存</a-button>
        </div>
    </div>
  </div>
</template>

<script>
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
      this.getDeptmartTree()
    },
    methods: {
      // 获取部门树
      async getDeptmartTree() {
        const { data: res } = await this.$axios.get(this.$api.BASE_DEPT_URL+'/tree', {})
        if (res.code != 200) return this.$message.error('暂时无法查询到相关数据!')
        this.treeData[0].children = res.data
      },
      onSelect(checkedKeys, info) {
        this.checkedKey = checkedKeys[0]
        if(!this.checkedKey||this.checkedKey=="0")
          this.fillFormOne()
        else
          this.getDepartmentById()
      },

      // 删除
      async deleteTree() {
        const { data: res } = await this.$axios.delete(this.$api.BASE_DEPT_URL+"/remove?id="+this.checkedKey)
        if (res.code != 200) return this.$message.error('删除出错!!')
        this.getDeptmartTree();
        this.checkedKey=null
        this.$message.info('已经为你成功删除!')
      },

      // 保存
      async addDepartment() {
        this.form.validateFields((err, values) => {
          if (!err) {
            const { $axios, $qs, $message } = this;
            !values.parentId?values.parentId="0":values.parentId=values.parentId
            if(values.id){
              $axios.put(this.$api.BASE_DEPT_URL+'/update', values)
              .then(res => {
                if(res.data.code == 200) {
                  $message.info('恭喜你,已为你修改部门信息!')
                  this.getDeptmartTree()
                } else $message.error('修改失败,请检查表单信息是否填写正确!')
              })
              .catch(err => console.log(err))
            }else{
              $axios.post(this.$api.BASE_DEPT_URL+'/create', values)
              .then(res => {
                if(res.data.code == 200) {
                  $message.info('恭喜你,已为你新增部门信息!')
                  this.getDeptmartTree()
                } else $message.error(res.data.msg)
              })
            .catch(err => console.log(err))
            }
          }
        })
      },

      async getDepartmentById() {
        if(!this.checkedKey) {
          this.$message.warn("请选择一个部门")
          return
        }
        const { data: res } = await this.$axios.get(this.$api.BASE_DEPT_URL+"/"+this.checkedKey)
        if (res.code != 200) return this.$message.error('发生未知错误!')
        if(res.data){
          delete res.data.createBy
          delete res.data.createTime
          delete res.data.updateBy
          delete res.data.updateTime
          delete res.data.level
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
          this.form.setFieldsValue({...rows})
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

  .department-container {
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
      /deep/ .ant-department-item-group-title {
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

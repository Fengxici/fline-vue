<template>
	<div class='f_loginBg'>
		<div class='f_loinContent'>
			<a-row>
				<a-col :span='12' class='f_loginPic'>
					<img src='../assets/image/loginBg.png' width='100%' height='500'/>
				</a-col>
				<a-col :span='12'>
					<a-form :form='form' class='f_loginForm'>
						<div class='f_loginTitle'>非线前端VUE模板项目</div>
						<a-form-item label='用户名' :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
							<a-input placeholder="用户名" v-decorator="['username',{ rules: [{ required: true, message: '请输入用户名！' }] }]"/>
						</a-form-item>
						<a-form-item  label='密码' :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
							<a-input placeholder="密码" type="password" v-decorator="['password',{ rules: [{ required: true, message: '请输入密码！' }] }]"/>
						</a-form-item>
						<a-form-item label='验证码' :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
							<a-input placeholder="验证码" v-decorator="['code',{ rules: [{ required: true, message: '请输入验证码！' }] }]" class="seccionContent"/>
							<img title="点击更换验证码" id="codeImg" alt="验证码" :src="codeImg" @click="changeCode" :span="6" style="margin-left:5px"/>
						</a-form-item>
						<a-button type="primary" class='marginT20' block size='large' :loading="isBtnLoading" @click="login">登录</a-button>
					</a-form>
				</a-col>
			</a-row>
		</div>
	</div>
</template>
<script>
    import md5 from 'md5'
    import { mapActions } from 'vuex'
    import { ACCESS_TOKEN } from '@/store/mutation-types'
    export default {
      data () {
        return {
          isBtnLoading: false,
          codeImg: '', // 验证码切换图片
          form: this.$form.createForm(this)
        }
      },
      mounted: function () {
        this.changeCode()
      },
      methods: {
        ...mapActions(['Login']),
        changeCode () {
          this.$nextTick( () => {this.codeImg = this.$api.BASE_COMMON_URL + '/render?'+this.genTimestamp()})
        },
        // 登录
        login () {
          const { Login } = this
          localStorage.login = ''
          this.form.validateFields((err, values) => {
            if (!err) {
            const loginParams = { ...values }
            loginParams.password = md5(values.password)
            Login(this.$qs.stringify(loginParams)).then(res => this.loginSucess(res))
            }
          })
        },
        // 成功回调
        loginSucess(res) {
          if(res.code == 200 && res.data) {
            this.$router.push({path:'/'});
            this.$message.info('欢迎回来,登录成功!')
          } else {
            this.$message.error(res.msg)
            this.changeCode()
          }
        },
        genTimestamp () {
          var time = new Date()
          return time.getTime()
        }
      }
    }
</script>
<style scoped>
.seccionContent {
  margin: 0px auto;
  width: 60%;
}
 #codeImg{
   position: absolute;
   top: -7px;
   right: -124px;
   width: 100px;
   height: 32px;
 }
 .ant-form-item-control {
   position: relative;
 }
</style>

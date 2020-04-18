// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
/** ui框架 **/
import AntUi from "ant-design-vue";
/** 处理axios请求数据格式 **/
import Axios from "axios";
import qs from "qs";
/** vuex **/
import store from './store'
/** 可视化界面图表插件 **/
import viserVue from 'viser-vue'
/* 定义全局日期过滤器 */
import Moment from "moment";

import "moment/locale/zh-cn";
Moment.locale("zh-cn");
//全局api
import api from './constants/api'
Vue.use(AntUi);
Vue.use(viserVue)
Vue.use(router);
Vue.use(store);
Axios.defaults.baseURL = "/";
Vue.prototype.$axios = Axios;
Vue.prototype.$qs = qs;
Vue.prototype.$api = api
Vue.config.productionTip = false;
/* 引入md5加密 */
import md5 from "js-md5";
Vue.prototype.$md5 = md5;
/*ie兼容es6*/
import "babel-polyfill";
import "ant-design-vue/dist/antd.less";
/** 字体框架 **/
import "./assets/css/iconfont/iconfont.js";
/* 引入自己的css、js */
import "./assets/css/components.css";
import "./assets/css/common.css";
import "./assets/css/style.css";
import "./assets/css/reset.css";
// import './components/global.less'
Vue.config.productionTip = false;
// 缓存插件
import Storage from 'vue-ls';
const options = {
  namespace: '', // key prefix
  name: 'ls', // name variable Vue.[ls] or this.[$ls],
  storage: 'session', // storage name session, local, memory
};

Vue.use(Storage, options);
// 权限控制包括路由守卫拦截
import './permission'

/* 引入全局组件 */
Vue.filter("convertTime", function(data, formatStr) {
    return Moment(data).format(formatStr);
});
Vue.filter("NumberFormat", function(value) {
    if (!value) {
        return "0";
    }
    const intPartFormat = value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,"); // 将整数部分逢三一断
    return intPartFormat;
});
Vue.filter("FloatFormat", function(value) {
    if (!value) {
        return "0";
    }
    const intPartFormat = value.toFixed(2);
    return intPartFormat;
});
/* eslint-disable no-new */
new Vue({
    el: "#app",
    router,
    store,
    components: {
        App
    },
    template: "<App/>"
});

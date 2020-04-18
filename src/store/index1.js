import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
const mutations = {
    getReturnURL(state, sum) {
        state.returnURL = sum;
    },
    getPower(state, sum) {
        state.power.push(sum)
    },
};
const actions = {
    getUserMenu(context, sum) { //自定义触发mutations里函数的方法，context与store 实例具有相同方法和属性
        if (sum.length != 0 && sum) {
            for (var i = 0; i < sum.length; i++) {
                if (sum[i].children && sum[i].children.length != 0) {
                    for (var j = 0; j < sum[i].children.length; j++) {
                        context.commit('getPower', sum[i].children[j])
                    }
                }
            }
        }
    },
};
const state = { //要设置的全局访问的state对象
    returnURL: '',
    power: [],
    todoNum: 0
};
const store = new Vuex.Store({
    state,
    mutations,
    actions
});
export default store;
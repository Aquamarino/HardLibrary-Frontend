// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import {router} from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
Vue.use(ElementUI)

//axios 配置
axios.defaults.baseURL = '/api'
axios.defaults.withCredentials = true
axios.defaults.headers.post['Content-Type'] = "application/json;charset=UTF-8"

Vue.config.productionTip = false

// http request 拦截器
axios.interceptors.request.use(
  config => {
    if (localStorage.getItem('Authorization')) {
      config.headers.Authorization = localStorage.getItem('Authorization');
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// // http response 拦截器
// axios.interceptors.response.use(
//   response => {
//     return response
//   },
//   error => {
//     console.log(error.response)
//     if(error) {
//       // 清除token 如果不是register/login, 跳转至login
//       store.commit('logout')
//       router.currentRoute.path !== '/login' &&
//       router.currentRoute.path !== '/register' &&
//       router.replace({
//         path: '/login',
//         query: { redirect: router.currentRoute.path }
//       })
//     }
//     return Promise.reject(error.response.data)
//   }
// )

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store:store,
  components: { App },
  template: '<App/>'
})

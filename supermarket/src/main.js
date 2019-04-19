import Vue from 'vue'
import App from './App.vue'
import router from './router'

// element-ui引入
import ElementUI from 'element-ui'; //js组件
import 'element-ui/lib/theme-chalk/index.css'; // CSS样式

import { Message } from 'element-ui';


// // 1.引入axios
// import axios from 'axios' 因为在request中封装了，所以直接引入request.js即可

// 1.引入request.js      request.js  可以省略js
import request from '@/utils/request'
// 2.把request挂载在Vue原型上，这样所有的Vue实例对象都可以使用
Vue.prototype.request=request;


// 引入local文件
import local from '@/utils/local';

// 引入echarts且挂载在原型上
import echarts from 'echarts';
Vue.prototype.echarts = echarts;

// 要想所有组件都能用，就在主入口引入
// base.css
import './assets/css/base.css'

// element-ui注册
Vue.use(ElementUI);


Vue.config.productionTip = false

// 路由守卫  拦截所有路由  to:将进入的目标路由对象   from：正要离开的路由  next：函数，调用 进入下一个（放行）
router.beforeEach( (to, from, next) =>{
  // alert('哈哈我是路由守卫')
  // 获取浏览器中的token
  const token = local.get('Mango')
  // console.log(token)
  // 判断
  if(token){    //如果有token直接放行
      // 放行
      next(); 
   }else{   //如果没有token
      // 如果本来就要去登录页面    放行
      if(to.path === '/login'){
        next(); 
      }else{
        Message.error('呵呵')
        // 如果想去其他页面  就直接跳转到登录页面  让他登录
          next('/login')
      }
  }
  
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

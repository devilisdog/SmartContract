import App from './App'

// 全局挂载
import { useCounterStore } from '@/stores/counter';

import x2js from 'x2js' //xml数据处理插件
import uView from "uview-ui";

// Vue.prototype.$x2js = new x2js() //创建x2js对象，挂到vue原型上

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = true
App.mpType = 'app'
Vue.use(uView);


const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3

import * as Pinia from 'pinia';//状态管理






import { createSSRApp } from 'vue'




export function createApp() {
  
  const app = createSSRApp(App)
  app.use(Pinia.createPinia());
  app.config.globalProperties.$x2js =  new x2js();
  return {
    app,
	Pinia, // 此处必须将 Pinia 返回
  }
}
//#endif
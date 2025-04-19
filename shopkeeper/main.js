import App from './App'

import {useCounterStore} from "@/stores/counter";

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = true

// 禁用浏览器缓存
Vue.http.headers.common['Cache-Control'] = 'no-cache, no-store, must-revalidate';
Vue.http.headers.common['Pragma'] = 'no-cache';
Vue.http.headers.common['Expires'] = '0';


App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// import { Mui } from 'vue-awesome-mui'

// #ifdef VUE3
import { createSSRApp } from 'vue'

import * as Pinia from "pinia"


export function createApp() {
  const app = createSSRApp(App)
  
  app.use(Pinia.createPinia());
  // app.use(Mui);
  return {
    app,
	Pinia
	// Mui,
  }
}
// #endif
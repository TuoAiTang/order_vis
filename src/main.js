import Vue from 'vue'
import App from './App.vue'
import echarts from "echarts";
import 'echarts/extension/bmap/bmap'
Vue.prototype.$echarts = echarts;
Vue.config.productionTip = false;

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import axios from 'axios'
Vue.prototype.$http = axios;

new Vue({
  el: '#app',
  render: h => h(App)
});


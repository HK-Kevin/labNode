import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';    // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题

import "babel-polyfill";
let baseUrl = 'http://47.94.94.52:714';
let mockUrl =  'http://47.94.94.52:714';


Vue.use(ElementUI);


let instance = axios.create({baseURL: baseUrl});
Vue.prototype.$http = instance;

axios.defaults.baseURL = baseUrl;
Vue.prototype.$axios = axios;
new Vue({
    router,
    render: h => h(App)
}).$mount('#app');

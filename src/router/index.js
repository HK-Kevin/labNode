import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/home',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children: [
                {
                    path: '/add',
                    component: resolve => require(['../components/page/Add.vue'], resolve)
                },
                {
                    path: '/update',
                    component: resolve => require(['../components/page/Update.vue'], resolve)
                },
                {
                    path: '/oneTitle/:id',
                    component: resolve => require(['../components/page/OneTitle.vue'], resolve)
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
    ]
})

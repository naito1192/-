import Vue from 'vue'
import Router from 'vue-router'
import users from './pages/users.vue'
import confirm from './pages/confirm.vue'
import login from './pages/login.vue'
import test from './pages/hello.vue'
import upload from './pages/upload.vue'
import map from './pages/map.vue'
Vue.use(Router)

const routes = [
    { path: '/users', component: users },
    { path: '/', component: map},
    { path: '/confirm', component: confirm},
    { path: '/login', component: login},
    { path: '/test', component: test},
    { path: '/upload', component: upload},
    { path: '/map', component: map}

]

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: routes
})

export default router

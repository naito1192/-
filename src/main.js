import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { Slide } from 'vue-burger-menu'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue' 

Vue.component('slide', Slide);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

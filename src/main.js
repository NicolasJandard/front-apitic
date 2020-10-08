import Vue from 'vue';
import VueRouter from 'vue-router';
import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm';
import Vuelidate from 'vuelidate';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.min.css';

Vue.config.productionTip = false;


Vue.use(VueRouter);
Vue.use(BootstrapVue);
Vue.use(Vuelidate);

import Dashboard from './components/Dashboard.vue';

const routes = [
	{ path: '/', component: Dashboard },
]

const router = new VueRouter({
	mode: 'history',
	routes
})

new Vue({
	router,
	render: h => h(Dashboard)
}).$mount('#app')
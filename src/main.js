import Vue from 'vue'
import VueRouter from 'vue-router'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

Vue.config.productionTip = false


Vue.use(VueRouter)

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
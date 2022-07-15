import { Message } from 'element-ui'
import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'

Vue.config.productionTip = false

Vue.prototype.$message = Message

new Vue({
  render: h => h(App),
}).$mount('#app')

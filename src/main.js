import Vue from 'vue';
import App from './App.vue';
import axios from 'axios';
import VueCarousel from 'vue-carousel';

Vue.config.productionTip = false;

Vue.use(axios, VueCarousel);


new Vue({
  render: h => h(App),
}).$mount('#app');

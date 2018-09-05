import Vue from 'vue';
import App from './index';

const app = new Vue(App);
app.$mount();

export default {
    config: {
        disableScroll: true,
        navigationBarBackgroundColor: '#9f00ff',
        navigationBarTextStyle: 'white',
        backgroundColor: '#9f00ff',
    },
};

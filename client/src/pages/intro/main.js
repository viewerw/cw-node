import Vue from 'vue';
import App from './index';

const app = new Vue(App);
app.$mount();
export default {
    config: {
        disableScroll: true,
        navigationBarBackgroundColor: '#9966ff',
        navigationBarTextStyle: 'white',
        backgroundColor: '#9966ff',
        navigationBarTitleText: '游戏说明',
    },
};

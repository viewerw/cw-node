<template>
    <div class = "login">
        <img class = "logo" src = "/static/img/logo.png"/>
        <div class = "intro">
            <div class = "des">不一样的音乐单词游戏</div>
        </div>
        
        <button class = "auth-btn" open-type = "getUserInfo" lang="zh_CN" @getuserinfo = "onGotUserInfo">点击开始</button>
        
    </div>
</template>
<script>
// import { wxLogin, wxGetUserInfo, wxCheckSession } from '@/utils';

import { service } from '@config';
import { qLogin, wxLogin, qrLogin } from '@/utils';

export default {
    data() {
        return {
            code: '',
        };
    },

    methods: {
        async onGotUserInfo(e) {
            console.log('userinfo', e);
            wx.setStorageSync('userInfo', e.mp.detail.userInfo);
            try {
                const { code } = await wxLogin();
                const loginParams = {
                    code,
                    encryptedData: e.mp.detail.encryptedData,
                    iv: e.mp.detail.iv,
                };
                try {
                    await qrLogin({ loginParams });
                    wx.redirectTo({
                        url: `/pages/index/main?redirect=${this.redirect}`,
                    });
                } catch (err) {
                    console.log('qrlogin err', err);
                }
            } catch (err) {
                console.log('wxlogin err', err);
            }
        },
    },
    onLoad() {},
    created() {},
    async mounted() {
        const { redirect } = this.$root.$mp.query;
        this.redirect = redirect;
        wx.showLoading({
            title: '登录中...',
            mask: true,
        });
        console.log('mounted', service);
        try {
            const userInfo = await qLogin();
            wx.setStorageSync('userInfo', userInfo);
            wx.hideLoading();
            wx.redirectTo({
                url: `/pages/index/main?redirect=${this.redirect}`,
            });
        } catch (e) {
            console.log(e);
            wx.hideLoading();
        }
    },
};
</script>
<style lang="less" scoped>
@import '../../assets/less/common';
.login {
    width: 100vw;
    height: 100vh;
    padding: 50px 0;
    box-sizing: border-box;
    overflow: hidden;
    background-image: linear-gradient(to bottom, @theme, #5f5dff);
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    .title {
        width: 100%;
        height: 50px;
        line-height: 50px;
        font-size: 40px;
        text-align: center;
        color: #ffffff;
    }
    .des {
        width: 100%;
        height: 30px;
        line-height: 30px;
        font-size: 20px;
        text-align: center;
        color: #ffffff;
    }
    .auth-btn {
        width: 180px;
        height: 42px;
        opacity: 0.85;
        border-radius: 21px;
        background-color: #ffffff;

        text-align: center;
        line-height: 42px;
    }
    .logo {
        width: 380rpx;
        height: 368rpx;
    }
}
</style>

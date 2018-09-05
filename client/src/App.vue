<script>
import qcloud from 'wafer2-client-sdk';
import { service } from '@config';
import { mapMutations } from 'vuex';
import store from './store';

export default {
    store,
    created() {
        console.log('app created', qcloud, service);
        qcloud.setLoginUrl(service.loginUrl);
        const unlockSongId = wx.getStorageSync('unlockSongId');
        if (unlockSongId >= 1) {
            this.initSongsLocks(unlockSongId);
        } else if (unlockSongId === '') {
            wx.setStorage({
                key: 'unlockSongId',
                data: 0,
            });
        }
    },
    methods: {
        ...mapMutations(['initSongsLocks']),
    },
};
</script>

<style>
.container {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-image: linear-gradient(to bottom, #9966ff, #5f5dff);

    /* background-image: url(https://media-image1.baydn.com/storage_media_image/vryjyo/6ef2a3a3b343111278ef532847e4a073.df6385e401c94abdc0c39dc12a07e0d4.png); */
    background-size: 100% 100%;
    justify-content: space-between;
    box-sizing: border-box;
}
button::after {
    border: none;
}
button {
    margin: 0;
    padding: 0;
    text-align: left;
}
/* this rule will be remove */
* {
    transition: width 2s;
    -moz-transition: width 2s;
    -webkit-transition: width 2s;
    -o-transition: width 2s;
}
</style>

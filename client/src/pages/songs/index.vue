<template>
    <div class="container songs">
        <scroll-view scroll-y style = "height:100vh">
            <div :href = "'/pages/fight/main?id='+song.id" v-for = "(song,index) in songs" :key = "index" class = "song-card"  @click = "chooseSong(song)">
                <img class = "logo" :src = "song.image_url"/>
                <div class = "description">
                    <div class = "title">{{song.title}}</div>
                    <div class = "level">
                        <div class = "text">难度：</div>
                        <img class = "star" :key = "ind" v-for="(item,ind) in [0,0,0,0,0]" :src ="ind<song.level?'/static/img/icon-star-active.png':'/static/img/icon-star-inactive.png'"/>
                    </div>
                </div>
                <img v-show = "song.lock" class ="lock "  src = "/static/img/icon-lock.png"/>
            </div>
        </scroll-view>
         <modal :show.sync = "modalShow" :option = "modalOption" @complete ="closeModal"/>
    </div>
</template>

<script>
// Use Vuex
import { mapState, mapMutations } from 'vuex';
import store from '@/store';
import modal from '@/components/modal';

export default {
    store,
    components: {
        modal,
    },
    data() {
        return {
            modalShow: false,
            modalOption: {
                opacity: 0.5,
                title: '分享',
                content: '分享到群可以立即体验这首歌曲哦~',
                confirmText: '分享',
                cancelText: '取消',
                showCancel: true,
                type: 'share',
            },
            currentSong: null,
            shareCausedShow: false,
            startTime: 0,
            endTime: 0,
        };
    },
    computed: {
        ...mapState(['songs', 'energy']),
    },
    methods: {
        ...mapMutations(['unlockSong']),
        chooseSong(song) {
            this.currentSong = song;
            if (song.lock) {
                this.modalShow = true;
            } else if (this.energy <= 0) {
                wx.showToast({
                    title: '没有体力了~',
                    icon: 'none',
                });
            } else {
                wx.navigateTo({
                    url: `/pages/fight/main?id=${song.id}`,
                });
            }
        },
        closeModal() {
            this.modalShow = false;
        },
    },
    mounted() {},
    onShow() {
        if (this.shareCausedShow) {
            this.shareCausedShow = false;
            this.endTime = new Date().getTime();
            console.log('time share', this.endTime - this.startTime);
            if (this.endTime - this.startTime < 3000) {
                wx.showToast({
                    title: '出错了，请重新分享',
                    icon: 'none',
                });
            } else {
                this.unlockSong(this.currentSong.id);
            }
        }
    },
    onShareAppMessage() {
        this.startTime = new Date().getTime();
        this.shareCausedShow = true;
        return {
            title: `快来帮我解锁这首${this.currentSong.title}吧~`,
            imageUrl: this.currentSong.image_url,
            path: '/pages/login/main',
        };
    },
};
</script>
<style lang = "less" scoped>
@import '../../assets/less/common';
.songs {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(to bottom, @theme, #5f5dff);
    .song-card {
        width: 686rpx;
        height: 180rpx;
        border-radius: 32rpx;
        background-color: #fafafa;
        margin: 30rpx auto;
        padding: 30rpx;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);

        .logo {
            width: 140rpx;
            height: 140rpx;
            border-radius: 50%;
        }
        .lock {
            width: 26px;
            height: 32px;
        }
        .description {
            width: 432rpx;
            margin-left: 20rpx;
            display: flex;
            flex-direction: column;
            justify-content: center;
            .title {
                font-size: 34rpx;
                font-weight: 500;
                letter-spacing: -0.8rpx;
                text-align: left;
                color: #333333;
                margin-bottom: 20rpx;
            }
            .text {
                opacity: 0.6;

                font-size: 28rpx;
                letter-spacing: -0.6rpx;
                text-align: left;
                color: #333333;
            }
            .level {
                display: flex;
                align-items: flex-start;
                .text {
                    color: #666666;
                    margin-top: -3px;
                    font-size: 14px;
                }
                .star {
                    width: 18px;
                    height: 18px;
                }
            }
        }
    }
}
</style>

<template>
  <div class="home" >
    <div class="userinfo" >
        <button class = "share-btn" @click.stop open-type = "share" >
            <img src ="/static/img/home-share.png"/>
            <div>分享</div>
        </button>
        <a class = "game-rules" href = "/pages/intro/main" :session-from="feedUser">
            <img src ="/static/img/game-rule.png"/>
            <div>规则</div>
        </a>
      <img class="userinfo-avatar" v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" background-size="cover" @click.stop = "personalInfo"/>
      <div class="userinfo-nickname">
        <div>{{userInfo.nickName}}</div>
      </div>
      <div class = "energy">
          <div class ="text">体力值：</div>
          <div class = "icons">
              <img class = "energy-icon" v-for ="(item,index) in activeEnergy" :key = "index"  src = "/static/img/energy-green.png"/>
              <img class = "energy-icon" v-for ="(item,index) in inactiveEnergy" :key = "index"  src = "/static/img/energy-inactive.png"/>
          </div>
      </div>
    </div>
    <div class = "menus">
        <div @click = "navSongsPage" class = "nav song-fight">
            <img src = "/static/img/champion.png" />
            <span>歌曲挑战</span>
        </div>
        <div class = "nav game-intro" @click ="navDailyFight">
            <img src = "/static/img/intro.png" />
            <span>每日挑战</span>
        </div>
        <div @click = "getEnergy" class = "nav energy-bank">
            <div class = "bank">
                <div class = "energy-count">
                    <img src = "/static/img/energy-green.png"/>
                    <span>{{showBankEnergy}}/5</span>
                </div>
                <div class = "time">
                    <div class = "inner" :style="{width:(1800-bankTime)/18+'%'}"></div>
                    <div class = "interval">{{showTime}}</div>
                </div>
            </div>
            <span>体力银行</span>
        </div>
        <a href = "/pages/rank/main" class = "nav rank">
            <img src = "/static/img/rank.png" />
            <span>排行榜</span>
        </a>
        <div @click = "notYet" class = "nav friend-fight">
            <img src = "/static/img/friend-fight.png" />
            <span>好友对战</span>
        </div>
        <a href = "/pages/personal-center/main" class = "nav personal-center">
            <img src = "/static/img/personal-center.png" />
            <span>个人中心</span>
        </a>
    
    </div>
    <!-- <a href = "/pages/songs/main" class ="start-btn">开始游戏</a> -->
    <img src = "/static/img/bottom-bg.png" class = "bottom-bg"/>
  </div>
</template>

<script>
import card from '@/components/card';
import { toJson, showModal } from '@/utils';
import { mapState, mapMutations } from 'vuex';
import store from '@/store';

export default {
    store,
    data() {
        return {
            motto: 'Hello World',
            userInfo: {},
            energys: [1, 1, 1, 1, 1],
            bankTime: 0,
            startBankCount: false,
            intervalId: 0,
            feedUser: '',
            shareCausedShow: false,
            startTime: 0,
            endTime: 0,
        };
    },
    computed: {
        ...mapState(['energy', 'bankTimeStart']),
        showTime() {
            /* eslint-disable */
            const min = Math.floor(this.bankTime / 60);
            const sec = this.bankTime - min * 60;
            /* eslint-disable */
            // eslint-disable-next-line
            return `${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`;
        },
        showBankEnergy() {
            return Math.floor((1800 - this.bankTime) / 360);
        },
        activeEnergy() {
            return new Array(this.energy).fill(1);
        },
        inactiveEnergy() {
            return new Array(5 - this.energy).fill(1);
        },
    },
    watch: {
        energy(val) {},
    },
    components: {
        card,
    },

    methods: {
        ...mapMutations(['increaseEnergy', 'setBankTimeStart']),

        clickHandle(msg, ev) {
            console.log('clickHandle:', msg, ev);
        },
        getEnergy() {
            if (this.showBankEnergy === 0) {
                return;
            } else if (this.showBankEnergy + this.energy > 5) {
                showModal({
                    title: '提示',
                    content: `你现在最多可以收取${5 - this.energy}点体力，确定现在收取吗？`,
                }).then(res => {
                    if (res.confirm) {
                        const time = Math.floor(new Date().getTime() / 1000);
                        this.increaseEnergy(5 - this.energy);
                        wx.setStorage({ key: 'bankTimeStart', data: time });
                        this.setBankTimeStart(time);
                        this.bankTime = 1800;
                        this.startBankCount = true;
                    }
                });
            } else {
                const time = Math.floor(new Date().getTime() / 1000);
                this.increaseEnergy(this.showBankEnergy);
                wx.setStorage({ key: 'bankTimeStart', data: time });
                this.setBankTimeStart(time);
                this.bankTime = 1800;
                this.startBankCount = true;
            }
        },
        dailyFight() {
            wx.navigateTo({
                url: '/pages/fight/main?type=dailyfight',
            });
        },
        personalInfo() {
            wx.navigateTo({ url: '/pages/personal-center/main' });
        },
        notYet() {
            wx.showToast({
                icon: 'none',
                title: '敬请期待...',
            });
        },
        navDailyFight() {
            if (this.energy === 0) {
                wx.showToast({
                    icon: 'none',
                    title: '没有体力了，分享到群补充体力吧~',
                });
            } else {
                wx.navigateTo({
                    url: '/pages/fight/main?type=dailyfight',
                });
            }
        },
        navSongsPage() {
            if (this.energy === 0) {
                wx.showToast({
                    icon: 'none',
                    title: '没有体力了，分享到群补充体力吧~',
                });
            } else {
                wx.navigateTo({
                    url: '/pages/songs/main',
                });
            }
        },
    },

    created() {
        // 调用应用实例的方法获取全局数据

        console.log(JSON.stringify(toJson('a b')));
        const value = wx.getStorageSync('bankTimeStart');
        if (value) {
            this.setBankTimeStart(value);
        } else {
            this.setBankTimeStart(0);
        }

        const now = Math.round(new Date().getTime() / 1000);

        if (now - this.bankTimeStart >= 1800) {
            this.bankTime = 0;
        } else {
            this.bankTime = 1800 - (now - this.bankTimeStart);
            this.startBankCount = true;
        }
        this.intervalId = setInterval(() => {
            if (this.startBankCount) {
                this.bankTime--;
            }
        }, 1000);
    },
    mounted() {
        console.log('on mounted');
        console.log(this.$root.$mp.query.redirect === undefined);
        if (this.$root.$mp.query.redirect !== 'undefined') {
            wx.navigateTo({
                url: decodeURIComponent(this.$root.$mp.query.redirect),
            });
            return;
        }
        this.userInfo = wx.getStorageSync('userInfo');
        const newUser = wx.getStorageSync('newUser');
        if (newUser === '') {
            wx.showModal({
                title: '欢迎您',
                content: '欢迎来到拼词乐斗，你可以先了解游戏规则~',
                showCancel: false,
                success(res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '/pages/intro/main',
                        });
                    }
                },
            });
            wx.setStorage({
                key: 'newUser',
                data: false,
            });
        }
    },
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
                this.increaseEnergy(5 - this.energy);
            }
        }
    },
    onUnload() {
        clearInterval(this.intervalId);
    },
    onShareAppMessage() {
        this.startTime = new Date().getTime();
        this.shareCausedShow = true;
        return {
            title: `${this.userInfo.nickName}@你，音乐+英语+游戏，了解一下？`,
            path: '/pages/login/main',
        };
    },
};
</script>

<style lang = 'less' scoped>
@import '../../assets/less/common';

.home {
    position: relative;
    width: 100vw;
    height: 100vh;
    background-image: linear-gradient(to bottom, @theme, #5f5dff);
    padding: 18px;
    box-sizing: border-box;

    .start-btn {
        width: 200px;
        height: 44px;
        line-height: 88rpx;
        border-radius: 33.5px;
        background-color: #f1a92a;
        box-shadow: inset 2px -4px 0 0 #e49e24;
        font-size: 32rpx;
        font-weight: 500;
        text-align: center;
        color: #fff;
    }
    .userinfo {
        position: relative;
        width: 100%;
        height: 130px;
        padding: 8px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 10px;
        background-image: linear-gradient(to bottom, rgb(164, 0, 255), rgb(136, 9, 255));
        box-shadow: 0 0 20px 2px rgb(101, 0, 245);
        .share-btn {
            position: absolute;
            padding: 0;
            margin: 0;
            border: none;
            top: 10px;
            right: 10px;
            width: 78rpx;
            height: 98rpx;
            background-color: transparent;
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 12px;
            color: #fff;
            line-height: 2;
            img {
                width: 100%;
                height: 58rpx;
            }
        }
        .game-rules {
            position: absolute;
            padding: 0;
            margin: 0;
            border: none;
            top: 10px;
            left: 10px;
            width: 44px;
            height: 54px;
            background-color: transparent;
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 12px;
            color: #fff;
            img {
                width: 100%;
                height: 34px;
            }
        }
        .userinfo-avatar {
            width: 100rpx;
            height: 100rpx;
            border: 3px solid #fff;
            border-radius: 50%;
        }

        .userinfo-nickname {
            font-size: 15px;
            line-height: 16px;
            margin: 8px 0;
            color: #fff;
        }
        .energy {
            display: flex;
            .text {
                font-size: 15px;
                color: #fff;
            }
            .icons {
                .energy-icon {
                    width: 20px;
                    height: 20px;
                }
            }
        }
    }
    .menus {
        position: relative;
        z-index: 2;
        margin-top: 10px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;

        .nav {
            display: flex;
            justify-content: space-around;
            align-items: center;
            color: #ffffff;
            border-radius: 16px;
            /* background-color: rgb(65, 202, 255); */
            /* background-color: rgb(255, 127, 255); */
            background-color: rgb(136, 9, 255);
            box-shadow: 0 1px 5px 0 rgb(101, 0, 245);
        }
        .song-fight {
            justify-content: space-around;
            align-items: center;
            width: 218px;
            height: 100px;
            img {
                width: 97px;
                height: 102px;
            }
        }
        .game-intro {
            flex-direction: column;
            width: 107px;
            height: 100px;
            img {
                width: 40px;
                height: 50px;
            }
        }
        .energy-bank {
            flex-direction: column;
            margin-top: 10px;
            width: 107px;
            height: 100px;
            padding: 7px;
            box-sizing: border-box;
            .bank {
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                width: 100%;
                height: 50px;
                font-size: 16px;
                .energy-count {
                    width: 100%;
                    img {
                        width: 20px;
                        height: 20px;
                    }
                }
                .time {
                    position: relative;
                    width: 100%;
                    height: 16px;
                    border-radius: 10px;
                    background-color: #3c3c60;
                    text-align: center;
                    .inner {
                        width: 50%;
                        height: 100%;
                        z-index: 4;
                        border-radius: 10px;
                        position: absolute;
                        top: 0;
                        left: 0;
                        background-color: #6ee4ab;
                    }
                    .interval {
                        font-size: 12px;
                        width: 100%;
                        height: 100%;
                        text-align: center;
                        position: absolute;
                        z-index: 5;
                    }
                }
            }
        }
        .rank {
            justify-content: space-around;
            align-items: center;
            margin-top: 10px;
            width: 218px;
            height: 100px;
            img {
                width: 148rpx;
                height: 118rpx;
            }
        }
        .friend-fight {
            justify-content: space-around;
            align-items: center;
            width: 218px;
            height: 100px;
            margin-top: 10px;
            img {
                width: 110px;
                height: 64px;
            }
        }
        .personal-center {
            flex-direction: column;
            width: 107px;
            height: 100px;
            margin-top: 10px;
            img {
                width: 50px;
                height: 50px;
            }
        }
    }
    .bottom-bg {
        z-index: 1;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 210px;
    }
}
</style>

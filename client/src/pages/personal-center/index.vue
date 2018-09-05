
<template>
    <div class = "personal-center">
        <div class = "card">
            <div class ="info">
                <div class = "base">
                    <img :src = "userInfo.avatarUrl"/>
                    <span>{{userInfo.nickName}}</span>
                </div>
                <a class = "err-words" href = "/pages/err-words/main">查看错词 ></a>
            </div>
            <div class = "data">
                <div class = "item">
                    <div class = "title">过招单词</div>
                    <div class = "num">{{personalData.allWords}}</div>
                </div>
                <div class = "item">
                    <div class = "title">拼错次数</div>
                    <div class = "num">{{personalData.errWords}}</div>
                </div>
                <div class = "item">
                    <div class = "title">歌曲挑战</div>
                    <div class = "num">{{personalData.playSongTimes}}</div>
                </div>
                <div class = "item">
                    <div class = "title">每日挑战</div>
                    <div class = "num">{{personalData.dailyChallengeTimes}}</div>
                </div>
            
            </div>

        </div>
        <div class = "navs">
            <div class = "nav" @click = "giveMeMoney">
                <img src = "/static/img/heart.png"/>
                <div>给作者一个么么哒</div>
                <img src ="/static/img/arrow-right.png"/>
            </div>
            <button class = "nav" open-type="contact" :session-from="feedUser">
                <img src = "/static/img/phone.png"/>
                <div>联系作者</div>
                <img src ="/static/img/arrow-right.png"/>
            </button>
            <button class = "nav" open-type="feedback">
                <img src = "/static/img/email.png"/>
                <div>建议 & bug反馈</div>
                <img src ="/static/img/arrow-right.png"/>
            </button>
            <button class = "nav" open-type="share">
                <img src = "/static/img/person-share.png"/>
                <div>分享拼词乐斗</div>
                <img src ="/static/img/arrow-right.png"/>
            </button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            userInfo: {},
            personalData: {},
            feedUser: {},
        };
    },
    mounted() {
        this.userInfo = wx.getStorageSync('userInfo');

        const info = { nickName: this.userInfo.nickName, avatarUrl: this.userInfo.avatarUrl };
        this.feedUser = JSON.stringify(info);
        this.personalData = wx.getStorageSync('personalData');
    },
    methods: {
        giveMeMoney() {
            wx.previewImage({
                current: 'https://img-1256531505.cos.ap-chengdu.myqcloud.com/money.png', // 当前显示图片的http链接
                urls: ['https://img-1256531505.cos.ap-chengdu.myqcloud.com/money.png'], // 需要预览的图片http链接列表
            });
        },
    },
    onShareAppMessage() {
        return {
            title: `${this.userInfo.nickName}@你，音乐+英语+游戏，了解一下？`,
            path: '/pages/login/main',
        };
    },
};
</script>

<style lang="less" scoped>
.personal-center {
    width: 100vw;
    height: 100vh;
    background: #f5f5f5;
    padding-top: 20px;
    .card {
        width: 90%;
        height: 120px;
        margin: 0 auto 0;
        border-radius: 12px;
        box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
        .info {
            width: 100%;
            display: flex;
            height: 60%;
            justify-content: space-between;
            align-items: center;
            padding-left: 10px;
            box-sizing: border-box;
            .base {
                display: flex;
                align-items: center;
                img {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    display: block;
                }
                span {
                    color: #666666;
                    font-size: 16px;
                    margin-left: 10rpx;
                }
            }
            .err-words {
                width: 75px;
                height: 20px;
                text-align: center;
                line-height: 20px;
                border-top-left-radius: 15px;
                border-bottom-left-radius: 15px;
                background-color: orangered;
                color: #fff;
                font-size: 14px;
            }
        }
        .data {
            width: 100%;
            height: 40%;
            display: flex;
            border-top: 1px solid #dddddd;
            .item {
                flex-grow: 1;
                height: 100%;
                border-right: 1px solid #dddddd;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-around;
                .title {
                    font-size: 12px;
                    color: #999999;
                }
                .num {
                    font-size: 14px;
                    color: #333333;
                    font-weight: 600;
                }
                &:last-child {
                    border: none;
                }
            }
        }
    }
    .navs {
        width: 100%;
        height: 500px;
        padding: 30px;
        box-sizing: border-box;
        .nav {
            border-bottom: 1px solid #dddddd;
            height: 50px;
            margin-bottom: 10px;
            width: 100%;
            display: flex;
            justify-content: space-around;
            color: #666666;
            font-size: 14px;
            align-items: center;
            div {
                width: 80%;
            }
            img {
                width: 25px;
                height: 25px;
            }
        }
        button {
            margin: 0;
            margin-bottom: 10px;
            background-color: transparent;
            border-radius: 0;
            padding: 0;
            text-align: left;
        }
    }
}
</style>

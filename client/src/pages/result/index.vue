<template>
    <div class = "container result">
        <!-- <div class = "pass">{{query.result==='1'?'完成':'失败'}}</div>
        <div class ="score">
            <div class = "num">{{score}}<span>分</span></div>
            <div class = "new-record" v-if = "isNewRecord">新纪录</div>
        </div> -->
        <div class = "score">
            <img class = "bg" src = "/static/img/result-bg.png"/>
            <div class= "title">{{query.result==='1'?'Excellent':'Never Mind'}}</div>
            <div class = "point">{{score}}</div>
            <div class = "star">
                <img src = "/static/img/star.png"/>
                <img v-if = "score>3000" src = "/static/img/star.png"/>
                <img v-if = "score>5000" src = "/static/img/star.png"/>
            </div>
        </div>       
        <!-- <div class = "datas">
            <div class = "item mistake"><span>失误次数：</span>{{query.wrongTimes}}</div>
            <div class = "item complete"><span>完成单词数：</span>{{query.rightWordsNum}}</div>
            <div class = "item used-time"><span>使用时间：</span>{{query.usedTime/1000}}s</div>   
            <div class = "item err-word" v-if = "query.result"><span>错词：</span>{{query.stopWord}}</div>
        </div> -->
        <div class = "btns">
            <button class = "share-btn" open-type = "share">炫耀一下</button>
            <a class = "restart-btn" @click = "restart">再来一局</a>
        </div>
        <img src = "/static/img/bottom-bg.png" class = "bottom-bg"/>
    </div>
</template>
<script>
import { request, formatDate } from '@/utils';
import { service } from '@config';
import { mapState, mapMutations } from 'vuex';
import store from '@/store';

export default {
    store,
    data() {
        return {
            query: {},
            score: 0,
            isNewRecord: false,
        };
    },
    computed: {
        ...mapState(['songs']),
    },
    methods: {
        ...mapMutations(['unlockSong']),
        restart() {
            wx.navigateBack();
        },
        changePersonalData() {
            const { songId } = this.query;
            const wrongTimes = +this.query.wrongTimes;
            const rightWordsNum = +this.query.rightWordsNum;
            let personalData = wx.getStorageSync('personalData');
            if (songId >= 0) {
                if (!personalData) {
                    personalData = {
                        allWords: wrongTimes + rightWordsNum,
                        errWords: wrongTimes,
                        playSongTimes: 1,
                        dailyChallengeTimes: 0,
                    };
                } else {
                    personalData.allWords += rightWordsNum + wrongTimes;
                    personalData.errWords += wrongTimes;
                    personalData.playSongTimes += 1;
                }
            } else if (songId === 'undefined') {
                if (!personalData) {
                    personalData = {
                        allWords: wrongTimes + rightWordsNum,
                        errWords: wrongTimes,
                        playSongTimes: 0,
                        dailyChallengeTimes: 1,
                    };
                } else {
                    personalData.allWords += rightWordsNum + wrongTimes;
                    personalData.errWords += wrongTimes;
                    personalData.dailyChallengeTimes += 1;
                }
            }
            wx.setStorage({
                key: 'personalData',
                data: personalData,
            });
        },
        changeNumber(ref, num) {
            let count = 0;
            let trueValue = +this[ref];
            const temp = this[ref];
            const sumCount = 10;
            const timer = setInterval(() => {
                count += 1;
                trueValue += (num - temp) / sumCount;
                this[ref] = trueValue.toFixed(0);
                if (count === sumCount) {
                    clearInterval(timer);
                }
            }, 50);
            return timer;
        },
    },
    mounted() {
        this.query = this.$root.$mp.query;
        console.log(this.query);
        const { wrongTimes, rightWordsNum, usedTime, result, songId, stopWord } = this.query;
        // change personal data
        this.changePersonalData();
        // store errwords
        let errWords = wx.getStorageSync('errWords');
        if (!errWords) {
            errWords = [];
        }
        if (stopWord) {
            errWords.unshift({ en: stopWord.split('-')[0], zh: stopWord.split('-')[1] });
        }

        wx.setStorage({
            key: 'errWords',
            data: errWords,
        });
        if (result === '1' && songId >= 0) {
            console.log('success lock');
            const unlockSongId = wx.getStorageSync('unlockSongId');
            if (unlockSongId === +songId) {
                // not trial
                this.unlockSong(+songId + 1);
                wx.setStorage({
                    key: 'unlockSongId',
                    data: +songId + 1,
                });
            }
        }
        // eslint-disable-next-line
        let score = Math.round(rightWordsNum * 100 - usedTime / 100 - wrongTimes * 10);
        score = score >= 0 ? score : 0;
        this.changeNumber('score', score);
        let songRecords = wx.getStorageSync('songRecords');
        if (songRecords === '') {
            songRecords = {};
        }

        if (
            songId >= 0 &&
            (songRecords[songId] === undefined || songRecords[songId] < this.score)
        ) {
            songRecords[songId] = this.score;
            this.isNewRecord = true;
            wx.setStorage({
                key: 'songRecords',
                data: songRecords,
            });
            request({
                url: `${service.scoreUrl}`,
                method: 'POST',
                data: { song_id: this.query.songId, score: this.score },
            }).then(res => {
                console.log('success upload', res);
            });
        } else if (songId === 'undefined') {
            let dailyRecord = wx.getStorageSync('dailyRecord');
            if (dailyRecord === '') {
                dailyRecord = {};
            }
            const today = formatDate(new Date(), 'yyyy-MM-dd');
            if (dailyRecord[today] === undefined || dailyRecord[today] < this.score) {
                dailyRecord[today] = this.score;
                this.isNewRecord = true;
                wx.setStorage({
                    key: 'dailyRecord',
                    data: dailyRecord,
                });
                request({
                    url: `${service.scoreUrl}`,
                    method: 'POST',
                    data: { date: today, score: this.score },
                });
            }
        }
    },
    onUnload() {
        Object.assign(this.$data, this.$options.data());
    },
    onShareAppMessage() {
        return {
            title: `我挑战${this.songs[this.query.songId].title},获得了${this.score}分，你行吗？`,
            path: '/pages/login/main',
        };
    },
};
</script>
<style lang="less" scoped>
.result {
    padding: 30px 10px;
    background-image: linear-gradient(to bottom, #9f00ff, #5f5dff);
    color: #fff;
    .pass {
        width: 100%;
        height: 50px;
        text-align: center;
        font-size: 30px;
        line-height: 50px;
    }
    .score {
        width: 100%;
        height: 556rpx;
        position: relative;
        .bg {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
        }
        .title,
        .point,
        .star {
            position: absolute;
            width: 214px;
            text-align: center;
            left: 70px;
            z-index: 2;
        }
        .title {
            top: 0;
            height: 86px;
            font-size: 29px;
            line-height: 86px;
        }
        .point {
            top: 120px;
            height: 70px;
            line-height: 70px;
            font-size: 64px;
            font-family: Arial, Helvetica, sans-serif;
        }
        .star {
            top: 196px;
            height: 60px;
            display: flex;
            justify-content: center;
            align-items: center;

            img {
                width: 110rpx;
                height: 106rpx;
            }
        }
    }
    .btns {
        position: relative;
        z-index: 2;
        width: 100%;
        height: 120px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 50px;
        .share-btn {
            width: 180px;
            height: 50px;
            opacity: 0.85;
            border-radius: 25px;
            color: #fff;
            text-align: center;
            line-height: 50px;
            background-color: #eb60f9;
            box-shadow: 0 3px 9px 0 #5589f7;
        }
        .restart-btn {
            width: 180px;
            height: 50px;
            opacity: 0.85;
            border-radius: 25px;
            background-color: #64d536;
            color: #fff;
            text-align: center;
            line-height: 50px;
            box-shadow: 0 3px 9px 0 #5589f7;
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

<template>
    <div class = "fight">
        <img class = "top-bg" src = "/static/img/top-bg.png"/>
        <swiper v-if ="showIndicator" class = "question-swiper" :autoplay ="autoplay" :interval = "500" :duration="200" @change = "onIndicatorChange">
            <swiper-item v-for ="(item,index) in questionListNew" :key = "index" >
                <div class = "text">{{item.en}}</div>
            </swiper-item>
        </swiper>
        <div v-else class = "pannel">
            <div class = "zh">{{currentWord.zh}}</div>
            <div class = "en">
                {{showWord}}
            </div>    
        </div>
        <div class = "line-wrapper"></div>
        <div class = "inner" :style="{width:timeLineWidth+'%'}"></div>
        <div class = "touch-area">
            <img class = "key-bg" src ="/static/img/key-bg.png"/>
            <div v-if = "!showIndicator" class = "keyboard">
                
                <div v-for = "(item,index) in shuffleWord "  class = "element" :class="{'green':rightColor[index]===1,'red':rightColor[index]===2,'yellow':rightColor[index]===3}" @touchstart = "tapWord(item,index)">{{item}}</div>
            </div>
            <div v-if = "!showIndicator"  class = "tools">
                <div class = "tool pass" :class = "{disable:passTimes===3,indicate:passTimes<3&&showPassIndicate}" @touchstart = "pass">P</div>
                <div class = "tool delete" :class = "{indicate:showDelIndicate}" @touchstart = "backDelete">D</div>
            </div>
        </div>
    </div>
</template>

<script>
import collection from 'lodash/collection';
import songWords from '@/assets/song-word';
import cet4Words from '@/assets/cet4.json';

import { mapState, mapMutations } from 'vuex';
import store from '@/store';

export default {
    store,
    components: {},

    data() {
        return {
            questionList: [],
            questionListNew: [],
            autoplay: true,
            showIndicator: true,
            currentIndex: 0,
            wordIndex: 0,
            rightColor: [],
            showWord: '',
            stopTap: false,
            innerAudioContext: null,
            timeLineWidth: 100,
            startCount: false,
            intervalId: 0,
            wrongTimes: 0,
            passTimes: 0,
            startTime: 0,
            endTime: 0,
            tapTimestamp: 0,
            showDelIndicate: false,
            showPassIndicate: false,
        };
    },
    computed: {
        ...mapState(['songs']),
        shuffleWord() {
            if (this.questionList.length > 0) {
                return collection.shuffle(
                    this.questionList[this.currentIndex].en.toUpperCase().split(''),
                );
            }
            return [];
        },
        currentWord() {
            return this.questionList[this.currentIndex];
        },
    },
    watch: {
        currentIndex(newVal) {
            if (newVal !== this.questionList.length) {
                this.showDelIndicate = false;
                this.rightColor = new Array(this.currentWord.en.length).fill(0);
                const index = this.shuffleWord.findIndex(
                    item => item === this.currentWord.en[this.wordIndex].toUpperCase(),
                );
                if (index !== -1) {
                    this.rightColor[index] = 3;
                }
            }
        },
        timeLineWidth(newVal) {
            if (newVal < 30) {
                this.showPassIndicate = true;
            } else {
                this.showPassIndicate = false;
            }
            if (newVal <= 0) {
                this.innerAudioContext.stop();
                this.startCount = false;
                this.endTime = new Date().getTime();
                /* eslint-disable */
                wx.redirectTo({
                    url: `/pages/result/main?result=0&passTimes=${this.passTimes}&wrongTimes=${
                        this.wrongTimes
                    }&usedTime=${this.endTime - this.startTime}&rightWordsNum=${this.currentIndex -
                        this.passTimes}&stopWord=${this.questionList[this.currentIndex].en}-${
                        this.questionList[this.currentIndex].zh
                    }&songId=${this.$root.$mp.query.id}`,
                });
                /* eslint-disable */
                // wx.showModal({
                //     title: 'game over',
                //     content: `pass:${this.passTimes},wrongTimes:${this.wrongTimes},usedTime:${(this
                //         .endTime -
                //         this.startTime) /
                //         1000}s`,
                //     success() {
                //         wx.navigateBack();
                //     },
                // });
            }
        },
        startCount(newVal, oldVal) {
            if (newVal && !oldVal) {
                this.startTime = new Date().getTime();
            }
        },
    },
    methods: {
        ...mapMutations(['changeSongTempFiles', 'decreaseEnergy']),
        onIndicatorChange(event) {
            console.log(event);
            if (event.mp.detail.current === this.questionListNew.length - 1) {
                this.autoplay = false;
                setTimeout(() => {
                    this.showIndicator = false;
                    this.startCount = true;
                    // this.innerAudioContext.play();
                    const index = this.shuffleWord.findIndex(
                        item => item === this.currentWord.en[this.wordIndex].toUpperCase(),
                    );
                    if (index !== -1) {
                        this.rightColor[index] = 3;
                    }
                }, 500);
            }
        },
        tapWord(item, index) {
            console.log(item, index);
            this.tapTimestamp = new Date().getTime();
            if (this.stopTap || this.rightColor[index] === 1 || this.rightColor[index] === 2)
                return;
            if (item === this.currentWord.en[this.wordIndex].toUpperCase()) {
                this.wordIndex = this.wordIndex + 1;
                this.rightColor[index] = 1;
                this.showWord += item;
            } else {
                this.rightColor[index] = 2;
                this.showWord += item;
                this.stopTap = true;
                this.wrongTimes = this.wrongTimes + 1;
                if (this.timeLineWidth < 10) {
                    this.timeLineWidth = 0;
                } else {
                    this.timeLineWidth = this.timeLineWidth - 10;
                }
                this.showDelIndicate = true;
            }
            if (
                this.showWord.length === this.currentWord.en.length &&
                this.rightColor[index] !== 2
            ) {
                if (this.currentIndex === this.questionList.length - 1) {
                    console.log('end');
                    this.startCount = false;
                    this.endTime = new Date().getTime();
                    wx.redirectTo({
                        url: `/pages/result/main?result=1&passTimes=${this.passTimes}&wrongTimes=${
                            this.wrongTimes
                        }&usedTime=${this.endTime - this.startTime}&rightWordsNum=${this
                            .questionList.length - this.passTimes}&songId=${
                            this.$root.$mp.query.id
                        }`,
                    });
                    // wx.showModal({
                    //     title: 'success',
                    //     content: `pass:${this.passTimes},wrongTimes:${
                    //         this.wrongTimes
                    //     },usedTime:${(this.endTime - this.startTime) / 1000}s`,
                    //     success() {
                    //         wx.navigateBack();
                    //     },
                    // });
                } else {
                    this.currentIndex = this.currentIndex + 1;
                    this.showWord = '';
                    this.wordIndex = 0;
                    this.timeLineWidth = 100;
                }
            }
        },
        pass() {
            if (this.passTimes >= 3) {
                wx.showToast({
                    icon: 'none',
                    title: '只有三次pass机会哦',
                });

                return;
            }
            this.passTimes = this.passTimes + 1;
            if (this.currentIndex === this.questionList.length - 1) {
                this.startCount = false;

                this.endTime = new Date().getTime();
                wx.redirectTo({
                    url: `/pages/result/main?result=1&passTimes=${this.passTimes}&wrongTimes=${
                        this.wrongTimes
                    }&usedTime=${this.endTime - this.startTime}&rightWordsNum=${this.questionList
                        .length - this.passTimes}&songId=${this.$root.$mp.query.id}`,
                });
                return;
            }
            this.currentIndex = this.currentIndex + 1;
            this.showWord = '';
            this.wordIndex = 0;
            this.timeLineWidth = 100;
            this.stopTap = false;
        },
        backDelete() {
            this.showDelIndicate = false;
            const wrongIndex = this.rightColor.findIndex(item => item === 2);
            console.log('wrong index', wrongIndex);
            if (wrongIndex === -1) return;
            this.rightColor[wrongIndex] = 0;
            this.showWord = this.showWord.substring(0, this.showWord.length - 1);
            this.stopTap = false;
        },
        initBgm() {
            this.innerAudioContext = wx.createInnerAudioContext();
            if (this.$root.$mp.query.type === 'dailyfight') {
                this.innerAudioContext.src =
                    'https://songs-1256531505.cos.ap-chengdu.myqcloud.com/daily-song/monody.mp3';
            } else if (this.$root.$mp.query.id >= 0) {
                this.innerAudioContext.src = this.songs[this.$root.$mp.query.id].url;
            }

            // this.innerAudioContext.stop();
            this.innerAudioContext.autoplay = true;
            this.innerAudioContext.onError(res => {
                console.log(res.errMsg);
                console.log(res.errCode);
            });
            // this.innerAudioContext.seek(180);
            this.innerAudioContext.onEnded(res => {
                this.startCount = false;
                this.endTime = new Date().getTime();
                wx.redirectTo({
                    url: `/pages/result/main?result=1&passTimes=${this.passTimes}&wrongTimes=${
                        this.wrongTimes
                    }&usedTime=${this.endTime - this.startTime}&rightWordsNum=${this.currentIndex -
                        this.passTimes}&songId=${this.$root.$mp.query.id}`,
                });
            });
        },
        initCounter() {
            // debugger;
            this.intervalId = setInterval(() => {
                console.log('aaa');
                if (this.startCount) {
                    const now = new Date().getTime();
                    if (
                        now - this.tapTimestamp > 1000 &&
                        this.rightColor.findIndex(item => item === 3) === -1
                    ) {
                        const index = this.shuffleWord.findIndex(
                            (item, index) =>
                                item === this.currentWord.en[this.wordIndex].toUpperCase() &&
                                this.rightColor[index] === 0,
                        );
                        if (index !== -1) {
                            this.rightColor[index] = 3;
                        }
                    }
                    this.timeLineWidth = this.timeLineWidth - 1;
                }
            }, 100);
        },
    },

    created() {
        console.log('created');
    },
    onShow() {
        console.log('onshow');
    },
    onReady() {
        console.log('on ready');
    },
    mounted() {
        console.log('aaa', songWords);
        if (this.$root.$mp.query.id >= 0) {
            const words = songWords[this.$root.$mp.query.id];
            this.questionList = collection.shuffle(words);
            this.questionListNew = this.questionList.filter(item => {
                return item.en.length > this.songs[this.$root.$mp.query.id].filterLength;
            });
        } else {
            const index = new Date().getDate();
            this.questionList = cet4Words.slice((index - 1) * 116, index * 116);
            this.questionListNew = this.questionList.slice(0, 10);
        }

        console.log('mounted');
        this.rightColor = new Array(this.currentWord.en.length).fill(0);
        this.initBgm();
        this.initCounter();
        this.decreaseEnergy();
    },

    onUnload() {
        console.log('unonload');
        this.innerAudioContext.stop();
        clearInterval(this.intervalId);
        Object.assign(this.$data, this.$options.data());
    },
    onHide() {
        console.log('hide');
    },
};
</script>

<style lang = "less" scoped>
@import '../../assets/less/common';
.fight {
    width: 100vw;
    height: 100vh;
    background-image: linear-gradient(to bottom, #9f00ff, #5f5dff);
    background-size: 100% 100%;
    /* padding-top: 50px; */
    position: relative;
    .top-bg {
        position: absolute;
        top: 0;
        left: 20px;
        width: 660rpx;
        height: 436rpx;
    }
    .question-swiper {
        position: absolute;
        width: 220px;
        height: 150px;
        top: 50px;
        left: 50%;
        transform: translateX(-50%);

        .text {
            color: #6af5fb;
            width: 100%;
            height: 100%;
            font-size: 30px;
            text-align: center;
            line-height: 150px;
            background-color: rgba(255, 255, 255, 0.2);
        }
    }
    .pannel {
        width: 220px;
        height: 150px;
        position: absolute;
        top: 50px;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 16px;
        background-color: rgba(255, 255, 255, 0.2);
        box-shadow: 0 2px 6px 0 rgba(22, 23, 76, 0.57), inset 0 0 2px 2px rgba(255, 255, 255, 0.3),
            inset 0 0 0 0 rgba(255, 255, 255, 0);
        box-shadow: 0, 0, 10px, 10px, rgb(0, 92, 38);
        color: #6af5fb;
        font-size: 30px;
        text-align: center;
        box-sizing: border-box;
        .zh {
            box-sizing: border-box;
            padding-top: 20px;
            width: 100%;
            height: 50%;
            font-size: 20px;
            font-weight: 700;
        }
        .en {
            width: 100%;
            height: 50%;
        }
    }
    .line-wrapper {
        position: absolute;
        top: 40%;
        left: 0;
        width: 100%;
        height: 5px;
        border-radius: 5px;
        background: #fff;
    }
    .inner {
        position: absolute;
        top: 40%;
        left: 0;
        width: 100%;
        height: 5px;
        border-radius: 10px;
        background: rgb(0, 248, 255);
        box-shadow: 0 0 2px 2px rgba(0, 248, 255, 0.5);
    }

    .touch-area {
        position: absolute;
        top: 40%;
        height: 60vh;
        width: 100%;
        .key-bg {
            position: absolute;
            width: 100%;
            height: 528rpx;
            top: 50px;
            left: 0;
        }
        .keyboard {
            width: 300px;
            height: 200px;
            margin: 50px auto 20px;
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
            align-content: space-around;
            .element {
                position: relative;
                width: 50px;
                height: 50px;
                background: #d6f7e7;
                color: #9966ff;
                border-radius: 14px;
                font-size: 30px;
                text-align: center;
                line-height: 47px;
                margin: 10px;
                z-index: 2;
                box-shadow: 4px 6px 10px 2px rgb(101, 0, 245);
                &::after {
                    content: '';
                    position: absolute;
                    width: 50px;
                    height: 50px;
                    border-radius: 14px;
                    top: -3px;
                    left: -2px;
                    z-index: -1;
                    background: inherit;
                    box-shadow: 0 1px 5px 0 rgb(101, 0, 245);
                }
                &.green {
                    color: #fff;
                    background: #56b92e;
                }
                &.red {
                    color: #fff;
                    background: #f689ff;
                }
                &.yellow {
                    color: #fff;
                    background: @yellow;
                }
            }
        }
        .tools {
            position: absolute;
            bottom: 0;
            padding: 20px 30px;
            box-sizing: border-box;
            width: 100%;
            height: 110px;
            background-size: 100% 100%;
            margin: 10px auto 0;
            display: flex;
            justify-content: space-between;
            background-image: url(https://media-image1.baydn.com/storage_media_image/ccdbwr/1b97af7c2e05ca52f410d309412f4cf3.4576b48acbdaaeaae3267fd32986180b.png);
            .pass {
                position: relative;
                background: rgb(0, 248, 255);
                box-shadow: 0 0 5px 2px rgb(0, 248, 255);
                &.disable {
                    opacity: 0.3;
                }
                &:after {
                    content: '';
                    position: absolute;
                    width: 80%;
                    height: 80%;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    border: 8px solid rgba(255, 255, 255, 0.7);
                    box-sizing: border-box;
                    border-radius: 50%;
                }
            }
            .delete {
                position: relative;
                background-color: @yellow;
                box-shadow: 0 0 5px 2px @yellow;
                &:after {
                    content: '';
                    position: absolute;
                    width: 80%;
                    height: 80%;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    border: 8px solid rgba(255, 255, 255, 0.7);
                    box-sizing: border-box;
                    border-radius: 50%;
                }
            }
            .tool {
                width: 70px;
                height: 70px;
                border-radius: 50%;
                font-size: 25px;
                color: #fff;
                line-height: 70px;
                text-align: center;
                font-weight: 800;
                &.indicate {
                    animation: blink 1s ease-in infinite;
                }
            }
        }
    }
}
@keyframes blink {
    0% {
        transform: scale(1, 1);
    }
    50% {
        transform: scale(1.1, 1.1);
    }
    100% {
        transform: scale(1, 1);
    }
}
</style>

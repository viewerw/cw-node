<template>
    <div class = " container rank">
        
        <picker class="text" @change="pickChange" :value="pickerIndex" :range="songNames">
            <div class = "song-name">
                <div class = "text">
                    {{songNames[pickerIndex]}}
                </div>
                <div class = "switch-btn" >切换</div>
             </div>
        </picker>
           
        
        <scroll-view class="rank-list" scroll-y >
            <div class="parts">
                <div class="part" v-for ="(item,index) in ranks" >
                    <div class="left">
                        <img src="/static/img/crown-gold.png" class="crown" v-if="index===0">
                        <img src="/static/img/crown-silver.png" class="crown" v-else-if="index===1"/>
                        <img src="/static/img/crown-copper.png" class="crown" v-else-if="index===2"/>
                        <text class="rank" v-else>{{index+1}}</text>
                        <img :src="item.user_info.avatarUrl" class="avatar"/>
                        <div class="name-title">
                            <text class="name">{{item.user_info.nickName}}</text>
                        </div>
                    </div>
                    <div class="right">
                        <!-- <img class = "coin" src = "/static/img/coin.png"/> -->
                        
                        <text class = "score" style="color:#91ecc0">{{item.score}}</text>
                    </div>
                </div>
            </div>
        </scroll-view>
        

    </div>
</template>
<script>
import { request, formatDate } from '@/utils';
import { service } from '@config';
import { mapState } from 'vuex';
import store from '@/store';

export default {
    store,
    data() {
        return {
            ranks: [],
            songId: 0,
            isShowPicker: false,
            pickerIndex: 0,
            today: '',
        };
    },
    computed: {
        ...mapState(['songs']),
        songNames() {
            return ['每日挑战'].concat(this.songs.map(item => item.title));
        },
    },
    methods: {
        showPicker() {
            this.isShowPicker = true;
        },
        pickChange(e) {
            console.log(e.mp.detail);
            this.pickerIndex = e.mp.detail.value;
        },
    },
    watch: {
        pickerIndex(val) {
            const data = {};
            if (val === '0') {
                data.date = this.today;
            } else {
                data.song_id = val - 1;
            }
            request({
                url: `${service.songRankUrl}`,
                // method: 'GET',
                data,
            }).then(res => {
                console.log('success get', res);
                this.ranks = res.data.data;
            });
        },
    },
    mounted() {
        this.today = formatDate(new Date(), 'yyyy-MM-dd');
        request({
            url: `${service.songRankUrl}`,
            // method: 'GET',
            data: { date: this.today },
            showLoading: true,
        }).then(res => {
            console.log('success get', res);
            this.ranks = res.data.data;
        });
    },
    onUnload() {
        console.log('unonload');
        Object.assign(this.$data, this.$options.data());
    },
};
</script>
<style lang="less" scoped>
.rank {
    display: block;
    .song-name {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50px;
        .text {
            font-size: 18px;
            color: #fff;
        }
        .switch-btn {
            width: 40px;
            height: 20px;
            margin-left: 5px;
            border-radius: 12px;
            border: solid 0.8px #91ecc0;
            font-size: 12px;
            text-align: center;
            color: #91ecc0;
            line-height: 22px;
        }
    }
    .rank-list {
        position: relative;
        top: -1px;
        width: 335px;
        box-sizing: border-box;
        height: 80vh;
        margin: 0 auto;

        .parts {
            .part {
                display: flex;
                justify-content: space-between;
                height: 96px;
                padding-left: 16px;
                padding-right: 16px;
                color: #333;
                background: #fff;
                .border() {
                    border-top: solid 0.5px #e0e0e0;
                }
                .border();
                &:first-child {
                    border: none;
                    border-top-left-radius: 24rpx;
                    border-top-right-radius: 24rpx;
                }
                &:last-child {
                    border-bottom-left-radius: 12px;
                    border-bottom-right-radius: 12px;
                }
                .left,
                .right {
                    display: flex;
                    align-items: center;
                }
                .left {
                    .crown,
                    .rank {
                        @x: 1.5;
                        width: 15px * @x;
                        height: 12px * @x;
                    }
                    .rank {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        font-size: 18px;
                        font-weight: 500;
                    }
                    .avatar {
                        width: 50px;
                        height: 50px;
                        margin-left: 12px;
                        margin-right: 12px;
                        border-radius: 50%;
                    }
                    .name-title {
                        display: flex;
                        flex-direction: column;
                        align-items: flex-start;
                        .name {
                            font-size: 15px;
                            font-weight: 600;
                            max-width: 100px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                    }
                }
                .right {
                    display: flex;
                    justify-content: flex-start;
                    width: 150rpx;
                    .coin {
                        width: 54rpx;
                        height: 52rpx;
                        margin-right: 10rpx;
                    }
                }
            }
        }
    }
    .picker {
        height: 250px;
        width: 100%;
        position: fixed;
        bottom: 0;
        left: 0;
    }
}
</style>



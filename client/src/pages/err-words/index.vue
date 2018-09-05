<template>
    <div class = "err-words">
        <div v-for = "(item,index) in errWords" :key = "index" class = "word">
            <div class = "en">{{item.en}}</div>
            <div class = "zh">{{item.zh}}</div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            errWords: [],
        };
    },
    mounted() {
        this.errWords = wx.getStorageSync('errWords');
    },
};
</script>
<style lang="less" scoped>
.err-words {
    width: 100vw;
    height: 100vh;
    .word {
        width: 100%;
        height: 50px;
        padding: 0 20px;
        border-bottom: 1px solid #dddddd;
        .en {
            font-size: 20px;
            font-weight: bold;
            line-height: 1.2;
            text-align: left;
            color: #333333;
        }
        .zh {
            font-size: 14px;
            line-height: 1.57;
            text-align: left;
            color: #333333;
        }
    }
}
</style>


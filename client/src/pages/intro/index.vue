<template>
    <div class = "container intro">
        <div class = "game-rule">

            <div class = "content">
                <p>
                1.歌曲挑战模式下，当前歌曲成功完成后，下一首歌才会解锁，每局比赛将消耗一点体力，体力不足时，可以分享到群或是从体力银行中收取体力。
                </p>
                <p>
                2.每日挑战的单词来自四级词库，按照字母顺序依次出现，获得较高的分数有机会上榜哦。
                </p>
                <p>
                3.一局比赛中，会有歌曲中的单词随机出现，单词的字母顺序被打乱，你需要在十秒内将其拼成一个完整的单词，游戏才可以继续。
                </p>
                <p>
                4.当你在拼词的过程中，选择了错误的字母，该字母会变红，你必须按‘D'后退一个字母，才可以继续，同时，该单词的拼词时间会减少1s。
                </p>
                <p>
                5.如果遇到了较长的单词，或者不熟悉的单词，你可以点击’P‘,将会直接跳过这个单词，但你每局游戏只有三次使用pass的机会。
                </p>
                <p>
                6.每局比赛中，答对的单词数越多，使用的时间越少，选错的字母越少，得分越高。
                </p>
                <p>
                7.点击上锁的歌曲，分享到群，可以提前体验这首歌哦。
                </p>
                <p>
                8.由于游戏过程中需要加载音乐，建议使用WiFi，保证网络下载速率，获得较好的游戏体验。
                </p>
            </div>
        </div>
    </div>
</template>

<script>
export default {};
</script>

<style lang = "less" scoped>
@import '../../assets/less/common';
.intro {
    width: 100vw;
    height: 100vh;
    background-image: linear-gradient(to bottom, @theme, #5f5dff);
    padding: 10px 20px;
    justify-content: flex-start;
    .game-rule {
        width: 100%;
        height: 100%;
        .title {
            width: 100%;
            height: 25px;
            text-align: center;
            font-size: 18px;
            font-weight: 500;
            line-height: 25px;
            color: #fff;
        }
        .content {
            width: 100%;
            line-height: 20px;
            font-size: 14px;
            color: #f5f5f5;

            white-space: pre-line;
            p {
                margin: 5px 0;
            }
        }
    }
}
</style>

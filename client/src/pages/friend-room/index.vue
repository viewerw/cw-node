<template>
    <div class = "friend-room">
        <div class = "top">
            <button class = "share-btn" open-type="share">+邀请好友</button>
        </div>
        <div class = "bottom">
            <div class = "seats">
                <div class = "seat" v-for = "(player,index) in playerList" >
                    <img src = "player"/>
                    <span v-if="index===0">房主</span>
                    <div class = "nickname">vidjkkl</div>
                </div>
            </div>
            <picker class="song-picker" @change="pickChange" :value="pickerIndex" :range="songNames">
                <div class = "song-name">
                    <div class = "text">
                        选择歌曲：{{songNames[pickerIndex]}}
                    </div>
                    <div class = "switch-btn" >></div>
                </div>
            </picker>
            <button v-if ="playerList.length>1" class = "start-game" @click= "startGame" >开始游戏</button>
        </div>
    </div>
</template>
<script>
import { tunnel } from '@/utils';
import { mapState } from 'vuex';
import store from '@/store';

export default {
    store,
    data() {
        return {
            roomId: '',
            playerList: [{ avatar: 'test', nickname: 'wwy' }, { avatar: 'test', nickname: 'wwy1' }],
        };
    },
    computed: {
        ...mapState(['songs']),
        songNames() {
            return this.songs.map(item => item.title);
        },
    },
    methods: {
        showJoinedFriend(list) {
            console.log(list);
        },
        connect() {
            console.log('conenected');
            if (this.isCompetitor) {
                console.log('emit competitor_join_room');
                this.tnl.emit('competitor_join_room', { roomId: this.roomId });
            } else if (this.isHost) {
                this.roomId = this.tnl.socketUrl
                    .split('?')[1]
                    .split('&')[0]
                    .split('=')[1];
                console.log('emit createroom', this.roomId);

                this.tnl.emit('create_room', { roomId: this.roomId });
            }
        },
        reconnect() {
            console.log('reconenected');
            if (this.isCompetitor) {
                console.log('emit competitor_join_room');
                this.tnl.emit('competitor_join_room', { roomId: this.roomId });
            } else if (this.isHost) {
                this.roomId = this.tnl.socketUrl
                    .split('?')[1]
                    .split('&')[0]
                    .split('=')[1];
                console.log('emit createroom', this.roomId);

                this.tnl.emit('create_room', { roomId: this.roomId });
            }
        },
        close() {
            console.log('close');
        },
        roomClosed() {
            wx.showToast({
                icon: 'none',
                title: '房主已离开',
            });
        },
        roomCompetitorChange(msg) {
            console.log('roomCompetitorChange', msg);
        },
        roomNotFound() {
            console.log('room not found');
        },
        startGame() {
            this.tnl.emit('start_game');
        },
        onGameStart() {
            wx.navigateTo({
                url: '',
            });
        },
    },
    created() {
        console.log('created');
        this.tnl = tunnel();
        console.log(this.tnl);
        this.tnl.on('connect', this.connect);
        this.tnl.on('reconnect', this.reconnect);
        this.tnl.on('close', this.close);
        this.tnl.on('room_competitor_change', this.roomCompetitorChange);
        this.tnl.on('room_not_found', this.roomNotFound);
        this.tnl.on('player_join_room', this.showJoinedFriend);
        this.tnl.on('room_closed', this.roomClosed);
        this.tnl.on('game_start', this.onGameStart);
    },
    mounted() {
        this.tnl.open();

        if (this.$root.$mp.query.roomId) {
            this.roomId = this.$root.$mp.query.roomId;
            this.isCompetitor = true;
        } else {
            this.isHost = true;
        }

        console.log('status close', this.tnl.isClosed());
        // tnl.emit('speak', { word: 'wwy' });
    },
    onUnload() {
        this.tnl.close();
    },
    onShareAppMessage() {
        const redirect = encodeURIComponent(`/pages/friend-room/main?roomId=${this.roomId}`);
        return {
            title: 'hello room',
            path: `/pages/login/main?redirect=${redirect}`,
        };
    },
};
</script>
<style lang="less" scoped>
</style>

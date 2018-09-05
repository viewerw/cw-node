// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        energy: 5,
        bankTimeStart: 1529311123,
        songs: [
            {
                id: 0,
                image_url: 'http://p1.music.126.net/mO1OUNjZtCEIvAGdr7YXaA==/813638604607979.jpg',
                url:
                    'https://songs-1256531505.cos.ap-chengdu.myqcloud.com/fight-songs/myheartwillgoon.mp3',
                title: 'My heart will go on',
                level: 1,
                filterLength: 6,
                lock: false,
            },
            {
                id: 1,
                image_url: 'http://p1.music.126.net/8dzD62VK8jLDbhEqkmpIAg==/18277181788626198.jpg',
                url: 'https://songs-1256531505.cos.ap-chengdu.myqcloud.com/fight-songs/faded.mp3',

                title: 'Faded',
                level: 1,
                filterLength: 6,
                lock: true,
            },
            {
                id: 2,
                image_url: 'http://p1.music.126.net/5Zs51JS6cQzvQclW5u_J1g==/18832435162240436.jpg',
                url:
                    'https://songs-1256531505.cos.ap-chengdu.myqcloud.com/fight-songs/shapeofyou.mp3',

                title: 'Shape of you',
                level: 2,
                filterLength: 7,
                lock: true,
            },
            {
                id: 3,
                image_url: 'http://p1.music.126.net/rTb28CZeLWxIRuSlJWkPLQ==/18850027346628137.jpg',
                url:
                    'https://songs-1256531505.cos.ap-chengdu.myqcloud.com/fight-songs/allfallsdown.mp3',

                title: 'All falls down',
                level: 2,
                filterLength: 6,
                lock: true,
            },
            {
                id: 4,
                image_url: 'http://p1.music.126.net/t1ufLGbVHVCj76-7UZdFyA==/18635622580993719.jpg',
                url: 'https://songs-1256531505.cos.ap-chengdu.myqcloud.com/fight-songs/stay.mp3',

                title: 'Stay',
                level: 2,
                filterLength: 7,
                lock: true,
            },
            {
                id: 5,
                image_url: 'http://p1.music.126.net/rOyWF-Fb3I5dGYyKiTxWtQ==/17801093253909041.jpg',
                url:
                    'https://songs-1256531505.cos.ap-chengdu.myqcloud.com/fight-songs/theocean.mp3',

                title: 'The ocean',
                level: 2,
                filterLength: 6,
                lock: true,
            },
            {
                id: 6,
                image_url:
                    'http://p1.music.126.net/um3WrsNYjSLrsycBkB7urw==/109951163025213134.jpg',
                url:
                    'https://songs-1256531505.cos.ap-chengdu.myqcloud.com/fight-songs/thespectre.mp3',

                title: 'The spectre',
                level: 2,
                filterLength: 6,
                lock: true,
            },
            {
                id: 7,
                image_url: 'http://p1.music.126.net/-nQ2E-8ZjuwGtMipBTYzBw==/17902248323721194.jpg',
                url: 'https://songs-1256531505.cos.ap-chengdu.myqcloud.com/fight-songs/wolves.mp3',

                title: 'wolves',
                level: 2,
                filterLength: 6,
                lock: true,
            },
            {
                id: 8,
                image_url: 'http://p1.music.126.net/N07DLBEqprGMTZH21VC0vw==/19129303300296000.jpg',
                url:
                    'https://songs-1256531505.cos.ap-chengdu.myqcloud.com/fight-songs/thephoenix.mp3',

                title: 'The Phoenix',
                level: 2,
                filterLength: 7,
                lock: true,
            },
            {
                id: 9,
                image_url: 'http://p1.music.126.net/s4CT1dVikwYFxtxOvrp4GA==/6638851209069793.jpg',
                url:
                    'https://songs-1256531505.cos.ap-chengdu.myqcloud.com/fight-songs/halloffame.mp3',

                title: 'Hall of fame',
                level: 3,
                filterLength: 8,
                lock: true,
            },
        ],
    },
    mutations: {
        unlockSong(state, index) {
            const obj = state;
            obj.songs[index].lock = false;
        },
        initSongs(state, songs) {
            const obj = state;
            obj.songs = songs;
        },
        initSongsLocks(state, unlockSongId) {
            const obj = state;
            // eslint-disable-next-line
            obj.songs.map((song, index) => {
                if (index <= unlockSongId) {
                    // eslint-disable-next-line
                    song.lock = false;
                }
            });
        },
        increaseEnergy(state, payload) {
            const obj = state;
            obj.energy += payload;
        },
        decreaseEnergy(state) {
            const obj = state;
            obj.energy -= 1;
        },
        setBankTimeStart(state, time) {
            const obj = state;
            obj.bankTimeStart = time;
        },
    },
});

export default store;

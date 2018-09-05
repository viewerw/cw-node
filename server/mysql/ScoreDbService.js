const mysql = require('./index');
const debug = require('debug');

/**
 * 存储每日挑战分数
 * @param {object} open_id
 * @param {string} date
 * @param {string} score
 * @return {Promise}
 */
function saveDailyScore(open_id, date, score) {
    // 查重并决定是插入还是更新数据
    return mysql('dailyChallenge')
        .select('score')
        .where({
            open_id,
            date,
        })
        .then(res => {
            debug('db query', res);
            // 如果存在用户则更新
            if (res.length > 0 && res[0].score >= 0) {
                if (res[0].score < score) {
                    return mysql('dailyChallenge')
                        .update({
                            score,
                        })
                        .where({
                            open_id,
                            date,
                        });
                } else {
                    return;
                }
            } else {
                return mysql('dailyChallenge').insert({
                    open_id,
                    date,
                    score,
                });
            }
        })
        .then(() => ({ test: 1 }))
        .catch(e => {
            debug('%s: %O', ERRORS.DBERR.ERR_WHEN_INSERT_TO_DB, e);
            throw new Error(`${ERRORS.DBERR.ERR_WHEN_INSERT_TO_DB}\n${e}`);
        });
}
/**
 * 存储歌曲分数
 * @param {object} open_id
 * @param {string} song_id
 * @param {string} score
 * @return {Promise}
 */
function saveSongScore(open_id, song_id, score) {
    // 查重并决定是插入还是更新数据
    return mysql('songScore')
        .select('score')
        .where({
            open_id,
            song_id,
        })
        .then(res => {
            debug('db query', res);
            // 如果存在用户则更新
            if (res.length > 0 && res[0].score >= 0) {
                if (res[0].score < score) {
                    return mysql('songScore')
                        .update({
                            score,
                        })
                        .where({
                            open_id,
                            song_id,
                        });
                } else {
                    return;
                }
            } else {
                return mysql('songScore').insert({
                    open_id,
                    song_id,
                    score,
                });
            }
        })
        .then(() => ({ test: 1 }))
        .catch(e => {
            debug('%s: %O', ERRORS.DBERR.ERR_WHEN_INSERT_TO_DB, e);
            throw new Error(`${ERRORS.DBERR.ERR_WHEN_INSERT_TO_DB}\n${e}`);
        });
}

function getSongRank(open_id, song_id) {
    return mysql('songScore')
        .join('cSessionInfo', 'cSessionInfo.open_id', '=', 'songScore.open_id')
        .select(
            'songScore.score as score',
            'songScore.song_id as song_id',
            'cSessionInfo.user_info',
        )
        .where({ song_id })
        .orderBy('score', 'desc')
        .limit(20)
        .offset(0)
        .then(res => {
            res.map(item => {
                item.user_info = JSON.parse(item.user_info);
            });
            return res;
        })
        .catch(err => {
            throw new Error(`${err}`);
        });
}
function getDailyRank(open_id, date) {
    return mysql('dailyChallenge')
        .join('cSessionInfo', 'cSessionInfo.open_id', '=', 'dailyChallenge.open_id')
        .select(
            'dailyChallenge.score as score',
            'dailyChallenge.date as date',
            'cSessionInfo.user_info',
        )
        .where({ date })
        .orderBy('score', 'desc')
        .limit(20)
        .offset(0)
        .then(res => {
            res.map(item => {
                item.user_info = JSON.parse(item.user_info);
            });
            return res;
        })
        .catch(err => {
            throw new Error(`${err}`);
        });
}
module.exports = {
    saveSongScore,
    saveDailyScore,
    getSongRank,
    getDailyRank,
};

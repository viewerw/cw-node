const ScoreDbService = require('../mysql/ScoreDbService');
const debug = require('debug')('score');

module.exports = async (ctx, next) => {
    // 通过 Koa 中间件进行登录态校验之后
    // 登录信息会被存储到 ctx.state.$wxInfo
    // 具体查看：
    debug('score request ');
    if (ctx.state.$wxInfo.loginState === 1) {
        // loginState 为 1，登录态校验成功

        const open_id = ctx.state.$wxInfo.userinfo.openId;
        const { song_id, score, date } = ctx.request.body;
        if (date) {
            ctx.state.data = await ScoreDbService.saveDailyScore(open_id, date, score);
        } else {
            ctx.state.data = await ScoreDbService.saveSongScore(open_id, song_id, score);
        }
    } else {
        ctx.state.code = -1;
    }
};

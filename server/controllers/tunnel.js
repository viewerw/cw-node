const { tunnel } = require('../qcloud');
const debug = require('debug')('koa-weapp-demo');

/**
 * 这里实现一个简单的聊天室
 * userMap 为 tunnelId 和 用户信息的映射
 * 实际使用请使用数据库存储
 */
const userMap = {};
// 房间列表
const roomMap = {};

// 保存 当前已连接的 WebSocket 信道ID列表
// const connectedTunnelIds = [];

/**
 * 调用 tunnel.broadcast() 进行广播
 * @param  {String} type    消息类型
 * @param  {String} content 消息内容
 */
const $broadcast = (roomId, type, content) => {
    let tunnelIds = [];
    if (Array.isArray(roomId)) {
        tunnelIds = roomId;
    } else {
        tunnelIds = roomMap[roomId];
    }

    tunnel.broadcast(tunnelIds, type, content).then(result => {
        const invalidTunnelIds = (result.data && result.data.invalidTunnelIds) || [];

        if (invalidTunnelIds.length) {
            console.log('检测到无效的信道 IDs =>', invalidTunnelIds);

            // invalidTunnelIds.forEach(tunnelId => {
            //     // roomMap[roomId].forEach(item=>{
            //     //     if(item.tunnelId===tunnelId){

            //     //     }
            //     // })
            // });
        }
    });
};

/**
 * 调用 TunnelService.closeTunnel() 关闭信道
 * @param  {String} tunnelId 信道ID
 */
const $close = tunnelId => {
    console.log('close');
    tunnel.closeTunnel(tunnelId);
};

/**
 * 实现 onConnect 方法
 * 在客户端成功连接 WebSocket 信道服务之后会调用该方法，
 * 此时通知所有其它在线的用户当前总人数以及刚加入的用户是谁
 */
function onConnect(tunnelId) {
    console.log(`[onConnect] =>`, { tunnelId });

    if (tunnelId in userMap) {
        // connectedTunnelIds.push(tunnelId);
        // $broadcast('people', {
        //     total: connectedTunnelIds.length,
        //     enter: userMap[tunnelId],
        // });
    } else {
        console.log(`Unknown tunnelId(${tunnelId}) was connectd, close it`);
        $close(tunnelId);
    }
}

/**
 * 实现 onMessage 方法
 * 客户端推送消息到 WebSocket 信道服务器上后，会调用该方法，此时可以处理信道的消息。
 * 在本示例，我们处理 `speak` 类型的消息，该消息表示有用户发言。
 * 我们把这个发言的信息广播到所有在线的 WebSocket 信道上
 */
function onMessage(tunnelId, type, content) {
    console.log(`[onMessage] =>`, { tunnelId, type, content });

    switch (type) {
        // case 'speak':
        //     if (tunnelId in userMap) {
        //         $broadcast('speak', {
        //             who: userMap[tunnelId],
        //             word: content.word,
        //         });
        //     } else {
        //         $close(tunnelId);
        //     }
        //     break;
        case 'create_room':
            roomMap[content.roomId] = [tunnelId];
            break;
        case 'competitor_join_room':
            competitorJoinRoom(tunnelId, content);
            break;
        default:
            break;
    }
}

/**
 * 实现 onClose 方法
 * 客户端关闭 WebSocket 信道或者被信道服务器判断为已断开后，
 * 会调用该方法，此时可以进行清理及通知操作
 */
function onClose(tunnelId) {
    console.log(`[onClose] =>`, { tunnelId });

    if (!(tunnelId in userMap)) {
        console.log(`[onClose][Invalid TunnelId]=>`, tunnelId);
        $close(tunnelId);
        return;
    }

    const leaveUser = userMap[tunnelId];
    delete userMap[tunnelId];
    delete roomMap[tunnelId];

    // const index = connectedTunnelIds.indexOf(tunnelId);
    // if (~index) {
    //     connectedTunnelIds.splice(index, 1);
    // }

    // // 聊天室没有人了（即无信道ID）不再需要广播消息
    // if (connectedTunnelIds.length > 0) {
    //     $broadcast('people', {
    //         total: connectedTunnelIds.length,
    //         leave: leaveUser,
    //     });
    // }
}

function competitorJoinRoom(tunnelId, content) {
    if (roomMap[content.roomId] && roomMap[content.roomId] > 0) {
        roomMap[content.roomId].push(tunnelId);
        const competitors = roomMap[content.roomId].map(item => userMap[item]);
        $broadcast(content.roomId, 'room_competitor_change', {
            competitors,
        });
    } else {
        $broadcast([tunnelId], 'room_not_found', {});
    }
}
module.exports = {
    // 小程序请求 websocket 地址
    get: async ctx => {
        const { roomId } = ctx.query;
        const data = await tunnel.getTunnelUrl(ctx.req);
        const tunnelInfo = data.tunnel;
        console.log('connect get');
        userMap[tunnelInfo.tunnelId] = data.userinfo;

        ctx.state.data = tunnelInfo;
    },

    // 信道将信息传输过来的时候
    post: async ctx => {
        const packet = await tunnel.onTunnelMessage(ctx.request.body);

        debug('Tunnel recive a package: %o', packet);

        switch (packet.type) {
            case 'connect':
                onConnect(packet.tunnelId);
                break;
            case 'message':
                onMessage(
                    packet.tunnelId,
                    packet.content.messageType,
                    packet.content.messageContent,
                );
                break;
            case 'close':
                onClose(packet.tunnelId);
                break;
        }
    },
};

import _ from 'lodash/array';
import qcloud from 'wafer2-client-sdk';
import { service } from '@config';
/* eslint-disable */
export const formatDate = (date, fmt) => {
    var o = {
        'M+': date.getMonth() + 1, //月份
        'd+': date.getDate(), //日
        'h+': date.getHours(), //小时
        'm+': date.getMinutes(), //分
        's+': date.getSeconds(), //秒
        'q+': Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds(), //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp('(' + k + ')').test(fmt))
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length),
            );
    return fmt;
};
/* eslint-disable */
export const toJson = str => {
    // eslint-disable-next-line
    str = str.replace(/↵\[.{8}\]/g, ' ');
    // eslint-disable-next-line
    // str = str.replace(/↵/g, '');
    console.log('str', str);
    const arr = _.uniq(str.split(' ')).map(item => {
        if (item.split("'").length === 1 && item.length > 2) {
            return { en: item.toLowerCase(), zh: '' };
        }
        return null;
    });
    return arr;
};

export const promisify = func => config =>
    new Promise((resolve, reject) => {
        const wxConfig = config || {};
        wxConfig.success = (...args) => {
            resolve(...args);
        };
        wxConfig.fail = (...args) => {
            reject(...args);
        };

        func(wxConfig);
    });

export const tunnel = () => new qcloud.Tunnel(service.tunnelUrl);
export const qLogin = promisify(qcloud.login);
export const wxLogin = promisify(wx.login);
export const qrLogin = promisify(qcloud.requestLogin);
export const showModal = promisify(wx.showModal);
export const request = config => {
    if (config.showLoading) {
        wx.showLoading({ title: '加载中' });
    }

    return promisify(qcloud.request)(config)
        .then(res => {
            if (config.showLoading) {
                wx.hideLoading();
            }
            return res;
        })
        .catch(err => {
            if (config.showLoading) {
                wx.hideLoading();
            }
            throw err;
        });
};

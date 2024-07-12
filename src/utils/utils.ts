import { v4 as uuidv4 } from 'uuid';
/**
 * sessionstorage变量存储
 */
export const sessions = {
    get(key: string) {
        const data = sessionStorage[key];
        if (!data || data === 'null') {
            return null;
        }
        return JSON.parse(data).value;
    },
    set<T>(key: string, value: T) {
        const data = {
            value
        };
        sessionStorage[key] = JSON.stringify(data);
    },
    // 删除
    remove(key: string) {
        sessionStorage.removeItem(key);
    },
    // 清除全部
    clear() {
        sessionStorage.clear();
    }
};

export const getQueryString = (key: string, needDecode = true) => {
    const reg = /([^&=]+)=([\w\W]*?)(&|$|#)/g;
    const { search, hash } = new URL(window.location.href);
    const args = [search, hash];
    let obj: any = {};
    for (let i = 0; i < args.length; i++) {
        const str = args[i];
        if (str) {
            const s = str.replace(/#|\//g, '');
            const arr = s.split('?');
            if (arr.length > 1) {
                for (let i = 1; i < arr.length; i++) {
                    let res;
                    while ((res = reg.exec(arr[i]))) {
                        obj[res[1]] = needDecode ? decodeURIComponent(res[2]) : res[2];
                    }
                }
            }
        }
    }
    return obj[key] || null;
};

/**
 * 数据替换 *** 号
 * @val 要替换的数据
 * @head 头部保留，默认3
 * @last 尾部保留，默认4
 */
export const replaceStar = (val: any, head = 3, last = 4) => {
    if (!val) {
        // 字符串为空直接返回
        return val;
    }
    if (val.length <= 10) {
        // 少于十位的字符串只显示前三位
        last = 0;
    }
    let str = '*';
    const len = val.length - head - last;
    str = str.repeat(len); // * 重复len次
    const re = new RegExp('(.{' + head + '}).*(.{' + last + '})', ''); // 动态的正则验证
    return val.replace(re, '$1' + str + '$2'); // 替换
};

/**
 * 数字三位加逗号
 * @value 数据
 */
export const numberFormat = (value: [number, string]) => {
    if (value !== undefined && value !== null) {
        const str = value.toString();
        const reg = str.indexOf('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;
        return str.replace(reg, '$1,');
    } else {
        return '';
    }
};

/**
 * 判断是否为对象
 */
export const isObject = function (params: any) {
    return Object.prototype.toString.call(params) === '[object Object]';
};

/**
 * 判断是否时数字类型
 * @param {Number} num  处理数值
 * @param {Object} config   配置
 *  @param {Boolean} unableStr 不能是字符串
 */
export const isNumber = function (num: any, config?: any) {
    config = isObject(config) ? config : {};
    if (config.unableStr === true) {
        return typeof num === 'number' && !isNaN(num);
    } else {
        return (typeof num === 'number' || typeof num === 'string') && /^(\+|-)?\d+(\.\d+)?$/.test(num + '');
    }
};

/**
 * 判断是否是字符串，默认为非空字符串
 * @param { any } str 用于判断的值
 * @param { boolean } emptyStr 表示可以是否可以为 空字符串''
 */
export const isString = function (str: any, emptyStr?: any) {
    return typeof str === 'string' && (emptyStr ? true : str !== '');
};

export const dealNumFormat = function (num: any, config?: any) {
    if (!isObject(config)) {
        config = {};
    }
    const notNumRes = config.notNumRes === undefined ? '--' : config.notNumRes;
    if (isNumber(num)) {
        num = Number(num);
        if (isNumber(config.multiply)) {
            num *= config.multiply;
        }
        const digit = isNumber(config.digit) ? config.digit : 2;
        if (digit === 0) {
            num = num >= 0 ? Math.floor(num) : Math.ceil(num);
        }

        if (config.overAMillion === true) {
            if (num >= 100000000 || num <= -100000000) {
                //负数也做处理
                // num = (num / 100000000).toFixed(digit) + "亿";
                num = moneyFormat(num / 100000000, 2) + '亿';
            } else if (num >= 10000 || num <= -10000) {
                //负数也做处理
                // num = (num / 10000).toFixed(digit) + "万";
                num = moneyFormat(num / 10000, 2) + '万';
            } else {
                num = num.toFixed(digit);
            }
        } else if (config.buyFund === true) {
            const noSymbol = config.noSymbol;
            const symbol = num != 0 ? (num > 0 ? '+' : '-') : num;
            num = Math.abs(num);
            if (num < 10000) {
                num = num.toFixed(digit);
                num = !noSymbol ? symbol + Number(num) : Number(num);
            } else {
                num = (num / 10000).toFixed(digit);
                num = !noSymbol ? symbol + Number(num) + '万' : Number(num) + '万';
            }
        } else if (config.assetData === true) {
            num = (num / 10000).toFixed(digit);
            num = Number(num) + '万元';
        } else {
            num = num.toFixed(digit);
        }

        if (isString(config.endUnit)) {
            num += config.endUnit;
        }
    } else {
        num = notNumRes;
    }
    return num;
};

/**
 * 描述：金额格式化显示，如：6123432.24 -> 6,123,432.24
 *
 * @param money: 金额
 * @param num: 保留的小数位
 */
export const moneyFormat = (money: any, num: number) => {
    // 去掉字符串中除数字、点号、负号外的其他字符
    money = cusParseFloat((money + '').replace(/[^\d.-]/g, ''));
    if (num != 0) {
        num = num ? num : 2;
    }
    money = money.toFixed(num);
    const reg = /^(-?\d+)(\d{3})(\.?\d*)/;
    while (reg.test(money)) {
        money = money.replace(reg, '$1,$2$3');
    }
    return money;
};

/**
 * 描述：还原金额格式，如：6,123,432.24 -> 6123432.24
 * @param money: 待还原的金额字符串
 */
export const restoreMoney = (money: any) => {
    if (money) {
        return parseFloat(money.replace(/[^\d.-]/g, ''));
    }
    return money;
};

/**
 * 描述：重写 javascript parseInt 方法
 * @param str: 待转换的字符串，
 * @param dftVal: 如果str为空或者parseFloat解析结果为NaN时 返回的默认值 ，不传默认返回0
 * @returns
 */
export const cusParseFloat = (str: string, dftVal = 0) => {
    let result = dftVal;
    if (str) {
        result = parseFloat(str) || dftVal;
    }
    return result;
};

/**
 * 去掉日期格式数据时分秒，如："2021-11-17 00:00:00" -> "2021-11-17"
 * @param date: 日期格式
 * @returns
 */
export const deleteDateHMS = (date: string | undefined) => {
    if (date) {
        return /\d{4}-\d{1,2}-\d{1,2}/g.exec(date)?.[0] || '0000-00-00';
    }
    return '0000-00-00';
};

/**
 * 获取当前时间,并转换成yy-mm-dd hh:mm:ss 格式
 * @param time: 中国标准时间，如Thu Dec 03 2020 10:40:06 GMT+0800
 * @returns
 */
export const getCurrentDate = (time: any) => {
    const date = time ? time : new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    const seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
};

/**
 * 获取当前时间前的时间,并转换成yy-mm-dd hh:mm:ss 格式
 * @returns
 */
export const getCurrentAgoDate = (n: number = 1, type: string = 'years') => {
    const date = new Date();
    const agoYear = 365 * n * 24 * 3600 * 1000;
    const agoMonth = n * 30 * 24 * 3600 * 1000;
    const agoDay = n * 24 * 3600 * 1000;
    let pastResult;
    switch (type) {
        case 'months':
            pastResult = date.getTime() - agoMonth;
            break;
        case 'days':
            pastResult = date.getTime() - agoDay;
            break;
        default:
            pastResult = date.getTime() - agoYear;
            break;
    }

    const pastDate = getCurrentDate(new Date(pastResult));
    return pastDate;
};

/**
 * 深拷贝
 * @returns
 */

export function deepClone(obj: any) {
    let temp: any = null;
    if (typeof obj === 'object' && obj !== null) {
        temp = obj instanceof Array ? [] : {};
        for (const i in obj) {
            temp[i] = deepClone(obj[i]);
        }
    } else {
        temp = obj;
    }
    return temp;
}
/**
 * 防抖
 */
export function debounce(fn: Function, delay: number) {
    let timer: NodeJS.Timeout;
    return function (this: any, ...args: any) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}

/**
 * 节流
 */
export function throttle(fn: Function, delay: number) {
    let timer: NodeJS.Timeout;
    return function (this: any, ...args: any) {
        if (!timer) {
            timer = setTimeout(() => {
                fn.apply(this, args);
            }, delay);
        }
    };
}

export function getUuid() {
    let arr = [];
    for (let i = 0; i < 16; i++) {
        arr.push(Math.floor(Math.random() * 10 + 1));
    }
    const uuid = uuidv4({ random: arr }).replace(/-/g, '');
    return uuid;
}

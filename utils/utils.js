// 生成星星数组
export function convertToStarsArray(stars) {
    const LENGTH = 5;
    let result = [];
    // 处理初始值
    let num = Math.floor(stars / 10 * 2) / 2;
    // 判断是否有小数，添加半颗星
    let hasDecimal = num % 1 !== 0;
    let integer = Math.floor(num);
    // 添加全星
    for (let i = 0; i < integer; i++) {
        result.push(1);
    }
    // 有半颗星星
    if (hasDecimal) {
        result.push(2);
    }
    // 补全
    while (result.length < LENGTH) {
        result.push(0);
    }
    return result;
};

// 处理演员名字数据
export function convertToCastString(casts) {
    var castsJoin = '';
    casts.forEach(function (cast) {
        castsJoin += cast.name + ' / ';
    });
    return castsJoin.substring(0, castsJoin.length - 2);
}

export function convertToCastInfos(casts) {
    var castsArray = [];
    casts.forEach(function (item) {
        var cast = {
            img: item.avatars ? item.avatars.large : '',
            name: item.name
        }
        castsArray.push(cast);
    });
    return castsArray;
}

// Get请求
export function http(url, callback) {
    wx.request({
        url: url,
        method: 'GET',
        // 设置请求的 header
        header: {
            'Content-Type': 'json'
        },
        success: function (res) {
            callback && callback(res);
        },
        fail: function () {
            // fail
            console.log('调用失败')
        }
    });
}
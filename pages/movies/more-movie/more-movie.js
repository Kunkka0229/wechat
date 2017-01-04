// pages/movies/more-movie/more-movie.js
var app = getApp();
var util = require('../../../utils/utils.js');
Page({
  data: {
    movies: {},
    navigateTitle: ''
  },
  onLoad: function (options) {
    var category = options.category;
    this.data.navigateTitle = category;

    // 设置URl
    var dataUrl = '';
    switch (category) {
      case '正在热映':
        dataUrl = app.globalData.doubanBase + '/v2/movie/in_theaters';
        break;
      case '即将上映':
        dataUrl = app.globalData.doubanBase + '/v2/movie/coming_soon';
        break;
      case '豆瓣Top250':
        dataUrl = app.globalData.doubanBase + '/v2/movie/top250';
        break;
    }

    // 请求数据
    util.http(dataUrl, this.processDoubanData);
  },
  // 数据处理
  processDoubanData(res) {   
    var movies = [];
    res.data.subjects.forEach((item) => {
      var temp = {
        stars: util.convertToStarsArray(item.rating.stars),
        title: item.title,
        average: item.rating.average,
        coverageUrl: item.images.large,
        movieId: item.id
      }
      movies.push(temp);
    })
    // 添加数据
    this.setData({
      movies: movies
    })
  },
  onShow() {
    // 动态设置标题
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle
    })
  }
})
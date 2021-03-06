// pages/movies/movies.js
var app = getApp();
var util = require('../../utils/utils.js');
Page({
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    searchResult: {},
    containerShow: true,
    searchPanelShow: false
  },
  onLoad: function (options) {
    // 正在上映 
    var inTheatersUrl = app.globalData.doubanBase + '/v2/movie/in_theaters?start=0&count=3';
    // 即将上映
    var comingSoonUrl = app.globalData.doubanBase + '/v2/movie/coming_soon?start=0&count=3';
    // top250
    var top250Url = app.globalData.doubanBase + '/v2/movie/top250?start=0&count=3';

    this.getMovieListData(inTheatersUrl, '正在热映', 'inTheaters');
    this.getMovieListData(comingSoonUrl, '即将上映', 'comingSoon');
    this.getMovieListData(top250Url, '豆瓣Top250', 'top250');
  },
  // 获取电影数据
  getMovieListData(url, categoryTitle, settedKey) {
    var self = this;
    // 发起请求
    wx.request({
      url: url,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // 设置请求的 header
      header: {
        'Content-Type': 'json'
      },
      success: function (res) {
        self.processDoubanData(res.data, categoryTitle, settedKey);
      },
      fail: function () {
        // fail
        console.log('调用失败')
      }
    });
  },
  // 数据处理
  processDoubanData(moviesDouban, categoryTitle, settedKey) {
    var movies = [];
    moviesDouban.subjects.forEach((item) => {
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
    var readyData = {};
    readyData[settedKey] = {
      movies: movies,
      categoryTitle: categoryTitle
    };
    this.setData(readyData);
  },
  // 点击跳转到更多
  onMoreTap(event) {
    let category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'more-movie/more-movie?category=' + category
    })
  },
  // 点击跳转到详情页
  onMovieTap(event) {
    let movieId = event.currentTarget.dataset.movieId;
     wx.navigateTo({
      url: 'movie-detail/movie-detail?id=' + movieId
    })
  },
  // 关闭搜索
  onCancelImgTap(event) {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult: {}
    })
  },
  // 获取input焦点 显示搜索
  onBindFocus(event) {
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })
  },
  onBindBlur(event) {
    var text = event.detail.value;
    var searchUrl = app.globalData.doubanBase + '/v2/movie/search?q=' + text;
    this.getMovieListData(searchUrl, '' ,'searchResult');
  }
})
// pages/movies/more-movie/more-movie.js
var app = getApp();
var util = require('../../../utils/utils.js');
Page({
  data: {
    movies: {},
    navigateTitle: '',
    requestUrl: '',
    totalCount: 0,
    isEmpty: true
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
    // 保存url地址
    this.data.requestUrl = dataUrl;
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
    });
    var totalMovies = {};
    // 如果要绑定新加载的数据，需要同旧有的数据合并到一起
    if(!this.data.isEmpty){
      totalMovies = this.data.movies.concat(movies);
    }else{
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    // 添加数据
    this.setData({
      movies: totalMovies
    });
    // 增加总数
    this.data.totalCount += 20;
    // 关闭上滑加载
    wx.hideNavigationBarLoading();
    // 关闭下拉刷新
    wx.stopPullDownRefresh();
  },
  // 上滑加载更多
  onReachBottom(event) {
    var nextUrlUrl = this.data.requestUrl + '?start=' + this.data.totalCount + '&count=20';
    console.log(nextUrlUrl)
    // 请求数据
    util.http(nextUrlUrl, this.processDoubanData);
    // 设置等待
    wx.showNavigationBarLoading();
  },
  // 下拉刷新
  onPullDownRefresh() {
    var refreshUrl = this.data.requestUrl + '?start=0&count=20';
    // 清空数据
    this.data.movies = {};
    this.data.isEmpty = true;
    this.data.totalCount = 0;
    // 请求数据
    util.http(refreshUrl, this.processDoubanData);
    // 设置等待
    wx.showNavigationBarLoading();
  },
  onShow() {
    // 动态设置标题
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle
    })
  },
  // 跳转电影详情
  onMovieTap(event) {
    let movieId = event.currentTarget.dataset.movieId;
     wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId
    })
  }
})
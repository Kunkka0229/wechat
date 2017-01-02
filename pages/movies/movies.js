// pages/movies/movies.js
var app = getApp();
Page({
  data:{},
  onLoad:function(options){
    // 正在上映
    var inTheatersUrl = app.globalData.doubanBase + '/v2/movie/in_theaters?start=0&count=3';
    // 即将上映
    var comingSoonUrl = app.globalData.doubanBase + '/v2/movie/coming_soon?start=0&count=3';
    // top250
    var top250Url = app.globalData.doubanBase + '/v2/movie/top250?start=0&count=3';

    this.getMovieListData(inTheatersUrl);
    // this.getMovieListData(comingSoonUrl);
    // this.getMovieListData(top250Url);
  },
  // 获取电影数据
  getMovieListData(url) {
    var self = this;
    // 发起请求
    wx.request({
      url: url,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // 设置请求的 header
      header: {
        'Content-Type': 'json'
      }, 
      success: function(res){
        self.processDoubanData(res.data);
      },
      fail: function() {
        // fail
        console.log('调用失败')
      }
    });
  },
  // 数据处理
  processDoubanData(moviesDouban) {
    var movies = [];
    moviesDouban.subjects.forEach((item) => {
      var temp = {
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
    });
  }
})
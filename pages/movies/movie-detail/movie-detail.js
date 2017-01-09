var app = getApp();
var util = require('../../../utils/utils.js');
Page({
  data:{
    movie: {}
  },
  onLoad:function(options){
    // 点击的电影Id
    var movieId = options.id;
    var url = app.globalData.doubanBase + '/v2/movie/subject/' + movieId;
    util.http(url, this.processDoubanData);
  },
  processDoubanData(res) {
    if(!res){
      return;
    }
    var data = res.data;
    // 导演
    var director = {
      avatar: '',
      name: '',
      id: ''
    }
    if(data.directors[0] != null){
      if(data.directors[0].avatars != null){
        director.avatar = data.directors[0].avatars.large;
      }
      director.name = data.directors[0].name;
      director.id = data.directors[0].id; 
    }

    var movie = {
      movieImg: data.images ? data.images.large : '',
      country: data.countries[0],
      title: data.title,
      originalTitle: data.original_title,
      wishCount: data.wish_count,
      commentCount: data.comments_count,
      year: data.year,
      genres: data.genres.join('、'),
      stars: util.convertToStarsArray(data.rating.stars),
      score: data.rating.average,
      director: director,
      casts: util.convertToCastString(data.casts),
      castsInfo: util.convertToCastInfos(data.casts),
      summary: data.summary
    }
    this.setData({
      movie: movie
    })
  }
})
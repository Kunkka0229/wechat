// pages/post/post.js
var postsData = require('../../data/posts-data.js');
Page({
  data: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      postList: postsData.postList
    })
  },
  // swiper跳转详情
  onSwiperTap(event) {
    // 获取文章id
    let postId = event.target.dataset.postId;
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId
    });
  },
  // 跳转详情页
  onPostTap(event) {
    // 获取文章id
    let postId = event.currentTarget.dataset.postId;  
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId
    });
  }
})
// pages/post/post-detail/post-detail.js
var postsData = require('../../../data/posts-data.js');
// 获取全局变量 app.js里
var app = getApp()

Page({
  data: {
    isPlayingMusic: false
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var postId = options.id;
    this.setData({
      currentPostId: postId
    })
    var postData = postsData.postList[postId];
    this.setData({
      postData: postData
    });

    // 获取所有的文字收藏方式
    var postsCollected = wx.getStorageSync('posts_collected');
    if (postsCollected) {
      var postCollected = postsCollected[postId];
      this.setData({
        collected: postCollected
      })
    } else {
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync('posts_collected', postsCollected);
    }

    // 监听总控开关音乐
    this.setMusicMonitor();

    // 全局音乐播放状态判断
    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId) {
      this.setData({
        isPlayingMusic: true
      });
    }
  },
  setMusicMonitor() {
    // 监听总控开关音乐启动
    var self = this;
    wx.onBackgroundAudioPlay(function () {
      self.setData({
        isPlayingMusic: true
      });
      // 改变全局音乐播放状态
      app.globalData.g_isPlayingMusic = true;
      app.globalData.g_currentMusicPostId = self.data.currentPostId;
    });
    // 监听总控开关音乐暂停
    wx.onBackgroundAudioPause(function () {
      self.setData({
        isPlayingMusic: false
      });
      // 改变全局音乐播放状态
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentMusicPostId = null;
    });
    // 音乐播放完成改变状态
    wx.onBackgroundAudioStop(function () {
      self.setData({
        isPlayingMusic: false
      });
      // 改变全局音乐播放状态
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentMusicPostId = null;
    });
  },
  // 改变收藏状态
  onCollectionTap(event) {
    // 同步调用
    this.getPostsCollectedSync();

    // 异步调用
    // this.getPostsCollectedAsync();
  },
  // 同步
  getPostsCollectedSync() {
    var postsCollected = wx.getStorageSync('posts_collected');
    var postCollected = postsCollected[this.data.currentPostId];
    // 切换收藏状态
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;
    // 调用提示
    this.showToast(postsCollected, postCollected);
  },
  // 异步
  getPostsCollectedAsync() {
    var self = this;
    wx.getStorage({
      key: 'posts_collected',
      success: function (res) {
        // success
        var postsCollected = res.data;
        var postCollected = postsCollected[self.data.currentPostId];
        // 切换收藏状态
        postCollected = !postCollected;
        postsCollected[self.data.currentPostId] = postCollected;
        // 调用提示
        self.showToast(postsCollected, postCollected);
      }
    })
  },
  // 分享
  onShareTap(event) {
    var itemList = [
      '分享给微信好友',
      '分享到朋友圈',
      '分享到QQ',
      '分享到微博'
    ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: '#405f80',
      success(res) {
        wx.showModal({
          title: '用户' + itemList[res.tapIndex],
          content: '现在还不能使用分享'
        })
      }
    })
  },
  showModal(postsCollected, postCollected) {
    var self = this;
    wx.showModal({
      title: '收藏',
      content: postCollected ? '是否收藏该文章？' : '取消收藏该文章？',
      cancelText: '取消',
      cancelColor: '#333',
      confirmText: '确认',
      confirmColor: '#405f80',
      success(res) {
        if (res.confirm) {
          // 跟新文章是否收藏的缓存
          wx.setStorageSync('posts_collected', postsCollected);
          // 跟新数据绑定变量，从而切换图片
          self.setData({
            collected: postCollected
          });
        }
      }
    })
  },
  showToast(postsCollected, postCollected) {
    // 跟新文章是否收藏的缓存
    wx.setStorageSync('posts_collected', postsCollected);
    // 跟新数据绑定变量，从而切换图片
    this.setData({
      collected: postCollected
    });

    // 提示
    wx.showToast({
      title: postCollected ? '收藏成功' : '取消成功',
      duration: 1000
    })
  },
  // 音乐播放
  onMusicTap(event) {
    // 当前id
    var currentPostMusic = postsData.postList[this.data.currentPostId].music;
    // 是否已经播放音乐
    let isPlayingMusic = this.data.isPlayingMusic;
    if (isPlayingMusic) {
      // 暂停
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      });
    } else {
      // 开始
      wx.playBackgroundAudio({
        dataUrl: currentPostMusic.url,
        title: currentPostMusic.title,
        coverImgUrl: currentPostMusic.coverImg
      });
      this.setData({
        isPlayingMusic: true
      });
    }
  }
})
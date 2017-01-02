// pages/welcome/welcome.js
Page({
  data:{},
  onTap: function(event){
    wx.switchTab({
      url: '../post/post'
    })
  }
})
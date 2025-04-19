<template>
	<view :style="'height: '+windowHeight+'px;width: '+windowWidth+'px;border:none;position: relative;'">
		<view class="divbox" v-show="showbg">
			{{text}}
		</view>
		<view class="divboxtiao" v-show="showbg" @click="gourl">
			{{'跳过'}}
		</view>
		<swiper :indicator-dots="true" indicator-color="#ffffff" indicator-active-color="#c7c7c7" :interval="3000"
			:duration="1000"
			:style="'height: '+windowHeight+'px;width: '+windowWidth+'px;border:none;position: relative;'">
			<swiper-item v-for="(item,index) in arrlist" :key="index">
				<view class="swiper-item">
					<image :src="apiurll+item.path_url" mode="scaleToFill"
						:style="'height: '+windowHeight+'px;width: '+windowWidth+'px;border:none'"></image>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import apiurl from '@/common/vmeitime-http/interface.js'
	import api from '@/common/vmeitime-http/index/index.js'
	import {
		useCounterStore
	} from '@/stores/counter'
	export default {
		data() {
			return {
				apiUrls: [
					'http://118.178.137.218:2025',
					'http://118.178.137.218:2025'
				],
				currentTry: 0,
				cuncuurl: [],
				windowHeight: '',
				windowWidth: '',
				text: '',
				timer: null,
				showbg: false,
				arrlist: [],
				apiurll:''
			}
		},
		onLoad() {
			uni.showLoading({
				title: '更新数据中',
				mask: true
			})
			let that = this
			uni.getSystemInfo({
				success: function(info) {
					that.windowHeight = info.windowHeight
					that.windowWidth = info.windowWidth
				}
			});
			if (uni.getStorageSync('apiurl')) {
				that.cuncuurl = uni.getStorageSync('apiurl')
				let index = Math.floor((Math.random() * that.cuncuurl.length));
				that.getAvailableApiUrl(that.cuncuurl[index])
			} else {
				that.getAvailableApiUrls()
			}
		},
		methods: {
			// 初始化获取域名
			getAvailableApiUrls() {
				let that = this
				if (that.apiUrls[that.currentTry] == undefined) {
					uni.showModal({
						title: '提示',
						content: '连接服务失败，请联系客服',
						success: function(res) {
							if (res.confirm) {
								that.currentTry = 0
								that.getAvailableApiUrls()
								uni.showLoading({
									title: '服务连接中',
									mask: true
								})
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
					uni.hideLoading()
				} else {
					uni.request({
						url: that.apiUrls[that.currentTry] + '/api/common/domainList?server=1', // 后端返回多个域名的接口
						method: 'GET',
						timeout: 2000,
						success: (res) => {
							apiurl.config.baseUrl = that.apiUrls[that.currentTry];
							uni.setStorageSync('api', that.apiUrls[that.currentTry])
							this.apiurll=that.apiUrls[that.currentTry]
							useCounterStore().baseUrl = that.apiUrls[that.currentTry]
							let add = res.data.data.apiHostList
							that.apiUrls = that.apiUrls.concat(add)
							const arr = that.removeDuplicates(that.apiUrls)
							uni.setStorageSync('apiurl', arr)
							// uni.navigateTo({
							// 	url: '/pages/initPage'
							// })
							this.getactionanimation()
							uni.hideLoading()
							uni.setStorageSync('timeday',Date.now())
						},
						fail: (err) => {
							if (that.currentTry >= that.apiUrls.length) {
								console.log(err)
							} else {
								that.currentTry++
								that.getAvailableApiUrls()
							}

						}
					});
				}

			},
			isToday(timestamp) {
			    var now = new Date();
			    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			    return timestamp >= today.getTime() && timestamp < today.getTime() + 86400000;
			},
			// 清除计时器
			clearTimer() {
				if (this.timer) {
					clearInterval(this.timer);
					this.timer = null;
				}
			},
			startCountdown() {
				if (this.timer) {
					this.clearTimer();
				}
				this.timer = setInterval(() => {
					if (this.text <= 0) {
						this.clearTimer();
						uni.navigateTo({
							url: '/pages/initPage'
						})
					} else {
						this.text -= 1;
					}
				}, 1000);
			},
			getactionanimation() {
				api.Getkaiji({
					'code': 'dz_app_boot_ad'
				}).then((res) => {
					if (res.data.code == 1) {
						if (res.data.data.waite_time > 0&&res.data.data.layoutInfo.length>0) {
							this.showbg = true
							this.arrlist = res.data.data.layoutInfo
							this.text = res.data.data.waite_time
							this.startCountdown()
						} else {
							uni.navigateTo({
								url: '/pages/initPage'
							})
						}
					}
				}).catch((err) => {
					console.log(err)
				})
			},
			// 第二次进入随机选择域名测试
			getAvailableApiUrl(url) {
				this.testApiUrl(url)
					.then((successfulApiUrl) => {
						let add = successfulApiUrl
						this.apiUrls = this.apiUrls.concat(add)
						const arr = this.removeDuplicates(this.apiUrls)
						uni.setStorageSync('apiurl', arr)
						// uni.navigateTo({
						// 	url: '/pages/initPage'
						// })
						uni.hideLoading()
						this.getactionanimation()
						if(this.isToday(uni.getStorageSync('timeday'))){
							uni.navigateTo({
								url: '/pages/initPage'
							})
						}else{
							this.getactionanimation()
							uni.setStorageSync('timeday',Date.now())
						}
					})
					.catch((err) => {
						console.log(err)
						this.getAvailableApiUrlss()
					});
			},
			// 测试某个域名是否可用
			testApiUrl(apiUrl) {
				return new Promise((resolve, reject) => {
					uni.request({
						url: apiUrl + '/api/common/domainList?server=1', // 拼接请求的完整 URL
						method: 'GET',
						timeout: 2000,
						success: (res) => {
							uni.setStorageSync('api', apiUrl)
							this.apiurll=apiUrl
							useCounterStore().baseUrl = this.apiUrls[this.currentTry]
							apiurl.config.baseUrl = apiUrl
							if (res.statusCode === 200) {
								resolve(res.data.data.apiHostList); // 如果请求成功，返回当前的域名
							}
						},
						fail: (err) => {
							reject('Request failed: ' + err);
						}
					});
				});
			},
			getAvailableApiUrlss() {
				if (this.cuncuurl[this.currentTry] == undefined) {
					uni.showModal({
						title: '提示',
						content: '连接服务失败，请联系客服',
						success: function(res) {
							if (res.confirm) {
								that.currentTry = 0
								that.getAvailableApiUrls()
								uni.showLoading({
									title: '服务连接中',
									mask: true
								})
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
					uni.hideLoading()
				} else {
					uni.request({
						url: this.cuncuurl[this.currentTry] + '/api/common/domainList?server=1', // 后端返回多个域名的接口
						method: 'GET',
						timeout: 2000,
						success: (res) => {
							apiurl.config.baseUrl = this.cuncuurl[this.currentTry];
							let add = res.data.data.apiHostList
							useCounterStore().baseUrl = this.apiUrls[this.currentTry]
							this.apiUrls = this.apiUrls.concat(add)
							const arr = this.removeDuplicates(this.apiUrls)
							uni.setStorageSync('apiurl', arr)
							uni.setStorageSync('api', this.cuncuurl[this.currentTry])
							this.apiurll=this.cuncuurl[this.currentTry]
							// uni.navigateTo({
							// 	url: '/pages/initPage'
							// })
							uni.hideLoading()
							this.getactionanimation()
							if(this.isToday(uni.getStorageSync('timeday'))){
								uni.navigateTo({
									url: '/pages/initPage'
								})
							}else{
								this.getactionanimation()
								uni.setStorageSync('timeday',Date.now())
							}
						},
						fail: (err) => {

							if (this.currentTry >= this.apiUrls.length) {
								console.log(err)
								return;
							} else {
								this.currentTry++
								this.getAvailableApiUrlss()
							}

						}
					});
				}
			},
			removeDuplicates(array) {
				return [...new Set(array)];
			},
			gourl() {
				uni.navigateTo({
					url: '/pages/initPage'
				})
			}
		}
	}
</script>

<style>
	.divbox {
		width: 100rpx;
		height: 50rpx;
		border-radius: 20rpx;
		position: absolute;
		right: 50rpx;
		top: 50rpx;
		z-index: 9999;
		background-color: #c2c2c2;
		text-align: center;
		line-height: 50rpx;
		color: white;
		font-weight: bolder;
	}

	.divboxtiao {
		width: 100rpx;
		height: 50rpx;
		border-radius: 20rpx;
		position: absolute;
		right: 50rpx;
		bottom: 50rpx;
		z-index: 9999;
		background-color: #c2c2c2;
		text-align: center;
		line-height: 50rpx;
		color: white;
		font-weight: bolder;
	}
</style>
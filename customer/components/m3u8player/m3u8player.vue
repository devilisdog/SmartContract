<template>
	<view id="mui-player"></view>
</template>

<script>
	import 'mui-player/dist/mui-player.min.css'
	import MuiPlayer from 'mui-player'
	import Hls from 'hls.js'
	import Flv from 'flv.js'
	import MuiPlayerDesktopPlugin from 'mui-player-desktop-plugin'
	export default {
		props: {
			src: {
				type: String,
				default: ''
			},
			poster: {
				type: String,
				default: ''
			},
			showCloseIcon: {
				type: Boolean,
				default: false
			},
			live: {
				type: Boolean,
				default: false
			},
			// 兼容音频m3u8
			isZero: {
				type: Boolean,
				default: false
			},
			video_width:{
				type: Number,
				default:500
			},
			video_height:{
				type: Number,
				default:500
			},
			childConfig: {
				type: Array,
				default: () => [{
						functions: '高清',
					},
					{
						functions: '标清',
						selected: true
					},
					{
						functions: '流畅'
					},
				]
			}
		},
		data() {
			return {
				mp: {}
			}
		},
		watch: {
			src(newVal, oldVal) {
				this.mp.reloadUrl(newVal);
			}
		},
		mounted() {
			const _this = this;
			var flieArr = _this.src.split('.');
			var suffix = flieArr[flieArr.length - 1];
			// m3u8格式
			var a = suffix.indexOf('m3u8') !== -1
			// flv格式
			var b = suffix.indexOf('flv') !== -1
			var c = {}
			if (a) {
				c = {
					type: 'hls',
					loader: Hls,
					config: {
						debug: false,
					}
				}
			}
			if (b) {
				c = {
					type: 'flv',
					loader: Flv,
					config: {
						cors: true
					},
				}
			}
			_this.mp = new MuiPlayer({
				// 指定播放器容器
				container: '#mui-player',
				// 视频播放的资源地址
				src: _this.src,
				autoplay: false,
				muted: false,
				width: _this.video_width,
				// 初始化播放器高度
				height: _this.video_height,
				// 播放器容器是否自适应视频高度
				autoFit: false,
				// loop
				loop: false,
				// 视频封面的资源地址
				poster: _this.poster,
				// 是否开启直播模式，直播模式默认菜单配置不允许控制播放速度以及循环播放
				live: _this.live,
				// 配置声明启用同层播放
				videoAttribute: [{
						attrKey: 'webkit-playsinline',
						attrValue: 'webkit-playsinline'
					},
					{
						attrKey: 'playsinline',
						attrValue: 'playsinline'
					},
					{
						attrKey: 'x5-video-player-type',
						attrValue: 'h5-page'
					},
				],
				parse: c,
				// 自定义主题颜色
				// themeColor: _this.$config.INFO.THEME_COLOR,
				// 非全屏模式下，是否显示播放器头部操作控件
				pageHead: false,
				plugins: [
					new MuiPlayerDesktopPlugin({
						customSetting: _this.childConfig.length > 0 ? [{
							functions: '清晰度',
							model: 'select',
							show: true,
							zIndex: 0,
							childConfig: _this.childConfig,
							onToggle: function(data, selected) {
								let onToggleLoad = function(state) {
									_this.mp.once('ready', function() {
										let _video = _this.mp.video();
										let _execute = function() {
											_video.currentTime = state
												.currentTime;
											state.paused ? _video.pause() :
												_video.play();
										}

										if (_video.readyState == 0) {
											_video.addEventListener(
												'durationchange',
												function(e) {
													_execute();
												}, {
													once: true
												})
										} else {
											_execute();
										}
									})
								}
								selected(function() {
									let _video = _this.mp.video();
									onToggleLoad({
										currentTime: _video.currentTime,
										paused: _video.paused
									});
									_this.$emit('onToggleFn', data.functions)
								});
							}
						}] : []
					})
				]
			});
			_this.$nextTick(() => {
				// 监听播放器已创建完成
				_this.mp.on('ready', function(event) {
					let _video = _this.mp.video();
					_video.addEventListener("play",function(e){
						//播放事件
						_this.$emit('onPlayFn')
					});
					_video.addEventListener("ended",function(e){
						//播放完成事件
						_this.$emit('onEndedFn')
					});
				});
				// 播放发生错误
				_this.mp.on('error', function(event) {
				});
			})
		},
		destroyed() {
			this.mp.destroy();
		},
		methods: {
			videoClose() {
				uni.navigateBack();
			},
			playVideo() {
				let _video = this.mp.video();
				_video.paused ?_video.play(): _video.pause();
			},
			pauseVideo(){
				let _video = this.mp.video();
				_video.pause();
			}
		},
	}
</script>
<style lang="scss" scoped>
	#mui-player{
		z-index: 2;
	}
	.full-close {
		top: 22rpx;
		right: 22rpx;
		width: 44rpx;
		height: 44rpx;
		cursor: pointer;
		z-index: 8;
	}
</style>


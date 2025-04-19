<template>
	<view style="height: 100vh;background-color: black;">
		<view class="status_bar"></view>
		<uni-nav-bar title="视频直播" left-icon="left" left-text="返回" @clickLeft="back" height="100rpx" backgroundColor="#f04b49" color="#ffffff"></uni-nav-bar>
		<!-- <web-view :src="src" style="height: 500rpx;border: 1rpx solid;top: 100rpx;"></web-view> -->
		<!-- <video :src="src"></video> -->
		<!-- #ifdef H5 -->
		<view class="video-js" ref="videodome" :style="'width: '+ windowWidth +'px; height: '+ windowHeight +'px; background-color:transparent;'"></view>
		<!-- #endif -->
		<!-- #ifdef APP-PLUS -->
		<view class="" style="width: 100%;height: 500rpx;">
			<video :src="src" style="width: 100%;height: 100%;"></video>
		</view>
		
		<!-- #endif -->
		<view class="listbox">
			<view class="lidiv" v-for="(item,index) in videolist" :key="index" @click="changvideo(item)">
				<text style="color: white;">直播{{index+1}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				videolist:[],
				src:uni.getStorageSync('videolist')[0],
				videoPlayer:null,
				windowWidth:'',
				windowHeight:''
			}
		},
		methods: {
			changvideo(item){
				if(this.videoPlayer!=null){
					this.videoPlayer.dispose()
					this.videoPlayer=null
						this.initvideo(item)
				}else{
				
				}
				// this.src=item
			},
			back(){
				uni.navigateBack()
				this.videoPlayer.dispose()
				this.videoPlayer=null
				
			},
			initvideo(src){
				let that=this
				that.$nextTick(() => {
								var video = document.createElement('video');
								var source = document.createElement('source');
								source.src = src;
								video.appendChild(source);
								video.id = 'video';
								video.style = 'width: 100%; height: 100%;';
								video.controls = true;
								video.setAttribute('playsinline', true) //IOS微信浏览器支持小窗内播放
								video.setAttribute('webkit-playsinline',true) //这个bai属性是ios 10中设置可以让视频在小du窗内播放，也就是不是全zhi屏播放的video标签的一个属性
								video.setAttribute('x5-video-player-type', 'h5') //安卓 声明启用同层H5播放器 可以在video上面加东西
								that.$refs.videodome.$el.appendChild(video);
								that.videoPlayer = videojs('video');
								that.videoPlayer.options
								that.videoPlayer.on('ended', function() {
									that.ended()
								});
								that.videoPlayer.on('loadeddata', function() {
						
								});
								that.videoPlayer.on('timeupdate', function() {
									 // var currentTime =that.videoPlayer.currentTime();
									 // that.timeupdatevjs(currentTime)
								})
								
							})
			
			}
		},
		onHide() {
		
		},
		onShow() {
			this.windowWidth = uni.getSystemInfoSync().windowWidth
			this.windowHeight = uni.getSystemInfoSync().windowHeight-500
			this.initvideo(uni.getStorageSync('videolist')[0])
			this.videolist=uni.getStorageSync('videolist')
			// if(this.videoPlayer==null){
			// 	this.videoPlayer.dispose()
			// 	this.videoPlayer=null
					
			// }else{
			// // this.initvideo(uni.getStorageSync('videolist')[0])
			// }
		},
		onLoad() {
			// this.windowWidth = uni.getSystemInfoSync().windowWidth
			// this.windowHeight = uni.getSystemInfoSync().windowHeight-500
			// this.initvideo(uni.getStorageSync('videolist')[0])
			// this.videolist=uni.getStorageSync('videolist')
			// console.log(uni.getStorageSync('videolist'))
		}
	}
</script>

<style>
.listbox{
	width: 100%;
	display: flex;
	justify-content: space-around;
	position: relative;
	flex-wrap: wrap;
	top: 600rpx;
}
.lidiv{
	border: 1rpx solid white;
	border-radius: 20rpx ;
	padding: 10rpx 10rpx;
}
.ssaa{
	border: 1rpx solid red;
}
	.status_bar {
		background-color: #ffffff;
		height: var(--status-bar-height);
		width: 100%;
	}
</style>

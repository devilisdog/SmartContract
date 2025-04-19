<template>
	<view class="video_box">
		<!-- #ifndef APP-PLUS -->
		<m3u8player 
			:src="url.live_url_arr[selectUrl].url" :video_height="video_heigth" 
			:video_width="video_width" :live="true">
		</m3u8player>
		<!-- #endif -->
		<!-- #ifdef APP-PLUS -->
			<view v-html="video_html" style="width:100%;height:30vh;margin-top:var(--status-bar-height);z-index:2;"></view>
		<!-- #endif -->
	</view>
	<scroll-view :scroll-y="true" class="scroll_view">
		<view 
			v-for="itme,index in url.live_url_arr" 
			:key="itme.title" @click="selectLive(index)" 
			:style="selectUrl==index?'background: rgba(255, 255, 255, 1);color:black;':''">
				{{itme.title}}
		</view>
	</scroll-view>
</template>

<script setup>
	import {onBeforeMount,ref,reactive,defineProps,getCurrentInstance} from 'vue';
	const url=defineProps(['live_url_arr'])
	const video_heigth=ref(0)//视频高度
	const video_width=ref(0)//视频宽度
	const selectUrl=ref(0)//用户选择的视频源
	const video_html=ref('')//生成视频播放的v-html
	const selectLive=(index)=>{
		video_html.value=''
		selectUrl.value=index
		video_html.value=`
		<video controlslist="nodownload" controls="controls" src="${url.live_url_arr[selectUrl.value].url}" style="width:100%;height:100%;background-color: black;" autoplay="autoplay" :is-live="true"></video>
		`
	}
	onBeforeMount(()=>{
		uni.getSystemInfo({
			success(res){
				selectLive(0)
				video_width.value=res.windowWidth
				video_heigth.value=res.windowHeight*0.3
			}
		})
	})
</script>

<style lang="scss">
	.scroll_view{
		background: rgba(255, 255, 255, 0.2);
		
		z-index: 9999;
		position: fixed;
		top:calc(var(--status-bar-height) + 20rpx);
		width:120rpx;
		height:20vh;
		right:20rpx;
		view{
			padding:20rpx 0rpx;
			text-align: center;
			border-bottom:1rpx solid #717171;
			color:#fff;
			font-size:26rpx;
			box-sizing: border-box;
		}
	}
	.video_box{
		width:100%;
		height:30vh;
		position: fixed;
		top:0rpx;
		left:0;
	}
</style>
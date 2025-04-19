<template>
	<view class="box">
		<u-navbar v-if="autoBack" :title="title" :bgColor="bgColor" leftIconColor="#fff" :autoBack="false"
			:titleStyle="{color:'#fff'}" @leftClick="leftClick" @rightClick="rightClick"
			rightIcon="share-fill"></u-navbar>
		<nav-bar v-if="!autoBack" :title="title" :back="false" :bgColor="bgColor"></nav-bar>
		<web-view :src="analysis" @message="onMessage" style="top: 90rpx;"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: "",
				analysis: "",
				delta: 0,
				autoBack: true,
				obj:""
			}
		},
		methods: {
			rightClick() {
				uni.navigateTo({
				 	url: "/pages/common/bifen-share?data=" + encodeURIComponent(JSON.stringify({
				 		"url": this.analysis,
						"obj":this.obj
				 	}))
				 })
				 uni.setStorageSync("delta",this.delta)
			},
			onMessage(e) {
				if (e.data == "点击按钮") {
					//用来记录webview里面的点击次数
					this.delta = this.delta + 1
				}
			},
			leftClick() {
				//返回事件
				if (this.delta == 0) {
					this.delta = 1;
				}
				if(uni.getStorageSync("delta")!=undefined&&uni.getStorageSync("delta")!=""){
					history.go(-uni.getStorageSync("delta"))
					uni.removeStorageSync("delta")
				}else{
					history.go(-this.delta)
				}
			},
		},
		onLoad(option) {
			//监听webview发送的数据
			window.addEventListener('message', this.onMessage);
			let obj = JSON.parse(decodeURIComponent(option.obj));
			this.obj = obj;
			this.analysis = obj.analysis
			this.title = obj.homeTeam.substring(obj.homeTeam.indexOf(']') + 1) + " VS " + obj.visitingTeam.substring(obj
				.visitingTeam.indexOf(']') + 1)
			this.bgColor = uni.getStorageSync("bgColor");
			this.$delete(this.obj, 'letOdds');
			this.$delete(this.obj, 'winNegativeOdds');
			this.$delete(this.obj, 'cedePointsOdds');
			this.$delete(this.obj, 'bonusOdds');
			this.$delete(this.obj, 'notLetOdds');
			this.$delete(this.obj, 'scoreOddsList');
			this.$delete(this.obj, 'goalOddsList');
			this.$delete(this.obj, 'halfWholeOddsList');
			this.$delete(this.obj, 'letOddsList');
			this.$delete(this.obj, 'notLetOddsList');
		},
	}
</script>

<style>
</style>
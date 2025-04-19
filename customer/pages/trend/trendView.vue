<template>
	<view class="box">
		<nav-bar :title="title" :back="true" :bgColor="bgColor"></nav-bar>
		<zero-loading v-if="loading" mask :color="bgColor"></zero-loading>
		<web-view :src="dataUrl"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loading:false,
				title: "",
				bgColor: "",
				fontColor: "",
				dataUrl: ""
			}
		},
		onLoad(option) {
			let obj = JSON.parse(decodeURIComponent(option.obj));
			this.title = obj.title;
			this.dataUrl = obj.url;
			this.bgColor = uni.getStorageSync("bgColor");
			this.fontColor = uni.getStorageSync("fontColor");
			this.loading=true;
			setTimeout(() => {
				this.loading=false;
			}, 500)
		}
	}
</script>

<style>
</style>
<template>
	<view class="tab_box">
		<view class="tab_item" v-for="item,id in tab_list" :key="id" :class="{tab_item_on:id==current_tab}"
			@tap="select_tab(id)">{{item}}</view>
		<view class="line" :style="{width:lineWidth,left:left+'rpx'}"></view>
	</view>
</template>
<script>
	export default {
		name: 'tab-box',
		props: {
			tab_list: {
				type: Array,
				default: []
			},
			current_tab: {
				type: Number,
				default: 0
			},
		},
		data() {
			return {
				lineWidth: 80,
				left: 0
			}
		},
		watch: {
			current_tab: function(num) {
				console.log(num)
				const width = 750;
				let tab_num = this.tab_list.length;
				let pre_width = width / tab_num;
				console.log(pre_width)
				this.left = (pre_width - this.lineWidth) / 2 + pre_width * num +4;//4为误差值
			}
		},
		created() {
			const width = 750;
			let tab_num = this.tab_list.length;
			let pre_width = width / tab_num;
			this.left = (pre_width - this.lineWidth) / 2 +4;
		},
		computed: {

		},
		methods: {
			select_tab: function(id) {
				this.$emit('onTabClick', id);
			}
		}
	}
</script>
<style>
	.line {
		width: 76rpx;
		height: 6rpx;
		background: #FDB106;
		border-radius: 3rpx 3rpx 3rpx 3rpx;
		opacity: 1;
		bottom: 18rpx;
		left: 0;
		position: absolute;
		transition: left .2s;
	}

	.tab_item {
		flex: 1;
	height: 113rpx;
		font-size: 32rpx;
		font-weight: 400;
		color: #999999;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.tab_item_on {
		font-weight: bold;
		color: #333333;
	}

	.tab_box {
		width: 100%;
		background-color: #fff;
		height: 113rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		position: relative;
	}
</style>

<template>
	<view class="card">
		<view class="top_title">积分排名</view>
		<uni-table stripe emptyText="暂无更多数据" >
			<uni-tr style="background-color:#ebebeb;">
				<uni-td align="center">排名</uni-td>
				<uni-td align="center">球队</uni-td>
				<uni-td align="center">赛</uni-td>
				<uni-td align="center">胜/平/负</uni-td>
				<uni-td align="center">净</uni-td>
				<uni-td align="center">积分</uni-td>
			</uni-tr>
			<uni-tr>
				<uni-td align="center">1</uni-td>
				<uni-td align="center">美国女足</uni-td>
				<uni-td align="center">1</uni-td>
				<uni-td align="center">1/2/1</uni-td>
				<uni-td align="center">3</uni-td>
				<uni-td align="center">3</uni-td>
			</uni-tr>
		</uni-table>
	</view>
</template>

<script setup>
	import {onBeforeMount,ref,reactive,defineProps,defineEmits} from 'vue';
	import {onShow} from "@dcloudio/uni-app"
	const Emits=defineEmits(['getData'])
	onShow(()=>{
		Emits('getData')
	})
	
</script>

<style lang="scss">
	
	.card{
		width:680rpx;
		padding:20rpx;
		background-color: #fff;
		border-radius:15rpx;
		margin:20rpx auto;
		box-shadow:0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.4);
		.top_title{
			font-weight: bold;
			margin-bottom:20rpx;
		}
	}

</style>
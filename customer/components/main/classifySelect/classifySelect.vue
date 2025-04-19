<template>
	<scroll-view :scroll-x="true" class="scroll_style" :scroll-left="scroll_left_value" :scroll-with-animation="true">
		
		<view class="select_box" v-for="itme,index in Props.select_arr" :style="selectValue==index?'background-color:#1C2737;':''" @click="user_select($event,index)" :id="index">
			<uni-badge size="normal" :text="itme.selectNumber" absolute="rightTop" type="error">
				<text>{{itme.businessDate+' '+itme.weekday}}</text><br>
				<text>{{itme.matchNumber}}场比赛</text>
			</uni-badge>
		</view>
	</scroll-view>
</template>

<script setup>
	import {ref,reactive,onBeforeMount,defineProps,defineEmits} from "vue"
	const Props=defineProps(['select_arr'])
	const Emits=defineEmits(['click_select'])
	const selectValue=ref(0)//获取选择的值
	const scroll_left_value=ref(0)//滚动view默认位置
	const scrollDom=ref(null)
	const getScrollW=()=>{//获取scroll元素信息
		
	}
	const user_select=(e,index)=>{
		if(selectValue.value!=index){//用户每次点击获取当前元素位置，计算距离中间滚动的位置并设置滚动view默认位置
			var query=uni.createSelectorQuery().select('.scroll_style');
			query.boundingClientRect((data)=>{
				selectValue.value=index
				scroll_left_value.value=e.currentTarget.offsetLeft-(data.width/2)+80
				Emits('click_select',selectValue.value)
			}).exec()
		}
	}
</script>

<style lang="scss">
	.scroll_style{
		white-space: nowrap;
	}
	.select_box{
		border-radius:10rpx;
		padding:20rpx;
		background-color:#dddddd;
		color:white;
		margin:15rpx;
		display: inline-block;
		transition: all 0.3s;
		text-align: center;
	}
</style>

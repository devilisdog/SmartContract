
<template>
	<view class="week_choice">
		<scroll-view :scroll-x="true" :scroll-left="scroll" class="scroll_class" :scroll-with-animation="true">
			<view
				:class="index === props.current?'itme_true':'itme_false'" 
				v-for="item, index in props.values" 
				@click="_onClick($event,index)" >
				<text>{{item.date}}</text><br>
				<text>{{item.week}}</text>
			</view>
		</scroll-view>
	</view>
</template>
<script setup>
	import { onBeforeMount,onMounted,ref,reactive,getCurrentInstance ,defineProps,defineEmits} from 'vue';
	 
	const props = defineProps(['current','values'])//接收传值
	

	const emits = defineEmits(['onClickdateItem'])
	
	const scroll=ref(0)
			
	const scrollDom=ref('')
	const getScrollW=()=>{//获取scroll元素信息
		var query=uni.createSelectorQuery().select('.scroll_class');
		query.boundingClientRect((data)=>{
			scrollDom.value=data
		}).exec()
	}
	onMounted(()=>{
		setTimeout(()=>{
			scroll.value=350
		},400)
	})
	
	function _onClick(e,index){
		getScrollW()
		//滑动块选中元素居中原来(获取整个scroll宽度，在获取点击的子元素距离左边的距离，然后获取子元素宽度)
		//公式为(当前点击子元素距离左边栏的距离 - scroll-view 宽度的一半  + 当前点击子元素一半的宽度)
		scroll.value=e.currentTarget.offsetLeft-(scrollDom.value.width/2)
		emits('onClickdateItem',index)	
	}
</script>

<style lang="scss">
	.week_choice{
		color: #999999;
		font-size: 28rpx;
		margin-top:10rpx;
		scroll-view{
			width:100%;
			white-space:nowrap;
		}
		.itme_false{
			background-color:white;
			margin:0rpx 10rpx;
			display :inline-block;
			padding:15rpx 25rpx;
			text-align: center;
			border-radius:10rpx;
			box-shadow:0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.4);
		}
		.itme_true{
			background-color:#f04b49;
			margin:0rpx 10rpx;
			display :inline-block;
			padding:15rpx 25rpx;
			text-align: center;
			border-radius:10rpx;
			color:white;
			box-shadow:0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.4);
			transition:all 0.2s; 
		}
		// 如果不想显示横滚动条需要设置该样式
		scroll-view ::-webkit-scrollbar {
			width: 0;
			height: 0;
			background-color: transparent;
			display: none // ios隐藏需要
		}
	}
	
	
</style>

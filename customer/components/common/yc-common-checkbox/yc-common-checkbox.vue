<template>
	<view class="clause" style="" @click="click">
		<uni-icons v-show="show" type="checkmarkempty" :style="'color:'+iconcolor"></uni-icons>
	</view>
</template>

<script setup>
	import {
		onBeforeMount,
		onMounted,
		ref,
		reactive,
		getCurrentInstance, //获取当前组件的实例
		defineProps,
		defineEmits,
	} from 'vue';
	
	onBeforeMount(() => {
		init()
	})
		
	
	const init =()=>{
		show.value = props.show
	}
	
	const props = defineProps(['iconcolor','show']) //接收传值
	const show = ref(false)
	const emits = defineEmits(['check-change'])
	const click= ()=>{
		show.value = !show.value
		emits("check-change",show.value)
	}
</script>

<style>
.clause {
    display: inline-block;
    margin-left: 3px;
    width: 32rpx;
    height: 32rpx;
    line-height: 32rpx;
    color: #fff;
    text-align: center;
    border: 1px solid #dcdde1;
}

</style>
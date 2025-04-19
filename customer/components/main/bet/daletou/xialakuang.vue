<template>
	
	<view class="dropdown">
		<view class="dropbtn" @click="click">
		  <text>{{showtext}}</text>
		  <uni-icons :type="show?'top':'bottom'" size="14" color="#000000" />
		</view>
		
		<view class="dropdown-content" :style="show?'display: block;':'display: none;'">
			<view v-for="i,index in Props.localdata" @click="chgne(i.number,index)" >
				{{i.value}}
			</view>
		</view>
	</view>
</template>
	
<script setup>
	import {
		onBeforeMount,
		onMounted, //加载生命周期
		ref,
		reactive,
		getCurrentInstance,
		watch,
		defineProps, //接收数据
		defineEmits //发送数据
		// nextTick
	} from 'vue';
	//自选蓝球部分
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	
	
	
	
	const Props = defineProps(['localdata'])
	const Emits = defineEmits(['change'])
	
	const show = ref(false)
	const showtext =ref('')
	onBeforeMount(() => {
		showtext.value = Props.localdata[0].value
	})
	
	
	

	
	
	
	const click =()=>{
		show.value=!show.value
	}
	
	const chgne =(e,index)=>{
		show.value=!show.value
		showtext.value = Props.localdata[index].value
		Emits('change',e)
	}

</script>

<style lang="less">
	/* 下拉按钮样式 */
	.dropbtn {

	    border: none;
	    cursor: pointer;
		
		color: black;
		display: flex;
		width: 100rpx;
		height: 50rpx;
		border: 0.5px solid black;
		border-radius: 3px;
		display: flex;
		align-items: center;
		justify-content: center;
		
		text{
			font-size: 30rpx;
		}
	}
	
	/* 容器 <div> - 需要定位下拉内容 */
	.dropdown {
	    position: relative;
	    display: inline-block;
	}
	
	/* 下拉内容 (默认隐藏) */
	.dropdown-content {
		position: absolute;
		top: calc(100% + 5rpx);
	    display: none;
	    left: 0;
	    width: 100%;
	    background-color: #FFFFFF;
	    border: 1px solid #EBEEF5;
	    border-radius: 6px;
	    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	    z-index: 2;
	    padding: 4px 0;
		font-size: 25rpx;
	}
	
	
	/* 下拉菜单的链接 */
	.dropdown-content view{
	    color: black;
	    padding: 12px 16px;
	    text-decoration: none;
	    display: block;
	}
	
	/* 鼠标移上去后修改下拉菜单链接颜色 */
	.dropdown-content view:hover {background-color: #f1f1f1}
	
	/* 在鼠标移上去后显示下拉菜单 */
	.dropdown:hover .dropdown-content {
		display: block;
	}
	
	/* 当下拉内容显示后修改下拉按钮的背景颜色 */
	.dropdown:hover .dropbtn {
	    // background-color: #3e8e41;
	}
	
	
</style>
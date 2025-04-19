<template>
	<view>
		<div class="body"></div>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				formUrl: '' // 用于展示form表单的URL
			}
		},
		methods: {

		},
		onLoad() {
			const Form = uni.getStorageSync('from'); //获取你本地存储的form表单渲染成页面
			this.formUrl = Form
			//将接口返回的Form表单显示到页面
			document.querySelector('body').innerHTML = this.formUrl; // body对应上面的class	 
			this.$nextTick(() => {
				// console.log(document.forms,"form"); //跳转之前,可以先打印看看forms,确保后台数据和forms正确,否则，可能会出现一些奇奇怪怪的问题 ╮(╯▽╰)╭
				document.forms['0'].submit(); //重点--这个才是跳转页面的核心,获取第一个表单并提交
			});
		}
	}
</script>

<style>

</style>
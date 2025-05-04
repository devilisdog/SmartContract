<template>
	<view class="status_bar"></view>
	<uni-nav-bar title="反馈中心" rightText="反馈记录" leftIcon="back" @clickRight="openRecord" @clickLeft="back" />
	<view class="card3" >
		<view style="display: flex;flex-flow: column;">
			<text class="text-fk" style="padding-bottom:10rpx;">反馈类型：</text>
			<view>
				<view class="fromsStyle" @click="clickFroms">
					<text>{{range[classifyValue].text}}</text>
					<uni-icons type="bottom"></uni-icons>
				</view>
				<view class="showFroms" v-show="fromShow">
					<view v-for="itme,index in range" @click="fromsSelect(itme.value)">
						<text>
							{{itme.text}}
						</text>
						<uni-icons 
							type="checkmarkempty" 
							color="#f04b49" 
							v-show='index==classifyValue'
							size="32rpx">
						</uni-icons>
					</view>
				</view>
			</view>
		</view>
		
		<view style="margin:20rpx 0;">
			<text class="text-fk">问题描述：</text>
			
			<uni-easyinput
				type="textarea" 
				v-model="problem" 
				placeholder="请输入内容" 
				maxlength="300" 
				>
			</uni-easyinput>
		</view>
	</view>
	<view class="xuanxiao">
		<text class="text-fk">联系方式：</text>
		<view class="text-fk" style="width: 100%;border-bottom: #f0f0f0 1rpx solid;padding:5rpx 0rpx;">
			<input v-model="contactWay" type="text" placeholder="电话/微信/QQ/邮箱账号" />
		</view>
	</view>
	<view style="width: 700rpx; height: 540rpx;margin:10rpx auto;border-radius: 10rpx;margin-top:60rpx;">
		<view style="width: 100%;height: 50rpx;border-bottom:1rpx #d3d3d3 solid;">
			<view style="margin:10rpx 0rpx 0rpx 10rpx;">
				<uni-file-picker 
				:auto-upload="false"
				limit="6" 
				title="相关照片:"
				@select="select"
				@delete="dele"
				></uni-file-picker>
			</view>
		</view>
	</view>
	
	<view style="width: 720rpx;margin:20rpx auto;">
		<view class="buttomStyle" @click="imgCilke">
			提交
		</view>
	</view>
</template>
<script setup>
	import { useCounterStore } from '@/stores/counter';
import { callWithErrorHandling } from 'vue';
	const counter = useCounterStore();//状态管理
	import {ref,reactive,getCurrentInstance,} from 'vue';
	// import { pathToBase64, base64ToPath } from 'image-tools'
	import api from '@/common/vmeitime-http/index.js'
	const classifyValue=ref(0)//反馈类型默认选择值
	const fromShow=ref(false)
	const range=reactive([
		{value:0,text:"软件问题(BUG/显示/无法使用某些功能)...."},
		{value:1,text:"订单问题(店主投诉/中奖金额投诉)...."},
		{value:2,text:"玩法问题(规则不正确)...."},
	])
	
	const clickFroms=()=>{//打开下拉选择框
		fromShow.value=!fromShow.value
	}
	const fromsSelect=(e)=>{
		classifyValue.value=e
		fromShow.value=!fromShow.value
	}
	
	//这个用来放照片 路径
	const picture = reactive({
		data:[]
	})
	//这个存的是uni组件生成的uuid 用来辅助查找要删除的照片
	const picture02 = reactive({
		data:[]
	})
	const back=()=>{
		uni.navigateBack()
	}
	const select =(e) =>{
		picture02.data.push(e.tempFiles[0].uuid)
		uni.uploadFile({
			 url:counter.baseUrl+'/api/common.Common/upload',
			 header:{
			  server:1,
			  "ba-user-token":uni.getStorageSync('access_token'),
			 },
			 filePath:e.tempFilePaths[0],
			 name:'file',
			 success(res) {
				 var a = JSON.parse(res.data)
				 picture.data.push(a.data.file)
			 },
			 fail(err) {
			  console.log(err);
			 }
		 
		})
	}
	const dele =(e)=>{//删除图片触发
		var a = Object.values(e)
		for(var i = 0 ; i < picture02.data.length ; i++){
			if(a[0].uuid == picture02.data[i]){
				picture02.data.splice(i,1)
				picture.data.splice(i,1)
			}
		}
	}
	
	// 联系方式 input 的值
	const contactWay = ref()
	
	// 问题描述内容值
	const problem = ref()
	const imgCilke =()=>{//提交
		
		if(contactWay.value==undefined){
			uni.showToast({
				title:'请填写联系方式,这样方便我们处理后联系您喔~',
				position:'center',
				icon:'error'
			})
			return
		}else if(problem.value==undefined){
			uni.showToast({
				title:'请描述您遇到的问题，这样我们就可以尽快理解您的问题喔~',
				position:'center',
				icon:'error'
			})
			return
		}
		api.helpPost({
			type:classifyValue.value,
			contact:contactWay.value,
			describe:problem.value,
			related_images:picture.data,
		}).then((res)=>{
			uni.showToast({
				title:res.data.data,
				position:'center',
				icon:res.data.msg
			})
		
		})
	}
	
	// 跳转至反馈记录
	const openRecord =()=>{
		uni.navigateTo({
			url: '/pages/home/helpcenter/helpRecord/helpRecord',
			animationType: "slide-in-right",
			animationDuration: 250
		});
	}
</script>

<style>
	.titleStyle{
		
	}
	.showFroms{
		width:100%;
		box-sizing: border-box;
		box-shadow:0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.5);
		display: flex;
		flex-flow: column;
		line-height:60rpx;
		
	}
	.showFroms view{
		border-bottom:1rpx solid #d8d8d8;
		padding:10rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.fromsStyle{
		width:100%;
		height:40rpx;
		border-bottom:1rpx solid #f0f0f0;
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
	}
	.fromsStyle text{
		font-size:32rpx;
		margin-left:10rpx;
		
	}
	.buttomStyle{
		width:100%;
		height:80rpx;
		background-color:#1C2737;
		border-radius:15rpx;
		text-align: center;
		line-height:80rpx;
		color: white;
	}
	.status_bar {
		background-color: #ffffff;
		height: var(--status-bar-height);
		width: 100%;
	}
	.text-fk {
		font-size:32rpx;
		font-weight: bold;
		margin: 0rpx 0rpx 0rpx 12rpx;
	}

	.xuanxiao {
		width:720rpx;
		height: 65rpx;
		margin: 0 auto;
		box-sizing: border-box;
	}
	.card3 {
		width: 720rpx;
		margin:20rpx auto;
		border-radius: 10rpx;
		background-color: white;
	}

	.xia {
		width: 100%;
		height: 1213rpx;
		float: left;
	}

	.biaoti1 {
		font-size: 120%;
		margin-top: 30rpx;
	}

	.tab {
		float: right;
		width: 100%;
		height: 100rpx;
		margin-top: 20rpx;

	}
</style>

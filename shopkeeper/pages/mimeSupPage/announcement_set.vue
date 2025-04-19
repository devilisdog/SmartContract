<template>
	<z-paging ref="List" @query='loadList' v-model="dataList" :loading-more-enabled="false">
		<template v-slot:top>
			<view class="statusBar"></view>
			<uni-nav-bar title="公告设置" left-icon="back" left-text="返回" @clickLeft="back"></uni-nav-bar>
		</template>
		<view class="announcement_card" v-for="itme,index in dataList" :key="itme.id">
			<view class="card_title">
				<text>发布时间：{{date.getNowFormatDate(0,itme.create_time)}}</text>
				<text class="label">{{itme.content==''?'公告取消':itme.type=='1'?'弹窗公告':'滚动公告'}}</text>
			</view>
			<view class="content_box">
				<text>{{itme.content}}</text>
			</view>
		</view>
	</z-paging>
	<uni-transition class="openCard" :show="true" mode-class="slide-right" @click="proxy.$refs.iusse.open()">
		<uni-icons type="compose" size="64rpx" color="#fff"></uni-icons>
	</uni-transition>
	<uni-popup ref="iusse" type="center" :maskClick="false">
		<view class="set_card">
			<view class="ste_title">公告发布</view>
			<uni-easyinput :type="select_value==0?'text':'textarea'" placeholder="公告内容" v-model="inputValue" />
			<view class="set_type_box">
				<uni-data-checkbox 
					v-model="select_value" :localdata="range" 
					mode="tag" selected-color="#feb856">
				</uni-data-checkbox>
			</view>
			<view style="text-indent:4mm;">
				<text>公告类型说明：</text>
				<text v-show="select_value==0" class="explainStyle">
					滚动类型公告，会在首页进行滚动显示，公告内容无法换行，滚动公告无法查询历史记录，可提交空值来取消滚动公告的显示（建议长期公告使用）
				</text>
				<text v-show="select_value==1" class="explainStyle">
					弹窗类型公告，会在首页进行弹窗显示具有强提醒特性，公告内容可换行此功能对用户具有打扰性质，不建议频繁发布，可查询过往发布内容（建议短期紧急公告使用）
				</text>
			</view>
			<view class="buttonBox">
				<view class="closeIusee" @click="proxy.$refs.iusse.close()">取消</view>
				<view class="clickIusee" @click="clickIusee">发布</view>
			</view>
		</view>
	</uni-popup>
</template>

<script setup>
	import {onBeforeMount,ref,reactive,getCurrentInstance,defineProps} from 'vue';
	import api from "@/common/vmeitime-http/mine/mine.js"
	import date from "@/common/getdatetime.js"
	const {proxy,ctx} = getCurrentInstance()
	const select_value=ref(0)
	const inputValue=ref('')
	const dataList=ref([])
	const range=reactive([{"value": 0,"text": "滚动公告"},{"value": 1,"text": "弹窗公告"}])
	const back=()=>{
		uni.navigateBack()
	}
	const clickIusee=()=>{//发布公告
		if(select_value.value==1 && inputValue.value=='' && inputValue.value.length<=0){//空值拦截
			uni.showToast({
				title:'弹窗公告无法提交空值，请输入公告内容',
				icon:'none'
			})
			return
		}
		api.set_notice_board({'type':select_value.value==0?false:true,'content':inputValue.value}).then(res=>{
			uni.showToast({
				title:res.data.data,
				icon:res.data.msg
			})
			proxy.$refs.iusse.close()
			inputValue.value=''//清空输入框值
			proxy.$refs.List.refresh()
		}).catch(err=>{
			uni.showToast({
				title:'数据处理失败',
				icon:'none'
			})
		})
	}
	const loadList=()=>{
		api.get_notice_board_list({}).then(res=>{
			proxy.$refs.List.complete(res.data.data)
		}).catch(err=>{
			proxy.$refs.List.complete(false)
		})
	}
</script>

<style lang="scss">
	.label{
		padding:5rpx 20rpx;
		background-color: #f6d365;
		border-radius:10rpx;
		color:#fff;
		font-weight: bold;
	}
	.buttonBox{
		display: flex;
		align-items: center;
		.closeIusee{
			background-color: #c7c7c7;
			flex:1;
		}
		.clickIusee{
			flex:1.3;
			margin-left:20rpx;
			background-image: linear-gradient(-225deg, #f6d365,#fda085);
			color:#fff;
			font-weight: bold;
		}
		view{
			height:80rpx;
			border-radius:20rpx;
			text-align: center;
			line-height:80rpx;
			margin-top:20rpx;
		}
	}
	.explainStyle{
		font-size:26rpx;
		color: #8a8a8a;
	}
	.set_card{
		width:680rpx;
		padding:20rpx;
		border-radius:20rpx;
		background-color: #fff;
		.set_type_box{
			margin-top:20rpx;
		}
		.ste_title{
			font-size:38rpx;
			font-weight: bold;
			text-align: center;
			margin-bottom:20rpx;
		}
	}
	.openCard{
		position: fixed;
		bottom:200rpx;
		right:20rpx;
		background-color:#feb856;
		padding:20rpx;
		border-radius:50%;
	}
	.content_box{
		width:100%;
		word-wrap:break-word;
	}
	.card_title{
		width:100%;
		padding-bottom:10rpx;
		border-bottom:1rpx solid #cccccc;
		font-size:28rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	
	.announcement_card{
		width:680rpx;
		padding:20rpx;
		background-color: #fff;
		box-shadow:0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.4);
		border-radius:20rpx;
		margin:20rpx auto;
	}
	body{
		background-color:#fbfbfb;
	}
	.statusBar{
		width:100%;
		height:var(--status-bar-height);
		background-color:white;
	}
</style>

<template>
	<z-paging ref="payList" v-model="payData" @query='payFioncn'>
		<template v-slot:top>
			<view class="status_bar"></view><!-- 头部 -->
			<uni-nav-bar title="收款管理" leftIcon="back" @clickLeft="back()" leftText="返回"/><!-- 提示 -->
			<view style="width: 100%;background-color: #fffacf ;">
				<text style="font-size: 24rpx;margin-left: 20rpx; color: #2f2f2f ;box-sizing: ;">
					开通后用户可通过以下方式充值,如需重新申请请联系平台客服
				</text>
			</view>
		</template>
		<uni-collapse accordion><!-- 内容 -->
			<uni-collapse-item :show-animation='true' v-for="item,index in payData " :key="index" >
				<template v-slot:title>
				<view style="width: 100%;height: 100%;display: flex;align-items: center;">
					<image :src='counter.baseUrl+item.icon' style="width: 100rpx; height: 100rpx;margin-left: 20rpx;" />
					<view style="margin-left: 10rpx;width: 410rpx;display: flex;flex-direction: column;margin: 15rpx 10rpx;">
						<text style="font-size: 30rpx;">{{item.name}}</text>
						<text style="font-size: 20rpx;color: #6c6c6c ;line-height: 45rpx;">
							{{item.title}}为{{Number(item.rate).toFixed(2)}}%
						</text>
					</view>
					<view style="margin-right: 0rpx; width: 250rpx;">
						<text style="color: #2a7fff;font-size: 26rpx;" v-show="item.record==null" @click="tiao(item)">去开通</text>
						<text style="color: #00aa7f;font-size: 26rpx;" v-show="item.record=='0'">审核中</text>
						<text style="color: #FDC830;font-size: 26rpx;" v-show="item.record=='1'">收款开启</text>
						<text style="color: red;font-size: 26rpx;" v-show="item.record=='2'" @click="tiao(item)">审核未通过<br>(点击修改)</text>
						<text style="color:#8a8a8a;font-size: 26rpx;" v-show="item.record=='3'">收款关闭</text>
					</view>
				</view>
				</template>
				<view class="content">
					
					<view v-show="item.record=='1'|| item.record=='3'" class="switch_time">
						<text>开启收款渠道</text>
						<text v-show="item.id==999" style="color:#2a7fff;"
							@click="tiao(item)">修改图片</text>
						<text v-show="item.id==999" style="color:#2a7fff;"
							@click="yulanxianxiaimg(item.name,item.model,item.id)">预览图片</text>
							
						<text v-show="item.id==3 || item.id==201" style="color:#2a7fff;" 
							@click="proxy.$refs.setPid.open();openPayId=item.id">设置PID</text>
						<switch 
							color="#FDC830" style="transform:scale(0.7)" 
							:checked="item.record=='1'?true:item.record=='3'?false:false" 
							@change="setPayState($event,item.id)">
						</switch>
					</view>
				</view>
			</uni-collapse-item>
		</uni-collapse>
	</z-paging>
	
	<fui-dialog :show="dialogshow" :buttons="dialogbuttons"  :content="dialogContent" @click="clickDialog" maskClosable  @close="closeDialog()"></fui-dialog>
	
	<uni-popup ref="setPid" type="dialog" >
		<uni-popup-dialog 
			title='请输入51新支付平台pid参数' 
			mode='input' 
			@confirm="SetNickName" >
		</uni-popup-dialog>
	</uni-popup>
</template>
<script setup>
	import api from "@/common/vmeitime-http/mine/mine.js"
	import {useCounterStore} from '@/stores/counter'
	import {ref,reactive,onBeforeMount,getCurrentInstance} from 'vue';
	import { onLoad,onShow,onHide } from "@dcloudio/uni-app"
	import { Login } from "../../common/vmeitime-http/index";
	const {proxy,ctx} = getCurrentInstance()
	const payData=ref([])//列表数据
	const counter = useCounterStore(); //状态管理
	const openPayId=ref(0)
	const dialogshow=ref(false)
	const navurl = ref('')
	const dialogContent=ref('')

	onLoad(()=>{
		uni.$on('refres',()=>{
			payFioncn()
		})
	})
	const back = () => {// 返回到上一个页面
		uni.navigateBack()
	}
	const setPayState=(e,id)=>{//关闭或开启支付渠道
		api.setReceipt({"id":id,"state":e.detail.value}).then(res=>{
			uni.showToast({title:res.data.data,icon:res.data.msg})
			proxy.$refs.payList.refresh()
		}).catch(err=>{
			uni.showToast({
				title:'数据处理失败，请反馈平台客服',
				icon:'none',
				position:'center'
			})
		})
	}
	const SetNickName=(e)=>{//设置pid
		uni.showLoading({title:'提交中',mask:true})
		api.setPid({'pid':e,'source':openPayId.value}).then(res=>{
			openPayId.value=0
			uni.hideLoading()
			uni.showToast({
				title:res.data.data,
				icon:res.data.msg
			})
		}).catch(err=>{
			openPayId.value=0
			uni.hideLoading()
			uni.showToast({
				title:'数据处理失败',
				icon:'none'
			})
		})
	}
	
	const yulanxianxiaimg=(data)=>{
		
		api.YulanShoukuangImg({}).then(res=>{
			var arr=(counter.baseUrl+res.data.data).split()
			uni.previewImage({urls:arr,})
		})
		// uni.previewImage({urls:arr,})
	}
	const tiao=(data)=>{//跳转至申请页
		if(data.record==2){
			
			dialogContent.value='驳回理由:'+data.retmemo
			navurl.value = '/pages/mimeSupPage/receiptSupPage/receiptSupPage?title='+data.name+'&listData='+data.model+'&payId='+data.id
			dialogshow.value=true
			return
		}else{
			uni.navigateTo({
				url:'/pages/mimeSupPage/receiptSupPage/receiptSupPage?title='+data.name+'&listData='+data.model+'&payId='+data.id
			})
		}
		
		
		
	}
	const clickDialog=(e)=>{
		if(e.index==1){
			uni.navigateTo({
				url:navurl.value
			})
		}
		dialogshow.value=false
		
		
	}
	//拒绝按钮的取消
	const closeDialog=()=>{
		dialogshow.value=false
	}
	
	const payFioncn=(pageNo,pageSize)=>{
		api.WithdrawalManagement({}).then(res=>{
			proxy.$refs.payList.complete(res.data.data)
		}).catch(erre=>{
			proxy.$refs.payList.complete(false)
		})
	}
</script>

<style>
	.switch_time{
		display: flex;
		justify-content: space-between;
		align-items: center;
		width:680rpx;
		margin: 0 auto;
	}
	.status_bar {
		background-color: #fff;
		height: var(--status-bar-height);
		width: 100%;
	}
	.sfq{
		width: 100%;
		height: 120rpx;
		display: flex;
		align-items: center;
	}
	.content{
		width: 100%;
		height: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.xia{
		width: 100%;
		height: 100rpx;
		align-items: center;
		justify-content: center;
		position: fixed;
		top: 19.5%;
		transition: 0.5s;
	}
</style>

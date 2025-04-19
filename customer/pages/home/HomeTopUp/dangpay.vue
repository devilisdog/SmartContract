<template>
	<view class="status_bar"></view>
	<view class="divtop">
		<image src="@/static/img/main/zhifubao.png" mode="" style="width: 250rpx;height: 100rpx;"></image>
	</view>
	<view class="divbox">
		<!-- #ifdef H5 -->
		<l-painter ref="shareRef" @progress='change' class="share_classh">
				<l-painter-qrcode
					:text="userShareLink"  
					css="width:450rpx;height:500rpx;background:white;"
				/>
		</l-painter>
		<!-- #endif -->
		<!-- #ifdef APP -->
		<l-painter ref="shareRef" @progress='change' class="share_class">
				<l-painter-qrcode
					:text="userShareLink"  
					css="width:450rpx;height:500rpx;background:white;"
				/>
		</l-painter>
		<!-- #endif -->
		<view class="divbtn" @click="gozhifu">
			立即启用支付宝APP支付
		</view>
		<view class="divtext">
			如无法支付可截屏使用支付宝相册扫码
		</view>
		<view class="divbottom">
			<view class="divleft">
				<image src="@/static/img/main/saoma.png" style="width: 150rpx;height: 150rpx;" mode=""></image>
			</view>
			<view class="divright">
				<view class="" style="margin-top:50rpx;">
				<text style="font-weight: bolder;">请使用支付宝扫一扫</text>	
				</view>
				<view class="">
					<text style="font-weight: bolder;">扫描二维码完成支付</text>
				</view>
			</view>
		</view>
	</view>
	<view class="popupShareCard">
		<view class="cancelButtom" @click="back">
			取消
		</view>
	</view>
</template>

<script setup>
	import {useCounterStore} from '@/stores/counter'
	import api from "@/common/vmeitime-http/index.js"
	import {
		ref,
		onBeforeMount,
		onMounted,
		reactive,
		getCurrentInstance,
		defineProps
	} from 'vue';
	import {onShow,onHide,onUnload} from "@dcloudio/uni-app"
	const Props=defineProps(['id'])
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	const userId=uni.getStorageSync("user_id")
	onHide(()=>{
			closeClear()
	})
	onBeforeMount(()=>{
		uni.showLoading({
			title:'生成中~'
		})

	})
	onUnload(()=>{
		closeClear()
	})
	onShow(()=>{
		openClear()
	})
	const counter = useCounterStore(); //状态管理
	const userShareLink=ref(
		uni.getStorageSync('qrCode')
	)
	const qrhttp=ref(
		uni.getStorageSync('qrhttp')
	)
	const change=(e)=>{
		if(e==1){
			uni.hideLoading()
		}
	}
	const clickShare=(title)=>{
		if(title=='复制连接'){
			uni.setClipboardData({
				data:userShareLink.value
			})
		}else if(title=='保存图片'){
			proxy.$refs.shareRef.canvasToTempFilePathSync({
				fileType:'png',
				pathType: 'url',
				quality: 1,
				success(res){
					uni.saveImageToPhotosAlbum({
						filePath: res.tempFilePath,
						success(res_ok){
							uni.showToast({
								title:'保存成功!可在相册查看',
								position:'bottom',
							})
						 }
					});
				}
			})
		}else{
			uni.showToast({
				title:'此功能未开放~',
				position:'center',
				icon:'error'
			})
		}
	}
	onShow(()=>{
		// gozhifu()
		chaxun()
		// opentimerfun()
	})
	const timer=ref(null)//定时器参数
	const openClear=()=>{//开启定时器
		console.log('✅开启定时器加载');
		if(timer.value==null){
			timer.value=setInterval(()=>{
				try {
					chaxun()
				}
				catch(err) {
					closeClear()
				}
			},5000)
		}
	}
		const opentimer=ref(null)//定时器参数
	// const opentimerfun=()=>{
	// 		console.log('✅开启定时器加载');
	// 		if(opentimer.value==null){
	// 			opentimer.value=setTimeout(function(){
	// 				gozhifu()
	// 			},6000)
	// 		}
	// }
	const closeClear=()=>{//关闭定时器
		// console.log('❗关闭定时器加载');
		clearInterval(timer.value)
		timer.value=null
	}
	
	const chaxun=()=>{
		api.Getdingdan({'out_trade_no':Props.id}).then((res)=>{
			if(res.data.code==1){
				if(res.data.data.tradeStatus=="TRADE_SUCCESS"){
					
					api.Getdingdantype().then((res)=>{
						if(res.data.msg=="success"){
							uni.navigateTo({
								url:'/pages/home/home'
							})
							closeClear()
						}
					})
				}else if(res.data.data.tradeStatus=="WAIT_BUYER_PAY"){
					console.log('123123')
					gozhifu()
				}else if(res.data.data.tradeStatus==null){
					console.log('123123')
					gozhifu()
				}
			}
		})
	}
	
	const gozhifu=()=>{
		// #ifdef H5
		window.location.href ="alipays://platformapi/startapp?saId=10000007&qrcode="+uni.getStorageSync('qrCode')
		// #endif
		
		// #ifdef APP
		let url=uni.getStorageSync('qrhttp')
		plus.runtime.openURL(url, res => {
			uni.showModal({
				content: '本机未检测到对应客户端，是否下载应用？',
				success: function(res) {
					if (res.confirm) {
						plus.runtime.openURL('https://ds.alipay.com/')
					}
					if(res.cancel){
						closeClear()
						uni.navigateTo({
							url:'/pages/home/home'
						})
					}
				}
			});
		})
		// #endif
	}
	const back=()=>{
		uni.navigateBack()
	}
	const shareImagArr=reactive([
		// {'src':'weixin','text':'微信好友'},
		// {'src':'pyq','text':'朋友圈'},
		// {'src':'qq','text':'QQ好友'},
		{'src':'cloud-download-filled','text':'保存图片'},
		{'src':'link','text':'复制连接'},
	])
</script>

<style>
	.share_classh{
		position:fixed;
		top:42%;
		left:61%;
		margin-top:-500rpx;
		margin-left:-300rpx;
		border-radius:20rpx;
	}
	.share_class{
		position:fixed;
		top:58%;
		left:61%;
		margin-top:-500rpx;
		margin-left:-300rpx;
		border-radius:20rpx;
	}
	body{
		background-color:#f3f3f3;
	}
	.shareButtonCard{
		width:100%;
		display: flex;
		justify-content: space-around;
		margin:20rpx 0rpx;
		/* position: fixed; */
	}
	.popupShareCard{
		width:100%;
		display: flex;
		flex-flow: column;
		justify-content:space-between;
		background-color:white;
		border-radius:40rpx 40rpx 0rpx 0rpx;
		position:fixed;
		bottom:0rpx;
	}
	.cancelButtom{
		width:700rpx;
		height:80rpx;
		background-color:#ebebeb;
		margin:15rpx auto;
		border-radius:20rpx;
		text-align: center;
		line-height:80rpx;
	}
	.cancelButtom:active{
		transition:.2s;
		transform: scale(0.95);
	}
	.divbox{
		width: 100%;
		height:1000rpx;
		margin: 0 auto;
		border-radius: 20rpx;
		background-color: white;
		position: relative;
		margin-top: 50rpx;
	}
	.divbtn{
		width: 100%;
		height: 50rpx;
		border: 1rpx solid;
		position: absolute;
		bottom:400rpx;
		text-align:center;
		line-height: 50rpx;
		background-color: rgb(23,187,135);
		color: white;
	}
	.divtext{
		width: 100%;
		height: 50rpx;
		position: absolute;
		bottom:330rpx;
		text-align:center;
		line-height: 50rpx;
		font-weight: bolder;
	}
	.divtop{
		height: 100rpx;
		background-color: white;
		display: flex;
		justify-content: center;
	}
	.status_bar {
		background-color: #ffffff;
		height: var(--status-bar-height);
		width: 100%;
	}
	.divbottom{
		width: 100%;
		height: 200rpx;
		border-top: 1rpx solid;
		position: absolute;
		bottom:0rpx;
		display: flex;
	}
	.divleft{
		width: 50%;
		height:200rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.divright{
		font-size: 25rpx;

	}
</style>

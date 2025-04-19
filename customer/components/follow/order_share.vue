<template>
	
	<l-painter ref="shareRef" class="share_class" @longpress="saveImage"  @progress='change'>
		
		<l-painter-view :css="shareStyle.top">
			<l-painter-view :css="shareStyle.top_user_info">
				<l-painter-view css="display:inline-block;">
					<l-painter-image :src="Props.order_info.user_info.avatar" :css="shareStyle.user_info_logo" />
					<l-painter-text :text="Props.order_info.user_info.nickname+'\n\n邀请您参与跟单~'" css="margin-left:10rpx;line-height:45rpx;"></l-painter-text>
				</l-painter-view>
				<l-painter-view :css="shareStyle.info_label">
					<l-painter-text :text="'跟单人数'+Props.order_info.follow_people.total+'\n预计回报'+(order_info.follow_info.ForecastReward<1.8?0:order_info.follow_info.ForecastReward)+'倍'"></l-painter-text>
				</l-painter-view>
			</l-painter-view>
			<l-painter-view :css="shareStyle.text_box">
				<l-painter-text :text="Props.order_info.follow_info.Type+'\n跟单彩种'"></l-painter-text>
			</l-painter-view>
			<l-painter-view :css="shareStyle.text_box">
				
				<l-painter-text :text="Props.order_info.follow_info.StartBetMoney+'元'+'\n起投金额'"></l-painter-text>
			</l-painter-view>
			<l-painter-view :css="shareStyle.text_box">
				<l-painter-text :text="Props.order_info.follow_info.FollowMoney+'元'+'\n跟单总额'"></l-painter-text>
			</l-painter-view>
			<!-- <l-painter-view :css="shareStyle.text_box">
				<l-painter-text :text="order_info.follow_info.ForecastReward<1.8?0:order_info.follow_info.ForecastReward+'倍'+'\n预计回报'"></l-painter-text>
			</l-painter-view> -->
		</l-painter-view>
		<l-painter-view :css="shareStyle.bottom">
			<l-painter-qrcode :text="qrCodeData" :css="shareStyle.qrcode"></l-painter-qrcode>
		</l-painter-view>
		<l-painter-view css="text-align:center;margin-top:-50rpx;font-weight: bold;width:720rpx;">
			<l-painter-text text="打开易下APP—>点击'我的'右上角—>"></l-painter-text>
			<l-painter-image src="/static/img/main/scanQR_balck.png" css="width:35rpx;height:35rpx;"></l-painter-image>
		</l-painter-view>
	</l-painter>
	<view class="asdas">
		<text>长按内容区域保存图片~(点击空白区域退出)</text>
	</view>
</template>
<script setup>
	import {onShow} from "@dcloudio/uni-app"
	import {
		onBeforeMount,
		ref,
		reactive,
		getCurrentInstance,
		// defineEmits, //发送数据
		defineProps,
	 } from 'vue';
	const Props=defineProps(['order_info'])
	const {proxy,ctx} = getCurrentInstance()
	const shareStyle=reactive({
		top:'width:720rpx;border-radius:20rpx 20rpx 0 0;background-color:#f04b49;color:#fff;',
		bottom:"width:720rpx;border-radius:0 0 20rpx 20rpx;height:750rpx;background-color:#fff;",
		top_user_info:"width:690rpx;margin:30rpx 0rpx 30rpx 30rpx;",
		user_info_logo:"width:140rpx;height:140rpx;border-radius:10rpx;",
		info_label:"background-color:#fff;display:inline-block;border-radius:30rpx 0 0 30rpx;position:absolute;right:0rpx;top:30rpx;color:#ff5500;font-weight: bold;text-align: center;padding:0rpx 20rpx;",
		text_box:"display:inline-block;text-align: center;font-weight: bold;font-size:32rpx;width:240rpx;",
		qrcode:"width:600rpx;height:600rpx;padding:20rpx;position:absolute;top:35rpx;left:40rpx;border:5rpx solid #c8c8c8;border-radius:20rpx;",
		shop_label:"padding:10rpx 20rpx;background-color:#ff5500;border-radius:20rpx;display:inline-block;position:absolute;color:#fff;top:20rpx;left:40%;"
	})
	const qrCodeData=ref({})
	onBeforeMount(()=>{
		var newObj={
			heading:'jmzs',//判断是否是易下二维码表示
			type:'follow',//判断玩法类型(together==合买/follow==跟单)
			open_order_id:Props.order_info.follow_info.id
		}
		qrCodeData.value='http://118.178.137.218:2025/#/pages/home/home?open_data='+JSON.stringify(newObj)//二维码内容初始化
		qrCodeData.value=encodeURI(qrCodeData.value)
		uni.showLoading({title:'生成中~',mask:true})
	})
	const change=(e)=>{//生成海报结束后
		if(e==1){
			uni.hideLoading()
		}
	}
	const saveImage=()=>{//长按保存图片
		proxy.$refs.shareRef.canvasToTempFilePathSync({
			fileType:"jpg",
			pathType:'url',
			quality: 1,
			success:(res)=>{
				uni.saveImageToPhotosAlbum({
					filePath:res.tempFilePath,
					success:(succeed)=>{
						uni.showToast({
							title:'保存成功啦，可在系统相册查看喔~',
							icon:'none',
							position:'bottom'
						})
					},
					fail(err){
						uni.showToast({
							title:'保存失败，可截图分享',
							icon:'error',
						})
					}
				})
			}
		})
	}
</script>


<style lang="scss">
	.asdas{
		position:fixed;
		top:85%;
		text-align: center;
		width:100%;
		left:0;
		color:white;
	}
	.share_class{
		position:fixed;
		top:50%;
		left:50%;
		margin-top:-75%;
		margin-left:-360rpx;
		border-radius:20rpx;
	}
</style>

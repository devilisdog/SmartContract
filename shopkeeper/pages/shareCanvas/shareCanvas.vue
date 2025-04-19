<template>
	<l-painter ref="cheshi" @progress='schedule' v-if="showValue==1" class="share_class">
		<l-painter-view css="height:900rpx; width:600rpx;border-radius:20rpx;background-color:#ff945e;">
			<l-painter-image :src="bgsrc" css="width:600rpx; height:900rpx;" />
			<l-painter-qrcode
				:text="userShareLink"
				css="width:145rpx;height:145rpx;background:white;position:absolute;top:690rpx;right:70rpx;"
			/>
		</l-painter-view>
	</l-painter>
	<l-painter ref="cheshi" @progress='schedule' v-if="showValue==2" class="share_class">
		<l-painter-view css="height:900rpx; width:600rpx;border-radius:20rpx;background-color:#ff945e;">
			<l-painter-image :src="dzbgsrc" css="width:600rpx; height:900rpx;" />
			<l-painter-qrcode
				:text="shopShareLink"
				css="width:145rpx;height:145rpx;background:white;position:absolute;top:690rpx;right:70rpx;"
			/>
		</l-painter-view>
	</l-painter>
	<view class="type_box">
		<view class="buttom_style" :style="showValue==1?'background-color: #FDC830;':''" @click="clickButton(1)">邀请用户</view>
		<view class="buttom_style" :style="showValue==2?'background-color: #FDC830;':''" @click="clickButton(2)">邀请店主</view>
	</view>
	<view class="popupShareCard">
		<view class="shareButtonCard">
			<view v-for="item,index in shareImagArr" style="text-align:center;" @click="clickShare(item.title)">
				<image :src="item.src" style="width:60rpx;height:60rpx;" mode="aspectFit"/><br>
				<text style="font-size:26rpx;">{{item.title}}</text>
			</view>
		</view>
		<view class="cancelButtom" @click="back">
			取消
		</view>
	</view>
</template>

<script setup>
	import {useCounterStore} from '@/stores/counter'
	import {ref,onBeforeMount,reactive,getCurrentInstance,} from 'vue';
	const {proxy,ctx} = getCurrentInstance()
	const counter = useCounterStore(); //状态管理
	const showValue=ref(1)
	const schedule=(e)=>{
		if(e==1){
			uni.hideLoading()
		}
	}
	const isId=ref(0)
	const register_url =ref(0)
	onBeforeMount(()=>{
		if(counter.shopBasicsData.group_id==2){
			isId.value=counter.shopBasicsData.id
		}else{
			isId.value=counter.shopBasicsData.shop_id
		}
		loading()
		getAvailableApiUrls()
	})
	const clickButton=(e)=>{
		if(showValue.value!=e){
			showValue.value=e
		}
	}
	const loading=()=>{//加载中
		uni.showLoading({
			title:'生成中~'
		})
	}
	const shareurl=ref([])
	const currentTry=ref(0)
		const bgsrc=ref(0)
		const dzbgsrc=ref(0)
			const shareurlapi=ref(0)
	const getAvailableApiUrls=()=> {
		    uni.request({
		      url:  uni.getStorageSync('api')+'/api/common/domainList?server=1',  // 后端返回多个域名的接口
		      method: 'GET',
			  timeout: 2000,
		      success: (res) => {
				  shareurl.value=res.data.data.shareHostList
				  shareurlsfunction()
		      },
		      fail: (err) => {
				console.log(err)
		      }
		    });
		}
	const shareurlsfunction=()=>{
		uni.request({
			url:shareurl.value[currentTry.value] +`/api/common/domainList?server=1`,
			timeout: 2000,
			method:'POST',
			success(res){
				console.log(shareurl.value[currentTry.value])
				shareurlapi.value=shareurl.value[currentTry.value]
				bgsrc.value=shareurl.value[currentTry.value]+'/storage/Config/user/advertising01user.png'
				dzbgsrc.value=shareurl.value[currentTry.value]+'/storage/Config/user/advertising.png'
				uni.setStorageSync('shareapi',shareurl.value[currentTry.value])
				userShareLink.value=encodeURI(shareurl.value[currentTry.value]+'/register?InvitationCode='+counter.shopBasicsData.id+'&title="投注端注册"'+'&shop_id='+counter.shopBasicsData.id+'&group_id=1')
				shopShareLink.value=encodeURI(shareurl.value[currentTry.value]+'/register?InvitationCode='+counter.shopBasicsData.id+'&title="店主端注册"'+'&shop_id=0'+'&group_id=2')
				uni.hideLoading()
			},
			fail(err){
				if (currentTry.value >= shareurl.value.length) {
				    return
				 }else{
					 currentTry.value++
					 shareurlsfunction()
				 }
			}
		})
		
	}
	const back=()=>{uni.navigateBack()}
	const userShareLink=ref(
	0
	)
	const shopShareLink=ref(
		0
	)
	const shareImagArr=reactive([
		// {
		// 	title:'微信好友',
		// 	src:'/static/icon/mide/WeChat.png'
		// },
		// {
		// 	title:'微信朋友圈',
		// 	src:'/static/icon/mide/pyq.png'
		// },
		// {
		// 	title:'QQ好友',
		// 	src:'/static/icon/mide/QQ.png'
		// },
		{
			title:'保存图片',
			src:'/static/icon/mide/download.png'
		},
		{	
			title:'复制链接',
			src:'/static/icon/mide/link.png'
		}
	])
	const clickShare=(title)=>{
		if(title=='保存图片'){
			proxy.$refs.cheshi.canvasToTempFilePathSync({
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
		}else if(title=='QQ好友'){
			uni.showToast({
				title:'此功能暂时未开放,可以复制链接或下载图片',
				icon:'none',
				position:'center'
			})
			// proxy.$refs.cheshi.canvasToTempFilePathSync({
			// 	fileType:'png',
			// 	pathType: 'url',
			// 	quality: 1,
			// 	success(res){
			// 		uni.share({
			// 			provider: "qq",
			// 			scene: "WXSceneSession",
			// 			type: 2,
			// 			imageUrl: res.tempFilePath,
			// 		});
			// 	}
			// })
		}else if(title=='微信好友'){
			uni.showToast({
				title:'此功能暂时未开放,可以复制链接或下载图片',
				icon:'none',
				position:'center'
			})
			// proxy.$refs.cheshi.canvasToTempFilePathSync({
			// 	fileType:'png',
			// 	pathType: 'url',
			// 	quality: 1,
			// 	success(res){
			// 		uni.share({
			// 			provider: "weixin",
			// 			scene: "WXSceneSession",
			// 			type: 2,
			// 			imageUrl: res.tempFilePath,
			// 		});
			// 	}
			// })
		}else if(title=='微信朋友圈'){
			uni.showToast({
				title:'此功能暂时未开放,可以复制链接或下载图片',
				icon:'none',
				position:'center'
			})
			// proxy.$refs.cheshi.canvasToTempFilePathSync({
			// 	fileType:'png',
			// 	pathType: 'url',
			// 	quality: 1,
			// 	success(res){
			// 		uni.share({
			// 			provider: "weixin",
			// 			scene: "WXSceneTimeline",
			// 			type: 2,
			// 			imageUrl: res.tempFilePath,
			// 		});
			// 	}
			// })
		}else{
			uni.setClipboardData({
				data:showValue.value==1?userShareLink.value:shopShareLink.value,
			})
		}
	}
</script>

<style>
	.buttom_style{
		width:250rpx;
		height:80rpx;
		border-radius:15rpx;
		text-align: center;
		line-height:80rpx;
		color:white;
		font-weight: bold;
		background-color: #d6d6d6;
	}
	.type_box{
		width:100%;
		display: flex;
		justify-content: space-around;
		margin-top:var(--status-bar-height);
		padding:20rpx 0;
	}
	.share_class{
		position: fixed;
		top:50%;
		left:50%;
		margin-top:-550rpx;
		margin-left:-300rpx;
		width:600rpx;
		border-radius:20rpx;
	}
	.buttonStyle{
		width:300rpx;
		height:60rpx;
		text-align: center;
		line-height:60rpx;
		font-weight: bold;
		border-radius:20rpx;
		transition: all 0.2s;
	}
	.buttonStyle_true{
		width:300rpx;
		height:60rpx;
		text-align: center;
		line-height:60rpx;
		background-color:#FDC830;
		color: white;
		font-weight: bold;
		border-radius:20rpx;
		transition: all 0.2s;
	}
	.buttonBox{
		width:600rpx;
		display: flex;
		justify-content: space-between;
		margin: auto;
		border-radius:20rpx;
		box-shadow:-1px -1px 1px #a5a5a5, 1px 1px 1px #fff;
	}
	.shareButtonCard{
		width:100%;
		display: flex;
		justify-content: space-around;
		margin:20rpx 0rpx;
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
		width:600rpx;
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
	
	
	.canvasStyle{
		width:600rpx;
		height:900rpx;
		border-radius:20rpx;
		z-index: 9999;
		margin:50rpx auto;
		background-color: white;
	}
	body{
		background-color: #ebebeb;
	}
</style>

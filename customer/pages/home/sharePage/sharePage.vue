<template>
	<l-painter ref="shareRef" @progress='change' class="share_class">
		<l-painter-view
			css="height:900rpx; width:600rpx;border-radius:20rpx;background-color:#ff945e;">
			<l-painter-image :src="bgsrc" css="width:600rpx; height:900rpx;" />
			<l-painter-qrcode
				:text="userShareLink"  
				css="width:145rpx;height:145rpx;background:white;position:absolute;top:690rpx;right:70rpx;"
			/>
		</l-painter-view>
	</l-painter>
	<view class="popupShareCard">
		<view class="shareButtonCard">
			<view v-for="item,index in shareImagArr" style="text-align:center;" @click="clickShare(item.text)">
				<uni-icons :type="item.src" size="70rpx" color="#4a4a4a"></uni-icons><br>
				<!-- <image :src="item.src" style="width:32px;height:32px;" /><br> -->
				<text style="font-size:26rpx;">{{item.text}}</text>
			</view>
		</view>
		<view class="cancelButtom" @click="back">
			取消
		</view>
	</view>
</template>

<script setup>
	import {useCounterStore} from '@/stores/counter'
	import {
		ref,
		onBeforeMount,
		onMounted,
		reactive,
		getCurrentInstance,
	} from 'vue';
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	const userId=uni.getStorageSync("user_id")
	onBeforeMount(()=>{
		uni.showLoading({
			title:'生成中~'
		})
		getAvailableApiUrls()
	})
	const counter = useCounterStore(); //状态管理
	const userShareLink=ref(0)
	const shareurlapi=ref(0)
	const bgsrc=ref(0)
	const change=(e)=>{
		if(e==1){
		
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
	const shareurl=ref([])
	const currentTry=ref(0)
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
				shareurlapi.value=shareurl.value[currentTry.value]
				bgsrc.value=shareurl.value[currentTry.value]+'/storage/Config/user/advertising01user.png'
				uni.setStorageSync('shareapi',shareurl.value[currentTry.value])
				userShareLink.value=encodeURI(shareurlapi.value+'/register?InvitationCode='+counter.user_id+'&title=易下注册'+'&shop_id='+counter.shop_id+'&group_id=1')
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
	.share_class{
		position:fixed;
		top:50%;
		left:50%;
		margin-top:-550rpx;
		margin-left:-300rpx;
		width:600rpx;
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
</style>

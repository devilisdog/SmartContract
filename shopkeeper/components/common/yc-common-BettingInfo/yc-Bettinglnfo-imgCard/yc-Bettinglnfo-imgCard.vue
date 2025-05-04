<template>
	<view class="card">
		
		
		<view style="font-weight:600;margin:10rpx 0rpx;">
			<text style="font-size:32rpx;">彩票照片（最多上传3张）</text>
			
		</view>
		<uni-notice-bar show-icon :scrollable="false" background-color="white" speed="35" text="为避免店铺被恶意投诉,拍票时请务必遮挡票面密码,站点号,地址,二维码等信息" color="#ff0000"/>
		<view>
			<uni-file-picker
				ref="img"
				limit="3" 
				file-mediatype='image' 
				title='' 
				size-type="compressed"
				@select="selectImg"
				file-extname="jpg,png,jpeg,JPG,PNG,JPEG,tiff,tif,TIFF,BMP,bmp,HEIF,HEIC,heic,heif"
				@delete="deleteImg"
				v-model="cacheImag"
				v-if="imageShow"
				:del-icon="delImageShow()"
			/>
		</view>
	</view>
</template>

<script setup>
	import {ref,onBeforeMount,reactive,getCurrentInstance,} from 'vue';
	import {useCounterStore} from '@/stores/counter'
	const {proxy,ctx} = getCurrentInstance()
	const counter = useCounterStore(); //状态管理
	const imageValue=reactive([])//暂时存放图片url
	const imagUuid=reactive([])//选中图片生成的uuid（暂时存放用于后续方便删除）
	const imageShow=ref(true)
	const cacheImag=reactive([])
	onBeforeMount(()=>{
		delImageShow()
		initImageData()
	})
	const selectImg=(e)=>{//用户选择图片后
		uni.showLoading({title:'上传中'})
		// console.log(counter.baseUrl)
		uni.uploadFile({
		    url:counter.baseUrl+'/api/common.Common/upload',
		    header:{server:1, "ba-user-token":counter.access_token},
		    filePath:e.tempFilePaths[0],
		    name:'file',
			formData:{"type":'TicketingImg',"name":counter.orderData.order_id},
		    success(res){
				uni.hideLoading()
				counter.orderData.ReturnImages=res.data.data.file
				uni.showToast({
					title:'图片上传成功~',
					icon:'none',
					position:'center'
				})
				imageShow.value=false
				setTimeout(()=>{
					initImageData()
				},300)
		    },
			fail(err) {
				uni.hideLoading()
				uni.showToast({
					title:'图片上传失败!',
					icon:'error'
				})
				proxy.$refs.img.clearFiles(imageValue.length)
			} 
		})
	}
	const deleteImg=(e)=>{//用户点击删除执行循环查找并删除
		var delUrl='/'+e.tempFilePath.split('//')[2]//删除的url
		uni.request({
			url:counter.baseUrl+'/api/shopkeeper.Order/SetOrderTicketImg',
			header:{server:1, "ba-user-token":counter.access_token},
			data:{
				"imgUrl":delUrl,
				"order_id":counter.orderData.order_id
			},
			success(res){
				if(res.data.code==1){
					uni.showToast({
						title:'删除成功~',
						icon:'none',
						position:'center'
					})
					counter.orderData.ReturnImages=res.data.data.data
					initImageData()
				}else{
					uni.showToast({
						title:'删除失败~',
						icon:'error',
						position:'center'
					})
					imageShow.value=false
					setTimeout(()=>{
						 initImageData()
					},300)
				}
			
			},
			fail(err){
				uni.showToast({
					title:'删除失败~',
					icon:'error',
					position:'center'
				})
				imageShow.value=false
				setTimeout(()=>{
					 initImageData()
				},300)
			}
		})
	}
	/*	是否显示删除按钮
		:del-icon = delImageShow
	*/
	const delImageShow=()=>{
		var orderDeaDate=new Date(counter.orderData.Deadline*1000)
		orderDeaDate.setHours(orderDeaDate.getHours()+1)
		var orderDeaTime=orderDeaDate.getTime()
		var nowTime=new Date().getTime()
		if(nowTime>orderDeaTime){
			return false
		}else{
			return true
		}
	}
	const initImageData=()=>{
		cacheImag.length=0
		//格式话image数据
		for(var i=0;i<counter.orderData.ReturnImages.length;i++){//初始化判断是否有彩票图片，如果有循环push到cacheImag作为默认数据
			var arr={"name":i+".jpg","extname":"png","url":counter.orderData.ReturnImages[i]}
			cacheImag.push(arr)
		}
		imageShow.value=true
	}
	
</script>

<style>
	.card{
		width:680rpx;
		padding:20rpx 20rpx;
		background-color: white;
		border-radius: 10rpx;
		margin: auto;
	}
</style>

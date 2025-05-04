<template>
	<view class="">
		<view class="statusBar"></view>
		<uni-nav-bar title="店铺认证" leftIcon="back" @clickLeft="back" leftText="返回" />
		<!-- 	<scroll-view scroll-y="true" :style="{height:common.scrollH()-99-statusBarHeight-statusBarHeight+'rpx'}">
				<view class="topHint">
					<text v-if="counter.shopBasicsData.ShopConfig.StoreCertification=='3'">申请遭拒绝:{{StoreCertificationMemo}}</text>
					<text v-else>您提交的资料仅用于核实店铺资料信息，审核过后平台将不会保留照片</text>
					
				</view>
				<uni-list>
					<uni-list-item title="经营类型" note="经营者于代销证一致的店铺">
						<template v-slot:footer>
							<text style="font-size:26rpx;color:#8a8a8a;">个体直营店</text>
						</template>
					</uni-list-item>
				</uni-list>
				<view class="butoonImg">
					<view style="imgBox" v-for="itme,index in imgSrc">
						<text>{{itme}}</text>
						<uni-file-picker
							:readonly="imgState"
							ref="img"
							:imageStyles="imageStyles" 
							file-mediatype="image" 
							limit="1"
							@select="uploading($event,index)"
							@delete="deleteImg(index)"
							v-model="completedImg[index]"
						/>
					</view>
				</view>
				<view style="padding:20rpx;">
					<view class="buttomStyle" @click="submit">{{counter.shopBasicsData.ShopConfig.StoreCertification=='3'?'重新提交':'提交'}}</view>
				</view>
			</scroll-view> -->
		<scroll-view scroll-x="true" class="navigation">
			<view style="display: flex;">
				<view v-for="itme,index in tita" :key="index" @click="dianji_qiehuan(index)" style="margin: auto;">
					<view class="box" :style="index==daohang_value?'color:#f04b49;':''">{{itme}}</view>
				</view>
				<view class="xiabiao" :style="daohang_value==1 ? 'left:495rpx;' : false">
				</view>
			</view>
		</scroll-view>
		<swiper @change="onChangeTab" :current="daohang_value" class="swipper"
			:style="{height:common.scrollH()-450-statusBarHeight+'rpx'}" duration="300">
			<swiper-item style="overflow-y: auto;">
				<view class="">
					<view class="topHint">
						<text
							v-if="counter.shopBasicsData.ShopConfig.StoreCertification=='3'">申请遭拒绝:{{StoreCertificationMemo}}</text>
						<text v-else>您提交的资料仅用于核实店铺资料信息，审核过后平台将不会保留照片</text>
					</view>
					<uni-list>
						<uni-list-item title="经营类型" note="经营者于代销证一致的店铺">
							<template v-slot:footer>
								<text style="font-size:26rpx;color:#8a8a8a;">个体直营店</text>
							</template>
						</uni-list-item>
					</uni-list>
					<view class="butoonImg">
						<view style="imgBox" v-for="itme,index in imgSrc">
							<text>{{itme}}</text>
							<uni-file-picker :readonly="imgState" ref="img" :imageStyles="imageStyles"
								file-mediatype="image" limit="1" @select="uploading($event,index)"
								@delete="deleteImg(index)" v-model="completedImg[index]" />
						</view>
					</view>
				</view>
			</swiper-item>
			<swiper-item style="overflow-y: auto;">
				<view class="topHint">
					<text
						v-if="counter.shopBasicsData.ShopConfig.StoreCertification=='3'">申请遭拒绝:{{StoreCertificationMemo}}</text>
					<text v-else>您提交的资料仅用于核实店铺资料信息，审核过后平台将不会保留照片</text>
				</view>
				<uni-list>
					<uni-list-item title="经营类型" note="经营者于代销证一致的店铺">
						<template v-slot:footer>
							<text style="font-size:26rpx;color:#8a8a8a;">个体直营店</text>
						</template>
					</uni-list-item>
				</uni-list>
				<view class="butoonvideo">
					<view style="imgBox">
						<text>视频认证</text>
						<uni-file-picker :readonly="videoState" ref="img" :imageStyles="imageStyles"
							file-mediatype="video" limit="1" @select="uploadingvideo($event)" @delete="deletevideo"
							v-model="completedvideo[0]" />
					</view>
				</view>
				<view class="showvideo" v-if="flgvideo">
					<text @click="govideo">查看视频</text>
				</view>
			</swiper-item>
		</swiper>
		<view style="padding:20rpx;">
			<view class="buttomStyle" @click="submit">
				{{counter.shopBasicsData.ShopConfig.StoreCertification=='3'?'重新提交':'提交'}}</view>
		</view>
	</view>
</template>

<script setup>
	import common from "@/common/common.js"
	import api from "@/common/vmeitime-http/mine/mine.js"
	import {
		useCounterStore
	} from '@/stores/counter'
	import {
		ref,
		reactive,
		getCurrentInstance,
		onBeforeMount,
	} from 'vue';


	const {
		proxy,
		ctx
	} = getCurrentInstance()
	const back = () => {
		uni.navigateBack()
	}
	const tita = reactive(['照片认证', '视频认证']) //分段器title数据
	const counter = useCounterStore(); //状态管理
	const imgState = ref(false) //是否已认证（true=获取到的照片只能看不能修改）
	const videoState = ref(false) //是否已认证（true=获取到的照片只能看不能修改）
	const imageStyles = reactive({
		width: "100%",
		height: "380rpx",
	})
	const flgvideo = ref(false)
	const imgSrc = reactive([ //循环数据
		'店铺门头照片',
		'代销证照片',
		// '手持代销证照片',
		'本人身份证照（国徽面）',
		'本人身份证照（人像面）',
		'手持身份证照片',
	])

	const StoreCertificationMemo = ref('')
	const upimgData = ref([])
	const uploading = (e, index) => { //图片上传
		uni.showLoading({
			title: '上传中~'
		})
		uni.uploadFile({
			url: counter.baseUrl + '/api/common.Common/upload2',
			header: {
				server: 1,
				"ba-user-token": counter.access_token
			},
			file: e.tempFilePaths[0],
			filePath: e.tempFiles[0].url,
			name: 'file',
			formData: {
				"type": 'StoreID',
				"name": index,
			},
			success(res) {
				console.log(JSON.parse(res.data))
				if (JSON.parse(res.data).code == 1) {
					if (counter.shopBasicsData.ShopConfig.StoreCertification == '3') {
						var arr = {
							"name": index + '.png',
							"extname": 'jpg',
							"url": JSON.parse(res.data).data.file
						}
						completedImg[index] = arr
						console.log(completedImg[index])

					} else {
						var arr = {
							"src": JSON.parse(res.data).data.file,
							"index": index
						}
						upimgData.value.push(arr)
					}
					uni.hideLoading()
					uni.showToast({
						title: '图片上传成功~',
						icon: 'none',
						position: 'center'
					})
				} else {
					uni.hideLoading()
					uni.showToast({
						title: JSON.parse(res.data).data,
						icon: 'error'
					})
					proxy.$refs.img.clearFiles(index)
				}
			},
			fail(err) {
				uni.showToast({
					title: '上传失败，请删除重试~',
					icon: 'error',
					position: "center"
				})
			}
		})
	}
	const govideo = () => {
		uni.navigateTo({
			url: '/pages/mimeSupPage/attestation/video?url=' + videourl.value
		})
	}
	const videourl = ref(0)
	const uploadingvideo = (e) => {
		uni.showLoading({
			title: '上传中~'
		})
		uni.uploadFile({
			url: counter.baseUrl + '/api/common.Common/upload2',
			header: {
				server: 1,
				"ba-user-token": counter.access_token
			},
			file: e.tempFilePaths[0],
			filePath: e.tempFiles[0].url,
			name: 'file',
			formData: {
				"type": 'StoreID',
				"name": 0,
			},
			success(res) {
				if (JSON.parse(res.data).code == 1) {
					videourl.value = counter.baseUrl + JSON.parse(res.data).data.file
					uni.hideLoading()
					flgvideo.value = true
				}
			},
			fail(err) {
				uni.showToast({
					title: '上传失败，请删除重试~',
					icon: 'error',
					position: "center"
				})
			}
		})
	}
	const deleteImg = (index) => { //删除图片
		for (var i = 0; i < upimgData.value.length; i++) {
			if (upimgData.value[i].index == index) {
				upimgData.value.splice(i, 1)
			}
		}
	}
	const deletevideo = () => {
		videourl.value = 0
		flgvideo.value = false
	}
	const completedImg = reactive([])
	const statusBarHeight = ref(0)
	const completedvideo = reactive([])
	const videourls = ref(0)
	onBeforeMount(() => {
		statusBarHeight.value = uni.getSystemInfoSync().statusBarHeight //获取手机状态栏高度
		api.GetStoreID({}).then((res) => {
			if (res.data.code == 1) {
				if (res.data.data.StoreIDType == "image") {
					daohang_value.value = 0
					counter.shopBasicsData.ShopConfig.StoreCertification = res.data.data.StoreCertification
				} else {
					daohang_value.value = 1
					counter.shopBasicsData.ShopConfig.StoreCertification = res.data.data.StoreCertification
				}
				if (res.data.data.StoreID != null) {
					if (res.data.data.StoreIDType == "image") {
						for (var q = 0; q < res.data.data.StoreID.length; q++) {
							var newArr = {
								"name": q + ".png",
								"extname": 'jpg',
								"url": counter.baseUrl + res.data.data.StoreID[q].src + '?_' +
									new Date().getTime(),
							}
							completedImg.push(newArr)

						}
						if (res.data.data.StoreCertification == 2) {
							imgState.value = false
						} else if (res.data.data.StoreCertification == 3) {
							imgState.value = false
						} else if (res.data.data.StoreCertification == 0) {
							imgState.value = false
						} else {
							imgState.value = true
						}
						flgvideo.value = false
					} else {
						for (var q = 0; q < res.data.data.StoreID.length; q++) {
							var newArr = {
								"name": q + ".pm4",
								"extname": 'mp4',
								"url": res.data.data.StoreID[q].src,
							}
							completedvideo.push(newArr)

						}
						videourl.value = res.data.data.StoreID[0].src
						if (res.data.data.StoreCertification == 2) {
							videoState.value = false
						} else if (res.data.data.StoreCertification == 3) {
							videoState.value = false
						} else if (res.data.data.StoreCertification == 0) {
							videoState.value = false
						} else {
							videoState.value = true
						}
						// videoState.value=res.data.data.StoreCertification==3?false:true
						// videoState.value=res.data.data.StoreCertification==2?false:true
						// videoState.value=res.data.data.StoreCertification==0?false:true
						flgvideo.value = true

					}
				} else {

				}

			} else {
				if (counter.shopBasicsData.ShopConfig.StoreCertification != '0') {
					for (var q = 0; q < res.data.data.StoreID.length; q++) {
						var newArr = {
							"name": q + ".png",
							"extname": 'jpg',
							"url": counter.baseUrl + res.data.data.StoreID[q].src + '?_' + new Date()
								.getTime(),
						}
						completedImg.push(newArr)
					}
				}

				if (counter.shopBasicsData.ShopConfig.StoreCertification == '3') {
					StoreCertificationMemo.value = res.data.data.StoreCertificationMemo

				}
				imgState.value = counter.shopBasicsData.ShopConfig.StoreCertification == '2' ? true : false


			}
		})
	})


	const submit = () => { //提交
		if (imgState.value == false && videoState.value == false) {
			if (flgtype.value == "image") {
				uni.showLoading({
					title: '加载中~'
				})
				// console.log(upimgData.value,completedImg);
				for (var q = 0; q < completedImg.length; q++) {
					var newArr = {
						"src": completedImg[q].url.replace('https://www.cai8cai8.top/', '').replace(
							'https://api.zbqjc.com/', ''),
						"index": completedImg[q].name.substring(0, 1),
					}
					upimgData.value.push(newArr)
				}
				api.PostStoreID({
					"imgs": trimSpace(upimgData.value),
					"type": 'image'
				}).then((res) => {
					uni.hideLoading()
					if (res.data.code == 1) {
						uni.showToast({
							title: '提交成功~',
						})
						// setTimeout(()=>{
						// 	uni.showToast({
						// 		title:'审核中，请耐心等待~',
						// 		icon:'none',
						// 		position:'center',
						// 		duration:2000
						// 	})
						// },1500)
						imgState.value = true
						counter.shopBasicsData.ShopConfig.StoreCertification = '2'

					} else {
						uni.showToast({
							title: res.data.data,
							icon: "error"
						})
					}
				})
			} else {
				api.PostStoreID({
					"imgs": [{
						'index': 0,
						'src': videourl.value
					}],
					"type": 'video'
				}).then((res) => {
					uni.hideLoading()
					if (res.data.code == 1) {
						uni.showToast({
							title: '提交成功~',
						})
						// setTimeout(()=>{
						// 	uni.showToast({
						// 		title:'审核中，请耐心等待~',
						// 		icon:'none',
						// 		position:'center',
						// 		duration:2000
						// 	})
						// },1500)
						videoState.value = true
						counter.shopBasicsData.ShopConfig.StoreCertification = '2'
					} else {
						uni.showToast({
							title: res.data.data,
							icon: "error"
						})
					}
				})
			}
			// console.log(upimgData.value);

		} else {
			uni.showToast({
				title: '已提交资料~请耐心等待审核！',
				icon: "none",
				position: 'center',
				duration: 3000
			})
		}

	}

	function trimSpace(array) {
		for (var i = 0; i < array.length; i++) {
			if (array[i] == "" || array[i] == null || typeof(array[i]) == "undefined") {
				array.splice(i, 1);
				i = i - 1;
			}
		}
		return array;
	}
	const daohang_value = ref(0)
	const flgtype = ref('image')
	const dianji_qiehuan = (index) => { //点击切换导航
		if (daohang_value == index) {
			return
		} else {
			daohang_value.value = index
		}
		if (index == 0) {
			flgtype.value = "image"
		} else {
			flgtype.value = "video"
		}
	}
	const onChangeTab = (e) => { //滑动导航栏跟随
		dianji_qiehuan(e.detail.current)
	}
</script>

<style>
	.buttomStyle {
		width: 100%;
		height: 80rpx;
		background-color: #FDC830;
		border-radius: 15rpx;
		text-align: center;
		line-height: 80rpx;
		color: white;
		margin: 20rpx 0rpx;
	}

	.imgBox {
		border: 1rpx solid;
		display: flex;
		flex-flow: column;
		align-items: center;
		justify-content: center;
	}

	.butoonvideo {
		/* display:grid;
		grid-template-columns:repeat(2,320rpx);
		grid-template-rows: repeat(3,400rpx);
		grid-row-gap:20rpx;
		margin:20rpx 0rpx;
		justify-content: space-around; */
		text-align: center;
		font-size: 26rpx;
		width: 100%;
		height: 300rpx;
	}

	.butoonImg {
		display: grid;
		grid-template-columns: repeat(2, 320rpx);
		grid-template-rows: repeat(3, 400rpx);
		grid-row-gap: 20rpx;
		margin: 20rpx 0rpx;
		justify-content: space-around;
		text-align: center;
		font-size: 26rpx;
	}

	.topHint {
		padding: 15rpx;
		/* background-color: antiquewhite; */
		font-size: 26rpx;
	}

	.statusBar {
		width: 100%;
		height: var(--status-bar-height);
		background-color: white;
	}

	.navigation {
		height: 80rpx;
		margin: 0 auto;
		/* 	background-color: #fff; */
		margin-top: 25rpx;
	}

	.xiabiao {
		position: absolute;
		width: 130rpx;
		height: 3rpx;
		background-color: #f04b49;
		/* z-index: -1; */
		border-radius: 50rpx;
		top: 40rpx;
		left: 125rpx;
		transition: .3s;
	}

	.showvideo {
		margin: 0 auto;
		text-align: center;
		text-decoration: underline;
	}
</style>
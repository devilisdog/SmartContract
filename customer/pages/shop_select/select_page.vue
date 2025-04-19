<template>
	<z-paging ref="shop_list" @query="shop" v-model="shopListData">
		<template v-slot:top>
			<view class="status_bar" />
			<uni-nav-bar title="店铺选择" left-icon="back" left-text="返回" @clickLeft="back"></uni-nav-bar>
		</template>
		<view class="shop_card" v-for="itme,index in shopListData" @click="select_Card(index,itme)">
			<view class="shop_logo">
				<image :src="itme.avatar" mode="scaleToFill"></image>
			</view>
			<view class="shop_card_left">
				<view class="left_lef">
					<text style="font-size:32rpx;font-weight: bold;">{{itme.nickname}} ({{'ID:'+itme.id}})</text>
					<text style="color:red;">所剩余额：{{itme.money}}</text>
				</view>
				<view class="left_rigth">
					<view class="select_style_box">
						<view class="select" v-show="selectIndex==index"></view>
					</view>
				</view>
			</view>
		</view>
		<template v-slot:bottom>
			<view class="bottom_buttonBox">
				<view class="buttomStyle" @click="add_shop">添加店铺</view>
			</view>
		</template>
	</z-paging>
	<fui-dialog :show="dialogShow" content="确定切换店铺吗？账户余额是随着店铺切换而切换的喔~" @click="clicklogOut($event,'show')" />
	<uni-popup ref="shop_id_select" type="dialog">
		<uni-popup-dialog mode="input" placeholder="请输入店铺ID" @confirm="dialog_confirm"></uni-popup-dialog>
	</uni-popup>
</template>

<script setup>
	import {
		useCounterStore
	} from '@/stores/counter'
	import api from "@/common/vmeitime-http/index.js"
	import {
		onBackPress
	} from "@dcloudio/uni-app"
	import common from "@/common/common.js"
	import {
		onBeforeMount,
		ref,
		reactive,
		getCurrentInstance
	} from 'vue';
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	const counter = useCounterStore(); //状态管理
	const selectIndex = ref(0) //用户卡片选择值
	const shopListData = ref([]) //shop列表数据
	const dialogShow = ref(false) //对话框显示控制
	const selectData = ref({}) //用户点击卡片的数据
	const buttonBoole = ref(false)
	const clicklogOut = (e) => { //对话框按钮操作
		if (e.index == 1) { //点击确定
			uni.showLoading({
				title: '切换中~'
			})
			uni.request({
				url: counter.baseUrl + '/api/bettingend.mine.ShopWink/ShopCut',
				header: {
					'server': '1',
					'ba-user-token': counter.access_token
				},
				data: {
					"shop_id": selectData.value['clickData'].id
				},
				success(res) {
					dialogShow.value = false
					uni.hideLoading()
					if (res.data.code == 1) {
						selectIndex.value = selectData.value['clickIndex']
						uni.showToast({
							title: res.data.data,
							icon: res.data.msg,
						})
						common.getUserInfo() //获取最新用户信息
						uni.closeSocket();
					} else {
						uni.showToast({
							title: res.data.data,
							icon: res.data.msg
						})
					}
				},
				fail(err) {
					uni.showToast({
						title: '切换失败，请稍后再试~',
						icon: 'error',
						position: 'center'
					})
				}
			})
		} else { //取消
			dialogShow.value = false
		}
	}

	const select_Card = (index, data) => { //点击卡片选择
		if (selectIndex.value != index) {
			var newOjb = {
				clickIndex: index,
				clickData: data
			}
			selectData.value = newOjb
			dialogShow.value = true
		}
	}

	const shop = () => { //获取shop列表
		if (!buttonBoole.value) {
			uni.request({
				url: counter.baseUrl + '/api/bettingend.mine.ShopWink/list',
				header: {
					'server': '1',
					'ba-user-token': counter.access_token
				},
				success(res) {
					buttonBoole.value = true
					proxy.$refs.shop_list.complete(res.data.data)
					initSelectIndex(res.data.data)
				},
				fail() {
					proxy.$refs.shop_list.complete(false)
				}
			})
		}
	}

	const add_shop = () => {
		proxy.$refs.shop_id_select.open()
	}

	const dialog_confirm = (e) => {
		if (e != '' && !isNaN(Number(e))) {
			uni.request({
				url: counter.baseUrl + '/api/bettingend.mine.ShopWink/AddShop',
				header: {
					'server': '1',
					'ba-user-token': counter.access_token
				},
				data: {
					"shop_id": e
				},
				success(res) {
					uni.showToast({
						title: res.data.data,
						icon: res.data.msg
					})
					proxy.$refs.shop_list.refresh()
				},
				fail(err) {
					proxy.$refs.shop_list.refresh()
					uni.showToast({
						title: '新增失败~请稍后再试',
						icon: 'error',
						position: 'center'
					})
				}
			})
		}
	}

	const initSelectIndex = (data) => { //拿到数据查找默认值选择
		for (var i = 0; i < data.length; i++) {
			if (data[i].id == counter.shop_id) {
				selectIndex.value = i
				return
			}
		}
	}

	onBackPress(() => { //手机系统返回拦截
		back()
		return true
	})

	const back = () => {
		uni.switchTab({
			url: '/pages/main/main'
		})
	}
</script>

<style lang="scss">
	.shop_card_left {
		flex: 1;
		display: flex;
		justify-content: space-between;

		.left_rigth {
			display: flex;
			align-items: center;

			.select_style_box {
				border: 1rpx solid #d1d1d1;
				border-radius: 50rpx;
				width: 30rpx;
				height: 30rpx;
				display: flex;
				align-items: center;
				justify-content: center;

				.select {
					width: 25rpx;
					height: 25rpx;
					background-color: #202736; 
					border-radius: 50rpx;
					animation: showLayer 0.2s linear both;
				}
			}
		}

		.left_lef {
			display: flex;
			flex-flow: column;
			justify-content: space-around;
			margin-left: 10rpx;
		}
	}

	.shop_logo {
		image {
			width: 120rpx;
			height: 120rpx;
			border-radius: 10rpx;
		}
	}

	.shop_card {
		width: 680rpx;
		padding: 20rpx;
		border-radius: 15rpx;
		background-color: white;
		margin: 20rpx auto;
		box-shadow: 0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.4);
		display: flex;

	}

	.bottom_buttonBox {
		width: 100%;
		padding: 20rpx;
		position: fixed;
		bottom: 0;
		box-sizing: border-box;
		z-index: 99;

		.buttomStyle {
			width: 100%;
			height: 80rpx;
			background-color: #202736; 
			border-radius: 15rpx;
			text-align: center;
			line-height: 80rpx;
			color: white;
		}
	}
</style>
<style>
	.status_bar {
		background-color: #fff;
		height: var(--status-bar-height);
		width: 100%;
	}

	body {
		background-color: #fbfbfb;
	}
</style>
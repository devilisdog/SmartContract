<template>
	<image src="@/static/img/logo.png" class="imageStyle"></image>
	<view class="execute_box">
		<image src="@/static/img/custom_Loading.png" class="loadingStyle" v-show="loadingShow"></image>
		<text>{{executeState}}</text>
	</view>
	<view class="versions_box">
		<text>当前版本：{{nowVersions}}</text>
	</view>
	<qw-updaters ref="updaters"></qw-updaters>
</template>

<script setup>
	import api from "@/common/vmeitime-http/index/index.js"
	import { useCounterStore } from '@/stores/counter'
	import {onShow} from "@dcloudio/uni-app"
	import {onBeforeMount,ref,reactive,getCurrentInstance} from 'vue';
	const {proxy,ctx} = getCurrentInstance()
	const executeState=ref('')
	const loadingShow=ref(true)
	const nowVersions=ref('web')//当前版本昵称
	const webVersions=ref(2225)//web版本
	const counter = useCounterStore();//状态管理数据
	onBeforeMount(()=>{
		// #ifdef APP-PLUS
		plus.runtime.getProperty(plus.runtime.appid,function(inf){
			nowVersions.value=inf.version
			appInit(inf.versionCode)
		})//获取当前昵称
		// #endif
		
		// #ifdef H5
		executeState.value='正在检测是否新版本~'
		api.GatVersion({}).then(res=>{
			var veresion_span=Number(res.data.data.Store.latest_version)
			
			if(veresion_span>webVersions.value){
				// location.reload()//刷新页面
			}
			getUserInfo()
			
		})
		// #endif
	})
	const appInit=(nowVersionCode)=>{//执行方法
		executeState.value='正在检测是否新版本~'
		api.GatVersion({}).then(res=>{
			var veresion_span=Number(res.data.data.Store.latest_version)-Number(nowVersionCode)//版本跨度
			
			if(veresion_span<=0){
				getUserInfo()
				return
			}else{
				veresion_judge(veresion_span,res.data.data)
			}
		})
		
	}
	const veresion_judge=(veresion_span,veresion_info)=>{
		if(veresion_span<2){//如与服务器版本相差一个版本直接按照服务器给的更新方式更新，
			if(veresion_info.isHotUpdata=="true"){//是否热跟新
				executeState.value='正在下载新版本~'
				plus.downloader.createDownload(
					veresion_info.Store.shop_hotupdata,{filename:'_doc/update/'},function(d,state){
						if(state==200){
							resourceNew(d.filename)
						}else{
							loadingShow.value=false
							executeState.value="安装包下载失败！请关闭APP重试~";
						}
					},
				).start()
			}else{//整包更新
				loadingShow.value=false
				executeState.value="";
				if(uni.getSystemInfoSync().platform=='ios'){
					uni.showModal({
						title:'提示',
						content:veresion_info.Store.update_text,
						confirmText:'去下载',
						showCancel:false,
						success: function (ress) {
							plus.runtime.openURL(encodeURI(veresion_info.Store.latest_download_ios))
						}
					});
				}else{
					proxy.$refs.updaters.checkVersion({
						name: '重大版本更新，需要整包安装~', // 标题 非必填
						content: veresion_info.Store.update_text, // 更新内容  非必填
						version: veresion_info.Store.latest_version_name, // 版本名称  非必填
						version_code: veresion_info.Store.version, // 版本号  必填
						device: 'android', // android|ios 暂时非必填
						is_wgt: 0, // 是否资源包更新  非必填
						apple_id: '', // IOS 跳转的需要 非必填
						url: veresion_info.Store.latest_download_android, // 最新包地址
						constraintQu:true//是否强制跟新
					})
				}
			}
		}else{
			loadingShow.value=false
			executeState.value="";
			if(uni.getSystemInfoSync().platform=='ios'){
				uni.showModal({
					title:'提示',
					content:'版本与最新跨度过大，请重新下载App，建议跳转后卸载原有app',
					confirmText:'去下载',
					showCancel:false,
					success: function (ress) {
						plus.runtime.openURL(encodeURI(veresion_info.Store.latest_download_ios))
					}
				});
			}else{
				proxy.$refs.updaters.checkVersion({
					name: '版本更新', // 标题 非必填
					content: '版本与最新版跨度较大，请整包跟新', // 更新内容  非必填
					version: veresion_info.Store.latest_version_name, // 版本名称  非必填
					version_code: veresion_info.Store.version, // 版本号  必填
					device: 'android', // android|ios 暂时非必填
					is_wgt: 0, // 是否资源包更新  非必填
					apple_id: '', // IOS 跳转的需要 非必填
					url: veresion_info.Store.latest_download_android, // 最新包地址
					constraintQu:true//是否强制跟新
				})
			}
		}
	}
	
	const resourceNew=(path)=>{//wgt安装
		executeState.value='正在安装新版本~'
		plus.runtime.install(path,{force:true},function(){
			 plus.nativeUI.alert("新版本已下载完成，重启更新！",function(){plus.runtime.restart()});  
		},function(e){
			executeState.value='安装文件失败,请联系店主反馈~'
			plus.nativeUI.alert("安装文件失败["+e.code+"]："+e.message);  
		})
	}
	const getUserInfo=()=>{//获取用户信息
		executeState.value='正在获取用户信息~'
		
		api.GetUserDataInfo().then(res=>{
			if (res.data.code != 1) {
				loadingShow.value=false
				executeState.value="获取信息失败，请联系店主反馈";
				return
			}
			uni.setStorageSync('access_shop_token', res.data.data.userinfo.token); //物理缓存用户token
			counter.access_token = res.data.data.userinfo.token //登录生成的token
			counter.refresh_token = res.data.data.userinfo.refreshToken //长期令牌用来刷新
			if(res.data.data.appIsOpen.shop.value=='true'){//系统关闭拦截
				uni.showModal({
					title:'注意',
					content:res.data.data.appIsOpen.shop.content,
					confirmText:'退出',
					showCancel:false,
					success: function(res_two) {
						uni.hideTabBar()
						switch (uni.getSystemInfoSync().platform) {
							case 'android':
								plus.runtime.quit();
							break;
							case 'ios':
								plus.ios.import('UIApplication').sharedApplication().performSelector('exit');
							break;
						}
					}
				});
				return
			}
			counter.hasLogin = true //登录状态（true登录/false登出)
			counter.appOpen=res.data.data.appIsOpen.shop
			
			
			
			if (res.data.data.userinfo.group_id == 3) {//判断是否是员工登录
				counter.shopBasicsData = res.data.data.clerkInfo.ShopInfo //店主的基础信息
				
				counter.isneedimgnumber = res.data.data.clerkInfo.ShopConfig.isneedimgnumber //店主的基础信息
				counter.staffLoginInfo = res.data.data.clerkInfo
			}else{
				counter.shopBasicsData = res.data.data.userinfo //店主的基础信息
				
				counter.isneedimgnumber = res.data.data.userinfo.ShopConfig.isneedimgnumber //店主的基础信息
			}
			
			if(counter.shopBasicsData.group_id == 2 && counter.shopBasicsData.ShopConfig.StoreCertification == 0){
				//判断店铺是否已认证
				uni.showModal({
					title: '注意',
					content: '检测到此店铺未进行认证，未认证会导致部分功能无法使用！',
					confirmText: '去认证',
					success: function(res) {
						if (res.confirm) {
							uni.navigateTo({
								url: '/pages/mimeSupPage/attestation/shopArresrarion',
								animationType: "slide-in-bottom"
							})
						}
					}
				});
			}
			loadingShow.value=false
			uni.reLaunch({url:'/pages/index/mine'})
		})
	}
</script>

<style lang="scss">
	.versions_box{
		width: 100%;
		position: fixed;
		bottom:20rpx;
		text-align: center;
		color:#a7a7a7;
	}
	.loadingStyle{
		width:40rpx;
		height:40rpx;
		animation: rotate 1s linear infinite;
		margin-right:20rpx;
	}
	@keyframes rotate {
	  from { transform: rotate(0deg) }
	  to   { transform: rotate(-360deg)}
	}
	.execute_box{
		width:100%;
		height:200rpx;
		// background-color: salmon;
		position: fixed;
		top:50%;
		display: flex;
		align-items: center;
		justify-content: center;
		color:#a7a7a7;
	}
	.imageStyle{
		width:280rpx;
		height:280rpx;
		position:fixed;
		top:calc(20% - 140rpx);
		left:calc(50% - 140rpx);
	}
</style>

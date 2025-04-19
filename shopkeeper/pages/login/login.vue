<template>
	<view class="status_bar"></view>
	<!-- 导航栏 -->
	<uni-nav-bar title="店主员工登录" left-icon="left" left-text="返回" @clickLeft="back"></uni-nav-bar>
	<view class="login_type_box">
		<!-- <view :class="login_value==0?'type_buttom_true':'type_buttom'" @click="login_value=0;valiFormData.password='';valiFormData.captcha=''">
			密码登录
		</view> -->
		<!-- <view :class="login_value==1?'type_buttom_true':'type_buttom'" @click="login_value=1;valiFormData.password='';valiFormData.captcha=''">
			手机登录
		</view> -->
		<!-- <view :class="login_value==2?'type_buttom_true':'type_buttom'" @click="login_value=2;valiFormData.password='';valiFormData.captcha=''">
			邮箱登录
		</view> -->
	</view>
	<view class="example"><!-- 基础表单校验 -->
		<uni-forms ref="valiForm" :modelValue="valiFormData" label-position="top">
			<uni-forms-item label="账号" required name="account">
				<uni-easyinput v-model="valiFormData.account" placeholder="请输入手机或注册邮箱" />
			</uni-forms-item>
			<uni-forms-item label="密码" required name="password" v-if="login_value==0">
				<uni-easyinput v-model="valiFormData.password" type="password" placeholder="请输入密码" />
			</uni-forms-item>
			<uni-forms-item label="验证码" required name="mailCode" v-show="login_value==1 || login_value==2">
				<view class="codeBox">
					<uni-easyinput  :placeholder="login_value==1?'请输入手机验证码':'请输入邮箱验证码'" 
						v-model="valiFormData.captcha" trim="all"
					/>
					<view 
					:class="typeof(codeNumber)=='string' && checkAll(valiFormData.account)?'codeButton':'codeButtonFalse'" 
					@click="gainCode"
					>
						{{codeNumber}}
					</view>
				</view>
			</uni-forms-item>
			<view style="display: flex;" v-if="login_value==0">
				<view class="formStyle">
					<uni-easyinput placeholder="请输入验证码" v-model="valiFormData.captcha" />
				</view>
				<view style="margin-left:10rpx;">
					<QS-image
						:imageUrl="reloadData+keyData" 
						width="200rpx" 
						height="72rpx"
						@click="reload"
					/>
				</view>
			</view>
		</uni-forms>
		<view class="buttomStyle" @click="submit('valiForm')">提交</view>
		<view class="box">
			<checkbox-group @change='clickLong'>
				<checkbox style="color:#909399;transform:scale(0.8)" color="#FDC830" value="login" :checked="longLogin">保持登录</checkbox>
				<checkbox style="color:#909399;transform:scale(0.8)" color="#FDC830" value="save" :checked='saveBoole'>保存账号</checkbox>
			</checkbox-group>
			
		</view>
		<view class="" style="display: flex;justify-content: space-around;margin-top: 20rpx;">
		
				
					<text style="color:#FDC830;font-weight:bold;" @click="registerPage(1)">忘记密码</text>
					<text style="color:#FDC830;font-weight:bold;" @click="registerPage(2)">立即注册</text>
			
				
		
		</view>
	</view>
	<view class="agreement">
		<text style="color:#909399;">登录即代表您已阅读并同意</text>
		<view style="font-weight:bold;">
			<text style="color:#FDC830;">《用户协议》</text>
			<text style="color:#909399;">和</text>
			<text style="color:#FDC830;">《隐私权协议》</text>
		</view>
	</view>
</template>

<script setup>
	import api from "@/common/vmeitime-http/index/index.js"
	import {useCounterStore} from '@/stores/counter'
	import { onShow } from '@dcloudio/uni-app';
	import {ref,reactive,onBeforeMount,getCurrentInstance} from "vue";
	const {proxy,ctx} = getCurrentInstance()
	const valiFormData = reactive({
		account: '' ,
		password: '',
		captcha:'',
		
	})
	const counter = useCounterStore(); //状态管理
	const reloadData=ref(uni.getStorageSync('api')+'/api/common/captcha?server=1&id=')//验证码url
	const login_value=ref(0)
	onBeforeMount(()=>{
		if(uni.getStorageSync('shop_access')!=''){
			valiFormData.account=uni.getStorageSync('shop_access')
			saveBoole.value=true
		}
		
		reload()
	})
	const valiForm = ref(null)
	const registerPage=(e)=>{//点击注册
		if(e==1){
			uni.navigateTo({
				url:'/pages/login/forgetThePassword',
				animationType:'slide-in-bottom'
			})
		}else if(e==2){
			uni.navigateTo({
				url:'/pages/login/register',
				animationType:"slide-in-bottom"
			})
		}else{
			// uni.navigateTo({
			// 	url:'/pages/mimeSupPage/goflychat',
			// 	animationType:"slide-in-bottom"
			// })
			// #ifdef H5
			if(uni.getStorageSync('access_shop_token')){
				let herf = 'https://kf.zbqjc.com' + '/index/index/home?groupid=1&business_id=1&special=3&avatar=' + counter.shopBasicsData.avatar + '&visiter_id=' + counter.shopBasicsData.id + '&visiter_name=' +
					counter.shopBasicsData.id + counter.shopBasicsData.nickname
					window.open(herf)
			}else{
				let herf = 'https://kf.zbqjc.com' + '/index/index/home?groupid=1&business_id=1&special=3&avatar=' + '' + '&visiter_id=' + ''+ '&visiter_name=' +''
				window.open(herf)
			}
			// #endif
			
			// #ifdef APP
			if(uni.getStorageSync('access_shop_token')){
				let herf = 'https://kf.zbqjc.com' + '/index/index/home?groupid=1&business_id=1&special=3&avatar=' + counter.shopBasicsData.avatar + '&visiter_id=' + counter.shopBasicsData.id + '&visiter_name=' +
					counter.shopBasicsData.id + counter.shopBasicsData.nickname
					plus.runtime.openURL(herf)
			}else{
				let herf = 'https://kf.zbqjc.com' + '/index/index/home?groupid=1&business_id=1&special=3&avatar=' + '' + '&visiter_id=' + ''+ '&visiter_name=' +''
				plus.runtime.openURL(herf)
			}
			// #endif
		}
	}
	function back() {
		if(counter.hasLogin==true){
			uni.switchTab({
				url:'/pages/index/mine'
			})
		}else{
			uni.showToast({
				title:'未登录不可进入软件~',
				position:'center',
				icon:"error"
			})
		}
	}
	const checkAll=(data)=>{
		if(login_value.value==1){
			var myreg=/^[1][3,4,5,6,7,8,9][0-9]{9}$/;
			if (!myreg.test(data)) {
				return false;
			} else {
				return true;
			}
		}else{
			return RegExp(/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/).test(data);
		}
	}
	const reload=()=>{
		reloadData+getRandomString(20)
		valiFormData.captcha=null
	}
	const longLogin=ref(true)
	const saveBoole=ref(false)
	const clickLong=(e)=>{//底部多选框
		var initArr=["save","login"]
		initArr.forEach((item,index)=>{
			if(e.detail.value.indexOf(item)!=-1 && item=="save"){
				uni.setStorageSync('shop_access',valiFormData.account)
			}else if(e.detail.value.indexOf(item)==-1 && item=="save"){
				uni.removeStorageSync('shop_access')
			}else if(e.detail.value.indexOf(item)!=-1 && item=="login"){
				longLogin.value=true
			}else{
				longLogin.value=false
			}
		})
	}
	const codeNumber=ref('获取验证码')//验证码按钮显示内容
	const setTime=ref(null)//定时器ref
	const gainCode=()=>{//发送验证码
		uni.showLoading({title:'发送中~',mask:true})
		if(login_value.value==2){
			api.send({'email':valiFormData.account,'event':'phone_captcha'}).then(res=>{
				uni.hideLoading()
				if(res.data.code==1){
					uni.showToast({title:'已发送验证码~',position:'center',icon:'none'})
					//验证码按钮点击事件
					codeNumber.value=60
					setTime.value=setInterval(function(){
						codeNumber.value--
						if(codeNumber.value==0){
							clearInterval(setTime.value)
							setTime.value=null
							codeNumber.value='获取验证码'
						}
					},1000)
				}else{
					uni.showToast({title:res.data.data,icon:'none',position:'center'})
				}
			})
		}else{
			api.PhoneSend({'phone':valiFormData.account,'event':'phone_captcha'}).then(res=>{
				uni.hideLoading()
				if(res.data.code==1){
					uni.showToast({title:'已发送验证码~',position:'center',icon:'none'})
					//验证码按钮点击事件
					codeNumber.value=60
					setTime.value=setInterval(function(){
						codeNumber.value--
						if(codeNumber.value==0){
							clearInterval(setTime.value)
							setTime.value=null
							codeNumber.value='获取验证码'
						}
					},1000)
				}else{
					uni.showToast({title:res.data.data,icon:'none',position:'center'})
				}
			})
		}
		
	}
	
	const submit=()=>{//登录
		uni.showLoading({title:'登录中',mask:true})
		api.Login({
			"username":valiFormData.account,
			"password":valiFormData.password,
			"captcha":valiFormData.captcha,
			"captchaId":keyData.value,
			"keep":longLogin.value,
			"machine_type":uni.getSystemInfoSync().platform
		}).then((res_data)=>{
			uni.hideLoading()
			if(res_data.data.code === 1){
				// if(res_data.data.data.appIsOpen.shop.value=='true'){//系统关闭拦截
				// 	uni.showModal({
				// 		title:'注意',
				// 		content:res_data.data.data.appIsOpen.shop.content,
				// 		confirmText:'退出',
				// 		success: function(res_two) {
				// 			uni.hideTabBar()
				// 			if(res_two.confirm){
				// 				switch (uni.getSystemInfoSync().platform) {
				// 				    case 'android':
				// 				        plus.runtime.quit();
				// 				    break;
				// 				    case 'ios':
				// 				        plus.ios.import('UIApplication').sharedApplication().performSelector('exit');
				// 				    break;
				// 				}
				// 			}
				// 		}
				// 	});
				// }
				if(res_data.data.data.userinfo.group_id==2 || res_data.data.data.userinfo.group_id==3){
					uni.showToast({title:res_data.data.msg,icon:'success'})
					uni.setStorageSync('access_shop_token',res_data.data.data.userinfo.token);//物理缓存用户token
					uni.setStorageSync('refresh_shop_token',res_data.data.data.userinfo.refreshToken);//长期令牌用来刷新
					counter.access_token=res_data.data.data.userinfo.token//登录生成的token
					counter.refresh_token=res_data.data.data.userinfo.refreshToken//长期令牌用来刷新
					counter.hasLogin = true//登录状态（true登录/false登出)
					counter.shopBasicsData=res_data.data.data.userinfo//店主的基础信息
					if(res_data.data.data.userinfo.group_id==3){//判断是否是员工登录
						counter.staffLoginInfo=res_data.data.data.clerkInfo
					}
					back()
					reload()
				}else{
					uni.showToast({
						title:'该账号为店主账号,请重新注册',
						icon:'error'
					})
					reload()
				}
			}else{
				reload()
				uni.showToast({
					title:res_data.data.msg,
					icon:'error',
				})
				
			}
		})
	}
	
	const keyData=ref('')//存储验证码的密钥
	/**
	 * 随机生成字符串
	 * @param len 指定生成字符串长度
	 */
	function getRandomString(len){
	    let _charStr = 'abacdefghjklmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ0123456789',
	        min = 0, 
	        max = _charStr.length-1, 
	        _str = '';    //定义随机字符串 变量
			
	    //判断是否指定长度，否则默认长度为15
	    len = len || 15;
	    //循环生成字符串
	    for(var i = 0, index; i < len; i++){
	        index = (function(randomIndexFunc, i){         
	                    return randomIndexFunc(min, max, i, randomIndexFunc);
	                })(function(min, max, i, _self){
	                    let indexTemp = Math.floor(Math.random()*(max-min+1)+min),
	                        numStart = _charStr.length - 10;
	                    if(i==0&&indexTemp >=numStart){
	                        indexTemp = _self(min, max, i, _self);
	                    }
	                    return indexTemp ;
	                }, i);
	        _str += _charStr[index];
	    }
		keyData.value=_str
	    return _str;
	}

</script>




<style lang="scss">
	.codeBox{
		display: flex;
		align-items: center;
		.codeButton{
			background-color:#FDC830;
			color: white;
			width:200rpx;
			margin-left:10rpx;
			height:70rpx;
			text-align: center;
			line-height:70rpx;
			border-radius:10rpx;
			transition: .3s;
		}
		.codeButtonFalse{
			background-color:#cccccc;
			color:#efefef;
			width:200rpx;
			margin-left:10rpx;
			height:70rpx;
			text-align: center;
			line-height:70rpx;
			border-radius:10rpx;
			transition: .3s;
			pointer-events: none;
		}
	}
	.login_type_box{
		display: flex;
		justify-content:space-around;
		width:100%;
		padding:20rpx 0;
		box-sizing: border-box;
		.type_buttom{
			width:230rpx;
			height:75rpx;
			border-radius:20rpx;
			background-color: #dfdfdf;
			text-align: center;
			line-height:75rpx;
			color:#565656;
		}
		.type_buttom_true{
			width:230rpx;
			height:75rpx;
			border-radius:20rpx;
			background-color: #FDC830;
			text-align: center;
			line-height:75rpx;
			color:white;
			font-weight: bold;
			transition: all 0.3s;
		}
	}
	.agreement{
		display: flex;
		flex-direction: column;
		text-align: center;
		bottom: 40rpx;
		width:100%;
		position: absolute;
	}
	.box{
		display: flex;
		align-items: center;
		justify-content: end;
	}
	.buttomStyle{
		width:100%;
		height:80rpx;
		background-color:$kataer-shop-color;
		border-radius:15rpx;
		text-align: center;
		line-height:80rpx;
		color: white;
		margin:20rpx 0rpx;
	}
	.formStyle{
		height:70rpx;
		display: flex;
		flex:1;
	}
	text {
		font-size: 24rpx;
	}
	body{
		background-color:#f3f3f3;
	}

	.example {
		width:680rpx;
		padding:20rpx;
		margin:10rpx auto;
		background-color:white;
		border-radius:15rpx;
	}
	.status_bar{
		background-color: #fff;
		height: var(--status-bar-height);
		width: 100%;
	}
</style>

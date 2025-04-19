<template>
	<view class="status_bar"></view>
	<uni-nav-bar title="账号设置" leftIcon="closeempty" @clickLeft="back"></uni-nav-bar>
	<view class="card">
		<uni-forms label-position="top" :modelValue="fromsData" :rules="fromsRules" ref="forms">
			<uni-forms-item :label="registerType_value==1?'邮箱':'手机'" required name="mail">
				<view style="display: flex;align-items: center;">
					<uni-easyinput  :placeholder="registerType_value==1?'请输入注册时使用的邮箱号':'请输入注册时使用的手机号'" v-model="fromsData.mail"/>
					<view class="registerType_box">
						<!-- <view class="Type_box_buttom_true" v-show="registerType_value==0" @click="cut(1)">
							邮箱找回
						</view> -->
						<view class="Type_box_buttom_true" v-show="registerType_value==1" @click="cut(0)">
							手机找回
						</view>
					</view>
				</view>
			</uni-forms-item>
			<uni-forms-item label="验证码" required name="mailCode">
				<view class="codeBox" v-show="registerType_value==1">
					<uni-easyinput  placeholder="请输入邮箱验证码"  v-model="fromsData.mailCode"/>
					<view
						:class="typeof(codeNumber)=='string' &&  checkEmail(fromsData.mail)?'codeButton':'codeButtonFalse'" 
						@click="gainCode"
						
						>
						{{codeNumber}}
					</view>
				</view>
				<view class="codeBox" v-show="registerType_value==0">
					<uni-easyinput  placeholder="请输入手机验证码"  v-model="fromsData.mailCode"/>
					<view
						:class="typeof(codeNumber)=='string' && isPhone(fromsData.mail)?'codeButton':'codeButtonFalse'" 
						@click="gainCode"
						>
						{{codeNumber}}
					</view>
				</view>
			</uni-forms-item>
			
			<uni-forms-item label="新密码" required name="password">
				<uni-easyinput  placeholder="请输入新登录密码" v-model="fromsData.password" type="password"/>
			</uni-forms-item>
			<uni-forms-item label="确认密码" required name="confirmPassword" label-width="90">
				<uni-easyinput  placeholder="请重新输入新密码" v-model="fromsData.confirmPassword" type="password"/>
			</uni-forms-item>
			
		</uni-forms>
		<view class="buttomStyle" @click="submit">
			提交
		</view>
	</view>
</template>

<script setup>
	import {ref,onBeforeMount,reactive,getCurrentInstance} from 'vue';
	import api from "@/common/vmeitime-http/index/index.js"
	const {proxy,ctx} = getCurrentInstance()
	const registerType_value=ref(0)
	const back=()=>{uni.navigateBack()}
	const cut=(e)=>{
		registerType_value.value=e
		fromsData.mail=''
		fromsData.confirmPassword=''
		fromsData.mailCode=''
		fromsData.password=''
	}
	const submit=()=>{
		proxy.$refs.forms.validate().then(res=>{
			uni.showLoading({title:'修改中',mask:true})
			api.forgetPassword({
				"account":fromsData.mail,
				"captcha":fromsData.mailCode,
				"password":fromsData.password,
				'type':registerType_value.value
			}).then(resData=>{
				uni.hideLoading()
				if(resData.data.code==1){
					uni.showModal({
						title:'提示',
						content:'您的账号：'+resData.data.data.list.username+'修改密码成功！',
						confirmText:'立即登录',
						confirmColor:'#FDC830',
						success(logi){
							if(logi.confirm){
								uni.redirectTo({url:'/pages/login/login'})
							}
						}
					})
				}else{
					uni.showToast({
						title:res.data.msg,
						icon:'error'
					})
				}
			})
		})
	}
	const pageType=ref(1)
	const fromsRules=reactive({
		mail:{
			rules:[
				{
					required:true,
					errorMessage:'邮箱不能为空'
				},
			]
		},
		mailCode:{
			rules:[
				{
					required:true,
					errorMessage:'验证码不能为空'
				},
			]
		},
		password:{
			rules:[
				{
					required:true,
					errorMessage:'密码不能为空'
				},
				{
					validateFunction:function(rule, value, data, callback){//账号验证
						var res = /[\W]/g;
						if(res.test(value)){
							callback('密码不能有中文~')
						}
						return true
					}
				},
				{
					validateFunction:function(rule, value, data, callback){//账号验证
						var res = /[\W]/g;
						if(value.length<6){
							callback('密码长度必须大于6位~')
						}
						return true
					}
				},
				
			]
		},
		confirmPassword:{
			rules:[
				{
					required:true,
					errorMessage:'密码不能为空'
				},
				{
					validateFunction:function(rule, value, data, callback){//账号验证
						var res = /[\W]/g;
						if(value!=fromsData.password){
							callback('密码不一致~')
						}
						return true
					}
				},
			]
		},
	})
	const fromsData=reactive({
		'mail':null,
		'mailCode':null,
		'password':null,
		'confirmPassword':null
	})
	const codeNumber=ref('获取验证码')
	const setTime=ref(null)
	const gainCode=()=>{//验证码按钮点击事件
		if(registerType_value.value==0){
			api.PhoneSend({'phone':fromsData.mail,'event':'user_retrieve_pwd'}).then(res=>{
				if(res.data.code==1){
					uni.showToast({
						title:'已发送验证码~',
						position:'center',
						icon:'none'
					})
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
					uni.showToast({
						title:res.data.data,
						icon:'error'
					})
				}
			})	
		}else{
			api.send({'email':fromsData.mail,'event':'user_retrieve_pwd',}).then(res=>{
				if(res.data.code==1){
					uni.showToast({
						title:'已发送验证码~',
						position:'center',
						icon:'none'
					})
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
					uni.showToast({
						title:res.data.data,
						icon:'error'
					})
				}
			})
		}
		
		
		
	}
	function checkEmail(email){//验证邮箱格式
		return RegExp(/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/).test(email);
	}
	
	function isPhone(phone) {
	    var myreg=/^[1][3,4,5,6,7,8,9][0-9]{9}$/;
	    if (!myreg.test(phone)) {
	        return false;
	    } else {
	        return true;
	    }
	}
</script>

<style lang="scss">
	.status_bar {
		background-color: #fff;
		height: var(--status-bar-height);
		width: 100%;
	}
	.registerType_box{
		display: flex;
		justify-content: flex-end;
		.Type_box_buttom_true{
			width:152rpx;
			text-align: center;
			line-height:70rpx;
			border-radius:10rpx;
			color:white;
			background-color: #FDC830;
			height:70rpx;
			font-size:26rpx;
			margin-left:20rpx;
			transition: all 0.5s;
		}
	}
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
	.card{
		width:680rpx;
		padding:20rpx;
		border-radius:15rpx;
		margin:20rpx auto;
		background-color:white;
		.buttomStyle{
			width:100%;
			height:80rpx;
			background-color:#FDC830;
			border-radius:15rpx;
			text-align: center;
			line-height:80rpx;
			color: white;
		}
	}
	body{
		background-color:#f3f3f3;
	}
</style>
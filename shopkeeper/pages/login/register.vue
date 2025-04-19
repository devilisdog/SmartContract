<template>
	<view class="status_bar"></view>
	<uni-nav-bar title="注册" leftIcon="closeempty" @clickLeft="back"></uni-nav-bar>
	<view class="BIGbox">
		<uni-forms label-position="top" :rules="formsRules" :modelValue="registerData" ref="forms">
		<!-- 	<uni-forms-item label="账号" required name="account">
				<uni-easyinput  placeholder="请输入登录账号" v-model="registerData.account" trim="all"/>
			</uni-forms-item> -->
			<view class="registerType_box">
				<!-- <view :class="registerType_value==0?'Type_box_buttom_true':'Type_box_buttom_false'" @click="registerType_value=0;registerData.Code='';registerData.mail=''">
					邮箱注册
				</view> -->
				<view :class="registerType_value==1?'Type_box_buttom_true':'Type_box_buttom_false'" @click="registerType_value=1;registerData.Code='';registerData.mail=''">
					手机注册
				</view>
			</view>
			<uni-forms-item label="邮箱" required name="mail" v-if="registerType_value==0">
				<uni-easyinput  placeholder="请输入邮箱账号" v-model="registerData.mail" trim="all"/>
			</uni-forms-item>
			<uni-forms-item label="手机" required name="mail" v-if="registerType_value==1">
				<uni-easyinput  placeholder="请输入手机号" v-model="registerData.mail" type="number" trim="all"/>
			</uni-forms-item>
			<uni-forms-item label="验证码" required name="mailCode" v-show="registerType_value==0">
				<view class="codeBox">
					<uni-easyinput  placeholder="请输入邮箱验证码" v-model="registerData.mailCode" trim="all"/>
					<view 
					:class="typeof(codeNumber)=='string' &&  checkEmail(registerData.mail)?'codeButton':'codeButtonFalse'" 
					@click="gainCode"
					>
						{{codeNumber}}
					</view>
				</view>
			</uni-forms-item>
			<uni-forms-item label="验证码" required name="mailCode" v-show="registerType_value==1">
				<view class="codeBox">
					<uni-easyinput  placeholder="请输入手机验证码" v-model="registerData.mailCode" trim="all"/>
					<view 
					:class="typeof(codeNumber)=='string' &&  isPhone(registerData.mail)?'codeButton':'codeButtonFalse'" 
					@click="gainCode"
					>
						{{codeNumber}}
					</view>
				</view>
			</uni-forms-item>
			
			<uni-forms-item label="登录密码" required name="password" label-width="90">
				<uni-easyinput  placeholder="请输入登录密码" v-model="registerData.password" type="password" trim="all"/>
			</uni-forms-item>
			<uni-forms-item label="确认密码" required name="confirmPassword" label-width="90">
				<uni-easyinput  placeholder="请再次输入登录密码" v-model="registerData.confirmPassword" type="password" trim="all"/>
			</uni-forms-item>
			<uni-forms-item label="业务员"  name="salesmanCode">
				<uni-easyinput  placeholder="业务员ID(若无则流空)" v-model="registerData.salesmanCode" trim="all"/>
			</uni-forms-item>
			<uni-forms-item label="邀请码" required name="InvitationCode">
				<uni-easyinput  placeholder="必填" v-model="registerData.InvitationCode" trim="all"/>
			</uni-forms-item>
		</uni-forms>
		<view class="buttomStyle" @click="tijiao">
			提交
		</view>
		<view style="margin-top:20rpx;color:#FDC830;text-align: end;font-size:28rpx;">
			<text @click="loginSpk">已有账号,立即登录!</text>
		</view>
		
	</view>
</template>

<script setup>
	import api from "@/common/vmeitime-http/index/index.js"
	import {useCounterStore} from '@/stores/counter'
	import {ref,onBeforeMount,onMounted,reactive,getCurrentInstance,} from 'vue';
	const {proxy,ctx} = getCurrentInstance()
	const counter = useCounterStore() //状态管理
	const back=()=>{uni.navigateBack()}
	const registerType_value=ref(1)
	const loginSpk=()=>{
		uni.redirectTo({
			url:'/pages/login/login'
		})
	}
	const codeNumber=ref('获取验证码')//验证码按钮显示内容
	const setTime=ref(null)//定时器ref
	const tijiao=()=>{
		proxy.$refs.forms.validate().then(res=>{
			uni.showLoading({title:'注册中'})
			api.register({
				// "username":registerData.account,
				"password":registerData.password,
				"registerType":registerType_value.value==1?"mobile":"email",
				"email":registerType_value.value==0?registerData.mail:"",
				"mobile":registerType_value.value==1?registerData.mail:"",
				"captcha":registerData.mailCode,
				"group_id":"2",
				"extend":{'shop_id':0,'Inviter':registerData.InvitationCode,'salesman':registerData.salesmanCode}
			}).then(res=>{
				uni.hideLoading()
				if(res.data.code==1){
					uni.showModal({
						title:'恭喜注册成功~',
						content:'已为您自动开启用户端账户： \n 账号：jz'+registerData.mail + "\n 密码："+registerData.password +"\n 请妥善保存！",
						confirmText:'立即登录',
						confirmColor:'#FDC830',
						success: function (res) {
							if (res.confirm) {
								uni.redirectTo({
									url:'/pages/login/login'
								})
							}
						}
					});
				}else{
					uni.showToast({
						title:res.data.msg,
						icon:'error'
					})
				}
			})
		}).catch(err=>{
			// console.log('失败',err);
		})
	
	}
	function isPhone(phone) {
	    var myreg=/^[1][3,4,5,6,7,8,9][0-9]{9}$/;
	    if (!myreg.test(phone)) {
	        return false;
	    } else {
	        return true;
	    }
	}
	function checkEmail(email){
		return RegExp(/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/).test(email);
	}
	const registerData=reactive({
		// 'account':null,//账号
		'mail':null,//邮箱
		'mailCode':null,//邮箱验证码
		'password':null,//密码
		'confirmPassword':null,//邀请码
		'InvitationCode':null,
		'salesmanCode':null
	})
	const formsRules=reactive({
		// account:{
		// 	rules:[
		// 		{
		// 			required:true,
		// 			errorMessage:'账号不能为空'
		// 		},
		// 		{
		// 			validateFunction:function(rule, value, data, callback){//账号验证
		// 				var res = /[\W]/g;
		// 				if(res.test(value)){
		// 					callback('仅支持英文或数字')
		// 				}
		// 				return true
		// 			}
		// 		},
		// 	]
		// },
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
						}else if(value.length>15){
							callback('密码长度不能超过15位~')
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
						if(value!=registerData.password){
							callback('密码不一致~')
						}
						return true
					}
				},
			]
		},
		InvitationCode:{
			rules:[
				{
					required:true,
					errorMessage:'邀请码不能为空'
				},
			]
		},
		salesmanCode:{
			rules:[
				{
					required:false,
					errorMessage:'邀请码不能为空'
				},
			]
		}
		
	})
	const gainCode=()=>{
		if(registerType_value.value==0){
			api.send({'email':registerData.mail,'event':'user_register'}).then(res=>{
				if(res.data.code==1){
					uni.showToast({
						title:'已发送验证码~',
						position:'center'
					})
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
					uni.showModal({
						title:'提示',
						content:res.data.msg,
						confirmText:'忘记密码？',
						confirmColor:'#FDC830',
						success: function (res) {
							if (res.confirm) {
								uni.redirectTo({
									url:'/pages/login/forgetThePassword?typeValue=2'
								})
							}
						}
					});
				}
			})
		}else{
			api.PhoneSend({'phone':registerData.mail,'event':'user_register'}).then(res=>{
				if(res.data.code==1){
					uni.showToast({
						title:'已发送验证码~',
						position:'center',
						icon:'none'
					})
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
					uni.showModal({
						title:'提示',
						content:res.data.data,
						confirmText:'忘记密码？',
						confirmColor:'#FDC830',
						success: function (res) {
							if (res.confirm) {
								uni.redirectTo({
									url:'/pages/login/forgetThePassword?typeValue=2'
								})
							}
						}
					});
				}
			})
		}
		
	}
</script>

<style lang="scss">
	.registerType_box{
		width:100%;
		display: flex;
		justify-content: flex-end;
		.Type_box_buttom_false{
			width:100%;
			text-align: center;
			line-height:80rpx;
			border-radius:10rpx;
			color:#868686;
			height:80rpx;
			font-size:26rpx;
			margin-left:20rpx;
			border:1rpx solid #868686;
			transition: all 0.5s;
		}
		.Type_box_buttom_true{
			width:100%;
			text-align: center;
			line-height:82rpx;
			border-radius:10rpx;
			color:white;
			background-color: #FDC830;
			height:82rpx;
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
	
	.BIGbox{
		background-color: white;
		width:680rpx;
		padding:20rpx;
		margin:20rpx auto;
		border-radius:15rpx;
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
	.status_bar{
		background-color: #fff;
		height: var(--status-bar-height);
		width: 100%;
	}
</style>

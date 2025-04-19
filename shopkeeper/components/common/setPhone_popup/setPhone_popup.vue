<template>
	<view class="setCard">
		<view class="title_box">设置店铺号码</view>
		<uni-forms label-position="top" :rules="formsRules" v-model="registerData" ref="forms">
			<uni-forms-item label="手机" required name="phone">
				<uni-easyinput  placeholder="请输入手机号" v-model="registerData.phone" type="number" trim="all"/>
			</uni-forms-item>
			<uni-forms-item label="验证码" required name="phoneCode">
				<view class="codeBox">
					<uni-easyinput  placeholder="请输入验证码" v-model="registerData.phoneCode" trim="all"/>
					<view 
					:class="typeof(codeNumber)=='string' &&  isPhone(registerData.phone)?'codeButton':'codeButtonFalse'" 
					@click="gainCode"
					>
						{{codeNumber}}
					</view>
				</view>
			</uni-forms-item>
		</uni-forms>
	
		<view class="buttomStyle" @click="allData">提交</view>
	</view>
</template>

<script setup>
	import {ref,onBeforeMount,reactive,getCurrentInstance,defineEmits} from 'vue';
	import api from "@/common/vmeitime-http/index/index.js"
	
	const {proxy,ctx} = getCurrentInstance()
	const registerData=reactive({
		phone:'',
		phoneCode:''
	})
	const Emits=defineEmits(['closePopup'])
	const codeNumber=ref('获取验证码')//验证码按钮显示内容
	const setTime=ref(null)//定时器ref
	const gainCode=()=>{
		uni.showLoading({title:'发送中',mask:true})
		api.PhoneSend({'phone':registerData.phone,'event':'user_change_phone'}).then(res=>{
			uni.hideLoading()
			if(res.data.code==1){
				uni.showToast({title:'已发送验证码~',position:'center',icon:'none'})//验证码按钮点击事件
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
					icon:'error',
				})
			}
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
	
	const allData=()=>{//提交绑定
		proxy.$refs.forms.validate().then(res=>{
			uni.showLoading({title:'绑定中',mask:true})
			api.changePhone({"phone":registerData.phone,"sms":registerData.phoneCode}).then(res=>{
				uni.hideLoading()
				Emits('closePopup')
				uni.showToast({title:res.data.data,icon:res.data.msg})
				if(res.data.code==1){counter.shopBasicsData.ShopConfig.Telephone=registerData.phone}
			}).catch(err=>{
				uni.hideLoading()
				Emits('closePopup')
				uni.showToast({
					title:'数据处理失败，请反馈平台方',
					icon:'none',
					position:'center'
				})
			})
		})
	}
	const formsRules=reactive({
		phone:{
			rules:[
				{
					required:true,
					errorMessage:'手机号不能为空'
				},
				{
					validateFunction:function(rule, value, data, callback){//手机号码校验
						var res = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
						if(!res.test(value)){
							callback('请输入正确的手机号!')
						}else {
							callback()
						}
						return true
					}
				}
			]
		},
		phoneCode:{
			rules:[
				{
					required:true,
					errorMessage:'验证码不能为空'
				},
			]
		},
	})
</script>

<style lang="scss">
	.buttomStyle{
		width:100%;
		height:80rpx;
		background-color:#FDC830;
		border-radius:15rpx;
		text-align: center;
		line-height:80rpx;
		color: white;
	}
	.setCard{
		width:680rpx;
		padding:20rpx;
		border-radius:20rpx;
		background-color:#fff;
		.title_box{
			font-size:38rpx;
			font-weight: bold;
			text-align: center;
			margin-bottom:20rpx;
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
</style>

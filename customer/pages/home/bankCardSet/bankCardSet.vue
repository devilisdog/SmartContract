<template>
	<view class="navigation"></view>
	<uni-nav-bar title="银行卡管理" left-icon="back" @clickLeft="back" right-icon="plus" 
	@clickRight="proxy.$refs.add_bankCard.open()"></uni-nav-bar>
	<myBankCard v-for="itme,index in bankCardList" :key="itme.app_id" :CardData='itme'></myBankCard>
	<view class="addBankcard" @click="proxy.$refs.add_bankCard.open()">
		<image class="add_image" src="../../../static/img/main/add.png"></image>
	</view>
	<view style="height:5rpx;"></view>
	<uni-popup ref="add_bankCard" type="center" :maskClick="false">
		<view class="popupCard">
			<text class="card_title">添加银行卡</text>
			<uni-forms label-position="top" :rules="formsRules" :modelValue="registerData" ref="forms">
				<uni-forms-item label="银行卡号" required name="bank">
					<uni-easyinput  placeholder="请输入银行卡号码" v-model="registerData.bankCardNumber" trim="all" type="number"/>
				</uni-forms-item>
				<uni-forms-item label="手机号" required name="mobile">
					<uni-easyinput  placeholder="请输入开卡时所填写的手机号" v-model="registerData.phoneNumber" trim="all" type="number"/>
				</uni-forms-item>
				<uni-forms-item label="验证码" required name="Code">
					<view class="codeBox">
						<uni-easyinput  placeholder="请输入验证码" v-model="registerData.Code" trim="all"/>
						<view 
						:class="typeof(codeNumber)=='string' &&  isPhone(registerData.phoneNumber)?'codeButton':'codeButtonFalse'" 
						@click="newGetCode">
							{{codeNumber}}
						</view>
					</view>
				</uni-forms-item>
			</uni-forms>
			<view class="buttom_card">
				<view class="buttomStyle" style="flex:0.8;margin-right:10rpx;" @click="proxy.$refs.add_bankCard.close()">
					取消
				</view>
				<view class="buttomStyle" style="flex:1.2;background-color: #202736; "  @click="submit()">
					确定
				</view>
			</view>
		</view>
	</uni-popup>
	<uni-popup ref="affirmAdd" type="center" :maskClick="false">
		<view class="affirmAdd_card">
			<text class="card_title">确认新增</text><br>
			<text style="color: #939393;padding-top:20rpx;">
				1、请留意手机短信，您会收到来自汇付天下的手机验证码短信，请填写收到的验证后点击确定后即可。
			</text><br>
			<text style="color: #939393;">
				2、如取消新增银行卡点击取消退出即可。
			</text>
			<uni-forms-item label="验证码" required name="Code" label-position="top" style="margin-top:20rpx;">
				<view class="codeBox">
					<uni-easyinput  placeholder="请输入验证码" v-model="affirmAdd_code" trim="all"/>
				</view>
			</uni-forms-item>
			
			<view class="buttom_card">
				<view class="buttomStyle" style="flex:0.8;margin-right:10rpx;" @click="proxy.$refs.affirmAdd.close()">
					取消
				</view>
				<view class="buttomStyle" style="flex:1.2;background-color: #202736; "  @click="newSubmit()">
					确定
				</view>
			</view>
		</view>
	</uni-popup>
</template>
<script setup>
	import api from '@/common/vmeitime-http/'
	import {useCounterStore} from '@/stores/counter'
	import {ref,reactive,getCurrentInstance,onBeforeMount} from 'vue';
	import myBankCard from "@/components/home/myBankCard/myBankCard.vue"
	const {proxy,ctx} = getCurrentInstance()
	const codeNumber=ref('获取验证码')//验证码按钮显示内容
	const bankCard_id=ref('')
	const bankCardList=ref([])
	const back=()=>{
		uni.navigateBack()
	}
	onBeforeMount(()=>{
		getBankCardList()
	})
	const registerData=reactive({
		Code:'',
		phoneNumber:'',
		bankCardNumber:''
	})
	const affirmAdd_code=ref('')
	function isPhone(phone) {//手机号码校验
	    var myreg=/^[1][3,4,5,6,7,8,9][0-9]{9}$/;
	    if (!myreg.test(phone)) {
	        return false;
	    } else {
	        return true;
	    }
	}
	const getBankCardList=()=>{//获取已绑定银行卡列表
		api.CardQuery({}).then(res=>{
			if(res.data.code==1){
				bankCardList.value=JSON.parse(res.data.data)
			}else{
				uni.showToast({
					title:res.data.data,
					icon:'error'
				})
			}
		}).catch(err=>{
			uni.hideLoading()
			uni.showToast({
				title:'数据处理失败，请反馈平台方',
				icon:'none',
				position:'center'
			})
		})
	}
	
	const newSubmit=()=>{//绑定确认执行
		uni.showLoading({title:'验证中',mask:true})
		api.CardConfirm({'apply_id':bankCard_id.value,'sms_code':affirmAdd_code.value,'type':1}).then(res=>{
			uni.hideLoading()
			if(res.data.code==1){
				uni.showToast({title:'绑定成功~'})
				//绑定成功后清空所有参数
				registerData.Code=''
				registerData.bankCardNumber=''
				registerData.phoneNumber=''
				bankCard_id.value=''
				affirmAdd_code.value=''
				getBankCardList()
				proxy.$refs.affirmAdd.close()
			}else{
				uni.showToast({
					title:res.data.data.error_msg,
					icon:'error'
				})
			}
		}).catch(err=>{
			uni.hideLoading()
			uni.showToast({
				title:'数据处理失败，请反馈平台方',
				icon:'none',
				position:'center'
			})
		})
	}
	const submit=()=>{//提交新增
		uni.showLoading({title:'验证中',mask:true})
		proxy.$refs.forms.validate().then(res=>{
			api.addBankCard({
				'phone':registerData.phoneNumber,
				'BankCard_no':registerData.bankCardNumber,
				'captchaObj':{'code':registerData.Code,'type':'phone_captcha'},
			}).then(res=>{
				uni.hideLoading()
				if(res.data.code==1){
					bankCard_id.value=res.data.data.id
					proxy.$refs.add_bankCard.close()
					proxy.$refs.affirmAdd.open()
				}else{
					uni.showToast({
						title:res.data.data.error_msg,
						icon:'error',
						position:'center'
					})
				}
			}).catch(err=>{
				uni.hideLoading()
				uni.showToast({
					title:'数据处理失败，请反馈平台方',
					icon:'none',
					position:'center'
				})
			})
		}).catch(err=>{
			uni.showToast({
				title:'请填写对应内容',
				icon:'none',
				position:'center'
			})
		})
	}
	const setTime=ref(null)//验证码定时器控制器
	const newSetTime=ref(null)
	
	
	
	const newGetCode=()=>{//新增验证码发送
		uni.showLoading({title:'发送中',mask:true})
		api.PhoneSend({'phone':registerData.phoneNumber,'event':'phone_captcha'}).then(res=>{
			uni.hideLoading()
			if(res.data.code==1){
				uni.showToast({
					title:'发送成功，请留意查收',
					icon:'none',
					position:'center'
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
					title:res.data.msg,
					icon:'error',
				})
			}
		}).catch(err=>{
			uni.hideLoading()
			uni.showToast({
				title:'数据处理失败，请反馈平台方',
				icon:'none',
				position:'center'
			})
		})
	}
	const formsRules=reactive({//表单校验规则
		mobile:{
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
				},
			]
		},
		bank:{
			rules:[
				{
					required:true,
					errorMessage:'银行卡号不能为空~'
				},
				{
					validateFunction:function(rule, value, data, callback){//银行卡校验
						var res = /[^\d.]/g;
						if (!Number.isInteger(+value)) {
							callback('银行卡号必须为纯数字，不能有符号或者小数')
						}
						return true
					}
				},
			]
		},
		Code:{
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
	.affirmAdd_card{
		width:680rpx;
		padding:20rpx;
		border-radius: 20rpx;
		background-color: #fff;
	}
	.popupCard{
		width:680rpx;
		border-radius:20rpx;
		background-color:#fff;
		padding:20rpx;
	}
	.card_title{
		font-size:38rpx;
		font-weight: bold;
	}
	.navigation{
		background-color: #ffffff;
		height: var(--status-bar-height);
		width: 100%;
	}
	body{
		background-color: #f9f9f9;
	}
	.addBankcard{
		width:680rpx;
		padding:20rpx;
		border-radius:20rpx;
		background-color: #fff;
		margin:15rpx auto;
		height:250rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow:0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.4);
		.add_image{
			width:200rpx;
			height:200rpx;
		}
	}
	.codeBox{
		display: flex;
		align-items: center;
		.codeButton{
			background-color:#f04b49;
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
	.buttom_card{
		display: flex;
		justify-content: space-between;
		.buttomStyle{
			height:80rpx;
			background-color: #bababa;
			text-align: center;
			line-height:80rpx;
			border-radius:10rpx;
			color:white;
		}
	}
</style>

<template>
	<view class="pay_Card">
		<view class="title_box">
			确认支付
			<text class="title_box" style="color:red;">{{Props.payMoney}}元</text>
		</view>
		<view class="hint_box">
			<text>1、确认支付验证码将会发送至开卡所填写的手机号上，请留言查看</text>
		</view>
		<view class="hint_box">
			<text style="color:red;">2、填写完验证后点击确认后将会直接所选择的银行卡上扣款，如余额不足将无法充值</text>
		</view>
		<view class="hint_box">
			<text>3、如想取消支付，不输入验证码点击取消即可</text>
			<text style="color:red;">4、验证成功后如长时间未到账，请确认银行卡是否余额充足，或可在交易详情->充值列表查看是否充值记录</text>
			<text>5、如对充值存在疑问可联系店主或平台客服</text>
		</view>
		<view class="accountInfo_box">
			<text>扣款银行卡号：{{Props.payData.card_id}}</text><br>
			<text>验证手机号码 ：{{Props.payData.tel_no}}</text>
		</view>
		<uni-forms-item label="验证码" required name="Code" label-position="top" style="margin-top:20rpx;">
			<view class="codeBox">
				<uni-easyinput  placeholder="请输入支付确认验证吗" v-model="affirmAdd_code" trim="all" :focus="true"/>
				<view :class="typeof(AffirmStr)=='string'?'codeButton':'codeButtonFalse'"  @click="GatAffirmCard(2)">
					{{AffirmStr}}
				</view>
			</view>
		</uni-forms-item>
		<view class="buttom_card">
			<view class="buttomStyle" style="flex:0.8;margin-right:10rpx;" @click="close">
				取消
			</view>
			<view class="buttomStyle" style="flex:1.2;background-color: #202736; "  @click="pay(1)">
				确定
			</view>
		</view>
	</view>
</template>
<script setup>
	import api from "@/common/vmeitime-http/index.js"
	import {onBeforeMount,ref,reactive,getCurrentInstance,defineProps,defineEmits} from 'vue'
	const Props=defineProps(['payData','payMoney','payId'])
	const AffirmStr=ref('重新获取')
	const affirmAdd_code=ref('')
	const newSetTime=ref(null)
	const Emits=defineEmits(['closePopup'])
	const close=()=>{
		Emits('closePopup')
	}
	onBeforeMount(()=>{
		GatAffirmCard(1)
	})
	const pay=(type)=>{
		if(affirmAdd_code.value==''){uni.showToast({title:'请输入验证码~',icon:'none',mask:true});return}
		uni.showLoading({title:'支付中',mask:true})
		api.PayConfirm({"sms_code":affirmAdd_code.value,"payment_id":Props.payId,"type":type}).then(res=>{
			uni.hideLoading()
			if(res.data.code!=1 || res.data.data.error_msg){//错误拦截
				if(res.data.data.error_msg){
					uni.showToast({title:res.data.data.error_msg,icon:'error'})
				}else{
					uni.showToast({title:res.data.msg,icon:'error'})
				}
				close()
				return
			}
			uni.showToast({
				title:payState[res.data.data.status],
				icon:'none',
				position:'center'
			})
			close()
		}).catch(err=>{
			uni.hideLoading()
			uni.showToast({
				title:'数据处理失败，请联系平台客服',
				icon:'none',
				position:'center'
			})
		})
	}
	const payState=reactive({
		'failed':'交易失败',
		'succeeded':'支付成功',
		'pending':'交易处理中'
	})
	const GatAffirmCard=(type)=>{//获取验证码
		if(type==1){
			AffirmStr.value=60
			newSetTime.value=setInterval(function(){
				AffirmStr.value--
				if(AffirmStr.value==0){
					clearInterval(newSetTime.value)
					newSetTime.value=null
					AffirmStr.value='重新获取'
				}
			},1000)	
		}else{
			uni.showLoading({title:'发送中',mask:true})
			api.PayConfirm({"sms_code":affirmAdd_code.value,"payment_id":Props.payId,"type":type}).then(res=>{
				uni.hideLoading()
				if(res.data.code==1){
					uni.showToast({
						title:'发送成功，请留意查收',
						icon:'none',
						position:'center'
					})
					AffirmStr.value=60
					newSetTime.value=setInterval(function(){
						AffirmStr.value--
						if(AffirmStr.value==0){
							clearInterval(newSetTime.value)
							newSetTime.value=null
							AffirmStr.value='重新获取'
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
					title:'数据处理失败，请联系平台客服',
					icon:'none',
					position:'center'
				})
			})
		}
	}
</script>

<style lang="scss">
	.accountInfo_box{
		margin-top:20rpx;
	}

	.hint_box{
		text-indent:1em;
		color: #828282;
	}
	.title_box{
		font-size:38rpx;
		font-weight: bold;
		text-align: center;
		width:100%;
	}
	.pay_Card{
		width: 680rpx;
		padding:20rpx;
		background-color:#fff;
		border-radius:20rpx;
	}
	.buttom_card{
		display: flex;
		justify-content: space-between;
		width:680rpx;
		.buttomStyle{
			height:80rpx;
			background-color: #bababa;
			text-align: center;
			line-height:80rpx;
			border-radius:10rpx;
			color:white;
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
</style>

<template>
	<view style="width: 600rpx;height: 100%;background-color: white;border-radius: 50rpx;padding: 25rpx 30rpx;display: flex;align-items: center;">
		<uni-collapse accordion  >
			<uni-collapse-item titleBorder='none' :showArrow="false" :border="false">
				<template v-slot:title>
					<uni-list :border="false" style='margin-left: -20rpx;'>
						<uni-list-item title="身份信息绑定" :show-extra-icon="true">
						</uni-list-item>
					</uni-list>
				</template>
				<view class="font">
					<text>身份信息请务必填写本人真实有效的信息，以免影响后续的中奖、提款。</text>
				</view>
			</uni-collapse-item>
			
			<uni-collapse-item titleBorder='none' :showArrow="false" style='border-top: 1rpx solid #f8f8f8;' :border="false">
				<template v-slot:title>
					<uni-list :border="false" style='margin-left: -20rpx;'>
						<uni-list-item title="手机收不到验证码怎么办" :show-extra-icon="true">
						</uni-list-item>
					</uni-list>
				</template>
				<view class="font" style="height: 350rpx;">
					<text>验证码是您在账户修改相关信息时，网站通过第三方信息平台发送到您手机，如遇接收手机信号不稳定，信息平台故障的情况，验证码会有延时发送的情况发生，建议您将手机关机重启后尝试或关闭手机安全软件重新获取验证码，或者稍等几分钟再试，如多次无法正常接收验证码，请联系网站客服为您查询。</text>
				</view>
			</uni-collapse-item>
			
			<uni-collapse-item titleBorder='none' :showArrow="false" style='border-top: 1rpx solid #f8f8f8;' :border="false">
				<template v-slot:title>
					<uni-list :border="false" style='margin-left: -20rpx;'>
						<uni-list-item title="如何注册" :show-extra-icon="true">
						</uni-list-item>
					</uni-list>
				</template>
				<view class="font">
					<text>点击注册，在欢迎注册页面(1.填写您的手机号2设置登录密码3.获取并填写验证码)三个步骤完成点击注册即可完成。为了账户安全，注册成功后，请及时在安全中心绑定相关信息。</text>
				</view>
			</uni-collapse-item>
			
		</uni-collapse>
	</view>
</template>

<script>

</script>

<style>
	.font{
		 padding: 0 30rpx;
		 height: 100%;
		}.font text{
			color: #949494;
			line-height: 50rpx;
		}
</style>

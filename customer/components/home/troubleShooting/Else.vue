<template>
	<view style="width: 600rpx;height: 100%;background-color: white;border-radius: 50rpx;padding: 25rpx 30rpx;display: flex;align-items: center;">
		<uni-collapse accordion  >
			<uni-collapse-item titleBorder='none' :showArrow="false" :border="false">
				<template v-slot:title>
					<uni-list :border="false" style='margin-left: -20rpx;'>
						<uni-list-item title="购彩协议" :show-extra-icon="true">
						</uni-list-item>
					</uni-list>
				</template>
				<view class="font">
					<text>登录注册页面下方</text>
				</view>
			</uni-collapse-item>
			
			<uni-collapse-item titleBorder='none' :showArrow="false" style='border-top: 1rpx solid #f8f8f8;' :border="false">
				<template v-slot:title>
					<uni-list :border="false" style='margin-left: -20rpx;'>
						<uni-list-item title="如何退出账号" :show-extra-icon="true">
						</uni-list-item>
					</uni-list>
				</template>
				<view class="font">
					<text>在我的一设置【右上角】最下方退出登录,点击即可退出当前账号。如帮助中心内容没能帮助到您:请联系我们的在线客服</text>
				</view>
			</uni-collapse-item>
			
			<uni-collapse-item titleBorder='none' :showArrow="false" style='border-top: 1rpx solid #f8f8f8;' :border="false">
				<template v-slot:title>
					<uni-list :border="false" style='margin-left: -20rpx;'>
						<uni-list-item title="如何修改支付密码" :show-extra-icon="true">
						</uni-list-item>
					</uni-list>
				</template>
				<view class="font">
					<text>在我的账户-安全中心-支付密码里进行修改</text>
				</view>
			</uni-collapse-item>
			
			<uni-collapse-item titleBorder='none' :showArrow="false" style='border-top: 1rpx solid #f8f8f8;' :border="false">
				<template v-slot:title>
					<uni-list :border="false" style='margin-left: -20rpx;'>
						<uni-list-item title="忘记用户名或者找回密码" :show-extra-icon="true">
						</uni-list-item>
					</uni-list>
				</template>
				<view class="font">
					<text>(1)忘记用户名:如果您的账户忘记用户名并且已绑定手机号码,可使用手机短信验证码登录;</text><br/>
					<text>(2)忘记登陆密码:如果您需要找回密码登陆界面忘记密码,使用您绑定的手机号选择您需要找回的账户密码,可找回您的密码;如上述操作还未成功,请联系在线客服,我们将为您核实处理。</text>
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

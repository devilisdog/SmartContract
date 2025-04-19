<template>
	<view style="width: 600rpx;height: 100%;background-color: white;border-radius: 50rpx;padding: 25rpx 30rpx;display: flex;align-items: center;">
		<uni-collapse accordion  >
			<uni-collapse-item titleBorder='none' :showArrow="false" :border="false">
				<template v-slot:title>
					<uni-list :border="false" style='margin-left: -20rpx;'>
						<uni-list-item title="充值金额不可提现" :show-extra-icon="true">
						</uni-list-item>
					</uni-list>
				</template>
				<view class="font">
					<text>为防止恶意提款、洗钱等不法行为，充值资金必须用于实际消费，不可提现，中奖金额才能提现。</text>
				</view>
			</uni-collapse-item>
			
			<uni-collapse-item titleBorder='none' :showArrow="false" style='border-top: 1rpx solid #f8f8f8;' :border="false">
				<template v-slot:title>
					<uni-list :border="false" style='margin-left: -20rpx;'>
						<uni-list-item title="支付平台扣款成功,页面提示支付失败" :show-extra-icon="true">
						</uni-list-item>
					</uni-list>
				</template>
				<view class="font" style="">
					<text>在支付金额延迟到账的情况下,会出现已经扣款,但页面提示支付失败的情况。建议您先确认一下账户明细或者购彩记录,一般5分钟内都会到账。如时间过久还未到账,请及时联系客服。</text>
				</view>
			</uni-collapse-item>
			
			<uni-collapse-item titleBorder='none' :showArrow="false" style='border-top: 1rpx solid #f8f8f8;' :border="false">
				<template v-slot:title>
					<uni-list :border="false" style='margin-left: -20rpx;'>
						<uni-list-item title="充值提示超限,或者提示无法向该商户付款" :show-extra-icon="true">
						</uni-list-item>
					</uni-list>
				</template>
				<view class="font">
					<text>为了您更好的体验支付,防止被微信、支付宝风控限额,我们建议您按下面的方式中调整扫码支付的方式,可以在绝大部分交易中避免被风控。</text><br/>
					<text>规则一:30分钟内,尽量不要连续刷3笔(包括失败交易),两笔交易时间间隔大于5分钟,交易金额尽量不要一样,可以略微调节;</text><br/>
					<text>规则二:大额的充值或则付款尽量选择在非正常营业时间(21:00次日9:00);</text><br/>
					<text>规则三:不要重复提交相同金额的订单,不同交易的交易金额要不—样;</text><br/>
					<text>规则四:单笔交易金额尽量不要是整数,可以适当多加角或分;</text><br/>
					<text>规则五:单卡单日交易总笔数不要过多,尽量不要失败;</text><br/>
					<text>规则六:单笔交易金额不要过大,控制在1W以内,若需要超大额充值,可以选择转账支付。</text>
				</view>
			</uni-collapse-item>
			
			<uni-collapse-item titleBorder='none' :showArrow="false" style='border-top: 1rpx solid #f8f8f8;' :border="false">
				<template v-slot:title>
					<uni-list :border="false" style='margin-left: -20rpx;'>
						<uni-list-item title="目前支持什么方式充值" :show-extra-icon="true">
						</uni-list-item>
					</uni-list>
				</template>
				<view class="font">
					<text>您好,目前我们支持的支付方式有支付宝支付、微信支付、银联快捷支付、银联借记卡云闪付支付、云闪付App支付等。</text>
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

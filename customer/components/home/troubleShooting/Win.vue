<template>
	<view style="width: 600rpx;height: 100%;background-color: white;border-radius: 50rpx;padding: 25rpx 30rpx;display: flex;align-items: center;">
		<uni-collapse accordion  >
			<uni-collapse-item titleBorder='none' :showArrow="false" :border="false">
				<template v-slot:title>
					<uni-list :border="false" style='margin-left: -20rpx;'>
						<uni-list-item title="延期、中断、取消的比赛,如何算奖" :show-extra-icon="true">
						</uni-list-item>
					</uni-list>
				</template>
				<view class="font">
					<text>1.延期比赛如何处理:推迟时间未超过36时,则正常算奖，推迟时间超过36小时或无法确定时间,则该场为无效场次.按比赛取消算奖;取消赛事算奖:单关固定玩法返还投注金额过关投注该场赔率值按1.0计算奖金;</text><br/>
					<text>2.中断比赛如何处理:36小时内继续完成比赛则正常算奖;36小时内未完成比赛则该场为无效场次,按比赛取消算奖;取消赛事算奖:单关固定玩法返还投注金额,过关投注该场赔率值按1.0计算奖金。</text>
				</view>
			</uni-collapse-item>
			
			<uni-collapse-item titleBorder='none' :showArrow="false" style='border-top: 1rpx solid #f8f8f8;' :border="false">
				<template v-slot:title>
					<uni-list :border="false" style='margin-left: -20rpx;'>
						<uni-list-item title="竞彩奖金是怎么计算的" :show-extra-icon="true">
						</uni-list-item>
					</uni-list>
				</template>
				<view class="font">
					<text>奖金计算公式为:[所选场次的过关出票赔率连乘]2元(单注)×倍数。奖金按最终的【出票赔率】来计算,而不是按照购买时参考赔率计算。</text>
				</view>
			</uni-collapse-item>
			
			<uni-collapse-item titleBorder='none' :showArrow="false" style='border-top: 1rpx solid #f8f8f8;' :border="false">
				<template v-slot:title>
					<uni-list :border="false" style='margin-left: -20rpx;'>
						<uni-list-item title="中奖奖金如何扣税" :show-extra-icon="true">
						</uni-list-item>
					</uni-list>
				</template>
				<view class="font" >
					<text>根据管理机构的相关规定,中奖单注奖金超过1万元时,中奖人需要缴纳奖金的20%作为个人偶然所得税;税金由中心代扣代缴。选择倍投投注时,只要开奖后单注奖金不超过1万元,就算翻倍后奖金超过1万元,也无须缴纳个人偶然所得税。</text>
				</view>
			</uni-collapse-item>
			
			<uni-collapse-item titleBorder='none' :showArrow="false" style='border-top: 1rpx solid #f8f8f8;' :border="false">
				<template v-slot:title>
					<uni-list :border="false" style='margin-left: -20rpx;'>
						<uni-list-item title="北京单场计算方式" :show-extra-icon="true">
						</uni-list-item>
					</uni-list>
				</template>
				<view class="font">
					<text>北京单场的奖金计算是根据官方的开奖p计算的。而SP值是官方根据该场比赛的总投注和中奖注数而定的,开奖SP会在比赛结束后1-2时内公布,23点后结束的赛事的SP会留到次日上午公布。奖金计算公式:中奖奖金=2元xSPx倍数×65%(SP:代表所选场次对应的开奖SP值)</text>
				</view>
			</uni-collapse-item>
			
			<uni-collapse-item titleBorder='none' :showArrow="false" style='border-top: 1rpx solid #f8f8f8;' :border="false">
				<template v-slot:title>
					<uni-list :border="false" style='margin-left: -20rpx;'>
						<uni-list-item title="如何领奖" :show-extra-icon="true">
						</uni-list-item>
					</uni-list>
				</template>
				<view class="font">
					<text>您好,每期开奖后,系统会自动将奖金划至中奖用户的本平台账户中,用户随时可以查看、使用,提取奖金到您的银行卡。中得一等奖大奖后,我们的工作人员会第一时间联系您,您可以选择自行兑奖或者我们代领的方式,大奖奖金会在1-3个工作日内到达您的账户。</text>
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

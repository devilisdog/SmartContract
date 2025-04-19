<template>
	<view style="width: 600rpx;height: 100%;background-color: white;border-radius: 50rpx;padding: 25rpx 30rpx;display: flex;align-items: center;">
		<uni-collapse accordion  >
			<uni-collapse-item titleBorder='none' :showArrow="false" :border="false">
				<template v-slot:title>
					<uni-list :border="false" style='margin-left: -20rpx;'>
						<uni-list-item title="查看订单的实体票" :show-extra-icon="true">
						</uni-list-item>
					</uni-list>
				</template>
				<view class="font">
					<text>目前实体票查询支持拍照和邮寄,需要您向客服提供书面申请、身份证正反面照片、最近三笔充值记录截图。拍照查看还需要提供一下常用邮箱,邮寄需要提供收件地址和收件人电话。</text>
				</view>
			</uni-collapse-item>
			
			<uni-collapse-item titleBorder='none' :showArrow="false" style='border-top: 1rpx solid #f8f8f8;' :border="false">
				<template v-slot:title>
					<uni-list :border="false" style='margin-left: -20rpx;'>
						<uni-list-item title="彩金卡如何使用" :show-extra-icon="true">
						</uni-list-item>
					</uni-list>
				</template>
				<view class="font">
					<text>您好,彩金卡在付款页面可以使用。详情请在彩金卡页面查看具体的使用条件，比如满减、限彩种等</text>
				</view>
			</uni-collapse-item>
			
			<uni-collapse-item titleBorder='none' :showArrow="false" style='border-top: 1rpx solid #f8f8f8;' :border="false">
				<template v-slot:title>
					<uni-list :border="false" style='margin-left: -20rpx;'>
						<uni-list-item title="福彩3D和排列三直选、组选三和组选六玩法" :show-extra-icon="true">
						</uni-list-item>
					</uni-list>
				</template>
				<view class="font" >
					<text>1.直选:竞猜三位开奖号码,即百位、十位和个位,【且顺序一致】</text><br/>
					<text>2.组选三:竟猜三位开奖号码,顺序不限，【开奖号码的3位数字中,有两位相同,即为组三形式】</text><br/>
					<text>3.组选六:竟猜三位开奖号码,顺序不限,【开奖号码的3位数字都不相同，即为组六形式】</text>
				</view>
			</uni-collapse-item>
			
			<uni-collapse-item titleBorder='none' :showArrow="false" style='border-top: 1rpx solid #f8f8f8;' :border="false">
				<template v-slot:title>
					<uni-list :border="false" style='margin-left: -20rpx;'>
						<uni-list-item title="竞彩足球篮球开停售时间" :show-extra-icon="true">
						</uni-list-item>
					</uni-list>
				</template>
				<view class="font">
					<text>【竞足】周一至周五(开售11:00-停售22:00)周六、周日(11:00-23:00)</text><br/>
					<text>【竞篮】周一至周五(开售11:00-停售22:00)周六、周日(11:00-23:00)</text><br/>
					<text>注:竞彩足球、竞彩篮球开停售时间根据需要或有略微调整,具体请留意竞彩网公告,并以实际开售时间为准。</text>
				</view>
			</uni-collapse-item>
			
			<uni-collapse-item titleBorder='none' :showArrow="false" style='border-top: 1rpx solid #f8f8f8;' :border="false">
				<template v-slot:title>
					<uni-list :border="false" style='margin-left: -20rpx;'>
						<uni-list-item title="竞彩足球固定奖金的单注最高限额" :show-extra-icon="true">
						</uni-list-item>
					</uni-list>
				</template>
				<view class="font">
					<text>1.选择2-3场过关投注的,单注最高奖金限额20万元;</text><br/>
					<text>2.选择4-5场过关投注的,单注最高奖金限额50万元;</text><br/>
					<text>3.选择6场过关投注的,单注最高奖金限额100万元;</text>
					<text>4.选择单场投注的,单注最高奖金限额10万元。</text>
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

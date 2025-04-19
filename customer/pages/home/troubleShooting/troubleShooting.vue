<template>
	<view class="statusBar"></view>
	<!-- 导航栏 -->
	<view :style="ScrollJudge > 50 ? 'background-color: white;z-index:999;box-shadow: 0 5rpx 25rpx #ebebeb;' : 'z-index:999;'"
		class="navigation">
		<view>
			<uni-icons type="back" size='25' :color="ScrollJudge > 50 ? '#6b6b6b' : '#fff'" @click="back()"></uni-icons>
		</view>
		<text style="font-weight: bold;" :style="ScrollJudge > 50 ? 'color:#6b6b6b;' : 'color: #fff ;'">帮助中心</text>
	</view>
	<!-- 资金安全/购彩保障等 -->
	<view style="position: absolute;width: 100%;height: 340rpx;margin: 0 auto;display: flex;align-items: center;justify-content: space-around;margin-top: 30rpx;">
		<view class="head">
			<image src="@/static/img/home/money.png" class="imageStyle"></image>
			<text>资金安全</text>
		</view>
		<view class="head">
			<image src="@/static/img/home/anquan.png" class="imageStyle"></image>
			<text>购彩保障</text>
		</view>
		<view class="head">
			<image src="@/static/img/home/portable.png" class="imageStyle"></image>
			<text>提款便携</text>
		</view>
	</view>
	<!-- 背景 -->
	<bolang style='z-index: -1;position: relative;margin: auto;' class="main-loading"></bolang>
	<!-- 问题 -->
	<view style="display: flex;flex-direction: column;justify-content: center;margin-top: 30rpx;">
		<text style="color: #4c4c4c;font-size: 34rpx;font-weight: bold;padding: 0 40rpx;">问题类型</text>
		<view style="display: flex;flex-direction: row;padding: 0rpx 40rpx;flex-wrap: wrap;">
			<view @click="index==0?	proxy.$refs.textRegister.open():index==1? proxy.$refs.textTopUp.open():index==2? proxy.$refs.textBuy.open():index==3? proxy.$refs.textWin.open():index==4? proxy.$refs.textDrawMoney.open() :  proxy.$refs.textElse.open()"
				v-for="item,index in problemTypes" :key="index" style="width: 220rpx;margin-top: 30rpx;display: flex;align-items: center;">
				<uni-icons :type="item.type" size="25" color="#ff7375"></uni-icons>
				<text style="font-size: 32rpx;padding: 0 30rpx;">{{item.name}}</text>
			</view>
		</view>
	</view>
	
	<!-- 常见问题 -->
	<view style="display: flex;flex-direction: column;justify-content: center;margin-top: 40rpx;border-top: 1rpx solid #f8f8f8;">
		<text style="color: #4c4c4c;font-size: 34rpx;font-weight: bold;padding: 10rpx 40rpx;">常见问题</text>
		
		<uni-collapse accordion  >
			<uni-collapse-item titleBorder='none' :showArrow="false">
				<template v-slot:title>
					<uni-list :border="false" style='margin-left: -20rpx;'>
						<uni-list-item title="充值提示超限,或者提示无法向该商户付款" :show-extra-icon="true">
						</uni-list-item>
					</uni-list>
				</template>
				<view class="font">
					<text>为了您更好的体验支付,防止被微信、支付宝风控限额,我们建议您按下面的方式中调整扫码支付的方式,可以在绝大部分交易中避免被风控。</text><br/>
					<text>1.规则—:30分钟内,尽量不要连续刷3笔(包括失败交易) ,两笔交易时间间隔大于5分钟,交易金额尽量不要一样,可以略微调节;</text><br/>
					<text>2.规则二:大额的充值或者付款尽量选择在非正常营业时间(21:00-次日9:00);</text><br/>
					<text>3.规则三:不要重复提交相同金额的订单,不同交易的交易金额要不一样;</text><br/>
					<text>4.规则四:单笔交易金额尽量不要是整数,可以适当多加角或分;</text><br/>
					<text>5.规则五:单卡单日交易总笔数不要过多,尽量不要失败;</text><br/>
					<text>6.规则六:单笔交易金额不要过大,控制在1W以内,若需要超大额充值,可以选择转账支付。</text>
				</view>
			</uni-collapse-item>
			
			<uni-collapse-item titleBorder='none' :showArrow="false" style='border-top: 1rpx solid #f8f8f8;'>
				<template v-slot:title>
					<uni-list :border="false" style='margin-left: -20rpx;'>
						<uni-list-item title="延期、中断、取消的比赛,如何算奖" :show-extra-icon="true">
						</uni-list-item>
					</uni-list>
				</template>
				<view class="font" style="height: 430rpx;">
					<text>1.延期比赛如何处理:推迟时间未超过36小时,则正常算奖;推迟时间超过36小时或无法确定时间,则该场为无效场次,按比赛取消算奖;取消赛事算奖:单关固定玩法返还投注金额,过关投注该场赔率值按1.0计算奖金;</text><br/>
					<text>2.中断比赛如何处理:36小时内继续完成比赛则正常算奖; 36小时内未完成比赛则该场为无效场次,按比赛取消算奖;取消赛事算奖:单关固定玩法返还投注金额,过关投注该场赔率值按1.0计算奖金。</text>
				</view>
			</uni-collapse-item>
			
			<uni-collapse-item titleBorder='none' :showArrow="false" style='border-top: 1rpx solid #f8f8f8;'>
				<template v-slot:title>
					<uni-list :border="false" style='margin-left: -20rpx;'>
						<uni-list-item title="中奖奖金如何扣税" :show-extra-icon="true">
						</uni-list-item>
					</uni-list>
				</template>
				<view class="font" style="height: 260rpx;">
					<text>根据管理机构的相关规定,中奖单注奖金超过1万元时,中奖人需要缴纳奖金的20%作为个人偶然所得税;税金由中心代扣代缴。选择倍投投注时,只要开奖后单注奖金不超过1万元,就算翻倍后奖金超过1万元，也无须缴纳个人偶然所得税。</text>
				</view>
			</uni-collapse-item>
			
			<uni-collapse-item titleBorder='none' :showArrow="false" style='border-top: 1rpx solid #f8f8f8;'>
				<template v-slot:title>
					<uni-list :border="false" style='margin-left: -20rpx;'>
						<uni-list-item title="关于提款手续费" :show-extra-icon="true">
						</uni-list-item>
					</uni-list>
				</template>
				<view class="font" style="height: 180rpx;">
					<text>网站提款不收取任何提款手续费,本站用户提款所产生的银行手续费由本平台为您承担(异常提款除外)。注:充值金额不能提现,中奖金额才可提现。</text>
				</view>
			</uni-collapse-item>
		</uni-collapse>
	</view>
	
	<!-- 问题类型弹窗 -->
	<!-- 注册 -->
	<uni-popup ref="textRegister" type="center">
		<register></register>
	</uni-popup>
	<!-- 充值 -->
	<uni-popup ref="textTopUp" type="center">
		<topUp></topUp>
	</uni-popup>
	<!-- 购彩 -->
	<uni-popup ref="textBuy" type="center">
		<Buy></Buy>
	</uni-popup>
	<!-- 中奖 -->
	<uni-popup ref="textWin" type="center">
		<Win></Win>
	</uni-popup>
	<!-- 提款 -->
	<uni-popup ref="textDrawMoney" type="center">
		<DrawMoney></DrawMoney>
	</uni-popup>
	 <!-- 其他 -->
	<uni-popup ref="textElse" type="center">
		<Else></Else>
	</uni-popup>
	 
</template>

<script setup>
	import bolang from '@/components/home/yc-troubleShooting/yc-troubleShooting.vue'
	import bolangtwo from '@/components/home/yc-troubleShooting/yc-troubleShooting-Waves.vue'
	
	import register from '@/components/home/troubleShooting/register.vue'
	import topUp from '@/components/home/troubleShooting/topUp.vue'
	import Buy from '@/components/home/troubleShooting/Buy.vue'
	import Win from '@/components/home/troubleShooting/Win.vue'
	import Else from '@/components/home/troubleShooting/Else.vue'
	import DrawMoney from '@/components/home/troubleShooting/DrawMoney.vue'
	import { onPageScroll } from '@dcloudio/uni-app'
	import {
		onBeforeMount,
		onMounted,
		ref,
		reactive,
		getCurrentInstance,
	} from 'vue';
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	const ScrollJudge = ref(0)
	//这个是uni监听页面滚动的生命周期
	onPageScroll((e)=>{
		ScrollJudge.value = e.scrollTop
	})
	
	//问题类型的for
	const problemTypes = reactive([
		{type:'personadd',name:'注册'},
		{type:'shop',name:'充值'},
		{type:'cart',name:'购彩'},
		{type:'medal',name:'中奖'},
		{type:'wallet',name:'提款'},
		{type:'more-filled',name:'其他'},
	])
	
	//问题类型点击弹窗
	const problemPopup = reactive([
		{ref:'textRegister',index:0},
		{ref:'textTopUp',index:1},
		{ref:'textBuy',index:2},
		{ref:'textWin',index:3},
		{ref:'textDrawMoney',index:4},
		{ref:'textElse',index:5},
	])
	
	const back =()=>{
		uni.navigateBack()
	}
</script>

<style>
	.statusBar{
		width:100%;
		height: var(--status-bar-height);
		 background-image: linear-gradient(100deg, #fa7e99 0%, #f04b49 115%);
	}
/* 导航栏 */
	.navigation{
		width: 100%;
		height: 100rpx;
		position: fixed;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.7s;
		/* background-color: white; */
		}.navigation text{
			font-size: 36rpx;
			font-weight: 500;
			flex: 1;
		}.navigation view{
			margin-left: 20rpx;
			flex: 0.65;
		}
	
	.head{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		}.imageStyle{
		width: 120rpx;
		height: 120rpx;
		opacity: 0.7;
		}.head text{
			color: #fff;
			font-size: 30rpx;
			padding: 10rpx 0;
		}
		
	.font{
		 padding: 0 30rpx;
		 height: 770rpx;
		}.font text{
			color: #949494;
			line-height: 50rpx;
		}

</style>

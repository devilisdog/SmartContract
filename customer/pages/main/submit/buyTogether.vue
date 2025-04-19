<template>
	<view class="statusBar"></view>
	<!-- 导航栏 -->
	<uni-nav-bar background-color="#202736" color="#fff" title="发起合买" left-icon="left" left-text="返回" @clickLeft="back" height="100rpx"></uni-nav-bar>
	<view class="box1">
		<view style="display: flex;flex-direction: row;align-items: center;">
			<view style="display: flex;">
				<text>合买份数</text>
			</view>
			<view style="display: flex;margin-left: 25rpx;align-items: center;">
				<text>每份</text>
				<text style="color: red;">{{data.allmoney / data.NumberShare}}</text>
				<text>元</text>
			</view>
			<view style="display: flex;margin-left: auto;align-items: center;">
				<text style="font-weight: 550;">分为</text>
				<uni-number-box :value="data.NumberShare" :max="step[0]" :min="1"
					@change="numChange"></uni-number-box>
				<text style="font-weight: 550;">份</text>
			</view>
		</view>
		<view style="display: flex;margin-top: 25rpx;align-items: center;">
			<view style="display: flex;">
				<text>自购份数</text>
			</view>
			<view style="display: flex;margin-left: 25rpx;">
				<text>总额</text>
				<text style="color: red;">{{(data.allmoney / data.NumberShare)*data.MyselfShare}}</text>
				<text>元</text>
			</view>
			<view style="display: flex;margin-left: auto;align-items: center;">
				<text style="font-weight: 550;">自购</text>
				<uni-number-box :value="data.MyselfShare" :max="data.NumberShare-1" :min="1" @change="myselfChange" />
				<text style="font-weight: 550;">份</text>
			</view>
		</view>
	</view>
	<view class="box1"><!-- 佣金盈利 -->
		<view style="display: flex;align-items: center;justify-content:space-between;">
			<text style="font-weight:bold;">盈利佣金:</text>
			<view  
				v-for="itme,index in checkboxlist" 
				:class="optionValue==index?'optionClick':'option'" 
				@click="change(itme,index)">
				<text>{{itme.text}}</text>
			</view>
			<!-- <uni-data-checkbox multiple  v-model="checkbox1" mode="tag" :localdata="checkboxlist" @change="change" /> -->
		</view>
		<view>
			<text style="font-weight: 550; font-size: 24rpx; color: red;" v-show="data.checkbox1!=null">
				平台默认收取1%的技术服务费
			</text>
			<text style="font-weight: 550; font-size: 24rpx; color: #afafaf;" v-show="data.checkbox1==null">
				未选择则未不设置佣金
			</text>
		</view>
	</view>
	<!-- 合买保底 -->
	<view class="box1">
		<view style="display: flex;align-items: center;justify-content: space-between;">
			<text style="font-weight: 550;">合买保底</text>
			<evanSwitch active-color="#FFCD1E" :value="guarantee" @change="switchchange" ></evanSwitch>
		</view>
		<view v-if="guarantee==true" style="display: flex;">
			<view style="display: flex;margin-left: auto;">
				<view style="display: flex;flex-direction: row;text-align: center;margin-top: 15rpx;">
					<view :style="minimum==0?'background-color:#FFCD1E;':'background-color:#ffffff;'" @click="minimumClick()"
						style="width: 160rpx;border: 3rpx solid #e7e9eb;border-radius: 10rpx;display: flex;justify-content:center;align-items: center;transition: all 0.3s;">
						<text style="font-size: 14px;" :style="minimum==0?'color:#fff;': 'color:#333'">全额保底</text>
					</view>
					
					<view class="switch-box" style="width: 160rpx;margin-left: 25rpx;">
						<uni-easyinput type="number" trim="all" placeholder="自定义份数" v-model='easyinput' @focus='easyfocus()' @input="easyfocus" @blur="easyfocus()" :clearable="false"></uni-easyinput>
					</view>
				</view>
			</view>
		</view>
	</view>
	<view class="box1">
		<view style="display: flex;align-items: center;justify-content:space-between;">
			<view class="left">
				<text style="font-weight: 550;">是否公开</text>
			</view>
			<radio-group name="" style="transform: scale(.85);" @change="getRadio" >
				<label class="radio">
					<radio value="r1" color="#FFCD1E"/>公开
				</label>
				<label class="radio">
					<radio value="r2" checked="true" color="#FFCD1E"/>认购后可见
				</label>
			</radio-group>
		</view>
		<view style="display: flex;margin:15rpx 0rpx;">
			<text style="font-weight: 550;">购买宣言</text>
		</view>
		<view style="display: flex;">
			<uni-easyinput v-model="xyvalue" type="textarea" autoHeight placeholder="众人拾柴火焰高~" @blur="xyblur" />
		</view>
	</view>
	<uni-popup ref="popup" >
		<submitPay 
			:adult="counter.adult" 
			:type="payTitle" 
			:money="myMoney" 
			:balance="counter.user_money-Number(myMoney)" 
			@ConfirmPayment="getNewMoney()">
		</submitPay>
	</uni-popup>
	
	<uni-popup ref="infopopup"  >
		<hemaiCard @close='close()' :Hemaidata='dataList'></hemaiCard>
	</uni-popup>
	<!-- 底部导航 -->
	<view class="footer" @click="Confirm">
		<view class="footer_money">
			<text>自购金额：</text>
			<text style="color: red;">{{(data.allmoney / data.NumberShare)*data.MyselfShare}}</text>
			<text>元</text>
			<text>{{tishi}}</text>
		</view>
		<view class="footer_button" @click="Confirm">
			<text style="color: #ffffff;font-size: 32rpx; margin:auto">发起合买</text>
		</view>
	</view>
</template>

<script setup>
	import api from '@/common/vmeitime-http/beting.js'
	import appi from "@/common/vmeitime-http/index.js"
	import submitPay from '@/components/main/nav/yc-submit-pay.vue'
	import hemaiCard from "@/components/common/yc-hemai-card/yc-hemai-card.vue"
	import evanSwitch from '@/components/main/evan-switch/evan-switch.vue'
	import {useCounterStore} from '@/stores/counter';
	import common from '@/common/common'
	import {onBeforeMount,ref,reactive,defineProps,getCurrentInstance} from 'vue';
	const props = defineProps(['Amount','Note','bonusmin','bonusmax','lssue','nowDeadline']) //接收传值
	
	const counter = useCounterStore(); //状态管理
	const {proxy,ctx} = getCurrentInstance()
	const payTitle=ref('')
	onBeforeMount(() => {
		init()
		if(counter.BettingContent.length == 0){
			ClassContent.value = counter.submitNewData
			ClassContent.value[0]['lssue']=props.lssue
			payTitle.value=counter.submitNewData[0].name
		}else{
			ClassContent.value = counter.BettingContent
			payTitle.value=counter.BettingContent.type
		}
	})
	const tishi=ref('')
	const ClassContent =reactive([])
	const scrollH=()=>{
		let sys = uni.getSystemInfoSync();
		let winWidth = sys.windowWidth;
		let winrate = 750/winWidth;
		let winHeight =parseInt(sys.windowHeight*winrate)
		return winHeight
	}
	
	const orderid = ref(0)
	const checkbox1 = ref(-1)
	
	const data = reactive({
		allmoney: 0, //订单总金额
		NumberShare:1, //合买份数，初始化最大
		MyselfShare:1, //自购份数，初始化1
		commission: 0.00,
		Isopen: 0, //是否公开
		declaration: '众人拾柴火焰高~', //宣言
		checkbox1 : null,
		user:null,
		guarantee:0,
	})
	const step = ref([])
	const init = () => {//numpcs 获取可选择的数字list 
		data.allmoney = props.Amount
		step.value = numpcs(data.allmoney,Number((data.allmoney / 2).toFixed(0)))
	}
	const numpcs = (num1, number) => {
		var arr = []
		for (var i = number; i >= 1; i--) {
			var num2 = num1 / i //50
			var index = num2.toString().indexOf(".")
			if (index === -1) {
				arr.push(i)
			} else {
				var res = num2.toString().split('.')
				var len = res[1].toString().split('').length
				if (len < 2) {
					arr.push(i)
				}
			}
		}
		data.NumberShare=arr[0]
		return arr
	}
	const checkboxlist = reactive([//盈利佣金选项循环数组
		{'text': '2%','value': 0.02,'none': false}, 
		{'text': '3%','value': 0.03,'none': false}, 
		{'text': '4%','value': 0.04,'none': false}, 
		{'text': '5%','value': 0.05,'none': false},
		{'text': '6%','value': 0.06,'none': false},
	])
	const guarantee = ref(false)
	const back = () => {
		uni.navigateBack()
	}
	const optionValue=ref(null)
	const change = (itme,index) => {//盈利佣金点击选择
		if(optionValue.value!=index){//选择
			optionValue.value=index 
			data.checkbox1=itme.text
			data.commission=itme.value
			// console.log(data);
		}else{//取消
			data.checkbox1=null
			data.commission=0.00
			optionValue.value=null
		}
	}
	const numChange = (e) => {	//合买份数加减框
		data.MyselfShare=1//每次增加或减少合买份数重置自购份数
		guarantee.value=false
		tishi.value=''
		if(step.value.indexOf(e)!=-1){data.NumberShare=e;return}
		if(e>data.NumberShare){//加
			for(var i=0;i<step.value.length;i++){
				if(step.value[i]<=e){
					data.NumberShare = step.value[i-1]
					break
				}
			}	
		}else{//减
			for(var i=0;i<step.value.length;i++){
				if(step.value[i]<=e){
					data.NumberShare = step.value[i]
					break
				}
			}	
		}
	}
	
	const myselfChange = (e) => {//自购份选择器
		data.MyselfShare = e
		guarantee.value=false
		tishi.value=''
	}
	
	
	const myMoney=ref(0)
	//确认发布
	const Confirm = () => {
		if(easyinput.value>data.NumberShare-data.MyselfShare){
			uni.showToast({title:'份数不能超过总份数减去自购份数',icon:'none',position:'center'})
			return
		}
		if(guarantee.value){
			if(minimum.value==0){
				myMoney.value=(data.allmoney / data.NumberShare)*data.MyselfShare*data.NumberShare
				proxy.$refs.popup.open("bottom") // 弹出支付给店主
				return
			}else{
				myMoney.value=(data.allmoney / data.NumberShare)*(Number(data.MyselfShare)+Number(easyinput.value))
				proxy.$refs.popup.open("bottom") // 弹出支付给店主
				return
			}
		}
		myMoney.value=(data.allmoney / data.NumberShare)*data.MyselfShare
		proxy.$refs.popup.open("bottom") // 弹出支付给店主
	}
	const close=()=>{
		proxy.$refs.infopopup.close("bottom") //打开订单详情
		setTimeout(()=>{
			setTimeout(()=>{
				counter.submitNewData=[]
			},500)
			uni.navigateBack({delta:2})
		},300)
	}
	const dataList = ref([])
	
	const getNewMoney=()=>{
		proxy.$refs.popup.close("bottom") // 弹出支付给店主
		
		uni.showLoading({title:'提交中~',mask:true})
		uni.request({
			url:counter.baseUrl+'/api/bettingend.mine.Transaction/notWithdraw',
			header:{'server':1,'ba-user-token':counter.access_token,},
			success(res){
				counter.user_money=Number(res.data.data.withdraw)+Number(res.data.data.not_withdraw)
				ConfirmPayment()
			},
			fail(err){
				uni.showToast({
					title:'获取金额失败',
					icon:'error',
					position:'center'
				})
				ConfirmPayment()
			}
		})
	}
	//确认支付
	const ConfirmPayment = ()=>{
		if(myMoney.value>counter.user_money){
			uni.hideLoading()
			uni.showModal({
				title: '注意',
				content: '余额不足！',
				confirmText:'立即充值',
				confirmColor:'#f04b49',
				success: function (res) {
					if (res.confirm) {
						uni.navigateTo({
							url:'/pages/home/HomeTopUp/HomeTopUp',
							animationType:'slide-in-bottom'
						})
					}
				}
			});
			return
		}
		data.guarantee=guarantee.value == false ? '0' : minimum.value==0?data.NumberShare-data.MyselfShare:easyinput.value==''?'0':easyinput.value
		var arr = []
		arr.push(data)
		
		
		if(counter.submitNewData!=''){counter.submitNewData[0]['lssue']=props.lssue}
		if(counter.BettingContent!=''){
			var delIndex=counter.BettingContent.remarks.reachType.indexOf('1单关1')
			if(delIndex != -1){
				counter.BettingContent.remarks.reachType[delIndex]='单关'
			}
		}
		api.Betjczq({
			"default":2,
			"Type":common.playType( counter.BettingContent.length == 0 ? ClassContent.value[0].name:ClassContent.value.type),
			"BetMoney":data.allmoney,
			"bonusmin":props.bonusmin,
			"bonusmax":props.bonusmax,
			"BetContent":ClassContent.value,
			"BuyingContent":arr,
			'Deadline':counter.submitNewData != ''?props.nowDeadline:common.minTiem(counter.BettingContent.Content),
			'drawDeadine':counter.submitNewData != ''?props.nowDeadline:common.maxTiem(counter.BettingContent.Content),
			'Note' :props.Note,
			'lssue' :JSON.parse(props.lssue),
		}).then((res) => {
			if(res.data.code ===1){
				appi.GetTogetherInfo({'order_id':res.data.data.order_id}).then((res)=>{
					uni.hideLoading()
					counter.submitNewData = JSON.parse(res.data.data.Order.BetContent)
					dataList.value=res.data.data.Order
					proxy.$refs.infopopup.open('bottom')
					uni.showToast({
						icon:"success",
						title: '发布成功',
						duration: 2000
					});
				}).catch((err)=>{
					uni.hideLoading()
					uni.showToast({
						title:'无法获取到合买信息，请反馈平台方',
						icon:'none',
						position:'center'
					})
				})
			}else{
				uni.showToast({
					title:res.data.msg,
					icon:'error'
				})
			}
			
		})
	}
	
	const getRadio = (e) => {
		if(e.detail.value ==='r1'){
			data.Isopen = 1
		}
		if(e.detail.value ==='r2'){
			data.Isopen = 0
		}
		
	}
	const switchchange = (e) => {
		guarantee.value = !guarantee.value
		if(guarantee.value){
			var oneMoney=(data.allmoney / data.NumberShare)*1
			var ovrfen=data.NumberShare-data.MyselfShare
			tishi.value='/保底'+(oneMoney*ovrfen).toFixed(2)+'元'
		}else{tishi.value=''}
	}
	const xyvalue = ref('')

	const xyblur =()=>{
		data.declaration = xyvalue.value
	}
	
	//全额保底选择判断
	const minimum = ref(0)
	//全额保底点击
	const minimumClick =()=>{
		if(minimum.value == 0){
			minimum.value = 1
			tishi.value=''
		}else{
			minimum.value = 0
			var oneMoney=(data.allmoney / data.NumberShare)*1
			var ovrfen=data.NumberShare-data.MyselfShare
			tishi.value='/保底'+oneMoney*ovrfen+'元'
		}
		easyinput.value= 0
	}
	
	// 合买分数框内值
	const easyinput = ref(0)
	// 合买份数自定义份数 获得焦点/失去焦点
	const easyfocus =(e)=>{
		minimum.value = 1
		if(Number(easyinput.value)<data.NumberShare-data.MyselfShare && Number(easyinput.value)!=0){return}
		easyinput.value = data.NumberShare-data.MyselfShare
		var oneMoney=data.allmoney / data.NumberShare
		var ovrfen=e?e:easyinput.value
		tishi.value='/保底'+oneMoney*ovrfen+'元'
	}
	
</script>

<style>
	.footer_money{
		flex: 1;
		text-align: center;
	}
	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color:white;
		display: flex;
		align-items: center;
		padding:15rpx;
		color: #202736;
		box-sizing: border-box;
	}
	.footer_button{
		width:250rpx;
		height:80rpx;
		text-align: center;
		line-height:80rpx;
		border-radius:20rpx;
		background-image: linear-gradient(-225deg, #202736,#202737);
	}
	.option{
		width:90rpx;
		height:50rpx;
		background-color:#f8f8f8;
		text-align: center;
		line-height:50rpx;
		border: 1rpx solid #c5c5c5;
		border-radius:5rpx;
		transition:.2s;
		
	}
	.optionClick{
		width:90rpx;
		height:50rpx;
		background-color:#FFCD1E;
		text-align: center;
		line-height:50rpx;
		border: 1rpx solid #FFCD1E;
		color:white;
		border-radius:5rpx;
		transition:.2s;
	}
	.statusBar{
		width:100%;
		height: var(--status-bar-height);
		background-color: white;
	}

	

	.box1 {
		width:680rpx;
		margin:20rpx auto;
		background-color: white;
		padding:20rpx;
		border-radius:15rpx;
	}
	body{
		background-color:#f3f3f3;
	}
</style>

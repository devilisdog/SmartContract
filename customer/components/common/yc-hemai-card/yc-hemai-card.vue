<template>
	<view class="scrollView_style">
		<view class="navBer">
			<view class="ber_left"><uni-icons type="closeempty" size="44rpx" @click="back"></uni-icons></view>
			<view class="ber_title">合买详情</view>
			<view class="ber_rigth"></view>
		</view>
		<scroll-view scroll-y="true" class="scroll-viewheight">
			<view class="logo">
				<image :src="props.Hemaidata.content[0].user_id.avatar" 
					style="width:120rpx;height:120rpx;grid-row-start:1;grid-row-end:3;border-radius:10rpx;" mode="aspectFill">
				</image>
				<text style="font-weight:600;line-height:50rpx;font-size:32rpx;">
					{{props.Hemaidata.content[0].user_id.nickname}}
				</text>
				<view style="display: flex;align-items:flex-start;justify-content: space-between;">
					<text style="font-size:26rpx;color:#e05251;">发单:{{'暂无'}}</text>
					<view style="display: flex;">
						<view style="width:20rpx;height:20rpx;background-color:#e05251;border-radius:50rpx;margin:0rpx 5rpx;"></view>
					</view>
				</view>
				<text style="margin-top:20rpx;color: #323232 ;">暂无简介</text>
			</view>
			<view class="cardSize" style="height:140rpx;margin-top:90rpx;box-shadow: 0 5rpx 15rpx #eaeaea;"></view>
			<view class="cardSize" style="box-shadow: 0 5rpx 15rpx #efefef;margin-top: 35rpx;">
				<view style="width:100%;display: flex;justify-content:space-between;align-items: center;margin-bottom:20rpx;">
					<view class="tbr" style="padding:10rpx 10rpx;background-color: white;" v-if="nowDate/1000<props.Hemaidata.Deadline">
						<text style="color: #555555;">截止时间</text>
						<showTiem :timestamp="props.Hemaidata.Deadline" color="#1B4F88" splitorColor="#1B4F88"></showTiem>
					</view>
					<view class="tbr" style="padding:10rpx 10rpx;background-color: white;text-align:center;flex:1;" v-else-if="props.Hemaidata.State=='9' || props.Hemaidata.State=='10'">
						<text style="color: #555555;">中奖</text>
						<text  style="color: #e05251;font-weight:bold;">{{props.Hemaidata.WinConten.win_money}}元</text>
					</view>
					<view class="tbr" style="padding:10rpx 10rpx;background-color: white;text-align:center;flex:1;" v-else>
						<text style="color: #555555;">{{common.orderState(props.Hemaidata.State)}}</text>
					</view>
					
					<view style="display: flex;flex-direction: row;background-color: #f8f8f8;padding: 15rpx 5rpx; border-radius: 20rpx; width: 530rpx; align-items: center;justify-content: space-evenly;">
					<view class="tbr">
						<text style="color: #afafaf ;">方案总额</text>
						<text style="color:#e05251;">￥{{props.Hemaidata.BetMoney}}</text>
					</view>
					<text style="color: #dfdfdf;">|</text>
					<view class="tbr">
						<text style="color: #afafaf ;">单份金额</text>
						<text style="color:#e05251;">￥{{props.Hemaidata.BetMoney/props.Hemaidata.NumberShare}}</text>
					</view>
					<text style="color: #dfdfdf;">|</text>
					<view class="tbr" style="padding:0rpx 10rpx;">
						<text style="color: #afafaf ;">剩余份数</text>
						<text style="color: #555555;font-weight: bold;">
							{{props.Hemaidata.NumberShare-props.Hemaidata.togetherShare}}
						</text>
					</view>
					</view>
				</view>
				
				<view style="display: flex;align-items: center;justify-content: space-between;">
					<text style="font-size: 32rpx;color: #555555;">当前购买份数<text style="color: #e05251;font-size: 32rpx;">{{props.Hemaidata.togetherShare}}</text>份</text>
					<text style="color: #a5a5a5 ;" v-show="props.Hemaidata.content.length > 4" @click="proxy.$refs.Morepopup.open('center')">查看更多></text>
				</view>
				<view style="margin-top:10rpx;display: flex;flex-wrap: wrap;">
					<view v-for="item,index in props.Hemaidata.content" :key="index" class="hemai_user_itme"
						:style="index > 3 ? 'display:none;':false">
						
						<image :src="item.user_id.avatar" style="width:80rpx;height:80rpx;border-radius:5rpx;" mode="aspectFill" />
						<text>{{item.user_id.nickname}}12312</text>
						<text style="color: #e05251;">{{item.MyselfShare}}份</text>
						<text style="color: #e05251;">{{item.OneselftMoney}}元</text>
					</view>
				</view>
			</view>
			<view class="cardSize" style="box-shadow: 0 5rpx 15rpx #efefef;margin-top: 35rpx;">
				<view style="display: flex;justify-content: space-between;align-items: center;">
					<text>合买宣言</text>
					<view>
						<text style="color: #e05251;" v-show="props.Hemaidata.info.guarantee>0">
							{{props.Hemaidata.info.guarantee+props.Hemaidata.info.MyselfShare==props.Hemaidata.NumberShare?'全额保底 | ':'保底'+props.Hemaidata.info.guarantee+'份 | '}}
						</text>
						<text style="color: #e05251;">认购中 | </text>
						<text style="color: #e05251;">{{"佣金" + Number(props.Hemaidata.info.Commission)*100+"%"}}</text>
					</view>
				</view>
				<view style="background-color: #f8f8f8;border-radius:10rpx;margin-top:20rpx;">
					<text style="padding:20rpx;white-space: normal;word-wrap: break-word ;word-break: break-all;">
						{{props.Hemaidata.info.Declaration == null ? "众人拾柴火焰高~" : common.isJson(props.Hemaidata.info.Declaration)}}
					</text>
				</view>
			</view>
			
			<view v-if="props.Hemaidata.State != '0' || cardShow() " style="display: flex;justify-content: center;">
				<view v-if="counter.BettingContent.type==='竞彩足球'" style="box-shadow: 0 5rpx 15rpx #efefef;"><jczqCard :widths='680'></jczqCard></view>
				<view v-else-if="counter.BettingContent.type==='竞彩篮球'" style="box-shadow: 0 5rpx 15rpx #efefef;"><jclqCard :widths='680'></jclqCard></view>
				<view v-else-if="counter.BettingContent.type==='胜负过关'" style="box-shadow: 0 5rpx 15rpx #efefef;"><sfggCard :widths='680'></sfggCard></view>
				<view v-else-if="counter.BettingContent.type==='北京单场'" style="box-shadow: 0 5rpx 15rpx #efefef;"><bjdcCard :widths='680'></bjdcCard></view>
				<view v-else-if="counter.BettingContent.type==='任选九'" style="box-shadow: 0 5rpx 15rpx #efefef;"><renxuan9 :widths='680'></renxuan9></view>
				<view v-else-if="counter.BettingContent.type==='胜负彩'" style="box-shadow: 0 5rpx 15rpx #efefef;"><sfcCard :widths='680'></sfcCard></view>
				<view v-else-if="counter.submitNewData[0].yeimian=='qxincai'" style="box-shadow: 0 5rpx 15rpx #efefef;"><qxcCard :widths='680'></qxcCard></view>
				<view v-else-if="counter.submitNewData[0].yeimian=='arrange5'" style="box-shadow: 0 5rpx 15rpx #efefef;"><arrange5 :widths='680'></arrange5></view>
				<view v-else-if="counter.submitNewData[0].yeimian=='happy8'" style="box-shadow: 0 5rpx 15rpx #efefef;"><kl8Card  :widths='680'></kl8Card></view>
				<view v-else-if="counter.submitNewData[0].yeimian=='qlecai'" style="box-shadow: 0 5rpx 15rpx #efefef;"><qlcCard :widths='680'></qlcCard></view>
				<view v-else-if="counter.submitNewData[0].yeimian=='arrange3'" style="box-shadow: 0 5rpx 15rpx #efefef;"><arrange3 :widths='680'></arrange3></view>
				<view v-else-if="counter.submitNewData[0].yeimian=='daletou'" style="box-shadow: 0 5rpx 15rpx #efefef;"><dltCard :widths='680'></dltCard></view>
			</view>
			<orderCard v-else :xiaoqin='props.Hemaidata'></orderCard>
			<imgCard v-show="props.Hemaidata.ReturnImages.length>0"
				:imgData="props.Hemaidata.ReturnImages">
			</imgCard>
			<view style="width:720rpx;margin:50rpx auto;">
				<uni-collapse style="border-radius:15rpx;">
					<uni-collapse-item :show-animation="true" title-border="none" :border="false">
						<template v-slot:title>
							<view style="padding:20rpx;">
								<text>订单详情</text>
							</view>
						</template>
						<view style="padding:10rpx;display: flex;flex-flow: column;border-top:1rpx solid #f7f7f7;">
							<text style="margin:10rpx 0rpx;color: #cccccc ;">
								订单编号：{{props.Hemaidata.order_id}}
							</text>
							<text style="margin:10rpx 0rpx;color: #cccccc ;">
								发起时间：{{format(props.Hemaidata.PayTime*1000)}}
							</text>
							<text style="margin:10rpx 0rpx;color: #cccccc ;">
								截止时间：{{format(props.Hemaidata.Deadline)}}
							</text>
						</view>
					</uni-collapse-item>
				</uni-collapse>
			</view>
			<view style="width: 100%;height:90rpx;"></view>
			<view class="bottomTab" v-show="props.Hemaidata.NumberShare-props.Hemaidata.togetherShare>0 && nowDate<props.Hemaidata.Deadline">
				<view style="flex: 1;text-align: center;" @click="proxy.$refs.share_popup.open();share_data=props.Hemaidata">
					<text>分享</text>
				</view>
				<view class="bouttomStyle" @click="postBuy">参与合买</view>
			</view>
		</scroll-view>
	</view>
	
	
	<!-- 参与合买的弹窗 -->
	<uni-popup type="bottom" ref="popup">
		<view style="height: 600rpx;background-color: white;border-radius: 30rpx 30rpx 0 0;">
			<view style="color: #323232;display: flex;align-items: center;justify-content: center;padding: 25rpx;">
				参与合买
			</view>
			<view style="display: flex;flex-direction: row;justify-content: space-between;padding: 30rpx 60rpx;">
				<text style="font-size: 30rpx;">购买份数</text>
				<uni-number-box @change="changeValue" :value="numberBox" :min="1" :max="props.Hemaidata.NumberShare-props.Hemaidata.togetherShare"/>
			</view>
			<view style="display: flex;flex-direction: row;justify-content: center;">
				<view v-for="item,index in partList" :key="index" @click="partClick(index)"
					:style="numberBox == item.value ? 'background-color: #1C2737;color:#fff;': props.Hemaidata.NumberShare-props.Hemaidata.togetherShare < partList[index].value ?'background-color: #f0f0f0;color:#d9d9d9;pointer-events: none;': 'background-color: #dddddd;' "
					style="width: 120rpx;height: 50rpx;border-radius: 55rpx;display: flex;align-items: center;justify-content: center;margin: 0 10rpx;">
					<text style="font-size: 30rpx;">{{item.text}}</text>
				</view>
			</view>
			<view class="chanyu">
				<view style="background-color: #eaeaea;color: #3d3d3d ;" @click="proxy.$refs.popup.close()">取消</view>
				<view style="background: #202736;color: #fff;" @click="confirmHeMai()">
					确认合买
				</view>
			</view>
		</view>
	</uni-popup>
	
	<!-- 确认支付弹出层 -->
	<uni-popup ref="tcpopup" >
		<view class="popup-subject">
			<view class="cc" @click="proxy.$refs.tcpopup.close('bottom');proxy.$refs.popup.open()">×</view>
			<view class="content">
				<view class="content-title">支付给店主</view>
				<view class="content-money">
					<view>{{'发起合买'}}：</view>
					<view style="letter-spacing: 4rpx;">
						{{numberBox*(props.Hemaidata.BetMoney/props.Hemaidata.NumberShare)}}元
					</view>
				</view>
				<view class="content-balances" style="border-bottom: none;">
					<view>剩余余额：</view>
					<view style="letter-spacing:4rpx;">
						{{counter.user_money-numberBox*props.Hemaidata.BetMoney/props.Hemaidata.NumberShare}}元
					</view>
				</view>
				<view style="background-color: #f8f8f8;width: 100%;height: 1px;margin-bottom: 15rpx;"></view>
				<view @click="getNewMoney()" class="content-button" :style="openCheckbox == true ? false : 'pointer-events:none;'" >确认支付
					<view style="background-color: #e2e2e2;width:600rpx;position: absolute;height: 65rpx;border-radius: 55rpx;transition: all 0.6s;"
						:style="openCheckbox == true ? 'opacity:0;' : 'opacity:0.4;'"></view>
					</view>
					
				<view class="clause">
					<view class="clause-choose" @click="checkboxClick()">
						<view style="width: 18rpx;height: 18rpx;border-radius: 55rpx;" :style="openCheckbox == false ? 'display:none;' : 'background-color:#ffd38b ;'"></view>
					</view>
					<text style="color: #e05251;">我已年满18周岁</text>
					<text style="margin: 0 10rpx;">已阅读并同意</text>
					<text style="color: #e05251;">《用户协议及法律声明》</text>
				</view>
			</view>
		</view>
	
	</uni-popup>
	<!-- 查看更多跟单玩家 -->
	<uni-popup ref="Morepopup">
		<ViewMore :playerData='props.Hemaidata' @close='close'></ViewMore>
	</uni-popup>
	<uni-popup ref="share_popup" type="center">
		<tgShare :order_info="share_data"></tgShare>
	</uni-popup>
</template>

<script setup>
	import jczqCard from "@/components/common/yc-dingdanxiangqing-card/yc-jingcaizuqiu/yc-jingcaizuqiu"
	import jclqCard from "@/components/common/yc-dingdanxiangqing-card/yc-jingcailanqiu/yc-jingcailanqiu.vue"
	import sfggCard from "@/components/common/yc-dingdanxiangqing-card/yc-shengfuguoguan/yc-shengfuguoguan.vue"
	import bjdcCard from "@/components/common/yc-dingdanxiangqing-card/yc-beijingdanchang/yc-beijingdanchang.vue"
	import renxuan9 from "@/components/common/yc-dingdanxiangqing-card/yc-renxuanjiu/yc-renxuanjiu.vue"
	import sfcCard from "@/components/common/yc-dingdanxiangqing-card/yc-shengfucai/yc-shengfucai.vue"
	import qxcCard from "@/components/common/yc-dingdanxiangqing-card/yc-qixingcai/yc-qixingcai.vue"
	import arrange5 from "@/components/common/yc-dingdanxiangqing-card/yc-pailiewu/yc-pailiewu.vue"
	import kl8Card from "@/components/common/yc-dingdanxiangqing-card/yc-kuaileba-zujian/yc-kuaileba-zujian.vue"
	import qlcCard from "@/components/common/yc-dingdanxiangqing-card/yc-qilicai/yc-qilicai.vue"
	import arrange3 from "@/components/common/yc-dingdanxiangqing-card/yc-pailiesan/yc-pailiesan.vue"
	import fc3dCard from "@/components/common/yc-dingdanxiangqing-card/yc-fucai3D/yc-fucai3D.vue"
	import dltCard from "@/components/common/yc-dingdanxiangqing-card/yc-daletou/yc-daletou.vue"
	import tgShare from "@/components/together/order_share.vue"
	import imgCard from "@/components/common/yc-common-BettingInfo/yc-Bettinglnfo-imgCard/yc-Bettinglnfo-imgCard.vue"
	//锁头
	import orderCard from "@/components/common/yc-common-BettingInfo/yc-BettingInfo-orderConceal.vue"
	//查看更多
	import ViewMore from "@/components/together/yc-hemaiCard-viewMore/yc-hemaiCard-viewMore.vue"
	import showTiem from '@/components/common/showTiem.vue'
	import common from "@/common/common"
	import api from '@/common/vmeitime-http/'
	import { useCounterStore } from '@/stores/counter';
	import { onBeforeMount,ref,reactive,getCurrentInstance,defineEmits,defineProps} from 'vue';
	 const {proxy,ctx} = getCurrentInstance()
	 const props = defineProps(['Hemaidata'])
	 const Emits = defineEmits(['close'])
	 const counter = useCounterStore(); //状态管理
	 const hourValue = ref(0)
	 const minuteValue = ref(0)
	 const secondValue = ref(0)
	 const nowDate=ref(0)
	 const share_data=ref([])
	 onBeforeMount(()=>{
		 nowDate.value=new Date().getTime()/1000
		 openCheckbox.value=uni.getStorageSync('isAdult')
		 props.Hemaidata.WinConten=JSON.parse(props.Hemaidata.WinConten)
	 })
	 const cardShow=()=>{//判断已合买列表是否右自己
		 var gameArr=props.Hemaidata.content
		 for(var i=0;i<gameArr.length;i++){
			 if(gameArr[i].user_id.id==counter.user_id){
				 return true
			 }
		 }
	 }
	 const NewTiem = (e,a)=>{
	 	const endTime=new Date(e)
	 	const nowTime=new Date()
	 	const difftime=(endTime - nowTime)/1000
	 	  var days = parseInt(difftime/86400); // 天  24*60*60*1000
	 	  if(a == 0){
	 		return  hourValue.value = parseInt(difftime/3600)-24*days;    // 小时 60*60 总小时数-过去的小时数=现在的小时数 
	 	  }else if(a == 1){
	 		 return minuteValue.value = parseInt(difftime%3600/60); // 分钟 -(day*24) 以60秒为一整份 取余 剩下秒数 秒数/60 就是分钟数
	 	  }else {
	 		  return  secondValue.value = parseInt(difftime%60);  // 以60秒为一整份 取余 剩下秒数
	 	  }
	 }
	 
	 function add0(m){return m<10?'0'+m:m }
	 function format(shijianchuo){
		 //shijianchuo是整数，否则要parseInt转换
		 var time = new Date(shijianchuo);
		 var y = time.getFullYear();
		 var m = time.getMonth()+1;
		 var d = time.getDate();
		 var h = time.getHours();
		 var mm = time.getMinutes();
		 var s = time.getSeconds();
		 return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
	 }
	 
	 const postBuy =()=>{
		proxy.$refs.popup.open()
	 }
	 const back=()=>{
		 Emits('close')
	 }
	 
	 const numberBox = ref(1)
	 const partClick =(e)=>{
		 numberBox.value = partList[e].value
	 }
	 const partList = reactive([
		{
			text:'1份', 
			value:1,
		},
		{
			 text:'5份',
			 value:5,
		},
		{
			 text:'10份',
			 value:10,
		},
		{
			 text:'20份',
			 value:20,
		},
		{
			 text:'全包',
			 value:props.Hemaidata.NumberShare-props.Hemaidata.togetherShare,
		}
	])
	 
	 const changeValue = (e) =>{
		 numberBox.value = e
	 }
	 const confirmHeMai =()=>{
		 proxy.$refs.popup.close()
		 proxy.$refs.tcpopup.open('bottom')
	 }
	 const getNewMoney=()=>{
		 proxy.$refs.tcpopup.close('bottom')
		 
	 	uni.showLoading({title:'提交中~'})
	 	uni.request({
	 		url:counter.baseUrl+'/api/bettingend.mine.Transaction/notWithdraw',
	 		header:{'server':1,'ba-user-token':counter.access_token,},
	 		success(res){
	 			counter.user_money=Number(res.data.data.withdraw)+Number(res.data.data.not_withdraw)
	 			openTwo()
	 		},
	 		fail(err){
	 			uni.showToast({
	 				title:'获取金额失败',
	 				icon:'error',
	 				position:'center'
	 			})
	 			openTwo()
	 		}
	 	})
	 }
	 //参与合买确认支付
	 const openTwo =()=>{
		if(counter.user_money<(numberBox.value*props.Hemaidata.BetMoney/props.Hemaidata.NumberShare)){
			//余额不足拦截
			uni.showModal({
				title: '注意',
				content: '余额不足！',
				confirmText:'立即充值',
				confirmColor:'#f04b49',
				success: function (res) {
					uni.hideLoading()
					if (res.confirm) {
						uni.navigateTo({
							url:'/pages/home/HomeTopUp/HomeTopUp',
							animationType:'slide-in-bottom'
						})
					}
				}
			});
			uni.hideLoading()
			return
		}
		 api.PostHeMai({
			 'order_id':props.Hemaidata.order_id,
			 'OneselftMoney':numberBox.value*props.Hemaidata.BetMoney/props.Hemaidata.NumberShare,
			 'MyselfShare':numberBox.value,
		}).then((res)=>{
			uni.hideLoading()
			if(res.data.code==1){
				proxy.$refs.popup.close()
				uni.showToast({title:'成功参与'});
				setTimeout(()=>{
					counter.BettingContent = []
					counter.submitNewData = []
				},500)
				Emits('close')
			}else{
				uni.showToast({
					title:res.data.data,
					icon:"error"
				});
			}
		 })
	 }
	 
	 // 18岁
	 const openCheckbox = ref(false)
	 const checkboxClick =()=>{
	 	openCheckbox.value=!openCheckbox.value
		uni.setStorageSync('isAdult',openCheckbox.value);
	 }
	const close = () =>{
		proxy.$refs.Morepopup.close('center')
	}
</script>

<style lang="scss">
	.scrollView_style{
		height:calc(100vh - 150rpx - var(--status-bar-height) - env(safe-area-inset-bottom));
		background-color:#f9f9f9;
	}
	.scroll-viewheight{
		height:calc((100vh - 150rpx - var(--status-bar-height) - env(safe-area-inset-bottom))/1.3);
	}
	.hemai_user_itme{
		display: flex;
		flex-flow: column;
		align-items: center;
		max-width:140rpx;
		flex-wrap:wrap;
		margin:25rpx 15rpx;
		text{
			max-width:140rpx;
			overflow:hidden;
			text-overflow:ellipsis;
			white-space:nowrap;
		}
	}
	.navBer{
		display: flex;
		align-items: center;
		background-color: #fff;
		border-radius:20rpx 20rpx 0 0;
		padding:20rpx;
		box-shadow:0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.4);
		.ber_title{
			text-align: center;
			font-weight: bold;
		}
		.ber_rigth{
			display: flex;
			justify-content:flex-end;
		}
		view{
			flex:1;
		}
	}
	.bottomTab{
		width:100%;
		height:90rpx;
		background-color:white;
		// position:fixed;
		// bottom:env(safe-area-inset-bottom);
		// display: flex;
		// align-items: center;
		// justify-content:space-between;
	}
	.bouttomStyle{
		flex:1.5;
		height:75rpx;
		background: #202736;
		border-radius:20rpx;
		margin-right:20rpx;
		text-align: center;
		line-height:75rpx;
		color: white;
		font-weight:600;
	}
	.tbr{
		font-size:26rpx;
		display: flex;
		flex-flow: column;
		align-items: center;
	}
	.cardSize{
		width:700rpx;
		border-radius:10rpx;
		background-color: white;
		margin:20rpx auto;
		padding:10rpx;
	}
	.logo{
		width:660rpx;
		margin-bottom:-220rpx;
		margin-left:60rpx;
		margin-top:25rpx;
		display: grid;
		grid-template-columns:150rpx auto;
		grid-template-rows:repeat(2,auto);
	}
	
	.chanyu{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin: 40rpx 30rpx;
		}.chanyu view{
			width: 330rpx;
			height: 70rpx;
			border-radius: 20rpx;
			text-align: center;
			line-height: 70rpx;
			font-size: 28rpx;
		}
		
	/* // 确认支付弹出层 */
	.popup-subject{
		width: 100%;
		height: 620rpx;
		background-color: #ffffff;
		border-radius: 20px 20px 0 0;
		}
		.popup-subject .content{
			display: flex;
			flex-direction: column;
		}
			.cc{
				width: 35rpx;
				height: 35rpx;
				border-radius: 55px;
				position: absolute;
				margin: 25rpx;
				right: 1%;
				border: 1px solid #e7e7e7;
				color: #e7e7e7;
				font-size: 30rpx;
				text-align: center;
				line-height: 35rpx;
			}
		.content-title{
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 35rpx 0;
			font-size: 34rpx;
			font-weight: 500;
			color: #393939;
			border-bottom:1rpx solid #f8f8f8;
			border-radius: 25rpx 25rpx 0 0;
		}
		.content-money , .content-balances{
			width: 700rpx;
			margin: auto;
			font-size: 25rpx;
			padding: 30rpx 0;
			border-bottom:1rpx solid #f8f8f8;
			display: flex;
			justify-content: space-between;
		}
		.content-button{
			display: flex;
			justify-content: center;
			align-items: center;
			width: 600rpx;
			margin: auto;
			padding: 10rpx 0;
			border-radius: 55rpx;
			color: #ffffff;
			background: linear-gradient( 65deg, #ffd875, #ff7979);
		}
		.clause{
			display: flex;
			align-items: center;
			margin: auto;
			margin-top: 20rpx;
			}
			.clause-choose{
				width: 30rpx;
				height: 30rpx;
				margin: 0 10px;
				border-radius: 55px;
				border: 1px solid #5a5a5a;
				color: #393939;
				font-size: 24rpx;
				display: flex;
				transition: all 1s;
				align-items: center;
				justify-content: center;
			}
			.clause text{
				color: #3d3d3d;
				font-size: 24rpx;
			}
</style>

<template>
	<view class="bottonButtom" v-if="dispose()">
		<view style="background-color: #f76767;flex:0.5;"
			  class="bottomStyle"
			   v-if='counter.orderData.State==1||counter.orderData.State==2'
			  @click="clickReject(counter.orderData.order_id,counter.orderData.State==2?'撤单':'拒单')">
			{{counter.orderData.State==2?'撤单':'拒单'}}
		</view>
		<view style="background-color: #D98462;flex:0.5;" 
			  class="bottomStyle" 
			  v-if="counter.orderData.IsCooperative==1 || counter.orderData.AllowRejection==1"
			  @click="clickReject(counter.orderData.order_id,counter.orderData.IsCooperative==1?'驳回':'甩单')">
			<text>{{counter.orderData.IsCooperative==1?'驳回':counter.orderData.AllowRejection==1?'甩单':false}}</text>
		</view>
		<view style="background-color: #f7c22e;flex:1;" 
			  class="bottomStyle" 
			  v-if="counter.orderData.State==1" 
			  @click="orderReceiving">接单
		</view>
		<view style="background-color: #f7c22e;flex:1;" 
			  class="bottomStyle" 
			  v-else-if="counter.orderData.State==2" 
			  @click="writeReport">出票
		</view>
	</view>
	<view class="bottonButtom" v-if="counter.orderData.State==9 && dispose()" style="color: white;text-align:center;line-height:80rpx;">
		<view style="flex:0.7;background-color: #f37335;" @click="proxy.$refs.setMoney.open()">
			修改中奖金额
		</view>
		<view style="flex:1;background-color: #ffaa00;" @click="clickReject(counter.orderData.order_id,'派奖')">
			派奖
		</view>
	</view>
	
	<uni-popup type="dialog" ref="setMoney">
		<uni-popup-dialog 
			mode="input" 
			title="请输入您需修改的金额" 
			@confirm="setWinMoney($event,counter.orderData.order_id)"
			placeholder="仅支持输入数字">
		</uni-popup-dialog>
	</uni-popup>
	<fui-dialog :show="show" @click="clickDialogButton" :content="dialogContent"></fui-dialog><!-- 提示对话框 -->
	<uni-popup ref="refusePopup" type="center">
		<view class="refuseCard">
			<view class="refuseCard_title">
				确定要{{dialogState}}吗？
			</view>
			<view class="refuseCard_explain">
				请完善{{dialogState}}原因，{{dialogState}}会通知彩民
			</view>
			<view class="refuseCard_buttomBox">
				<view 
					:class="index==RefuseCard_buttomValue?'refuseCard_buttom_true':'refuseCard_buttom_false'" 
					v-for="itme,index in popupButtomData" 
					@click="clickRefuseCard(index)"
				>
					{{itme}}
				</view>
				<view :class="RefuseCard_buttomValue==6?'refuseCard_buttom_custom_true':'refuseCard_buttom_custom_false'">
					<uni-easyinput 
						:inputBorder="false" 
						placeholder="自定义" 
						@focus="clickRefuseCard(6)" 
						v-model="popupCustom">
					</uni-easyinput>
				</view>
			</view>
			<view class="buttomBox">
				<view class="buttomStyle" @click="closeRefuseCard">
					取消
				</view>
				<view 
					class="buttomStyle" 
					style="border-left:1rpx solid #f1f1f1;color:#FDC830;" 
					@click="clickDialogButton({index:1})">
					确定
				</view>
			</view>
		</view>
	</uni-popup>
</template>

<script setup>
	import api from "@/common/vmeitime-http/index/index.js"
	import {
		getCurrentInstance,
		onBeforeMount,
		onMounted,
		ref,
		reactive,
		defineProps,
		defineEmits,//发送数据
	} from 'vue';
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	import {useCounterStore} from '@/stores/counter'
	const counter = useCounterStore(); //状态管理
	const clickButtonOrderID=ref(null)//点击订单按钮后的订单号
	const dialogContent=ref('')//对话内容
	const show=ref(false)//对话框是否显示
	const Emits=defineEmits(['writeReport'])
	const Props=defineProps(['order_lock','imgValue'])
	const popupCustom=ref('')//拒单或撤单自定义撤单理由数据
	const popupButtomData=reactive(//拒单或撤单理由数据
		['订单逾期','票数太多','订单较多,忙不过来','联系不到客户','中心限制订单，无法出票','来不及出票，赔率变化']
	)
	const buttomState=ref(true)//按钮是否显示的值
	const dialogState=ref(null)//对话框状态
	
	const gameList=reactive(['竞彩足球','竞彩篮球'])//控制出票确认弹窗（找得到的就弹）
	/* const writeReport=()=>{//点击出票
		var gameIndex=gameList.indexOf(counter.orderData.Type,0)
		
		//新增判断中奖金额显示是否需要上传图片修改 2023.11.3
		
		if(counter.orderData.ReturnImages.length==0 && counter.orderData.bonusmax >= counter.isneedimgnumber){return uni.showToast({title:'请上传图片~',icon:'error'})}
		if(gameIndex == -1){
			uni.showLoading({title:'出票中~',mask:true})
			api.OrderDrawDraft({"order_id":counter.orderData.order_id,"newContent":0}).then((res)=>{
				uni.hideLoading()
				if(res.data.code==1){
					uni.showToast({title:'出票成功',icon:"success",})
					uni.navigateBack()
					counter.staffLoginInfo.Info.TotalInvoicingAmount+=Number(counter.orderData.BetMoney)
				}else if(res.data.code==402){
					counter.clickOrderState=false
					// console.log(res.data);
					uni.showModal({
						title: '提示',
						content: '店铺余额不足~',
						confirmText:'立即充值',
						confirmColor:"#FDC830",
						success: function (res) {
							if (res.confirm) {
								uni.navigateTo({
									url:'/pages/mimeSupPage/balancePage/rechargePage',
									animationType:"slide-in-bottom"
								})
							}
						}
					});
				}else{
					uni.showToast({
						title:res.data.data,
						icon:'error'
					})
				}
			})
		}else{
			Emits('writeReport')
		}
	} */
	const writeReport = () => {
	    var gameIndex = gameList.indexOf(counter.orderData.Type, 0);
	
	    // 移除了对 ReturnImages 的判断逻辑
	    if (gameIndex == -1) {
	        uni.showLoading({ title: '出票中~', mask: true });
	        api.OrderDrawDraft({
	            "order_id": counter.orderData.order_id,
	            "newContent": 0
	        }).then((res) => {
	            uni.hideLoading();
	            if (res.data.code == 1) {
	                uni.showToast({ title: '出票成功', icon: "success" });
	                uni.navigateBack();
	                counter.staffLoginInfo.Info.TotalInvoicingAmount += Number(counter.orderData.BetMoney);
	            } else if (res.data.code == 402) {
	                counter.clickOrderState = false;
	                uni.showModal({
	                    title: '提示',
	                    content: '店铺余额不足~',
	                    confirmText: '立即充值',
	                    confirmColor: "#FDC830",
	                    success: function (res) {
	                        if (res.confirm) {
	                            uni.navigateTo({
	                                url: '/pages/mimeSupPage/balancePage/rechargePage',
	                                animationType: "slide-in-bottom"
	                            });
	                        }
	                    }
	                });
	            } else {
	                uni.showToast({
	                    title: res.data.data,
	                    icon: 'error'
	                });
	            }
	        });
	    } else {
	        Emits('writeReport');
	    }
	}
	
	
	const RefuseCard_buttomValue=ref(2)//用户选中的值
	const clickRefuseCard=(e)=>{//用户点击按钮触发
		if(RefuseCard_buttomValue.value!=e){
			RefuseCard_buttomValue.value=e
		}else{
			RefuseCard_buttomValue.value=null
		}
	}
	const closeRefuseCard=()=>{
		proxy.$refs.refusePopup.close()
	}
	const clickReject=(orderID,title)=>{//点击接单以外的按钮
		dialogState.value=title
		clickButtonOrderID.value=orderID
		if(dialogState.value=='拒单' || dialogState.value=='撤单'){
			proxy.$refs.refusePopup.open()
			return
			
		}
		dialogContent.value='确定'+title+'('+orderID+')'+'订单吗!!!'
		show.value=true
	}
	
	const dispose=()=>{//初始话按钮部分判断是否显示
		var state=false
		if(Props.order_lock!=1){
			var shopID=counter.shopBasicsData.shop_id?counter.shopBasicsData.shop_id:counter.shopBasicsData.id
			if(counter.orderData.OrderReceivingShop_id==shopID){
				state=true
			}else{
				state=false
			}
		}else{
			state=false
		}
		return state
	}
	
	const orderReceiving=()=>{//点击接单按钮
		uni.showLoading({title:'接单中~'})
		api.GetOrderReceiving({"order_id":counter.orderData.order_id}).then((res)=>{
			uni.hideLoading()
			if(res.data.code==1){
				uni.showToast({title:'接单成功',icon:"success"})
				counter.orderData.State="2"
			}else{
				uni.hideLoading()
				setTimeout(()=>{
					uni.showToast({
						title:res.data.data,
						icon:'error'
					})
				},500)
			}
		})
	}
	const clickDialogButton=(e)=>{//对话框点击按钮的操作
		if(RefuseCard_buttomValue.value==null){
			uni.showToast({
				title:'请选中'+dialogState.value+'理由',
				icon:'error'
			})
			return
		}
		if(e.index==1){
			uni.showLoading({title:'操作中~'})
			if(dialogState.value=='拒单'||dialogState.value=='撤单'){
				api.ShopkeeperCancellation({
					"order_id":clickButtonOrderID.value,
					'reason':RefuseCard_buttomValue.value==6?popupCustom.value:popupButtomData[RefuseCard_buttomValue.value]
				}).then(async(res)=>{
					await uni.hideLoading()
					await uni.showToast({
						title:res.data.data,
						icon:res.data.msg
					})
					await uni.navigateBack()
				})
			}else if(dialogState.value=='驳回'){
				api.GetRejectCooperationOrder({"order_id":clickButtonOrderID.value}).then(async(res)=>{
					await uni.hideLoading()
					await uni.showToast({
						title:res.data.data,
						icon:res.data.msg
					})
					await uni.navigateBack()
				})
			}else if(dialogState.value=='甩单'){
				api.GetGaveCooperationOrder({"order_id":clickButtonOrderID.value}).then(async(res)=>{
					await uni.hideLoading()
					await uni.showToast({
						title:res.data.data,
						icon:res.data.msg
					})
					await uni.navigateBack()
				})
			}else{
				api.PostAward({"order_ids":clickButtonOrderID.value}).then(async(res)=>{
					await uni.hideLoading()
					await uni.showToast({
						title:res.data.data,
						icon:res.data.msg
					})
					await uni.navigateBack()
				})
			}
		}
		show.value=false
	}
	const setWinMoney=(value,order_id)=>{//修改中奖金额
		if(!isNaN(Number(value))){//判断用户输入的是否为数字
			uni.showLoading({title:'操作中~'})
			api.PostSetWinMoney({"order_id":order_id,"order_money":Number(value)}).then((res)=>{
				uni.hideLoading()
				if(res.data.code==1){
					uni.showToast({
						title:res.data.data,
						icon:res.data.msg
					})
					counter.orderData.AwardMoney=Number(value)
				}else{
					uni.showToast({
						title:res.data.data,
						icon:'error'
					})
				}
			})
		}else{
			uni.hideLoading()
			uni.showToast({
				title:'仅支持数字！',
				icon:'none',
				position:'center'
			})
		}
	}
</script>

<style>
	.buttomBox{
		display: flex;
		margin-top:20rpx;
	}
	.buttomStyle{
		flex:1;
		height:80rpx;
		border-top:1rpx solid #f1f1f1;
		text-align: center;
		line-height:80rpx;
	}
	.refuseCard_buttom_custom_true{
		border:1rpx solid #FDC830;
		border-radius:10rpx;
		margin:10rpx;
		font-size:26rpx;
		color: #FDC830;
		width:250rpx;
	}
	.refuseCard_buttom_custom_false{
		border:1rpx solid #7f7f7f;
		border-radius:10rpx;
		margin:10rpx;
		font-size:26rpx;
		color: #7f7f7f;
		width:250rpx;
	}
	.refuseCard_buttom_true{
		padding:10rpx 50rpx;
		border:1rpx solid #FDC830;
		border-radius:10rpx;
		margin:10rpx;
		font-size:26rpx;
		color: #FDC830;
		line-height:50rpx;
	}
	.refuseCard_buttom_false{
		padding:10rpx 50rpx;
		border:1rpx solid #7f7f7f;
		border-radius:10rpx;
		margin:10rpx;
		font-size:26rpx;
		color: #7f7f7f;
		line-height:50rpx;
	}
	.refuseCard_buttomBox{
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}
	.refuseCard_explain{
		text-align: center;
		margin:20rpx 0rpx;
	}
	.refuseCard_title{
		text-align: center;
		font-size:42rpx;
		font-weight:bold;
	}
	.refuseCard{
		width:680rpx;
		background-color:white;
		border-radius:20rpx;
		padding:20rpx;
		
	}
	.bottonButtom{
		width:100%;
		height:80rpx;
		display:flex;
		position:fixed;
		bottom:0rpx;
	}
	.bottomStyle{
		text-align: center;
		line-height:80rpx;
		color: white;
	}
</style>

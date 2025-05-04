<template>
	<view class="statusBar"></view>
	<view class="uni_mySet_ber">
		<view class="ber_left"><uni-icons type="back" size="38rpx" @click="back"></uni-icons></view>
		<view class="ber_mddel">{{titleText}}</view>
		<view class="ber_rigth"><uni-icons type="trash" size="38rpx" @click="isOpenDialog=true"></uni-icons></view>
	</view>
	<scroll-view :scroll-y="true" class="scroll-view_style" :scroll-with-animation="scroll_isAmin" :scroll-into-view="scroll_view_showId" upper-threshold="100" @scrolltoupper="loadingData" :style="{height:Scroll_heigth+'px'}">
		<uni-load-more :status="loadingStates"></uni-load-more>
		<view v-for="itme,index in ShowData" :key="itme.id" :id="'item'+itme.createtime">
			<view class="pop_up" v-if="ShowData[index-1] && getTimeDifferenceInMinutes(ShowData[index-1].createtime,itme.createtime)>5">{{dateShowStyle(itme.createtime)}}</view>
			<view class="chat_box_my_image_rigth" v-if="itme.from == counter.user_id && itme.chat_type=='image'"><!-- 我 -->
				<image 
					:src="itme.content" 
					class="contnet_image"  
					lazy-load :lazy-load-margin="0" 
					:mode="itme.image_type" @click="checkImage([itme.content])" @longpress="longpressSet(itme,index)">
				</image>
				<image :src="counter.user_imgs" class="logo_style" lazy-load :lazy-load-margin="0"></image>
			</view>
			<view class="chat_box_my_image_left" v-else-if="itme.from != counter.user_id && itme.chat_type=='image'">
				<image 
					:src="itme.user_log" 
					class="logo_style" lazy-load :lazy-load-margin="0"
				/>
				<view style="display: flex;flex-flow: column;">
					<text class="user_name" style="margin:0rpx 0rpx 10rpx 20rpx;">{{itme.user_name}}</text>
					<image
						:src="itme.content" 
						class="contnet_image" lazy-load :lazy-load-margin="0" 
						:mode="itme.image_type" @click="checkImage([itme.content])" @longpress="longpressSet(itme,index)">
					</image>
				</view>
			</view>
			<view class="pop_up" v-else-if="itme.chat_type=='hint'">{{itme.content}}</view>
			<view class="chat_box_my"  v-else-if="itme.from == counter.user_id" >
				<!-- 我 -->
				<view class="chat_content_box" @longpress="longpressSet(itme,index)">
					<div class="chat_triangle"></div>
					<text>{{itme.content}}</text>
				</view>
				<image :src="counter.user_imgs" class="logo_style" lazy-load :lazy-load-margin="0"></image>
			</view>
			<view class="chat_box_shop" v-else >
				<image :src="itme.user_log" class="logo_style" />
				<view class="left_chat" @longpress="longpressSet(itme,index)">
					<text class="user_name">{{itme.user_name}}</text>
					<view class="chat_content_box">
						<div class="chat_triangle"></div>
						<text>{{itme.content}}</text>
					</view>
				</view>
			</view>
		</view>
		<view style="width:100%;height:20rpx;"></view>
	</scroll-view>
	<view class="bottm_from" :style="{bottom:inputLoc+'px'}">
		<input :adjust-position="false" v-model="myChatContent" @keyboardheightchange="clickInput" class="inputStyle"/>
		<uni-icons type="plus-filled" size="62rpx" @click="openMoreFunc"></uni-icons>
		<view :class="myChatContent==''?'send_false':'send_true'" @touchend.prevent="sendMessage(myChatContent)">
			发送
		</view>
	</view>
	<fui-dialog
		:show="isOpenDialog" 
		content="确定删除聊天记录吗？注意聊天记录一旦删除无法恢复喔!!!"
		@click="clickDialog" 
	/>
	<uni-popup ref="openSet" type="bottom">
		<view class="setBox">
			<view class="setButton" v-for="itme,index in chatSetData" @click="clickSetChat(itme)">{{itme.title}}</view>
		</view>
	</uni-popup>

	<!-- 发送更多功能 -->
	<uni-popup ref="moreFunc" type="bottom" :mask-click="true">
		<view class="more-func-box" :style="{height: inputLoc+'px'}">
			<view class="func-item" @click="selectImage">
				<uni-icons type="image" size="60rpx" color="#666"></uni-icons>
				<text>图片</text>
			</view>
			<view class="func-item" @click="clickRedPacket">
				<uni-icons type="gift" size="60rpx" color="#666"></uni-icons>
				<text>红包</text>
			</view>
		</view>
	</uni-popup>
	
	<!-- 红包弹窗 -->
	<uni-popup ref="redPacketPopup" type="bottom" :mask-click="true">
		<view class="redPacket-box">
			<view class="redPacket-header">
				<text class="redPacket-title">发红包</text>
				<uni-icons type="closeempty" size="24" color="#666" @click="closeRedPacket"></uni-icons>
			</view>
			<view class="redPacket-content">
				<view class="redPacket-item">
					<text class="redPacket-label">红包金额</text>
					<input type="digit" v-model="redPacketAmount" class="redPacket-input" placeholder="请输入金额" />
				</view>
				<view class="redPacket-fixed-amounts">
					<view class="fixed-amount-item" :class="{'active': redPacketAmount == 10}" @click="setFixedAmount(10)">10</view>
					<view class="fixed-amount-item" :class="{'active': redPacketAmount == 50}" @click="setFixedAmount(50)">50</view>
					<view class="fixed-amount-item" :class="{'active': redPacketAmount == 100}" @click="setFixedAmount(100)">100</view>
					<view class="fixed-amount-item" :class="{'active': redPacketAmount == 200}" @click="setFixedAmount(200)">200</view>
				</view>
				<view class="redPacket-item">
					<text class="redPacket-label">红包数量</text>
					<input type="number" v-model="redPacketCount" class="redPacket-input" placeholder="请输入数量" />
				</view>
				
				<view class="redPacket-info" v-if="canCalculateAmount">
					<text>每个红包金额：{{(redPacketAmount / redPacketCount).toFixed(2)}} 元</text>
				</view>
				
				<view class="redPacket-button" @click="sendRedPacket">发送红包</view>
			</view>
		</view>
	</uni-popup>
</template>

<script setup>
	import {onBeforeMount,ref,reactive,getCurrentInstance,defineProps,watch,nextTick,computed} from 'vue';
	import { useCounterStore } from '@/stores/counter'// 状态管理
	import {onShow,onBackPress} from "@dcloudio/uni-app"
	import api from "@/common/vmeitime-http/index.js"
	const Props=defineProps(['shop_id','chatType'])
	const counter = useCounterStore();
	// 参数
	const {proxy,ctx} = getCurrentInstance()
	const myChatContent=ref('')//输入框内容v-model
	const titleText=ref('')//title显示内容
	const scroll_view_showId=ref('')//控制滚动区域显示子元素（id）
	const scroll_isAmin=ref(false)//设置滚动时是否开启动画
	const isOpenDialog=ref(false)//显示dialog控制器
	const isLoading=ref(false)//是否正在触发加载（用于避免重复执行加载更多）
	const loadingStates=ref('more')//more=加载前、loading=加载中、no-more=没有数据了
	const ShowData = reactive([
		{ id: 'msg-1', content: '这是第 1 条消息', createtime: Math.floor(Date.now() / 1000) - 60, from: 'user_id_1', chat_type: 'text', user_log: 'user_image_1', user_name: '用户1' },
		{ id: 'msg-2', content: '这是第 2 条消息', createtime: Math.floor(Date.now() / 1000) - 120, from: 'user_id_2', chat_type: 'imge', user_log: 'user_image_2', user_name: '用户2' },
		{ id: 'msg-3', content: '这是第 3 条消息', createtime: Math.floor(Date.now() / 1000) - 180, from: 'user_id_1', chat_type: 'hint', user_log: 'user_image_1', user_name: '用户1' },
		{ id: 'msg-4', content: '这是第 4 条消息', createtime: Math.floor(Date.now() / 1000) - 240, from: 'user_id_2', chat_type: 'text', user_log: 'user_image_2', user_name: '用户2' },
		{ id: 'msg-5', content: '这是第 5 条消息', createtime: Math.floor(Date.now() / 1000) - 300, from: 'user_id_1', chat_type: 'text', user_log: 'user_image_1', user_name: '用户1' },
		{ id: 'msg-50', content: '这是第 50 条消息', createtime: Math.floor(Date.now() / 1000) - 3000, from: 'user_id_2', chat_type: 'text', user_log: 'user_image_2', user_name: '用户2' },
	]);
	const inputLoc=ref(0)//输入框距离底部高度
	const Scroll_heigth=ref(0)//聊天记录滚动区域高度
	const chatSetData=reactive([])//聊天设置按钮
	const moreFunc = ref(null)
	const redPacketPopup = ref(null)
	const redPacketAmount = ref('')
	const redPacketCount = ref(1)
	
	const canCalculateAmount = computed(() => {
		return redPacketAmount.value > 0 && redPacketCount.value > 0
	})
	
	const setFixedAmount = (amount) => {
		redPacketAmount.value = amount
	}
	
	const closeRedPacket = () => {
		proxy.$refs.redPacketPopup.close()
	}
	
	const sendRedPacket = () => {
		if (!redPacketAmount.value || !redPacketCount.value) {
			uni.showToast({
				title: '请输入有效的金额和数量',
				icon: 'none'
			})
			return
		}
		
		const amount = parseFloat(redPacketAmount.value)
		const count = parseInt(redPacketCount.value)
		
		if (amount <= 0 || count <= 0) {
			uni.showToast({
				title: '金额和数量必须大于0',
				icon: 'none'
			})
			return
		}
		
		const eachAmount = (amount / count).toFixed(2)
		
		// 在这里可以添加发送红包的逻辑
		uni.showToast({
			title: `成功发送总额为${amount}元的${count}个红包`,
			icon: 'none'
		})
		
		// 关闭红包弹窗
		proxy.$refs.redPacketPopup.close()
		
		// 清空输入
		redPacketAmount.value = ''
		redPacketCount.value = 1
	}
	
	const clickRedPacket = () => {
		proxy.$refs.redPacketPopup.open()
		proxy.$refs.moreFunc.close()
	}
	/*
		@socketPost {
			@type 		private 私聊, public 群聊, postId 传递参数
			@from 		谁发的
			@to   		发给谁的
			@content 	内容
		}
	*/
	const pageQuantity=ref(20)//每页聊天数量
	onShow(()=>{// 页面显示触发
		titleText.value=Props.chatType=='private'?'私聊店主('+Props.shop_id+')':Props.shop_id+'店铺群聊'
		readData()
		setScroll_heigth(false)
	})
	const setScroll_heigth=(boole)=>{//获取滚动区域高度
		var myTopber=0
		var buttom_heigth=0
		nextTick(()=>{
			uni.createSelectorQuery().select('.uni_mySet_ber').boundingClientRect((data)=>{
				myTopber=data.height
				uni.createSelectorQuery().select('.bottm_from').boundingClientRect((data)=>{
					buttom_heigth=data.height
					calculate()
				}).exec()
			}).exec()
		})
		function calculate(){
			var allHeigth=uni.getSystemInfoSync().windowHeight//页面总高度
			var statesHeigth=uni.getSystemInfoSync().statusBarHeight//app状态栏高度
			Scroll_heigth.value=allHeigth-statesHeigth-myTopber-buttom_heigth-inputLoc.value
			nextTick(()=>{
				returnBottom(boole)
			})
		}
	}
	const checkImage=(imageArr)=>{//图片预览
		uni.previewImage({
			urls:imageArr,
			imageArr:'default',
		})
	}
	const testImage=reactive([])
	const selectImage=()=>{//用户选择发送的图片
		uni.chooseImage({//图片选择
			count:1,
			success(res){
				uni.getImageInfo({//获取用户选择的图片信息
					src:res.tempFilePaths[0],
					success(info){
						var type=info.width>info.height?'widthFix':'heightFix'
						upImage(res.tempFilePaths[0],type)
					},
					fail(){
						upImage(res.tempFilePaths[0],'heightFix')
					}
				})
			}
		})

		// 上传图片
		function upImage(upUrl,type){
			uni.showLoading({title:'',mask:true})
			var nowTime=new Date().getTime()
			uni.uploadFile({
			    url:counter.baseUrl+'/api/common.Common/upload2',
			    header:{server:1, "ba-user-token":uni.getStorageSync('access_token')},
			    filePath:upUrl,
			    name:'file',
				formData:{"type":'worker',"name":nowTime},
			    success(res){
					var newData=JSON.parse(res.data)
					if(isJSON(res.data) && newData.code==1){
						var socketPost = {
							'type' :Props.chatType,
							'from' :counter.user_id,
							'to' :Props.chatType=='public'?'':Props.shop_id,
							'content':newData.data.file,
							'user_info':{
								'user_logo':counter.user_imgs,
								'user_name':counter.nickname,
								'showMode':type
							}
						}
						uni.sendSocketMessage({
							data:JSON.stringify(socketPost),
							fail(err){uni.showToast({title:'信息发送失败~',icon:'none'})}
						});
					}else{
						uni.showToast({title:'图片上传失败~',icon:'error'})
					}
			    },
				complete(){uni.hideLoading()}
			})
		}
	}
	
	watch(()=>counter.chatPageExecute_user,(newV,odlV)=>{
		if(newV.type==='push' && newV.info.type==Props.chatType){//添加
			ShowData.push(newV.info)
			returnBottom(true)
		}
		if(newV.type==='hint'){//撤回
			// console.log('hint',newV);
		}
	})
	const last_id=ref(0)//上次加载前头部的id
	const loadingData=()=>{//下拉触发加载更多聊天记录
		if(isLoading.value){return}//避免重复执行拦截
		loadingStates.value='loading'
		isLoading.value=true
		last_id.value=ShowData[0].createtime
		setTimeout(()=>{
			isLoading.value=false
			loadingStates.value='more'
			readData()
			scroll_isAmin.value=false
			nextTick(()=>{scroll_view_showId.value=`item${last_id.value}`})
		},800)
	}
	const dateShowStyle=(chatTime)=>{//返回时间显示样式
		var newNow=new Date()//用户当前时间
		var newCahteTime=new Date(chatTime*1000)//聊天记录的时间
		if(
			newNow.getFullYear() === newCahteTime.getFullYear() &&
			newNow.getMonth() === newCahteTime.getMonth() && 
			newNow.getDate() === newCahteTime.getDate()
		){//如果是同一天的就只显示小时+分钟的时间
		
			return newCahteTime.getHours()+':'+(newCahteTime.getMinutes()<10?'0'+newCahteTime.getMinutes():newCahteTime.getMinutes())
		}else if(newNow.getFullYear() === newCahteTime.getFullYear()){//如果是同年的
			return newNow.getMonth()+1+'-'+newCahteTime.getDate()+' '+newCahteTime.getHours()+':'+newCahteTime.getMinutes()
		}else{
			return newCahteTime.getFullYear()+'-'+newNow.getMonth()+1+'-'+newCahteTime.getDate()+' '+newCahteTime.getHours()+':'+newCahteTime.getMinutes()
		}
	}
	const longpressSet=(chatInfo,index)=>{//长按聊天记录触发
		chatSetData.length=0//初始化设置按钮数据
		var two={id:1,title:'删除消息',setIndex:index,chat_id:chatInfo.id}
		chatSetData.push(two)
		//发送信息时间与当前时间相差几分钟
		var differen=getTimeDifferenceInMinutes(new Date().getTime()/1000,chatInfo.createtime)
		if(chatInfo.from==counter.user_id && differen<5){//如果消息来自自己并且发送时间与当前时间小于五分钟就渲染撤回消息
			var one={id:0,title:'撤回消息',setIndex:index,chat_id:chatInfo.id}
			chatSetData.push(one)
		}
		proxy.$refs.openSet.open()//打开设置弹窗
	}
	const clickSetChat=(e)=>{//点击弹出的设置项
		if(e.id==1){//删除本地消息
			counter.user_chatList.messages[e.setIndex].content='你删除了一条本地消息记录'
			ShowData[e.setIndex].content='你删除了一条本地消息记录'
			counter.user_chatList.messages[e.setIndex]['hint']='hint'
			ShowData[e.setIndex]['chat_type']='hint'
		}else{//消息撤回
			var socketPost = {
				'type' :'revocation',
				'from' :counter.user_id,
				'to' :Props.chatType=='public'?'':Props.shop_id,
				'content' :e.chat_id,
			}
			uni.sendSocketMessage({
				data:JSON.stringify(socketPost),
				success(){
					counter.user_chatList.messages[e.setIndex].content='你撤回了一条消息'
					ShowData[e.setIndex].content='你撤回了一条消息'
					counter.user_chatList.messages[e.setIndex]['chat_type']='hint'
					ShowData[e.setIndex]['chat_type']='hint'
				}
			});
			
		}
		proxy.$refs.openSet.close()
	}
	function getTimeDifferenceInMinutes(timestamp1, timestamp2) {  //获取两个时间戳相差几分钟
	    var date1 = new Date(timestamp1 * 1000); //将时间戳转换为毫秒  
	    var date2 = new Date(timestamp2 * 1000);  
	    var timeDifferenceInSeconds = Math.abs(date2.getTime() - date1.getTime()); //取绝对值，因为两个时间戳可能一个在未来，一个在过去  
	    var timeDifferenceInMinutes = timeDifferenceInSeconds / 1000 / 60; //将秒转换为分钟  
	  
	    return timeDifferenceInMinutes;  
	}  
	const readData=()=>{//读取当前页数的数据
		var dataLength=counter.user_chatList.messages.length-1-ShowData.length
		if(dataLength<0){//无数据拦截
			isLoading.value=true
			loadingStates.value='no-more'
			return
		}
		for(var i=0;i<pageQuantity.value;i++){
			if(counter.user_chatList.messages[dataLength]){
				ShowData.unshift(counter.user_chatList.messages[dataLength])
				dataLength--
			}else{
				isLoading.value=true
				loadingStates.value='no-more'
				break
			}
		}
	}
	const clickInput=(e)=>{//键盘键盘高度触发
		inputLoc.value=e.detail.height
		nextTick(()=>{
			setScroll_heigth(true)
			if(proxy.$refs.moreFunc.isOpen) {
				proxy.$refs.moreFunc.open()
			}
		})
	}
	const returnBottom=(boole)=>{//返回底部
		scroll_isAmin.value=boole
		if(ShowData.length>0){
			nextTick(()=>{
				scroll_view_showId.value=`item${ShowData[ShowData.length - 1].createtime}`
			})
		}
	}
	const clickDialog=(e)=>{//聊天记录删除弹窗按钮事件
		isOpenDialog.value=false
		if(e.index===1){
			counter.user_chatList.messages=[]
			var nowTime=Number(new Date().getTime()/1000).toFixed(0)
			counter.user_chatList.messages.push({
				content:'你清理了本地存储的聊天记录',
				createtime:nowTime,
				from:counter.user_id,
				id: '',
				hint:'hint',
				to:Props.chatType=='public'?'':Props.shop_id,
				type:Props.chatType,
				visit:"[]",
			})
			ShowData.length=0
			readData()
		}
	}
	const sendMessage=(msg)=>{//发送消息
		var linkRegex = /^(?:(http|https|ftp):\/\/)?((?:[\w-]+\.)+[a-z0-9]+)((?:\/[^/?#]*)+)?(\?[^#]+)?(#.+)?$/i
		var newMsg=extractURL(msg)
		if(newMsg && linkRegex.test(newMsg)){//链接发送拦截
			uni.showToast({title:'请勿发送链接~',icon:'none'})
			return
		}
		var nowTime=Number(new Date().getTime()/1000).toFixed(0)
		var socketPost = {
			'type' :Props.chatType,
			'from' :counter.user_id,
			'to' :Props.chatType=='public'?'':Props.shop_id,
			'content' :msg,
			'user_info':{'user_logo':counter.user_imgs,'user_name':counter.nickname}
		}
		uni.sendSocketMessage({
			data:JSON.stringify(socketPost),
			success(res){
				myChatContent.value = ''
			},
			fail(err){
				uni.showToast({title:'信息发送失败~',icon:'none'})
			}
		});
	}
	function isJSON(str) {//判断字符串是否是json
	    if (typeof str == 'string') {
	        try {
	            var obj=JSON.parse(str);
	            if(typeof obj == 'object' && obj ){
	                return true;
	            }else{
	                return false;
	            }
	
	        } catch(e) {
	            return false;
	        }
	    }
	}
	function extractURL(str) {//链接截取
		var regex = /:\/\/(.[^]*?)\//;  
		var match = str.match(regex); 
		if (match) {  
			return match[1];  
		}else{ 
			return false;  
		}  
	}
	onBackPress(()=>{
		if(counter.user_chatList.unreadMessages>0){
			counter.user_chatList.unreadMessages=0
		}
		setTimeout(()=>{
			counter.user_chatList=[]
			counter.chatPageExecute_user=''
		},300)
	})
	const back=()=>{
		if(counter.user_chatList.unreadMessages>0){
			counter.user_chatList.unreadMessages=0
		}
		setTimeout(()=>{
			counter.user_chatList=[]
			counter.chatPageExecute_user=''
		},300)
		uni.navigateBack()
	}
	const openMoreFunc = () => {
		proxy.$refs.moreFunc.open()
	}
</script>

<style lang="scss">
	.setBox{
		width:100%;
		border-radius:20rpx 20rpx 0 0;
		background-color: #fff;
		padding-bottom:20rpx;
		.setButton{
			width:100%;
			border-bottom:1rpx solid #e2e2e2;
			height:100rpx;
			background-color: #fff;
			text-align:center;
			line-height: 100rpx;
			border-radius:20rpx 20rpx 0 0;
		}
	}
	.pop_up{
		width:100%;
		text-align: center;
		padding:20rpx 0;
		color: #909090;
		font-size:26rpx;
	}
	.chat_box_my_image_rigth{
		display: flex;
		justify-content:flex-end;
		margin:20rpx auto;
		width: 680rpx;
		padding:0rpx 20rpx;
	}
	.contnet_image{
		margin:0rpx 20rpx;
		max-width:550rpx;
	}
	.chat_box_my_image_left{
		display: flex;
		justify-content:flex-start;
		margin:20rpx auto;
		width: 680rpx;
		padding:0rpx 20rpx;
	}
	
	.inputStyle{
		background-color:#e6e6e6;
		width:470rpx;
		padding:10rpx;
		border-radius:10rpx;
		margin-right: 20rpx;
	}
	.nullData_box{
		image{
			width:500rpx;
			height:500rpx;
		}
		text{
			margin-top:20rpx;
			color: #909090;
		}
		width:600rpx;
		height:600rpx;
		position:fixed;
		top:calc(50% - 300rpx);
		left: calc(50% - 300rpx);
		text-align:center;
	}
	.scroll-view_style{
		width:100%;
		height:calc(100vh - 100rpx - 100rpx - 20rpx);
		box-sizing: border-box;
		transition: all 0.3s;
	}
	.statusBar{
		width:100%;
		height:var(--status-bar-height);
		background-color:white;
	}
	.uni_mySet_ber{
		width:100%;
		padding:20rpx;
		background-color: #fff;
		display: flex;
		align-items: center;
		box-sizing: border-box;
		.ber_rigth{
			text-align: right;
		}
		view{
			flex:0.5;
		}
		.ber_mddel{
			text-align: center;
			font-weight: bold;
			flex:1;
		}
	}
	.bottm_from{
		width:100%;
		padding:20rpx;
		align-items: center;
		background-color:#ffffff;
		border-top:1rpx solid #e8e8e8;
		box-sizing: border-box;
		display: flex;
		position: absolute;
		bottom:0rpx;
		left:0rpx;
		transition:all 0.1s;
		.send_true{
			background-image: linear-gradient(-225deg, #202736,#202737);
			color:#fff;
			font-weight:bold;
			border-radius:10rpx;
			width:120rpx;
			height:65rpx;
			margin-left:20rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			transition:all 0.3s;
			font-size:28rpx;
		}
		.send_false{
			background-image: linear-gradient(-225deg, #202736,#202737);
			opacity:0.6;
			color:#fff;
			font-weight:bold;
			border-radius:10rpx;
			width:120rpx;
			margin-left:20rpx;
			height:65rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			pointer-events: none;
			transition:all 0.3s;
			font-size:28rpx;
		}
		
	}
	.chat_box_shop{
		display: flex;
		justify-content:flex-start;
		margin:20rpx auto;
		width: 680rpx;
		padding:0rpx 20rpx;
		.left_chat{
			display: flex;
			flex-flow: column;
			align-items: flex-start;
			.chat_content_box{
				background-color:#fff;
				margin-left:20rpx;
				padding:10rpx 20rpx;
				box-sizing: border-box;
				display:flex;
				align-items:center;
				word-break:break-all;
				border-radius:10rpx;
				position: relative;
				max-width:calc(680rpx - 20rpx - 70rpx);
				box-shadow:0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.4);
				.chat_triangle{
					width:0;
					height:0;
					border-top:15rpx solid transparent;
					border-bottom:15rpx solid transparent;
					border-right:15rpx solid #fff;
					position:absolute;
					left:-13rpx;
					top:5rpx;
					z-index:2;
				}
			}
			
		}
	}
	.user_name{
		font-size:26rpx;
		margin:-10rpx 0rpx 10rpx 20rpx;
		color: #909090;
	}
	.chat_box_my{
		display: flex;
		justify-content:flex-end;
		margin:20rpx auto;
		width: 680rpx;
		padding:0rpx 20rpx;
		.chat_content_box{
			background-color:#98E165;
			margin-right:20rpx;
			padding:10rpx 20rpx;
			box-sizing: border-box;
			display:flex;
			align-items:center;
			word-break:break-all;
			border-radius:10rpx;
			position: relative;
			max-width:calc(680rpx - 20rpx - 70rpx);
			.chat_triangle{
				width:0;
				height:0;
				border-top:15rpx solid transparent;
				border-bottom:15rpx solid transparent;
				border-left:15rpx solid #98E165;
				position:absolute;
				right:-13rpx;
				top:5rpx;
				z-index:2;
			}
		}
	}
	.logo_style{
		width:70rpx;
		border-radius:5rpx;
		height:70rpx;
	}
	.header{
		background-color:#fff;
		height: var(--status-bar-height);
		width:100%;
	}
	body{
		background-color:#f3f3f3;
	}
	.more-func-box {
		width: 100%;
		background-color: #f5f5f5;
		padding: 30rpx;
		box-sizing: border-box;
		display: flex;
		flex-wrap: wrap;
		
		.func-item {
			width: 120rpx;
			height: 120rpx;
			margin: 20rpx 30rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			
			text {
				font-size: 24rpx;
				color: #666;
				margin-top: 10rpx;
			}
		}
	}
	
	// 红包弹窗样式
	.redPacket-box {
		width: 100%;
		background-color: #fff;
		border-radius: 20rpx 20rpx 0 0;
		overflow: hidden;
		
		.redPacket-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 30rpx;
			border-bottom: 1rpx solid #f2f2f2;
			
			.redPacket-title {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
			}
		}
		
		.redPacket-content {
			padding: 30rpx;
			
			.redPacket-item {
				margin-bottom: 30rpx;
				
				.redPacket-label {
					display: block;
					font-size: 28rpx;
					color: #333;
					margin-bottom: 20rpx;
				}
				
				.redPacket-input {
					width: 100%;
					height: 80rpx;
					background-color: #f5f5f5;
					border-radius: 10rpx;
					padding: 0 20rpx;
					box-sizing: border-box;
					font-size: 28rpx;
				}
			}
			
			.redPacket-fixed-amounts {
				display: flex;
				flex-wrap: wrap;
				margin-bottom: 30rpx;
				
				.fixed-amount-item {
					width: 150rpx;
					height: 70rpx;
					background-color: #f5f5f5;
					border-radius: 10rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-right: 20rpx;
					margin-bottom: 20rpx;
					font-size: 28rpx;
					color: #333;
					
					&.active {
						background-color: #ff5252;
						color: #fff;
					}
				}
			}
			
			.redPacket-info {
				padding: 20rpx;
				background-color: #f8f8f8;
				border-radius: 10rpx;
				margin-bottom: 30rpx;
				text-align: center;
				font-size: 28rpx;
				color: #ff5252;
			}
			
			.redPacket-button {
				width: 100%;
				height: 90rpx;
				background-image: linear-gradient(-225deg, #ff5252, #ff3333);
				color: #fff;
				border-radius: 10rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 32rpx;
				font-weight: bold;
			}
		}
	}
</style>

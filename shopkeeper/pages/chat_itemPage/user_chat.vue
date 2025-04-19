<template>
	<view class="statusBar"></view>
	<view class="uni_mySet_ber">
		<view class="ber_left"><uni-icons type="back" size="38rpx" @click="back"></uni-icons></view>
		<view class="ber_mddel">{{Props.user_name}}</view>
		<view class="ber_rigth"></view>
	</view>
	<scroll-view :scroll-y="true" class="scroll-view_style" :scroll-with-animation="scroll_isAmin" :scroll-into-view="scroll_view_showId"  upper-threshold="100" @scrolltoupper="loadingMore" :style="{height:Scroll_heigth+'px'}">
		<uni-load-more :status="loadingState" :contentText="{contentdown:'下拉显示更多'}" />
		<view v-for="itme,index in showChatData" :key="itme.id" :id="'item'+itme.id">
			<view class="pop_up" v-if="showChatData[index-1] && getTimeDifferenceInMinutes(showChatData[index-1].create_time,itme.create_time)>5">
				{{dateShowStyle(itme.create_time)}}
			</view>
			<view class="chat_box_my_image_rigth" v-if="itme.from == counter.shopBasicsData.id && itme.chat_type=='image'" >
				<!-- 我 -->
				<image 
					:src="itme.content" 
					class="contnet_image"  
					lazy-load :lazy-load-margin="0" 
					:mode="itme.image_type" @click="checkImage([itme.content])" @longpress="openSet(itme,index)">
				</image>
				<image :src="counter.shopBasicsData.avatar" class="logo_style" lazy-load :lazy-load-margin="0"></image>
			</view>
			<view class="chat_box_my_image_left" v-else-if="itme.from != counter.shopBasicsData.id && itme.chat_type=='image'">
				<image 
					:src="itme.user_logo?itme.user_logo:counter.chatData.chat_logo" 
					class="logo_style" lazy-load :lazy-load-margin="0">
				</image>
				<view style="display: flex;flex-flow: column;">
					<text class="user_name">
						{{itme.user_name?itme.user_name:counter.chatData.chat_name}}
					</text>
					<image 
						:src="itme.content" 
						class="contnet_image" lazy-load :lazy-load-margin="0" 
						:mode="itme.image_type" @click="checkImage([itme.content])" @longpress="openSet(itme,index)">
					</image>
				</view>
			</view>
			<view class="pop_up" v-else-if="itme.chat_type=='hint'">{{itme.content}}</view>
			<view class="chat_box_my"  v-else-if="itme.from == counter.shopBasicsData.id">
				<!-- 我 -->
				<view class="chat_content_box"  @longpress="openSet(itme,index)">
					<div class="chat_triangle"></div>
					<text>{{itme.content}}</text>
				</view>
				<image :src="counter.shopBasicsData.avatar" class="logo_style"></image>
			</view>
			<view class="chat_box_shop" v-else >
				<image :src="itme.user_logo?itme.user_logo:counter.chatData.chat_logo" class="logo_style" />
				<view class="left_chat" @longpress="openSet(itme,index)">
					<text class="user_name">{{itme.user_name?itme.user_name:counter.chatData.chat_name}}</text>
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
		<uni-icons type="image-filled" size="62rpx" style="margin-right:20rpx;" @click="selectImage" />
		<input :adjust-position="false" v-model="myChatContent" @keyboardheightchange="clickInput" class="inputStyle"/>
		<view :class="myChatContent==''?'send_false':'send_true'" @touchend.prevent="msgSend(myChatContent)">发送</view>
	</view>
	<uni-popup ref="setCaht" type="bottom">
		<view class="setChatCard">
			<view class="operation" v-for="itme,index in buttonInfo" :style="index==0?'border-radius:20rpx 20rpx 0 0;':''" @click="clickSet(itme)">
				{{itme.title}}
			</view>
			<view class="closePopup" @click="proxy.$refs.setCaht.close()">取消</view>
		</view>
	</uni-popup>
</template>

<script setup>
	import {onBeforeMount,ref,reactive,getCurrentInstance,onMounted,defineProps,nextTick,watch} from 'vue';
	import { useCounterStore } from '@/stores/counter'//状态管理
	import {onBackPress} from "@dcloudio/uni-app"
	import api from "@/common/vmeitime-http/index/index.js"
	const counter = useCounterStore(); 
	const Props=defineProps(['user_id','type','user_name'])
	// 参数
	const {proxy,ctx} = getCurrentInstance()
	const myChatContent=ref('')//输入框v-model
	const loadingState=ref('more')//加载更多值（more==加载跟多、loading==加载中、no-more==没有数据了）
	const scroll_isAmin=ref(true)//滚动器是否显示动画控制
	
	const showChatData=reactive([])//加载的聊天记录
	const scroll_view_showId=ref(null)//显示内容id控制
	const offViewId=ref(0)//上一次最新的聊天记录id
	const testAllChatData=reactive([])
	const isLoading=ref(false)//是否有加载中正在执行
	const pageNumber=ref(1)//当前第几页
	const newShowDataLength=ref(0)//当前显示的聊天记录长度
	const inputLoc=ref(0)//键盘高度
	const Scroll_heigth=ref(100)//滚动区域高度
	const buttonInfo=reactive([])//聊天操作按钮数据
	onBeforeMount(()=>{
		readData()
		setScroll_heigth(false)
	})
	watch(()=>counter.chatPageExecute,(newValue,odlValue)=>{
		var keyid=newValue.info.type=='public'?'group_chat':newValue.info.from==counter.shopBasicsData.id?newValue.info.to:newValue.info.from//聊天室id
		if(newValue.type=='push' && counter.chatData.chatroomId==keyid){
			showChatData.push(newValue.info)
			returnBottom(true)
		}else if(newValue.type=='hint' && counter.chatData.chatroomId==keyid){//消息撤回
			var showDataLength=showChatData.length-1
			for(var i=0;i<showChatData.length;i++){//消息撤回
				if(showChatData[showDataLength].id==newValue.info.id){
					showChatData[showDataLength]=newValue.info
					break
				}
			}
		}
	})
	const openSet=(info,index)=>{//长按弹窗按钮渲染
		buttonInfo.length=0
		var button2={title:'删除本地记录',button_id:1,setIndex:index,chat_id:info.id}
		var differen=getTimeDifferenceInMinutes(new Date().getTime()/1000,info.create_time)
		if(info.from==counter.shopBasicsData.id && differen<5){//如果消息来自自己并且发送时间与当前时间小于五分钟就渲染撤回消息
			var button1={title:'撤回消息',button_id:0,setIndex:index,chat_id:info.id}
			buttonInfo.push(button1)
		}
		buttonInfo.push(button2)
		if(Props.type=='public'){//当前对话是群聊在渲染
			var button3={title:'删除该消息(所有用户将无法看到此信息)',button_id:2,setIndex:index,chat_id:info.id}
			buttonInfo.push(button3)
		}
		proxy.$refs.setCaht.open()
	}
	const clickSet=(e)=>{//操作弹窗触发
		if(e.button_id==0){//消息撤回
			var socketPost = {
				'type' :"revocation",
				'from' :counter.shopBasicsData.id,
				'to' :Props.type=='public'?'':Props.user_id,
				'content':e.chat_id,
			}
			uni.sendSocketMessage({
				data:JSON.stringify(socketPost),
				success(){
					showChatData[e.setIndex].content='你撤回了一条消息'
					showChatData[e.setIndex]['chat_type']='hint'
					counter.chatPageExecute={
						type:'my_hint',
						info:showChatData[e.setIndex]
					}
				}
			});
		}else if(e.button_id==1){//本地删除
			showChatData[e.setIndex].content='你删除了一条本地消息记录'
			counter.chatData.messages[e.setIndex].content='你本地删除了一条消息'
			showChatData[e.setIndex]['chat_type']='hint'
			counter.chatData.messages[e.setIndex]['chat_type']='hint'
		}else{//服务器删除
			var socketPost = {
				'type' :"revocation",
				'from' :counter.shopBasicsData.id,
				'to' :Props.type=='public'?'':Props.user_id,
				'content':e.chat_id,
			}
			uni.sendSocketMessage({
				data:JSON.stringify(socketPost),
				success(){
					showChatData[e.setIndex].content='你删除了一条消息'
					showChatData[e.setIndex]['chat_type']='hint'
					counter.chatPageExecute={
						type:'my_hint',
						info:showChatData[e.setIndex]
					}
				}
			});
		}
		proxy.$refs.setCaht.close()
	}
	
	const loadingMore=()=>{//加载跟多聊天数据
		if(isLoading.value){return}
		loadingState.value='loading'
		isLoading.value=true
		offViewId.value=showChatData[0].id
		setTimeout(()=>{
			isLoading.value=false
			loadingState.value='more'
			readData()
			scroll_isAmin.value=false
			nextTick(()=>{
				scroll_view_showId.value=`item${offViewId.value}`
			})
		},600)
	}
	const clickInput=(e)=>{//监听键盘变化触发
		inputLoc.value=e.detail.height
		nextTick(()=>{
			setScroll_heigth(true)
		})
	}
	const readData=()=>{//读取当前页数的数据
		var dataLengthIndex=counter.chatData.messages.length-1-newShowDataLength.value
		if(dataLengthIndex<0){//无数据拦截
			isLoading.value=true
			loadingState.value='no-more'
			return
		}
		for(var i=0;i<20;i++){
			if(counter.chatData.messages[dataLengthIndex]){
				showChatData.unshift(counter.chatData.messages[dataLengthIndex])
				dataLengthIndex--
				newShowDataLength.value++
			}else{
				isLoading.value=true
				loadingState.value='no-more'
				break
			}
		}
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
	const returnBottom=(boole)=>{//回到聊天记录底部
		nextTick(()=>{
			scroll_isAmin.value=boole
			if(showChatData.length>0){
				scroll_view_showId.value=`item${showChatData[showChatData.length-1].id}`
			}
		})
	}
	const selectImage=()=>{//用户选择发送图片
		uni.chooseImage({
			count:1,
			success(res){
				uni.getImageInfo({//获取用户选择的图片信息
					src:res.tempFilePaths[0],
					success(info){
						var showMode=info.width>info.height?'widthFix':'heightFix'
						upImage(res.tempFilePaths[0],showMode)
					},
					fail(){
						upImage(res.tempFilePaths[0],'heightFix')
					}
				})
			}
		})
		function upImage(upUrl,type){//上传图片
			uni.showLoading({title:'',mask:true})
			var nowTime=new Date().getTime()
			uni.uploadFile({
			    url:counter.baseUrl+'/api/common.Common/upload2',
			    header:{server:1, "ba-user-token":uni.getStorageSync('access_shop_token')},
			    filePath:upUrl,
			    name:'file',
				formData:{"type":'worker',"name":nowTime},
			    success(res){
					var newData=JSON.parse(res.data)
					if(isJSON(res.data) && newData.code==1){
						var socketPost = {
							'type' :Props.type,
							'from' :counter.shopBasicsData.id,
							'to' :Props.type=='public'?'':Props.user_id,
							'content':counter.baseUrl+newData.data.url,
							'user_info':{
								'user_logo':counter.shopBasicsData.avatar,
								'user_name':counter.shopBasicsData.nickname,
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
	
	const msgSend = (msg)=>{// 信息发送
		var linkRegex = /^(?:(http|https|ftp):\/\/)?((?:[\w-]+\.)+[a-z0-9]+)((?:\/[^/?#]*)+)?(\?[^#]+)?(#.+)?$/i
		var newMsg=extractURL(msg)
		if(newMsg && linkRegex.test(newMsg)){//链接发送拦截
			uni.showToast({title:'请勿发送链接~',icon:'none'})
			return
		}
		if(!counter.isSocketOpen){uni.showToast({title:'未连接至服务器',icon:'none'});return}
		var socketPost={
			'type' :Props.type,
			'from' :counter.shopBasicsData.id,
			'to' :Props.type=='public'?'':Props.user_id,
			'content':msg,
			'user_info':{
				'user_logo':counter.shopBasicsData.avatar,
				'user_name':counter.shopBasicsData.nickname
			}
		}
		uni.sendSocketMessage({
			data:JSON.stringify(socketPost),
			success(suss){
				myChatContent.value = ''
			},
			fail(){
				counter.isSocketOpen=false
				uni.showToast({title:'信息发送失败，请确认是否连接服务器~',icon:'none'})
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
	const setScroll_heigth=(boole)=>{//计算滚动区域高度
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
	function getTimeDifferenceInMinutes(timestamp1, timestamp2) {  //获取两个时间戳相差几分钟
	    var date1 = new Date(timestamp1 * 1000); //将时间戳转换为毫秒  
	    var date2 = new Date(timestamp2 * 1000);  
	    var timeDifferenceInSeconds = Math.abs(date2.getTime() - date1.getTime()); //取绝对值，因为两个时间戳可能一个在未来，一个在过去  
	    var timeDifferenceInMinutes = timeDifferenceInSeconds / 1000 / 60; //将秒转换为分钟  
	    return timeDifferenceInMinutes;  
	}
	function extractURL(str) {//截取链接
		var regex = /:\/\/(.[^]*?)\//;  
		var match = str.match(regex); 
		if (match) {  
			return match[1];  
		}else{ 
			return false;  
		}  
	}
	onBackPress(()=>{
		setTimeout(()=>{
			counter.chatData=[]
			counter.chatPageExecute={}
		},300)
	})
	const back=()=>{// 关闭页面
		setTimeout(()=>{
			counter.chatData=[]
			counter.chatPageExecute={}
		},300)
		uni.navigateBack()
	}
	const checkImage=(imageArr)=>{//图片预览
		uni.previewImage({
			urls:imageArr,
			imageArr:'default',
		})
	}

</script>

<style lang="scss">
	.setChatCard{
		width:100%;
		border-radius:20rpx 20rpx 0 0;
		background-color: #fff;
		.operation{
			width:100%;
			height:100rpx;
			background-color: #fff;
			text-align: center;
			line-height:100rpx;
			border-bottom:1rpx solid #e2e2e2;
		}
		.closePopup{
			width:100%;
			height:100rpx;
			background-color: #fff;
			border-top: 10rpx solid #e2e2e2;
			text-align: center;
			line-height:100rpx;
			font-size:32rpx;
			font-weight: bold;
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
		margin:0rpx 10rpx 20rpx 20rpx;
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
	.statusBar{
		width:100%;
		height:var(--status-bar-height);
		background-color:white;
	}
	.scroll-view_style{
		width:100%;
		height:calc(100vh - 100rpx - 100rpx - 20rpx);
		box-sizing: border-box;
		transition: all 0.3s;
	}
	.uni_mySet_ber{
		width:100%;
		padding:20rpx;
		background-color: #fff;
		display: flex;
		align-items: center;
		box-sizing: border-box;
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
		border-top:1rpx solid #dcdcdc;
		box-sizing: border-box;
		display: flex;
		position: absolute;
		left:0rpx;
		transition:all 0.1s;
		.send_true{
			background-image: linear-gradient(-225deg, #f6d365,#fda085);
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
			background-image: linear-gradient(-225deg, #f6d365,#fda085);
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
</style>
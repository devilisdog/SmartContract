<template>
	<view class="status_bar" @longpress=""></view>
	<uni-nav-bar :title="titleText"></uni-nav-bar>
	<uni-list>
		<uni-list-chat 
			v-for="itme,index in chat_list"
			:title="itme.chat_name" 
			:avatar="itme.chat_logo"
			:time="date.getNowFormatDate(0,itme.newMsgTime)"
			:note="itme.messages.length>0?itme.messages[itme.messages.length-1].chat_type=='image'?'[图片]':itme.messages[itme.messages.length-1].content:''"
			:badge-text="itme.unreadMessages"
			:clickable="true"
			@click="skip_chat(itme.chatroomId,itme.chat_type,itme.chat_name,index)"
			@longpress="openChatSet(index)"
			>
		</uni-list-chat>
	</uni-list>
	<uni-popup ref="setChat" type="bottom" :maskClick="false">
		<view class="chatSetCard">
			<view class="newButton" @click="deleteDialog=true">删除该聊天记录</view>
			<view class="closeButton" @click="closeSetCahte">取消</view>
		</view>
	</uni-popup>
	<fui-dialog content="确定要删除改条聊天吗？一旦删除将无法恢复喔!!!" :show="deleteDialog" @click="dialogClick" />
</template>

<script setup>
	import {onBeforeMount,onMounted,ref,reactive,getCurrentInstance,watch,defineProps} from 'vue';
	import { useCounterStore } from '@/stores/counter'
	import api from "@/common/vmeitime-http/user/user.js"
	import date from "@/common/getdatetime.js"
	import {onShow,onHide,onTabItemTap} from "@dcloudio/uni-app"
	const {proxy,ctx} = getCurrentInstance()
	const chat_list=ref([])//列表渲染
	const counter = useCounterStore();
	const titleText=ref('')//页面title
	const linkNumber=ref(0)//重连次数
	const timer=ref(null)//定时器值
	const isOpenLink=ref(false)//是否有连接服务器在运行（以防重复执行）
	const deleteDialog=ref(false)//删除聊天提示显示控制
	const isOpenWatch=ref(false)//是否有监听正在开启，避免重复开启
	/*
		@socketPost {
			@type 		private 私聊, public 群聊, postId 传递参数
			@from 		谁发的
			@to   		发给谁的
			@content 	内容
		}
	*/
	onTabItemTap((e)=>{
		getThisChatData()
		if(!counter.isSocketOpen){
			titleText.value='连接服务器中...'
			establishLink()
		}
	})
	const establishLink=()=>{//连接聊天服务器
		if(counter.shopBasicsData.id){
			linkNumber.value++
			isOpenLink.value=true
			uni.connectSocket({url:'ws://111.67.203.169:2345'});//创建连接
		}else{
			uni.showToast({title:'未获取到用户id',icon:'none'})
		}
	}
	uni.onSocketOpen(function(res){//连接服务器成功
		counter.isSocketOpen=true
		isOpenLink.value=false
		var socketPost = {'type':'postId','content':counter.shopBasicsData.id,}
		uni.sendSocketMessage({data:JSON.stringify(socketPost)});
		list_loading()
		if(!isOpenWatch.value){
			isOpenWatch.value=true
			watch(()=>counter.chatPageExecute,(newV,odlV)=>{//监听店主自己撤回消息
				if(newV.type=='my_hint'){
					//获取此聊天在数组中的位置
					var groupIndex=chat_list.value.findIndex(obj=>obj.chatroomId==counter.chatData.chatroomId)
					if(groupIndex != -1){
						var deleteIndex=chat_list.value[groupIndex].messages.findIndex(newObj=>newObj.id==newV.info.id)
						chat_list.value[groupIndex].messages[deleteIndex]=newV.info
					}
					saveChat(chat_list.value)
				}
			})
		}
		if(timer.value==null){
			timer.value=setInterval(()=>{//心跳
				var socketPost = {'type':'time','content':counter.shopBasicsData.id}
				uni.sendSocketMessage({
					data:JSON.stringify(socketPost),
					success(){
						console.log('心跳自检');
					},
					fail(){//心跳自检信息发送失败
						uni.closeSocket();
						counter.isSocketOpen=false
						clearTimeout(timer.value);//关闭自检
						timer.value=null,
						titleText.value='服务器断开，正在尝试重新连接~'
						establishLink()
					}
				});
			},10000)
		}
	});
	uni.onSocketError(function (res) {//连接服务器失败（重连）
		counter.isSocketOpen=false
		isOpenLink.value=false
		if(linkNumber.value<=5){
			titleText.value='连接失败，正在尝试第'+linkNumber.value+'重连'
			establishLink()
		}else{
			uni.closeSocket();
			titleText.value='未连接到服务器~'
			linkNumber.value=0
		}
	});
	
	const getThisChatData=()=>{//获取本地聊天记录
		// uni.removeStorage({key:String(counter.shopBasicsData.id)})//数据清空
		var newTime=Number(new Date().getTime()/1000).toFixed(0)
		uni.getStorage({
			key:String(counter.shopBasicsData.id),
			success(res){
				//获取本地聊天记录成功
				var newArr=JSON.parse(res.data)
				if(newArr['group_chat']){
					uni.showLoading({title:'正在清空旧版数据~',mask:true})
					setTimeout(()=>{
						uni.closeSocket();
						uni.removeStorage({key:String(counter.shopBasicsData.id)})//数据清空
						uni.reLaunch({
							url:'/pages/index/mine',
							success(){
								uni.showToast({
									title:'请重新进入聊天页面',
									icon:'none'
								})
							}
						})
					},1500)
				}else{
					chat_list.value=JSON.parse(res.data)
				}
			},fail(){
				//获取本地聊天记录视频，初始化本地聊天记录存储
				chat_list.value.push({
					chatroomId:'group_chat',//聊天室id（用户:id || 群聊:group_chat）
					//聊天头像
					chat_logo:'https://img.ixintu.com/download/jpg/20200818/c1ce036a2f5e67ac08f7184fdb5fc7a7_512_512.jpg!ys',
					chat_type:'public',//聊天室类型（private=私聊 || public=群聊）
					chat_name:'店内群聊',//聊天列表名字
					messages:[],//聊天记录数组
					lastReadTime:'',//最近读取时间
					unreadMessages:0,//未读消息数量
					newMsgTime:newTime,//最新一条消息的时间
				})
				saveChat(chat_list.value)
				console.log('执行存储初始化');
			}
		})
	}
	
	uni.onSocketMessage(function (res) { //这里接收收到的消息
		let arr = JSON.parse(res.data);
		var isMyChat=arr.from==counter.shopBasicsData.id//是否是我的发送的消息
		var nowTime=Number(new Date().getTime()/1000).toFixed(0)
		if(arr.type=="revocation"){//消息撤回
			if(arr.to==""){//群聊撤回
				inform()//执行消息通知
				var groupIndex=chat_list.value.findIndex(obj=>obj.chatroomId=='group_chat')//获取此聊天在数组中的位置
				var allLength=chat_list.value[groupIndex].messages.length-1//获取群聊聊天总长度
				if(groupIndex == -1){return}
				for(var i=0;i<chat_list.value[groupIndex].messages.length;i++){
					if(chat_list.value[groupIndex].messages[allLength].id==arr.content){
						if(chat_list.value[groupIndex].unreadMessages>1){chat_list.value[groupIndex].unreadMessages--}
						chat_list.value[groupIndex].messages[allLength]['content']='用户撤回了一条消息'
						chat_list.value[groupIndex].messages[allLength]['chat_type']='hint'
						break
					}
					allLength--
				}
				counter.chatPageExecute={
					type:'hint',
					info:chat_list.value[groupIndex].messages[allLength]
				}
			}else{//私聊撤回
				inform()//执行消息通知
				var keyid=arr.from==counter.shopBasicsData.id?arr.to:arr.from
				var groupIndex=chat_list.value.findIndex(obj=>obj.chatroomId==keyid)//获取此聊天在数组中的位置
				var allLength=chat_list.value[groupIndex].messages.length-1//获取群聊聊天总长度
				if(groupIndex != -1){
					for(var i=0;i<chat_list.value[groupIndex].messages.length;i++){
						if(chat_list.value[groupIndex].messages[allLength].id==arr.content){
							if(chat_list.value[groupIndex].unreadMessages>1){chat_list.value[groupIndex].unreadMessages--}
							chat_list.value[groupIndex].messages[allLength]['content']='ta撤回了一条消息'
							chat_list.value[groupIndex].messages[allLength]['chat_type']='hint'
							break
						}
						allLength--
					}
					counter.chatPageExecute={
						type:'hint',
						info:chat_list.value[groupIndex].messages[allLength]
					}
				}
			}
		}
		if(arr.type=='private'){//收到私聊消息
			if(arr.from!=counter.shopBasicsData.id){
				inform()//执行消息通知
			}
			var keyid=arr.from==counter.shopBasicsData.id?arr.to:arr.from//聊天室id
			var groupIndex=chat_list.value.findIndex(obj=>obj.chatroomId==keyid)//获取此聊天在数组中的位置
			if(groupIndex == -1){//在数组中未找到对应id的对象
				var newObj={
					chatroomId:keyid,//聊天室id（用户:id || 群聊:group_chat）
					chat_logo:arr.user_info.user_logo,//聊天头像
					chat_type:'private',//聊天室类型（private=私聊 || public=群聊）
					chat_name:arr.user_info.user_name,//聊天列表名字
					messages:[],//聊天记录数组
					lastReadTime:'',//最近读取时间
					unreadMessages:1,//未读消息数量
					newMsgTime:nowTime,//最新一条消息的时间
				}
				var newChat={
					content:arr.content,
					create_time:nowTime,
					from:arr.from,
					id:arr.id,
					to:arr.to,
					type:arr.type,
					chat_type:'default',//聊天显示类型（default==文字样式、image==图片样式、hint==提示样式）
				}
				if(arr.user_info.showMode){
					newChat.chat_type='image'
					newChat['image_type']=arr.user_info.showMode
				}//如果是图片
				if(isMyChat && counter.chatData.chatroomId && counter.chatData.chatroomId==keyid){
					//是我发送的消息，但是是新建聊天室
					counter.chatData.messages.push(newChat)
					chat_list.value.unshift(counter.chatData)
					counter.chatPageExecute={//改变聊天的值
						type:'push',
						info:newChat
					}
				}else{
					newObj.messages.push(newChat)
					chat_list.value.unshift(newObj)
				}
			}else{
				if(!isMyChat){//不是我自己发送的消息在更新基础信息
					chat_list.value[groupIndex].chat_logo=arr.user_info.user_logo
					chat_list.value[groupIndex].chat_name=arr.user_info.user_name
				}
				chat_list.value[groupIndex].newMsgTime=nowTime
				var newChat={
					content:arr.content,
					create_time:nowTime,
					from:arr.from,
					id:arr.id,
					to:arr.to,
					type:arr.type,
					chat_type:'default',//聊天显示类型（default==文字样式、image==图片样式、hint==提示样式）
				}
				if(arr.user_info.showMode){
					newChat.chat_type='image'
					newChat['image_type']=arr.user_info.showMode
				}//如果是图片
				if(counter.chatData.chatroomId && counter.chatData.chatroomId==keyid){//如果收到的消息是用户当前在聊天室的
					counter.chatPageExecute={//改变聊天的值
						type:'push',
						info:newChat
					}
				}else{//不是的话
					chat_list.value[groupIndex].unreadMessages++
				}
				chat_list.value[groupIndex].messages.push(newChat)
			}
		}
		if(arr.type=='public'){//收到群聊消息
			if(arr.from!=counter.shopBasicsData.id){
				inform()//执行消息通知
			}
			var groupIndex=chat_list.value.findIndex(obj=>obj.chatroomId=='group_chat')//获取此聊天在数组中的位置
			if(groupIndex == -1){
				var newGroup={
					chatroomId:'group_chat',//聊天室id（用户id||群聊shopid+group）
					//聊天头像
					chat_logo:'https://img.ixintu.com/download/jpg/20200818/c1ce036a2f5e67ac08f7184fdb5fc7a7_512_512.jpg!ys',
					chat_type:'public',//聊天室类型（private=私聊 || public=群聊）
					chat_name:'店内群聊',//聊天列表名字
					messages:[],//聊天记录数组
					unreadMessages:1,//未读消息数量
					newMsgTime:nowTime,//最新一条消息的时间
				}
				var newChat={
					content:arr.content,
					create_time:nowTime,
					from:arr.from,
					id:arr.id,
					to:arr.to,
					type:arr.type,
					chat_type:'default',//聊天显示类型（default==文字样式、image==图片样式、hint==提示样式）
					user_logo:arr.user_info.user_logo,
					user_name:arr.user_info.user_name,
				}
				if(arr.user_info.showMode){
					newChat.chat_type='image'
					newChat['image_type']=arr.user_info.showMode
				}//如果是图片
				newGroup.messages.push(newChat)
				chat_list.value.unshift(newGroup)
			}else{
				chat_list.value[groupIndex].newMsgTime=nowTime
				var newChat={
					content:arr.content,
					create_time:nowTime,
					from:arr.from,
					id:arr.id,
					to:arr.to,
					type:arr.type,
					chat_type:'default',//聊天显示类型（default==文字样式、image==图片样式、hint==提示样式）
					user_logo:arr.user_info.user_logo,
					user_name:arr.user_info.user_name,
				}
				if(arr.user_info.showMode){
					newChat.chat_type='image'
					newChat['image_type']=arr.user_info.showMode
				}//如果是图片
				chat_list.value[groupIndex].messages.push(newChat)
				if(counter.chatData.chatroomId && counter.chatData.chatroomId=='group_chat'){
					//如果收到的消息是用户当前在聊天室的
					counter.chatPageExecute={//改变聊天的值
						type:'push',
						info:newChat
					}
				}else{//不是的话
					chat_list.value[groupIndex].unreadMessages++
				}
			}
		}
		saveChat(chat_list.value)
	});
	
	const guor_chatList=()=>{//获取群聊未读消息
		var groupIndex=chat_list.value.findIndex(obj=>obj.chatroomId=='group_chat')//获取群聊在数组中的位置
		api.get_publicComm({}).then(res=>{
			if(res.data.data.content.length==0){titleText.value='聊天室';return}//没有未读消息拦截
			if(groupIndex == -1){//没有群聊对象~
				var newGroup={
					chatroomId:'group_chat',//聊天室id（用户id||群聊shopid+group）
					//聊天头像
					chat_logo:'https://img.ixintu.com/download/jpg/20200818/c1ce036a2f5e67ac08f7184fdb5fc7a7_512_512.jpg!ys',
					chat_type:'public',//聊天室类型（private=私聊 || public=群聊）
					chat_name:'店内群聊',//聊天列表名字
					messages:[],//聊天记录数组
					unreadMessages:res.data.data.count,//未读消息数量
					newMsgTime:res.data.data.content[0].create_time,//最新一条消息的时间
				}
				res.data.data.content.forEach(function(itme,index){
					var newcontent=itme.state=='0'?JSON.parse(itme.content):itme.nickname+'撤回了一条消息'
					var newObj={
						content:newcontent,
						create_time:itme.create_time,
						from:itme.from,
						id:itme.id,
						to:"",
						type:itme.type,
						chat_type:'default',//聊天显示类型（default==文字样式、image==图片样式、hint==提示样式）
						visit:"[]",
						user_logo:itme.user_info.avatar,
						user_name:itme.user_info.nickname
					}
					if(isImageLink(newcontent)){//判断是否是图片
						newObj['chat_type']='image'
						uni.getImageInfo({
							src:newcontent,
							success(suss){
								var newShowType=suss.height>suss.width?'heightFix':'widthFix'
								newObj['image_type']=newShowType
							}
						})
					}
					if(itme.state=='1'){newObj['chat_type']='hint'}//如是消息撤回，就修改消息类型未
					newGroup.messages.push(newObj)
				})
				chat_list.value.unshift(newGroup)
			}else{
				res.data.data.content.forEach(function(itme,index){
					chat_list.value[groupIndex].unreadMessages=res.data.data.count
					chat_list.value[groupIndex].newMsgTime=res.data.data.content[0].create_time
					var newcontent=itme.state=='0'?JSON.parse(itme.content):itme.nickname+'撤回了一条消息'
					var newObj={
						content:newcontent,
						create_time:itme.create_time,
						from:itme.from,
						id:itme.id,
						to:"",
						type:itme.type,
						chat_type:'default',//聊天显示类型（default==文字样式、image==图片样式、hint==提示样式）
						visit:"[]",
						user_logo:itme.user_info.avatar,
						user_name:itme.user_info.nickname
					}
					if(isImageLink(newcontent)){//判断是否是图片
						newObj['chat_type']='image'
						uni.getImageInfo({
							src:newcontent,
							success(suss){
								var newShowType=suss.height>suss.width?'heightFix':'widthFix'
								newObj['image_type']=newShowType
							}
						})
					}
					if(itme.state=='1'){newObj['chat_type']='hint'}//如是消息撤回，就修改消息类型未
					chat_list.value[groupIndex].messages.push(newObj)
				})
			}
			//发送消息至服务器表示这些消息已读~
			var socketPost = {'type':'postId','content':counter.shopBasicsData.id,'to':'public'}
			uni.sendSocketMessage({data:JSON.stringify(socketPost)});
			saveChat(chat_list.value)
		})
	}
	const inform=()=>{//消息通知
		uni.vibrateShort({})//开启震动
		const innerAudioContext = uni.createInnerAudioContext();
		innerAudioContext.autoplay = true;
		innerAudioContext.src = '../../static/announcement_tone.mp3';  //铃声文件的路径
		innerAudioContext.onPlay(() => {});//开始播放
		innerAudioContext.onError((res) => {});//播放失败
	}
	const list_loading=()=>{//获取用户未读消息
		titleText.value='正在更新聊天数据...'
		var nowTime=Number(new Date().getTime()/1000).toFixed(0)//当前时间
		api.get_WorkerUserList({}).then(res=>{
			res.data.data.forEach(function(itme,index){//循环每一个聊天室
				//查找循环当前的聊天室在本地数组中的位置（没有返回-1）
				var groupIndex=chat_list.value.findIndex(obj=>obj.chatroomId==itme.id)
				if(itme.comm_Not_viewed_content && itme.comm_Not_viewed_content.length>0){
					var newIndex=itme.comm_Not_viewed_content.length-1//获取未读消息数组总长度，用于从尾开始push进本地
					var obj={//新建聊天室
						chatroomId:itme.id,//聊天室id（用户:id || 群聊:group_chat）
						chat_logo:itme.avatar,//聊天头像
						chat_type:'private',//聊天室类型（private=私聊 || public=群聊）
						chat_name:itme.nickname,//聊天列表名字
						messages:[],//聊天记录数组
						lastReadTime:'',//最近读取时间
						unreadMessages:itme.comm_Not_viewed,//未读消息数量
						newMsgTime:itme.comm_Not_viewed_content[0].create_time,//最新一条消息的时间
					}
					for(var i=0;i<itme.comm_Not_viewed_content.length;i++){//循环每个聊天室中我未读的消息
						var newContent=itme.comm_Not_viewed_content[newIndex].state=='0'?JSON.parse(itme.comm_Not_viewed_content[newIndex].content):'ta撤回了一条消息'
						if(groupIndex == -1){//未找到执行
							var mess={
								content:newContent,
								create_time:itme.comm_Not_viewed_content[newIndex].create_time,
								from:itme.comm_Not_viewed_content[newIndex].from,
								id:itme.comm_Not_viewed_content[newIndex].id,
								to:itme.comm_Not_viewed_content[newIndex].to,
								type:itme.comm_Not_viewed_content[newIndex].type,
								chat_type:'default',//聊天显示类型（default==文字样式、image==图片样式、hint==提示样式）
								visit:"[]",
							}
							//如是消息撤回，就修改消息类型未
							if(itme.comm_Not_viewed_content[newIndex].state=='1'){mess['chat_type']='hint'}
							if(isImageLink(newContent)){//判断是否是图片
								mess['chat_type']='image'
								uni.getImageInfo({
									src:newContent,
									success(suss){
										var newShowType=suss.height>suss.width?'heightFix':'widthFix'
										mess['image_type']=newShowType
									}
								})
							}
							obj.messages.push(mess)
						}else{
							//更新聊天室基础信息
							chat_list.value[groupIndex].chat_logo=itme.avatar
							chat_list.value[groupIndex].chat_name=itme.nickname
							chat_list.value[groupIndex].unreadMessages=itme.comm_Not_viewed
							chat_list.value[groupIndex].newMsgTime=itme.comm_Not_viewed_content[0].create_time
							var mess={//消息格式化
								content:newContent,
								create_time:itme.comm_Not_viewed_content[newIndex].create_time,
								from:itme.comm_Not_viewed_content[newIndex].from,
								id:itme.comm_Not_viewed_content[newIndex].id,
								to:itme.comm_Not_viewed_content[newIndex].to,
								type:itme.comm_Not_viewed_content[newIndex].type,
								chat_type:'default',//聊天显示类型（default==文字样式、image==图片样式、hint==提示样式）
								visit:"[]",
							}
							//如是消息撤回，就修改消息类型未
							if(itme.comm_Not_viewed_content[newIndex].state=='1'){mess['chat_type']='hint'}
							if(isImageLink(newContent)){//判断是否是图片
								mess['chat_type']='image'
								uni.getImageInfo({
									src:newContent,
									success(suss){
										var newShowType=suss.height>suss.width?'heightFix':'widthFix'
										mess['image_type']=newShowType
									}
								})
							}
							chat_list.value[groupIndex].messages.push(mess)
						}
						newIndex--
					}
					if(groupIndex == -1){chat_list.value.unshift(obj)}//如果本地没有就插入进去
					//发送消息至服务器表示此聊天室未读消息已读
					var socketPost = {'type':'postId','content':counter.shopBasicsData.id,'to':itme.id}
					uni.sendSocketMessage({data:JSON.stringify(socketPost)});
				}
			})
			guor_chatList()
		})
	}
	
	const chat_sort=()=>{//聊天室排序
		chat_list.value.sort((a,b)=>b.newMsgTime - a.newMsgTime)
	}
	const deleteChat_key=ref(0)//用户长按的聊天室index
	const openChatSet=(key)=>{//打开聊天室列表操作弹窗(长按)
		deleteChat_key.value=key
		uni.hideTabBar()
		proxy.$refs.setChat.open()
	}
	const closeSetCahte=()=>{//关闭聊天室操作按钮
		proxy.$refs.setChat.close()
		uni.showTabBar()
	}
	function isImageLink(str) { //判断字符串是否是服务器图片
	    var imageRegex = /^http:\/\/111\.67\.197\.25\/.*/;
	    return imageRegex.test(str);  
	}
	const dialogClick=(e)=>{//删除聊天记录
		deleteDialog.value=false
		if(e.index==1){
			chat_list.value.splice(deleteChat_key.value,1)
			deleteChat_key.value=''
		}
		closeSetCahte()
	}
	const saveChat=(newData)=>{//保存聊天记录
		chat_sort()
		uni.setStorage({
			key:String(counter.shopBasicsData.id),
			data:JSON.stringify(newData),
			success(){
				console.log('聊天记录保存成功');
			},fail(){
				console.log('聊天记录保存成功');
			}
		})
	}
	const skip_chat=(chatId,chat_type,chatTitle,chatIndex)=>{//用户点击进入聊天列表
		chat_list.value[chatIndex].unreadMessages=0//点击后未读消息数量归零
		saveChat(chat_list.value)
		counter.chatData=deepClone(chat_list.value[chatIndex])
		uni.navigateTo({
			url:`/pages/chat_itemPage/user_chat?user_id=${chatId}&type=${chat_type}&user_name=${chatTitle}`,
			animationType:'slide-in-right',
		})
	}
	function deepClone(obj) { //数据克隆
	    if (obj === null || typeof obj !== 'object') return obj;  
	    let copy = obj.constructor();  
	    for (let attr in obj) {  
	        if (obj.hasOwnProperty(attr)) copy[attr] = deepClone(obj[attr]);  
	    }  
	    return copy;  
	}
</script>

<style lang="scss">
	.chatSetCard{
		width:100%;
		background-color: #fff;
		border-radius:40rpx 40rpx 0 0;
		.newButton{
			width:100%;
			height:100rpx;
			background-color: #fff;
			text-align: center;
			font-size:32rpx;
			font-weight: bold;
			line-height:100rpx;
			border-radius:40rpx 40rpx 0 0;
		}
		.closeButton{
			width:100%;
			height:100rpx;
			background-color: #fff;
			text-align: center;
			font-size:32rpx;
			font-weight: bold;
			line-height:100rpx;
			border-top:20rpx solid #ebebeb;
		}
	}
	body{
		background-color: #fbfbfb;
	}
	.status_bar {
		background-color: #fff;
		height: var(--status-bar-height);
		width: 100%;
	}
</style>

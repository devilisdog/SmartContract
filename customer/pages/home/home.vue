<template>
	<z-paging ref="minList" @query='list' :hide-empty-view='true' :style="'height: '+ windowHeight +'px;'">
		<view class="topBgImage">
			<view class="user_info">
				<navigator url="myData/myData">
					<image :src="counter.user_imgs" mode="aspectFill" style="background-color:#519a67;"></image>
				</navigator>
				<view class="info_data">
					<view style="display: flex;align-items: center;justify-content: space-between;">
						<text class="user_title">{{counter.nickname}} ({{'ID:'+counter.user_id}})</text>
						<!-- #ifdef APP-PLUS -->
						<uni-icons type="scan" size="50rpx" color="#fff" @click="clickQr"></uni-icons>
						<!-- #endif -->
					</view>
					<view>
						<text class="user_label"
							:style="counter.userAllData.userinfo&&counter.userAllData.userinfo.RealName==0?'background-color:#d1d1d1;':''">
							{{counter.userAllData.userinfo && counter.userAllData.userinfo.RealName==0?'未实名':'已实名'}}
						</text>
					</view>
				</view>
			</view>
			<view class="wallet_card" style="margin-top: 80rpx;" v-if="RealName != 0">
				<view class="wallet_top" @click="sikp()">
					<text class="cardTitle">店内账本</text>
					<view class="top_buttom">
						<text>历史账本</text>
						<uni-icons type="forward" color="#acacac"></uni-icons>
					</view>
				</view>
				<view class="cut-off"></view><!-- 分割线 -->
				<view class="wallet_money">
					<view>
						<text class="money_title">{{Number(counter.user_money).toFixed(2)}}</text>
						<text class="money_describe">账本余额(元)</text>
					</view>
					<view>
						<text class="money_title">{{Number(counter.Win_money).toFixed(2)}}</text>
						<text class="money_describe">今日中奖(元)</text>
					</view>
				</view>
				<view class="wallet_buttomBox">
					<view class="buttomStyle1" style="flex:1.2;" @click="openPay(0)">充值</view>
					<view class="buttomStyle" style="flex:0.8;margin-left:20rpx;" @click="openPay(1)">
						结算
					</view>
				</view>
			</view>

			<view class="wallet_card" v-if="RealName == 1">
				<view class="wallet_top" @click="qbjl()">
					<text class="cardTitle">投注记录</text>
					<view class="top_buttom">
						<text>全部记录</text>
						<uni-icons type="forward" color="#acacac"></uni-icons>
					</view>
				</view>
				<view class="cut-off"></view><!-- 分割线 -->
				<view class="content">
					<view class="content_itme" @click="screenPage(2)">
						<text>{{counter.Betrecord.Ticketing}}</text>
						<text>待出票</text>
					</view>
					<view class="content_itme" @click="screenPage(3)">
						<text>{{counter.Betrecord.Draw_a_prize}}</text>
						<text>待开奖</text>
					</view>
					<view class="content_itme" :style="counter.Betrecord.Win_a_prize>0?'color:red;':''"
						@click="screenPage(7)">
						<text>{{counter.Betrecord.Win_a_prize}}</text>
						<text>已中奖</text>
					</view>
					<view class="content_itme" :style="counter.Betrecord.Wait_a_prize>0?'color:red;':''"
						@click="screenPage(7)">
						<text>{{counter.Betrecord.Wait_a_prize}}</text>
						<text>待接单</text>
					</view>
				</view>
			</view>
			<!-- <view class="wallet_card">
			<view class="wallet_top">
				<text class="cardTitle">用户设置</text>
			</view>
			<view class="cut-off"></view>
			<view class="set_content">
				<template v-for="itme,index in setData" :key="itme.title">
					<view class="set_content_itme"  @click="openPage(index,itme.navigator)" >
						<image :src="itme.image"></image>
						<text>{{itme.title}}</text>
					</view>
				</template>
				<template v-for="itme,index in setuserData" :key="itme.title">
					<view class="set_content_itmes"  @click="openPage(index,itme.navigator)" 
					v-if="index==0?counter.UserConfig.agent=='1':true">
						<image :src="itme.image"></image>
						<text>{{itme.title}}</text>
					</view>
				</template>
			</view>
		</view> -->
			<view class="box">
				<template v-for="itme,index in (RealName == 0 ?setData : setData1)" :key="itme.title">
					<view class="list" @click="openPage(index,itme.navigator)">
						<view style="display: flex;align-items: center;">
							<image class="img" :src="itme.image"></image>
							<view class="text">{{itme.title}}</view>
						</view>
						<image class="img_right" src="@/static/img/home/right.png" mode=""></image>
					</view>
				</template>
				<template v-for="itme,index in setuserData" :key="itme.title">
					<view class="list" @click="openPage(index,itme.navigator)"
						v-if="index==0?counter.UserConfig.agent=='1':true">
						<view style="display: flex;align-items: center;">
							<image class="img" :src="itme.image"></image>
							<view class="text">{{itme.title}}</view>
						</view>
						<image class="img_right" src="@/static/img/home/right.png" mode=""></image>
					</view>
				</template>
			</view>
			<view class="upCard" style="height: 100rpx;">
				<text>版本号：{{currentVersionsValue}}</text>
			</view>
			<view style="width:100%;height:20rpx;"></view>
			<!-- <view class="cut_shop_card"  >
			<view class="wallet_top_shop">
				<text class="cardTitle">店铺切换</text>
				<image src="@/static/img/main/cut_black.png" style="width:40rpx;height:40rpx;" @click="shop_select"></image>
			</view>
		</view>
		
		<view class="cut_shop_card_two">
			<view class="cut_shop_card_two_item" @click="stckpChat(counter.shop_id,'private',chatData['shop_chat_'+counter.shop_id])">
				<uni-badge size="error" :text="chatData['shop_chat_'+counter.shop_id].unreadMessages" absolute="rightTop" type="primary" v-if="chatData['shop_chat_'+counter.shop_id]">
					<uni-icons type="chatbubble-filled" size="58rpx"></uni-icons><br>
					<text class="cardTitle">店主私聊</text>
				</uni-badge>
			</view>
			<view class="cut_shop_card_two_item" @click="stckpChat(counter.shop_id,'public',chatData['group_chat_'+counter.shop_id])" style="margin-left:20rpx;">
				<uni-badge size="error" :text="chatData['group_chat_'+counter.shop_id].unreadMessages" absolute="rightTop" type="primary" v-if="chatData['group_chat_'+counter.shop_id]">
					<uni-icons type="chatboxes-filled" size="58rpx"></uni-icons><br>
					<text class="cardTitle">店内群聊</text>
				</uni-badge>
			
			</view>
		</view> -->
			<view class="" style="height: 100rpx;"> </view>
		</view>
	</z-paging>
	<uni-popup ref="tg_popup" type="bottom">
		<togetherCard :Hemaidata="togData" @close='tgClose'></togetherCard>
	</uni-popup>

	<uni-popup ref="follow_info" type="bottom" :maskClick="false">
		<view style="background-color: #f9f9f9;height:95vh;">
			<gendanCard @close="tgClose" :order_id="Props_order_id" @look_follow="_follow"></gendanCard>
		</view>
	</uni-popup>

	<!-- 更新模块 -->
	<qw-updaters ref="updaters"></qw-updaters>
	<customtabbar :current="RealName == 0 ? 2 : 4"></customtabbar>
</template>


<script setup>
	import {
		storeToRefs
	} from 'pinia';
	import common from "@/common/common.js"
	import {
		onShow,
		onBackPress
	} from '@dcloudio/uni-app'
	import {
		useCounterStore
	} from '@/stores/counter'
	import {
		onBeforeMount,
		ref,
		reactive,
		getCurrentInstance,
		defineProps,
		onMounted,
		watch
	} from 'vue';
	import togetherCard from "@/components/common/yc-hemai-card/yc-hemai-card.vue"
	import gendanCard from "@/components/common/yc-gendan-card/yc-gendan-card.vue"
	import api from "@/common/vmeitime-http/index.js"
	import customtabbar from "@/components/nav-bottom/nav-bottom.vue"
	const Props = defineProps(['open_data'])
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	const counter = useCounterStore(); //状态管理
	const {
		userAllData
	} = storeToRefs(counter);
	const statusBarHeight = ref(uni.getSystemInfoSync().statusBarHeight)
	const Props_order_id = ref(0)
	const windowHeight = ref(0)
	const RealName = ref(uni.getStorageSync('RealName') || '');
	const setData = reactive([ //用户设置循环数据
		{
			'title': '我的资料',
			'image': '/static/img/home/profile.png',
			'navigator': '/pages/home/myData/myData'
		},
		{
			'title': '在线客服',
			'image': '/static/img/home/kefu.png',
			'navigator': '/pages/login/goflychat'
		},
	])
	const setData1 = reactive([ //用户设置循环数据
		{
			'title': '店铺信息',
			'image': '/static/img/home/shopinfo.png',
			'navigator': '/pages/home/StoreInformation/StoreInformation'
		},
		{
			'title': '分享好友',
			'image': '/static/img/home/share.png',
			'navigator': '/pages/home/sharePage/sharePage'
		},
		{
			'title': '我的红包',
			'image': '/static/img/home/red_p.png',
			'navigator': '/pages/home/redBag/redBag'
		},
		{
			'title': '我的资料',
			'image': '/static/img/home/profile.png',
			'navigator': '/pages/home/myData/myData'
		},
		// {
		// 	'title':'邀请记录',
		// 	'image':'/static/img/home/help.png',
		// 	'navigator':'/pages/home/inviteRecord/inviteRecord'
		// },
		{
			'title': '意见反馈',
			'image': '/static/img/home/feedback.png',
			'navigator': '/pages/home/helpcenter/helpcenter'
		},
		{
			'title': '帮助中心',
			'image': '/static/img/home/ico-wfjs.png',
			'navigator': '/pages/home/troubleShooting/troubleShooting'
		},
		{
			'title': '历史公告',
			'image': '/static/img/home/gongg.png',
			'navigator': '/pages/home/shop_announcement/shop_announcement'
		},
		{
			'title': '在线客服',
			'image': '/static/img/home/kefu.png',
			'navigator': '/pages/login/goflychat'
		},
	])
	const setuserData = reactive([ //用户管理
		{
			'title': '用户管理',
			'image': '/static/img/home/mine.png',
			'navigator': '/pages/home/usermanagement/usermanagement'
		}
	])
	const popup_isOpen = ref(false) //是否有弹出打开中
	const togData = ref([])
	const currentVersionsValue = ref('web') //当前版本号(仅在app端显示)
	const chatData = ref({})
	watch(RealName, (newValue) => {
		console.log('RealName changed:', newValue);
		uni.setStorageSync('RealName', newValue); // 每次变化时更新本地存储
	});
	onBeforeMount(() => {
		// #ifdef APP-PLUS
		plus.runtime.getProperty(plus.runtime.appid, function(inf) {
			currentVersionsValue.value = inf.version
		})
		// #endif
	})
	onMounted(() => {
		RealName.value = uni.getStorageSync('RealName');
		console.log(RealName, '测试');
		if (Props.open_data) {
			if (JSON.parse(Props.open_data).type == "together") {
				open_together(JSON.parse(Props.open_data).open_order_id) //打开合买详情
			} else if (JSON.parse(Props.open_data).type == "follow") {
				open_follow(JSON.parse(Props.open_data).open_order_id) //打开跟单详情
			}
		}
		let statusBarHeight = uni.getSystemInfoSync().statusBarHeight //获取手机状态栏高度
		windowHeight.value = uni.getSystemInfoSync().windowHeight - statusBarHeight
	})
	const list = async () => { //下滑刷新触发
		await common.getUserInfo() //获取用户信息公告方法
		await proxy.$refs.minList.complete(true)
		await initThisCahtData()
	}
	const linkNumber = ref(0) //重连次数
	const isSocketOpen = ref(false) //是否连接到服务器
	const isOpenLink = ref(false) //是否有建立连接在执行（避免重复执行）
	const isOpenWatch = ref(false) //是否开启监听保存聊天记录
	const establishLink = () => { //连接聊天服务器
		if (counter.user_id) {
			linkNumber.value++
			isOpenLink.value = true
			// uni.connectSocket({url:'ws://47.239.112.181:2345'});//创建连接
		} else {
			uni.showToast({
				title: '未获取到用户id',
				icon: 'none'
			})
		}
	}
	const wtachChatRecord = () => { //监听聊天记录变化
		isOpenWatch.value = true
		watch(chatData.value, (newValue, odlValue) => {
			uni.setStorage({ //聊天记录变化后保存至本地
				key: String(counter.user_id),
				data: JSON.stringify(chatData.value),
				success(res) {
					console.log('聊天记录保存成功', chatData.value);
				}
			})
		}, {});
	}
	const timer = ref(null) //定时器
	uni.onSocketOpen(function(res) { //连接服务器成功
		console.log('连接服务器成功');
		linkNumber.value = 0
		isSocketOpen.value = true
		isOpenLink.value = false
		var socketPost = {
			'type': 'postId',
			'content': counter.user_id
		}
		uni.sendSocketMessage({
			data: JSON.stringify(socketPost)
		});
		getUnread_info() //获取未读消息
		if (!isOpenWatch.value) {
			wtachChatRecord()
		}
		if (timer.value == null && isSocketOpen.value) {
			timer.value = setInterval(() => {
				var socketPost = {
					'type': 'time',
					'content': counter.user_id
				}
				uni.sendSocketMessage({
					data: JSON.stringify(socketPost),
					fail(err) {
						uni.closeSocket();
						clearTimeout(timer.value)
						isSocketOpen.value = false
						timer.value = null,
							establishLink()
					},
				});
			}, 10000)
		}
	});

	uni.onSocketError(function(res) { //连接服务器失败
		isSocketOpen.value = false
		isOpenLink.value = false
		if (linkNumber.value <= 5) {
			establishLink()
		} else {
			linkNumber.value = 0
		}
	});

	uni.onSocketMessage(function(res) { //这里接收到的消息
		let arr = JSON.parse(res.data);
		var nowTime = Number(new Date().getTime() / 1000).toFixed(0)
		if (arr.type == "revocation") { //消息撤回
			if (arr.to == "") { //群聊撤回
				if (arr.from != counter.user_id) {
					inform()
				}
				var reciprocal = chatData.value['group_chat_' + counter.shop_id].messages.length - 1
				for (var i = 0; i < chatData.value['group_chat_' + counter.shop_id].messages.length; i++) {
					if (chatData.value['group_chat_' + counter.shop_id].messages[reciprocal].id == arr.content) {
						if (chatData.value['group_chat_' + counter.shop_id].unreadMessages > 1) {
							chatData.value['group_chat_' + counter.shop_id].unreadMessages--
						}
						var deletContent = arr.from == counter.shop_id ? '店主撤回了一条消息' : '用户撤回了一条消息'
						chatData.value['group_chat_' + counter.shop_id].messages[reciprocal]['content'] =
							deletContent
						chatData.value['group_chat_' + counter.shop_id].messages[reciprocal]['chat_type'] = 'hint'
						counter.chatPageExecute_user = {
							type: 'hint',
							info: chatData.value['group_chat_' + counter.shop_id].messages[reciprocal]
						}
						break
					}
					reciprocal--
				}
			} else { //私聊撤回
				if (arr.from != counter.user_id) {
					inform()
				}
				var reciprocal = chatData.value['shop_chat_' + counter.shop_id].messages.length - 1
				for (var i = 0; i < chatData.value['shop_chat_' + counter.shop_id].messages.length; i++) {
					if (chatData.value['shop_chat_' + counter.shop_id].messages[reciprocal].id == arr.content) {
						if (chatData.value['shop_chat_' + counter.shop_id].unreadMessages > 1) {
							chatData.value['shop_chat_' + counter.shop_id].unreadMessages--
						}
						chatData.value['shop_chat_' + counter.shop_id].messages[reciprocal]['content'] =
							'ta撤回了一条消息'
						chatData.value['shop_chat_' + counter.shop_id].messages[reciprocal]['chat_type'] = 'hint'
						counter.chatPageExecute_user = {
							type: 'hint',
							info: chatData.value['shop_chat_' + counter.shop_id].messages[reciprocal]
						}
						break
					}
					reciprocal--
				}
			}
		}
		if (arr.type == 'private') { //私聊消息
			if (arr.from != counter.user_id) {
				inform()
			}
			chatData.value['shop_chat_' + counter.shop_id].unreadMessages++
			var newChat = {
				content: arr.content,
				createtime: nowTime,
				from: arr.from,
				id: arr.id,
				to: arr.to,
				type: arr.type,
				user_log: arr.user_info.user_logo,
				user_name: arr.user_info.user_name,
				visit: "[]",
				chat_type: 'default', //聊天显示类型（default==文字样式、image==图片样式、hint==提示样式）
			}
			if (arr.user_info.showMode) { //图片消息
				newChat.chat_type = 'image'
				newChat['image_type'] = arr.user_info.showMode
			}
			chatData.value['shop_chat_' + counter.shop_id].messages.push(newChat)
			counter.chatPageExecute_user = {
				type: 'push',
				info: newChat
			}
		}
		if (arr.type == 'public') { //群聊消息
			if (arr.from != counter.user_id) {
				inform()
			}
			chatData.value['group_chat_' + counter.shop_id].unreadMessages++
			var newChat = {
				content: arr.content,
				createtime: nowTime,
				from: arr.from,
				id: arr.id,
				to: arr.to,
				type: arr.type,
				user_log: arr.user_info.user_logo,
				user_name: arr.user_info.user_name,
				visit: "[]",
				chat_type: 'default', //聊天显示类型（default==文字样式、image==图片样式、hint==提示样式）
			}
			if (arr.user_info.showMode) { //图片消息
				newChat.chat_type = 'image'
				newChat['image_type'] = arr.user_info.showMode
			}
			chatData.value['group_chat_' + counter.shop_id].messages.push(newChat)
			counter.chatPageExecute_user = {
				type: 'push',
				info: newChat
			}
		}
	});

	const getUnread_info = () => { //获取未读消息
		api.get_WorkerUserList({}).then(res => {
			var newContent = res.data.data
			for (var i = 0; i < newContent.private.content.length; i++) { //私聊循环
				var newContenttext = newContent.private.content[i].state == '0' ? JSON.parse(newContent.private
					.content[i].content) : '店主撤回了一条消息'
				var chatObj = {
					content: newContenttext,
					createtime: newContent.private.content[i].createtime,
					from: newContent.private.content[i].from,
					id: newContent.private.content[i].id,
					to: newContent.private.content[i].to,
					type: newContent.private.content[i].type,
					user_log: newContent.private.content[i].user_info.avatar,
					user_name: newContent.private.content[i].user_info.nickname,
					chat_type: 'default', //聊天显示类型（default==文字样式、image==图片样式、hint==提示样式）
					visit: "[]",
				}
				if (newContent.private.content[i].state == '1') { //消息撤回
					chatObj.chat_type = 'hint'
				} else {
					chatData.value['shop_chat_' + counter.shop_id].unreadMessages++
				}
				if (isImageLink(newContenttext)) { //判断是否是图片
					chatObj['chat_type'] = 'image'
					uni.getImageInfo({
						src: newContenttext,
						success(suss) {
							var newShowType = suss.height > suss.width ? 'heightFix' : 'widthFix'
							chatObj['image_type'] = newShowType
						}
					})
				}
				chatData.value['shop_chat_' + counter.shop_id].messages.push(chatObj)
			}
			for (var i = 0; i < newContent.public.content.length; i++) {
				var newContenttext = newContent.public.content[i].state == '0' ? JSON.parse(newContent.public
					.content[i].content) : newContent.public.content[i].user_info.nickname + '撤回了一条消息'
				chatData.value['group_chat_' + counter.shop_id].unreadMessages++
				var chatObj = {
					content: newContenttext,
					createtime: newContent.public.content[i].createtime,
					from: newContent.public.content[i].from,
					id: newContent.public.content[i].id,
					to: newContent.public.content[i].to,
					type: newContent.public.content[i].type,
					user_log: newContent.public.content[i].user_info.avatar,
					user_name: newContent.public.content[i].user_info.nickname,
					chat_type: 'default', //聊天显示类型（default==文字样式、image==图片样式、hint==提示样式）
					visit: "[]",
				}
				if (newContent.public.content[i].state == '1') { //消息撤回
					chatObj.chat_type = 'hint'
				} else {
					chatData.value['group_chat_' + counter.shop_id].unreadMessages++
				}
				if (isImageLink(newContenttext)) { //判断是否是图片
					mess['chat_type'] = 'image'
					uni.getImageInfo({
						src: newContenttext,
						success(suss) {
							var newShowType = suss.height > suss.width ? 'heightFix' : 'widthFix'
							mess['image_type'] = newShowType
						}
					})
				}
				chatData.value['group_chat_' + counter.shop_id].messages.push(chatObj)
			}
			//私聊发送已读
			var socketPost_user = {
				'type': 'postId',
				'content': counter.user_id,
				'to': counter.shop_id
			}
			uni.sendSocketMessage({
				data: JSON.stringify(socketPost_user)
			});
			//群聊发送已读
			var socketPost_group = {
				'type': 'postId',
				'content': counter.user_id,
				'to': 'public'
			}
			uni.sendSocketMessage({
				data: JSON.stringify(socketPost_group)
			});
		})

	}

	const screenPage = (type) => { //投注记录快捷跳转
		uni.navigateTo({
			url: '/pages/home/recordPages/recordPages?screenValue=' + type + '&user_id=' + counter.user_id
		})
	}

	function isImageLink(str) { //判断字符串是否是服务器图片
		var imageRegex = /^http:\/\/111\.67\.197\.25\/.*/;
		return imageRegex.test(str);
	}
	const stckpChat = (shopid, type, data) => { //聊天点击
		counter.user_chatList = data
		uni.navigateTo({
			url: `/pages/home/groupChat/groupChat?shop_id=${shopid}&chatType=${type}`
		})
		setTimeout(() => {
			uni.setStorage({
				key: String(counter.user_id),
				data: JSON.stringify(chatData.value),
			})
		}, 300)
	}
	onBackPress(() => {
		if (popup_isOpen.value) {
			tgClose();
			return true
		}
	})
	const shop_select = () => { //切换店铺
		uni.reLaunch({
			url: '/pages/shop_select/select_page'
		})
	}
	const tgClose = () => {
		proxy.$refs.tg_popup.close()
		proxy.$refs.follow_info.close()
		popup_isOpen.value = false
		uni.showTabBar()
		setTimeout(() => {
			counter.submitNewData = []
			counter.BettingContent = []
			counter.allOrderData = []
		}, 300)
	}
	const _follow = (id) => { //订单详情用户点击头像
		proxy.$refs.follow_info.close()
		uni.navigateTo({
			url: '/pages/follow/homepage?userId=' + id
		})
	}
	const inform = () => { //消息通知
		uni.vibrateShort({}) //开启震动
		const innerAudioContext = uni.createInnerAudioContext();
		innerAudioContext.autoplay = true;
		innerAudioContext.src = '../../../static/announcement_tone.mp3'; //铃声文件的路径
		innerAudioContext.onPlay(() => {}); //开始播放
		innerAudioContext.onError((res) => {}); //播放失败
	}
	const initThisCahtData = () => { //初始化本地聊天记录
		var newObj = {}
		newObj['shop_chat_' + counter.shop_id] = {
			unreadMessages: 0,
			messages: []
		}
		newObj['group_chat_' + counter.shop_id] = {
			unreadMessages: 0,
			messages: []
		}
		uni.getStorage({
			key: String(counter.user_id),
			fail() {
				uni.setStorage({
					key: String(counter.user_id),
					data: JSON.stringify(newObj),
					success() {
						chatData.value = newObj
						if (!isSocketOpen.value && !isOpenLink.value) {
							establishLink()
						}
					}
				})
			},
			success(res) {
				var newData = JSON.parse(res.data)
				if (newData['shop_chat_' + counter.shop_id] && newData['shop_chat_' + counter.shop_id].messages
					.length > 1 && !newData['shop_chat_' + counter.shop_id].messages[0]['chat_type']
				) { //检测聊天记录是否是新版不是删除
					uni.showLoading({
						title: '正在清理旧版聊天记录',
						mask: true
					})
					setTimeout(() => {
						uni.hideLoading()
						uni.removeStorage({
							key: String(counter.user_id),
							success: function(res) {
								uni.reLaunch({
									url: '/pages/main/main',
									success() {
										uni.showToast({
											title: '请重新进入我的页面~',
											icon: 'none'
										})
									}
								})
							}
						});
					}, 600)
				} else {
					chatData.value = newData
					if (!chatData.value['shop_chat_' + counter.shop_id]) { //如本地没有此店铺的聊天记录初始化新建
						chatData.value['shop_chat_' + counter.shop_id] = {
							unreadMessages: 0,
							messages: []
						}
						chatData.value['group_chat_' + counter.shop_id] = {
							unreadMessages: 0,
							messages: []
						}
					}
					if (!isSocketOpen.value && !isOpenLink.value) {
						establishLink()
					}
				}
			}
		})
	}
	const clickQr = () => { //打开扫码功能
		uni.scanCode({
			success(res) {
				if (res.result.indexOf('open_data') != -1) {
					var codeData = JSON.parse(decodeURI(res.result).split('=')[1])
					if (codeData.type == 'together') {
						open_together(codeData.open_order_id) //打开合买详情
					} else if (codeData.type == 'follow') {
						open_follow(codeData.open_order_id) //打开跟单详情
					}
				} else {
					uni.showToast({
						title: '非本站二维码，无法识别~',
						icon: 'none',
						position: 'center'
					})
				}
			},
		})
	}
	const open_follow = (open_id) => { //打开跟单卡片
		Props_order_id.value = open_id
		proxy.$refs.follow_info.open()
		popup_isOpen.value = true
		uni.hideTabBar()
	}
	const open_together = (open_id) => { //合买详情订单打开
		uni.showLoading({
			title: '获取数据中'
		})
		api.GetTogetherInfo({
			'order_id': open_id
		}).then(res => {
			uni.hideLoading()
			if (res.data.code == 1) {
				var arr = ['福彩3D', '快乐八', '七乐彩', '双色球', '大乐透', '排列三', '排列五', '七星彩']
				if (arr.indexOf(res.data.data.Order.Type) != -1) {
					counter.submitNewData = JSON.parse(res.data.data.Order.BetContent)
					var newObj = {
						WinConten: res.data.data.Order.WinConten,
						BetContent: res.data.data.Order.BetContent
					}
					counter.allOrderData = newObj
				} else {
					counter.BettingContent = JSON.parse(res.data.data.Order.BetContent)
				}
				togData.value = res.data.data.Order
				proxy.$refs.tg_popup.open()
				popup_isOpen.value = true
				uni.hideTabBar()
			} else {
				uni.showToast({
					title: res.data.data,
					icon: 'none',
					position: 'center',
					duration: 2000,
				})
			}
		}).catch(err => {
			uni.hideLoading()
			uni.showToast({
				title: '数据处理失败，请联系平台方~',
				icon: 'none',
				position: 'center'
			})
		})
	}

	const openPage = (index, src) => { //用户设置页面跳转
		// if(index==5){
		// 	uni.showToast({
		// 		title:'此功能未开放，反馈问题请联系店主或联系管理员~',
		// 		icon:'none',
		// 		position:'center',
		// 		duration:5000
		// 	})
		// 	return
		// }
		if (index == 7) {
			// // #ifdef H5
			// if(uni.getStorageSync('access_token')){
			// 	let herf  = 'https://t.me/qihang9981' + '/index/index/home?groupid=1&business_id=1&special=3&avatar=' + 
			// 		counter.user_imgs + '&visiter_id=' + counter.user_id + '&visiter_name=' +
			// 		counter.user_id + counter.nickname
			// 		window.open(herf)
			// }else{
			// 	let herf  = 'https://t.me/qihang9981' + '/index/index/home?groupid=1&business_id=1&special=3&avatar=' + '' + '&visiter_id=' + '' + '&visiter_name=' +''
			// 	window.open(herf)
			// }
			// // #endif
			// // #ifdef APP
			// if(uni.getStorageSync('access_token')){
			// 	let herf  = 'https://t.me/qihang9981' + '/index/index/home?groupid=1&business_id=1&special=3&avatar=' + 
			// 		counter.user_imgs + '&visiter_id=' + counter.user_id + '&visiter_name=' +
			// 		counter.user_id + counter.nickname
			// 		plus.runtime.openURL(herf)
			// }else{
			// 	let herf  = 'https://t.me/qihang9981' + '/index/index/home?groupid=1&business_id=1&special=3&avatar=' + '' + '&visiter_id=' + '' + '&visiter_name=' +''
			// 	plus.runtime.openURL(herf)
			// }
			// 	// #endif
			uni.navigateTo({
				url: '/pages/login/goflychat'
			})

		} else {
			uni.navigateTo({
				url: src,
				animationType: 'slide-in-bottom'
			})
		}

	}
	const qbjl = () => { //全部投注记录跳转
		uni.navigateTo({
			url: '/pages/home/recordPages/recordPages?user_id=' + counter.user_id
		})
	}
	const openPay = (e) => { //提现或充值跳转
		if (e == 0) {
			uni.navigateTo({
				url: '/pages/home/HomeTopUp/HomeTopUp',
				animationType: 'pop-in',
			})
		} else {
			uni.navigateTo({
				url: '/pages/home/HomeTopUp/withdrawDeposit/withdrawDeposit',
				animationType: 'pop-in',
			})
		}
	}
	const sikp = () => { //交易明细跳转
		uni.navigateTo({
			url: '/pages/home/tradingRecord/tradingRecord',
			animationType: 'pop-in',
			animationDuration: 200
		})
	}
</script>

<style lang="scss">
	.cut_shop_card_two {
		width: 720rpx;
		margin: 20rpx auto;
		display: flex;
		justify-content: center;

		.cut_shop_card_two_item {
			width: 350rpx;
			border-radius: 15rpx;
			text-align: center;
			background-color: #fff;
			padding: 20rpx 0;
		}
	}

	.box {
		width: 100%;
		background: #fff;
		box-shadow: 0 1px 5px 0 rgba(25, 26, 27, .03);
		border-radius: 10px;
		margin-bottom: 10px;
		overflow: hidden;
		// height: 400rpx;

		.list {
			height: 60rpx;
			margin-top: 20rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 20rpx;

			.text {
				margin-left: 30rpx;
			}

			.img {
				width: 50rpx;
				height: 50rpx;
			}

			.img_right {
				width: 28rpx;
				height: 28rpx;
			}
		}

		// .list:nth-child(1) {
		// 	.img {
		// 		width: 60rpx;
		// 		height: 60rpx;
		// 	}
		// }

		// .list:nth-child(2) {
		// 	.img {
		// 		width: 55rpx;
		// 		height: 55rpx;
		// 	}
		// }

		// .list:nth-child(3) {
		// 	.img {
		// 		width: 55rpx;
		// 		height: 55rpx;
		// 	}
		// }

	}

	.upCard {
		width: 100%;
		text-align: center;
		color: #acacac;
		margin-bottom: 20rpx;

		.upLabel {
			padding: 2rpx 10rpx;
			background-color: red;
			border-radius: 10rpx;
			color: white;
			margin: 0rpx 10rpx;
		}
	}

	.cut_shop_card {
		width: 680rpx;
		padding: 20rpx;
		background-color: white;
		border-radius: 15rpx;
		margin: 20rpx auto;
		text-align: center;

		.wallet_top_shop {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
	}

	.set_content {
		display: grid;
		grid-template-columns: repeat(4, 120rpx);
		grid-template-rows: auto, 120rpx;
		justify-content: space-around;
		grid-row-gap: 50rpx;
		margin-bottom: 100rpx;

		.set_content_itme {
			display: flex;
			flex-flow: column;
			align-items: center;

			image {
				width: 70rpx;
				height: 70rpx;
			}
		}
	}

	.set_content_itmes {
		display: flex;
		flex-flow: column;
		align-items: center;

		image {
			width: 70rpx;
			height: 65rpx;
		}
	}

	.content {
		display: flex;
		justify-content: space-around;

		.content_itme {
			display: flex;
			flex-flow: column;
			align-items: center;
		}
	}

	.wallet_card {
		width: 97%;
		padding: 10rpx;
		background-color: white;
		border-radius: 15rpx;
		margin: 20rpx auto;

		.wallet_buttomBox {
			display: flex;

			.buttomStyle {
				height: 70rpx;
				margin: 20rpx 0rpx 0rpx 0rpx;
				// background-color: #202736; 
				background-image: linear-gradient(-225deg, #67b9a5, #67b9a5);
				// background-image: linear-gradient(to right, #ffb199,#ff0844);
				text-align: center;
				line-height: 70rpx;
				color: white;
				font-size: 32rpx;
				font-weight: bold;
				border-radius: 10rpx;
			}

			.buttomStyle1 {
				height: 70rpx;
				margin: 20rpx 0rpx 0rpx 0rpx;
				// background-color: #202736; 
				// background-image: linear-gradient(-225deg, #67b9a5, #67b9a5);
				background-image: linear-gradient(to right, #ff0844, #ff0844);
				text-align: center;
				line-height: 70rpx;
				color: white;
				font-size: 32rpx;
				font-weight: bold;
				border-radius: 10rpx;
			}
		}

		.wallet_money {
			display: flex;
			justify-content: space-between;
			margin-top: -10rpx;

			view {
				display: flex;
				flex-flow: column;
				align-items: center;

				.money_title {
					color: #000000;
					font-size: 38rpx;
					font-weight: bold;
				}

				.money_describe {
					color: #acacac;
				}
			}
		}

		.top_buttom {
			color: #acacac;
			display: flex;
			align-items: center;
		}

		.wallet_top {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
	}

	.cardTitle {
		font-size: 32rpx;
		font-weight: bold;
	}

	.cut-off {
		width: 100%;
		height: 1rpx;
		background-color: #e6e6e6;
		margin: 20rpx 0rpx;
	}

	.user_info {
		display: flex;
		width: 680rpx;
		padding: 20rpx;
		margin: 20rpx auto;
		// background: #fef0f0;
		color: #fff;

		// -webkit-backdrop-filter:blur(50rpx);
		// backdrop-filter:blur(50rpx);
		// box-shadow:inset 0 0 6px rgba(255, 255, 255, 0.2);
		// border-radius:15rpx;
		// margin-top:var(--status-bar-height);
		.info_data {
			display: flex;
			flex-flow: column;
			justify-content: space-around;
			margin-left: 20rpx;
			flex: 1;

			.user_title {
				font-size: 28rpx;
				font-weight: bold;
				color: #000000;
			}

			.user_label {
				font-weight: bold;
				color: white;
				padding: 4rpx 20rpx;
				background-color: #519a67;
				// background:linear-gradient(to bottom,#f04b49,#ffd8b5);
				border-radius: 10rpx;
			}
		}

		image {
			width: 120rpx;
			height: 120rpx;
			border-radius: 15rpx;
		}
	}

	.topBgImage {
		// background-image: linear-gradient(-225deg, #f04b49,#f04b49);
		// border-radius:0 0 20rpx 20rpx;
		background-image: url('/static/img/home/bg.png');
		width: 100%;
		height: 270rpx;
		padding: 20rpx;
		box-sizing: border-box;
		background-repeat: no-repeat;
		background-size: cover;
		-webkit-background-size: cover;
		-o-background-size: cover;
	}

	body {
		background-color: #f3f3f3;
	}
</style>
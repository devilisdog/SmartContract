<template>
    <!-- <template v-if="loading">
		<view>{{ openLoading ? '正在连接sse...' : '连接完成！' }}</view>
		<view>{{ loading ? '加载中...' : '' }}</view>
	</template> -->

    <gao-ChatSSEClient ref="chatSSEClientRef" @onOpen="openCore" @onError="errorCore" @onMessage="messageCore"
        @onFinish="finishCore" />

    <scroll-view :scroll-y="true" class="scroll-view_style" :scroll-with-animation="scroll_isAmin"
        :scroll-into-view="scroll_view_showId" upper-threshold="100" @scrolltoupper="loadingData"
        :style="{ height: Scroll_heigth + 'px' }">
        <uni-load-more :status="loadingStates"></uni-load-more>
        <view v-for="(itme, index) in ShowData" :key="itme.id" :id="itme.id">
            <view class="pop_up"
                v-if="ShowData[index - 1] && getTimeDifferenceInMinutes(ShowData[index - 1].created_at, itme.created_at) > 5">
                {{ dateShowStyle(itme.created_at) }}</view>
            <view class="chat_box_my_image_rigth" v-if="itme.user_id == counter.user_id && itme.type == 'image'">
                <!-- 我 -->
                <image :src="itme.content" class="contnet_image" lazy-load :lazy-load-margin="0" :mode="itme.image_type"
                    @click="checkImage([itme.content])" @longpress="longpressSet(itme, index)">
                </image>
                <image :src="counter.user_imgs" class="logo_style" lazy-load :lazy-load-margin="0"></image>
            </view>
            <view class="chat_box_my_image_left" v-else-if="itme.user_id != counter.user_id && itme.type == 'image'">
                <image :src="itme.avatar || '@/static/img/avatar/avatar.png'" class="logo_style" lazy-load
                    :lazy-load-margin="0" />
                <view style="display: flex; flex-flow: column">
                    <text class="username" style="margin: 0rpx 0rpx 10rpx 20rpx">{{ itme.username }}</text>
                    <image :src="itme.content" class="contnet_image" lazy-load :lazy-load-margin="0"
                        :mode="itme.image_type" @click="checkImage([itme.content])"
                        @longpress="longpressSet(itme, index)">
                    </image>
                </view>
            </view>
            <!-- 红包消息 - 我发的 -->
            <view class="chat_box_my" v-else-if="itme.user_id == counter.user_id && itme.type == 'redpack'">
                <view class="chat_redpacket_box" @click="openRedPacketDetail(itme)"
                    @longpress="longpressSet(itme, index)">
                    <view class="redpacket_top">
                        <image src="/static/img/redpacket_icon.png" class="redpacket_icon"></image>
                        <text class="redpacket_text">恭喜发财，大吉大利</text>
                    </view>
                    <view class="redpacket_bottom">
                        <text>红包</text>
                    </view>
                </view>
                <!-- <image :src="counter.user_imgs" class="logo_style" lazy-load :lazy-load-margin="0"></image> -->
                <image src="@/static/img/avatar/avatar_default.png" class="logo_style" lazy-load :lazy-load-margin="0">
                </image>
            </view>
            <!-- 红包消息 - 别人发的 -->
            <view class="chat_box_shop" v-else-if="itme.user_id != counter.user_id && itme.type == 'redpack'">
                <image :src="itme.avatar || '@/static/img/avatar/avatar.png'" class="logo_style" />
                <view class="left_chat">
                    <text class="username">{{ itme.username }}</text>
                    <view class="chat_redpacket_box shop_redpacket" @click="openRedPacketDetail(itme)"
                        @longpress="longpressSet(itme, index)">
                        <view class="redpacket_top">
                            <image src="/static/img/redpacket_icon.png" class="redpacket_icon"></image>
                            <text class="redpacket_text">恭喜发财，大吉大利</text>
                        </view>
                        <view class="redpacket_bottom">
                            <text>红包</text>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 跟单消息 - 我发的 -->
            <view class="chat_box_my" v-else-if="itme.user_id == counter.user_id && itme.type == 'follow'">
                <view class="chat_follow_box" @click="viewFollowDetail(itme)" @longpress="longpressSet(itme, index)">
                    <view class="follow_top">
                        <image src="/static/img/follow_icon.png" class="follow_icon"></image>
                        <text class="follow_text">{{ itme.content.title || '跟单消息' }}</text>
                    </view>
                    <!-- <view class="follow_content">
						<view class="follow_info">
							<text class="follow_label">赛事：</text>
							<text class="follow_value">{{ itme.content.match_name || '-' }}</text>
						</view>
						<view class="follow_info">
							<text class="follow_label">投注：</text>
							<text class="follow_value">{{ itme.content.bet_content || '-' }}</text>
						</view>
					</view> -->
                    <view class="follow_bottom">
                        <text>查看详情</text>
                    </view>
                </view>
                <image src="@/static/img/avatar/avatar_default.png" class="logo_style" lazy-load :lazy-load-margin="0">
                </image>
            </view>

            <!-- 跟单消息 - 别人发的 -->
            <view class="chat_box_shop" v-else-if="itme.user_id != counter.user_id && itme.type == 'follow'">
                <image :src="itme.avatar || '@/static/img/avatar/avatar.png'" class="logo_style" />
                <view class="left_chat">
                    <text class="username">{{ itme.username }}</text>
                    <view class="chat_follow_box shop_follow" @click="viewFollowDetail(itme)"
                        @longpress="longpressSet(itme, index)">
                        <view class="follow_top">
                            <image src="/static/img/follow_icon.png" class="follow_icon"></image>
                            <text class="follow_text">{{ itme.content.title || '跟单消息' }}</text>
                        </view>
                        <!-- <view class="follow_content">
							<view class="follow_info">
								<text class="follow_label">赛事：</text>
								<text class="follow_value">{{ itme.content.match_name || '-' }}</text>
							</view>
							<view class="follow_info">
								<text class="follow_label">投注：</text>
								<text class="follow_value">{{ itme.content.bet_content || '-' }}</text>
							</view>
						</view> -->
                        <view class="follow_bottom">
                            <text>查看详情</text>
                        </view>
                    </view>
                </view>
            </view>

            <view class="pop_up" v-else-if="itme.type == 'hint'">{{ itme.content }}</view>
            <view class="chat_box_my" v-else-if="itme.user_id == counter.user_id">
                <!-- 我 -->
                <view class="chat_content_box" @longpress="longpressSet(itme, index)">
                    <div class="chat_triangle"></div>
                    <text>{{ itme.content }}</text>
                </view>
                <!-- <image :src="counter.user_imgs" class="logo_style" lazy-load :lazy-load-margin="0"></image> -->
                <image src="@/static/img/avatar/avatar_default.png" class="logo_style" lazy-load :lazy-load-margin="0">
                </image>
            </view>
            <view class="chat_box_shop" v-else>
                <!-- <image :src="itme.avatar || '@/static/img/avatar/avatar.png'" class="logo_style" lazy-load
					:lazy-load-margin="0" /> -->
                <image src="@/static/img/avatar/avatar1.png" class="logo_style" lazy-load :lazy-load-margin="0" />
                <view class="left_chat" @longpress="longpressSet(itme, index)">
                    <text class="username">{{ itme.username }}</text>
                    <view class="chat_content_box">
                        <div class="chat_triangle"></div>
                        <text>{{ itme.content }}</text>
                    </view>
                </view>
            </view>
        </view>
        <!-- <view style="width:100%;height:20rpx;"></view> -->
    </scroll-view>
    <view class="bottm_from" :style="{ bottom: inputLoc + 'px' }">
        <input :adjust-position="false" v-model="myChatContent" @keyboardheightchange="clickInput" class="inputStyle" />
        <uni-icons type="plus-filled" size="62rpx" @click="openMoreFunc"></uni-icons>
        <view :class="myChatContent == '' ? 'send_false' : 'send_true'"
            @touchend.prevent="sendMessage(myChatContent, 'text')"> 发送 </view>
    </view>
    <fui-dialog :show="isOpenDialog" content="确定删除聊天记录吗？注意聊天记录一旦删除无法恢复喔!!!" @click="clickDialog" />
    <uni-popup ref="openSet" type="bottom">
        <view class="setBox">
            <view class="setButton" v-for="(itme, index) in chatSetData" @click="clickSetChat(itme)">{{ itme.title }}
            </view>
        </view>
    </uni-popup>

    <!-- 发送更多功能 -->
    <uni-popup ref="moreFunc" type="bottom" :mask-click="true">
        <view class="more-func-box" :style="{ height: inputLoc + 'px' }">
            <view class="func-item" @click="selectImage">
                <uni-icons type="image" size="60rpx" color="#666"></uni-icons>
                <text>图片</text>
            </view>
            <view class="func-item" @click="clickRedPacket">
                <uni-icons type="gift" size="60rpx" color="#666"></uni-icons>
                <text>红包</text>
            </view>
            <view class="func-item" @click="clickFollow">
                <uni-icons type="list" size="60rpx" color="#666"></uni-icons>
                <text>发送跟单</text>
            </view>
        </view>
    </uni-popup>

    <!-- 红包弹窗 -->
    <uni-popup ref="redPacketPopup" type="bottom" :mask-click="true">
        <view class="redpack-box">
            <view class="redpack-header">
                <text class="redpack-title">发红包</text>
                <uni-icons type="closeempty" size="24" color="#666" @click="closeRedPacket"></uni-icons>
            </view>
            <view class="redpack-content">
                <view class="redpack-item">
                    <text class="redpack-label">红包金额</text>
                    <input type="digit" v-model="redPacketAmount" class="redpack-input" placeholder="请输入金额" />
                </view>
                <view class="redpack-fixed-amounts">
                    <view class="fixed-amount-item" :class="{ active: redPacketAmount == 10 }"
                        @click="setFixedAmount(10)">
                        10</view>
                    <view class="fixed-amount-item" :class="{ active: redPacketAmount == 50 }"
                        @click="setFixedAmount(50)">
                        50</view>
                    <view class="fixed-amount-item" :class="{ active: redPacketAmount == 100 }"
                        @click="setFixedAmount(100)">100</view>
                    <view class="fixed-amount-item" :class="{ active: redPacketAmount == 200 }"
                        @click="setFixedAmount(200)">200</view>
                </view>
                <view class="redpack-item">
                    <text class="redpack-label">红包数量</text>
                    <input type="number" v-model="redPacketCount" class="redpack-input" placeholder="请输入数量" />
                </view>

                <view class="redpack-info" v-if="canCalculateAmount">
                    <text>每个红包金额：{{ (redPacketAmount / redPacketCount).toFixed(2) }} 元</text>
                </view>

                <view class="redpack-button" @click="sendRedPacket">发送红包</view>
            </view>
        </view>
    </uni-popup>

    <!-- 红包详情弹窗 -->
    <uni-popup ref="redPacketDetailPopup" type="center" :mask-click="true">
        <view class="redpack-detail-box" :class="{ 'redpack-finished': currentRedPacket.redPacketInfo?.isFinished }">
            <view class="redpack-detail-header">
                <image src="/static/img/redpacket_bg.png" class="redpack-detail-bg"></image>
                <view class="redpack-detail-avatar">
                    <image :src="currentRedPacket.avatar || counter.user_imgs" class="redpack-avatar"></image>
                </view>
                <view class="redpack-detail-username">
                    <text>{{ currentRedPacket.username }}</text>
                </view>
                <view class="redpack-detail-msg">
                    <text>恭喜发财，大吉大利</text>
                </view>
            </view>
            <view class="redpack-detail-content">
                <view v-if="!currentRedPacket.redPacketInfo?.isFinished" class="redpack-detail-amount">
                    <text class="amount-symbol">¥</text>
                    <text class="amount-value">{{ currentRedPacket.redPacketInfo?.amount || '0.00' }}</text>
                </view>
                <view v-else class="redpack-detail-finished">
                    <!-- <image src="/static/img/redpacket_finished.png" class="redpack-finished-icon"></image> -->
                    <text class="redpack-finished-text">您来晚了，红包已被抢完</text>
                </view>
                <view class="redpack-detail-info">
                    <text>{{ currentRedPacket.redPacketInfo?.isFinished ? '红包已抢完' : '已领取红包' }}</text>
                </view>
                <view class="redpack-detail-time">
                    <text>
                        <!-- 红包总金额{{ currentRedPacket.redPacketInfo?.totalAmount || '0.00' }}元， -->
                        共{{ currentRedPacket.redPacketInfo?.count || 1 }}个红包</text>
                </view>
            </view>
            <view class="redpack-detail-close" @click="closeRedPacketDetail">
                <uni-icons type="closeempty" size="24" color="#fff"></uni-icons>
            </view>
        </view>
    </uni-popup>
</template>

<script setup>
import { onMounted, onUnmounted, ref, reactive, getCurrentInstance, defineProps, watch, nextTick, computed } from 'vue'
import { useCounterStore } from '@/stores/counter' // 状态管理
import { onShow, onBackPress } from '@dcloudio/uni-app'
import api from '@/common/vmeitime-http/index.js'
const Props = defineProps(['shop_id', 'chatType', 'parentHeight', 'currentIndex', 'match_id'])
const counter = useCounterStore()

// 参数
const { proxy, ctx } = getCurrentInstance()
const myChatContent = ref('') //输入框内容v-model
const scroll_view_showId = ref('') //控制滚动区域显示子元素（id）
const scroll_isAmin = ref(false) //设置滚动时是否开启动画
const isOpenDialog = ref(false) //显示dialog控制器
const isLoading = ref(false) //是否正在触发加载（用于避免重复执行加载更多）
const loadingStates = ref('more') //more=加载前、loading=加载中、no-more=没有数据了
const ShowData = reactive([])
const inputLoc = ref(0) //输入框距离底部高度
const Scroll_heigth = ref(0) //聊天记录滚动区域高度
const chatSetData = reactive([]) //聊天设置按钮
const moreFunc = ref(null)
const redPacketPopup = ref(null)
const redPacketAmount = ref('')
const redPacketCount = ref(1)

//sse
const chatSSEClientRef = ref(null)
const loading = ref(false)
const openLoading = ref(false)

const canCalculateAmount = computed(() => {
    return redPacketAmount.value > 0 && redPacketCount.value > 0
})

const setFixedAmount = amount => {
    redPacketAmount.value = amount
}

const closeRedPacket = () => {
    proxy.$refs.redPacketPopup.close()
}

//发送红包
const sendRedPacket = async () => {
    if (!redPacketAmount.value || !redPacketCount.value) {
        uni.showToast({
            title: '请输入有效的金额和数量',
            icon: 'none',
        })
        return
    }

    const amount = parseFloat(redPacketAmount.value)
    const count = parseInt(redPacketCount.value)

    if (amount <= 0 || count <= 0) {
        uni.showToast({
            title: '金额和数量必须大于0',
            icon: 'none',
        })
        return
    }

    const eachAmount = (amount / count).toFixed(2)

    api.SendMessage({
        type: 'redpacket',
        content: '恭喜发财',
        amount,
        count,
        match_id: Props.match_id,
    }).then(res => {
        if (res.data.code == 1) {
            // 模拟发送成功
            // uni.showToast({
            //     title: `成功发送总额为${amount}元的${count}个红包`,
            //     icon: 'none',
            // })
        } else {
            uni.showToast({
                title: `${res.data.msg}`,
                icon: 'none',
            })
        }
    })


    // 关闭红包弹窗
    proxy.$refs.redPacketPopup.close()

    // 滚动到底部
    returnBottom(true)

    // 清空输入
    redPacketAmount.value = ''
    redPacketCount.value = 1
}

const clickRedPacket = () => {
    proxy.$refs.redPacketPopup.open()
    proxy.$refs.moreFunc.close()
}

// 点击发送跟单
const clickFollow = async item => {
    await api.SendMessage({
        type: 'follow',
        content: JSON.stringify({
            user_id: counter.user_id,
        }).slice(1, -1),
        match_id: Props.match_id,
    }).then(res => {
        if (res.data.code == 1) {
            // uni.showToast({
            //     title: `成功发送跟单`,
            //     icon: 'none',
            // })
        } else {
            uni.showToast({
                title: `${res.data.msg}`,
                icon: 'none',
            })
        }
    })

    proxy.$refs.moreFunc.close()
}

// 查看跟单详情
const viewFollowDetail = followData => {
    const follow_user_id = followData.content ? JSON.parse(followData.content).user_id : undefined
    // 这里可以跳转到跟单详情页
    if (follow_user_id && follow_user_id != counter.user_id) {
        uni.navigateTo({
            url: '/pages/follow/homepage?userId=' + follow_user_id,
        })
    } else {
        uni.navigateTo({
            url: '/pages/follow/homepage',
        })
    }
}

/*
    @socketPost {
        @type 		private 私聊, public 群聊, postId 传递参数
        @from 		谁发的
        @to   		发给谁的
        @content 	内容
    }
*/
const pageQuantity = ref(20) //每页聊天数量

onShow(() => {
    // 页面显示触发
    readData()
    setScroll_heigth(false)
})

// 用于解析高度值，支持vh、px等单位
const parseHeight = async height => {
    // 创建一个Promise来获取底部输入框的高度
    const getBottomHeight = () => {
        return new Promise(resolve => {
            setTimeout(() => {
                const query = uni.createSelectorQuery().in(proxy)
                query
                    .select('.bottm_from')
                    .boundingClientRect(data => {
                        if (data) {
                            resolve(data.height || BOTTOM_FROM_HEIGHT) // 如果获取失败，使用默认值
                        } else {
                            resolve(BOTTOM_FROM_HEIGHT) // 默认值
                        }
                    })
                    .exec()
            }, 100) // 给足够的时间让DOM渲染
        })
    }

    // 获取底部高度
    const bottomHeight = await getBottomHeight()

    // 根据不同类型的高度值进行处理
    if (typeof height === 'number') {
        return height - inputLoc.value - bottomHeight
    }

    // 处理字符串类型的高度，例如'63vh'
    if (typeof height === 'string') {
        if (height.includes('vh')) {
            // 将vh转换为像素
            const vh = parseFloat(height)
            const windowHeight = uni.getSystemInfoSync().windowHeight
            return (windowHeight * vh) / 100 - inputLoc.value - bottomHeight
        } else if (height.includes('px')) {
            // 处理px单位
            return parseFloat(height) - inputLoc.value - bottomHeight
        } else {
            // 处理纯数字字符串
            return parseFloat(height) - inputLoc.value - bottomHeight
        }
    }

    return 0
}

// 监听父组件传入的高度
watch(
    () => [Props.parentHeight, Props.currentIndex],
    async (newValue, oldValue) => {
        if (newValue[0]) {
            // 处理vh单位等情况
            const calculatedHeight = await parseHeight(newValue[0])
            Scroll_heigth.value = calculatedHeight
            nextTick(() => {
                returnBottom(true)
            })
        }

        if (newValue[1] === 4) {
            // 组件挂载时启动sse
            sseStart()
        }
    },
    { immediate: true }
)

onUnmounted(() => {
    sseStop()
})

// 直接设置一个底部输入框高度的常量，以防获取失败
const BOTTOM_FROM_HEIGHT = 56 // 预估的底部输入框高度，单位px

const setScroll_heigth = async boole => {
    //获取滚动区域高度
    if (Props.parentHeight) {
        // 如果父组件传了高度，直接使用解析函数处理
        const calculatedHeight = await parseHeight(Props.parentHeight)
        Scroll_heigth.value = calculatedHeight
        nextTick(() => {
            returnBottom(boole)
        })
        return
    }

    // 否则使用自己的计算方法
    var myTopber = 0
    var buttom_heigth = 0

    // 创建Promise获取高度
    const getElementsHeight = () => {
        return new Promise(resolve => {
            const query = uni.createSelectorQuery().in(proxy)
            query
                .select('.uni_mySet_ber')
                .boundingClientRect(data => {
                    if (data) myTopber = data.height || 0
                    query
                        .select('.bottm_from')
                        .boundingClientRect(data => {
                            if (data) buttom_heigth = data.height || BOTTOM_FROM_HEIGHT
                            resolve({ myTopber, buttom_heigth })
                        })
                        .exec()
                })
                .exec()
        })
    }

    // 获取元素高度
    const { myTopber: topHeight, buttom_heigth: bottomHeight } = await getElementsHeight()

    // 计算
    var allHeigth = uni.getSystemInfoSync().windowHeight //页面总高度
    var statesHeigth = uni.getSystemInfoSync().statusBarHeight //app状态栏高度
    Scroll_heigth.value = allHeigth - statesHeigth - topHeight - bottomHeight - inputLoc.value
    nextTick(() => {
        returnBottom(boole)
    })
}
const checkImage = imageArr => {
    //图片预览
    uni.previewImage({
        urls: imageArr,
        imageArr: 'default',
    })
}

const selectImage = () => {
    //用户选择发送的图片
    uni.chooseImage({
        //图片选择
        count: 1,
        success(res) {
            uni.getImageInfo({
                //获取用户选择的图片信息
                src: res.tempFilePaths[0],
                success(info) {
                    var type = info.width > info.height ? 'widthFix' : 'heightFix'
                    upImage(res.tempFilePaths[0], type)
                },
                fail() {
                    upImage(res.tempFilePaths[0], 'heightFix')
                },
            })
        },
    })

    // 上传图片
    function upImage(upUrl, type) {
        uni.showLoading({ title: '', mask: true })
        var nowTime = new Date().getTime()
        console.log(upUrl, 'upUrl')
        uni.uploadFile({
            url: counter.baseUrl + '/api/chat.room/upload',
            // url: 'http://47.92.233.116:8001/api/chat.room/upload',
            header: { server: 1, 'ba-user-token': uni.getStorageSync('access_token') },
            filePath: upUrl,
            name: 'file',
            success: async res => {
                const newData = JSON.parse(res.data)
                if (isJSON(res.data) && newData.code == 1) {
                    const params = {
                        type: 'image',
                        content: newData.data,
                        match_id: Props.match_id,
                    }
                    await api.SendMessage(params)
                } else {
                    uni.showToast({ title: '图片上传失败~', icon: 'error' })
                }
            },
            complete() {
                uni.hideLoading()
            },
        })
    }
}

// watch(
// 	() => counter.chatPageExecute_user,
// 	(newV, odlV) => {
// 		// if(newV.type==='push' && newV.info.type==Props.chatType){//添加
// 		// 	ShowData.push(newV.info)
// 		// 	returnBottom(true)
// 		// }
// 		// if(newV.type==='hint'){//撤回
// 		// 	// console.log('hint',newV);
// 		// }
// 	}
// )
const last_id = ref(0) //上次加载前头部的id
const loadingData = () => {
    //下拉触发加载更多聊天记录
    if (isLoading.value) {
        return
    } //避免重复执行拦截
    loadingStates.value = 'loading'
    isLoading.value = true
    last_id.value = ShowData[0].created_at
    setTimeout(() => {
        isLoading.value = false
        loadingStates.value = 'more'
        readData()
        scroll_isAmin.value = false
        nextTick(() => {
            scroll_view_showId.value = `item${last_id.value}`
        })
    }, 800)
}
const dateShowStyle = chatTime => {
    //返回时间显示样式
    var newNow = new Date() //用户当前时间
    var newCahteTime = new Date(chatTime * 1000) //聊天记录的时间
    if (newNow.getFullYear() === newCahteTime.getFullYear() && newNow.getMonth() === newCahteTime.getMonth() && newNow.getDate() === newCahteTime.getDate()) {
        //如果是同一天的就只显示小时+分钟的时间

        return newCahteTime.getHours() + ':' + (newCahteTime.getMinutes() < 10 ? '0' + newCahteTime.getMinutes() : newCahteTime.getMinutes())
    } else if (newNow.getFullYear() === newCahteTime.getFullYear()) {
        //如果是同年的
        return newNow.getMonth() + 1 + '-' + newCahteTime.getDate() + ' ' + newCahteTime.getHours() + ':' + newCahteTime.getMinutes()
    } else {
        return newCahteTime.getFullYear() + '-' + newNow.getMonth() + 1 + '-' + newCahteTime.getDate() + ' ' + newCahteTime.getHours() + ':' + newCahteTime.getMinutes()
    }
}
const longpressSet = (chatInfo, index) => {
    //长按聊天记录触发
    chatSetData.length = 0 //初始化设置按钮数据
    var two = { id: 1, title: '删除消息', setIndex: index, chat_id: chatInfo.id }
    chatSetData.push(two)
    //发送信息时间与当前时间相差几分钟
    var differen = getTimeDifferenceInMinutes(new Date().getTime() / 1000, chatInfo.created_at)
    if (chatInfo.from == counter.user_id && differen < 5) {
        //如果消息来自自己并且发送时间与当前时间小于五分钟就渲染撤回消息
        var one = { id: 0, title: '撤回消息', setIndex: index, chat_id: chatInfo.id }
        chatSetData.push(one)
    }
    proxy.$refs.openSet.open() //打开设置弹窗
}
const clickSetChat = e => {
    //点击弹出的设置项
    if (e.id == 1) {
        //删除本地消息
        counter.user_chatList.messages[e.setIndex].content = '你删除了一条本地消息记录'
        ShowData[e.setIndex].content = '你删除了一条本地消息记录'
        counter.user_chatList.messages[e.setIndex]['hint'] = 'hint'
        ShowData[e.setIndex]['type'] = 'hint'
    } else {
        //消息撤回
        var socketPost = {
            type: 'revocation',
            from: counter.user_id,
            to: Props.chatType == 'public' ? '' : Props.shop_id,
            content: e.chat_id,
        }
        uni.sendSocketMessage({
            data: JSON.stringify(socketPost),
            success() {
                counter.user_chatList.messages[e.setIndex].content = '你撤回了一条消息'
                ShowData[e.setIndex].content = '你撤回了一条消息'
                counter.user_chatList.messages[e.setIndex]['type'] = 'hint'
                ShowData[e.setIndex]['type'] = 'hint'
            },
        })
    }
    proxy.$refs.openSet.close()
}
function getTimeDifferenceInMinutes(timestamp1, timestamp2) {
    //获取两个时间戳相差几分钟
    var date1 = new Date(timestamp1 * 1000) //将时间戳转换为毫秒
    var date2 = new Date(timestamp2 * 1000)
    var timeDifferenceInSeconds = Math.abs(date2.getTime() - date1.getTime()) //取绝对值，因为两个时间戳可能一个在未来，一个在过去
    var timeDifferenceInMinutes = timeDifferenceInSeconds / 1000 / 60 //将秒转换为分钟

    return timeDifferenceInMinutes
}
const readData = () => {
    //读取当前页数的数据
    var dataLength = counter.user_chatList.messages.length - 1 - ShowData.length
    if (dataLength < 0) {
        //无数据拦截
        isLoading.value = true
        loadingStates.value = 'no-more'
        return
    }
    for (var i = 0; i < pageQuantity.value; i++) {
        if (counter.user_chatList.messages[dataLength]) {
            ShowData.unshift(counter.user_chatList.messages[dataLength])
            dataLength--
        } else {
            isLoading.value = true
            loadingStates.value = 'no-more'
            break
        }
    }
}
const clickInput = e => {
    //键盘键盘高度触发
    inputLoc.value = e.detail.height
    nextTick(() => {
        setScroll_heigth(true)
        if (proxy.$refs.moreFunc.isOpen) {
            proxy.$refs.moreFunc.open()
        }
    })
}
const returnBottom = boole => {
    //返回底部
    scroll_isAmin.value = boole
    if (ShowData.length > 0) {
        nextTick(() => {
            scroll_view_showId.value = `${ShowData[ShowData.length - 1].id}`
        })
    }
}
const clickDialog = e => {
    //聊天记录删除弹窗按钮事件
    isOpenDialog.value = false
    if (e.index === 1) {
        counter.user_chatList.messages = []
        var nowTime = Number(new Date().getTime() / 1000).toFixed(0)
        counter.user_chatList.messages.push({
            content: '你清理了本地存储的聊天记录',
            created_at: nowTime,
            from: counter.user_id,
            id: '',
            hint: 'hint',
            to: Props.chatType == 'public' ? '' : Props.shop_id,
            type: Props.chatType,
            visit: '[]',
        })
        ShowData.length = 0
        readData()
    }
}

//发送消息
const sendMessage = async (msg, msgType = 'text') => {
    var linkRegex = /^(?:(http|https|ftp):\/\/)?((?:[\w-]+\.)+[a-z0-9]+)((?:\/[^/?#]*)+)?(\?[^#]+)?(#.+)?$/i
    var newMsg = extractURL(msg)
    if (newMsg && linkRegex.test(newMsg)) {
        //链接发送拦截
        uni.showToast({ title: '请勿发送链接~', icon: 'none' })
        return
    }
    const socketPost = {
        type: msgType,
        content: msg,
        match_id: Props.match_id,
    }

    await api.SendMessage(socketPost)

    //发送成功后,清空输入框
    myChatContent.value = ''
}

function isJSON(str) {
    //判断字符串是否是json
    if (typeof str == 'string') {
        try {
            var obj = JSON.parse(str)
            if (typeof obj == 'object' && obj) {
                return true
            } else {
                return false
            }
        } catch (e) {
            return false
        }
    }
}
function extractURL(str) {
    //链接截取
    var regex = /:\/\/(.[^]*?)\//
    var match = str.match(regex)
    if (match) {
        return match[1]
    } else {
        return false
    }
}
onBackPress(() => {
    if (counter.user_chatList.unreadMessages > 0) {
        counter.user_chatList.unreadMessages = 0
    }
    setTimeout(() => {
        counter.user_chatList = []
        counter.chatPageExecute_user = ''
    }, 300)
})
const back = () => {
    if (counter.user_chatList.unreadMessages > 0) {
        counter.user_chatList.unreadMessages = 0
    }
    setTimeout(() => {
        counter.user_chatList = []
        counter.chatPageExecute_user = ''
    }, 300)
    uni.navigateBack()
}
const openMoreFunc = () => {
    proxy.$refs.moreFunc.open()
}

// 新增当前红包数据的响应式引用
const currentRedPacket = reactive({
    username: '',
    avatar: '',
    redPacketInfo: null,
})

// 新增红包详情弹窗引用
const redPacketDetailPopup = ref(null)

// 打开红包详情
const openRedPacketDetail = async redpack => {
    console.log('打开红包详情:', redpack)
    const redpacket_id = redpack.content.redpacket_id

    const res = await api.GetRedPacket({ redpacket_id })
    if (res.code == 1) {
        // 设置当前红包数据
        currentRedPacket.username = redpack.username
        currentRedPacket.avatar = redpack.avatar
        currentRedPacket.redPacketInfo = redpack.content

        // 打开红包详情弹窗
        proxy.$refs.redPacketDetailPopup.open()
    } else {
        //增加抢红包失败的弹窗
        currentRedPacket.username = redpack.username
        currentRedPacket.avatar = redpack.avatar
        currentRedPacket.redPacketInfo = {
            ...redpack.content,
            isFinished: true,
        }

        // 打开红包详情弹窗，但显示已抢完
        proxy.$refs.redPacketDetailPopup.open()
    }
}

// 关闭红包详情
const closeRedPacketDetail = () => {
    proxy.$refs.redPacketDetailPopup.close()
}

//sse
const openCore = response => {
    openLoading.value = false
    console.log('open sse：', response)
}
const errorCore = err => {
    console.log('error sse：', err)
}

//接收消息
const messageCore = msg => {
    const data = msg.data ? JSON.parse(msg.data) : {}
    if (data.type && ['hint', 'image', 'redpacket', 'text', 'follow'].includes(data.type)) {
        const newData = {
            ...data,
            //根据时间戳生成随机id
            id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + new Date().getTime(),
        }
        ShowData.push(newData)
        returnBottom(true)
    }
}

const finishCore = () => {
    console.log('finish sse')
    loading.value = false
}

const sseStart = () => {
    if (loading.value) return

    openLoading.value = true
    loading.value = true

    chatSSEClientRef.value.startChat({
        /**
         * 注意：
         * 如果使用 sse-server.js 要在手机端使用的话，请确保你的手机和电脑处在一个局域网下并且是正常的ip地址
         */
        // url: 'http://47.92.233.116:8001/api/chat.room/receive?match_id=' + Props.match_id,
        url: counter.baseUrl + '/api/chat.room/receive?match_id=' + Props.match_id,
        headers: {
            server: 1,
            'ba-user-token': uni.getStorageSync('access_token'),
            'app-version': '1.1.0',
        },
        // 默认为 post
        method: 'get',
        // body: {
        //   "stream":true,
        //   "model": "deepseek-chat",
        //   "messages": [
        //     {"role": "system", "content": "你是来自艺咖科技的数字员工，你的名字叫小咖。"}]
        // }
    })
}
const sseStop = () => {
    chatSSEClientRef.value.stopChat()
    console.log('stop')
}
</script>

<style lang="scss">
.setBox {
    width: 100%;
    border-radius: 20rpx 20rpx 0 0;
    background-color: #fff;
    padding-bottom: 20rpx;

    .setButton {
        width: 100%;
        border-bottom: 1rpx solid #e2e2e2;
        height: 100rpx;
        background-color: #fff;
        text-align: center;
        line-height: 100rpx;
        border-radius: 20rpx 20rpx 0 0;
    }
}

.pop_up {
    width: 100%;
    text-align: center;
    padding: 20rpx 0;
    color: #909090;
    font-size: 26rpx;
}

.chat_box_my_image_rigth {
    display: flex;
    justify-content: flex-end;
    margin: 20rpx auto;
    width: 680rpx;
    padding: 0rpx 20rpx;
}

.contnet_image {
    margin: 0rpx 20rpx;
    max-width: 320rpx;
    max-height: 200rpx;
    border-radius: 10rpx;
}

.chat_box_my_image_left {
    display: flex;
    justify-content: flex-start;
    margin: 20rpx auto;
    width: 680rpx;
    padding: 0rpx 20rpx;
}

.inputStyle {
    background-color: #e6e6e6;
    width: 470rpx;
    padding: 10rpx;
    border-radius: 10rpx;
    margin-right: 20rpx;
}

.nullData_box {
    image {
        width: 500rpx;
        height: 500rpx;
    }

    text {
        margin-top: 20rpx;
        color: #909090;
    }

    width: 600rpx;
    height: 600rpx;
    position: fixed;
    top: calc(50% - 300rpx);
    left: calc(50% - 300rpx);
    text-align: center;
}

.scroll-view_style {
    width: 100%;
    // height:calc(100vh - 100rpx - 100rpx - 20rpx);
    height: 63vh;
    box-sizing: border-box;
    transition: all 0.3s;
}

.statusBar {
    width: 100%;
    height: var(--status-bar-height);
    background-color: white;
}

.uni_mySet_ber {
    width: 100%;
    padding: 20rpx;
    background-color: #fff;
    display: flex;
    align-items: center;
    box-sizing: border-box;

    .ber_rigth {
        text-align: right;
    }

    view {
        flex: 0.5;
    }

    .ber_mddel {
        text-align: center;
        font-weight: bold;
        flex: 1;
    }
}

.bottm_from {
    width: 100%;
    padding: 20rpx;
    align-items: center;
    background-color: #ffffff;
    border-top: 1rpx solid #e8e8e8;
    box-sizing: border-box;
    display: flex;
    position: absolute;
    bottom: 0rpx;
    left: 0rpx;
    transition: all 0.1s;

    .send_true {
        background-image: linear-gradient(-225deg, #202736, #202737);
        color: #fff;
        font-weight: bold;
        border-radius: 10rpx;
        width: 120rpx;
        height: 65rpx;
        margin-left: 20rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;
        font-size: 28rpx;
    }

    .send_false {
        background-image: linear-gradient(-225deg, #202736, #202737);
        opacity: 0.6;
        color: #fff;
        font-weight: bold;
        border-radius: 10rpx;
        width: 120rpx;
        margin-left: 20rpx;
        height: 65rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        transition: all 0.3s;
        font-size: 28rpx;
    }
}

.chat_box_shop {
    display: flex;
    justify-content: flex-start;
    margin: 20rpx auto;
    width: 680rpx;
    padding: 0rpx 20rpx;

    .left_chat {
        display: flex;
        flex-flow: column;
        align-items: flex-start;

        .chat_content_box {
            background-color: #fff;
            margin-left: 20rpx;
            padding: 10rpx 20rpx;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            word-break: break-all;
            border-radius: 10rpx;
            position: relative;
            max-width: calc(680rpx - 20rpx - 70rpx);
            box-shadow: 0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.4);

            .chat_triangle {
                width: 0;
                height: 0;
                border-top: 15rpx solid transparent;
                border-bottom: 15rpx solid transparent;
                border-right: 15rpx solid #fff;
                position: absolute;
                left: -13rpx;
                top: 5rpx;
                z-index: 2;
            }
        }
    }
}

.username {
    font-size: 26rpx;
    margin: -10rpx 0rpx 10rpx 20rpx;
    color: #909090;
}

.chat_box_my {
    display: flex;
    justify-content: flex-end;
    margin: 20rpx auto;
    width: 680rpx;
    padding: 0rpx 20rpx;

    .chat_content_box {
        background-color: #98e165;
        margin-right: 20rpx;
        padding: 10rpx 20rpx;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        word-break: break-all;
        border-radius: 10rpx;
        position: relative;
        max-width: calc(680rpx - 20rpx - 70rpx);

        .chat_triangle {
            width: 0;
            height: 0;
            border-top: 15rpx solid transparent;
            border-bottom: 15rpx solid transparent;
            border-left: 15rpx solid #98e165;
            position: absolute;
            right: -13rpx;
            top: 5rpx;
            z-index: 2;
        }
    }
}

.logo_style {
    width: 70rpx;
    border-radius: 5rpx;
    height: 70rpx;
}

.header {
    background-color: #fff;
    height: var(--status-bar-height);
    width: 100%;
}

body {
    background-color: #f3f3f3;
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
.redpack-box {
    width: 100%;
    background-color: #fff;
    border-radius: 20rpx 20rpx 0 0;
    overflow: hidden;

    .redpack-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 30rpx;
        border-bottom: 1rpx solid #f2f2f2;

        .redpack-title {
            font-size: 32rpx;
            font-weight: bold;
            color: #333;
        }
    }

    .redpack-content {
        padding: 30rpx;

        .redpack-item {
            margin-bottom: 30rpx;

            .redpack-label {
                display: block;
                font-size: 28rpx;
                color: #333;
                margin-bottom: 20rpx;
            }

            .redpack-input {
                width: 100%;
                height: 80rpx;
                background-color: #f5f5f5;
                border-radius: 10rpx;
                padding: 0 20rpx;
                box-sizing: border-box;
                font-size: 28rpx;
            }
        }

        .redpack-fixed-amounts {
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

        .redpack-info {
            padding: 20rpx;
            background-color: #f8f8f8;
            border-radius: 10rpx;
            margin-bottom: 30rpx;
            text-align: center;
            font-size: 28rpx;
            color: #ff5252;
        }

        .redpack-button {
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

// 添加红包样式
.chat_redpacket_box {
    background: linear-gradient(135deg, #ff8c66, #e53935);
    width: 320rpx;
    height: 140rpx;
    border-radius: 12rpx;
    margin-right: 20rpx;
    overflow: hidden;
    position: relative;
    box-shadow: 0 4rpx 8rpx rgba(229, 57, 53, 0.2);
    border: 1rpx solid rgba(255, 255, 255, 0.2);

    .redpacket_top {
        height: 58rpx;
        padding: 15rpx;
        display: flex;
        align-items: center;
        background-image: linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
        background-size: 20rpx 20rpx;

        .redpacket_icon {
            width: 50rpx;
            height: 50rpx;
            margin-right: 15rpx;
        }

        .redpacket_text {
            color: #fff9f5;
            font-size: 24rpx;
            font-weight: bold;
            text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.15);
        }
    }

    .redpacket_bottom {
        height: 60rpx;
        background-color: rgba(136, 14, 19, 0.9);
        display: flex;
        align-items: center;
        padding: 0 15rpx;
        position: relative;
        overflow: hidden;

        &::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1rpx;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
        }

        text {
            color: #ffe0e0;
            font-size: 22rpx;
        }
    }

    &::before {
        content: '';
        position: absolute;
        top: -30rpx;
        right: -30rpx;
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        background: radial-gradient(rgba(255, 255, 255, 0.3), transparent 70%);
    }
}

.shop_redpacket {
    margin-left: 20rpx;
    margin-right: 0;
    background: linear-gradient(135deg, #ff5252, #b71c1c);

    .redpacket_bottom {
        background-color: rgba(114, 11, 22, 0.9);
    }
}

// 红包详情弹窗样式
.redpack-detail-box {
    width: 600rpx;
    max-height: 800rpx;
    background-color: #fff;
    border-radius: 20rpx;
    overflow: hidden;
    position: relative;

    &.redpack-finished {
        .redpack-detail-header {
            background: linear-gradient(135deg, #9e9e9e, #616161);
        }
    }
}

.redpack-detail-header {
    height: 300rpx;
    background-color: #ff0000;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .redpack-detail-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
    }

    .redpack-detail-avatar {
        z-index: 1;
        margin-bottom: 20rpx;

        .redpack-avatar {
            width: 120rpx;
            height: 120rpx;
            border-radius: 60rpx;
            border: 4rpx solid #ffe8e8;
        }
    }

    .redpack-detail-username {
        z-index: 1;
        margin-bottom: 10rpx;

        text {
            color: #fff;
            font-size: 32rpx;
            font-weight: bold;
        }
    }

    .redpack-detail-msg {
        z-index: 1;

        text {
            color: #ffefbf;
            font-size: 28rpx;
        }
    }
}

.redpack-detail-content {
    padding: 40rpx;
    display: flex;
    flex-direction: column;
    align-items: center;

    .redpack-detail-amount {
        display: flex;
        align-items: flex-end;
        margin-bottom: 20rpx;

        .amount-symbol {
            font-size: 40rpx;
            color: #ff0000;
            margin-right: 5rpx;
            font-weight: bold;
        }

        .amount-value {
            font-size: 80rpx;
            color: #ff0000;
            font-weight: bold;
            line-height: 1;
        }
    }

    .redpack-detail-finished {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 20rpx;

        .redpack-finished-icon {
            width: 120rpx;
            height: 120rpx;
            margin-bottom: 20rpx;
        }

        .redpack-finished-text {
            font-size: 32rpx;
            color: #9e9e9e;
            font-weight: bold;
        }
    }

    .redpack-detail-info {
        margin-bottom: 20rpx;

        text {
            font-size: 28rpx;
            color: #666;
        }
    }

    .redpack-detail-time {
        text {
            font-size: 24rpx;
            color: #999;
        }
    }
}

.redpack-detail-close {
    position: absolute;
    bottom: -100rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 80rpx;
    height: 80rpx;
    border-radius: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.3);
}

// 添加跟单消息样式
.chat_follow_box {
    background: linear-gradient(135deg, #4caf50, #2e7d32);
    width: 320rpx;
    height: auto;
    border-radius: 12rpx;
    margin-right: 20rpx;
    overflow: hidden;
    position: relative;
    box-shadow: 0 4rpx 8rpx rgba(46, 125, 50, 0.2);
    border: 1rpx solid rgba(255, 255, 255, 0.2);
    display: flex;
    flex-direction: column;

    .follow_top {
        height: 58rpx;
        padding: 15rpx;
        display: flex;
        align-items: center;
        background-image: linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
        background-size: 20rpx 20rpx;

        .follow_icon {
            width: 50rpx;
            height: 50rpx;
            margin-right: 15rpx;
        }

        .follow_text {
            color: #fff;
            font-size: 24rpx;
            font-weight: bold;
            text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.15);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            flex: 1;
        }
    }

    .follow_content {
        flex: 1;
        padding: 10rpx 15rpx;
        background-color: rgba(255, 255, 255, 0.1);

        .follow_info {
            display: flex;
            margin-bottom: 8rpx;

            .follow_label {
                color: rgba(255, 255, 255, 0.8);
                font-size: 22rpx;
                width: 70rpx;
            }

            .follow_value {
                color: #fff;
                font-size: 22rpx;
                flex: 1;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }

    .follow_bottom {
        height: 50rpx;
        background-color: rgba(27, 94, 32, 0.9);
        display: flex;
        align-items: center;
        padding: 0 15rpx;
        position: relative;
        overflow: hidden;

        &::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1rpx;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
        }

        text {
            color: #fff;
            font-size: 22rpx;
        }
    }

    &::before {
        content: '';
        position: absolute;
        top: -30rpx;
        right: -30rpx;
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        background: radial-gradient(rgba(255, 255, 255, 0.3), transparent 70%);
    }
}

.shop_follow {
    margin-left: 20rpx;
    margin-right: 0;
    background: linear-gradient(135deg, #3f51b5, #1a237e);

    .follow_bottom {
        background-color: rgba(26, 35, 126, 0.9);
    }
}
</style>

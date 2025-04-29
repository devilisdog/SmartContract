<template>
    <z-paging ref="cardList" v-model="gameData" @query="dataList" :auto-show-back-to-top="true">
        <template v-slot:top>
            <view class="status_bar" style="background-color: #fff; height: var(--status-bar-height)" />
            <uni-nav-bar height="100rpx">
                <view style="margin: auto; width: 100%; padding: 0px 5px">
                    <SegmentedControl :current="current" styleType="text" :values="groupitems" activeColor="#dd3620"
                        @clickItem="onClickItem"> </SegmentedControl>
                </view>
                <template v-slot:left>
                    <navigator open-type="navigate" url="/pages/score/gameRecord/gameRecord">
                        <!-- <view style="color:#b6b6b6;font-weight:bold;">开奖公告</view> -->
                    </navigator>
                </template>
                <template v-slot:right>
                    <text style="color: #b6b6b6; font-weight: bold" @click="open">{{ popupData[popupValue].title
                        }}</text>
                </template>
            </uni-nav-bar>
        </template>
        <!-- 数字彩 -->
        <view v-if="current === 0">
            <numerItem></numerItem>
        </view>
        <!-- 足球 -->
        <view v-else-if="current === 1">
            <view style="background-color: white; padding: 0rpx 10rpx; width: 100%; box-sizing: border-box">
                <uni-segmented-control :current="zqcurrent" styleType="text" :values="zqgroupitems"
                    activeColor="#dd3620" @clickItem="onClickzqItem"> </uni-segmented-control>
            </view>
            <!-- 竞彩赛果 -->
            <view v-if="zqcurrent === 0">
                <!-- 日期选择 -->
                <srcolcheck :current="datecurrent" styleType="text" :values="dategroupitems" activeColor="#dd3620"
                    @onClickdateItem="onClickdateItem"></srcolcheck>
                <!-- 列表 -->
                <listitemJcsg v-for="(itme, index) in gameData" :cardInfo="itme" :key="itme.matchId" />
            </view>
            <!-- 竞彩即时 -->
            <view v-else-if="zqcurrent === 1">
                <!-- 日期选择 -->
                <srcolcheck :current="datecurrent" styleType="text" :values="dategroupitems" activeColor="#dd3620"
                    @onClickdateItem="onClickdateItem"></srcolcheck>
                <!-- 列表 -->
                <listitem v-for="(itme, index) in gameData" :cardInfo="itme" :key="itme.matchId" type="zq"
                    @onClick="clickGameCard($event, 'zq',)" />
            </view>

            <!-- 北单 -->
            <view v-else-if="zqcurrent === 2">
                <!-- 日期选择 -->
                <srcolcheck :current="datecurrent" styleType="text" :values="dategroupitems" activeColor="#dd3620"
                    @onClickdateItem="onClickdateItem"></srcolcheck>
                <!-- 列表 -->
                <listitem v-for="(itme, index) in gameData" :cardInfo="itme" :key="itme.matchId" type="zq"
                    @onClick="clickGameCard($event, 'zq')" />
            </view>

            <!-- 足彩 -->
            <view v-else>
                <!-- 日期选择 -->
                <srcolcheck :current="datecurrent" styleType="text" :values="dategroupitems" activeColor="#dd3620"
                    @onClickdateItem="onClickdateItem"></srcolcheck>
                <!-- 列表 -->
                <listitem v-for="(itme, index) in gameData" :cardInfo="itme" :key="itme.matchId" type="zq"
                    @onClick="clickGameCard($event, 'zq')" />
            </view>
        </view>

        <!-- 篮球 -->
        <view v-else>
            <view style="background-color: white; padding: 0rpx 10rpx; width: 100%; box-sizing: border-box">
                <uni-segmented-control :current="lqcurrent" styleType="text" :values="bkGroupitems"
                    activeColor="#dd3620" @clickItem="onClicklqItem"> </uni-segmented-control>
            </view>
            <!-- 竞彩赛果 -->
            <view v-if="lqcurrent === 2">
                <!-- 日期选择 -->
                <srcolcheck :current="datecurrent" styleType="text" :values="dategroupitems" activeColor="#dd3620"
                    @onClickdateItem="onClickdateItem"></srcolcheck>
                <!-- 列表 -->
                <listitemJcsg v-for="(itme, index) in gameData" :cardInfo="itme" :key="itme.matchId" />
            </view>
            <view v-else>
                <!-- 日期选择 -->
                <srcolcheck :current="datecurrent" styleType="text" :values="dategroupitems" activeColor="#dd3620"
                    @onClickdateItem="onClickdateItem"></srcolcheck>

                <listitem v-for="(itme, index) in gameData" :cardInfo="itme" :key="itme.matchId" type="lq"
                    @onClick="clickGameCard($event, 'lq')" />
                <!-- 列表 -->
            </view>
        </view>
    </z-paging>

    <uni-popup type="bottom" ref="screen" :mask-click="false">
        <!-- 筛选弹窗 -->
        <view class="popupCard">
            <view :class="popupValue == index ? 'popup_button_true' : 'popup_button'" v-for="(itme, index) in popupData"
                @click="popupSelect(index)">
                {{ itme.title }}
            </view>
            <view class="popup_button" style="background-color: #e8e8e8; color: black; margin-top: 40rpx"
                @click="closePopup"> 取消 </view>
        </view>
    </uni-popup>

    <customtabbar :current="RealName == 0 ? 0 : 3"></customtabbar>
</template>
<script setup>
import api from '@/common/vmeitime-http/sporttery.js'
import numerItem from '@/components/score/numerItme/numerItme.vue'
import srcolcheck from '@/components/score/srcolcheck/srcolcheck.vue'
import listitem from '@/components/score/listitem/listitem.vue'
import listitemJcsg from '@/components/score/listitem/listitem_jcsg.vue'
import SegmentedControl from '@/components/score/SegmentedControl/SegmentedControl.vue'
import { useCounterStore } from '@/stores/counter'
import customtabbar from '@/components/nav-bottom/nav-bottom.vue'
import { onBeforeMount, ref, reactive, getCurrentInstance, watch } from 'vue'
import { onHide, onShow } from '@dcloudio/uni-app'
const { proxy, ctx } = getCurrentInstance()

const gameData = ref([]) //列表基础数据
const RealName = ref(uni.getStorageSync('RealName') || '')
const counter = useCounterStore() //状态管理
const dategroupitems = reactive([]) //日期分类数据
const popupData = reactive([
    //比赛类型分类
    {
        title: '全部',
        value: '',
    },
    {
        title: '未开赛',
        value: 0,
    },
    {
        title: '比赛中',
        value: 1,
    },
    {
        title: '已完赛',
        value: 2,
    },
])
const datecurrent = ref(5) //日期选择器默认值

const popupValue = ref(0) //比赛类型分类
const zqgroupitems = reactive(['竞彩赛果', '竞彩即时', '北单', '胜负彩']) //头部tab数据
const bkGroupitems = reactive(['全部', '竞彩即时', '竞彩赛果']) //头部tab数据

const current = ref(1) //头部选择器默认值
const zqcurrent = ref(1) //足球的二级index
const lqcurrent = ref(0) //篮球的二级index

const groupitems = reactive(['数字彩', '足球', '篮球']) //足球的二级tab数据
const footballClsssify = reactive(['666', '407', '405', '401', '406']) //获取数据对应的玩法ud
const apitoken = ref(0)
watch(RealName, newValue => {
    console.log('RealName changed:', newValue)
    uni.setStorageSync('RealName', newValue) // 每次变化时更新本地存储
})
onHide(() => {
    // closeAutoData()
})
onShow(() => {
    RealName.value = uni.getStorageSync('RealName')
    console.log(RealName.value, '比分测试')
    api.Gettoken()
        .then(res => {
            if (res.data.code == 1) {
                apitoken.value = res.data.data.token
                uni.setStorageSync('apitoken', res.data.data.token)
                if (proxy.$refs.cardList) {
                    proxy.$refs.cardList.refresh()
                }
            }
        })
        .catch(err => {
            console.log(err)
        })
})
const closePopup = () => {
    //关闭筛选弹窗
    proxy.$refs.screen.close()
    uni.showTabBar() //显示底部导航
}
const open = () => {
    //打开筛选弹窗
    proxy.$refs.screen.open()
    uni.hideTabBar() //关闭底部导航
}
const popupSelect = index => {
    //筛选弹窗里面选择时触发
    if (index != popupValue.value) {
        popupValue.value = index
        proxy.$refs.cardList.reload()
        closePopup()
    }
}
const clickGameCard = (data, type) => {
    const { matchId, awayId, homeId } = data
    console.log(data, '点击比赛卡片触发')
    //点击比赛卡片触发
    uni.navigateTo({
        //跳转至比赛详情
        url: `/pages/score/score_ticai/gameParticulars?info_id=${matchId}&gameType=${type}&awayId=${awayId}&homeId=${homeId}`,
        animationType: 'slide-in-bottom',
    })
}
const dataList = (pageNo, pageSize) => {
    //刷新(比赛列表)
    if (current.value == 1) {
        footballList(pageNo, pageSize)
    } else if (current.value == 2) {
        basketballLst(pageNo, pageSize)
    }
}
const footballList = (pageNo, pageSize) => {
    //获取数据足球
    closeAutoData()
    var gameType = '407'
    // if ((current.value = 1)) {
    //     gameType = footballClsssify[zqcurrent.value]
    // } else {
    //     return
    // }

    const toDay = new Date().toISOString().split('T')[0]

    const date = dategroupitems[datecurrent.value] ? dategroupitems[datecurrent.value].initData : toDay

    if (zqcurrent.value != 0) {
        api.GetFootballMatch({
            page: pageNo,
            pageSize: pageSize,
            date:date,
            type: zqcurrent.value, //1 即时  2 北单 3 胜负
        })
            .then(res => {
                if (res.data.code == '1') {
                    console.log(res.data.data.list, 'res')
                    proxy.$refs.cardList.complete(res.data.data.list)
                    getselectdatearr(date, res.data.data.dateList)
                    getVidoLive() //获取视频直播
                } else if (res.data.code == '2') {
                    proxy.$refs.cardList.complete(true)
                } else {
                    proxy.$refs.cardList.complete(false)
                }
            })


        // uni.request({
        //     url: 'https://play3.honghuohuo.vip/api/common.Api.index/MatchData',
        //     timeout: 10000,
        //     method: 'GET',
        //     header: {
        //         'Ba-User-Token': apitoken.value,
        //         Server: '1',
        //     },
        //     data: {
        //         apiName: 'getMatchListByDate',
        //         game: gameType, //玩法ud
        //         key: 'jmkj',
        //         secret: '500e2f2775ddf6b0b355eac5c4e162cb',
        //         date: dategroupitems[datecurrent.value] ? dategroupitems[datecurrent.value].initData : '',
        //         matchStatus: popupData[popupValue.value].value,
        //         pageNo: pageNo,
        //         pageSize: pageSize,
        //     },
        //     success(suss) {
        //         if (suss.data.code == '1') {
        //             proxy.$refs.cardList.complete(suss.data.data.matchList)
        //             //获取当天日期
        //             getselectdatearr(new Date().toISOString().split('T')[0])
        //             // autoGetInfo()
        //             getVidoLive() //获取视频直播
        //         } else if (suss.data.code == '2') {
        //             proxy.$refs.cardList.complete(true)
        //         } else {
        //             proxy.$refs.cardList.complete(false)
        //         }
        //     },
        //     fail(err) {
        //         proxy.$refs.cardList.complete(false)
        //     },
        // })
    } else {
        api.GetFootballResult({
            date:date,
            page: pageNo,
            pageSize: pageSize,
        })
            .then(res => {
                if (res.data.code == '1') {
                    proxy.$refs.cardList.complete(res.data.data.list)
                    getselectdatearr(date, res.data.data.dateList)
                } else if (res.data.code == '2') {
                    proxy.$refs.cardList.complete(true)
                } else {
                    proxy.$refs.cardList.complete(false)
                }
            })
        return

        // uni.request({
        //     url: 'https://play3.honghuohuo.vip/api/common.Api.index/MatchData_Result_jc',
        //     timeout: 10000,
        //     method: 'GET',
        //     header: {
        //         'Ba-User-Token': apitoken.value,
        //         Server: '1',
        //     },
        //     data: {
        //         date: dategroupitems[datecurrent.value] ? dategroupitems[datecurrent.value].initData : '',
        //         pageNo: pageNo,
        //         pageSize: pageSize,
        //         type: '1',
        //     },
        //     success(suss) {
        //         if (suss.data.code == '1') {
        //             proxy.$refs.cardList.complete(suss.data.data.matchList.data)
        //             getselectdatearr(suss.data.data.date, suss.data.data.dateArr.slice(-6))
        //         } else if (suss.data.code == '2') {
        //             proxy.$refs.cardList.complete(true)
        //         } else {
        //             proxy.$refs.cardList.complete(false)
        //         }
        //     },
        //     fail(err) {
        //         proxy.$refs.cardList.complete(false)
        //     },
        // })
    }
}

const getVidoLive = arr => {
    //获取竞彩视频直播
    // api.GetLiveInfo({}).then(res => {
    //     console.log(res, 'res')
    // })

    // uni.request({
    //     url: 'http://111.67.201.54:9568/api.SportLiveV2/list?key=jmkj&secret=500e2f2775ddf6b0b355eac5c4e162cb',
    //     timeout: 10000,
    //     method: 'GET',
    //     success(suss) {
    //         for (var key in suss.data) {
    //             var gameId = key.split('id')[1]
    //             for (var i = 0; i < gameData.value.length; i++) {
    //                 if (gameData.value[i].matchId == Number(gameId)) {
    //                     gameData.value[i]['isVidoLive'] = true
    //                     break
    //                 }
    //             }
    //         }
    //     },
    //     fail(err) {
    //         console.log(',err', err)
    //     },
    // })
}
const basketballLst = (pageNo, pageSize) => {
    //获取数据篮球
    // var gameType = '406'
    // if (lqcurrent.value == 0) {
    //     gameType = ''
    // } else {
    //     gameType = '406'
    // }
    closeAutoData()

    const toDay = new Date().toISOString().split('T')[0]

    const date = dategroupitems[datecurrent.value] ? dategroupitems[datecurrent.value].initData : toDay

    if (lqcurrent.value != 2) {
        api.GetBasketballMatch({
            date:date,
            page: pageNo,
            pageSize: pageSize,
        })
            .then(res => {
                if (res.data.code == '1') {
                    proxy.$refs.cardList.complete(res.data.data.list)
                    getselectdatearr(date, res.data.data.dateList)
                } else if (res.data.code == '2') {
                    proxy.$refs.cardList.complete(true)
                } else {
                    proxy.$refs.cardList.complete(false)
                }
            })
            .finally(() => {
                proxy.$refs.cardList.complete(false)
            })
        // uni.request({
        //     url: 'https://play3.honghuohuo.vip/api/common.Api.index/MatchData',
        //     timeout: 10000,
        //     method: 'GET',
        //     header: {
        //         'Ba-User-Token': apitoken.value,
        //         Server: '1',
        //     },
        //     data: {
        //         apiName: 'getBkMatchListByDate',
        //         game: gameType, //玩法ud
        //         key: 'jmkj',
        //         secret: '500e2f2775ddf6b0b355eac5c4e162cb',
        //         date: dategroupitems[datecurrent.value] ? dategroupitems[datecurrent.value].initData : '',
        //         matchStatus: popupData[popupValue.value].value,
        //         pageNo: pageNo,
        //         pageSize: pageSize,
        //     },
        //     success(suss) {
        //         if (suss.data.code == '1') {
        //             proxy.$refs.cardList.complete(suss.data.data.matchList)
        //             getselectdatearr(suss.data.data.date, suss.data.data.dateArr.slice(8, 14))
        //             // autoGetInfo()
        //         } else if (suss.data.code == '2') {
        //             proxy.$refs.cardList.complete(true)
        //         } else {
        //             proxy.$refs.cardList.complete(false)
        //         }
        //     },
        //     fail(err) {
        //         proxy.$refs.cardList.complete(false)
        //     },
        // })
    } else {
        api.GetBasketballResult({
           date:date,
            page: pageNo,
            pageSize: pageSize,
        })
            .then(res => {
                console.log(res.data.data.list, 'res')
                if (res.data.code == '1') {
                    proxy.$refs.cardList.complete(res.data.data.list)
                    getselectdatearr(date, res.data.data.dateList)
                } else if (res.data.code == '2') {
                    proxy.$refs.cardList.complete(true)
                } else {
                    proxy.$refs.cardList.complete(false)
                }
            })
            .finally(() => {
                proxy.$refs.cardList.complete(false)
            })
        // uni.request({
        //     url: 'https://play3.honghuohuo.vip/api/common.Api.index/MatchData_Result_jc',
        //     timeout: 10000,
        //     method: 'GET',
        //     header: {
        //         'Ba-User-Token': apitoken.value,
        //         Server: '1',
        //     },
        //     data: {
        //         key: 'jmkj',
        //         secret: '500e2f2775ddf6b0b355eac5c4e162cb',
        //         date: dategroupitems[datecurrent.value] ? dategroupitems[datecurrent.value].initData : '',
        //         pageNo: pageNo,
        //         pageSize: pageSize,
        //         type: '2',
        //     },
        //     success(suss) {
        //         if (suss.data.code == '1') {
        //             proxy.$refs.cardList.complete(suss.data.data.matchList.data)
        //             getselectdatearr(suss.data.data.date, suss.data.data.dateArr.slice(-6))
        //         } else if (suss.data.code == '2') {
        //             proxy.$refs.cardList.complete(true)
        //         } else {
        //             proxy.$refs.cardList.complete(false)
        //         }
        //     },
        //     fail(err) {
        //         proxy.$refs.cardList.complete(false)
        //     },
        // })
    }
}

const autoTimer = ref(null)
const autoGetInfo = () => {
    //判断是否需要自动获取数据
    var autoArr = []
    setTimeout(() => {
        if (current.value == 1) {
            gameData.value.forEach(function (itme, index) {
                if (itme.status == 11 || itme.status == 14 || itme.status == 12) {
                    autoArr.push(itme.matchId)
                }
            })
            if (autoArr.length > 0 && !autoTimer.value) {
                autoTimer.value = setInterval(() => {
                    console.log('执行☞')
                    GetUnderwayData(autoArr, 'getMatchListLiveScore')
                }, 5000)
            }
        } else if (current.value == 2) {
            gameData.value.forEach(function (itme, index) {
                if (itme.status != 0 && itme.status != -1) {
                    autoArr.push(itme.matchId)
                }
            })
            if (autoArr.length > 0 && !autoTimer.value) {
                autoTimer.value = setInterval(() => {
                    console.log('执行☞')
                    GetUnderwayData(autoArr, 'getBkMatchListLiveScore')
                }, 5000)
            }
        }
    }, 300)
}
const GetUnderwayData = (arr, name) => {
    //获取实时数据定时访问
    uni.request({
        url: 'https://play3.honghuohuo.vip/api/common.Api.index/MatchData',
        timeout: 10000,
        method: 'GET',
        header: {
            'Ba-User-Token': apitoken.value,
            Server: '1',
        },
        data: {
            apiName: name, //获取实时数据
            key: 'jmkj',
            secret: '500e2f2775ddf6b0b355eac5c4e162cb',
            matchIdList: arr,
        },
        success(suss) {
            if (suss.data.code == '1') {
                refreshListData(suss.data.data.matchIdLiveMap)
            } else {
                closeAutoData()
            }
        },
        fail(err) {
            closeAutoData()
        },
    })
}
const refreshListData = newData => {
    //更新列表数据
    var copyNewData = JSON.parse(JSON.stringify(newData))
    for (var id in copyNewData) {
        //循环获取到比赛中最新的数据（对象） id=matchId
        for (var index = 0; index < gameData.value.length; index++) {
            //循环当天列表所有的数据
            if (gameData.value[index].matchId == id) {
                //找到需要更新数据的比赛 用matchId找
                for (var key in copyNewData[id]) {
                    //找到后，循环新数据中的key按照key覆盖之前的数据
                    gameData.value[index][key] = copyNewData[id][key]
                }
                break
            }
        }
    }
}
const closeAutoData = () => {
    //关闭定时器
    if (autoTimer.value) {
        console.log('关闭×')
        clearInterval(autoTimer.value)
        autoTimer.value = null
    }
}
const onClickzqItem = e => {
    //tab子分类足球
    if (zqcurrent.value != e.currentIndex) {
        dategroupitems.length = 0
        zqcurrent.value = e.currentIndex
        proxy.$refs.cardList.reload()
    }
}
const onClicklqItem = e => {
    //tab子分类篮球
    if (lqcurrent.value != e.currentIndex) {
        lqcurrent.value = e.currentIndex
        proxy.$refs.cardList.reload()
    }
}
const onClickItem = e => {
    //tab分类
    if (current.value != e.currentIndex) {
        dategroupitems.length = 0
        current.value = e.currentIndex
        proxy.$refs.cardList.reload()
    }
}

function onClickdateItem(e) {
    //日期选择
    if (datecurrent.value != e) {
        datecurrent.value = e
        proxy.$refs.cardList.reload()
    }
}

function getselectdatearr(selectDate, dateList = []) {
    // 获取最近7天内的日期数组 格式为：2025-04-28
    // const dateArr = []
    // for (let i = 6; i >= 0; i--) {
    //     const d = new Date()
    //     d.setDate(d.getDate() - i)
    //     const year = d.getFullYear()
    //     const month = String(d.getMonth() + 1).padStart(2, '0')
    //     const day = String(d.getDate()).padStart(2, '0')
    //     dateArr.push(`${year}-${month}-${day}`)
    // }

    //分类选择器数据处理
    dategroupitems.length = 0
    var copyDate = [...dateList]
    var nowDate = new Date() //用户当前时间
    var weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    copyDate.forEach(function (item, index) {
        if (new Date(item) && new Date(item).toString() !== 'Invalid Date') {
            if (selectDate == item) {
                datecurrent.value = index
            }
            var itme_time = new Date(item.replace(/-/g, '/') + ' 00:00:00')
            dategroupitems.push({
                date: itme_time.getMonth() + 1 + '/' + itme_time.getDate(),
                initData: item,
                week: itme_time.getDate() == nowDate.getDate() ? '今天' : weeks[itme_time.getDay()],
            })
        } else {
            if (selectDate == item) {
                datecurrent.value = index
            }
            dategroupitems.push({
                date: item,
                week: '',
                initData: item,
            })
        }
    })
}
</script>
<style>
.popup_button_true {
    width: 100%;
    padding: 20rpx;
    background-color: #dd3620;
    box-sizing: border-box;
    border-radius: 20rpx;
    text-align: center;
    font-weight: bold;
    color: white;
    margin-bottom: 20rpx;
    transition: 0.3s;
}

.popup_button {
    width: 100%;
    padding: 20rpx;
    background-color: white;
    box-sizing: border-box;
    border-radius: 20rpx;
    text-align: center;
    color: black;
    margin-bottom: 20rpx;
    transition: 0.3s;
}

.popupCard {
    width: 100%;
    padding: 20rpx;
    box-sizing: border-box;
    border-radius: 30rpx 30rpx 0 0;
    background-color: white;
}

body {
    background-color: #f9f9f9;
}
</style>

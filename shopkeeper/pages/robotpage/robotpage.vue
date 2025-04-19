<template>
	<view class="status_bar"></view><!-- 头部 -->
	<uni-nav-bar title="跟单机器人" leftIcon="back" @clickLeft="back()" leftText="返回"/>
	<view class="" style="margin-top: 15rpx;border-bottom: 1rpx solid #ededed;height: 120rpx;">
		<view style="display: flex;align-items: center;">
			<view class="" style="display:flex;align-items: center;">
				<image src='@/static/img/mimeImg/jiqiren.png' style="width: 100rpx; height:100rpx;margin-left: 20rpx;" />
				<view style="margin-left: 10rpx;width: 410rpx;display: flex;flex-direction: column;margin: 15rpx 20rpx;">
					<text style="font-size: 30rpx;">跟单机器人</text>
					<text style="font-size:25rpx;text-indent: 13rpx;color: #fdc830;" @click="addjiqiren()" v-show="robottype.robot_enabled=='1'">添加机器人</text>
				</view>
			</view>
			<view style="width: 220rpx;">
				<view class="" style="text-align: center;">
			<!-- 		<text style="color: #2a7fff;font-size: 26rpx;" v-show="robottype==null" @click="tiao(item)">去开通</text> -->
					<text style="color: #FDC830;font-size: 26rpx;" v-show="robottype.robot_status=='0'" @click="tiao(item)">申请机器人</text>
					<text style="color: #00aa7f ;font-size: 26rpx;" v-show="robottype.robot_status=='1'">待审核</text>
					<text style="color: red;font-size: 26rpx;" v-show="robottype.robot_status=='3'" @click="tiao(item)">审核未通过<br>(点击重新申请)</text>
					<text style="color:#FDC830;font-size: 26rpx;" v-show="robottype.robot_status==2&&robottype.robot_enabled==1">机器人开启</text>
					<text style="color:#8a8a8a;font-size: 26rpx;" v-show="robottype.robot_status==2&&robottype.robot_enabled==0">机器人关闭</text>
				</view>
				<view class="" style="display: flex;justify-content: center;" v-show="robottype.robot_status==2">
					<switch
						color="#FDC830" style="transform:scale(0.7)" 
						:checked="robottype.robot_enabled=='1'?true:false" 
						@change="setPayState($event)">
					</switch>
				</view>
			</view>
		</view>
	</view>
	<view class="resumendatosds">
		<view class="resumendatosdiv">
			<view class="resumendatosboxtop">
				<text>跟单机器人列表</text>
				<text style="font-size: 25rpx;color: gray;">({{robottotal}}个)</text>
			</view>
		</view>
	</view>
	<swiper  :style="{height:common.scrollH()-350-statusBarHeight+'rpx'}">
		<swiper-item style="height: 100%;width: 100%;">
			<z-paging ref="list" v-model="userData" @query='refresh'  :fixed='false'
			:use-page-scroll="false" :auto-show-back-to-top='true' :back-to-top-bottom='50'>
			<view class="" v-for="item,index in userData" :key="index" @click="goxiang(item.user_id)">
				<view class="jiqirenlist">
					<view class="jiqirenli">
						<view class="jiqirenlileft">
							<image :src="item.avatar" mode="" style="width: 100rpx;height:100rpx;"></image>
						</view>
						<view class="jiqirenlicenter">
							<view class="jiqirenlitop">
								<view class="" style="width: 50rpx;overflow: hidden;white-space: nowrap; text-overflow: ellipsis; ">
									{{item.nickname}}
								</view>
								<view class="" style="font-size: 25rpx;font-weight: bolder;">
									今日：<text style="font-size: 25rpx;font-weight: bolder;">{{item.follow_qty}}</text>
								</view>
								<view class="" style="font-size: 25rpx;font-weight: bolder;">
									合计：<text style="font-size: 25rpx;font-weight: bolder;">{{item.follow_qty_amount}}</text>
								</view>
							</view>
							<view class="jiqirenlibottom">
								<text style="font-size: 25rpx;font-weight: bolder;">{{getdatetime.getNowFormatDate(0,item.create_time)}}</text>
							</view>
						</view>
						<view class="jiqirenliright">
							<view class="" style="display: flex;justify-content: center;">
								<text>{{item.money}}元</text>
							</view>
							<view class="" style="margin-top: 20rpx;text-align: center;">
								<text v-if="item.robot_enabled==1" style="color: #FDC830;font-size: 26rpx;">机器人开启</text>
								<text v-else style="color: #8a8a8a;font-size: 26rpx;">机器人禁用</text>
							</view>
						</view>
					</view>
				</view>
			</view>
				</z-paging>
		</swiper-item>
	</swiper>
	<uni-popup ref="alertDialog" type="dialog">
	 				<uni-popup-dialog type="warn" cancelText="取消" confirmText="确认" title="提示" content="是否申请开启跟单机器人" @confirm="dialogConfirm"
	 					@close="dialogClose"></uni-popup-dialog>
	</uni-popup>
	<uni-popup ref="addjiqi">
		<view class="addjiqibox">
			<view class="addtitle">
				<text>添加机器人</text>
			</view>	
			<view class="addfromdiv">
				<uni-forms ref="robotForm" :modelValue="robotlistli">
					<uni-forms-item label="手机号" >
						<uni-easyinput v-model="robotlistli.mobile" maxlength="11" type="number" placeholder="请输入手机号" />
					</uni-forms-item>
					<uni-forms-item label="昵称" >
						<uni-easyinput v-model="robotlistli.nickname" maxlength="11" type="text" placeholder="请输入机器人昵称" />
					</uni-forms-item>
					<uni-forms-item label="密码">
						<uni-easyinput v-model="robotlistli.password" maxlength="6" type="number" placeholder="123456" />
					</uni-forms-item>
				</uni-forms>
			</view>
			<view class="goyongbutton">
				<view class="goyongyes" @click="tianclose">
					取消
				</view>
				<view class="goyongclose" @click="tianyes">
					确定
				</view>
			</view>
					
		</view>
	</uni-popup>
</template>
<script setup>
	import getdatetime from "@/common/getdatetime.js"
	import api from "@/common/vmeitime-http/mine/mine.js"
	import {useCounterStore} from '@/stores/counter'
	import {ref,reactive,onBeforeMount,getCurrentInstance} from 'vue';
	import { onLoad,onShow,onHide } from "@dcloudio/uni-app"
	import common from '@/common/common'
	const {proxy,ctx} = getCurrentInstance()
	const counter = useCounterStore(); //状态管理
	const statusBarHeight=ref(0)//状态栏高度
	onBeforeMount(()=>{
		statusBarHeight.value=uni.getSystemInfoSync().statusBarHeight//获取手机状态栏高度
	})
	const addshow=ref(false)
	const addtitle=ref('添加机器人')
	const userData=ref([
		{
			img:'@/static/img/mimeImg/jiqiren.png',
			name:'aaaa',
			taday:'10',
			heji:20,
			qianbao:'0.12',
			tiem:"2024-12-11 15.28.46",
			type:1
		}
	])
	const list = ref(null)
	const robottotal=ref(0)
	const robottype=reactive({
		robot_enabled:0,
		robot_status:0
	})
	const robotlistli=reactive({
		mobile:'',
		password:'123456',
		nickname:''
	})
	onShow(()=>{
		getrobottype()
	})
	const getrobottype=()=>{
		api.robottype().then((res)=>{
			robottype.robot_enabled=res.data.data.robot_enabled
			robottype.robot_status=res.data.data.robot_status
			if(res.data.data.robot_enabled==1){
				refresh()
			}
		})
	}
	const setPayState=(e)=>{
		if(e.detail.value){
			setrobottype({'key':'robot_enabled','value':1})
		}else{
		setrobottype({'key':'robot_enabled','value':0})
		}
	}
	const setrobottype=(type)=>{
		api.robotset(type).then((res)=>{
			if(res.data.code==1){
				getrobottype()
				refresh()
			}
		})
	}
	const refresh = (e, w) => {
		api.robotlist(
		{"per_page":w,
		"current_page":e}
		).then((res)=>{
				if(res.data.code==1){
					robottotal.value=res.data.data.total
					list.value.complete(res.data.data.data)
				}
		}).catch(()=>{
			list.value.complete(false)
		})
	}
	const back = () => {// 返回到上一个页面
		uni.navigateBack()
	}
	const tiao=(data)=>{//跳转至申请页
		proxy.$refs.alertDialog.open()
	
	}
	const dialogConfirm=()=>{
		api.robotapply().then((res)=>{
			console.log(res)
			if(res.data.code==1){
				robottype.robot_status=res.data.data
			}
		})
	}
	const dialogClose=()=>{
		proxy.$refs.alertDialog.close()
	}
	const addjiqiren=()=>{
		proxy.$refs.addjiqi.open()
	}
	const tianclose=()=>{
		proxy.$refs.addjiqi.close()
	}
	const tianyes=()=>{
		console.log(robotlistli)
		if(robotlistli.pasd==""||robotlistli.num==""||robotlistli.nickname==""){
			uni.showToast({
				title: '请输入添加机器人信息',
				icon: 'error',
				duration:500,
			})
		}else{
			addrobot()
		}
	}
	const addrobot=()=>{
		api.robotadd(robotlistli).then((res)=>{
			if(res.data.code==1){
				getrobottype()
				proxy.$refs.addjiqi.close()
			}else{
				uni.showToast({
					title: res.data.msg,
					icon: 'error',
					duration:500,
				})
			}
		})
	}
	const goxiang=(id)=>{
		uni.navigateTo({
			url:'/pages/robotpage/robotdetails?id='+id
		})
	}
</script>

<style>
	.switch_time{
		display: flex;
		justify-content: space-between;
		align-items: center;
		width:650rpx;
		margin: 0 auto;
	}
	.status_bar {
		background-color: #fff;
		height: var(--status-bar-height);
		width: 100%;
	}
	.sfq{
		width: 100%;
		height: 120rpx;
		display: flex;
		align-items: center;
	}
	.content{
		width: 100%;
		height: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.xia{
		width: 100%;
		height: 100rpx;
		align-items: center;
		justify-content: center;
		position: fixed;
		top: 19.5%;
		transition: 0.5s;
	}
	.addjiqibox{
		width:550rpx;
		background-color: white;
		border-radius: 20rpx;
	}
	.addtitle{
		width: 100%;
		height: 50rpx;
		text-align: center;
		line-height: 50rpx;
	}
	.addtitle text{
		font-size: 35rpx;
		font-weight: bolder;
	}
	.addfromdiv{
		width: 100%;
		padding: 10rpx 10rpx;
		margin-top: 15rpx;
	}
	.uni-easyinput{
		width: 90% !important;
	}
	.goyongbutton{
		height: 60rpx;
		display: flex;
		justify-content: space-between;
		border-top:1rpx solid grey ;
	}
	.goyongyes{
		width: 50%;
		height: 60rpx;
		text-align: center;
		line-height: 60rpx;
	}
	.goyongclose{
		width: 50%;
		height: 60rpx;
		text-align: center;
		line-height: 60rpx;
		color: #FDC830;
		border-left:1rpx solid grey ;
	}
	.jiqirenlist{
		width: 100%;
		height: 150rpx;
		border-bottom: 1rpx solid #ededed;
		padding: 10rpx 10rpx;
	}
	.jiqirenli{
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content:space-around;
	}
	.jiqirenlileft{
		width: 100rpx;
		height:100rpx;
	}
	.jiqirenlicenter{
		width: 400rpx;
		height:100rpx;
	}
	.jiqirenliright{
		width:200rpx;
		height: 100rpx;
	}
	.jiqirenlitop{
		width: 100%;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}
	.jiqirenlibottom{
		width: 100%;
		margin-top:20rpx;
		text-indent: 15rpx;
	}
	.resumendatosds{
		background-color: white;
		padding: 10rpx 20rpx;
		margin-top: 15rpx;
	}
	.resumendatosboxtop{
		height:70rpx;
		background: linear-gradient(to right, #ffcd58, #ffffff);
		display: flex;
		line-height: 70rpx;
		text-indent: 10rpx;
		border-radius: 10rpx 10rpx 0 0;
		
	}
	.resumendatosboxtop text{
		font-size: 30rpx;
		font-weight: bold;
		
	}
</style>

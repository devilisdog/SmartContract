<template>
	<view>
		<view class="statusBar"></view>
		<uni-nav-bar title="邀请店主" leftIcon="back" @clickLeft="back" leftText="返回"/>
		<view class="content" :style="'height: '+ boxheight +'px;'">
			
			<view class="maintop">
				<view class="maintime">
					<uni-datetime-picker type="daterange" :border="false"
										:clear-icon="false" v-model="range"  @change='clickTimePicker'
					/>
				</view>
			</view>
		<!-- 	<view class="resumendatos">
				<view class="resumendatosbox">
					<view class="resumendatosboxtbottom" style="display: flex;">
						<view class="resumendatosli" style="border-right: 1rpx dashed rgb(213,69,70);">
							<view class="resumentext" style="text-align: center;">
								<text style="color: rgb(213,69,70);">{{usernum.inviter_qty}}</text>
								<text>人</text>
							</view>
							<view class="resumentextli" style="text-align: center;">
								<text>邀请店主数</text>
							</view>
						</view>
						<view class="resumendatosli"style="border-right: 1rpx dashed rgb(213,69,70);">
							<view class="resumentext" style="text-align: center;">
								<text style="color: rgb(213,69,70);">{{usernum.sale_amount}}</text>
								<text>元</text>
							</view>
							<view class="resumentextli" style="text-align: center;">
								<text>出票金额</text>
							</view>
						</view>
						<view class="resumendatosli">
							<view class="resumentext" style="text-align: center;">
								<text style="color: rgb(213,69,70);">{{usernum.commission_amount}}</text>
								<text>元</text>
							</view>
							<view class="resumentextli" style="text-align: center;">
								<text>佣金</text>
							</view>
						</view>
					</view>
				</view>
			</view> -->
			<view class="resumendatoscenter">
			</view>
			<swiper :style="{height:common.scrollH()-650-statusBarHeight+'rpx'}">
				<swiper-item style="height: 100%;">
				<view class="mainbottom" style="height: 100%;" >
					<view class="" style="border-radius: 20rpx;height:100%;width: 97%;margin: 0 auto;">
						<z-paging ref="list" v-model="userData" @query='refresh'  :fixed='false'
						:use-page-scroll="false" :auto-show-back-to-top='true' :back-to-top-bottom='50'>
						
						<view class="maindox">
							<view class="maintitle">
								<view class="" v-for="(item,index) in navtitle" :key="index">
									{{item.title}}
								</view>
							</view>
							<view class="mainul">
								<view class="mainlist" v-for="(item,index) in userData" :key="index">
									<li>{{item.user_id}}</li>
									<li>{{item.nickname}}</li>
									<li>{{item.mobile}}</li>
									<li>{{GetDate.getNowFormatDate(1,item.create_time)}}</li>
								</view>
							</view>
						</view>
						</z-paging>
					</view>
			</view>
				</swiper-item>
			</swiper>
			<view class="mainbtn" @click="goyao">
				<text>立即邀请店主</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive,
		onBeforeMount,
		getCurrentInstance
	} from 'vue';
	import common from '@/common/common'
	import {
		onShow
	} from "@dcloudio/uni-app"
	import api from "@/common/vmeitime-http/user/user.js"
	import GetDate from "@/common/getdatetime.js"
	const back=()=>{
		uni.navigateBack()
	}
	const usernum=reactive({
		"sale_amount":"",
		"inviter_qty":"",
		"commission_amount":"",
		"inviter_qty":""
	})
	const navtitle=reactive([
		{
		title:"店铺编号"
		},
		{
		title:"店铺名称"
		},
		{
		title:"店主号码"
		},
		{
		title:"注册时间"
		}
	])
	const boxheight=ref(0)
	const statusBarHeight=ref(0)
	onShow(() => {
		if (list.value) {
			list.value.refresh()
		}
		statusBarHeight.value=uni.getSystemInfoSync().statusBarHeight
		 boxheight.value= uni.getSystemInfoSync().windowHeight - uni.getSystemInfoSync().statusBarHeight-50
	})
	const userData=ref([])
	const range =reactive([])
	const clickTimePicker=(time)=>{
		if(time[0]==time[1]){
			//转换未yyyy/dd/mm避免ios无法转换时间戳
			var starinit=time[0].split('-')
			var endinit=time[1].split('-')
			var newStarinit=starinit.join('/')
			var newEndinit=endinit.join('/')
			var date_star=new Date(newStarinit)
			var date_end=new Date(newEndinit)
			date_star.setHours(0)
			date_end.setDate(date_end.getDate()+1)
			date_end.setHours(0)
			range[0]=date_star.getFullYear()+'-'+(date_star.getMonth()+1)+'-'+date_star.getDate()
			range[1]=date_end.getFullYear()+'-'+(date_end.getMonth()+1)+'-'+date_end.getDate()
			refresh(1,10)
			return
		}
		range[0]=time[0]
		range[1]=time[1]
		refresh(1,10)
	}
	const goyao=()=>{
		uni.navigateTo({
			url:'/pages/shareCanvas/shareCanvas'
		})
	}
	const list = ref(null)
	const refresh = (e, w) => {
		api.getyaoqingdianzhu({
			"type": 0,
			"per_page":w,
			"current_page":e,
			"endTime":range[1],
			"startTime":range[0]
			}).then((res)=>{
			// usernum.agentSaleAmount=res.data.data.agentSaleAmount
			usernum.total=res.data.data.total
			usernum.inviter_qty=res.data.data.inviter_qty
			usernum.commission_amount=res.data.data.commission_amount
			usernum.sale_amount=res.data.data.sale_amount
			list.value.complete(res.data.data.data)
		}).catch(()=>{
			list.value.complete(false)
		})
	}
	
</script>

<style>
	.content{
		background-image: url('@/static/img/mimeImg/yaobg.png');
		background-position:-0rpx -60rpx;
		background-repeat: no-repeat;
		background-size: cover;
	}
.statusBar {
		width: 100%;
		height: var(--status-bar-height);
		background-color: white;
	}
	.maintop{
		position: relative;
	height: 250rpx;
	}
	.maintime{
		width: 60%;
		height: 60rpx;
		position: absolute;
		bottom: 0;
		left: 20%;
	}
	.uni-date-x{
		background-color: rgb(225, 239, 251) !important;
	}
	.maincenter{
		height: 300rpx;
	}
	.mainbottom{
		width:90%;
		margin: 0 auto;
		border-radius: 20rpx;
		background-color: rgb(201, 236, 252);
	}
	.mainbtn{
		width: 80%;
		height: 120rpx;
		border-radius: 30rpx;
		text-align: center;
		line-height: 100rpx;
		position: fixed;
		bottom: 0;
		left: 10%;
		background: url('@/static/img/mimeImg/yaobtn.png');
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
	}
	.mainbtn text{
		font-size: 35rpx;
		color: white;
		font-weight: bolder;
	}
	.maintitle{
		display: flex;
		height: 60rpx;
		font-size: 30rpx;
		font-weight: bolder;
		align-items: center;
		justify-content: space-around;
		background-color: rgb(252,242,241);
	}
	.mainlist{
		display: flex;
		height: 80rpx;
		justify-content: space-around;
	}
	.mainlist li{
		width: 25%;
		list-style: none;
		text-align: center;
		font-size: 25rpx;
		line-height: 80rpx;
		font-weight: bolder;
		overflow: hidden; /* 确保超出容器的内容被裁剪 */
		  white-space: nowrap; /* 确保文本在一行内显示 */
		  text-overflow: ellipsis; /* 超出部分显示省略号 */
	}
	.mainul > :nth-child(even){
		background-color: rgb(252,242,241);
	}
	.mainul > :nth-child(odd){
		background-color:#ffffff;
	}
	.maindox{
		padding: 15rpx 15rpx;
	/* 	background-color:#ffcd58; */
		border-radius: 20rpx;
	}
.resumendatos{
/* 	height: 350rpx; */
	background-color: white;
	width: 90%;
	margin: 0 auto;
	padding: 20rpx 30rpx;
	background: url('@/static/img/mimeImg/yaotext.png');
	background-position:0rpx 0rpx;
	background-repeat: no-repeat;
	background-size: cover;
	height: 310rpx;
	margin-top: 15rpx;
}
.resumendatosbox{
	height:250rpx;
	background-color: white;
	border-radius: 20rpx;
	box-shadow: 0px 0px 19px -5px rgba(0, 0, 0, 0.3);
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

	.resumendatosli{
		width: 33%;
		height: 200rpx;
	}
	.resumentext text{
		font-size: 40rpx;
		font-weight: bolder;
		line-height: 100rpx;
	}
	.resumentextli text{
		font-size: 30rpx;
		font-weight: bolder;
	}
	.resumendatosds{
		background-color: white;
		padding: 10rpx 20rpx;
	}
	.resumendatoscenter{
		width: 90%;
		height: 120rpx;
		margin: 15rpx auto;
		background: url('@/static/img/mimeImg/yaolist.png');
		background-position: top center;
		background-repeat: no-repeat;
		background-size: cover;
		border-radius: 20rpx;
	}
	.swpp{
		border: 1rpx solid;
	}
</style>

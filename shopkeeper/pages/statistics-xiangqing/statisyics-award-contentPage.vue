<template>
	<z-paging ref="gamList" v-model="gameData" @query='gameRefresh'>
		<template v-slot:top>
			<view class="status_bar"></view>
			<uni-nav-bar
				:title="Props.pageState==0?'出票记录':'派奖记录'" 
				@clickLeft="back" 
				leftIcon="back"
				leftText="返回">
			</uni-nav-bar>
		</template>
		<record-card v-for="itme,index in gameData" :gameData='itme' @click='clickCard(itme)'/>
	</z-paging>
</template>

<script setup>
	import {
		ref,
		reactive,
		onBeforeMount,
		getCurrentInstance,
		defineProps
	} from 'vue';
	import {useCounterStore} from '@/stores/counter'
	import recordCard from "../../components/common/yc-recordCard/yc-recordCard.vue"
	import api from "@/common/vmeitime-http/satistics/satistcs.js"
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	const Props=defineProps(['pageState','gameId','time'])
	const counter = useCounterStore(); //状态管理
	const back=()=>{
		uni.navigateBack()
	}
	const clickCard=(orderData)=>{
		counter.orderData = orderData
		uni.navigateTo({
			url:'/pages/indexSupPages/indexSupPages',
			animationType:'slide-in-bottom'
		})
	}
	const defaultTime=ref()
	const gameData=ref([])
	const gameRefresh=(pageNo,pageSize)=>{
		api.GetTicketingDetails({
			"clerk_id":"",
			"game_id":Props.gameId,
			"type":Props.pageState,
			"startTime":Props.time.split(',')[0],
			"endTime":Props.time.split(',')[1],
			"per_page":pageSize,
			"current_page": pageNo
		}).then((res)=>{
			proxy.$refs.gamList.complete(res.data.data.data)
		})
	}
</script>

<style>
	.status_bar {
		width: 100%;
		height: var(--status-bar-height);
		background-color: white;
	}
	body {
		background-color: #f7f7f7;
	}
</style>

<template>
	<view style="width: 100%; margin: auto;">
		
		<view v-if="yeimian == 'daletou' || yeimian == 'arrange5' || yeimian == 'qxincai' || yeimian == 'arrange3' || yeimian == 'ssq' || yeimian == 'qlecai' || yeimian == 'happy8' || yeimian == 'fucai3D'" 
				style="display: flex;align-items: center;justify-content: space-between;">
				
			<view class="daletouCss">
				<!-- 排列五/七星彩/排列三/福彩3D -->
				<view style="width: 500rpx;display: flex;flex-wrap: wrap;" v-if="yeimian=='arrange5' ||yeimian == 'arrange3' ||yeimian == 'qxincai' || yeimian == 'fucai3D' ">
					<view v-for="item,index in yeimian == 'arrange5' ? wanfa_Data.data : yeimian=='qxincai' ? wanfa_Data.data
					
								:yeimian == 'arrange3' && arrange3Index == 0 || yeimian == 'fucai3D' && arrange3Index == 0 ? arrange3xuanze == 3 ? wanfa_Data.data.dan : wanfa_Data.data
								:yeimian 																		== 'arrange3' && arrange3Index == 1 || yeimian == 'fucai3D' && arrange3Index == 0 ? arrange3xuanze == 0 ? wanfa_Data.data : arrange3xuanze == 1 ? wanfa_Data.data : arrange3xuanze == 3 ? wanfa_Data.data.data : ' '
								:yeimian == 'arrange3' && arrange3Index == 2 || yeimian == 'fucai3D' && arrange3Index == 0 ? arrange3xuanze == 1 ? wanfa_Data.data.dan : wanfa_Data.data
								:yeimian == 'arrange3' && arrange3Index == 3 || yeimian == 'fucai3D' && arrange3Index == 0 ? arrange3xuanze == 0 ? wanfa_Data.data : wanfa_Data.data : false"  :key="index">
						<!-- 排列3 -->
						<text v-show="yeimian == 'arrange3'&&arrange3Index==0&&arrange3xuanze==0||yeimian == 'fucai3D'&&arrange3Index==0&&arrange3xuanze==0" class="daletouText" style="color: #ff0004;">{{arrange3name[index]}} :</text>
						<text v-if="yeimian == 'arrange3'&&arrange3Index==1&&arrange3xuanze==0||yeimian == 'fucai3D'&&arrange3Index==1&&arrange3xuanze==0" class="daletouText" style="color: #ff0004;">{{index=='dan'?'单号:':'重号:'}}</text>
						<text v-if="yeimian == 'arrange3'||yeimian == 'fucai3D'" class="daletouText" style="color: red;" :style="arrange3Index==1&&arrange3xuanze==2 ? 'margin-left:-10rpx;':false"  v-for="item01,index01 in item" :key="index01">{{item01}}</text>
						<!-- 排列5 --><!-- 七星彩 -->
						<view style="display: flex;align-items: center;flex-wrap: wrap;" v-if="yeimian == 'arrange5' || yeimian == 'qxincai'" >
							<text style="color: #8b8b8b;font-size: 25rpx;margin-right: 10rpx;">{{index == 0 ? "" : "|"}}</text>
							<text v-for="item01,index01 in item" :key="index01" class="daletouText_01" 
							style="color: red;" :style="index == 0&&index01==0 ? 'margin-left:-10rpx;':index == 6 ? 'color:#2185ff;':false">{{item01}}</text>
						</view>

						<!-- 胆拖类的蓝字单独拉了出来循环改颜色 -->
						<text class="daletouText" style="color: red;" v-show="yeimian=='arrange3' && arrange3Index == 1 && arrange3xuanze == 2 || yeimian=='fucai3D' && arrange3Index == 1 && arrange3xuanze == 2 " v-for="item04,index04 in wanfa_Data.data.datadan" >{{item04}}</text>
						<text v-show="yeimian=='arrange3'||yeimian == 'fucai3D'? arrange3Index == 0 && arrange3xuanze == 3 || arrange3Index == 1 && arrange3xuanze == 2 || arrange3Index == 2 && arrange3xuanze == 1 : false" class="daletouText" style="color: red;" >#</text>
						<text v-show="yeimian=='arrange3'||yeimian == 'fucai3D'? arrange3Index == 0 && arrange3xuanze == 3 || arrange3Index == 1 && arrange3xuanze == 2 || arrange3Index == 2 && arrange3xuanze == 1 : false " class="daletouText" style="color: #2185ff;" 
								v-for="(item03,index03) in yeimian == 'arrange3' ? arrange3Index == 0 && arrange3xuanze == 3 ? wanfa_Data.data.value[index] : arrange3Index == 1 && arrange3xuanze == 2 ? wanfa_Data.data.value[index] : arrange3Index == 2 && arrange3xuanze == 1 ? wanfa_Data.data.value[index]:false:false">{{item03}}</text>
					</view>
				</view>
				
				
				<!-- 快乐8 --> <!-- 七乐彩 -->
				<view style="width: 500rpx;display: flex;flex-wrap: wrap;" v-show="yeimian=='happy8'||yeimian=='qlecai'">
					<view v-show="yeimian == 'happy8' || yeimian == 'qlecai'" v-for="item,index in yeimian == 'happy8' ? wanfa_Data.data.dan : yeimian == 'qlecai'?wanfa_Data.data.dan : false" :key="index">
						<text class="daletouText" style="color: red;font-size: 32rpx;" v-show="index == 0">[胆:</text>
						<text class="daletouText" style="color: red;">{{ssqff(item)}}</text>	
						<text class="daletouText" style="color: red;font-size: 32rpx;" v-show=" yeimian == 'happy8' ? index == wanfa_Data.data.dan.length-1 : index == wanfa_Data.data.dan.length-1">]</text>
					</view>
					<view v-show="yeimian == 'happy8' || yeimian == 'qlecai'" v-for="item,index in yeimian == 'happy8' ? wanfa_Data.data.value : yeimian == 'qlecai' ? wanfa_Data.data.value : false" :key="index">
						<text class="daletouText" style="color: red;">{{ssqff(item)}}</text>	
					</view>
				</view>
				
				
				<!-- 大乐透/双色球 -->
				<view style="width: 500rpx;display: flex;flex-wrap: wrap;" v-show="yeimian=='daletou'||yeimian == 'ssq'">
					<!-- 机选 -->
					<view class="daletouclass"  v-if="counter.submitNewData[props.nmb].Type == 'jixuan'" style="width: 500rpx;display: flex;flex-wrap: wrap;">
						<text v-for="item,index in wanfa_Data.data.list.red" :key="index">{{ssqff(item)}}</text>
						<text style="color: #2185ff;" v-for="item,index in wanfa_Data.data.list.blue" :key="index">{{ssqff(item)}}</text>
					</view>
					<view class="daletouclass" v-else-if="counter.submitNewData[props.nmb].Type == 'zixuan'" style="width: 500rpx;display: flex;flex-wrap: wrap;">
						<view v-if="yeimian == 'daletou'" style="width: 500rpx;display: flex;flex-wrap: wrap;">
							<text v-for="item,index in wanfa_Data.data.dan.red" :key="index">{{ index == 0 ? '[胆 : '+ssqff(item):ssqff(item)}}</text>
							<text class="daletouText" style="color: red;" v-show="wanfa_Data.data.dan.red.length > 0">]</text>
							<text v-for="item,index in wanfa_Data.data.list.red" :key="index">{{ssqff(item)}}</text>
							<text style="color: #2185ff;" v-for="item,index in wanfa_Data.data.dan.blue" :key="index">{{ index == 0 ? '[胆:'+ssqff(item):ssqff(item)}}</text>
							<text class="daletouText" style="color: #2185ff;" v-show="wanfa_Data.data.dan.blue.length > 0">]</text>
							<text style="color: #2185ff;" v-for="item,index in wanfa_Data.data.list.blue" :key="index">{{ssqff(item)}}</text>
						</view>
						<view v-else-if="yeimian == 'ssq'" style="width: 500rpx;display: flex;flex-wrap: wrap;">
							<text v-for="item,index in wanfa_Data.data.dan" :key="index">{{index == 0 ? '[胆 : '+ssqff(item) : ssqff(item)}}</text>
							<text class="daletouText" style="color: red;" v-show="wanfa_Data.data.dan.length > 0">]</text>
							<text v-for="item,index in wanfa_Data.data.list.red" :key="index">{{ssqff(item)}}</text>
							<text style="color: #2185ff;" v-for="item,index in wanfa_Data.data.list.blue" :key="index">{{ssqff(item)}}</text>
						</view>
					</view>
				</view>
				
				<!-- 类型 注数 倍数 多少钱 --> 
				<view class="daletouBottomText">
					<text v-show="yeimian == 'arrange3'|| yeimian == 'fucai3D'">{{arrange3Indexzero(arrange3Index,arrange3xuanze)}}</text>
					<text v-show="yeimian == 'arrange5'|| yeimian == 'qxincai'">直选普通</text>
					<text v-if="yeimian == 'happy8'">{{happy8IndexName[counter.submitNewData[props.nmb].happy8Type-1]}}{{wanfa_Data.data.dan.length > 0 ? "拖胆" : wanfa_Data.data.value.length>counter.submitNewData[props.nmb].happy8Type?"复式":"单式"}}</text>
					<text v-if="yeimian == 'qlecai'">{{wanfa_Data.data.dan.length>0?'拖胆':'普通'}}</text>
					<text v-if="yeimian == 'daletou'||yeimian == 'ssq'">{{counter.submitNewData[props.nmb].Type == 'zixuan' ? '自选':'机选单式'}}</text>
					
					<text>{{counter.submitNewData[props.nmb].note}}注</text>
					<text>{{counter.submitNewData[props.nmb].beilv}}倍</text>
					<text style="color: red;">
						{{counter.submitNewData[props.nmb].money}}元
					</text>
				</view>                                                                  
				
			</view>
			<!-- 加减数字框 / 这个是共用的 -->
		<view style="margin-left: 15rpx;">
			<uni-number-box @change="changeValue" :value="counter.submitNewData[props.nmb].beilv" :min="1" :max="240" />
		</view>
	</view>
</view>
</template>

<script setup>
	import { useCounterStore } from '@/stores/counter.js'
	import common from '@/common/common'
	import {
		ref,
		reactive,
		onBeforeMount,
		getCurrentInstance,
		defineProps, // 接收
		defineEmits, // 发送
	} from 'vue';
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	const counter = useCounterStore() // 状态管理
	const props =defineProps(['nmb'])
	const Emits=defineEmits(['numberChange'])
	// console.log(111,props.nmb);
	//@-- yeimian --内容是根据yeimian里面的值(值是bet文件夹里面玩法的名字)来判断内容显示什么
	const yeimian = ref(counter.submitNewData[props.nmb].yeimian)
	const daletouIndex =ref(0) 	// 根据这个值来判断大乐透是 机选0 还是 自选1

	const arrange3name = reactive(['百位','十位','个位'])
	const arrange3name02=reactive(['单号','重号'])
	const arrange3Index = ref(counter.submitNewData[props.nmb].yeimianIndex) // 排列3外层选择  0-直选 1-组3 2-组6 3-组选
	const arrange3xuanze = ref(counter.submitNewData[props.nmb].xuanze) // 排列3内层选择
	
	const happy8IndexName = reactive(['选一','选二','选三','选四','选五','选六','选七','选八','选九','选十'])
	
	onBeforeMount(()=>{
		counter.submitNewData[props.nmb].beilv
	})
	const changeValue = (e) =>{ 
		counter.submitNewData[props.nmb].money=e*(counter.submitNewData[props.nmb].note*2)
		counter.submitNewData[props.nmb].beilv=e
		Emits('numberChange')
		
	}
	
	const wanfa_Data = reactive([])
	// 直接接收状态数据来判断
	wanfa_Data['data'] = counter.submitNewData[props.nmb].data
	let newmoney = counter.submitNewData[props.nmb].money
	// console.log('看看',counter.submitNewData);
	
	const ssqff = (itme) =>{ //给数字加0
		if(itme<10){
			var a = '0' + itme
		}else{
			a = itme
		}
		return a
	}
	const arrange3Indexzero = (waiceng,neiceng) =>{ //排列3 类型显示判断  waiceng-外层
		var a = ""   // 中括号
		if(waiceng == 0){
		if(neiceng == 0){
			if(wanfa_Data.data[2].length>1||wanfa_Data.data[1].length>1||wanfa_Data.data[0].length>1){
				a = "直选[复式]"
			}else{
				a = "直选[单式]"
			}
		}else if(neiceng == 1){a="直选[组合复式]"}
		else if(neiceng == 2){a="直选[和值]"}
		else if(neiceng == 3){a="直选[组合拖胆]"}
		else {a="直选[跨度复式]"}
		
			//-----------------------------
		}else if (waiceng == 1){
			if(neiceng == 0){a = "组三[单式]"}
			else if(neiceng == 1){a="组三[复式]"}
			else if(neiceng == 2){a="组三[拖胆]"}
			else{a="组三[跨度复式]"}
			
			//----------------------------
		}else if (waiceng == 2){
			if(neiceng == 0){a = "组六[复式]"}
			else if(neiceng == 1){a = "组六[拖胆]"}
			else{a = "组六[跨度复式]"}
		}
		
			//----------------------------
		else if(waiceng == 3){
			if(neiceng == 0){a = "组选[和值]"}else{a = "组选[2码全包]"}
		}
		counter.submitNewData[props.nmb].wanfa_type=a
		return a 
	}
	
</script>

<style>
	.daletouCss{
		width: 450rpx;
		display: flex;
		flex-direction: column;
		line-height: 55rpx;
		flex-wrap: wrap;
	}
	.daletouText{
		color: #383838;
		/* letter-spacing: 15rpx; */
		font-size: 28rpx;
		padding-right: 10rpx;
		
	}
	.daletouText_01{
		color: #383838;
		/* letter-spacing: 15rpx; */
		font-size: 28rpx;
		padding-right: 10rpx;
		
	}
	.daletouBottomText text{
		font-size: 30rpx;
		padding-right: 10rpx;
		color: #9e9e9e;
	}
	.jczqPeople{
		display: flex;
		justify-content: space-between;
		margin: auto;
		width: 510rpx;
		margin-bottom: 15rpx;
	}
	.jczqPeople text{
		font-size: 28rpx;
		text-overflow:ellipsis;
	}
	.jczqBottomText{
		width: 510rpx;
		margin: auto;
		background-color: #f5f5f5;
		display: flex;
		align-items: center;
		justify-content: center;
		text-overflow:ellipsis;
	}
	.jczqBottomText text{
		padding:15rpx 10rpx;
		text-overflow:ellipsis;
	}
	
	.daletouclass text{
		color: red;
		/* letter-spacing: 15rpx; */
		font-size: 28rpx;
		padding-right: 10rpx;
	}
</style>
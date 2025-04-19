<template>
	<!-- 主体 -->
	<view class="content">
		<!-- 表头 -->
		<view class="List-head">
			<text style="width: 16%;">过关</text>
			<text style="width: 34%;border-left: none;border-right: none;">单注组合</text>
			<text style="width: 30%;border-right: none;">注数分布</text>
			<text style="width: 20%;">预测奖金</text>
		</view>
		<!-- 表身 -->
		<view v-for="item,index in processedData"
			style="display: flex;flex-direction: column;justify-content: center;align-items: center;">
			
			<view class="List-body" style="height: 100%;">
				<view style="width: 16%;">{{item.data[0][5]=='1关'?'单关':item.data[0][5]}}</view>
				<view style="width: 34%;display: flex;flex-direction: column;border-left: none;font-size:18rpx;">
					<text style="font-size: 26rpx;line-height: 50rpx;">
						{{item.data[0][1]+'|'+item.data[0][3]+'('+item.data[0][4]+')'}}
					</text>
					<text style="font-size: 26rpx;" v-if="item.data.length>1">
						{{item.data[1][1]+'|'+item.data[1][3]+'('+item.data[1][4]+')'}}
					</text>
					<uni-icons 
						type="bottom" 
						style='margin-bottom: -20rpx;margin-top: 10rpx;'
						@click="List_Click(index)">
					</uni-icons>
				</view>
				<view style="width: 30%;border-left: none;border-right: none;">
					<uni-number-box @change="changeValue($event,index)" 
					:min="1" 
					:max="9999" 
					style='border: none;' 
					:value="item.note"/>
				</view>
				<view style="width: 20%;" :style="item.money>money?'color:red;':''">{{item.money}}</view>
			</view>
			
			<!-- 单注组合点击 -->
			<view style="background-color: #fff9eb;" v-show="showList==index">
				<!-- 点开以后的头 -->
				<view class="List-body-content-head">
					<text style="width: 25%;">场次</text>
					<text style="width: 25%;border-left: none;border-right: none;">主队</text>
					<text style="width: 25%;border-right: none;">客队</text>
					<text style="width: 25%;">投注内容</text>
				</view>
				<!-- 点开以后的内容 -->
				<view class="List-body-content-head" v-for="xitme,xindex in item.data">
					<text style="width: 25%;">{{xitme[0]}}</text>
					<text style="width: 25%;border-left: none;border-right: none;">{{xitme[1]}}</text>
					<text style="width: 25%;border-right: none;">{{xitme[2]}}</text>
					<text style="width: 25%;">{{xitme[3]+'('+xitme[4]+')'}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		onBeforeMount,
		onMounted,
		ref,
		reactive,
		getCurrentInstance,
		defineProps,
		defineEmits,
		watch
	} from 'vue'
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	import {useCounterStore} from '@/stores/counter';
	import {onShow} from "@dcloudio/uni-app"
	const counter = useCounterStore() //状态管理
	const Props=defineProps(['listData','showTabIndex'])
	const Emits=defineEmits(['max_min','show'])
	
	const processedData=reactive([])//渲染的注数数据
	const showValue=ref(1)
	onBeforeMount(()=>{
		uni.showLoading({
			title:'数据处理中~'
		})
		dataProcessing()//执行分布注数计算
		maxMin()//执行拿最大最小值
		if(showValue.value==0){
			Emits('show',showValue.value)
		}else{
			Emits('max_min',maxminValue,money.value,showValue.value,allNote.value,processedData)
		}
		
	})
	const changeValue = (e,index) =>{//加减框
		//注数值方式变化执行
		processedData[index].note=e
		processedData[index].money=(processedData[index].note*eachNote[index]).toFixed(2)
		var noteArr=null
		processedData.forEach(res=>{
			noteArr+=res.note
		})
		money.value=noteArr*2
		maxMin()
		Emits('max_min',maxminValue,money.value,showValue.value,noteArr,processedData)
	}
	
	const eachNote=reactive([])//每注的子项目总额
	const multiplying=ref(0)//总注数
	const allNote=ref(0)//计算后的note
	const dataProcessing=()=>{
		var note=null//每组加起来的注数
		multiplying.value=counter.BettingContent.remarks.Multiple*Props.listData.length//总倍率
		for(var i=0;i<Props.listData.length;i++){
			var newArr={//最终形态临时数组
				'data':[],
				'note':null,
				'money':null
			}
			var newNote=[]//计算合计注数临时数组
			for(var o=0;o<Props.listData[i].length;o++){
				var a=Props.listData[i][o].split('|')//字符串转数组
				newArr.data.push(a)//把数组放进临时数组
				newNote.push(a[4])//把每个订单中的倍率取出来暂时存放，方便后续计算
			}
			var ll=null//每注的子项目相乘计算每个子项目的金额（一注）
			
			for(var h=0;h<newNote.length;h++){//进行循环计算每组的子订单
				if(h==0){
					ll=newNote[h]
				}else{
					ll=(ll*newNote[h])
				}
			}
			if(ll*2>1000){
				eachNote.push((ll*2)*0.8)//先保存对应每个子订单的金额（一注）
			}else{
				eachNote.push((ll*2))//先保存对应每个子订单的金额（一注）
			}
			note+=Number(ll)//保存子订单相加后的金额（总和）
			processedData.push(newArr)//最终形态数组
		}
		var minValue=Math.max(...eachNote)
		var minValueIndex=eachNote.indexOf(minValue)
		money.value=multiplying.value*2
		var residueNote=null
		if(counter.BettingContent.remarks.Multiple!=1){
			for(var y=0;y<processedData.length;y++){
				if(y!=minValueIndex){
					while (processedData[y].money < money.value) {
						processedData[y].note+=1
						residueNote+=1
						processedData[y].money=(processedData[y].note*eachNote[y]).toFixed(2)
					}
				}
				processedData[minValueIndex].note=multiplying.value-residueNote
				processedData[minValueIndex].money=(processedData[minValueIndex].note*eachNote[minValueIndex]).toFixed(2)
			}
			if(processedData[minValueIndex].money<money.value){
				showValue.value=0
			}
			processedData.forEach(res=>{
				allNote.value+=res.note
			})
		}else{
			for(var e=0;e<processedData.length;e++){
				processedData[e].note=1
				allNote.value+=processedData[e].note
				processedData[e].money=(processedData[e].note*eachNote[e]).toFixed(2)
			}
		}
		uni.hideLoading()
	
	}
	
	const maxminValue=reactive([])//最大最小值数组
	const money=ref(0)//方案金额
	const maxMin=()=>{
		//拿最大最小值
		var arr=[]
		maxminValue.splice(0,maxminValue.length)
		for(var e=0;e<processedData.length;e++){
			arr.push(processedData[e].money)
		}
		maxminValue.push(Math.min(...arr).toFixed(2))
		maxminValue.push(Math.max(...arr).toFixed(2))
	}
	
	const showList = ref()
	const List_Click = (e) =>{
		if(showList.value != e){
			showList.value = e
		}else{
			showList.value = null
		}
	}
</script>

<style>
	.content{
		width: 100%;
		height: 100%;
		margin: auto;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}
	.List-head{
		width: 720rpx;
		height: 60rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		}.List-head text{
			display: flex;
			align-items: center;
			justify-content: center;
			font-weight: bold;
			color: #363636;
			padding: 15rpx 0;
			border: 1rpx solid #dedede;
		}
	
	.List-body{
		width: 720rpx;
		height: 60rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		}.List-body view{
			display: flex;
			align-items: center;
			justify-content: center;
			height: 150rpx;
			border: 1rpx solid #dedede;
			border-top: none;
		}
		
	.List-body-content-head{
		width: 720rpx;
		height: 60rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		margin-top: 5rpx;
		margin-bottom: 5rpx;
		}.List-body-content-head text{
			display: flex;
			align-items: center;
			justify-content: center;
			font-weight: bold;
			color: #363636;
			padding: 15rpx 0;
			border: 1rpx solid #dedede;
			border-top: none;
		}

</style>
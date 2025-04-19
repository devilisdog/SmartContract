<template>
	<view class="card" v-if="show &&  Props.type=='lq'">
		<view class="column_box" style="display: flex;align-items: center;justify-content: space-between;">
			<text style="color:red;">升盘：{{Props.cardInfo.upHandicap}}</text>
			<text style="color:green;">降盘：{{Props.cardInfo.downHandicap}}</text>
			<text style="color:red;">高水：{{Props.cardInfo.highWater}}</text>
			<text style="color:green;">低水：{{Props.cardInfo.lowWater}}</text>
		</view>
		<view class="select_box">
			<text style="flex:0.5;">公司</text>
			<text style="flex:1;text-align: center;">初盘</text>
			<text style="flex:1;text-align: center;">即盘</text>
		</view>
		<view class="data_itme_tr" v-for="itme,index in dataLsit">
			<view class="td_title">{{itme.providerName}}</view>
			<view class="td_blv" style="border-left: 1rpx solid #eaeaea;padding:10rpx 0;">
				<view class="td_tr_blv_top" style="border-bottom: none;">
					<text>{{itme.firstAwayWinOdds}}</text>
					<text>主{{itme.firstHandicap}}</text>
					<text>{{itme.firstHomeWinOdds}}</text>
				</view>
			</view>
			<view class="td_blv" style="border-left: 1rpx solid #eaeaea;padding:10rpx 0;">
				<view class="td_tr_blv_top" style="border-bottom: none;">
					<text :style="itme.awayWinOdds-itme.firstAwayWinOdds==0?'':itme.awayWinOdds-itme.firstAwayWinOdds>0?'color:red;':'color:green;'">
						{{itme.awayWinOdds}}
						{{itme.awayWinOdds-itme.firstAwayWinOdds==0?'':itme.awayWinOdds-itme.firstAwayWinOdds>0?'↑':'↓'}}
					</text>
					<text>主{{itme.handicap}}</text>
					<text :style="itme.homeWinOdds-itme.firstHomeWinOdds==0?'':itme.homeWinOdds-itme.firstHomeWinOdds>0?'color:red;':'color:green;'">
						{{itme.homeWinOdds}}
						{{itme.homeWinOdds-itme.firstHomeWinOdds==0?'':itme.homeWinOdds.firstHomeWinOdds>0?'↑':'↓'}}
					</text>
				</view>
			</view>
		</view>
	</view>
	<view class="card" v-if="show &&  Props.type!='lq'">
		<view class="column_box">
			<qiun-data-charts type="column" :opts="opts" :chartData="datas" ></qiun-data-charts>
		</view>
		<view class="select_box">
			<text style="flex:1;">公司名称</text>
			<text style="flex:0.5;">赔率</text>
			<text>赔付率</text>
		</view>
		<view class="data_itme_tr" v-for="itme,index in dataLsit">
			<view class="td_title">{{itme.providerName}}</view>
			<view class="td_type">
				<view class="td_tr_top">
					<text>初</text>
				</view>
				<view class="td_tr_bottm">
					<text>即</text>
				</view>
			</view>
			<view class="td_blv">
				<view class="td_tr_blv_top">
					<text>{{itme.firstWinOdds}}</text>
					<text>{{itme.firstDrawOdds}}</text>
					<text>{{itme.firstLoseOdds}}</text>
				</view>
				<view class="td_tr_blv_bottm">
					<text>{{itme.winOdds}}</text>
					<text>{{itme.drawOdds}}</text>
					<text>{{itme.loseOdds}}</text>
				</view>
			</view>
			<view class="td_pf">
				<view class="td_tr_pf_top">
					<text>{{itme.firstLoseRation}}</text>
				</view>
				<view class="td_tr_pf_bottm">
					<text>{{itme.loseRation}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {onBeforeMount,ref,reactive,defineProps,watch} from 'vue';
	import {onShow} from "@dcloudio/uni-app"
	const Emits=defineEmits(['getData'])
	const Props=defineProps(['cardInfo','dataLsit','type'])
	const show=ref(false)
	const opts=reactive({
		color: ["#FAC858","#3CA272"],
		padding: [15,10,0,15],
		enableScroll: false,
	})
	const datas=reactive({
		categories: ["胜","平","负"],
		series: [
		  {
			name: "升赔(家)",
			data: [0,0,0]
		  },
		  {
			name: "降赔(家)",
			data: [0,0,0]
		  },
		]
	})
	onShow(()=>{
		Emits('getData')
	})
	watch(()=>Props.cardInfo,(newValue,oldValue)=>{
		if(!show.value){
			show.value=true
			colummDataInir(newValue)
		}
	})
	const colummDataInir=(data)=>{//图标赋值
		datas.series[0].data[0]=data.litreWinProviderNum
		datas.series[0].data[1]=data.litreDrawProviderNum
		datas.series[0].data[2]=data.litreLoseProviderNum
		datas.series[1].data[0]=data.dropWinProviderNum
		datas.series[1].data[1]=data.dropDrawProviderNum
		datas.series[1].data[2]=data.dropLoseProviderNum
	}
	
</script>

<style lang="scss">
	.select_box{
		padding:10rpx;
		background-color: #eaeaea;
		display: flex;
	}
	$border-color:#eaeaea;
	$border-size:24rpx;
	.data_itme_tr{
		display: flex;
		align-items: center;
		border:1rpx solid $border-color;
		border-radius:5rpx;
		border-top:none;
		.td_pf{
			padding: 0rpx;
			flex:0.3;
			text-align: center;
			.td_tr_pf_top{
				border-bottom:1rpx solid $border-color;
				border-left:1rpx solid $border-color;
				text{
					font-size:$border-size;
				}
			}
			.td_tr_pf_bottm{
				border-left:1rpx solid $border-color;
				text{
					font-size:$border-size;
				}
			}
		}
		.td_type{
			padding: 0rpx;
			.td_tr_top{
				border:1rpx solid $border-color;
				border-top: none;
				text{
					font-size:$border-size;
					color: #8f8f8f;
				}
			}
			.td_tr_bottm{
				border:1rpx solid $border-color;
				border-top: none;
				border-bottom: none;
				text{
					font-size:$border-size;
					color: #8f8f8f;
				}
			}
		}
		.td_title{
			flex:0.5;
			font-size:26rpx;
		}
		view{
			padding:5rpx 10rpx;
		}
		.td_blv{
			flex:1;
			padding: 0rpx;
			.td_tr_blv_top{
				display: flex;
				align-items: center;
				justify-content: space-around;
				border-bottom:1rpx solid $border-color;
				text{
					font-size:$border-size;
				}
			}
			.td_tr_blv_bottm{
				display: flex;
				align-items: center;
				justify-content: space-around;
				text{
					font-size:$border-size;
				}
			}
		}
	}
	.data_itme{
		width:100%;
		height:80rpx;
		background-color: #dcdcdc;
	}
	.column_box{
		margin:20rpx auto;
	}
	.card{
		width:680rpx;
		padding:20rpx;
		background-color: #fff;
		border-radius:15rpx;
		margin:20rpx auto;
		box-shadow:0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.4);
		.top_title{
			font-weight: bold;
		}
	}

</style>
<template>
	<view class="card">
		<view class="card_title">球员伤停</view>
		<view class="big_table">
			<view class="home">
				<view class="home_title">主队</view>
			</view>
			<view class="away">
				<view class="away_title">客队</view>
			</view>
		</view>
		<view class="big_table_content">
			<view class="home" v-if="Props.cardInfo.homeInjuryList && Props.cardInfo.homeInjuryList.length>0">
				<view class="home_itme" v-for="itme,index in Props.cardInfo.homeInjuryList">
					<view class="home_top">
						<text style="font-size:28rpx;font-weight: bold;">{{itme.name}}</text>
						<text class="top_label">{{itme.cause}}</text>
					</view>
					<view class="home_button">
						<text style="font-size:26rpx;color:#959595">{{itme.position}}</text>
						<text style="font-size:26rpx;color:#959595">{{itme.data}}</text>
					</view>
				</view>
			</view>
			<view class="false_data" v-else>
				无伤停记录
			</view>
			<view class="away" v-if="Props.cardInfo.awayInjuryList && Props.cardInfo.awayInjuryList.length>0">
				<view class="away_itme" v-for="itme,index in Props.cardInfo.awayInjuryList">
					<view class="away_top">
						<text style="font-size:28rpx;font-weight: bold;">{{itme.name}}</text>
						<text class="top_label">{{itme.cause}}</text>
					</view>
					<view class="away_button">
						<text style="font-size:26rpx;color:#959595">{{itme.position}}</text>
						<text style="font-size:26rpx;color:#959595">{{itme.data}}</text>
					</view>
				</view>
			</view>
			<view class="false_data" v-else>
				无伤停记录
			</view>
		</view>
		<view class="card_title" style="margin:20rpx 0rpx;">伤停解读</view>
		<view class="content_box" v-for="itme,index in Props.cardInfo.injuryAnalysisList">
			{{itme?'无':itme}}
		</view>
	</view>
	<view class="card" v-if="show">
		<view class="top_title">
			<text class="title">球队线索</text>
			<view class="select_box">
				<text :style="selectData==0?'color:#ffc800;':''" @click="screen(0)">全部</text>
				<text :style="selectData==1?'color:#ffc800;':''" @click="screen(1)">主队</text>
				<text :style="selectData==2?'color:#ffc800;':''" @click="screen(2)">客队</text>
			</view>
		</view>
		<view class="content">
			<view class="content_itme" v-for="itme,index in (Props.type=='lq'?Props.cardInfo.bkLeagueMatchInfomations:Props.cardInfo.leagueMatchInfomations)" v-show="selectData==0?true:selectData==1?itme.home==1:itme.home==0">
				<view class="label"></view>
				<text>{{itme.content}}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {onBeforeMount,ref,reactive,defineProps,watch} from 'vue';
	const Props=defineProps(['cardInfo','currentIndex','myCurrent','type'])
	const Emits=defineEmits(['getData'])
	const selectData=ref(0)
	const show=ref(false)
	const isLoading=ref(false)
	const screen=(e)=>{
		selectData.value=e
	}
	watch(()=>Props.cardInfo,(newValue,oldValue)=>{
		if(!show.value){show.value=true}
	})
	watch(()=>Props.currentIndex,(newValue,oldValue)=>{
		if(newValue==Props.myCurrent && !isLoading.value && !show.value){
			isLoading.value==true
			Emits('getData')
		}
	})
</script>

<style lang="scss">
	.content{
		width:100%;
		.content_itme{
			width: 100%;
			margin:20rpx auto;
			text-indent:0.5em;
			word-break: break-all;
			.label{
				width:10rpx;
				height:10rpx;
				border-radius:50%;
				background-color: #ec8c69;
				display:inline-block;
				margin-right:10rpx;
			}
		}
	}
	.top_title{
		.select_box{
			text{
				font-size:34rpx;
				font-weight: bold;
				margin-left:40rpx;
				color:#9e9e9e;
				transition: all 0.3s;
			}
		}
		.title{
			font-size:32rpx;
			font-weight: bold;
		}
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom:20rpx;
	}
	.content_box{
		text-indent: 1em;
	}
	.false_data{
		flex:1;
		display: flex;
		align-items: center;
		justify-content:center;
		color: #919191;
	}
	.big_table_content{
		display: flex;
		border-bottom: 1rpx solid #dedede;
		.home{
			flex:1;
			border-right: 1rpx solid #dedede;
			.home_itme{
				height:100rpx;
				width:100%;
				padding:10rpx;
				box-sizing: border-box;
				display: flex;
				flex-flow: column;
				justify-content: space-between;
				border-top: 1rpx solid #dedede;
				.home_top{
					display: flex;
					align-items: center;
					justify-content:space-between;
				}
				.home_button{
					display: flex;
					align-items: center;
					justify-content:space-between;
				}
			}
		}
		.away{
			flex:1;
			.away_itme{
				height:100rpx;
				width:100%;
				padding:10rpx;
				box-sizing: border-box;
				display: flex;
				flex-flow: column;
				justify-content: space-between;
				border-top: 1rpx solid #dedede;
				.away_top{
					display: flex;
					align-items: center;
					justify-content:space-between;
				}
				.away_button{
					display: flex;
					align-items: center;
					justify-content:space-between;
				}
			}
		}
	}
	.top_label{
		background-color: #b6b6b6;
		padding:0rpx 15rpx;
		border-radius:30rpx;
		font-size:26rpx;
		color:#fff;
	}
	.big_table{
		display: flex;
		align-items: center;
		margin-top:20rpx;
		.home{
			flex:1;
			padding:10rpx 0rpx;
			text-align: center;
			border-radius:5rpx 0rpx 0rpx 5rpx;
			background-image:linear-gradient(120deg,#ed6ea0 0%, #ec8c69 100%);
			.home_title{
				font-weight: bold;
				color:#fff;
			}
		}
		.away{
			flex:1;
			padding:10rpx 0rpx;
			text-align: center;
			border-radius:0rpx 5rpx 5rpx 0rpx;
			background-image:linear-gradient(120deg,#93a5cf 0%, #e4efe9 100%);
			.away_title{
				font-weight: bold;
				color:#fff;
			}
		}
	}
	.card_title{
		font-size:32rpx;
		font-weight: bold;
	}
	.card{
		width:680rpx;
		padding:20rpx;
		border-radius:20rpx;
		background-color: #fff;
		margin:20rpx auto;
		box-shadow:0px 5rpx 15rpx 5rpx rgba(226, 226, 226, 0.4);
	}
</style>
<template>
	<view class="card" style="height:95vh;">
		<z-paging ref="userList" v-model="userListData" @query='getUserList'>
			<template v-slot:top>
				<uni-nav-bar title="更换上级" rightIcon="closeempty"  @clickRight="close"/>
				<uni-search-bar placeholder="搜索用户昵称或备注" @input="clickSearch" />
			</template>
			<uni-list>
				<uni-list-item
					v-for="item,index in userListData" :key="index"
					:title="nicknameDispose(item.nickname,item.config.remarks)"
					:thumb="item.avatar"
					:note="getdatetime.getNowFormatDate(0,item.update_time)"
					thumbSize="lg"
					showArrow
					clickable
					@click="clickUserCard(nicknameDispose(item.nickname,item.config.remarks),item.id)"
					v-show="item.id!=Props.user_id"
				/>
			</uni-list>
		</z-paging>
	</view>
	<!-- 对话框 -->
	<fui-dialog :show="show" @click="clickDialogButton" :content="dialogData.closeData"></fui-dialog>
</template>

<script setup>
	import common from "@/common/common.js"
	import api from "@/common/vmeitime-http/user/user.js"
	import getdatetime from "@/common/getdatetime.js"
	import {
		ref,
		reactive,
		onBeforeMount,
		onMounted,
		getCurrentInstance,
		defineProps,
		defineEmits
	} from 'vue';
	const{
		proxy,
		ctx
	}=getCurrentInstance()
	const Props=defineProps(['user_id'])
	const Emits=defineEmits(['succeed'])
	const userListData=ref([])//用户数据
	const searchValue=ref('')//搜索的值
	import {onBackPress} from "@dcloudio/uni-app"
	
	const show=ref(false)
	const dialogData=reactive({
		'closeData':null,
		'id':null
	})
	const statusBarHeight=ref(0)//状态栏高度
	onBeforeMount(()=>{
		statusBarHeight.value=uni.getSystemInfoSync().statusBarHeight//获取手机状态栏高度
	})
	onBackPress((e)=>{
		close()
	})
	
	const getUserList=(pageNo, pageSize)=>{
		api.GetUserList({
			"search":searchValue.value,
			"per_page":pageSize,
			"current_page":pageNo,
		}).then((res)=>{
			proxy.$refs.userList.complete(res.data.data.data)
		}).catch(res=>{
			proxy.$refs.userList.complete(false)
		})
	}
	const close=()=>{
		Emits('succeed')
	}
	
	const clickDialogButton=(e)=>{
		if(e.index==1){
			uni.showLoading({title: '加载中~'})
			api.PostEditsuperior({"id":Props.user_id,"value":dialogData.id}).then((res)=>{
				uni.hideLoading()
				uni.showToast({
					title:res.data.data,
					icon:res.data.msg,
					duration:1000
				})
				setTimeout(()=>{
					Emits('succeed')
				},1000)
			})
		}
		show.value=false
	}
	
	const clickUserCard=(name,id)=>{
		dialogData.id=id
		dialogData.closeData='确定更改上级为“'+name+'”吗？'
		show.value=true
	}
	
	const clickSearch=(e)=>{//搜索框的值更改执行获取数据
		searchValue.value=e
		proxy.$refs.userList.refresh()
	}
	
	const nicknameDispose=(nickname,remark)=>{
		if(remark!=''&&remark!=null){
			return remark+'(昵称：'+nickname+')'
		}else{
			return nickname
		}
	}
</script>

<style>
	.card{
		width:100%;
		background-color: white;
		border-radius:20rpx 20rpx 0rpx 0rpx;
	}
</style>
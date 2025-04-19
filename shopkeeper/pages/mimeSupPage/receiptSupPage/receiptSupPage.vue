<template>
	<view class="status_bar"></view>
	<uni-nav-bar :title="props.title" left-icon="back" leftText="返回" @clickLeft="back"></uni-nav-bar>
	<view class="reminder">
		<text>注意事项：</text><br>
		<text style="margin-left:30rpx;">1、图片上传格式仅限于jpg、png、jpeg</text><br>
		<text style="margin-left:30rpx;">2、请认真填写各项所需的内容，否则会无法通过审核</text><br>
		<text style="margin-left:30rpx;color:red;">3、涉及到时间参数建议格式：年-月-日(2023-3-25)</text><br>
		<text style="margin-left:30rpx;">4、店铺地址必须详细，建议去地图类APP直接复制我的地址</text><br>
	</view>
	<view class="content_box_image">
		<!-- <ygy-upload-img 
			:num="1" :title="itme.title+':'" size="350" 
			v-for="itme,index in ListData.image_List" 
			@saveImg='selectImage($event,itme.value)' 
			v-model="input_model[itme.value]"
			:key="index"
		/> -->
		<view style="imgBox" v-for="itme,index in ListData.image_List">
			<text>{{itme.title}}(必填)</text>
			<uni-file-picker ref="img" :imageStyles="imageStyles" file-mediatype="image" limit="1"
				@select="uploading($event,index)" @delete="deleteImg(index)" v-model="completedImg[index]" />
		</view>
	</view>
	<view class="content_box_input" style="margin-bottom: 100rpx;">
		<uni-forms labelPosition="top" labelWidth="100%" :rules="formsRules" ref="forms" v-model="input_model">
			<template v-for="itme,index in ListData.else" :key="index">
				<uni-forms-item :label="itme.title" required :name="itme.value">
					<uni-easyinput v-model="input_model[itme.value]" :type="itme.type"></uni-easyinput>
				</uni-forms-item>
			</template>
		</uni-forms>
	</view>
	<view class="buttomStyle" @click="tijiao">提交审核</view>
	<!-- <uni-transition mode-class="slide-bottom" :show="showBottomButtom" class="bottom_card">
		<view class="buttomStyle" @click="tijiao">提交审核</view>
	</uni-transition> -->
</template>

<script setup>
	import api from "@/common/vmeitime-http/mine/mine.js"
	import {
		useCounterStore
	} from '@/stores/counter'
	import {
		onPageScroll
	} from "@dcloudio/uni-app"

	const counter = useCounterStore(); //状态管理
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
	const props = defineProps(['title', 'listData', 'payId'])
	const ListData = ref([])
	const input_model = ref({}) //
	const showBottomButtom = ref(true)
	const newScrollValue = ref(0)

	const completedImg = reactive([])

	const imageStyles = reactive({
		width: "380rpx",
		height: "380rpx",
	})

	onBeforeMount(() => {
		var initData = JSON.parse(props.listData).data

		var newData = {
			image_List: [],
			else: []
		}
		initData.forEach(function(itme, index) { //
			input_model.value[itme.value] = ""
		})
		initData.forEach(function(itme, index) {
			if (itme.type == 'img') {
				newData.image_List.push(itme)
			} else {
				newData.else.push(itme)
			}
		})
		ListData.value = newData
	})

	//暂时放弃这个提交方式
	const selectImage = (src, name_title) => { //上传或删除图片触发
		if (uni.getSystemInfoSync().platform === 'android') {
			var imgBase64 = src[0]
			var headers = {
				"server": '1',
				"ba-user-token": counter.access_token,
				// 'Content-Type': 'multipart/form-data',
			}

			compressBase64Image(imgBase64, 0.8, 800, 600).then(compressedBase64 => {
				// 在这里使用压缩后的 base64 图片进行后续操作
				// console.log(imgBase64);
				if (input_model.value[name_title] == '') {
					uni.request({
						url: counter.baseUrl + '/api/common.Common/upload2',
						method: 'POST',
						header: headers,
						data: {
							'type': 'StoreID',
							'name': name_title,
							'imgBase64': compressedBase64,
						},
						success(res) {

							if (res.data.code == 1) {
								input_model.value[name_title] = res.data.data.url
								uni.showToast({
									title: '上传成功',
									position: 'center'
								})
							} else {
								uni.showToast({
									title: '上传失败~请删除重新上传',
									icon: 'error',
									position: 'center'
								})
							}
						},
						fail(err) {
							// console.log('失败',err);
							uni.showToast({
								title: '上传失败~请删除重新上传',
								icon: 'error',
								position: 'center'
							})
						}
					})
				} else {
					input_model.value[name] = ""
					uni.showToast({
						title: input_model.value[name_title],
						position: 'center'
					})
				}
			}).catch(error => {
				console.log(error);
			});

		} else {
			var imgBase64 = ''
			var headers = {
				"server": '1',
				"ba-user-token": counter.access_token,
			}

			if (input_model.value[name_title] == '') {
				uni.uploadFile({
					url: counter.baseUrl + '/api/common.Common/upload2',
					header: headers,
					filePath: src[0],
					name: 'file',
					formData: {
						'type': 'StoreID',
						'name': name_title,
					},
					success(res) {
						if (JSON.parse(res.data).code == 1) {
							input_model.value[name_title] = JSON.parse(res.data).data.url
							uni.showToast({
								title: '上传成功',
								position: 'center'
							})
						} else {
							uni.showToast({
								title: '上传失败~请删除重新上传',
								icon: 'error',
								position: 'center'
							})
						}
					},
					fail(err) {
						// console.log('失败',err);
						uni.showToast({
							title: '上传失败~请删除重新上传',
							icon: 'error',
							position: 'center'
						})
					}
				})
			} else {
				input_model.value[name] = ""
				uni.showToast({
					title: input_model.value[name_title],
					position: 'center'
				})
			}
		}
	}

	const uploading = (e, index) => { //图片上传

		uni.showLoading({
			title: '上传中~'
		})
		var name_title = ListData.value['image_List'][index].value
		uni.uploadFile({
			url: counter.baseUrl + '/api/common.Common/upload2',
			header: {
				server: 1,
				"ba-user-token": counter.access_token
			},
			file: e.tempFilePaths[0],
			filePath: e.tempFiles[0].url,
			name: 'file',
			formData: {
				"type": 'StoreID',
				"name": name_title,
			},
			success(res) {

				if (JSON.parse(res.data).code == 1) {
					input_model.value[name_title] = JSON.parse(res.data).data.url
					uni.showToast({
						title: '上传成功',
						position: 'center'
					})
				} else {
					uni.showToast({
						title: '上传失败~请删除重新上传',
						icon: 'error',
						position: 'center'
					})
				}
			},
			fail(err) {
				uni.showToast({
					title: '上传失败，请删除重试~',
					icon: 'error',
					position: "center"
				})
			}
		})
	}

	const deleteImg = (index) => { //删除图片
		for (var i = 0; i < upimgData.value.length; i++) {
			if (upimgData.value[i].index == index) {
				upimgData.value.splice(i, 1)
			}
		}
	}

	onPageScroll((e) => { //用户滑动控制按钮显示
		//取消滑动动画
		// if(e.scrollTop>newScrollValue.value){
		// 	showBottomButtom.value=false
		// 	newScrollValue.value=e.scrollTop
		// }else{
		// 	showBottomButtom.value=true
		// 	newScrollValue.value=e.scrollTop
		// }
	})

	//压缩base64图片
	const compressBase64Image = (base64Data, quality, maxWidth, maxHeight) => {
		return new Promise((resolve, reject) => {
			const img = new Image();

			img.onload = function() {
				let canvas = document.createElement('canvas');
				let ctx = canvas.getContext('2d');

				let width = img.width;
				let height = img.height;

				if (maxWidth && maxHeight) {
					// 缩放比例
					let ratio = Math.min(maxWidth / width, maxHeight / height);
					width *= ratio;
					height *= ratio;
				}

				canvas.width = width;
				canvas.height = height;

				// 绘制压缩后的图片
				ctx.drawImage(img, 0, 0, width, height);

				// 将canvas转换为base64
				const compressedBase64 = canvas.toDataURL('image/png', quality);

				resolve(compressedBase64);
			};

			img.onerror = function(error) {
				reject(error);
			};

			img.src = base64Data;
		});
	}

	const tijiao = () => {
		for (var i = 0; i < ListData.value.image_List.length; i++) {
			//循环判断是否有图片
			if (input_model.value[ListData.value.image_List[i].value] == "") {
				uni.showToast({
					title: '图片不能为空',
					icon: 'error'
				})
				return
			}
		}
		proxy.$refs.forms.validate().then(res => {
			api.OpenReceipt({
				// "receipt_id":props.payId,//渠道id ,
				"source": props.payId, //渠道id
				"ticai_SalesAgent": input_model.value['ticai_SalesAgent'], //体彩代销证图片 
				"fucai_SalesAgent": input_model.value['fucai_SalesAgent'], //	福彩代销证图片
				"shop_headImg": input_model.value['shop_headImg'], //店铺门头照  
				"shop_indoorImg": input_model.value['shop_indoorImg'], //	店铺室内照
				"identificationNumb": input_model.value['identificationNumb'], //身份证号码  
				"identification_front": input_model.value['identification_front'], //身份证-正面 
				"identification_reverse": input_model.value['identification_reverse'], //身份证-反面
				"hold_identification": input_model.value['hold_identification'], //手拿身份证照片
				"identification_start": input_model.value['identification_start'], //身份证起始时间  
				"identification_end": input_model.value['identification_end'], //身份证结束时间  
				"identification_address": input_model.value['identification_address'], //身份证地址
				"businessLicense_img": input_model.value['businessLicense_img'], //营业执照照片
				"machine_identification": input_model.value['machine_identification'], //机器旁身份证
				"machine_SalesAgent": input_model.value['machine_SalesAgent'], //机器旁代销证 
				"shop_location": input_model.value['shop_location'], //商户所在地  
				"shop_detailedAddress": input_model.value['shop_detailedAddress'], //商户详细地址 
				"shop_fullName": input_model.value['shop_fullName'], //商户全称  
				"shop_forShort": input_model.value['shop_forShort'], //商户简称  
				"bankCard_num": input_model.value['bankCard_num'], //	银行卡号 
				"bank_number": input_model.value['bank_number'], //银行编号  
				"branch_bank": input_model.value['branch_bank'], //支行名称
				"openingBank_address": input_model.value['openingBank_address'], //开户行地址  
				"bankCard_frontImg": input_model.value['bankCard_frontImg'], //银行卡正面照
				"email": input_model.value['email'], //邮箱  
				"phone_number": input_model.value['phone_number'], //手机号  
				"name": input_model.value['name'], //	姓名
				"Alipay_account": input_model.value['Alipay_account'], //支付宝账号 
				"commission_num": input_model.value['commission_num'], //	代销证编号
				"commission_startline": input_model.value['commission_startline'], //代销证开始日期  
				"commission_deadline": input_model.value['commission_deadline'], //代销证截止日期  
				"receipt_id": props.payId, //	渠道id 
				"number": input_model.value['number'], //电话 
				"realname": input_model.value['realname'], ////姓名
				"commission_num": input_model.value['commission_num'], //代销证编号 
				"commission_deadline": input_model.value['commission_deadline'], //代销证编号 
				"commission_img": input_model.value['commission_img'], //代销证图片
				"shopSign": input_model.value['shopSign'], //	门头照片
				"indoor_img": input_model.value['indoor_img'], //门店内景
				"email": input_model.value['email'], //邮箱
				"zfb_account": input_model.value['zfb_account'], //支付宝账号 
				"yh_account": input_model.value['yh_account'], //银行卡号 
				"yh_affiliation": input_model.value['yh_affiliation'], //银行卡所属银行 
				"shopAddress": input_model.value['shopAddress'], //店铺地址  
				"in_hand_identityCard": input_model.value['in_hand_identityCard'], //手持身份证照片  
				"bankCard": input_model.value['bankCard'], //银行卡正面照 
				"identityCard_Fornt": input_model.value['identityCard_Fornt'], //身份证人面照 
				"identityCard_Rear": input_model.value['identityCard_Rear'], //	身份证国徽照 
				"identityCard_num": input_model.value['identityCard_num'], //	身份证号码  
				"identityCard_orvertime": input_model.value['identityCard_orvertime'], //身份证有效期结束时间
				"xianxia_shoukuangImg": input_model.value['xianxia_shoukuangImg'] //线下首款二维码
			}).then(res => {
				if (res.data.code == 1) {
					uni.showToast({
						title: '提交成功',
					})
					back()
					uni.$emit('refres')
				} else {
					uni.showToast({
						title: res.data.data,
						icon: "error"
					})
				}
			})
		}).catch(err => {
			uni.showToast({
				title: '提交失败，请联系客服！',
				icon: "error"
			})
		})
	}


	const formsRules = reactive({
		phone_number: {
			rules: [{
					required: true,
					errorMessage: '联系电话不能为空'
				},
				{
					validateFunction: function(rule, value, data, callback) { //手机验证
						var reg = /^1[3456789]\d{9}$/;
						if (!reg.test(value)) {
							callback('请输入有效的手机号码');
						}
						return true
					}
				},

			]
		},
		identificationNumb: {
			rules: [{
					required: true,
					errorMessage: '身份证号码不能为空'
				},
				{
					validateFunction: function(rule, value, data, callback) { //邮箱验证
						var res = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
						if (!res.test(value)) {
							callback('请输入正确的身份证号码!')
						}
						return true
					}
				},
			]
		},
		identification_address: {
			rules: [{
				required: true,
				errorMessage: '身份证地址不能为空'
			}, ]
		},
		identification_start: {
			rules: [{
				required: true,
				errorMessage: '身份证起始时间不能为空'
			}, ]
		},
		identification_end: {
			rules: [{
				required: true,
				errorMessage: '身份证结束时间不能为空'
			}, ]
		},
		shop_location: {
			rules: [{
				required: true,
				errorMessage: '商户所在地不能为空'
			}, ]
		},
		shop_detailedAddress: {
			rules: [{
				required: true,
				errorMessage: '商户详细地址不能为空'
			}, ]
		},
		bankCard_num: {
			rules: [{
				required: true,
				errorMessage: '银行卡号不能为空'
			}, ]
		},
		bank_number: {
			rules: [{
				required: true,
				errorMessage: '银行编号不能为空'
			}, ]
		},
		branch_bank: {
			rules: [{
				required: true,
				errorMessage: '支行名称不能为空'
			}, ]
		},
		openingBank_address: {
			rules: [{
				required: true,
				errorMessage: '开户行地址不能为空'
			}, ]
		},
		shop_fullName: {
			rules: [{
				required: true,
				errorMessage: '店铺全称不能为空'
			}, ]
		},
		shop_forShort: {
			rules: [{
				required: true,
				errorMessage: '店铺简称不能为空'
			}, ]
		},
		name: {
			rules: [{
				required: true,
				errorMessage: '姓名不能为空'
			}, ]
		},
		email: {
			rules: [{
					required: true,
					errorMessage: '邮箱不能为空'
				},
				{
					validateFunction: function(rule, value, data, callback) { //邮箱验证
						var res = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
						if (!res.test(value)) {
							callback('请输入正确的邮箱!')
						}
						return true
					}
				},
			]
		},
	})


	const back = () => {
		uni.navigateBack()
	}
</script>

<style>
	.reminder {
		width: 100%;
		padding: 20rpx;
		background-color: #fdf8e0;
		font-size: 26rpx;
		box-sizing: border-box;
		line-height: 40rpx;
	}

	.content_box_input {
		width: 100%;
		padding: 20rpx;
		box-sizing: border-box;
	}

	.content_box_image {
		display: grid;
		grid-template-columns: repeat(2, auto);
		grid-template-rows: repeat(auto, auto);
		justify-content: space-around;
	}

	.buttomStyle {
		width: 100%;
		height: 120rpx;
		background-color: #FDC830;
		border-radius: 15rpx;
		text-align: center;
		/* justify-content: center; */
		line-height: 120rpx;
		color: white;
		font-size: 35rpx;
	}

	.bottom_card {
		width: 100%;
		padding: 20rpx;
		box-sizing: border-box;
		position: fixed;
		bottom: 0;
	}

	body {
		background-color: #f7f7f7;
	}

	.status_bar {
		background-color: #fff;
		height: var(--status-bar-height);
		width: 100%;
	}
</style>
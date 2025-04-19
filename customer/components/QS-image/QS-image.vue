<template>
	<view class="position_relative transition_6s display_inline-block over_hidden" :class="imgLoadSuccess?'':'backgrounColor_f8f8f8'"
	 :style="'width: ' + width + ';height:' + height + ';border-radius: ' + radius + ';'" @tap.prevent.stop="onTap()">
		<text class="imgStatusStyle" v-if="!imgLoadSuccess">
			{{imgStatusText}}
		</text>
		<image 
		:src="imagePath" 
		:mode="imageMode" 
		:lazy-load="lazyLoad"
		 @error="imgErr" 
		 @load="imgLoad" 
		 class="transition_6s"
		 :class=" imgLoadSuccess?animationType + '_loaded':animationType" 
		 :style="'width: ' + width + ';height:' + height + ';border-radius: ' + radius + ';' + imageStyle"></image>
	</view>
</template>

<script>
	const loading = '图片加载中';
	const nullImg = '图片路径为空';
	const loadErr = '加载失败\r\n点击重试';
	const errPlaceholder = 'errPlaceholder';
	const isErr = 2;
	const isLoading = 1;
	export default {
		props: {
			imageUrl: {
				type: String,
				default: ''
			},
			imageMode: {
				type: String,
				default: 'scaleToFill'
			},
			lazyLoad: {
				type: Boolean,
				default: false
			},
			imageStyle: {
				type: String,
				default: ''
			},
			passClick: {
				type: Boolean,
				default: true
			},
			width: {
				type: String,
				default: ''
			},
			height: {
				type: String,
				default: ''
			},
			radius: {
				type: String,
				default: ''
			},
			animationType: {
				type: String,
				default: 'fadIn'
			}
		},
		watch: {
			imageUrl(n, o) {
				if (n) this.init();
			}
		},
		data() {
			return {
				imagePath: '',
				imgLoadSuccess: false,
				imgStatusText: '',
				imgStatus: 0 // 0: 无
			}
		},
		created() {
			this.init();
		},
		methods: {
			init() {
				this.imgLoadSuccess = false;
				if (this.imageUrl) {
					this.imgStatusText = loading;
					this.imagePath = this.imageUrl;
				} else {
					this.imgStatusText = nullImg;
				}
			},
			imgErr() {
				this.changeStatus('error')
			},
			imgLoad() {
				this.changeStatus('success')
			},
			changeStatus(type) {
				switch (type) {
					case 'loading':
						this.checkimgLoadSuccessFalse();
						this.imgStatusText = loading;
						this.imgStatus = isLoading;
						break;
					case 'error':
						this.checkimgLoadSuccessFalse();
						if (this.imagePath !== errPlaceholder) {
							this.imgStatusText = loadErr;
							this.imgStatus = isErr;
						}
						break;
					case 'success':
						this.imgLoadSuccess = true;
						break;
				}
			},
			checkimgLoadSuccessFalse() {
				if (this.imgLoadSuccess)
					this.imgLoadSuccess = false
			},
			tryReLoad() {
				if (this.imgLoadSuccess) return;
				if (this.imgStatus === isErr && this.imagePath !== errPlaceholder) {
					this.imagePath = errPlaceholder;
					setTimeout(() => {
						this.changeStatus('loading');
						this.imagePath = this.imageUrl;
					}, 100);
				}
			},
			onTap() {
				if (this.passClick) {
					this.$emit('click');
					if (!this.imgLoadSuccess)
						this.tryReLoad();
				} else {
					if (this.imgLoadSuccess) {
						this.$emit('click');
					} else {
						this.tryReLoad();
					}
				}
			}
		}
	}
</script>

<style scoped>
	.over_hidden {
		overflow: hidden;
	}

	.display_inline-block {
		display: inline-block;
	}

	.transition_6s {
		transition: all .6s;
	}

	.position_relative {
		position: relative;
	}

	.imgStatusStyle {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		font-size: 40%;
		color: #ADADAD;
	}

	.backgrounColor_f8f8f8 {
		background-color: #F8F8F8;
	}

	.fadIn {
		opacity: 0;
	}

	.fadIn_loaded {
		opacity: 1;
	}
	
	.fadLeft {
		opacity: 0;
		transform: translateX(-100%);
	}
	.fadLeft_loaded {
		opacity: 1;
		transform: translateX(0);
	}
	
	.fadTop {
		opacity: 0;
		transform: translateY(-100%);
	}
	.fadTop_loaded {
		opacity: 1;
		transform: translateY(0);
	}
	
	.fadBottom {
		opacity: 0;
		transform: translateY(100%);
	}
	.fadBottom_loaded {
		opacity: 1;
		transform: translateY(0);
	}
	
	.fadRight {
		opacity: 0;
		transform: translateY(100%);
	}
	.fadRight_loaded {
		opacity: 1;
		transform: translateY(0);
	}
	
	.fadRotateZ {
		opacity: 0;
		transform: rotateZ(360deg);
	}
	.fadRotateZ_loaded {
		opacity: 1;
		transform: rotateZ(0deg);
	}
	
	.fadScale {
		opacity: 0;
		transform: scale(3);
	}
	.fadScale_loaded {
		opacity: 1;
		transform: scale(1);
	}
	
	.fadRotateY {
		opacity: 0;
		transform: rotateY(180deg);
	}
	.fadRotateY_loaded {
		opacity: 1;
		transform: rotateY(0deg);
	}
</style>

<template>
	<swiper :disable-touch="disabledTouch" :current="active" class="swiper" :vertical="direction=='down'?true:false"
	 @change="change">
		<swiper-item v-if="direction!='left'">
			<view class="swiper-item-0"></view>
		</swiper-item>
		<swiper-item @touchstart="touchstart" @touchend="touchend" @touchcancel="touchend" @touchmove="touchmove">
			<view class="swiper-item-1" :style="style">
				<view class="title" v-if="title">
					<text class="title-text">{{title}}</text>
					<uni-icons type="closeempty" size="20" color="#333333" class="close" @click="close"></uni-icons>
				</view>
				<slot name="content" />
			</view>
		</swiper-item>
		<swiper-item v-if="direction=='left'">
			<view class="swiper-item-0"></view>
		</swiper-item>
	</swiper>
</template>

<script>
	const subNVue = uni.getCurrentSubNVue();
	export default {
		name: "swiperSubnuve",
		props: {
			title: {
				type: String,
				default: ''
			},
			borderRadius: {
				type: String,
				default: '0'
			},
			backgroundColor: {
				type: String,
				default: '#FFFFFF'
			},
			direction: {
				type: String,
				default: 'down'
			}


		},
		data() {
			return {
				active: 1,
				defaultActive:1,
				disabledTouch: false,
				startPage: 0,
				style: {},
				platform:''
			};
		},
		methods: {
			change(e) {
				this.active = e.detail.current
				if (e.detail.current != this.defaultActive) {
					setTimeout(() => {
						this.active = this.defaultActive
					}, 100)
					subNVue.hide('none')
				}
			},
			close() {
				switch (this.direction) {
					case "down":
						subNVue.hide('slide-out-bottom')
						break;
					case "left":
						subNVue.hide('slide-out-left')
						break;
					case "right":
						subNVue.hide('slide-out-right')
				}
				
			},
			touchmove(e) {
				//处理ios中swiper边缘可拖动问题
				if(this.platform=='ios'){
					let movePage
					if (this.direction == 'down') {
						movePage = e.changedTouches[0].pageY
					} else {
						movePage = e.changedTouches[0].pageX
					}
					if (movePage < this.startPage) {
						if (this.direction == "left") {
							this.disabledTouch = false
						} else {
							this.disabledTouch = true
						}
					
					} else {
						if (this.direction == "left") {
							this.disabledTouch = true
						} else {
							this.disabledTouch = false
						}
					}
				}
				
			},
			touchstart(e) {
				if (this.direction == "down") {
					this.startPage = e.changedTouches[0].pageY
				} else {
					this.startPage = e.changedTouches[0].pageX
				}

			},
			touchend(e) {
				this.disabledTouch = false
			}
		},
		mounted() {
			this.platform = uni.getSystemInfoSync().platform
			switch (this.direction) {
				case "down":
					this.style = {
						borderTopLeftRadius: this.borderRadius,
						borderTopRightRadius: this.borderRadius
					}
					break;
				case "left":
					this.active = 0
					this.defaultActive = 0
					this.style = {
						borderTopRightRadius: this.borderRadius,
						borderBottomRightRadius: this.borderRadius
					}
					break;
				case "right":
					this.style = {
						borderTopLeftRadius: this.borderRadius,
						borderBottomLeftRadius: this.borderRadius
					}
					break;
			}

			this.style.backgroundColor = this.backgroundColor
		}
	}
</script>

<style lang="scss">
	.swiper {
		flex: 1;
	}

	.swiper-item-0 {
		background-color: transparent;
		flex: 1;
	}

	.swiper-item-1 {
		flex: 1;
	}

	.scroll-view {
		flex: 1;
	}

	.title {
		margin: 15rpx;
		border-bottom-width: 2rpx;
		border-bottom-style: solid;
		border-bottom-color: #eee;
		justify-content: center;
		align-items: center;
	}

	.title-text {
		font-size: 32rpx;
		color: #333333;
		padding: 25rpx 0;
	}

	.close {
		position: absolute;
		right: 0;
	}
</style>

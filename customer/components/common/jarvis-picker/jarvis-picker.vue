<template>
	<view class="pricke">
		<uni-transition v-if="mark" ref="aniMark" custom-class="transition" mode-class="fade" :styles="stylesMark" :show="show" @click="clickMark"></uni-transition>
		<uni-transition ref="ani" custom-class="transition" :mode-class="modeClass" :styles="styles" :show="show">
			<view class="m-picker">
				<view class="m-picker__case" :style="{
					background: bgColor,
					borderTopLeftRadius: radius[0] + 'rpx',
					borderTopRightRadius: radius[1] + 'rpx',
					borderBottomLeftRadius: radius[2] + 'rpx',
					borderBottomRightRadius: radius[3] + 'rpx',
					paddingBottom: model == 'bottom' ? 'calc(constant(safe-area-inset-bottom) + 30rpx)' : '30rpx',
					paddingBottom: model == 'bottom' ? 'calc(env(safe-area-inset-bottom) + 30rpx)' : '30rpx'
				}">
					<slot v-if="model == 'bottom'" name="handle">
						<view class="handle">
							<view class="button cancel" :style="cancelStyle" @click="cancel">{{cancelText}}</view>
							<view class="button confirm" :style="confirmStyle" @click="confirm">{{confirmText}}</view>
						</view>
					</slot>
					<slot>
						<view class="content" :style="{height: `${height}rpx`}">
							<picker-view class="picker-view" :indicator-class="indicatorClass" :indicator-style="indicatorStyle" :value="pickerValue" @change="bindChange" @pickstart="pickstart" @pickend="pickend">
								<picker-view-column v-for="(rangeItem, rangeIndex) in range" :key="rangeIndex">
									<view class="picker-view__item" v-for="(item, index) in rangeItem" :key="index">
										{{ item[rangeKey] }}
									</view>
								</picker-view-column>
							</picker-view>
						</view>
					</slot>
					<slot v-if="model != 'bottom'" name="handle">
						<view class="handle">
							<view class="button cancel" :style="cancelStyle" @click="cancel">{{cancelText}}</view>
							<view class="button confirm" :style="confirmStyle" @click="confirm">{{confirmText}}</view>
						</view>
					</slot>
				</view>
			</view>
		</uni-transition>
	</view>
</template>

<script>
	import props from './props.js'
	export default {
		name:"jarvis-picker",
		props,
		data() {
			return {
				pickerValue: [],
				pickMove: false,
			};
		},
		computed: {
			model() {
				if (this.mode == 'top') return 'top';
				else if (this.mode == 'bottom') return 'bottom';
				else if (this.mode == 'center') return 'center';
				else return 'bottom';
			},
			stylesMark() {
				return {
					position: 'fixed',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					zIndex: 99,
					backgroundColor: this.markBgColor,
				}
			},
			styles() {
				const top = {
					position: 'fixed',
					left: 0,
					right: 0,
					top: 0,
					zIndex: 100
				}
				const bottom = {
					position: 'fixed',
					left: 0,
					right: 0,
					bottom: 0,
					zIndex: 100
				}
				const center = {
					position: 'fixed',
					left: '50%',
					top: '50%',
					width: '90vw',
					transform: 'translate(-50%, -50%)',
					zIndex: 100
				}
				if (this.model == 'top') return top;
				else if (this.model == 'bottom') return bottom;
				else if (this.model == 'center') return center;
				else return bottom;
			},
			radius() {
				const borderRadius = this.borderRadius;
				if (this.model == 'top') return [0, 0, borderRadius, borderRadius];
				else if (this.model == 'bottom') return [borderRadius, borderRadius, 0, 0];
				else if (this.model == 'center') return [borderRadius, borderRadius, borderRadius, borderRadius];
				else return [0, 0, 0, 0];
			},
			modeClass() {
				if (this.model == 'top') return ['fade', 'slide-top'];
				else if (this.model == 'bottom') return ['fade', 'slide-bottom'];
				else if (this.model == 'center') return 'fade';
				else return ['fade', 'slide-bottom'];
			}
		},
		watch: {
			range(val) {
				if (val.length) {
					let arr = []
					for (let index in this.range) {
						arr.push(0);
					}
					this.pickerValue = arr;
				}
			}
		},
		created() {
			if (this.range && this.range.length) {
				this.pickerValue = [];
				for (let index in this.range) {
					this.pickerValue.push(0)
				}
			}
		},
		methods: {
			// 关闭
			close() {
				if (!this.pickMove) this.$emit('update:show', false)
			},
			// 取消
			cancel() {
				this.$emit('cancel')
				if (this.btnClose) this.close()
			},
			// 确定
			confirm() {
				this.$emit('confirm', this.pickerValue);
				if (this.btnClose) this.close()
			},
			// 点击遮罩
			clickMark() {
				this.$emit('cancel')
				if (this.btnClose) this.close()
				// if (this.btnClose) this.close()
				// if (this.markClose) this.close()
			},
			bindChange (e) {
				const val = e.detail.value;
				this.pickerValue = val;
			},
			pickstart() {
				this.pickMove = true;
			},
			pickend() {
				this.pickMove = false;
			}
		}
	}
</script>

<style lang="scss">
.m-picker {
	width: 100%;
	height: 100%;
	
	&__case {
		padding-left: 56rpx;
		padding-right: 56rpx;
		padding-top: 30rpx;
		padding-bottom: 30rpx;
		
		.handle {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			
			.button {
				font-size: 48rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #000000;
				
				&.cancel {
					
				}
				
				&.confirm {
					color: #f04b49;
				}
			}
		}
		
		.content {
			width: 100%;
			height: 400rpx;
		}
		
	}
}

.picker-view {
	width: 100%;
	height: 100%;
	
	&__item {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 48rpx;
	}
}
</style>

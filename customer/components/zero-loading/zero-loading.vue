<template>
	<!--  -->
	<view :style="{'position': position,'z-index':zIndex,'--opacity':maskOpacity}" class="container" :class="[mask?'mask':'',maskMini?'mask-mini':'',maskDark?'mask-dark':'']" @click.prevent="handleClick">
		<view>
			<view class="main">
				<loading0 v-if="type=='circle'"></loading0>
				<loading1 v-if="type=='pulse'"></loading1>
				<loading2 v-if="type=='bounce'"></loading2>
				<loading3 v-if="type=='eyes'"></loading3>
				<loading4 v-if="type=='triangle'"></loading4>
				<loading5 v-if="type=='sun'"></loading5>
				<loading6 v-if="type=='love'"></loading6>
				<loading7 v-if="type=='sword'" :color="color"></loading7>
				<loading8 v-if="type=='atom'"></loading8>
				<loading9 v-if="type=='gear'"></loading9>
				<loading10 v-if="type=='radar'"></loading10>
			</view>
		</view>
	</view>
</template>

<script>
	import loading0 from "./static/loading-circle.vue"
	import loading1 from "./static/loading-pulse.vue"
	import loading2 from "./static/loading-bounce.vue"
	import loading3 from "./static/loading-eyes.vue"
	import loading4 from "./static/loading-triangle.vue"
	import loading5 from "./static/loading-sun.vue"
	import loading6 from "./static/loading-love.vue"
	import loading7 from "./static/loading-sword.vue"
	import loading8 from "./static/loading-atom.vue"
	import loading9 from "./static/loading-gear.vue"
	import loading10 from "./static/loading-radar.vue"

	export default {
		name: "zero-loading",
		components: {
			loading0,
			loading1,
			loading2,
			loading3,
			loading4,
			loading5,
			loading6,
			loading7,
			loading8,
			loading9,
			loading10
		},
		props: {
			color: {
				type: String,
				default: "#ED213A"
			},
			type: {
				type: String,
				default: "sword"
			},
			position: {
				type: String,
				default: "fixed"
			},
			zIndex: {
				type: Number,
				default: 9,
			},
			mask: {
				type: Boolean,
				default: false,
			},
			maskOpacity:{
				type: Number,
				default: 0.3,
			},
			maskMini: {
				type: Boolean,
				default: false,
			},
			maskDark:{
				type: Boolean,
				default: true,
			}
		},
		data() {
			return {
				
			};
		},
		methods: {
			handleClick() {
				this.$emit('click')
			}
		},
	};
</script>

<style lang="scss" scoped>
	.container {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.mask {
		z-index: 999 !important;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		height: 100vh;
		width: 100vw;
		background: rgba(255, 255, 255, var(--opacity));
		transform: translate(0, 0);
	}
	.mask-mini{
		height: 300rpx;
		width: 300rpx;
		border-radius: 20rpx;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	.mask-dark{
		background: rgba(7, 17, 27 , var(--opacity));
	}
</style>

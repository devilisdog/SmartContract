<template name="pyh-nv">
	<view class="pyh-nv-box" ref="pyhNvBox" :style="style" v-if="show">
		<view class='nvHeight'
			:style="[{'height':navigatorHeight+'px'},{'background':(nvConfig.fixedAssist&&nvConfig.fixedAssist.bgColor)||''}]"
			v-if="isFixed&&!(nvConfig.fixedAssist&&nvConfig.fixedAssist.hide)"></view>
		<image :src="nvConfig.bgImage"
			:style="[{'position':isFixed?'fixed':'absolute'},{'top':(nvConfig.model?(nvBoxRect.top+'px'):0)},{'width':windowInfo.width+'px','height':navigatorHeight+'px'}]"
			v-if="nvConfig.bgImage&&(nvConfig.model?!nvBoxRect.wait:true)" class="bgImage"></image>
		<view :class="['nvBox',{'noModel':!nvConfig.model}]"
			:style="[{'width':windowInfo.width+'px'},{'color':getTxtColor},{'background':getBgColor},{'opacity':nvConfig.transparent&&nvConfig.transparent.type=='content'?transparent.opacity:1},{'position':isFixed?'fixed':'relative'},{'top':(isFixed&&nvConfig.model?(nvBoxRect.top+'px'):0)}]"
			v-if="nvConfig.model?!nvBoxRect.wait:true">
			<view class='nvHeight' :style="[{'height':navigatorHeight+'px'}]"></view>
			<view class='nvFixed'
				:style="[{'width':windowInfo.width+'px','padding-right':nvContentRight+'px','bottom':nvContentBottom+'px','box-shadow':nvConfig.shadow||'none'}]">
				<!-- slot内嵌 -->
				<view :class="['nvContent',{'androidwx':androidwx},
				{'nvContentTop':nvConfig.componentsFlex&&nvConfig.componentsFlex=='top'},
				{'nvContentBottom':nvConfig.componentsFlex&&nvConfig.componentsFlex=='bottom'}
				]" v-if="nvConfig.type=='slot'" @tap.stop="nvSlotTap">
					<slot></slot>
				</view>
				<!-- 单logo -->
				<view :class="['nvContent','nvLogoBox',{'androidwx':androidwx},
				{'nvContentTop':nvConfig.componentsFlex&&nvConfig.componentsFlex=='top'},
				{'nvContentBottom':nvConfig.componentsFlex&&nvConfig.componentsFlex=='bottom'}
				]" v-else-if="nvConfig.type=='logo'">
					<image :src="nvConfig.logo.src?nvConfig.logo.src:'/static/logo.png'" class="nvLogo"
						:style="nvConfig.logo.style" :mode="getImgMode(nvConfig.logo.style)" @tap.stop="nvLogoTap">
					</image>
					<view v-if="nvConfig.btn&&nvConfig.btn.length>0" class="nvBtnGroup">
						<block v-for="(b,n) in nvConfig.btn" :key="n">
							<view class="nvBtn" v-if="b.icon" @tap.stop="nvBtnTap" :data-index="n" :data-type="b.type"
								:style="b.style||''">
								<image :src="b.icon" mode="widthFix" class="nvBtnImg"></image>
								<text class="nvBtnIconTxt" v-if="b.text">{{b.text}}</text>
								<text class="nvBadge" v-if="b.badge&&b.badge.text"
									:style="b.badge.style||''">{{b.badge.text}}</text>
							</view>
							<view class="nvBtn" v-else-if="b.text" @tap.stop="nvBtnTap" :data-index="n"
								:data-type="b.type" :style="b.style||{color:getTxtColor}">
								<text>{{b.text}}</text>
								<text class="nvBadge" v-if="b.badge&&b.badge.text"
									:style="b.badge.style||''">{{b.badge.text}}</text>
							</view>
						</block>
					</view>
				</view>
				<!-- 含搜索 -->
				<view :class="['nvContent','nvSearchBox',{'nvHadBack':!(nvConfig.back&&nvConfig.back.hide)},
				{'nvContentTop':nvConfig.componentsFlex&&nvConfig.componentsFlex=='top'},
				{'nvContentBottom':nvConfig.componentsFlex&&nvConfig.componentsFlex=='bottom'}
				]" v-else-if="nvConfig.type=='search'">
					<image :src="nvConfig.logo.src?nvConfig.logo.src:'/static/logo.png'" class="nvLogo nvSearchLogo"
						:style="nvConfig.logo.style" :mode="getImgMode(nvConfig.logo.style)" @tap.stop="nvLogoTap"
						v-if="nvConfig.logo&&!nvConfig.address"></image>
					<block v-if="nvConfig.address">
						<slot v-if="nvConfig.address.type&&nvConfig.address.type=='slot'"></slot>
						<view v-else
							:class="['nvAddress','nvSearchAddress',{'nvSBoxFlex':nvConfig.componentsFlex&&(nvConfig.componentsFlex=='top'||nvConfig.componentsFlex=='bottom')}]"
							:style="[{'width':nvConfig.address.width||'144rpx'},{'background':(nvConfig.address.bgColor||'')},{'margin-right':Boolean(nvConfig.address.bgColor||'')?'20rpx':'0'},{'color':(nvConfig.address.color||'')}]"
							@tap.stop="nvAddressTap">
							<text
								class="nvAddressText">{{nvConfig.address[nvConfig.address.fields||'province']||'广东省'}}</text>
							<text class="nvIconFont nvAddressIcon"
								:style="{'color':(nvConfig.address.color||'')}">&#xe6b5;</text>
						</view>
					</block>
					<view class="nvSForm" :style="{'height':nvComponentHeight+'px'}">
						<view
							:class="['nvSBox',{'nvSBoxFlex':nvConfig.componentsFlex&&(nvConfig.componentsFlex=='top'||nvConfig.componentsFlex=='bottom')}]"
							:style="[{'background':(nvConfig.search.bgColor||nvConfig.componentBgColor||'')},{'border':nvConfig.search.border||''}]"
							@tap.stop="nvInputTap" data-isInput="true">
							<icon type="search" class="searchIcon"
								:size="nvConfig.search.icon?(nvConfig.search.icon.size||18):18"
								:color="(nvConfig.search.icon?nvConfig.search.icon.color||'':'')||nvConfig.search.color||''"
								v-if="nvConfig.search.icon&&!nvConfig.search.icon.hide"></icon>
							<input class="nvInput" type="text" :value="inputValue" :focus="nvConfig.search.focus"
								:placeholder="nvConfig.search.placeholder" :disabled="!nvConfig.search.input"
								@input="inputChange" @confirm="formSubmit"
								:confirm-type="nvConfig.search.confirmType||'search'" placeholder-class="searchPlac"
								:placeholder-style="nvConfig.search.placeholderStyle||''"
								:style="{'color':nvConfig.search.color||''}" />
							<icon type="clear" size="15" class="nvSClose" @tap.stop="inputClear" v-if="inputValue"
								:color="nvConfig.search.color||''"></icon>
						</view>
						<text class='nvSBtn' @tap.stop="formSubmit" v-if="nvConfig.search.btn&&nvConfig.search.input"
							:style="nvConfig.search.btn.style||('background:'+mainColor)">{{nvConfig.search.btn.text||'搜索'}}</text>
					</view>
					<view v-if="nvConfig.btn&&nvConfig.btn.length>0"
						:class="['nvBtnGroup','nvBtnGroup-static',{'componentsFlex':nvConfig.componentsFlex}]">
						<block v-for="(b,n) in nvConfig.btn" :key="n">
							<view class="nvBtn" v-if="b.icon" @tap.stop="nvBtnTap" :data-index="n" :data-type="b.type"
								:style="b.style||''">
								<image :src="b.icon" mode="widthFix" class="nvBtnImg"></image>
								<text class="nvBtnIconTxt" v-if="b.text">{{b.text}}</text>
								<text class="nvBadge" v-if="b.badge&&b.badge.text"
									:style="b.badge.style||''">{{b.badge.text}}</text>
							</view>
							<view class="nvBtn" v-else-if="b.text" @tap.stop="nvBtnTap" :data-index="n"
								:data-type="b.type" :style="b.style||{color:getTxtColor}">
								<text>{{b.text}}</text>
								<text class="nvBadge" v-if="b.badge&&b.badge.text"
									:style="b.badge.style||''">{{b.badge.text}}</text>
							</view>
						</block>
					</view>
				</view>
				<!-- 默认导航栏 -->
				<view :class="['nvContent','nvDefault',
				{'nvContentTop':nvConfig.componentsFlex&&nvConfig.componentsFlex=='top'},
				{'nvContentBottom':nvConfig.componentsFlex&&nvConfig.componentsFlex=='bottom'}
				]" v-else>
					<view v-if="nvConfig.tabArr&&nvConfig.tabArr.length>0"
						:class="['nvTitle','nvTabBox',{'androidwx':androidwx}]">
						<view :class="['nvTab',{'nvTabHide':t.hide}]" @tap.stop="nvTabTap" :data-index="i"
							v-for="(t,i) in nvConfig.tabArr" :key="i">
							<text :class="[nvTabAcIndex==i?'nTTxt-ac':'nTTxt']"
								:style="{'color':(nvTabAcIndex==i?mainColor:getTxtColor)}"
								:aaa="mainColor">{{t.title}}</text>
							<view :class="[nvTabAcIndex==i?'nTLine-ac':'nTLine']"
								:style="{'background':(nvTabAcIndex==i?mainColor:getTxtColor)}"></view>
						</view>
					</view>
					<view v-else
						:class="['nvTitle',{'androidwx':androidwx},{'hideback':nvConfig.back&&nvConfig.back.hide}]"
						:style="nvTitleStyle">
						<text :style="{'color': getTxtColor}">{{nvConfig.title||title}}</text>

					</view>
					<view v-if="nvConfig.btn&&nvConfig.btn.length>0" class="nvBtnGroup">
						<block v-for="(b,n) in nvConfig.btn" :key="n">
							<view class="nvBtn" v-if="b.icon" @tap.stop="nvBtnTap" :data-index="n" :data-type="b.type"
								:style="b.style||''">
								<image :src="b.icon" mode="widthFix" class="nvBtnImg"></image>
								<text class="nvBtnIconTxt" v-if="b.text">{{b.text}}</text>
								<text class="nvBadge" v-if="b.badge&&b.badge.text"
									:style="b.badge.style||''">{{b.badge.text}}</text>
							</view>
							<view class="nvBtn" v-else-if="b.text" @tap.stop="nvBtnTap" :data-index="n"
								:data-type="b.type" :style="b.style||{color:getTxtColor}">
								<text>{{b.text}}</text>
								<text class="nvBadge" v-if="b.badge&&b.badge.text"
									:style="b.badge.style||''">{{b.badge.text}}</text>
							</view>
						</block>
					</view>
				</view>

				<!-- 返回键 -->
				<image :class="['nvback','nvbackImg']" @tap.stop="nvBackTap"
					:src="isSharePage&&!(nvConfig.back&&nvConfig.back.iconForce)&&nvConfig.back.icon.homePath?nvConfig.back.icon.homePath:nvConfig.back.icon.path"
					:style="nvConfig.back.icon.style||''" mode="aspectFill"
					v-if="!(nvConfig.back&&nvConfig.back.hide)&&!nvConfig.address&&nvConfig.back.icon&&nvConfig.back.icon.path">
				</image>
				<text :class="['nvIconFont','nvback',{'nvhome':isSharePage&&!(nvConfig.back&&nvConfig.back.iconForce)}]"
					@tap.stop="nvBackTap"
					:style="{'background':(isSharePage&&!(nvConfig.back&&nvConfig.back.iconForce)?(nvConfig.componentBgColor||''):''),'color':getTxtColor,'border-radius':'26rpx','font-size': isSharePage&&!(nvConfig.back&&nvConfig.back.iconForce)?'36rpx':'54rpx'}"
					v-if="!(nvConfig.back&&nvConfig.back.hide)&&!nvConfig.address">{{isSharePage&&!(nvConfig.back&&nvConfig.back.iconForce)?'&#xe605;':'&#xe743;'}}</text>
				<!-- 非flex的地址 -->
				<view
					:class="['nvAddress',{'nvSBoxFlex':nvConfig.componentsFlex&&(nvConfig.componentsFlex=='top'||nvConfig.componentsFlex=='bottom')}]"
					:style="[{'width':nvConfig.address.width||'144rpx'},{'background':(nvConfig.address.bgColor||'')},{'margin-right':Boolean(nvConfig.address.bgColor||'')?'20rpx':'0'},{'color':(nvConfig.address.color||'')}]"
					v-if="nvConfig.address&&nvConfig.type!='search'" @tap.stop="nvAddressTap">
					<text class="nvAddressText">{{nvConfig.address[nvConfig.address.fields||'province']||'广东省'}}</text>

					<text class="nvIconFont nvAddressIcon"
						:style="{'color':(nvConfig.address.color||'')}">&#xe6b5;</text>
				</view>
			</view>
		</view>
		<text class="nvIconFont nvToTop" :style="(nvConfig.toTop&&nvConfig.toTop.style)||''"
			v-if="nvConfig.toTop&&showToTop" @tap.stop="toTopTap">&#xe64d;</text>
	</view>
</template>
<script>
	let domModule = null;
	// #ifdef APP-NVUE
	domModule = weex.requireModule('dom')
	// #endif
	var platform = "h5";
	//#ifdef H5
	platform = "h5"
	//#endif
	//#ifdef APP-PLUS
	platform = "app"
	//#endif
	//#ifdef MP
	platform = "mp"
	//#endif
	export default {
		name: "pyh-nv",
		props: {
			config: {
				type: Object,
				default () {
					return {}
				}
			},
		},
		data() {
			return {
				nvConfig: this.config,
				title: getApp().globalData.NAME || "pyh-nv",
				show: (getApp().globalData.hasOwnProperty('nvShow') ? (this.config.model ? true : getApp().globalData
					.nvShow) : true),
				sysncTitle: (getApp().globalData.hasOwnProperty('sysncTitle') ? getApp().globalData.sysncTitle : true),
				currentPages: getCurrentPages().length || 1,
				home: getApp().globalData.HOME || "/pages/index/index",
				inputValue: '',
				showToTop: false,
				transparent: {
					initColor: "#ffffff",
					finishColor: "#000000",
					color: "#ffffff",
					opacity: 0
				},
				nvTabAcIndex: 0,
				deviceOrientation: "portrait",
				windowInfo: {
					width: uni.getSystemInfoSync().windowWidth,
					height: uni.getSystemInfoSync().windowHeight,
					statusBarHeight: uni.getSystemInfoSync().statusBarHeight
				},
				nvBoxRect: {
					wait: true,
					top: 0,
					width: uni.getSystemInfoSync().windowWidth
				},
				style: ""
			};
		},
		watch: {
			config: {
				handler(newObj, oldObj) {
					this.initConfig(newObj)
				},
				immediate: true,
				deep: true
			}
		},
		computed: {
			mainColor() {
				return this.nvConfig.mainColor || getApp().globalData.mainColor || "#2b9939"
			},
			getImgMode() {
				return (style) => {
					//获取图片mode类型
					if (style && style.indexOf("height") > -1 && style.indexOf("width") > -1) {
						return 'aspectFill';
					} else if (style && style.indexOf("height") > -1) {
						return 'heightFix';
					} else {
						return 'widthFix';
					}
				};
			},
			statusHeight() {
				//状态栏高度
				var statusBarHeight = this.nvConfig.model ? 0 : this.windowInfo.statusBarHeight;
				return statusBarHeight + 'px';
			},
			navigatorHeight() {
				//导航栏高度
				var statusBarHeight = this.nvConfig.model ? 0 : this.windowInfo.statusBarHeight;
				var windowWidth = this.deviceOrientation == "portrait" && this.windowInfo.width > 960 ? 375 : this
					.windowInfo.width;
				return parseInt(88 * windowWidth / 750) + statusBarHeight;
			},
			//导航栏内容组件高度
			nvComponentHeight() {
				// #ifdef MP
				let sysPlatform = uni.getSystemInfoSync().platform;
				if(sysPlatform=='windows'||sysPlatform=='mac')return parseInt(60 * this.windowInfo.width / 750);
				//小程序胶囊影响修改
				let rect = uni.getMenuButtonBoundingClientRect();
				return this.nvConfig.model?parseInt(60 * this.windowInfo.width / 750):rect.height
				// #endif
				return parseInt(60 * this.windowInfo.width / 750);
			},
			//导航栏内容宽度
			nvContentRight() {
				// #ifdef MP
				let sysPlatform = uni.getSystemInfoSync().platform;
				if(sysPlatform=='windows'||sysPlatform=='mac')return parseInt(20 * this.windowInfo.width / 750);
				//小程序胶囊影响修改
				let rect = uni.getMenuButtonBoundingClientRect();
				return (this.nvConfig.model?0:(this.windowInfo.width - rect.right + rect.width)) + parseInt(20 * this.windowInfo.width / 750)
				// #endif
				return parseInt(20 * this.windowInfo.width / 750);
			},
			//导航栏内容底部定位
			nvContentBottom() {
				// #ifdef MP
				let sysPlatform = uni.getSystemInfoSync().platform;
				if(sysPlatform=='windows'||sysPlatform=='mac')return 0;
				//小程序胶囊影响修改
				let rect = uni.getMenuButtonBoundingClientRect();
				return this.nvConfig.model?0:(parseInt(88 * this.windowInfo.width / 750) - rect.height) / 2 - (rect.top - this.windowInfo.statusBarHeight)
				// #endif
				return 0;
			},
			//安全区域高度
			safeArea() {
				return this.nvConfig.safeArea || uni.getSystemInfoSync().safeArea.height;
			},
			nvTitleStyle() {
				let style = {};
				if (this.nvConfig.btn && this.nvConfig.btn.length > 1) {
					style.padding = ("0 " + (80 + 80 * (this.nvConfig.btn.length - 1)) + "rpx")
				}
				return style
			},
			//固定定位判断
			isFixed() {
				let position = this.nvConfig.position || {
					type: 'fixed'
				};
				if (typeof position == "string") position = {
					type: position
				}
				if (!position.type) position.type = 'fixed'
				return this.nvConfig.transparent || position.type == 'fixed' || position.type == 'absolute';
			},
			//判断分享页
			isSharePage() {
				return this.currentPages == 1;
			},
			//安卓微信
			androidwx() {
				if (this.nvConfig.checkAndroidwx && platform == "mp" && uni.getSystemInfoSync().platform.indexOf("ios") ==
					-1) {
					return true;
				} else {
					return false;
				}
			},
			//获取字体色
			getTxtColor() {
				return ((this.nvConfig.transparent && this.nvConfig.transparent.initColor) ? this.transparent.color :
					'') || this.nvConfig.color || '';
			},
			//获取/转换背景色
			getBgColor() {
				var that = this;
				if (this.nvConfig.bgImage) {
					return "transparent";
				} else if (this.nvConfig.bgColor && (this.nvConfig.bgColor.indexOf("gradient") > -1||this.nvConfig.bgColor=="transparent")) {
					return this.nvConfig.bgColor;
				} else {
					return (this.nvConfig.bgColor || this.nvConfig.transparent) ? 'rgba(' + getRgbString() + ',' + (this
						.nvConfig.transparent && this.nvConfig.transparent.type != 'content' ? this.transparent
						.opacity : 1) + ')' : '#ffffff';
				}

				function getRgbString() {
					var bgColor = that.nvConfig.bgColor || "#ffffff",
						returnString = ""
					if (bgColor.indexOf(",") > -1) {
						returnString = bgColor.split('(')[1].replace(')', '').split(',').slice(0, 3).join(",")
					} else {
						if (bgColor.length == 4) bgColor = bgColor + bgColor.charAt(bgColor.length - 1) + bgColor.charAt(
							bgColor.length - 1) + bgColor.charAt(bgColor.length - 1)
						var string = bgColor.replace("#", '');
						returnString = parseInt(string.substring(0, 2), 16) + ',' + parseInt(string.substring(2, 4), 16) +
							',' + parseInt(string.substring(4, 6), 16)
					}
					return returnString
				}
			}
		},
		created() {
			domModule && domModule.addRule('fontFace', {
				'fontFamily': 'nvIconFont',
				'src': "url('https://at.alicdn.com/t/font_1687851_0za76ygutzv.ttf?t=1637739692416.ttf')"
			})
		},
		mounted() {
			//watch后续监听的config无法改变状态栏颜色、浏览器标题同步设置（sysncTitle）
			if (this.nvConfig.color && !this.nvConfig.model) {
				var obj = {
					frontColor: this.nvConfig.color,
					backgroundColor: this.nvConfig.bgColor || "#ffffff"
				};
				uni.setNavigationBarColor(obj);
			}
			if (this.nvConfig.transparent && this.nvConfig.transparent.initColor && !this.nvConfig.model) {
				var obj = {
					frontColor: this.transparent.initColor,
					backgroundColor: this.nvConfig.bgColor || "#ffffff"
				};
				uni.setNavigationBarColor(obj);
			}
			if (this.nvConfig.transparent && platform == "h5") {
				window.pageYOffset != 0 && this.pageScroll({
					scrollTop: window.pageYOffset
				})
			}
			if (platform == "h5" && !this.nvConfig.model) {
				function setDocTitle(t) {
					document.title = t;
					var i = document.createElement('iframe'); /*i.src = '//m.baidu.com/favicon.ico';*/
					i.style.display = 'none';
					i.onload = function() {
						setTimeout(function() {
							i.remove();
						}, 9)
					};
					document.body.appendChild(i);
				}
				if (this.nvConfig.hasOwnProperty('title')) {
					if (!document.title && !this.sysncTitle) {
						uni.setNavigationBarTitle({
							title: this.title
						})
						setDocTitle(this.title)
					}
					this.title = this.nvConfig.title
					if (this.sysncTitle && this.title) {
						uni.setNavigationBarTitle({
							title: this.title
						})
						setDocTitle(this.title)
					}
				} else if (this.sysncTitle && (document.title != this.title)) {
					uni.setNavigationBarTitle({
						title: this.title
					})
					setDocTitle(this.title)
				}
				if (!document.title || document.title == "pyh-nv" || document.title == "加载中") setTimeout(() => {
					if (getApp().globalData.NAME) {
						uni.setNavigationBarTitle({
							title: getApp().globalData.NAME
						})
						setDocTitle(getApp().globalData.NAME)
					}
				}, 200)
			}

			this.getNvBoxRect();
		},
		onUnload() {
			uni.offWindowResize();
		},
		expose: ['setStyle', 'pageScroll'],
		methods: {
			initConfig(config) {
				this.nvConfig = config
				if (config.windowInfo) this.windowInfo = Object.assign(this.windowInfo, config.windowInfo)
				if (config.hasOwnProperty('show')) this.show = config.show
				if (config.hasOwnProperty('sysncTitle')) this.sysncTitle = config.sysncTitle

				if (config.search && config.search.value && config.search.value != this.inputValue) {
					this.inputValue = config.search.value
					if (config.search.input) this.$emit("nvInput", {
						detail: {
							value: config.search.value
						}
					});
				}
				if (config.transparent) {
					if (config.transparent.reverse) this.transparent.opacity = 1
					if (config.transparent.initColor) {
						var initColor = config.transparent.initColor,
							finishColor = config.color || "#000000";
						if (initColor.indexOf("#") > -1 && initColor.length == 4) {
							initColor = initColor + initColor.charAt(initColor.length - 1) + initColor.charAt(initColor
								.length - 1) + initColor.charAt(initColor.length - 1);
						}
						if (finishColor.indexOf("#") > -1 && finishColor.length == 4) {
							finishColor = finishColor + finishColor.charAt(finishColor.length - 1) + finishColor.charAt(
								finishColor.length - 1) + finishColor.charAt(finishColor.length - 1);
						}
						if (!((initColor == "#000000" || initColor == "#ffffff") && (finishColor == "#000000" ||
								finishColor == "#ffffff"))) {
							console.log("状态栏颜色只支持，#000000或#ffffff");
						}
						this.transparent.initColor = initColor;
						this.transparent.color = initColor;
						this.transparent.finishColor = finishColor;
					}
				}
				if (config.tabArr && config.tabArr) {
					let acIndex = 0;
					config.tabArr.forEach((item, index) => {
						if (item.active) acIndex = index
					})
					this.nvTabAcIndex = acIndex
				}
				if (!config.windowInfo) {
					this.deviceOrientation = uni.getSystemInfoSync().deviceOrientation
					uni.onWindowResize((res) => {
						this.windowInfo.width = res.size.windowWidth;
						this.windowInfo.height = res.size.windowHeight;
						if (this.deviceOrientation != res.deviceOrientation) this.deviceOrientation = res
							.deviceOrientation;
					})
				}
				//旧版兼容处理Start
				//返回键
				let back = {
					hide: Boolean(this.nvConfig.hideback),
					customEvent: Boolean(this.nvConfig.backpress),
					iconForce: Boolean(this.nvConfig.closeCheckback)
				}
				if (this.nvConfig.back) {
					if (!this.nvConfig.back.hasOwnProperty("hide")) this.nvConfig.back.hide = back.hide
					if (!this.nvConfig.back.hasOwnProperty("customEvent")) this.nvConfig.back.customEvent = back
						.customEvent
					if (!this.nvConfig.back.hasOwnProperty("iconForce")) this.nvConfig.back.iconForce = back.iconForce
				} else {
					this.nvConfig.back = back
				}
				//旧版兼容处理end
			},
			setStyle(object) {
				//设置导航栏样式
				var style = "";
				for (var i in object) {
					style += (i + ":" + object[i] + ";")
				}
				this.style = style;
			},
			nvSlotTap(e) {
				//slot点击
				this.$emit("nvSlotTap");
			},
			nvLogoTap(e) {
				//logo点击
				var url = this.nvConfig.logo.url;
				this.$emit("nvLogoTap");
				url && uni.reLaunch({
					url: url
				});
			},
			nvAddressTap(e) {
				//地址图标点击
				this.$emit("nvAddressTap");
			},
			nvInputTap(e) {
				//搜索按钮点击
				this.$emit("nvInputTap", this.nvConfig.search);
				this.$emit("searchTap", this.nvConfig.search); //此行是为了旧代码兼容
				if (this.nvConfig.search.url || this.nvConfig.search.linkType) {
					this.linkTo({
						currentTarget: {
							dataset: {
								url: this.nvConfig.search.url,
								type: this.nvConfig.search.linkType || ''
							}
						}
					});
				}
			},
			inputChange(e) {
				//输入框输入
				this.inputValue = e.detail.value;
				if (this.nvConfig.type == "search" && this.nvConfig.search.input) this.$emit("nvInput", e)
			},
			inputClear(e) {
				//输入框清除
				this.inputValue = "";
				if (this.nvConfig.type == "search" && this.nvConfig.search.input) this.$emit("nvInput", e);
			},
			formSubmit(e) {
				//输入框提交
				var e = {
					detail: {
						value: this.inputValue
					}
				};
				this.$emit("nvFormSubmit", e)
			},
			nvBtnTap(e) {
				//右按键点击
				var e = {
					type: e.currentTarget.dataset.type,
					index: parseInt(e.currentTarget.dataset.index)
				};
				this.$emit("nvBtnTap", e);
			},
			nvTabTap(e) {
				//中间tab按键点击
				let index = parseInt(e.currentTarget.dataset.index)
				this.nvTabAcIndex = index
				this.$emit("nvTabTap", {
					index
				});
			},
			toTopTap(e) {
				//回到顶部
				this.showToTop = false
				uni.pageScrollTo({
					scrollTop: 0,
					duration: this.nvConfig.toTop.duration || (this.nvConfig.toTop.duration === 0 ? 0 : 300)
				});
				this.$emit("nvToTop");
			},
			pageScroll(e = {
				scrollTop: 0
			}) {
				//页面滚动
				if (!this.nvConfig.transparent) return;
				var anchor = this.navigatorHeight;
				if (this.nvConfig.transparent.anchor) anchor = this.nvConfig.transparent.anchor;
				var op = parseFloat(parseFloat(e.scrollTop / anchor).toFixed(1));
				if (this.nvConfig.transparent.reverse) op = parseFloat(parseFloat(1 - op).toFixed(1));
				let judgment = this.nvConfig.transparent.reverse ? (op < .5) : (op >= .5)
				this.transparent.opacity = e.scrollTop <= anchor ? op : (this.nvConfig.transparent.reverse ? 0 : 1);
				if (this.nvConfig.transparent.initColor) {
					this.transparent.color = (judgment ? this.transparent.finishColor : this.transparent.initColor);
					uni.setNavigationBarColor({
						frontColor: this.transparent.color,
						backgroundColor: this.nvConfig.bgColor || "#ffffff"
					});
				}
				if (this.nvConfig.toTop) {
					if (this.showToTop && e.scrollTop < this.safeArea) {
						this.showToTop = false;
					}
					if (!this.showToTop && e.scrollTop >= this.safeArea) {
						this.showToTop = true;
					}
				}
			},
			nvBackTap() {
				//返回键点击
				if (this.nvConfig.back && this.nvConfig.back.customEvent) {
					this.$emit("nvBackTap", this.nvConfig.back);
					this.$emit("backTap", this.nvConfig.back); //此行是为了旧代码兼容
				} else {
					this.linkTo({
						currentTarget: {
							dataset: {
								type: 'navigateBack'
							}
						}
					});
				}
			},
			linkTo(e) {
				//跳转
				var url = e.currentTarget.dataset.url,
					type = e.currentTarget.dataset.type,
					isInput = e.currentTarget.dataset.isInput;
				if (isInput && this.nvConfig.type == "search" && this.nvConfig.search && this.nvConfig.search.input) {
					return;
				}
				if (this.$nv) {
					this.$nv(url, type);
				} else {
					if (!url && !type) return;
					if (url == "/" || url == ".") return;
					if (typeof(url) == "object") {
						uni.navigateTo(url);
						return
					}
					if (typeof(url) == "number") {
						if (this.currentPages == 1) {
							uni.reLaunch({
								url: this.home
							})
						} else {
							uni.navigateBack({
								delta: Math.abs(url || 1)
							})
						}
						return;
					}
					if (type) {
						if (type.indexOf("ab") > -1) {
							uni.switchTab({
								url: url
							});
						} else if (type == '-1' || type.indexOf("redirect") > -1 || type.indexOf("rep") > -1) {
							uni.redirectTo({
								url: url
							});
						} else if (type.indexOf("aunch") > -1) {
							uni.reLaunch({
								url: url
							});
						} else if (type.indexOf("ack") > -1) {
							if (this.currentPages == 1) {
								uni.reLaunch({
									url: this.home
								});
							} else {
								uni.navigateBack();
							}
						} else {
							uni.navigateTo({
								url: url
							});
						}
					} else {
						if (url.indexOf("/") == 0 || url.indexOf(".") == 0) {
							uni.navigateTo({
								url: url
							});
						} else {
							if (url.indexOf("?") > 0) {
								url += "&platform=" + platform;
							} else {
								url += "?platform=" + platform;
							};
							if (platform == "h5") {
								top.location.href = url;
							} else if (platform == "app") {
								plus.runtime.openUrl(url);
							} else {
								uni.navigateTo({
									url: "/pages/other/webview/webview?src=" + url.replace("?", "&")
								});
							}
						}
					}
				}
			},
			async getNvBoxRect() {
				//获取导航栏节点信息
				let that = this,
					view = {
						top: 0,
						width: this.windowInfo.width
					};

				let position = this.nvConfig.position || {
					type: 'fixed'
				};
				if (typeof position == "string") position = {
					type: position
				}
				if (!position.type) position.type = 'fixed'

				if (this.nvConfig.model) {
					if (position.hasOwnProperty("top")) {
						this.nvBoxRect = Object.assign(view, {
							wait: false,
							top: position.top
						})
						return
					}
				} else {
					this.nvBoxRect = Object.assign(view, {
						wait: false,
						top: position.top || 0
					})
					return
				}

				function getNvBoxRect() {
					return new Promise((resolve, reject) => {
						try {
							if (domModule) {
								domModule.getComponentRect(that.$refs.pyhNvBox, data => {
									resolve(data.size)
								})
							} else {
								uni.createSelectorQuery().in(that).select(".pyh-nv-box").boundingClientRect(
									data => {
										resolve(data)
									}).exec();
							}
						} catch (e) {
							reject(view)
						}
					})
				}
				view = await getNvBoxRect()
				this.nvBoxRect = view
			}
		}
	}
</script>
<style lang="scss" scoped>
	/* #ifndef APP-NVUE */
	@font-face {
		font-family: nvIconFont;
		src: url('https://at.alicdn.com/t/font_1687851_0za76ygutzv.ttf?t=1637739692416.ttf') format('truetype');
	}

	/* #endif */

	.nvIconFont {
		font-family: nvIconFont;
		font-size: 30rpx;
		font-style: normal;
	}

	//主色，可以设置uni.scss的$mainColor
	//或
	//uni.scss未定义或定义为null,修改下方$mainColor的默认值
	$mainColor: #2b9939 !default;
	$textColor: #000000 !default;
	$fontSize: 14px !default;

	.pyh-nv-box {
		position: relative;
		font-size: $fontSize;
	}

	.bgImage {
		position: absolute;
		left: 0;
		top: 0;
	}

	.nvBox {
		background-color: #ffffff;
		z-index: 991;
		color: #000000;
	}

	.noModel {
		z-index: 992;
	}

	.nvHeight {
		height: 88rpx;
	}

	.nvFixed {
		position: absolute;
		bottom: 0;
		height: 88rpx;
		left: 0;
		z-index: 992;
		padding: 0 20rpx;
		box-sizing: border-box;
	}

	.nvContent {
		flex: 1;
		height: 88rpx;
		align-items: center;
	}

	.nvInput {
		font-size: 14px;
		flex: 1;
		height: 100%;
	}

	.searchIcon {
		line-height: 1;
		width: 18px;
		margin-right: 20rpx;
		/* #ifdef MP */
		height: 18px;
		/* #endif */
	}

	.nvTitle {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		text-align: center;
		height: 88rpx;
		line-height: 88rpx;
		align-items: center;
		justify-content: center;
		padding: 0 80rpx;
		font-size: 32rpx;
		font-weight: bold;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.androidwx {
		text-align: left;
		padding-left: 80rpx;
		justify-content: flex-start !important;
	}

	.nvback {
		font-size: 54rpx;
		position: absolute;
		left: 6rpx;
		padding-left: 8rpx;
		bottom: 18rpx;
		flex-direction: row;
		align-items: center;
		z-index: 992;
		width: 52rpx;
		height: 52rpx;
	}

	.nvhome {
		border-radius: 26rpx;
		font-size: 36rpx;
		padding: 0;
		left: 20rpx;
		text-align: center;
		justify-content: center;
	}

	.nvbackImg {
		padding: 0;
		left: 20rpx;
	}

	.nvHadBack {
		padding-left: 60rpx;
	}

	//logo
	.nvLogoBox {
		align-items: center;
		justify-content: center;
		position: absolute;
		left: 0;
		padding-right: 0rpx !important;
		left: 0;
		right: 0;
	}

	.nvLogo {
		width: 60rpx;
	}

	//非搜索的地址框
	.nvAddress {
		border-radius: 44rpx;
		justify-content: center;
		align-items: center;
		padding: 0 16rpx 0 10rpx;
		font-size: 28rpx;
		line-height: 30rpx;
		margin-right: 20rpx;
		height: 60rpx;
		width: 144rpx;
		position: absolute;
		left: 20rpx;
		padding-left: 8rpx;
		bottom: 14rpx;
		flex-direction: row;
		align-items: center;
		z-index: 992;
	}

	.nvAddressIcon {
		width: 30rpx;
		margin-right: 4rpx;
		font-size: 34rpx;
	}

	.nvAddressTextBox {
		width: 84rpx;
		overflow: hidden;
	}

	.nvAddressText {
		flex: 1;
		font-size: 28rpx;
		line-height: 30rpx;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	//含搜索框
	.nvSearchLogo {
		margin-right: 20rpx;
	}

	.nvSearchAddress {
		position: relative;
		left: 0;
		top: 0;
		bottom: 0;
	}

	.searchPlac {
		color: #bbbbbb;
	}

	.nvSForm {
		flex: 1;
		justify-content: space-between;
		align-items: center;
		height: 60rpx;
	}

	.nvSBox {
		flex: 1;
		border-radius: 44rpx;
		background-color: #f8f8f8;
		height: 100%;
		padding: 0 20rpx;
		align-items: center;
	}

	.nvSBtn {
		color: #ffffff;
		border-radius: 44rpx;
		height: 100%;
		line-height: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 120rpx;
		padding: 0;
		font-size: 28rpx;
		margin-left: 20rpx;
		background: $mainColor;
	}

	.nvSClose {
		/* #ifdef MP */
		height: 15px;
		/* #endif */
	}

	//右边按钮组
	.nvBtnGroup {
		position: absolute;
		right: 20rpx;
		top: 0;
		height: 88rpx;
		align-items: center;
		justify-content: center;
		z-index: 993;
		font-size: 28rpx;
		color: #000000;
	}

	.nvBtn {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		text-align: center;
	}

	.nvBtn:first-child {
		margin-left: 0;
	}

	.nvBtn,
	.nvBtnImg {
		padding: 0;
		margin-left: 20rpx;
		background: transparent;
		border: 0;
		color: #000000;
		z-index: 3;
		font-size: 28rpx;
		position: relative;
	}

	.nvBtnImg {
		width: 48rpx;
		margin-left: 0;
	}

	.nvBtnGroup-static {
		position: relative;
		padding-left: 20rpx;
		right: 0;
	}

	.nvBadge {
		width: 26rpx;
		height: 26rpx;
		text-align: center;
		line-height: 26rpx;
		position: absolute;
		top: -8rpx;
		right: -8rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		overflow: hidden;
		background-color: red;
		color: #ffffff;
		font-size: 16rpx;
		z-index: 4;
	}

	//tab栏
	.nvTabBox {
		position: absolute !important;
	}

	.nvTab {
		flex-direction: column !important;
		align-items: center;
		justify-content: flex-end;
		margin: 0 10rpx;
		position: relative;
	}

	.nTTxt,
	.nTTxt-ac {
		padding: 0 10rpx;
		line-height: 88rpx;
	}

	.nTLine,
	.nTLine-ac {
		height: 4rpx;
		border-radius: 2rpx;
		background: transparent;
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
	}

	.nTTxt-ac {
		color: $mainColor;
	}

	.nTLine-ac {
		background: $mainColor;
	}

	.nvTabHide {
		width: 0;
		height: 0;
		margin: 0;
		overflow: hidden;
	}

	//回到顶部
	.nvToTop {
		position: fixed;
		bottom: 200rpx;
		right: 40rpx;
		z-index: 992;
		background: #ffffff;
		border-radius: 50%;
		width: 80rpx;
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;
		font-size: 46rpx;
		box-shadow: 2rpx 2rpx 2rpx 2rpx #ddd;
	}

	//小程序胶囊留位
	/* #ifdef MP-WEIXIN */
	.noModel .nvSBtn,
	.noModel .nvBtnGroup {
		display: none;
	}

	/* #endif */

	/* #ifdef APP-NVUE */
	.nvContent,
	.nvback,
	.nvLogoBox,
	.nvSearchBox,
	.nvAddress,
	.nvSForm,
	.nvSBox,
	.nvBtnGroup,
	.nvTabBox,
	.nvTab {
		flex-direction: row;
	}

	.nvTitle,
	.nvAddress,
	.nvAddressText,
	.nvBadge {
		lines: 1;
	}

	.nvBadge {
		right: 0;
		top: 0;
	}

	.nvBox,
	.nvHeight,
	.nvFixed,
	.nvTitle,
	.nvLogoBox,
	.nvSearchBox,
	.nTLine,
	.nTLine-ac {
		flex: 1;
	}

	.nvTab {
		flex-direction: column !important;
		align-items: center;
		justify-content: flex-end;
		line-height: 80rpx;
		margin: 0 10rpx;
	}

	/* #endif */

	/* #ifndef APP-NVUE */
	.nvContent,
	.nvback,
	.nvLogoBox,
	.nvSearchBox,
	.nvAddress,
	.nvSForm,
	.nvSBox,
	.nvBtnGroup,
	.nvTabBox,
	.nvTab {
		display: flex;
		flex-direction: row;
	}

	.nvTitle,
	.nvAddress,
	.nvAddressText,
	.nvBadge {
		white-space: nowrap;
	}

	.nvBox,
	.nvBox *,
	.nvContent,
	.nvTitle,
	.nvFixed {
		box-sizing: border-box;
	}

	.nvLogo,
	.nvAddressIcon,
	.nvBtnImg {
		height: auto;
	}

	.nvBtnImg {
		max-width: 100%;
	}

	.pyh-nv-box,
	.nvBox,
	.nvHeight,
	.nvFixed,
	.nvTitle,
	.nvLogoBox,
	.nvSearchBox,
	.nTLine,
	.nTLine-ac {
		width: 100%;
	}

	/* #endif */

	//组件内容位置
	.componentsFlex {
		height: 70rpx;
	}

	.nvContentTop {
		align-items: flex-start;
	}

	.nvContentBottom {
		align-items: flex-end;
	}

	.nvSBoxFlex {
		height: 70rpx;
		line-height: 70rpx;
	}
</style>
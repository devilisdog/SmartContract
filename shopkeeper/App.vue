<script>
	import {useCounterStore} from '@/stores/counter'
	import api from "@/common/vmeitime-http/index/index.js"
	import common from "@/common/common.js"
	export default {
		setup: function() {
			
		},
		onLaunch: function() {
		},
		onShow: function() {
	
		},
		onHide: function() {
			// uni.closeSocket();
		},
	}
</script>

<style>
	/* 去除滚动条 */
	::-webkit-scrollbar{
	      display: none;
	}
	/*每个页面公共css */
	@font-face {
	  font-family: "阿里巴巴普惠体 2.0 45 Light";font-weight: 400;src: url("//at.alicdn.com/wf/webfont/zQcgYHrbojfP/Oo8KA10eqs8T.woff2") format("woff2"),
	  url("//at.alicdn.com/wf/webfont/zQcgYHrbojfP/cu2HarQVEfgD.woff") format("woff");
	  font-display: swap;
	}
	text{
		font-size: 28rpx;
		font-family: "阿里巴巴普惠体 2.0 45 Light";font-weight: 400;src: url("//at.alicdn.com/wf/webfont/zQcgYHrbojfP/Oo8KA10eqs8T.woff2") format("woff2"),
		url("//at.alicdn.com/wf/webfont/zQcgYHrbojfP/cu2HarQVEfgD.woff") format("woff");
		font-display: swap;
	}
</style>

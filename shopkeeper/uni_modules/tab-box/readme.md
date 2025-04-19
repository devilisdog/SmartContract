## tab切页简单样式 
> 代码块： `tab-box`

用于展示tab个性切页 。

### 安装方式

本组件符合[easycom](https://uniapp.dcloud.io/collocation/pages?id=easycom)规范，`HBuilderX 2.5.5`起，只需将本组件导入项目，在页面`template`中即可直接使用，无需在页面中`import`和注册`components`。

### 基本用法

在 ``template`` 中使用组件

```html
<template>
	<view class="content">
		<tab-box :tab_list="tab_list" :current_tab="current" @onTabClick="on_tab_click"></tab-box>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				tab_list: [
					'全部订单',
					'待审核'
				],
				current: 0
			}
		},
		onLoad() {

		},
		methods: {
			on_tab_click: function(id) {
				this.current = id;
			},
		}
	}
</script>
```

### tab-box Props

|属性名	    |类型		|默认值	|说明				|
|:-:	    |:-:		|:-:	|:-:				|
|tab_list	|Array		|[]	    |切页tab文字数组		|
|current_tab|Number	    |0	    |当前tab的index		|
|onTabClick	|Function	|-		|点击tab时回调		|

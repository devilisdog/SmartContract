<template>
	<view class='box'>
		<view class='wave -one'></view>
		<view class='wave -two'></view>
		<view class='wave -three'></view>
	</view>
</template>

<script>
</script>

<style>
	html, body {
	  height: 100%;
	}
	
	html {
	  background: #eee;
	}
	
	body {
	  display: flex;
	  justify-content: center;
	  align-items: center;
	}
	
	.box {
	  width: 100%;
	  height: 300px;
	  border-radius: 5px;
	  box-shadow: 0 2px 30px rgba(black, .2);
	  background: lighten(#f0f4c3, 10%);
	  position: relative;
	  overflow: hidden;
	  transform: translate3d(0, 0, 0);
	}
	
	.wave {
	  opacity: .4;
	  position: absolute;
	  top: 3%;
	  left: 50%;
	  background-image: linear-gradient(60deg, #fa709a 0%, #f04b49 115%);
	  width: 700px;
	  height: 520px;
	  margin-left: -250px;
	  margin-top: -300px;
	  transform-origin: 50% 49%;
	  border-radius: 43%;
	  animation: drift 3000ms infinite linear;
	}
	
	.wave.-three {
	  animation: drift 5000ms infinite linear;
	}
	
	.wave.-two {
	  animation: drift 7000ms infinite linear;
	  opacity: .1;
	  background: yellow;
	}
	
	.box:after {
	  content: '';
	  display: block;
	  left: 0;
	  top: 0;
	  width: 100%;
	  height: 100%;
	  background: linear-gradient(to bottom, rgba(#e8a, 1), rgba(#def, 0) 80%, rgba(white, .5));
	  z-index: 11;
	  transform: translate3d(0, 0, 0);
	}
	@keyframes drift {
	  from { transform: rotate(0deg); }
	  from { transform: rotate(360deg); }
	}
</style>

<template>
	<view class="header">
		<view class="inner-header flex"></view>
		<view>
			<svg class="waves" viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
				<defs>
					<path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
				</defs>
				<g class="parallax">
					<use xlink:href="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7" />
					<use xlink:href="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
					<use xlink:href="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
					<use xlink:href="#gentle-wave" x="48" y="7" fill="#fff" />
				</g>
			</svg>
		</view>
	</view>
</template>

<script>
</script>

<style>
	@import url(//fonts.googleapis.com/css?family=Lato:300:400);
	
	body {
	  margin:0;
	}

	.header {
	  position:relative;
	  text-align:center;
	  /* background: linear-gradient(60deg, rgba(84,58,183,1) 0%, rgba(0,172,193,1) 100%); */
	  background-image: linear-gradient(60deg, #fa709a 0%, #f04b49 115%);
	  color:white;
	}
	
	.inner-header {
	  height:22vh;
	  width:100%;
	  margin: 0;
	  padding: 0;
	}
	
	.flex { /*Flexbox for containers*/
	  display: flex;
	  justify-content: center;
	  align-items: center;
	  text-align: center;
	}
	
	.waves {
	  position:relative;
	  width: 100%;
	  height:15vh;
	  margin-bottom:-7px; /*Fix for safari gap*/
	  min-height:100px;
	  max-height:150px;
	}
	
	/* Animation */
	
	.parallax > use {
	  animation: move-forever 25s cubic-bezier(.55,.5,.45,.5)     infinite;
	}
	.parallax > use:nth-child(1) {
	  animation-delay: -2s;
	  animation-duration: 7s;
	}
	.parallax > use:nth-child(2) {
	  animation-delay: -3s;
	  animation-duration: 10s;
	}
	.parallax > use:nth-child(3) {
	  animation-delay: -4s;
	  animation-duration: 13s;
	}
	.parallax > use:nth-child(4) {
	  animation-delay: -5s;
	  animation-duration: 20s;
	}
	@keyframes move-forever {
	  0% {
	   transform: translate3d(-90px,0,0);
	  }
	  100% { 
	    transform: translate3d(85px,0,0);
	  }
	}
	/*Shrinking for mobile*/
	@media (max-width: 768px) {
	  .waves {
	    height:40px;
	    min-height:40px;
	  }
	}
</style>
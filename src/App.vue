<template>
	<div id="app">
		<carousel class="carousel" :autoplay="true" :per-page="1" :mouse-drag="false" :loop="true" :center-mode='true' :pagination-enabled="false" :autoplay-timeout="8000" :speed="1000" v-if="!showError">
			<slide class="slide" v-for="(media, index) in fetch" :key="media.id" :class="`slide--${index}`">
				<img class="image" :src="getImageUrl(media.baseUrl)" :alt="media.filename">
			</slide>
		</carousel>
		<div class="error" v-if="showError">
			<h1>Whoops...</h1>
			<p>Somethings went wrong</p>
			<p>please reconnect your remmy</p>
		</div>
	</div>
</template>

<script>
	import axios from 'axios';
	import {
		Carousel,
		Slide
	} from 'vue-carousel';

	export default {
		name: 'App',
		data() {
			return {
				fetch: [],
				showError: false,
			}
		},
		components: {
			Carousel,
			Slide
		},
		methods: {
			getImages() {
				axios.get('/images')
					.then((response) => {
						this.showError = false;
						this.fetch = response.data.data
					})
					.catch(function (error) {
						this.showError = true;
						console.log(error);
					})
			},
			getImageUrl(url){
				return `${url}=w1024-h1024`;
			}
		},
		mounted() {
			setInterval(() => {
				this.getImages();
				console.log('fetching new data')
			}, 120000);

		},
		created(){
			this.getImages();
			console.log('created');
		}
	}
</script>

<style>
	body {
		background-color: black;
		color: white;
		height: 100vh;
		overflow: hidden;
		font-family: 'Alata', sans-serif;
	}

	#app {
		width: 100vw;
		height: 100vh;
	}
	.carousel{
		height: 100vh;
		width: 100%;
	}
	.VueCarousel-wrapper{
		height: 100%;
	}
	.VueCarousel-inner{
		height: 100% !important;
	}

	.slide {
		/*background-color: green;*/
		width: 100%;
		height: 100%;

		display: flex;
		align-items: center;
		justify-content: center;
	}
	.image{
		max-width: 100%;
	}
	.error{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100%;
		width: 100%;
	}
	h1{
		font-size: 50px;
		margin: 0;
		padding: 0;
		padding-bottom: 20px;
	}
	p{
		margin: 0;
		padding: 0;
		color: #888888;
	}
</style>
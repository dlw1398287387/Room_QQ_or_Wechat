<template>
  <div id="app">
  	<!--<keep-alive>-->
    	<!--<router-view v-if="$route.meta.keepAlive"></router-view>-->
	  <!--</keep-alive>-->
	  <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  mounted(){
		window.addEventListener('beforeunload', e => {
//			localStorage.clear();
//			console.log(e)
//			console.log("hahah")
//			this.$ls.remove("userInfos")
		})
  },
 
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
  /*margin-top: 60px;*/
}
</style>

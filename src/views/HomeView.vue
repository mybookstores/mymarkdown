<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <button @click="gopage1('/test')">el-button</button>
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'HomeView',
  components: {
    HelloWorld
  },
  data(){
    return{
      
    }
    
  },
  setup(){

  },
  methods:{
    gopage1(url)
    {
      
      this.$router.push(url)
    }
  }
}
</script>

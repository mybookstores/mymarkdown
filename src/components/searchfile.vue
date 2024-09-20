<template>
    <div>
      <div class="search" v-if="!searchactive">
        
          <span>{{ title }}</span>
          <span @click="setsearchactive(true)">
            <img src="../assets/icon/search.png" class="img">
          </span>
        
      </div>
      <div class="search" v-if="searchactive">
        
        <input type="text" autofocus="true"  v-model="value1"  id="input" placeholder="请搜索内容" @blur="setvalue"/>
        <span @click="setsearchactive(false)">
          <img src="../assets/icon/close.png" class="img">
        </span>
        
      </div>
      <div class="searchlist" v-if="searchactive">
          <li  class="list" v-for="(item, index) in searchResult" :key="index">
            <span>
                <img class="img" src="../assets/icon/file.png">
            </span>
            <span class="item" @click="goSearch1(item.id)">{{ item.title }}</span>
         </li>
        </div>
    </div>
  </template>
  
<script>
import { onMounted, onUnmounted,reactive,getCurrentInstance,ref,refs,nextTick,onUpdated  } from 'vue';
import Vue from 'vue'



export default {
  name: 'searchfile',
  props: {
    title: String,
    temp:{
      required:false,
      type: String,
      default: 'table'
    },
    initFiles: Array,
    goSearch: Function
  },

  data(){
    return{
      searchactive:false,
      value1:"",
      searchResult:[]
    }
    
  },
  updated(){
    
    if(this.searchactive)
      {
        document.getElementById("input").focus();
      }
  },
  mounted(){
    
    document.addEventListener("keydown", this.keyboardDownBack, true);

  },
  unmounted(){
    document.removeEventListener("keydown", this.keyboardDownBack, true);
  },
  methods:{
    keyboardDownBack(evt){

      if (evt.key === "Enter") {
        
        this.searchResult=this.initFiles.filter(item => {
          return (this.value1 &&( item.title.includes(this.value1) ||item.body.includes(this.value1) ));
        });
        
      }
      else if(evt.keyCode === 27){
          this.searchactive=false;
          this.value1="";
      }
    },
     SearchFile(title,onSearch){
        console.log("aaa")
    },
    setsearchactive(choice)
    {
      this.searchactive=choice
      if(choice==false)
      {
        this.value1=""
        
      }
    },
    setvalue(e)
    {
      console.log(e.target.value)
      console.log("bbbbbbbbb")
      console.log(this.value1)
      this.searchResult=this.initFiles.filter(item => {
        return (this.value1 &&( item.title.includes(this.value1) ||item.body.includes(this.value1) ));
      });
      
      console.log(this.searchResult)

    },
    goSearch1(id)
    {
      this.searchactive=false;
      this.goSearch(id);
      this.searchResult=[];
      this.value1="";
    }
  }
}
</script>


<style scoped lang="scss">



.search{
    
    width: 236px;
    height: 40px;
    /* height: 50vh; 设置高度无效 */
    background-color: #f5f3f2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #fff;
    
}
.searchlist{
  border-top: 1px solid #fff;
    position: fixed;
    width: 236px;
    height: calc(100vh - 300px);
    top:40px;
    left: 0;
    background-color: #faf8f7;
    z-index: 10;
    border-radius: 0 0 10px 10px;
    overflow-y: hidden;
    overflow-x: hidden;
    &:hover{
      overflow-y: overlay;
    }
}
.list{
    width: 100%;
    position: relative;
    padding-left: 3px;
    display: flex;
    align-items: center;
    &:hover{
      background-color: #fff;
    }
    
}
span{
  color: #302f2f;
  padding: 8px 10px;
  font: normal 12px;
  align-items: center;
  justify-content: center;
}
input{
  border:none;
  border-radius: 4px;
  width:180px;
  height:26px;
  margin-left: 10px;
  &:focus {
		border: 1px solid #4183c4; 
    outline: none; 
    
	}
  padding-left:5px;
  &::-webkit-input-placeholder{
    font-size: 14px;
  }
}
.img{
  padding-top: 3px;
  width: 20px;
  height: 20px;
}
</style>


  
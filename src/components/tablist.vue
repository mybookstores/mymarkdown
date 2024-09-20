<template>
    <div class="tablist" >
        <li  @mouseenter="handleMouseEnter(item)"  @mouseleave="handleMouseLeave" :class="['navlink',{active:item.id==activeItem}]" v-for="(item, index) in openFiles"  :key="index">
            
            <a @click="clickItem(item.id)" class="item">{{ item.title }}</a>
            <span @click="closeItem(item.id)" v-if="item.isSaved || showSaved(item.id)"><img src="../assets/icon/close.png" class="img"></span>
            <span @click="closeItem(item.id)" v-else><img src="../assets/icon/point.png" class="img"></span>
       
           </li>
    </div>
  </template>
  
<script>
import { reactive,ref } from 'vue';



export default {
  name: 'tablist',
  props: {
    title: String,
    icon: String,
    color: String,
    openFiles: Array,
    activeItem: String,
    clickItem: Function,
    closeItem: Function
  },

  data(){
    return{
        
        showSaved1:""

    }
    
  },
  updated(){
    
    
  },
  directives: {
        
    },
  methods:{
        
        handleMouseEnter(item) {
          // 处理鼠标移入事件的逻辑
          this.showSaved1=item.id;

        },
        handleMouseLeave() {
          this.showSaved1="";

      },
      showSaved(id){
          if(id==this.showSaved1)
          {
            return true;
          }
          else
          {
            return false;

          }
      }
      
  }
}
</script>


<style scoped lang="scss">
$type: haveborder;

.tablist{
    position: fixed;
    width: calc(100vw - 230px);
    display: flex;
    align-items: center;
    list-style: none;  //去除列表样式
    
    white-space: nowrap;
    border-top: 0.5px solid rgba(229, 229, 229,0.5);
    border-bottom: 0.5px solid rgba(229, 229, 229,0.5);
    background-color: #f8f8f8;
    overflow-x: hidden;
    overflow-y: hidden;
    &:hover{
      overflow-x: overlay;
    }
    

}

.navlink{
    background-color: #f8f8f8;
    padding: 7px 15px 6px 17px;
    font-size: 14px;
    // opacity:95%;
    display: flex;
    align-items: center;
    border-right: 0.5px solid rgba(229, 229, 229,0.5);
    
    &:hover{
      background-color: #fff;

    }
    
}
.active{
    padding: 6.5px 15px 6px 17px;
    box-sizing: border-box;
    border-top: 1px solid #005fb8;
    
    
    background-color: #fff;
    $type:1;
    // @if $type == haveborder {
    //   color: blue;
    // }
}

.img{
  margin-top: 3px;
  margin-left: 10px;
  width: 14px;
  height: 14px;
  border-radius: 5px;
  padding: 2px;
  &:hover{
    background-color: #e9e9e9;
  }
}

</style>


  
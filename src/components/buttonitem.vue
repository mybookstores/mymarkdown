<template>
    <div class="mybutton">
        <button class="button">
            <img :src="icon" class="img">
            <span>{{title}}</span>
        </button>
    </div>
  </template>
  
<script>
import { reactive,ref } from 'vue';



export default {
  name: 'buttonitem',
  props: {
    title: String,
    icon: String,
    color: String
  },

  data(){
    return{
        

    }
    
  },
  updated(){
    
    if(this.editItem)
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

            if (evt.key === "Enter" && this.editItem) {

              if(this.value1)
              {
                this.saveFile(this.editItem,this.value1);
              }
                
                
                document.getElementById("input").blur();
                this.editItem=false;
                this.value1="";

            }
            else if(evt.keyCode === 27){
                this.editItem=false;
                this.value1="";

            }

        }
       
  
 
  }
}
</script>


<style scoped lang="scss">
.mybutton{
    
    width: 50%;
    
}
.button{
    border: none;
    width: 100%;
    height: 34px;
    display: flex;
    font-size: 14px;
    align-items: center;
    
    justify-content: center;
    background-color: v-bind(color);
}

span{
  color: #302f2f;
  font: normal 14px;
  padding: 0px 7px;
  height: 20px;
  display: flex;
  align-items: center;
  
}

.img{

  width: 20px;
  height: 20px;
  margin: 0px 3px  2px 3px;

  
}

</style>


  
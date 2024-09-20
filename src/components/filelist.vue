<template>
    <div class="file"  id="mylist">
        
        <li  :class="['list',{active:item.id==activeItem}]" v-for="(item, index) in initFiles" :key="index">
            <div v-if="item.id!==editItem"  class="list1" >
                <span>
                    <img class="img" src="../assets/icon/file.png">
                </span>
                <span id="mytitle" class="item" @click="editFile(item.id)">{{ item.title }}</span>
                <span @click="setEditItem(item.id,index)">
                    <img class="img" src="../assets/icon/edit.png">
                </span>
                <span @click="deleteFile(item.id)">
                    <img class="img" src="../assets/icon/delete.png">
                </span>
            </div>
            <div v-else class="list1">
                <input  type="text" autofocus  v-model="value1"  id="input" placeholder="重命名" @blur="setvalue"/>
                <span @click="closeEditItem">
                    <img class="img1" src="../assets/icon/close.png">
                </span>
                
            </div>
        </li>

    </div>
  </template>
  
<script>
import { onMounted, onUnmounted,reactive,getCurrentInstance,ref } from 'vue';

import { ElSegmented } from 'element-plus';
import fileHelper from '@/utils/helper'

export default {
  name: 'filelist',
  props: {
    title: String,
    initFiles: Array,
    activeItem: String,
    deleteFile: Function,
    editItem: String,
    openFile: Function,
    clickItem: Function,
    text: String,
    flag: Boolean,
    savePath: String,
    path: String,
    saveInfoToStore: Function
  },

  data(){
    return{
        // editItem:false,
        value1:""
    }
    
  },
  updated(){
    
    if(this.editItem)
      {
        document.getElementById("input").focus();
        // if(!document.getElementById("input").selected)
        // {
        //   document.getElementById("input").select();
        // }
      }
  },
  
  mounted(){
    
    // fileHelper.readFile(path.join(savePath,'test.md')).then((data)=>{
    //     console.log(data)
    // })
    // fileHelper.writeFile('E:/myvueprojects/myproj3/mydemo3/src/utils/test1.md',"## sjskakjkjiw").then(() => {
    //     console.log("写入成功")
    // })

    document.addEventListener("contextmenu", this.contextMenuHandle);
    
    document.addEventListener("keydown", this.keyboardDownBack, true);

  },
  unmounted(){

    document.removeEventListener("contextmenu", this.contextMenuHandle);

    document.removeEventListener("keydown", this.keyboardDownBack, true);
  },
  methods:{
        contextMenuHandle(evt)
        {

            evt.preventDefault();//好像有没有都不影响
            if(document.getElementById("mylist").contains(evt.target))
            {
              
              window.ipcRenderer.send("show-context-menu");
            }
            
          
            window.ipcRenderer.on("context-menu-command1", (evt, command) => {
              // todo
              if(this.activeItem)
              {
                let index;
                  for(let i in this.initFiles)
                  {
                      
                      if(this.initFiles[i].id==this.activeItem)
                      {
                        index=i;
                      }
                  }
                this.setEditItem(this.activeItem,index)
              }
              
            })
            window.ipcRenderer.on("context-menu-command2", (evt, command) => {
              // todo
              if(this.activeItem)
              {
                
                this.deleteFile(this.activeItem)
              }
            })

        },
        keyboardDownBack(evt){

            if (evt.key === "Enter" && this.editItem) {

              // if(this.value1)
              // {
              //   this.saveFile(this.editItem,this.value1);
              // }
                
                



                document.getElementById("input").blur();
                // this.editItem=false;
                // this.changeEditItem(false);
                // this.value1="";

            }
            else if(evt.keyCode === 27){
                // this.editItem=false;
                this.changeEditItem(false);
                this.value1="";

            }

        },
       editFile(id)
       {
            console.log(id);
            // this.activeItem1=id;
            this.$emit("editFile1",id);

       },
       setEditItem(id,index)
       {
            // this.editItem=id;
            this.changeEditItem(id);
            this.value1=this.initFiles[index].title;
            
       },
       setvalue(e)
       {
            let oldTitle="";
            if(e.target.value)
            {
              console.log(e.target.value)
              for(let i in this.initFiles)
              {
                  
                  if(this.initFiles[i].title==e.target.value)
                  {
                    

                    window.ipcRenderer.invoke('dialog:showMsg1');
                    if(this.flag)
                    {
                      for(let j in this.initFiles)
                      {
                          
                          if(this.initFiles[j].id==this.editItem)
                          {
                              
                              this.initFiles.splice(j,1);
                          }
                      }
                      this.$emit("changeFlag1",false);
                    }
                    
                    this.closeEditItem();
                    return;

                    
                  }
              }

              for(let i in this.initFiles)
              {
                  
                  if(this.initFiles[i].id==this.editItem)
                  {
                    oldTitle=this.initFiles[i].title;

                  }
              }


              this.saveFile(this.editItem,e.target.value);
              if(this.flag)
              {
                
                
                for(let i in this.initFiles)
                {
                    
                    if(this.initFiles[i].id==this.editItem)
                    {
                      // const savePath = 'E:/myvueprojects/myproj3/mydemo3/testFiles/';
                      // const path = window.require('path'); 
                      const newPath=this.path.join(this.savePath,this.initFiles[i].title+'.md');
                      fileHelper.writeFile(newPath,this.initFiles[i].body).then(() => {
                          console.log("写入成功1")
                      })
                      this.initFiles[i].path=newPath;
                      // console.log(this.initFiles);  
                      this.saveInfoToStore(this.initFiles); 
                      
                    }
                }
                this.clickItem(this.editItem);
                this.openFile();
                this.$emit("changeFlag1",false);
              }
              else
              {
                for(let i in this.initFiles)
                {
                    
                    if(this.initFiles[i].id==this.editItem)
                    {
                      // const savePath = 'E:/myvueprojects/myproj3/mydemo3/testFiles/';
                      // const path = window.require('path'); 
                      
                      const oldPath=this.path.join(this.savePath,oldTitle+'.md');
                      const newPath=this.path.join(this.savePath,this.initFiles[i].title+'.md');
                      fileHelper.renameFile(oldPath,newPath);

                      this.initFiles[i].path=newPath;
                      
                      this.saveInfoToStore(this.initFiles); 
                    }
                }
              }

            }
            else
            {
              for(let i in this.initFiles)
              {
                  
                  if(this.initFiles[i].id==this.editItem && !this.initFiles[i].title)
                  {
                      
                      this.initFiles.splice(i,1);
                  }
              }
            }  

            if( document.getElementById("input").blur)
            {
              // this.editItem=false;
                this.changeEditItem(false);
                this.value1="";
            }
            
       },
       closeEditItem()
       {
            // this.editItem=false;
            this.changeEditItem(false);
            this.value1="";

       },
       saveFile(id,value){
            
            for(let i in this.initFiles)
            {
                
                if(this.initFiles[i].id==id)
                {
                    
                    this.initFiles[i].title=value;
                }
            }
       },
       changeEditItem(id)
       {
            console.log(id);
            // this.activeItem1=id;
            this.$emit("changeEditItem1",id);

       },
       createFile1(newId){
      
        console.log("ppppppppppppppp");
        // document.getElementById("input").focus();
      }
      
  }
}
</script>


<style scoped lang="scss">
.file{

  width: 100%;
}
.list{
    width: 100%;
    display: flex;
    height: 38px;
    border-bottom: 1px solid #f5f3f2;
    /* justify-content: space-between; */
}
.active{
    
    
    background-color: #f5f2e9;
    
}
.list1{
    width: 100%;
    position: relative;
    padding-left: 3px;
    display: flex;
    align-items: center;
    
    /* justify-content: space-between; */
}
span{
  color: #302f2f;
  font: normal 12px;
  padding: 5px 5px;
  display: flex;
  align-items: center;
   justify-content: left;
}

.img{
/*   padding-top: 3px;*/
  width: 20px;
  height: 20px;
  margin-right: 1px;
  
}
.img1{
  position: absolute;
  top:9px;
  right:10px;
  width: 20px;
  height: 20px;
  
}
.item{
    width: 120px;
    text-align: left;
    display: block;
    margin-right: 10px;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
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
</style>


  
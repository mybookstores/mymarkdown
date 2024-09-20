<template>
    
    <div class="test">
      
      <div class="left">
        <searchfile ref="child1" title="我的文档" :initFiles="initFiles" :goSearch="goSearch"></searchfile>
        <filelist :savePath="savePath" :path="path" :flag="flag" :saveInfoToStore="saveInfoToStore" :clickItem="clickItem" :openFile="isOpenFiles" ref="child" :initFiles="initFiles" @changeFlag1="handleChangeFlag"  @editFile1="handleEditFile" @changeEditItem1="handleChangeEditItem" :editItem=editItem :activeItem=activeItem :deleteFile="deleteFile"></filelist>
        <div class="buttonlist">
            <buttonitem title="新建" @click="createFile" :icon="require('@/assets/icon/add.png')" color="#f5eeeb"></buttonitem>
            <buttonitem title="导入"  @click="importFile" :icon="require('@/assets/icon/load.png')" color="#f5f3ee"></buttonitem>
        </div>
        
      </div>
      <div class="right" v-if="activeItem">
        <tablist :openFiles="openFiles" :activeItem=activeItem :clickItem="clickItem"  :closeItem="closeItem"></tablist>
        <v-md-editor v-model="text" @upload-image="handleUploadImage" @change="changeArticle" @save="saveArticle" right-toolbar="preview fullscreen"></v-md-editor>
      </div>
      <div class="right" v-else>
        <div class="init">
          <div class="myimg">
            <img src="../assets/icon/write2.png" class="img">
          </div>
          <div class="mytext">请新建或导入文件</div>
          
        </div>
      </div>
    </div>

  </template>
  
<script>
// @ is an alias to /src
import  { v4 }  from 'uuid'


import HelloWorld from '@/components/HelloWorld.vue'
import searchfile from '@/components/searchfile.vue'
import filelist from '@/components/filelist.vue'
import buttonitem from '@/components/buttonitem.vue'
import tablist from '@/components/tablist.vue'
import fileHelper from '@/utils/helper'
import { onMounted } from 'vue'


export default {
  
  components: {
    HelloWorld,
    searchfile,
    filelist,
    buttonitem,
    tablist
  },
  data(){
    
    return{
        text:"",
        activeItem:"",
        editItem:false,
        isLoad:false,
        initFiles:(this.fileStore.get('files') || []),
        openFiles:[],
        unSaveItems:[],
        flag: false
    }
    
  },
  setup(){
    const Store=window.require('electron-store');
    const fileStore= new Store({"name":"filesInfo"});
    const savePath = 'E:/myvueprojects/myproj3/mydemo3/testFiles/';
    const path = window.require('path'); 
    const aaa= "aioiwdoi";
    return{
      fileStore,
      savePath,
      path
    }
  },
  mounted(){
    this.activeItem=this.fileStore.get('myActiveItem');
    // console.log("pppppppppppppp"+this.activeItem);
    // const Store=window.require('electron-store');
    // const fileStore= new Store({"name":"filesInfo"});
    // //1设置数据
    // this.fileStore.set('name','wwwwwwwddd');
    // //2获取数据
    // console.log(this.fileStore.get('name'));
    // //3删除数据
    // store.delete('name');
    // console.log(store.get('name'));
    // console.log(this.bbb);
    // console.log("jjjjjjjjjjjjjjjjj");
    // this.saveInfoToStore(this.initFiles);

    // const { app } = window.require('electron');
    // const path = app.getPath('documents');
    // console.log(path);



    window.ipcRenderer.on("execute-create-file", () => {
      // todo
      this.createFile();

    });
     window.ipcRenderer.on("execute-save-file", () => {
      // todo
      this.saveArticle();

    });    
    window.ipcRenderer.on("execute-search-file", () => {
      // todo
      this.$refs.child1.setsearchactive(true);

    });  
    window.ipcRenderer.on("execute-import-file", () => {
      // todo
      this.importFile();

    });
    
    let path1 = "";
    const path=window.ipcRenderer.invoke('read-user-data').then((result) => {
        
        path1=result
    });
    // console.log(path)

    
   
    this.isOpenFiles();
    this.clickItem(this.activeItem);
    this.isLoad=true;
      
  },
  methods:{
    gopage1(url)
    {
      
      this.$router.push(url)
    },
    saveInfoToStore(files){
        const storeobj=files.reduce((ret,file)=>{
          ret.push(
            { id:file.id,
              title:file.title,
              createTime:file.createTime,
              isSaved:file.isSaved,
              isOpen:file.isOpen,
              path:file.path,
              body:file.body
            })
          
          return ret
        },[])
        this.fileStore.set('files',storeobj)
        console.log(this.fileStore.get('files'));
    },
    handleUploadImage(){
        console.log("aaaa");
    },
    createFile(){
      this.flag=true;
// console.log("ppppppppppppppp");
      const newId=v4();
      const newFile={
        id: newId,
        title:"",
        body:"## 初始化内容",
        createTime: new Date().getTime(),
        isSaved: true,
        isOpen: true,
        path:""
      }
      this.editItem=newId;
      // this.activeItem=newId;
      this.initFiles.push(newFile);
      ////////////////////////
      // this.$refs.child.createFile1(newId);
      
      // this.text=newFile.body;
      
      

    },
    async importFile(){
    //   const path=window.ipcRenderer.invoke('dialog:openFile').then((result) => {
        
    //     path1=result
    // });
    
      const paths=await window.ipcRenderer.invoke('dialog:openFile');
      
      if(paths){
        console.log(paths);
        const validPaths=paths.filter(filePath=>{
          //判断当前path是否已经存在过
          const existed= this.initFiles.find(file=>{
            
              return file.path == filePath || this.path.basename(filePath,'.md') == file.title
          })
          
          return !existed
        })
        // console.log(validPaths.length);

        if(validPaths.length)
        {
            const packageData =validPaths.map((filePath)=>{
            
            return {
                id:v4(),
                title:this.path.basename(filePath,'.md'),
                path:this.path.join(this.savePath,this.path.basename(filePath)),
                createTime: new Date().getTime(),
                isSaved: true,
                isOpen: false,
                body:""
              }
            })   
            // console.log("jjjjjjjjjjjjjjjj");
            // console.log(packageData);
            // console.log("kkkkkkkkkkkkkkkkkkkkkkkk");
            for(let i in packageData)
            {
                packageData[i].body=await fileHelper.readFile(validPaths[i])
                fileHelper.writeFile(packageData[i].path,packageData[i].body).then(() => {
                console.log("写入成功wwww")
            }) 
            }
            // console.log(packageData);

            this.initFiles.push(...packageData);
            this.saveInfoToStore(this.initFiles);
            // console.log(this.initFiles);
            
            window.ipcRenderer.invoke('dialog:showMsg');
        }
        

      }
      else{
        console.log('未选择文件导入');
      }
    
    

    
    },
    goSearch(id){
      
      this.activeItem=id;

      this.fileStore.set('myActiveItem',this.activeItem);
      for(let i in this.initFiles)
      {
          if(this.initFiles[i].id==id)
          {
              
              this.initFiles[i].isOpen=true;
              this.text=this.initFiles[i].body;
          }
      }
      this.isOpenFiles();

    },
    changeArticle(){
        console.log("ppppppppppppp");
        
        let id=this.activeItem;
        for(let i in this.initFiles)
        {
            
            if(this.initFiles[i].id==id)
            {
                if(this.text!=this.initFiles[i].body && this.isLoad)
                {
                  console.log("oooooooooooooooooooooooooooo");
                  this.initFiles[i].isSaved=false;
                  this.saveInfoToStore(this.initFiles);
                }
                
                
            }

        }
        this.isOpenFiles();
    },
    saveArticle(){
        
        let id=this.activeItem;
        for(let i in this.initFiles)
        {
            
            if(this.initFiles[i].id==id)
            {
                
                this.initFiles[i].body=this.text;
                this.initFiles[i].isSaved=true;

                ////////////////////
                
                fileHelper.writeFile(this.path.join(this.savePath,this.initFiles[i].title+'.md'),this.initFiles[i].body).then(() => {
                    console.log("写入成功2")
                })

                this.saveInfoToStore(this.initFiles);
                
            }

        }

        this.isOpenFiles();


        
    },
    clickItem(id){
        this.activeItem=id;

        this.fileStore.set('myActiveItem',this.activeItem);
        for(let i in this.initFiles)
        {
            
            if(this.initFiles[i].id==id)
            {
                const currentFile=this.initFiles[i];
                
                fileHelper.readFile(currentFile.path).then((data)=>{
                  this.initFiles[i].body=data;
                })
                
                this.text=this.initFiles[i].body;
                
            }
        }
    },
    closeItem(id){
      
        for(let i in this.initFiles)
        {
            if(this.initFiles[i].id==id)
            {
                this.initFiles[i].isOpen=false;
                this.saveInfoToStore(this.initFiles);
            }
        }
        for(let i in this.openFiles)
        {
            if(this.openFiles[i].id==id)
            {
                this.openFiles.splice(i,1);
                if(this.activeItem==id)
                {
                    if(this.openFiles[i])
                    {
                      
                      this.activeItem=this.openFiles[i].id;
                      this.text=this.openFiles[i].body;
                    }
                    else if(this.openFiles[i-1])
                    {
                      this.activeItem=this.openFiles[i-1].id;
                      this.text=this.openFiles[i-1].body;
                    }
                    else
                    {
                      this.activeItem="";
                      this.text="";
                    }
                }
                this.fileStore.set('myActiveItem',this.activeItem);
            }
        }
    },
    isOpenFiles(){
      this.openFiles=[];
      for(let i in this.initFiles)
      {
          
          if(this.initFiles[i].isOpen==true)
          {
              
              this.openFiles.push(this.initFiles[i]);
          }
      }
    },
    handleEditFile(id)
    {
        this.activeItem=id;

        this.fileStore.set('myActiveItem',this.activeItem);
        for(let i in this.initFiles)
        {
            
            if(this.initFiles[i].id==id)
            {
                
                this.initFiles[i].isOpen=true;
                //////////////
                this.saveInfoToStore(this.initFiles);
                this.text=this.initFiles[i].body;
            }
        }
        this.isOpenFiles();
        
    },
    handleChangeEditItem(id){
        this.editItem=id;
    },
    handleChangeFlag(choice){
        this.flag=choice;
    },
    deleteFile(id)
    {
      for(let i in this.initFiles)
      {
          if(this.initFiles[i].id==id)
          {

            fileHelper.deleteFile(this.path.join(this.savePath,this.initFiles[i].title+'.md')).then(() => {
                console.log("删除成功")
            })


            this.initFiles.splice(i,1);

            this.saveInfoToStore(this.initFiles);
              
          }
      }
      
      for(let i in this.openFiles)
        {
            if(this.openFiles[i].id==id)
            {
                this.openFiles.splice(i,1);
                if(this.activeItem==id)
                {
                    if(this.openFiles[i])
                    {
                      
                      this.activeItem=this.openFiles[i].id;
                      this.text=this.openFiles[i].body;
                    }
                    else if(this.openFiles[i-1])
                    {
                      this.activeItem=this.openFiles[i-1].id;
                      this.text=this.openFiles[i-1].body;
                    }
                    else
                    {
                      this.activeItem="";
                      this.text="";
                    }
                }
                this.fileStore.set('myActiveItem',this.activeItem);
            }
          }

    }
  }
}
</script>


<style scoped lang="scss">
*{
    padding:0;
    margin: 0;
}

:root{
    height: 100%;
    /* background-color: blue; */
    
}

.test{
    
    top:0;
    width: 100%;
    height: 100vh; /*设置高度无效*/
    
    display: flex;
    padding:0;
    margin-top: -60px;
}
.left{
    position: relative;
    width: 240px;
    height:100%;
    background-color: #fafafa;

}
.right{
    width: 100%;
    height:100%;
    background-color:#fff;
    
}
.buttonlist{
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    width: 100%;
    
    
}
.v-md-editor {
  margin-top: 39px;
    height:calc(100% - 40px);
    /* color: #880d0d;
     background-color: #593d3d; */
    border-radius: 0;
    box-shadow: none;
  }
:deep(.v-md-editor__preview-wrapper){
  text-align: left ;
}

.img{
  width:200px;
  height:200px;
  
}
.init{
  height: 100%;
  width: 100%;
  display: flex;
  align-content: center;
  justify-content: center;
  flex-wrap: wrap;
  
}
.myimg{
  width: 100%;
  height: 200px;
  opacity: 70%;
}
.mytext{
  margin-left: -20px;
  margin-bottom: 100px;
  font-size: 17px;
  opacity: 70%;
}
</style>


  
const { app, BrowserWindow, ipcMain, dialog, Menu, shell } = require('electron')
const path = require("node:path")
const Store = require('electron-store')

// Store.initRenderer()
const store= new Store()

async function handleFileOpen () {
  // const { canceled, filePaths } = await dialog.showOpenDialog()
  // if (!canceled) {
  //   return filePaths[0]
  // }
  const { canceled, filePaths } = await dialog.showOpenDialog({
      defaultPath: __dirname,
      buttonLabel:'请选择',
      title:"选择md文件",
      properties:['openFile','multiSelections'],
      filters:[
        {"name":"md文档",extensions:["md"]},
        {"name":"其它类型",extensions:["js","json","html"]}
      ]
  })
  if (!canceled) {
      return filePaths
    }
}

function handleShowMsg () {
  dialog.showMessageBox({
      type: "info",
      title:'导入md文档',
      message:"文件导入成功"
  })
}

function handleShowMsg1 () {
  dialog.showMessageBox({
      type: "warning",
      title:'命名失败',
      message:"文件列表已有重复的名字"
  })
}

const template = [
  {
    label:'文件',
    submenu:[
      {
        label:'新建',
        accelerator :'Ctrl+N',
        click(menuItem,browerWindow,event){
          browerWindow.webContents.send('execute-create-file')
        }
      },
      {
        label:'保存',
        accelerator :'Ctrl+S',
        click(menuItem,browerWindow,event){
          browerWindow.webContents.send('execute-save-file')
        }
      },
      {
        label:'搜索',
        accelerator :'Ctrl+F',
        click(menuItem,browerWindow,event){
          browerWindow.webContents.send('execute-search-file')
        }
      },
      {
        label:'导入',
        accelerator :'Ctrl+O',
        click(menuItem,browerWindow,event){
          browerWindow.webContents.send('execute-import-file')
        }
      }
    ]
  },
  {
    label:'编辑',
    submenu:[
      {
        label:'撤销',
        accelerator :'Ctrl+Z',
        role:'undo'
      },
      {
        label:'重做',
        accelerator :'Ctrl+Y',
        role:'redo'
      },
      {
        type:'separator'
      },
      {
        label:'剪切',
        accelerator :'Ctrl+X',
        role:'cut'
      },
      {
        label:'复制',
        accelerator :'Ctrl+C',
        role:'copy'
      },
      {
        label:'粘贴',
        accelerator :'Ctrl+V',
        role:'paste'
      },
      {
        label:'全选',
        accelerator :'Ctrl+A',
        role:'selectAll'
      }
    ]
  },
  {
    label:'视图',
    submenu:[
      {
        label:'刷新',
        accelerator :'Ctrl+R',
        role:'reload'
      },
      {
        label:'最大化',
        accelerator :'F11',
        role:'togglefullscreen'
      },
      {
        label:'开发者工具',
        accelerator :'Ctrl+Shift+I',
        role:'toggleDevTools'
      }
    ]
  },
  {
    label:'窗口',
    role:'window',
    submenu:[
      {
        label:'最小化',
        accelerator :'Ctrl+M',
        role:'minimize'
      },
      {
        label:'关闭',
        accelerator :'Ctrl+W',
        role:'close'
      }
    ]
  },
  {
    label:'帮助',
    role:'help',
    submenu:[
      {
        label:'更多',
        click(){
          shell.openExternal("https://www.baidu.com")
        }
      }
    ]
  }
]


const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 970,
    height: 600,
    icon: "electron/markdown.png",
    title: "mymarkdown",
    webPreferences:{
      nodeIntegration:true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')}
  })
  
  // 使用 loadFile 加载 electron/index.html 文件
  // mainWindow.loadFile(path.join(__dirname, "./index.html"));

  // 3004 改为你 Vue 项目的端口号
  mainWindow.loadURL("http://localhost:8080/");

  const menu=Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}


// 在应用准备就绪时调用函数
app.whenReady().then(() => {
  createWindow()
  
  // console.log("bbbbbbb")
  // console.log(path.join(__dirname, 'preload.js'))
  // ipcMain.handle('window-store-data',(event,key,value)=>{
  //   store.set(key,value)
  //  })
  //  //取出数据
  //   ipcMain.handle('window-get-data',(event,key)=>{
  //     const value=store.get(key)
  //     //console.log(store.path)//获取存储文件的路径
  //     return value
  //   })
  ipcMain.handle('read-user-data',() => {
    const path = app.getPath('userData');
    return path;
  });
  ipcMain.handle('dialog:openFile', handleFileOpen);
  ipcMain.handle('dialog:showMsg', handleShowMsg);
  ipcMain.handle('dialog:showMsg1', handleShowMsg1);

  ipcMain.on('show-context-menu', (event) => {
    const contextMenuTmp = [
      {
        label:'重命名',
        click: () => {
          // 发送点击菜单一事件到渲染进程
          event.sender.send('context-menu-command1', 'menu-item-1')
        }
      },
      {
        label: '删除',
        click: () => {
          // 发送点击菜单一事件到渲染进程
          event.sender.send('context-menu-command2', 'menu-item-1')
        }
      }
    ]
    const menu = Menu.buildFromTemplate(contextMenuTmp)
    menu.popup({
      window: BrowserWindow.fromWebContents(event.sender)
    })
  })
})

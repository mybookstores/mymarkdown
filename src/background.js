'use strict'

import { app, protocol, BrowserWindow,ipcMain, dialog, Menu, shell } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'

import path from 'path'
import Store from 'electron-store'

// Store.initRenderer()
const store= new Store()

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

///////////////////
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

///////////////////////
async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 970,
    height: 600,
    icon: "electron/markdown.png",
    webPreferences: {
      webSecurity:false,
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: true,
      contextIsolation: false,
      preload: "E:/myvueprojects/myproj3/mydemo3/src/preload.js"
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')


  }
      ////////////////////////
      const menu=Menu.buildFromTemplate(template);
      Menu.setApplicationMenu(menu);
      ////////////////////
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
  ///////////////////
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

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

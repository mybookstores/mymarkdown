
// const { contextBridge, ipcRenderer, BrowerWindow } = require('electron')
// // const fs = window.require("fs");
// // window.ipcRenderer = ipcRenderer
// // window.ipcRenderer = require('fs').ipcRenderer;


// contextBridge.exposeInMainWorld('electronAPI', {


//     readData: () => ipcRenderer.invoke('read-user-data'),
//     windowstoreData: (key,value)=>{
//         ipcRenderer.invoke('window-store-data',key,value)
//     },
//     windowGetData: async (key)=>{
//         const data=await ipcRenderer.invoke('window-get-data',key)
//         return data
//     }

  
// })

// preload.js
window.ipcRenderer = require('electron').ipcRenderer;

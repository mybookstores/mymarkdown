
const fs =window.require("fs").promises
// const path = window.require('path'); 

const fileHelper = {
    readFile : (path) => {
        return fs.readFile(path,'utf-8')
    },

    writeFile : (path,content) => {
        return fs.writeFile(path,content,'utf-8')
    },

    renameFile : (path,newPath) => {
        return fs.rename(path,newPath)
    },

    deleteFile : (path) => {
        return fs.unlink(path)
    } 
}



export default fileHelper

// const testPath = path.join(__dirname,'test.js')
// const testWritePath = path.join(__dirname,'test.md')
// const newPath = path.join(__dirname,'rename.md')


// readFile(testPath).then((data)=>{
//     console.log(data)
// })


// writeFile(testWritePath,"## 二级标题").then(() => {
//     console.log("写入成功")
// })

// renameFile(testPath,newPath)

// deleteFile(newPath).then(() => {
//     console.log("删除成功")
// })

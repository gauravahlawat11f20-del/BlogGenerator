import React, { useState } from 'react'
import {DB} from '../OperationsWithFirebase/firebase'
import {set,get,child, update} from 'firebase/database'
import { useNavigate } from 'react-router-dom'

const ImageUpload = () => {

    const [ folderName  , setFolderName] = useState()
    const [imgPath , setImgPath] = useState()
    const navigation  = useNavigate()

    const [arr , setArr] = useState([])

  const handleFileChange = (e)=>{
    const file = e.target.files[0]
     const reader = new FileReader()
     reader.readAsDataURL(file)
  //  
   reader.onload = function(){
     setImgPath(reader.result)
   }

  }  

  const handleClick = ()=>{  

    if(!folderName){
        alert("fill all the credential")
    }
    else{
          // check if the same data is already present
          
         get(child(DB,'Images'))
          .then(snap=>{
           var data = snap.val()

            if(!data){
             set(child(DB,`Images/${folderName}`) , {Name : folderName , Path : [...arr , imgPath]})
             alert("data added successfully")
             navigation("/move")
            }
            else{
               var keys = Object.keys(data)

           var isThere = keys.filter(key => key == folderName)
           if(isThere.length>0){
           // alert("this same name folder already exists")
           update(child(DB,`Images/${folderName}`) , {Path : [... data[folderName].Path , imgPath]} )
           alert("data added successfully")
           navigation("/move")
           }
          else{
             set(child(DB,`Images/${folderName}`) , {Name : folderName , Path : [...arr , imgPath] })
             alert("data added successfully")
             navigation("/move")
          }
            } 
          })
    }
  }

  return (
    <div>
        <input onChange={(e)=>setFolderName(e.target.value)} type="text" placeholder='folder name' />
        <input onChange={handleFileChange} type="file" />
         
         <button onClick={handleClick}>Upload</button>
    </div>
  )
}

export default ImageUpload

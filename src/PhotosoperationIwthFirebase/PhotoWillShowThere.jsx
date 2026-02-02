import React, { useEffect, useState } from 'react'
import { DB } from '../OperationsWithFirebase/firebase'
import { get , child } from 'firebase/database'
import { useParams } from 'react-router-dom'

const PhotoWillShowThere = () => {

    const [data ,  setdata ] = useState()
    const [filteredKey , setFilteredkey] = useState()

     const {Name} =  useParams() // Name ===  folderName

   const foldername = {
    start : {
       folderName : Name
    }
   }

  useEffect(()=>{
  
    get(child(DB , "Images"))
    .then(snap=>{
        var data = snap.val()
        setdata(data)

        var keys = Object.keys(data)

       var filteredKey = keys.filter(key => key == foldername.start.folderName)
       setFilteredkey(filteredKey)
       console.log(data[filteredKey].Path)
    })

  },[])

  return (
    <div>
      {  filteredKey &&
       filteredKey.map(key=>(
        <div>
          {
            data[filteredKey].Path.map(pth=>(
               <img src={pth} alt="alternative" />
            ))
          }
           
           
            </div>
       ))
      }
    </div>
  )
}

export default PhotoWillShowThere

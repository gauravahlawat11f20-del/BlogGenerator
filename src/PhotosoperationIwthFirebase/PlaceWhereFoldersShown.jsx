import React, { useState , useEffect } from 'react'
import {DB} from "../OperationsWithFirebase/firebase"
import {  get , child  } from 'firebase/database'
import {useNavigate} from "react-router-dom"

const PlaceWhereFoldersShown = () => {

    const [Data , setData] = useState()

    const navigation = useNavigate()

    const handleClick = (folderName)=>{
       navigation(`/show/${folderName}`)
    }

  useEffect(()=>{
    get(child(DB,`Images`))
    .then(snap=>{
        var data = snap.val()
        setData(data)
       // var keys = Object.keys(data)
    })
   },[])

  return (
    <div>
        {  Data &&
            Object.keys(Data).map(key=>(
                <div onClick={()=>handleClick(key)} style={{backgroundColor:"pink" , height:"100px" , width:"200px"} } >
                    <p>{Data[key].Name}</p>
                </div>

            ))
        }
      
    </div>
  )
}

export default PlaceWhereFoldersShown

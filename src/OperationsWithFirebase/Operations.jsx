import React, { useEffect, useState } from 'react'
import {DB} from './firebase'
import { child , set , update , remove , get , onValue } from 'firebase/database'
import { useToast } from '../components/ToastProvider'

const Operations = () => {

  const [obj , setObj] = useState({
    Name:"",
    Rank : "",
    Jutsu : ""
  })

  const [data , setData] = useState("")

  const [key , setKey] = useState("")

  const [status , setStatus] = useState(false)
  const toast = useToast()

 const handleAdd = ()=>{
 // write a code to add the data in db .. but first check whether the .. user already exists ...
 if(!obj.Name || !obj.Jutsu || !obj.Rank){
    toast.error("Fill up all the credential")
 }
 else{
  // fetch the data first and check . if user with the same name is regiterd already or not 
  get(child(DB,"users"))
  .then(snap=>{
    var data = snap.val(); // yahan blank hai .. jb toh neeche kaise value aajaygi .. agar issi ko access karenge ..go to 24th line
    if(!data){
      set(child(DB,`users/${obj.Name}`) , obj) // ab value set ho gayi data me .. but ... toh mai bhi .. agar hum .. dubara .. 
      // jaise ... var data_2 = snap.val() .. edit kare .. oth kyaa pata chal jaye .. but thats not a great practise to do .. 
      // so use ELSE .. wahi best hai
      toast.success("Data added successfully")
      // window.location.reload();
        get(child(DB,"users")) 
   .then(snap=>{
    var data = snap.val() 

     if (!data) {
      console.log("nothing found")
      
     }
    
    setData(data)
     })
    }
    // what if dont write .. else there .. 
    // ??? then jo new credentail enter kiye hian . unke saath hi . compare ho jayega .. jo abhi abahi DB me store huye hian .. 
    else{
      // get keys ...  just after .. snap.val( )step
      var keys = Object.keys(data) 
     // +++  .. agar else na likhta toh ... data blank hota kyunki ..  ... 22 line me dekh
     // now use filter on keys 
    var isThere =  keys.filter(key => key == obj.Name)
    if(isThere.length>0){ // alone variable na likhiyo .. khali array bhi true hi hota hai .. so use length
      toast.warn("User is already there")
    }else{
      set(child(DB,`users/${obj.Name}`) , obj) // data added
      toast.success("Data added successfully")
     //  window.location.reload();


  get(child(DB,"users")) 
   .then(snap=>{
    var data = snap.val() 

     if (!data) {
      console.log("nothing found")
      
     }
    
    setData(data)
     })




    }
    }
  })
 }

 }

 
 const handleUpdate = ()=>{
  update(child(DB,`users/${key}`) , obj)

  setStatus(true)
 // value display karo .... useEffect me ... 
 // pichli crud app me yahi problem thi ... value update karke ..
 // turant get karoge toh wahi hona thaa ... 
 //  aur isme thoda delay karake  .. get kiya 
 } 

 const handleDelete = (keyname)=>{
    console.log(keyname)
    // remove this name now 
    remove(child(DB,`users/${keyname}`)) // name is deleted now .. 
    // fetch data again and and setData(data)
      get(child(DB,"users")) 
   .then(snap=>{
    var data = snap.val() 

     if (!data) {
      console.log("nothing found")
      
     }
    
    setData(data)
   })
 }

 const handleEdit =(keyname)=>{

  // fetch data again
      get(child(DB,"users")) 
   .then(snap=>{
    var data = snap.val() 

     if (!data) {
      console.log("nothing found") 
     }

     console.log(data[keyname])
    
     setObj({
      Name:data[keyname].Name,
       Jutsu:data[keyname].Jutsu,
        Rank:data[keyname].Rank,
     })

     setKey(keyname)
    
   })
    
 }

 

  useEffect(()=>{
  //console.log("show the data now")
    get(child(DB,"users")) 
   .then(snap=>{
    var data = snap.val() 

     if (!data) {
      console.log("nothing found")
      
     }
    
    setData(data)

    
   })

  },[]) // when ever page loads 


  useEffect(()=>{
  if(status == true){
     get(child(DB,"users"))
  .then(snap=>{
    var data = snap.val()
    if(!data){
      console.log("nothing")
    }
    else{
      setData(data)
      setStatus(false)
    }
  })

  }
  },[status])



  return (
  <div className="container">
    <div className="card">
      <h2 className="title">Realtime DB — Shinobi Records</h2>

      <div className="input-group">
        <input
          className="input"
          value={obj.Name}
          placeholder="Enter name"
          type="text"
          onChange={(e) => setObj({ ...obj, Name: e.target.value })}
        />
        <input
          className="input"
          value={obj.Jutsu}
          placeholder="Enter jutsu"
          type="text"
          onChange={(e) => setObj({ ...obj, Jutsu: e.target.value })}
        />
        <input
          className="input"
          value={obj.Rank}
          placeholder="Enter rank"
          type="text"
          onChange={(e) => setObj({ ...obj, Rank: e.target.value })}
        />
      </div>

      <div className="button-group">
        <button className="btn primary" onClick={handleAdd}>Add Record</button>
        <button className="btn update" onClick={handleUpdate}>Update</button>
      </div>
    </div>

    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Jutsu</th>
            <th>Rank</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {data &&
            Object.entries(data)
              .sort((a, b) => a[1].createdAt - b[1].createdAt)
              .map(([keyname, val]) => (
                <tr key={keyname}>
                  <td>{val.Name}</td>
                  <td>{val.Jutsu}</td>
                  <td>{val.Rank}</td>
                  <td className="actions">
                    <button className="btn sm delete" onClick={() => handleDelete(keyname)}>Delete</button>
                    <button className="btn sm edit" onClick={() => handleEdit(keyname)}>Edit</button>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  </div>
);

 
}

export default Operations

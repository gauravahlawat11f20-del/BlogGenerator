import React from 'react'
import "./Adminauth.css"
import { useState } from 'react'
import { DB } from './firebase';
import { set , child  , get} from 'firebase/database';

const Adminauth = () => {

  const [isLogin, setIsLogin] = useState(true);

  const [obj , setObj] = useState({
    Email:"",
    Password:"",
    Name:""
  })

  const handleClick = ()=>{
    if(!isLogin){ // for registers

     if(!obj.Name || !obj.Email || !obj.Password){
        alert("fill all the credential")
     }
     else{
        // get the prev data and check
        get(child(DB,"Amin"))
        .then(snap => {
            var data = snap.val()

            if(!data){
                set(child(DB,`Amin/${obj.Password}`) , obj);
                console.log("admin added")
                alert("data added successfully")
            }
            else{

            var keys = Object.keys(data)

            var filteredKey = keys.filter(key => key == obj.Password)
            if(filteredKey.length > 0){
                alert("admin already registerd with same name")
            }
            else{
                 set(child(DB,`Amin/${obj.Password}`) , obj);
                  console.log("admin added")
                alert("data added successfully")
            }

            }    
     })
     }
    } // 
    else{
        // login logic

    if(!obj.Email || !obj.Password){
        alert("fill all the credential")
    }else{
        get(child(DB,"Amin"))
        .then(snap=>{
            var data = snap.val()
            var keys = Object.keys(data)
            var admin = keys.filter(key => key == obj.Password)
            if(admin.length > 0){
              alert("admin found .. check in console")
             console.log(data[admin])
            }
            else{
              alert("Admin not found")
            }
        })
    }
    }
  }

  return (
   <div className="auth-container">
      <div className="auth-card">
        <div className="toggle-group">
          <button
            className={isLogin ? "toggle-btn active" : "toggle-btn"}
            onClick={() => setIsLogin(true)}
          >
            Login Admin
          </button>
          <button
            className={!isLogin ? "toggle-btn active" : "toggle-btn"}
            onClick={() => setIsLogin(false)}
          >
            Register Admin
          </button>
        </div>

     
          {!isLogin && (
            <input
              className="auth-input"
             
              placeholder="Admin Name"
              type="text"
              name="name"
              onChange={(e)=>setObj({...obj , Name:e.target.value})}
            />
          )}

          <input
            className="auth-input"
          
            placeholder="Admin Email"
            type="email"
            name="email"
            onChange={(e)=>setObj({...obj , Email:e.target.value})}
          />

          <input
            className="auth-input"
             
            placeholder="Password"
            type="password"
            name="password"
             onChange={(e)=>setObj({...obj , Password:e.target.value})}
          />

          <button onClick={handleClick} className="submit-btn">
            {isLogin ? "Login" : "Create Admin"}
          </button>
        
      </div>
    </div>

  )
}

export default Adminauth

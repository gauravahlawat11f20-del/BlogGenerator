import React, { useEffect, useState } from "react";
import "./ProfileInfo.css";
import { DB } from "../../OperationsWithFirebase/firebase";
import { get, child, set , remove, ref, update } from "firebase/database";
import { useNavigate, useParams } from "react-router-dom";

export default function ProfileInfo() {

  const [obj , setObj] = useState({
    Name : "",
    About : ""
  })

  const [edit, setEdit] = useState(false);

  const [username , setUsename] = useState()
  const [data , setData] = useState()

  const {Name} = useParams()

  var getparam = {
    start :{
       Name : Name
    }
  }

  const navigatation = useNavigate()

  const handleEdit = async()=>{

   
  }

  const handlePreview = (theme , title)=>{

     if(getparam.start.Name == JSON.parse(localStorage.getItem("CurrentUser"))){
          localStorage.setItem("edit" , JSON.stringify(true))
     }

  
    // edit kar sakte hain + navigate karo do .. with theme and title name to the page ... 
    navigatation(`/${theme}/${title}`)
  }

  useEffect(()=>{
    var name =  getparam.start.Name || JSON.parse(localStorage.getItem("CurrentUser"))
    setUsename(name)

    // pehle hi set maar deta hoon .. fireabse me profile info ko 

  
  },[])

  useEffect(()=>{

    console.log(username)

     // on the basis of this name .. fetch its .. projects

     get(child(DB,`BLOGS/${username}`))
     .then(snap=>{
        var data = snap.val()
        setData(data)
    
     })


  },[username])

  useEffect(()=>{

    if(!data) return
     console.log(data)

  },[data])

  return (
    <div className="profile-page">

      {/* ================= PROFILE HEADER ================= */}
      <section className="profile-header">
        <div className="profile-left">
          <div className="profile-pic">
            <img src="/profilePic.jpg" alt="profile" />
          </div>
        </div>

        <div className="profile-right">
          <h1 className="profile-name">{username}</h1>
       
          <p className="profile-desc">
             "Hi, I’m Gaurav — a passionate Front-End Developer who loves turning ideas into visually stunning, user-friendly, and responsive digital experiences. "
            
          </p>
       
        </div>

      </section>

      {/* ================= BLOG PROJECTS ================= */}
      <section className="profile-projects">
        <h2>Published Blog Projects</h2>

        <div className="projects-list">
         
          {/* real objects */}
            { data &&
            Object.keys(data).map(key=>(

                <div className="profile-project-card">
  <div className="profile-project-img">
    <img src={data[key].img} alt="blog" />
  </div>

  <div className="profile-project-info">
    <h3>{data[key].Title}</h3>
    <span className="profile-project-theme">
      Theme: {data[key].Theme}
    </span>
    <button onClick={()=>handlePreview(data[key].Theme , data[key].Title)}  className="profile-preview-btn">Preview</button>
  </div>
</div>

            ))
         }
       
        </div>
      </section>

      {/* ================= EDIT BUTTON ================= */}

      {
        getparam.start.Name == JSON.parse(localStorage.getItem("CurrentUser"))
        ?
             <div
        className="edit-profile-btn"
        onClick={() => setEdit(true)}
      >
        Edit Profile
      </div>
        : ""
      }


      {/* ================= EDIT POPUP (CONDITIONAL) ================= */}
      {
        edit && (
          <div className="edit-overlay">
            <div className="edit-card">
              <h3>Edit Profile</h3>

              <input onChange={(e)=>setObj({...obj ,Name : e.target.value })} type="text" placeholder="Your Name" />
              <textarea onChange={(e)=>setObj({...obj ,About : e.target.value })} placeholder="About you..." />

              <div className="edit-actions">
                <button onClick={handleEdit} className="save-btn">Save</button>
                <button
                  className="cancel-btn"
                  onClick={() => setEdit(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )
      }

    </div>
  );
}

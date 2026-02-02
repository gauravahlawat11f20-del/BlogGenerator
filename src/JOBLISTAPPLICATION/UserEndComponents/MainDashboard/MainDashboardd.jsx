import React, { useEffect, useState } from 'react'
import "./MainDashboard.css"
import { useNavigate, useParams } from 'react-router-dom';


const MainDashboardd = () => {

     const [activeMenu, setActiveMenu] = useState("Home");

  const menus = ["Home", "Create Your Blog", "Uploaded Blogs", "Help"];

  const {Name} = useParams()

  const UrlName = {
    start:{
      Name:Name
    }
  }

 const navigation =  useNavigate()

  const CreateBlog = ()=>{
    navigation("/selectTheme")
  }

  useEffect(()=>{
   var currentUser = UrlName.start.Name;
   localStorage.setItem("currentUser" , JSON.stringify(currentUser))
  },[]) // when page loads
   
  return (
   <div className="dashboard">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">Blogify</div>

        <ul className="menu">
          <li className="active">Home</li>
          <li onClick={CreateBlog}>Create Blog</li>
          <li>Your Blogs</li>
          <li onClick={()=>navigation("/notification")}  >Notification</li>
        </ul>

        <div  className="profile">
          <img onClick={()=>navigation(`/urProfile/${UrlName.start.Name}`)}  style={{height:"45px" , width:"45px" , borderRadius:"50%" , cursor:"pointer"}} src="/profilePic.jpg" alt="user" />
         
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">

        

        <div className="hero-text">
           <h1 className='Name' >Heyy {UrlName.start.Name} </h1>
          <h1 className='shift' >Create your first blog</h1>
          <p className='shift'>and attract people with powerful stories</p>
        </div>

        <div className="collage">
          <div className="frame a"><img src="/hawai.jpg" /></div>
          <div className="frame b"><img src="/wp4956754.jpg" /></div>
          <div className="frame c"><img src="/food.jpg" /></div>
          <div className="frame d"><img src="/156232.jpg" /></div>
          <div className="frame e"><img src="/fdd.jpg" /></div>
          <div className="frame f"><img src="/OIP.webp" /></div>
        </div>

      </section>

    </div>

  )
}

export default MainDashboardd

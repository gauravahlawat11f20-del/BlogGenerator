import React, { useEffect, useState } from "react";
import "./MinimalCleanPage.css";
import { useParams } from "react-router-dom";
import { DB } from "../../OperationsWithFirebase/firebase";
import { set , child , get } from "firebase/database";





export default function MinimalCleanTheme() {

 const {Title} = useParams()

 const title = {
  start:{
    titlee : Title
  }
 }

 const [data , setData] = useState()




useEffect(()=>{
   get(child(DB,"blogs-CONTENT"))
   .then(snap=>{
    var data = snap.val()
    setData(data)

   })
},[])

// 🔥 SAFE: compute only when data exists
  const heroImage = data?.[Title]?.img || "/city.jpg";

  if (!data) return null; // or loader



  return (
  <>
    { data &&

    <div className="minimal-clean">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">{data[title.start.titlee].title}</div>
        <ul className="nav-links">
          <li>Rate</li>
          <li>Download</li>
          <li>Share</li>
          {
            JSON.parse(localStorage.getItem("edit")) === true ? <li>Edit</li> : ""
          }
        </ul>
      </nav>

    

      {/* Hero Section */}
      <section className="hero-section"    style={{
    backgroundImage: `url(${heroImage})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover"
  }}  >
        <div className="hero-content">
          <h1>{data[title.start.titlee].title}</h1>
          <p>{data[title.start.titlee].description}</p>
        </div>
      </section>

      {/* Small Images Below Hero */}
      <section className="small-images">
        <div className="image-card"><img src="/ajj.jpg" alt="" /></div>
        <div className="image-card"><img src="/fdd.jpg" alt="" /></div>
        <div className="image-card"><img src="/hawai.jpg" alt="" /></div>
        <div className="image-card"><img src="/156232.jpg" alt="" /></div>
      </section>

      {/* Lists Section */}
      <section className="lists-section">
        <h2>Top 5 Blogging Tips</h2>
        <ul>
          <li>Choose a clean and readable template</li>
          <li>Write clear and engaging headlines</li>
          <li>Use images to break the text</li>
          <li>Keep paragraphs short</li>
          <li>Always proofread before publishing</li>
        </ul>
      </section>

      {/* About Section */}
      <section className="about-section">
        <h2>About MinimalClean</h2>
        <p>
          MinimalClean is a modern blogging template designed to give your content
          maximum readability and impact. Whether you're a developer, designer,
          or writer, our clean layout and responsive design ensures your blogs
          look professional on every device.
        </p>
        <p>
          Our mission is to make blogging simple, elegant, and accessible for everyone.
          With customizable themes and user-friendly features, you can focus on
          creating content while MinimalClean handles the design.
        </p>
      </section>

 

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 MinimalClean. All rights reserved.</p>
        <div className="footer-links">
          <span>Privacy</span>
          <span>Terms</span>
          <span>Contact</span>
        </div>
      </footer>
    </div>
}
    </>
  );
   
}

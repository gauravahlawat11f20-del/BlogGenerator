import React, { useEffect, useState } from "react";
import "./CreativeFlowTheme.css";
import { useNavigate, useParams } from "react-router-dom";
import { DB } from "../../OperationsWithFirebase/firebase";
import { child, get } from "firebase/database";

export default function CreativeFlowTheme() {
  const {Theme , Title} = useParams();
  const [data, setData] = useState(null);

  const navigation = useNavigate()

  const getprm = {
    start:{
      Theme : Theme
    }
  }

  const [IMG , setIMG] = useState("")


  useEffect(() => {
    console.log(Title)
     console.log(getprm.start.Theme)
   


    const effectiveTitle = Title || JSON.parse(localStorage.getItem("blogToBeEdited"));

    get(child(DB, `blogs-CONTENT/${effectiveTitle}`)).then((snap) => {
      const blog = snap.val();
      if (blog) {
        setData({ [effectiveTitle]: blog });
        setIMG(blog.img || "/city.jpg");
      } else {
        setData(null);
        setIMG("/city.jpg");
      }
    });


    // blog you wanna edit set that to local storage .. 
    // vaise kaam .. karna chahoiye edit ke button ke click pe .. 
    // but agar .. aise bhlocalStorage.setItem("blogToBeEdited" , JSON.stringify(Title))i karunga .., toh value change ho jayegi aur prev title name is base pe hi kaam karna hai hame
    // lekin agar .. mai blog-div ke upar hi edit button lagata ... like ... preview .. toh iss approach me thoda sa change aa jata

    localStorage.setItem("blogToBeEdited" , JSON.stringify(Title))


  }, []);

  useEffect(()=>{
    if(!IMG){
      setIMG("/city.jpg")
    }
  },[IMG])

  useEffect(()=>{
   console.log(IMG)
  },[IMG])

 // if (!data || !data[Title]) return null;

            
  return (
    
    <div className="creative-flow">

    { data &&  IMG  ?  (  <>

      {/* NAVBAR */}
      <nav className="cf-navbar">
        <h2 className="cf-logo">{data[Title].title}</h2>
        <ul>
          <li>Rate</li>
          <li>Download</li>
          <li>Share</li>
          {
               JSON.parse(localStorage.getItem("allow")) == true ? <li onClick={()=>navigation(`/upload/Editorial/${Title}`)}>Upload</li> : ""
          }

            {
            JSON.parse(localStorage.getItem("edit")) === true ? <li onClick={()=>navigation(`/create/Editorial`)} >Edit</li> : ""
          }
         
        </ul>
      </nav>

      {/* HERO */}
      <section className="cf-hero">
        <div
          className="cf-hero-left"
          style={{ backgroundImage: `url(${ data[Title].img || IMG})` }}
        >
          <div className="cf-hero-text">
            <h1>{data[Title].title}</h1>
            <p>{data[Title].Desc}</p>
          </div>
        </div>

        <div className="cf-hero-right">
          <div className="cf-laptop">
            <img className="cf-laptop-frame" src="/laptop.jpg" alt="Laptop" />
            <div className="cf-laptop-screen">
              <img src={data[Title].img || IMG || "/city.jpg"} alt="Blog preview" />
            </div>
          </div>
          <img src="/gtx.webp" alt="" />
          <img src="/lap2.avif" alt="" />
        </div>
      </section>

      {/* LIST SECTION */}
      <section className="cf-lists">
        <h2>Why This Blog Works</h2>
        <div className="cf-list-cards">
          <div>Clean typography focused on reading</div>
          <div>Balanced images & white space</div>
          <div>Perfect for long-form writing</div>
          <div>Responsive & lightweight</div>
          <div>Designed for storytellers</div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="cf-about">
        <h2>About This Theme</h2>
        <p>
          CreativeFlow is built for writers who want their words to breathe.
          With elegant fonts, gentle curves, and thoughtful spacing, this
          layout puts storytelling first.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="cf-footer">
        <p>(c) 2026 CreativeFlow Blog Theme</p>
      </footer>
      </>
       )
       : (
         <div className="loader-wrapper">
    <img src="/mst.gif" alt="Loading..." />
       </div>
         )    }

    </div> 
   

  );

}

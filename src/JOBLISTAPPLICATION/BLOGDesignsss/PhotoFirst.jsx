import React from "react";
import "./PhotoFirst.css";
import { useState , useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DB } from "../../OperationsWithFirebase/firebase";
import { child, get } from "firebase/database";

export default function PhotoFirst() {

    const {Theme , Title} = useParams();
  const [data, setData] = useState(null);

  const navigation = useNavigate()

  const getprm = {
    start:{
      Theme : Theme
    }
  }

  const [IMG , setIMG] = useState("")

  // useEffects 

    useEffect(() => {
      console.log(Title)
       console.log(getprm.start.Theme)
     
  
  
      get(child(DB, "blogs-CONTENT")).then((snap) => {
        setData(snap.val());
      });
  
  
      // blog you wanna edit set that to local storage .. 
      // vaise kaam .. karna chahoiye edit ke button ke click pe .. 
      // but agar .. aise bhlocalStorage.setItem("blogToBeEdited" , JSON.stringify(Title))i karunga .., toh value change ho jayegi aur prev title name is base pe hi kaam karna hai hame
      // lekin agar .. mai blog-div ke upar hi edit button lagata ... like ... preview .. toh iss approach me thoda sa change aa jata
  
      localStorage.setItem("blogToBeEdited" , JSON.stringify(Title))
  
  
    }, []);


    
      useEffect(()=>{
        if(!data)
          {
           
                setIMG("/city.jpg")
              return;
          } 
    
            var keys = Object.keys(data) // blogID created by gaurav 
            //  ab dhundo konsi blog id chahiye .. we do that ,.. on the basis of .. title name
    
            var title =  Title || JSON.parse(localStorage.getItem("blogToBeEdited"))
    
             console.log(title , keys , data)
    
           var desiredBlogID = keys.find(key=> key === title )
    
          //   console.log(title , data[keys[2]])
    
           var imggg = desiredBlogID ? data[desiredBlogID].img : ""
          //  console.log(imggg)
           // now set that to state
          if(!imggg){
             setIMG("/city.jpg")
          }

            setIMG(imggg)
        
      },[data])
    
      useEffect(()=>{
       console.log(IMG)
      },[IMG])
    
     // if (!data || !data[Title]) return null;



  return (
    <div className="pf-wrapper">

         {/* && IMG */}

      {
        data   ?  (  <>
       {/* "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"  */} 

         {/* NAVBAR */}
      <nav className="cf-navbar">
        <h2 className="cf-logo">{data[Title].title}</h2>
        <ul>
          <li>Rate</li>
          <li>Download</li>
          <li>Share</li>
          {
               JSON.parse(localStorage.getItem("allow")) == true ? <li onClick={()=>navigation(`/upload/PhotoFirst/${Title}`)}>Upload</li> : ""
          }

            {
            JSON.parse(localStorage.getItem("edit")) === true ? <li onClick={()=>navigation(`/create/Photo First`)} >Edit</li> : ""
          }
         
        </ul>
      </nav>

      {/* HERO SECTION */}
      <section className="pf-hero">
        <img
          src= {data[Title].img || "https://images.unsplash.com/photo-1501785888041-af3ef285b470" }   
          
          alt="Hero"
          className="pf-hero-img"
        />
        <div className="pf-hero-overlay">
          <h1>{data[Title].title  }</h1>
          <p>
           {data[Title].Desc ? data[Title].Desc : "Where every image leads the story and words gently follow the light." } 
          </p>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="pf-content">
        <h2>The Soul Behind the Lens</h2>

        <p>
          Photography is not just visual documentation. It is an emotional
          language — silent, powerful, and timeless. A single frame can carry
          memories, moods, and meaning beyond explanation.
        </p>

        <p>
          This blog explores moments captured instinctively — moments that were
          felt before they were seen.
        </p>
      </section>

      {/* FANCY LIST SECTION */}
      <section className="pf-lists">
        <h2>What This Story Explores</h2>

        <ul>
          <li>
            <span>01</span>
            <div>
              <h4>Light & Shadow</h4>
              <p>How contrast creates emotion within a frame.</p>
            </div>
          </li>

          <li>
            <span>02</span>
            <div>
              <h4>Stillness</h4>
              <p>Capturing silence in a moving world.</p>
            </div>
          </li>

          <li>
            <span>03</span>
            <div>
              <h4>Human Presence</h4>
              <p>Stories told without faces or words.</p>
            </div>
          </li>

          <li>
            <span>04</span>
            <div>
              <h4>Nature’s Geometry</h4>
              <p>Lines, balance, and natural symmetry.</p>
            </div>
          </li>

          <li>
            <span>05</span>
            <div>
              <h4>Moments That Vanish</h4>
              <p>Seconds that will never repeat again.</p>
            </div>
          </li>
        </ul>
      </section>

      {/* IMAGE STORY SECTION */}
      <section className="pf-image-story">
        <img src="https://images.unsplash.com/photo-1495567720989-cebdbdd97913" />
        <img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470" />
        <img src="https://images.unsplash.com/photo-1519681393784-d120267933ba" />
      </section>

      {/* TEXT AREA / BLOG CONTENT */}
      <section className="pf-long-content">
        <h2>Reflections</h2>
        <p>
          When you stop chasing perfection, photography becomes honest.
          Imperfections add character — blur adds emotion — silence adds depth.
        </p>
        <p>
          The best photographs are not planned. They are felt. They exist
          briefly and are preserved forever through intuition.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="pf-footer">
        <h3>PhotoFirst</h3>
        <p>
          Designed for visual storytellers who believe images speak louder than
          paragraphs.
        </p>
        <span>(c) 2026 Gaurav - All Rights Reserved</span>
      </footer>

      </>  )
       : (
         <div className="loader-wrapper">
    <img src="/mst.gif" alt="Loading..." />
       </div>
         )  }

    </div>
  );
}




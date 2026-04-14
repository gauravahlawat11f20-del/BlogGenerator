

import React, { useEffect, useState } from "react";
import "./ExploreBlogs.css";
import { DB } from "../../../OperationsWithFirebase/firebase";
import { set, get, child, onValue } from "firebase/database";
import { useNavigate, useParams } from "react-router-dom";

export default function ExploreBlogs() {
  const [data, setData] = useState("");
  const [keys, setKeys] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [liked, setLiked] = useState([]);
  const [dataa, setdataa] = useState([]);
  const [eligible, seteligibility] = useState(false);
  const [dataaa, setDataaa] = useState([]);

  const [cmnt , setCmnt] = useState()

  const navigation = useNavigate();
  const { Name } = useParams();

    const [resObj , setResObj] = useState({
        Name : "",
        About : "",
        Img:""
      })

  const routeForTheme = (theme) => {
    if (theme === "Minimal Clean" || theme === "MinimalCleanTheme") return "MinimalCleanTheme";
    if (theme === "Editorial") return "Editorial";
    if (theme === "Photo First" || theme === "PhotoFirst") return "PhotoFirst";
    if (theme === "Dark Mode" || theme === "DarkMode") return "DarkMode";
    if (theme === "Card Layout" || theme === "CardLayout") return "CardLayout";
    if (theme === "Personal Journal" || theme === "PersonalJournal") return "PersonalJournal";
    return theme;
  };

  const toggleLike = (key) => {
    const isLiked = likedPosts[key];

    const newCount =
      (dataa?.[key] || 0) + (isLiked ? -1 : 1);

    // dataa stores the object containing all keys of likesCount
    // specific key ke hisaab se previous count leke
    // agar liked hai → unlike → -1
    // agar liked nahi hai → like → +1

    set(child(DB, `likesCount/${key}`), newCount);

    setLikedPosts({
      ...likedPosts,
      [key]: !isLiked,
    });

    if (isLiked) {
      setLiked(liked.filter((id) => id !== key));
    } else {
      setLiked([...liked, key]);
    }
  };

  const activeBlog = (key)=>{
   
   const blogId = key;

   // pass this only 1 things in URL

   navigation(`/comment/${blogId}`)

  }

  // give preview
  
  

  useEffect(() => {
    const currentUser = JSON.parse(
      localStorage.getItem("CurrentUser")
    );

    get(child(DB, `liked/by${currentUser}`)).then((snap) => {
      const data = snap.val() || [];
      setLiked(data);

      // still after this line .. how can data be cleared from firebase
      const obj = {};
      data.forEach((k) => (obj[k] = true));
      setLikedPosts(obj);
    });

    // agar ye cheez run ho jaye toh saara kaam hi khatam ho jaye
    get(child(DB, "AllBlogs")).then((snap) => {
      const data = snap.val();
      if(!data) return;
      setData(data);

      const allKeys = Object.keys(data);
      setKeys(
        allKeys.filter(
          (k) => data[k].Author !== currentUser
        )
      );
    });


   // count the number of comments ... and display ... 

   get(child(DB,`Comments`))
   .then(snap=>{
    var data = snap.val();
    if(!data) return;
  //  console.log(Object.keys(data[1768553066666]).length) // this is giving me 6 .. the correct lenth .. according to particular key 
    // but when i try to do the same in my return method .. 
    setCmnt(data)
   })

   // set false

   localStorage.setItem("allow" , JSON.stringify(false))

   localStorage.setItem("edit" , JSON.stringify(false))



    get(child(DB,`UserAuth`))
           .then(snap=>{
             var data = snap.val();
             if(!data) return;
             var keys = Object.keys(data) // all keys 

              var name = Name || JSON.parse(localStorage.getItem("CurrentUser"))

              var foundKey = keys.find(key=>data[key].Name == name)

              if(!foundKey) return;

              setResObj({
                ...resObj,
                Name : data[foundKey].Name,
                About : data[foundKey].About  ? data[foundKey].About : "",
                Img : data[foundKey].Img  ? data[foundKey].Img : "",
              })
           })

           // now code for .. to fetcht the image for particular author 

       
       
   

  }, []);

  useEffect(() => {
    const likesRef = child(DB, "likesCount");

    onValue(likesRef, (snap) => {
      setdataa(snap.val() || {});
    });
  }, []);

  useEffect(() => {
    const currentUser = JSON.parse(
      localStorage.getItem("CurrentUser")
    );

    if (!currentUser) return;
    if (liked.length === 0) return; // 🛡️ guard

    set(child(DB, `liked/by${currentUser}`), liked);
  }, [liked]);

  return (
    <div className="explore-page">
      <section className="explore-hero">
        <h1>Discover Blogs Created by Creators</h1>
        <p>
          Explore beautiful blog projects crafted by writers,
          developers, and designers from around the world.
        </p>
      </section>

      <section className="projects-section">
        <h2>Featured Projects</h2>

        <div className="projects-grid">
          {data &&
            keys.map((key) => (
              <div className="project-card" key={key}>
                <div
                  className="project-image"
                  style={{
                    backgroundImage: `url(${
                      data[key].Img || "/city.jpg"
                    })`,
                  }}
                />

                <div className="project-info">
                  <h3 className="project-title">
                    {data[key].Title}
                  </h3>

                  <div className="project-meta">
                    <span className="theme-tag">
                      {data[key].Theme}
                    </span>

                    <span style={{marginLeft:"50px"}} className="author-name">
                      By {data[key].Author}
                    </span>

                      <img onClick={()=>navigation(`/urProfile/${data[key].Author}`)}  style={{height:"40px" , marginLeft:"10px" , width:"45px" , borderRadius:"50%" , cursor:"pointer"}} src={ data[key].proImg ? data[key].proImg : "/profilePic.jpg"} alt="user" />


                  </div>

                  <p className="project-desc">
                    {data[key].WhatAuthorSays}
                  </p>

                  <div className="project-actions">
                    <button onClick={()=>navigation(`/${routeForTheme(data[key].Theme)}/${data[key].Title}`)} className="preview-btn">
                      Preview
                    </button>

                    <button
                      className={`like-btn ${
                        likedPosts[key] ? "liked" : ""
                      }`}
                      onClick={() => toggleLike(key)}
                    >
                      ♥
                    </button>

                    <p>{dataa && dataa[key]}</p>

                     {/* adding comment icon */}

                    <button
                    className="comment-btn"
                    onClick={()=>activeBlog(key)}
                     >
                       💬
                    </button>
          
                  <p>
  {cmnt && cmnt[key]
    ? Object.keys(cmnt[key]).length
    : 0}
</p>

                    {/* like here this all kept should me the same value at .. + according to map method .. key .. always changes each round .. but still  */}

                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>

      <section className="promo-section">
        <div className="promo-left">
          <h2>Create Your Blog Today</h2>
          <p>
            Launch your own professional blog in minutes.
            Choose from beautifully designed templates and
            start writing.
          </p>

          <h3>🎉 Get 50% OFF on New Blog Creation</h3>
          <button>Create Blog</button>
        </div>

        <div className="promo-right">
          <div className="promo-image"></div>
          <div className="promo-image"></div>
        </div>
      </section>

      <section className="extra-section">
        <h2>Built for Writers. Loved by Readers.</h2>
        <p>
          Clean layouts, responsive design, and smooth
          performance — everything you need for modern
          blogging.
        </p>
      </section>
    </div>
  );
}

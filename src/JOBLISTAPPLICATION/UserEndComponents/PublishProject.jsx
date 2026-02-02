import React, { useState , useEffect } from "react";
import "./PublishProject.css";
import { useParams } from "react-router-dom";
import { DB } from "../../OperationsWithFirebase/firebase";
import { get , set ,child, update ,ref ,onValue , off } from "firebase/database"; 

export default function PublishProject() {

  const {Theme , Title} = useParams()

  const [data , setData] = useState()

  const [desc , setDesc] = useState("")

    const [blogID , setBlogID] = useState("")

     const [allow , setAllowance] = useState(false)

     const[blogData , setBlogData] = useState()

  const prms ={
    start :{
        Theme:Theme,
        Title:Title
    }
  }


  const handlePublish = ()=>{

     

    // now set the .. data into firebase
     var userName = JSON.parse(localStorage.getItem("CurrentUser")) // Name 
     if(JSON.parse(localStorage.getItem("edit")) != true){
        var blogid = Date.now(); // agar edit nhi kar rahe ho toh .. new ID generate maro 
        // state ki help se set maar isko
    //    setAllowance(true)  // pehle kayde se ye set ... hogi ... blogID se toh pehle hi hogi chahe  jo merzi time lag ja
       //  setBlogID(blogid)

       console.log(data[Title].Desc , desc)

            set(child(DB,`BLOGS/${userName}/${blogid}`) , {Title : prms.start.Title , Theme:prms.start.Theme , Desc:data[Title].Desc , 
        // now set the retrieved data
        Category : data[Title].category,
        Content : data[Title].content,
        Description:desc,
        Img:data[Title].img
      })

      // set blogs .. for all the community to see

      set(child(DB,`AllBlogs/${blogid}`)  , 
      {
        Author : userName,
        WhatAuthorSays:desc,
        Theme:prms.start.Theme,
        Title:prms.start.Title,
         Category : data[Title].category,
        Content : data[Title].content,
        Description:data[Title].Desc,
        Img:data[Title].img,
      }
    )

      alert("done just check now + both done ...")


     }
     else{
      alert("wanna edit???")
      // search karo .. pehle ... BLOGS me .. acc to title + description to get the desried blog id .. and set that 
      var CurrentUser = JSON.parse(localStorage.getItem("CurrentUser"))
      get(child(DB,`BLOGS/${CurrentUser}`))
      .then(snap=>{
        var data = snap.val()

        setBlogData(data)


        var keys = Object.keys(data) // Gaurav || currentUser li saari blog id 
        // ab search maar kis blog id .. ke obj me ... title and description same
        const blogid = keys.find(
        key => data[key].Title === JSON.parse(localStorage.getItem("blogToBeEdited"))
        );
        setAllowance(true) // pehle kayde se ye set ... hogi ... blogID se toh pehle hi hogi chahe  jo merzi time lag ja
        setBlogID(blogid)

       // alert(blogID)
      })

     } // else end

  }

  useEffect(()=>{
   // the the  blogs-content
   get(child(DB,"blogs-CONTENT"))
   .then(snap=>{
    var data = snap.val()
    setData(data)
   })

  
  },[])

  useEffect(()=>{

        // now set after retrieving the the info

        console.log(blogID) // 47
        console.log(allow) // true
        console.log(blogData)
      

             var userName = JSON.parse(localStorage.getItem("CurrentUser")) // Name 

              var blogTit = JSON.parse(localStorage.getItem("blogToBeEdited")) // Name 

        if(!allow) return;

          if (!blogID) return;

          if(!blogData) return;

          console.log( "before update" +  blogData[blogID])

      // pehle check marte hain ki kyaa cheeze .. new edited wale me hia .. 
      // jo cheeze filled hain sirf unhi ko update marenge

      var obj = {};
      // now new edited data .. already fetched hai .. neeche .. data naam ki state me ..
      // blogID mere paas hai hi .. .. 
      // loop chalade filter ispe .. but first ye obj hai toh isko convery karle ... arraay me 

      // run loop
       const objjj = Object.keys(data[blogTit]).filter(
      key => data[blogTit][key] !== "" && data[blogTit][key] != null
     );

     // agar iss obj ke andar .. ve saari keys milti hain jo mujhe chaiye toh mai .. 
     // directly isse set kardunga ..update wale me
     // its the array of keys .. like [Title , desc ,Theme] .. ispe loop laga toh fir

     objjj.forEach(key => {
  obj[key] = data[blogTit][key];
});



    console.log("obj me kyaa hai : " + obj)

   

      update(child(DB, `BLOGS/${userName}/${blogID}`), obj);
     update(child(DB, `AllBlogs/${blogID}`), obj);

console.log( "before update" +  blogData[blogID])

      alert("done and updated successfully")

     

       const blogRef = ref(DB, `BLOGS/${userName}/${blogID}`);

  onValue(blogRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log("DB changed:", data);

         // now update ... blog content 

      update(child(DB, `blogs-CONTENT/${blogTit}`), obj);

    }
  });

  // cleanup (VERY IMPORTANT)
  return () => off(blogRef);
        

   
  },[allow, blogID, blogData])

  return (
    <div className="publish-wrapper">

      {/* Header */}
      <header className="publish-header">
        <h1>Publish Your Project</h1>
        <p>Show your work to the world</p>
      </header>

      {/* Main Card */}
      <div className="publish-card">

        {/* Left : Project Image (70%) */}
        <div className="project-preview">
          <div className="image-placeholder">
            Project Preview Image
          </div>
        </div>

        {/* Right : Project Info (30%) */}
        <div className="project-info">
          <h2>Project Details</h2>

          <div className="info-group">
            <label>Project Title</label>
            <input value={prms.start.Title} type="text" placeholder="Enter project title" />
          </div>

          <div className="info-group">
            <label>Selected Theme</label>
            <div className="theme-box">
              {prms.start.Theme}
            </div>
          </div>

          <div className="info-group">
            <label>Short Description</label>
            <textarea onChange={(e)=>setDesc(e.target.value)} placeholder="Briefly describe your project..." />
          </div>
        </div>

      </div>

      {/* Publish Button */}
      <div className="publish-action">
        <button className="publish-btn" onClick={handlePublish} >
          Publish Project
        </button>
      </div>

    </div>
  );
}

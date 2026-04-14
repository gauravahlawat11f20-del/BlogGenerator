import React, { useEffect, useState } from "react";
import "./ProfileInfo.css";
import { DB } from "../../OperationsWithFirebase/firebase";
import { get, child, set , remove, ref, update } from "firebase/database";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../components/ToastProvider";

export default function ProfileInfo() {

  const [obj , setObj] = useState({
    Name : "gauravAhlawat",
    About : "sahi hoon tum sunao",
    Img:"/city.jpg"
  })

  const [resObj , setResObj] = useState({
    Name : "",
    About : "",
    Img:""
  })

  const [edit, setEdit] = useState(false);

  const [username , setUsename] = useState()
  const [data , setData] = useState()

  const {Name} = useParams()
  const toast = useToast()

  var getparam = {
    start :{
       Name : Name
    }
  }

  const navigatation = useNavigate()

  const handleFileUrl = (e)=>{
     const file = e.target.files[0]
     const reader = new FileReader()
     reader.readAsDataURL(file)
  
   reader.onload = function(){
     setObj({...obj , Img:reader.result})
   }
  }

  // /* EDIT PART */ //

  const handleEdit = async () => {
  try {
    var CurrentUser = JSON.parse(localStorage.getItem("CurrentUser"));
    if (!CurrentUser) return;

    var CurrentAbout =
      "Hi, I'm Gaurav - a passionate Front-End Developer who loves turning ideas into visually stunning, user-friendly, and responsive digital experiences.";

    let Name = obj.Name === "" ? CurrentUser : obj.Name;
    let About = obj.About === "" ? CurrentAbout : obj.About;
    let Img = obj.Img === "" ? "/profilePic.jpg" : obj.Img;

    /* ---------------- USER AUTH ---------------- */

    const authSnap = await get(child(DB, "UserAuth"));
    if (!authSnap.exists()) {
      toast.error("User profile not found in database.");
      return;
    }
    if (authSnap.exists()) {
      var data = authSnap.val();
      var keys = Object.keys(data);

      var desriedKey = keys.filter(
        key => data[key].Name === CurrentUser
      );

      for (const key of desriedKey) {
        await update(child(DB, `UserAuth/${key}`), {
          Name,
          About,
          Img
        });
      }
    }

    toast.success("Updation in Auth done!");

    /* ---------------- ALL BLOGS ---------------- */

    const allBlogsSnap = await get(child(DB, "AllBlogs"));
    if (allBlogsSnap.exists()) {
      var data = allBlogsSnap.val();
      var keys = Object.keys(data);

      var AllBlogsDesiredKey = keys.filter(
        key => data[key].Author === CurrentUser
      );

      for (const key of AllBlogsDesiredKey) {
        await update(child(DB, `AllBlogs/${key}`), {
          Author: Name
        });
      }
    }

    toast.success("AllBlogs updated!");

    /* ---------------- BLOGS (RENAME KEY) ---------------- */

    const blogsSnap = await get(child(DB, "BLOGS"));
    if (blogsSnap.exists()) {
      var data = blogsSnap.val();
      var keys = Object.keys(data);

      var names = keys.filter(name => name === CurrentUser);

      for (const name of names) {
        var oldObj = data[name]; // already have it, no extra get

        // create new key first (safe)
        await set(child(DB, `BLOGS/${Name}`), oldObj);

        // then delete old key
        await remove(child(DB, `BLOGS/${name}`));
      }
    }

    toast.success("BLOGS updated!");

    /* ---------------- change liked ---------------- */

var likedSnap = await get(child(DB, `liked/by${CurrentUser}`))

if (likedSnap.exists()) {   // agar snap hai toh
   var arr = likedSnap.val() // ab ye sahi hai

   // pehle new key pe set
   await set(child(DB, `liked/by${Name}`), arr)

   // phir old key delete
   await remove(child(DB, `liked/by${CurrentUser}`))
}

toast.success("Liked updated!")


/* ---------------- COMMENTS ---------------- */

const commentsSnap = await get(child(DB, "Comments"));

if (commentsSnap.exists()) {
  const data = commentsSnap.val();
  const allBlogIDS = Object.keys(data);

  for (const blogID of allBlogIDS) {
    const blogComments = data[blogID];
    if (!blogComments) continue;

    const allCommentIDS = Object.keys(blogComments);

    for (const commentID of allCommentIDS) {
      const comment = blogComments[commentID];
      if (!comment) continue;

      if (comment.DoneBy === CurrentUser) {
        await update(
          child(DB, `Comments/${blogID}/${commentID}`),
          { DoneBy: Name }
        );
      }
    }
  }
}

toast.success("Comments updated!");

  // ekk cheez aur update karni hai .. 

  var AllBlogsSnap = await get(child(DB,`AllBlogs`))
    if(AllBlogsSnap.exists()){
      var data  = AllBlogsSnap.val()
      var blogIDS = Object.keys(data)

     var desiredBlogIDS = blogIDS.filter(blogID=> data[blogID].Author == Name) // multiple ho sakti hai

     for(const bgID of desiredBlogIDS ){
      await update(child(DB,`AllBlogs/${bgID}`) , {proImg : obj.Img ? obj.Img :"/profilePic.jpg"} )
     }
    }

    toast.success("Image upload complete")
  
  // now move 

  navigatation("/") // done
     

  } catch (error) {
    console.error(error);
    toast.error("Something went wrong");
  }
};
 //  edit part ends .......

 
  const handlePreview = (theme , title)=>{

     if(getparam.start.Name == JSON.parse(localStorage.getItem("CurrentUser"))){
          localStorage.setItem("edit" , JSON.stringify(true))
     }

  
    // edit kar sakte hain + navigate karo do .. with theme and title name to the page ... 
    const routeForTheme = (themeName) => {
      if (themeName === "Minimal Clean" || themeName === "MinimalCleanTheme") return "MinimalCleanTheme";
      if (themeName === "Editorial") return "Editorial";
      if (themeName === "Photo First" || themeName === "PhotoFirst") return "PhotoFirst";
      if (themeName === "Dark Mode" || themeName === "DarkMode") return "DarkMode";
      if (themeName === "Card Layout" || themeName === "CardLayout") return "CardLayout";
      if (themeName === "Personal Journal" || themeName === "PersonalJournal") return "PersonalJournal";
      return themeName;
    };

    navigatation(`/${routeForTheme(theme)}/${title}`)
  }

  useEffect(()=>{
    var name =  getparam.start.Name || JSON.parse(localStorage.getItem("CurrentUser"))

    get(child(DB,`UserAuth`))
    .then(snap=>{
      var data = snap.val();
      if(!data) return;
      var keys = Object.keys(data) // all keys W

     var foundKey = keys.find(key=>data[key].Name == name)

     if(!foundKey) return;

     if(data[foundKey].About !== "" && data[foundKey].About !== null ){
      setResObj({
        ... resObj , Name : data[foundKey].Name,
         About : data[foundKey].About ? data[foundKey].About : "",
          Img : data[foundKey].Img  ? data[foundKey].Img : "",
      })
     }
    })




    setUsename(name)

    // pehle hi set maar deta hoon .. fireabse me profile info ko 

  
  },[])

  useEffect(()=>{

    console.log(resObj)

    if(resObj.Name == "" && resObj.About == "" && resObj.Img == ""){
          console.log(resObj.Name)
      return;
    }

    console.log(resObj.About)

    },[resObj])

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
    console.log(data)
    if(!data) return
     console.log(data)

  },[data])

  return (
    <div className="profile-page">

      {/* ================= PROFILE HEADER ================= */}
      <section className="profile-header">
        <div className="profile-left">
          <div className="profile-pic">
            <img src={resObj.Img !== "" ? resObj.Img : "/profilePic.jpg"} alt="profile" />
          </div>
        </div>

        <div className="profile-right">
          <h1 className="profile-name">{username}</h1>
       
          <p className="profile-desc">
            {
              resObj.About !== "" ? resObj.About : " Hi, I'm Gaurav - a passionate Front-End Developer who loves turning ideas into visually stunning, user-friendly, and responsive digital experience"
            }
          
               
          </p>
       
        </div>

      </section>

      {/* ================= BLOG PROJECTS ================= */}
      <section className="profile-projects">
        <h2>Published Blog Projects</h2>

        <div className="projects-list">
         
          {/* real objects */}
            { data  &&
            Object.keys(data).map(key=>(

                <div className="profile-project-card">
  <div className="profile-project-img">
    <img src={data[key].Img ? data[key].Img : "/profilePic.jpg"} alt="blog" />
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
                <input onChange={handleFileUrl} type="file" />

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

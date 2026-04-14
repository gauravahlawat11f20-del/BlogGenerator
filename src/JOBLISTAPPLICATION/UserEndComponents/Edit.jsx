import { child, get , update } from 'firebase/database'
import React, { useEffect } from 'react'
import { DB } from '../../OperationsWithFirebase/firebase'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Edit = () => {

    const [blogID , setBlogID] = useState()

    const [updated , setUpdated] = useState(false)

    const navigation = useNavigate();

  useEffect(()=>{

      var CurrentUser = JSON.parse(localStorage.getItem("CurrentUser"))

    //  first get the .. ID 
 
   get(child(DB,`BLOGS/${CurrentUser}`))
    .then(snap=>{
        var data = snap.val(); // saari ids of the gaurav
        if(!data) return;

        var ids = Object.keys(data) // saari keys .. ab inpe laga .. 

         const blogid = ids.find(
        id => data[id].Title === JSON.parse(localStorage.getItem("blogToBeEdited"))
        );

        setBlogID(blogid)
    })

  },[]) // when page loads

   
  useEffect(() => {
  if (!blogID) return;

  const updateBlog = async () => {
    const blogTitle = JSON.parse(localStorage.getItem("blogToBeEdited"));
    const CurrentUser = JSON.parse(localStorage.getItem("CurrentUser"));

    // 1️⃣ WAIT for data

   var snap = await get(
  child(
    DB,
    `blogs-CONTENT/${blogTitle}`
  )
)

  const data = snap.val();
  if(!data) return;

  console.log(data)

  var obj = {};

  const keys = Object.keys(data).filter(
    (key) => data[key] !== "" && data[key] !== null && data[key].one !== ""
  );

  keys.forEach((key) => {
    obj[key] = data[key];
    // console.log(data[key])
  });

  console.log(obj); // this is the new obj i wanna set into firebase

    
    // 2️⃣ WAIT for updates
    await update(child(DB, `BLOGS/${CurrentUser}/${blogID}`), obj);
    await update(child(DB, `AllBlogs/${blogID}`), obj);

    // 3️⃣ NOW read again
    const checkSnap = await get(child(DB, `BLOGS/${CurrentUser}`));
    console.log("UPDATED DATA:", checkSnap.val());

    setUpdated(true);
  };

  updateBlog();

}, [blogID]);

useEffect(()=>{

  if(updated){

    setTimeout(() => {
      navigation(`/urProfile/${JSON.parse(localStorage.getItem("CurrentUser"))}`)
    }, 2000);

  }

},[updated])



  return (
    <div style={{display:"flex" , justifyContent:"center" , alignItems:"center" , backgroundColor:"#ffffff"}} >
        {
           updated ?  "updated successfully" :  (<>  <img src="/update.gif" alt="Loading..." /> </>)
        }
      
    </div>
  )
}

export default Edit

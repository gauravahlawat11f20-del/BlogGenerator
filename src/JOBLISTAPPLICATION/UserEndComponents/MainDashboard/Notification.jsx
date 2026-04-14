import React, { useEffect, useState } from "react";
import "./Notification.css";
import { DB } from "../../../OperationsWithFirebase/firebase";
import { child, get } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../components/ToastProvider";

export default function Notification() {
  const [arr, setArr] = useState([]);

  const [time , setTime] = useState()

  const [data , setData] = useState()

  const navigate = useNavigate()
  const toast = useToast()

   useEffect(() => {
  console.log("runs again");

     localStorage.removeItem("msg") // done

      const funcc=async()=>{

        var dts = await get(child(DB,`AllBlogs`)) // saare blogs
        if(dts.exists()){
            var data = dts.val()
            // now set that to a state
            setData(data)
        }

      }
      
     funcc()
              


}, []);


useEffect(()=>{

  // paste

    const currentUser = JSON.parse(localStorage.getItem("CurrentUser"));
  if (!currentUser) return;

  let tempArr = []; // 🔑 local array (NOT state)

  let correctTime = [];

  get(child(DB, `BLOGS/${currentUser}`))
    .then((snap) => {
      const data = snap.val();
      if(!data) return;
      const keys = Object.keys(data); // blogIds

      keys.forEach((blogId) => {
        get(child(DB, `Comments`))
          .then((snap) => {
            const commentsData = snap.val();
            if(!commentsData) return;
            const blogsWhichHaveComments = Object.keys(commentsData); // all blog IDS

            blogsWhichHaveComments.forEach((commentBlogId) => { // scaning all blog id one by one !!!
              if (commentBlogId === blogId) {
        
                // then ye commentBlogId .. uss blog ki id .. 
                // ab mujhe finally .. iske corresponding blog ka naam pata karna hai
                
             

              

                Object.keys(commentsData[commentBlogId]).forEach((cmntId) => {
                  // ✅ ONLY CHANGE: push into temp array

                if(commentsData[commentBlogId][cmntId].DoneBy == currentUser){
                   return ;
                }
                 tempArr.push(  { Title : data[commentBlogId].Title , comment : commentsData[commentBlogId][cmntId]  } );
                
                  // an time to convert maro proper time me 

                


                });
              }
            });

            // tip === use Object.values(obj) to covert ...
            // {  {} , {} , {}  } . into [{} , {} , {}]
            // in my case i have using an temp array .. so mujhe bss usme push karna hai dataObj ko 
            // so there is no need for me .. to use this here ...
            

              tempArr.sort((a, b) => b.comment.Time - a.comment.Time); // sorted my time ... newest will be shown first ...

              tempArr.forEach(obj =>{

                   const timestamp = obj.comment.Time; // 1768553066666

                     const date = new Date(timestamp);

                  const time = date.toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  });  

                  correctTime.push(time);

              })

             
             setTime(correctTime)
            // 🔑 update state ONCE per blog fetch completion
            setArr([...tempArr]);
          });
      });
    });
    
},[data])

useEffect(()=>{
    console.log(arr)

},[arr])

const handleView = async(title , msg)=>{

  var allblogsSnap = await get(child(DB,`AllBlogs`))
  if(allblogsSnap.exists()){
    var data = allblogsSnap.val()
    var keys = Object.keys(data)
   var myKey = keys.filter(key=> data[key].Title == title)
   if(!myKey || myKey.length === 0) return;

   localStorage.setItem("msg" , JSON.stringify(msg))

   toast.info(msg)
   
   navigate(`/comment/${myKey[0]}`)
   // bhejta nhi hoon .. warna .. app.jsx me ched chaad + agar koi aur user comment karega toh bhi .. add karna padega url me 
   // aur what happen if .. url me bhi wahi same naam hua jo .. comment msg me hai ... then it will cause me good issue 
   // isliye local me chadate hain 


  }
   
}



  return (
    <div className="notification-page">
      <h2 className="notification-title">Notifications</h2>

      <div className="notification-list">
        {arr.length === 0 && (
          <p className="no-notification">No notifications yet</p>
        )}

        {arr.map((item, index) => (
          <div className="notification-card" key={index}>
            <p className="notification-text">
              <span className="user-name">{item.comment.DoneBy}</span>{" "}
              commented on your blog <span style={{color:"green"}}>{item.Title}</span>
              <button onClick={()=>handleView(item.Title , item.comment.Message)} style={{backgroundColor:"lightBlue" , marginLeft:"20px"}} >view</button>
            </p>

            <p className="notification-message">
              “{item.comment.Message}”
            </p>

            <p>
                {time[index]}
            </p>

            

          </div>
        ))}
      </div>
    </div>
  );
}

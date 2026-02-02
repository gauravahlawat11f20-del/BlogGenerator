import React, { useEffect, useState } from "react";
import "./Notification.css";
import { DB } from "../../../OperationsWithFirebase/firebase";
import { child, get } from "firebase/database";

export default function Notification() {
  const [arr, setArr] = useState([]);

  const [time , setTime] = useState()

   useEffect(() => {
  console.log("runs again");

  const currentUser = JSON.parse(localStorage.getItem("CurrentUser"));
  if (!currentUser) return;

  let tempArr = []; // 🔑 local array (NOT state)

  let correctTime = [];

  get(child(DB, `BLOGS/${currentUser}`))
    .then((snap) => {
      const data = snap.val();
      const keys = Object.keys(data); // blogIds

      keys.forEach((blogId) => {
        get(child(DB, `Comments`))
          .then((snap) => {
            const commentsData = snap.val();
            const blogsWhichHaveComments = Object.keys(commentsData);

            blogsWhichHaveComments.forEach((commentBlogId) => {
              if (commentBlogId === blogId) {

              

                Object.keys(commentsData[commentBlogId]).forEach((cmntId) => {
                  // ✅ ONLY CHANGE: push into temp array

                 if(commentsData[commentBlogId][cmntId].DoneBy == currentUser){
                    return ;
                }
                  tempArr.push(commentsData[commentBlogId][cmntId]);
                
                  // an time to convert maro proper time me 

                


                });
              }
            });

            // tip === use Object.values(obj) to covert ...
            // {  {} , {} , {}  } . into [{} , {} , {}]
            // in my case i have using an temp array .. so mujhe bss usme push karna hai dataObj ko 
            // so there is no need for me .. to use this here ...
            

              tempArr.sort((a, b) => b.Time - a.Time); // sorted my time ... newest will be shown first ...

              tempArr.forEach(obj =>{

                   const timestamp = obj.Time; // 1768553066666

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
}, []);

useEffect(()=>{
    console.log(arr)

},[arr])



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
              <span className="user-name">{item.DoneBy}</span>{" "}
              commented on your blog
            </p>

            <p className="notification-message">
              “{item.Message}”
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

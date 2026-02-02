import React, { useEffect, useState } from "react";
import "./Comment.css";
import { DB } from "../../../OperationsWithFirebase/firebase";
import { set, child, get } from "firebase/database";
import { useParams } from "react-router-dom";
import { serverTimestamp } from "firebase/database";

export default function Comment() {
  const [message, setMessage] = useState("");
  const [data, setdata] = useState();
  const [allow, setAllow] = useState();

  const [time,setTime] = useState([])

  const { blogId } = useParams();

  const getPrms = {
    start: {
      blogId: blogId,
    },
  };

  const sendComment = () => {
    if (!message) {
      alert("write something");
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem("CurrentUser"));
    var commentId = Date.now();

    set(child(DB, `Comments/${getPrms.start.blogId}/${commentId}`), {
      DoneBy: currentUser,
      Message: message,
      Time: serverTimestamp(),
    });

    setMessage("");
    setAllow(1);
  };

  useEffect(() => {
    get(child(DB, `Comments/${getPrms.start.blogId}`)).then((snap) => {
      var data = snap.val();
      if (!data) return;
      setdata(data);
    });
    // onvalue should be used to make it fast
       
   


  }, [allow]);



  useEffect(()=>{

     if (!data) return;   // 🛡️ GUARD — MOST IMPORTANT


     let correctTime = []

     const realdata = Object.values(data)
     realdata.forEach(obj=>{

     const timestamp = obj.Time; // 1768553066666

                     const date = new Date(timestamp);

                  const time = date.toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  });  

                 correctTime.push(time)



     })

     setTime(correctTime)



  },[data])

  return (
    <div className="comment-fullscreen">
      <div className="comment-container">
        <h2 className="comment-title">Comments</h2>

        <div className="comments-list">
          {data &&
            Object.keys(data).map((key , index) => (
              <div className={ data[key].DoneBy == JSON.parse(localStorage.getItem("CurrentUser")) ? "special" : "comment" } key={key}>
                <p className="comment-user">{data[key].DoneBy}</p>
                <p className="comment-message">{data[key].Message}</p>
                <p className="comment-time">
                  { /* String(data[key].Time) */}
                  {String(time[index])}
                </p>
              </div>
            ))}
        </div>

        <div className="comment-input-box">
          <input
            type="text"
            placeholder="Write a comment..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendComment}>Send</button>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import "./Comment.css";
import { DB } from "../../../OperationsWithFirebase/firebase";
import { set, child, get } from "firebase/database";
import { useParams } from "react-router-dom";
import { serverTimestamp } from "firebase/database";
import { useToast } from "../../../components/ToastProvider";

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

  const [likeObj , setLikeObj] = useState({})

  const [like , setLike] = useState([])

  const [eligible , seteligibility] = useState(false)


  const [cmntData , setCmntData] = useState()

  const [cmntIDS , setCmntIDS] = useState([])

  // NOW MAIN OBJE

  const [obje , setObje] = useState({})

  // pop up

  const [popUp,setPopUp] = useState(false)

  const [arr , setArr] = useState([])
  const toast = useToast()
  

  const Toggle = (key)=>{

   const isLiked = !!likeObj[key];

   setLikeObj(prev => ({
    ...prev ,
    [key] : !isLiked
   }))

   seteligibility(true)

   if(isLiked){
      setLike(prev => prev.filter(k => k !== key))
   }
    else{
       setLike(prev => [...prev , key ])
    }

    // ready
    // yahan set karte hain .. acha rahega nhi toh kuch aur dekhenge lekin haar nhi manenge
  }

      const fetchComments=async()=>{

    var fetCmntSnap =  await  get(child(DB,`Comments/${getPrms.start.blogId}`))
    if(fetCmntSnap.exists()){
         var data = fetCmntSnap.val()
    var cmntid = Object.keys(data)
    setCmntIDS(cmntid)
    }
      // ye aram se fetch hua hai yahan koi isuue nhi hai
    }

  useEffect(()=>{

    fetchComments() // ye already set hai ...
  },[]) // sabse pehle kya karo ki


  // yahn marta hoon 

      const fetchLikes=async()=>{

        if(eligible == true){
             fetchComments() // pehle comments reset hone hi hone chahie
        }

       

         var obje = {};
   

   for(const cmntid of cmntIDS){ // ye synchronus hai
     // / first comment id ..
      // ab isko check maar ki kahi ye toh nhi hai 

      console.log("dekhte hai kitni aati hai " + cmntid)

      console.log("yahan aaya nhi hai yaaa nhi .. ")

      var count = 0;

    var comntLikedSnap = await get(child(DB,`CommentLiked`)) // kahi yahan pe time lag gaya ho .. isliye pehle wahan gya vo ...
      // and ye async hai .. toh call marke .. aage badhega lekin.. .then bhi toh hia na !!!
         if(comntLikedSnap.exists()){
        var data = comntLikedSnap.val()
        if(!data) return ;  // ab return nhi hoga . proper fetch hoga tab frint ghoga

        var Users = Object.keys(data) // saare Users
       // console.log(Users) safe

        for(const user of Users){ // pehla user hazir ho .. batao tumne konsa konsa cmnt like kiya hai 
              var cmntsLikedByThisUser = data[user]
            //  console.log(cmntsLikedByThisUser , cmntid) // bilkul safe hai
            var total =  cmntsLikedByThisUser.filter(cmnt=> cmnt == cmntid)
          //  console.log(total , total.length) // safe
              count = count + total.length 
              
        } 
        // yahan set kardo obj me 
      //  console.log(count)
        obje[cmntid] = count; // ho chuki hai doston
      //  console.log(obje) // safe jo mai chata tha wahi hua ... 
        count = 0; // but ... the values are good and as expected to me
       seteligibility(false)
       // its time to put the data to firebase

      // set(child)


 } 

} // exists end

     console.log(obje) // now this will work
     // now set this obje to a stATE
     setObje(obje)

  } // func ends




  useEffect(()=>{

    console.log(cmntIDS)

  



  fetchLikes()
     
  
    //  why the control is going to this line before
    // this line is printer first .. the obje and count are blank there

  },[cmntIDS])

  

  useEffect(()=>{
    console.log(obje)
  },[obje])

  useEffect(()=>{
      console.log(likeObj)
      // agar yahan update ho gayi hai toh kyaa isse yahan karne ki jarurat hai
   
    
  },[likeObj])

  useEffect(()=>{
    console.log(likeObj)

    

  // fetch the data

  var CurrentUser = JSON.parse(localStorage.getItem("CurrentUser"))

  // like array ke andar ve saari keys set karo

   get(child(DB , `CommentLiked/by${CurrentUser}`))
   .then(snap=>{
    var data = snap.val()
    if(!data) return; // wapas bhejdo ...
    setLike(data)
   })


 
   // fetch like counts here

   get(child(DB,`CommentLikesCount`))
   .then(snap=>{
    var data = snap.val() 
    if(!data) return; // starting me toh return ho jayega ...

    var cmntIds = Object.keys(data)  // all the commentIDS

    // set that data into state 
      setCmntData(data) // directly rerender kara lo .. return me simple .. but abb set kaise karoge
   })

  },[])

  useEffect(()=>{
    console.log(like)
    console.log("now the array is " + like)
    console.log(eligible) // false hi rahegi

     var CurrentUser = JSON.parse(localStorage.getItem("CurrentUser"))


       const useFunc = async()=>{
    if(eligible){
    await set(child(DB,`CommentLiked/by${CurrentUser}`) , like)
      console.log("now the array is " + like)
      fetchLikes() // perfect i think
    } 
   }

   useFunc()

   
    // yahan pe karte hain
       get(child(DB , `CommentLiked/by${CurrentUser}`))
    .then(snap=>{
      var data = snap.val()
      if(!data) return;

      var objj = {};

       for(const key of data){
        console.log("key is" + key) // ekk set hua nhi .. dusra hogya aur overwrite kardiya
        objj[key] = true
       //  setLike([...like , key ])
         // isse bahar karu kyaa set
      console.log(key)
       }

         setLikeObj(prev => ({
    ...prev ,
     ...objj
  })) 
        


    })

    // end




},[like])

// comment liked by pop up

const handleLikedBy = async(key)=>{
 // alert("hii")
  setPopUp(true)
  setArr([])
  // chao ye pehle kar dete hain 
  // key leke searh karte hain 
    var commentSnap = await get(child(DB,`CommentLiked`))
    if(commentSnap.exists()){
      var data = commentSnap.val()
      var likedBys = Object.keys(data) // now search in this arr now by one 
      
      for(const likedBy of likedBys ){
          var cmntLikedByThisUser = data[likedBy] // pehle user ke comments hazir ho aur  ye ekk array hai
         var liked = cmntLikedByThisUser.filter(cmnt =>cmnt == key)
         if(liked.length > 0){
            setArr(prev=>[...prev , likedBy]) // updated
         }
      }
    }
}

useEffect(()=>{
  console.log(arr) // set ho chuki hain // agar ho chuki hai toh dikha do
},[arr])

  const sendComment = () => {
    if (!message) {
      toast.error("Write something");
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
    setAllow(prev => (prev || 0) + 1);
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

       {popUp && (
  <div className="popup-backdrop" onClick={() => setPopUp(false)}>
    <div
      className="popUp"
      onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
    >
      {arr &&
        arr.map((item, i) => (
          <p key={i}>{item}</p>
        ))}

      <button onClick={() => setPopUp(false)}>Cancel</button>
    </div>
  </div>
)}



        <h2 className="comment-title">Comments</h2>

        <div className="comments-list">
          {data &&
            Object.keys(data).map((key , index) => (
              <div className={ data[key].DoneBy == JSON.parse(localStorage.getItem("CurrentUser")) ? "special" : `comment                ${data[key].Message == JSON.parse(localStorage.getItem("msg"))  ? "spec"  : ""    }              `  } key={key}>

                <div className="author-like">
                <p className={`comment-user`}>{data[key].DoneBy}</p>

               
                    <button
                     className={`like-btn ${likeObj[key] == true ? "liked" : ""}`}
                     onClick={()=>Toggle(key)} 
                    >
                      ♥
                    </button>

                     <p onClick={()=>handleLikedBy(key)} className="xxx" >{obje[key]>0 ? obje[key] : "0"}</p>

                   </div>

                

                <p className={`comment-message`} >{data[key].Message}</p>

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

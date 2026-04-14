import { useState , useEffect} from "react";
import "./CreateBlog.css";
import { DB } from "../../../OperationsWithFirebase/firebase";
import { set, child } from "firebase/database";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../../components/ToastProvider";

export default function CreateBlog() {

 const [obj , setObj] = useState({
  title:"",
  Desc:"",
  img:"",
  category:"",
  points:{
    one:"",
    two:"",
    three:"",
    four:"",
    five:""
  },
  content:""
 })

 const navigation = useNavigate()
 const toast = useToast()

 const {Name} = useParams()

 const themeName = {
  start:{
    Name:Name
  }
 }

 useEffect(()=>{
     setObj(prev => ({...prev , title : JSON.parse(localStorage.getItem("blogToBeEdited")) || "" }))
 },[])



 const handleFileChange = (e)=>{
         const file = e.target.files[0]
     const reader = new FileReader()
     reader.readAsDataURL(file)
  
   reader.onload = function(){
     setObj({...obj , img:reader.result})
   }
  }

  const handleClick = ()=>{

      localStorage.setItem("allow" , JSON.stringify(true))

    if(!obj.title.trim()){
      toast.error("Please enter a blog title");
      return;
    }

    if(!obj.Desc.trim()){
      toast.error("Please enter a short description");
      return;
    }

    set(child(DB , `blogs-CONTENT/${obj.title || JSON.parse(localStorage.getItem("blogToBeEdited"))}`)  , obj)
    toast.success("Item added successfully")

       if(JSON.parse(localStorage.getItem("edit")) === true){
      navigation("/edit")
    }
    else{

     

    console.log(themeName.start.Name)
   

  if(themeName.start.Name == "Minimal Clean"){
    navigation(`/MinimalCleanTheme/${obj.title}`)
  }
  else if(themeName.start.Name == "Editorial"){
    
     navigation(`/Editorial/${obj.title}`)
  }
  else if(themeName.start.Name == "Photo First"){
         navigation(`/PhotoFirst/${obj.title}`) // create a route for this also 
  }
  else if(themeName.start.Name == "Dark Mode"){
         navigation(`/DarkMode/${obj.title}`)
  }
  else if(themeName.start.Name == "Card Layout"){
         navigation(`/CardLayout/${obj.title}`)
  }
  else if(themeName.start.Name == "Personal Journal"){
         navigation(`/PersonalJournal/${obj.title}`)
  }
  else{
    toast.warn("Selected theme is not supported yet.");
  }

    }

   
  }

  return (
    <div className="create-blog-page">

      {/* HEADER */}
      <header className="create-header">
        <h1>Create New Blog</h1>
        <p>Write something meaningful. Your story matters.</p>
      </header>

      {/* FORM CARD */}
      <div className="blog-card">

        {/* TITLE */}
        <div className="form-group">
          <label>Blog Title</label>
          <input
            type="text"
            placeholder="Enter your blog title"
            onChange={(e)=>setObj({...obj , title:e.target.value})}
              value={
           JSON.parse(localStorage.getItem("edit")) == true
            ? JSON.parse(localStorage.getItem("blogToBeEdited")) || obj.title
                : obj.title
            }
          />
        </div>

        {/* SUBTITLE */}
        <div className="form-group">
          <label>Short Description</label>
          <input
            type="text"
            placeholder="A short summary of your blog"
             onChange={(e)=>setObj({...obj , Desc:e.target.value})}
          />
        </div>

        {/* COVER IMAGE */}
        <div className="form-group">
          <label>Cover Image</label>
          <input type="file"
           onChange={handleFileChange} />
          
        </div>

        {/* CATEGORY */}
        <div className="form-group">
          <label>Category</label>
          <select   onChange={(e)=>setObj({...obj , category:e.target.value})} >
            <option>Select category</option>
            <option>Technology</option>
            <option>Lifestyle</option>
            <option>Fitness</option>
            <option>Travel</option>
            <option>Finance</option>
          </select>
        </div>

        {/* list */}
         <div className="form-group">
         <label>Blog Content</label>
          <input type="text" placeholder="key points"   onChange={(e)=>setObj({...obj , points:{...obj.points, one:e.target.value}})}   />
           <input type="text" placeholder="key points"   onChange={(e)=>setObj({...obj , points:{...obj.points, two:e.target.value}})} />
            <input type="text" placeholder="key points"   onChange={(e)=>setObj({...obj , points:{...obj.points, three:e.target.value}})} />
             <input type="text" placeholder="key points"  onChange={(e)=>setObj({...obj , points:{...obj.points, four:e.target.value}})} />
              <input type="text" placeholder="key points"   onChange={(e)=>setObj({...obj , points:{...obj.points, five:e.target.value}})} />
        </div>

        {/* CONTENT */}
        <div className="form-group">
          <label>Blog Content</label>
          <textarea
            rows="10"
            placeholder="Start writing your blog here..."
            onChange={(e)=>setObj({...obj , content:e.target.value})} 
          ></textarea>
        </div>

        {/* ACTIONS */}
        <div className="action-bar">
          <button className="draft-btn">Save as Draft</button>
          <button onClick={handleClick} className="publish-btn">Publish Blog</button>
        </div>

      </div>
    </div>
  );
}


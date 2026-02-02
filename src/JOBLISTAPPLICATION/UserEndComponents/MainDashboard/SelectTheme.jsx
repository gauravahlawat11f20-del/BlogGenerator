import React, { useEffect } from "react";
import "./SelectTheme.css";
import { useNavigate } from "react-router-dom";

const themes = [
  {
    id: 1,
    name: "Minimal Clean",
    desc: "Simple and distraction-free writing",
    img: "scr.png", // put your image URL here
  },
  {
    id: 2,
    name: "Editorial",
    desc: "Story-focused magazine style",
    img: "sss.png",
  },
  {
    id: 3,
    name: "Photo First",
    desc: "Big hero images, visual storytelling",
    img: "qwe.webp",
  },
  {
    id: 4,
    name: "Dark Mode",
    desc: "Modern dark theme for dev blogs",
    img: "abc.jpg",
  },
  {
    id: 5,
    name: "Card Layout",
    desc: "Perfect for tutorials and structured content",
    img: "def.webp",
  },
  {
    id: 6,
    name: "Personal Journal",
    desc: "Soft, diary-style personal writing",
    img: "wp4956754.jpg",
  },
];





export default function SelectTheme() {

    const navigation = useNavigate()

const hanndle = (blogTheme)=>{
  navigation(`/create/${blogTheme}`)
}

useEffect(()=>{
    localStorage.removeItem("blogToBeEdited");

},[])


  return (
    <div className="theme-page">
      {/* Header */}
      <header className="theme-header">
        <h1>Choose Your Blog Theme</h1>
        <p>Select a template to get started with your blog</p>
      </header>

      {/* Theme Cards */}
      <main className="theme-grid">
        {themes.map((theme) => (
          <div className="theme-card" key={theme.id}>
            <div className="preview">
            { theme.img &&  <img src={theme.img} alt={theme.name} /> }
            </div>
            <h3>{theme.name}</h3>
            <p>{theme.desc}</p>
            <button onClick={()=>hanndle(theme.name)} >Use Template</button>
          </div>
        ))}
      </main>
    </div>
  );
}

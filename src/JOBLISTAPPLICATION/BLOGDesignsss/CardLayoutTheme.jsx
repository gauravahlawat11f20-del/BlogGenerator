import React, { useEffect, useState } from "react";
import "./CardLayoutTheme.css";
import { useNavigate, useParams } from "react-router-dom";
import { DB } from "../../OperationsWithFirebase/firebase";
import { child, get } from "firebase/database";

export default function CardLayoutTheme() {
  const { Title } = useParams();
  const navigation = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    get(child(DB, "blogs-CONTENT")).then((snap) => {
      setData(snap.val());
    });
    localStorage.setItem("blogToBeEdited", JSON.stringify(Title));
  }, []);

  if (!data || !data[Title]) {
    return (
      <div className="cl-loader">
        <img src="/mst.gif" alt="Loading..." />
      </div>
    );
  }

  const blog = data[Title];
  const coverImage =
    blog.img || "https://images.unsplash.com/photo-1501785888041-af3ef285b470";

  return (
    <div className="card-layout-theme">
      <nav className="cf-navbar">
        <h2 className="cf-logo">{blog.title}</h2>
        <ul>
          <li>Rate</li>
          <li>Download</li>
          <li>Share</li>
          {JSON.parse(localStorage.getItem("allow")) === true ? (
            <li onClick={() => navigation(`/upload/CardLayout/${Title}`)}>
              Upload
            </li>
          ) : (
            ""
          )}
          {JSON.parse(localStorage.getItem("edit")) === true ? (
            <li onClick={() => navigation(`/create/Card Layout`)}>Edit</li>
          ) : (
            ""
          )}
        </ul>
      </nav>

      <section className="cl-hero">
        <img src={coverImage} alt="cover" className="cl-hero-img" />
        <div className="cl-hero-overlay">
          <span className="cl-kicker">{blog.category || "General"}</span>
          <h1>{blog.title}</h1>
          <p>{blog.Desc || "Visual-first storytelling with clean layouts."}</p>
        </div>
      </section>

      <section className="cl-content">
        <h2>The Story So Far</h2>
        <p>{blog.content || "Start writing your long-form content."}</p>
      </section>

      <section className="cl-lists">
        <h2>Key Takeaways</h2>
        <ul>
          <li>{blog.points?.one || "Organize content into clear sections."}</li>
          <li>{blog.points?.two || "Keep the core idea easy to scan."}</li>
          <li>{blog.points?.three || "Let visuals guide the reader."}</li>
          <li>{blog.points?.four || "Use short, meaningful phrases."}</li>
          <li>{blog.points?.five || "End with a memorable takeaway."}</li>
        </ul>
      </section>

      <section className="cl-image-story">
        <img src={coverImage} alt="story 1" />
        <img
          src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e"
          alt="story 2"
        />
        <img
          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
          alt="story 3"
        />
      </section>

      <section className="cl-long-content">
        <h2>Closing Notes</h2>
        <p>
          {blog.Desc ||
            "Wrap your readers with a final reflection that echoes the theme."}
        </p>
      </section>

      <footer className="cl-footer">
        <p>(c) 2026 CardLayout Theme</p>
      </footer>
    </div>
  );
}

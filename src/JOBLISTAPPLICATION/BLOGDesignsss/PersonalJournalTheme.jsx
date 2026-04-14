import React, { useEffect, useState } from "react";
import "./PersonalJournalTheme.css";
import { useNavigate, useParams } from "react-router-dom";
import { DB } from "../../OperationsWithFirebase/firebase";
import { child, get } from "firebase/database";

export default function PersonalJournalTheme() {
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
      <div className="pj-loader">
        <img src="/mst.gif" alt="Loading..." />
      </div>
    );
  }

  const blog = data[Title];

  return (
    <div className="personal-journal">
      <nav className="cf-navbar">
        <h2 className="cf-logo">{blog.title}</h2>
        <ul>
          <li>Rate</li>
          <li>Download</li>
          <li>Share</li>
          {JSON.parse(localStorage.getItem("allow")) === true ? (
            <li onClick={() => navigation(`/upload/PersonalJournal/${Title}`)}>
              Upload
            </li>
          ) : (
            ""
          )}
          {JSON.parse(localStorage.getItem("edit")) === true ? (
            <li onClick={() => navigation(`/create/Personal Journal`)}>
              Edit
            </li>
          ) : (
            ""
          )}
        </ul>
      </nav>

      <main className="pj-page">
        <header className="pj-header">
          <p className="pj-date">Dear Diary</p>
          <h1>{blog.title}</h1>
          <p className="pj-subtitle">
            {blog.Desc || "A personal reflection written from the heart."}
          </p>
        </header>

        <div className="pj-hero">
          <img src={blog.img || "/city.jpg"} alt="journal cover" />
          <div className="pj-hero-note">
            <h3>Quiet Morning</h3>
            <p>Small thoughts written while the world is still.</p>
          </div>
        </div>

        <section className="pj-content">
          <p>{blog.content || "Write your journal content here."}</p>
        </section>

        <section className="pj-list">
          <h3>Today I learned</h3>
          <ul>
            <li>{blog.points?.one || "Small steps bring big change."}</li>
            <li>{blog.points?.two || "Kindness is always noticed."}</li>
            <li>{blog.points?.three || "Quiet mornings are healing."}</li>
            <li>{blog.points?.four || "Gratitude shifts perspective."}</li>
            <li>{blog.points?.five || "Rest is productive too."}</li>
          </ul>
        </section>

        <section className="pj-cards">
          <div className="pj-card">
            <h4>Memory</h4>
            <p>Write down one thing you don't want to forget.</p>
          </div>
          <div className="pj-card">
            <h4>Gratitude</h4>
            <p>List three moments that made you smile today.</p>
          </div>
          <div className="pj-card">
            <h4>Tomorrow</h4>
            <p>One intention for the next day.</p>
          </div>
        </section>

        <footer className="pj-footer">
          <p>(c) 2026 PersonalJournal Theme</p>
        </footer>
      </main>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import "./DarkModeTheme.css";
import { useNavigate, useParams } from "react-router-dom";
import { DB } from "../../OperationsWithFirebase/firebase";
import { child, get } from "firebase/database";

export default function DarkModeTheme() {
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
      <div className="dm-loader">
        <img src="/mst.gif" alt="Loading..." />
      </div>
    );
  }

  const blog = data[Title];
  const hero = blog.img || "/city.jpg";

  return (
    <div className="dark-mode-theme">
      <nav className="cf-navbar">
        <h2 className="cf-logo">{blog.title}</h2>
        <ul>
          <li>Rate</li>
          <li>Download</li>
          <li>Share</li>
          {JSON.parse(localStorage.getItem("allow")) === true ? (
            <li onClick={() => navigation(`/upload/DarkMode/${Title}`)}>
              Upload
            </li>
          ) : (
            ""
          )}
          {JSON.parse(localStorage.getItem("edit")) === true ? (
            <li onClick={() => navigation(`/create/Dark Mode`)}>Edit</li>
          ) : (
            ""
          )}
        </ul>
      </nav>

      <header className="dm-hero" style={{ backgroundImage: `url(${hero})` }}>
        <div className="dm-hero-glow" />
        <div className="dm-hero-content">
          <p className="dm-kicker">{blog.category || "Tech"}</p>
          <h1>{blog.title}</h1>
          <p className="dm-sub">{blog.Desc || "A quiet story in neon."}</p>
        </div>
      </header>

      <main className="dm-main">
        <section className="dm-split">
          <div className="dm-card">
            <h2>Key Points</h2>
            <ul>
              <li>{blog.points?.one || "Focus on contrast and readability."}</li>
              <li>{blog.points?.two || "Use space to breathe in the dark."}</li>
              <li>{blog.points?.three || "Highlight only what matters."}</li>
              <li>{blog.points?.four || "Keep typography bold and clean."}</li>
              <li>{blog.points?.five || "Let images feel cinematic."}</li>
            </ul>
          </div>

          <div className="dm-card">
            <h2>Story</h2>
            <p>{blog.content || "No content added yet."}</p>
          </div>
        </section>

        <section className="dm-grid">
          <div className="dm-tile">
            <h3>Reader Mode</h3>
            <p>Comfortable lines, soft glow accents, and deep blacks.</p>
          </div>
          <div className="dm-tile">
            <h3>Midnight Palette</h3>
            <p>Charcoal surfaces with electric highlights.</p>
          </div>
          <div className="dm-tile">
            <h3>Focus Zones</h3>
            <p>Content areas tuned for long reads.</p>
          </div>
        </section>

        <section className="dm-strip">
          <div>
            <h3>Quote</h3>
            <p>
              “Dark interfaces should feel quiet, not heavy. Let the content
              glow.”
            </p>
          </div>
          <div>
            <h3>Theme Notes</h3>
            <p>Designed for long reads, late nights, and focused writing.</p>
          </div>
        </section>
      </main>

      <footer className="dm-footer">
        <p>(c) 2026 NightScript Theme</p>
      </footer>
    </div>
  );
}

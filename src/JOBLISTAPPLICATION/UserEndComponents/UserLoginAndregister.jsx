import React, { useState } from 'react'
import "./UserLoginAndregister.css"
import { DB } from '../../OperationsWithFirebase/firebase'
import { set, child, get } from 'firebase/database'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../components/ToastProvider'

const UserLoginAndregister = () => {

  const [operation, setOperation] = useState("login")

  const [registerObj, setRegisterObj] = useState({
    Name: "",
    Email: "",
    Password: ""
  })

  const [loginObj, setLoginObj] = useState({
    Email: "",
    Password: ""
  })

  const navigation = useNavigate()
  const toast = useToast()

  /* ================= LOGIN ================= */
  const UserLogin = () => {

  console.log(loginObj.Email , loginObj.Password)

    if (!loginObj.Email || !loginObj.Password) {
      toast.error("Fill all credentials")
      return
    }

    get(child(DB, "UserAuth"))
      .then(snapshot => {
        const data = snapshot.val()

        if (!data) {
          toast.error("No user found. Please register first.")
          return
        }

        const users = Object.values(data)

        const foundUser = users.find(
          user =>
            user.Email === loginObj.Email &&
            user.Password === loginObj.Password
        )

        if (foundUser) {
          toast.success("Login successful")
          localStorage.setItem("CurrentUser" , JSON.stringify(foundUser.Name))
           localStorage.setItem("currentUser" , JSON.stringify(foundUser.Name))
          navigation(`/dash/${foundUser.Name}`)
        } else {
          toast.error("Invalid email or password")
        }
      })
  }

  /* ================= REGISTER ================= */
  const UserRegister = () => {
    if (!registerObj.Name || !registerObj.Email || !registerObj.Password) {
      toast.error("Fill all credentials")
      return
    }

    get(child(DB, "UserAuth"))
      .then(snapshot => {
        const data = snapshot.val() || {}

        const users = Object.values(data)

        const alreadyExists = users.find(
          user => user.Email === registerObj.Email
        )

        if (alreadyExists) {
          toast.warn("User already registered")
          return
        }

        const userId = Date.now()

        set(child(DB, `UserAuth/${userId}`), registerObj)
        toast.success("Registration successful")

        setOperation("login")
      })
  }

  return (
    <div className='wrapper'>  
    <div className="auth-hero">
      <div className="auth-hero-overlay"></div>
      <div className="auth-orb orb-one"></div>
      <div className="auth-orb orb-two"></div>
      <div className="auth-hero-content">
        <span className="hero-kicker">Blog Generator</span>
        <h1>Blogify Studio</h1>
        <p>
          Create standout stories with premium themes, bold typography, and
          visuals that feel alive. Your blog deserves a studio, not a template.
        </p>
        <div className="hero-meta">
          <div>
            <h4>Fast Publishing</h4>
            <span>Build, polish, and go live in minutes.</span>
          </div>
          <div>
            <h4>Theme Craft</h4>
            <span>Editorial, photo-first, and cinematic layouts.</span>
          </div>
          <div>
            <h4>Creator Ready</h4>
            <span>Turn ideas into publish-ready stories.</span>
          </div>
        </div>
        <div className="hero-badges">
          <span>New templates weekly</span>
          <span>Smart previews</span>
          <span>Custom cover art</span>
        </div>
      </div>
      <div className="auth-hero-showcase">
        <div className="showcase-card">
          <div className="showcase-top">
            <div>
              <h3>Editorial Preview</h3>
              <p>Turn drafts into premium stories.</p>
            </div>
            <span className="showcase-pill">Live</span>
          </div>
          <div className="showcase-image" />
          <div className="showcase-stats">
            <div>
              <h4>4.9</h4>
              <span>Theme rating</span>
            </div>
            <div>
              <h4>12K</h4>
              <span>Creators</span>
            </div>
            <div>
              <h4>90s</h4>
              <span>Publish time</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="auth-panel">
      <div className="auth-card">
        <div className="auth-header">
          <span>Blog Generator</span>
          <h3>Sign in to Blogify</h3>
          <p>Publish with modern themes and clean layouts.</p>
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            onClick={() => setOperation("login")}
            className={operation === "login" ? "tab active" : "tab"}
          >
            Login
          </button>

          <button
            onClick={() => setOperation("register")}
            className={operation === "register" ? "tab active" : "tab"}
          >
            Register
          </button>
        </div>

        {/* LOGIN FORM */}
        {operation === "login" && (
          <div className="form">
            <h2>Welcome Back</h2>

            <input
              type="email"
              placeholder="Email"
              onChange={(e) =>
                setLoginObj({ ...loginObj, Email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Password"
              onChange={(e) =>
                setLoginObj({ ...loginObj, Password: e.target.value })
              }
            />

            <button onClick={UserLogin} className="submit-btn">
              Login
            </button>
          </div>
        )}

        {/* REGISTER FORM */}
        {operation === "register" && (
          <div className="form">
            <h2>Create Account</h2>

            <input
              type="text"
              placeholder="Full Name"
              onChange={(e) =>
                setRegisterObj({ ...registerObj, Name: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Email"
              onChange={(e) =>
                setRegisterObj({ ...registerObj, Email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Password"
              onChange={(e) =>
                setRegisterObj({ ...registerObj, Password: e.target.value })
              }
            />

            <button onClick={UserRegister} className="submit-btn">
              Register
            </button>
          </div>
        )}

      </div>
    </div>

    </div>
  )
}

export default UserLoginAndregister





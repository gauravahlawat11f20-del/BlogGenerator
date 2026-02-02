import React, { useState } from 'react'
import "./UserLoginAndregister.css"
import { DB } from '../../OperationsWithFirebase/firebase'
import { set, child, get } from 'firebase/database'
import { useNavigate } from 'react-router-dom'

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

  /* ================= LOGIN ================= */
  const UserLogin = () => {
    if (!loginObj.Email || !loginObj.Password) {
      alert("Fill all credentials")
      return
    }

    get(child(DB, "UserAuth"))
      .then(snapshot => {
        const data = snapshot.val()

        if (!data) {
          alert("No user found. Please register first.")
          return
        }

        const users = Object.values(data)

        const foundUser = users.find(
          user =>
            user.Email === loginObj.Email &&
            user.Password === loginObj.Password
        )

        if (foundUser) {
          alert("Login successful ✅")
          localStorage.setItem("CurrentUser" , JSON.stringify(foundUser.Name))
          navigation(`/dash/${foundUser.Name}`)
        } else {
          alert("Invalid email or password ❌")
        }
      })
  }

  /* ================= REGISTER ================= */
  const UserRegister = () => {
    if (!registerObj.Name || !registerObj.Email || !registerObj.Password) {
      alert("Fill all credentials")
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
          alert("User already registered ❌")
          return
        }

        const userId = Date.now()

        set(child(DB, `UserAuth/${userId}`), registerObj)
        alert("Registration successful 🎉")

        setOperation("login")
      })
  }

  return (
    <div className='wrapper'>  
    <div className="auth-container">
      <div className="auth-overlay"></div>

      <div className="auth-card">

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
            <h2>Welcome Back 🌤️</h2>

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
            <h2>Create Account ✨</h2>

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





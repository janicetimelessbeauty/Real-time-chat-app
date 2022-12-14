import React, { useState, useEffect } from 'react'
import styled from "styled-components"
import {Link, useNavigate} from "react-router-dom"
import Logo from "../assets/logo.svg"
import {ToastContainer, toast} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios"
import { registerRoute } from '../utils/APIRoute' 
function Register() {
    const navigate = useNavigate()
    const [values, setvalues] = useState({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    })
    const handleSubmit = async (event) => {
        event.preventDefault()
        if (handleValidation()) {
          console.log("in validation", registerRoute)
          const {password, confirmPassword, email, username} = values;
          const {data} = await axios.post(registerRoute, {
            username,
            email,
            password,
          })
          if(data.status === false) {
            toast.error(data.msg, ToastOptions)
          }
          if(data.status === true) {
            localStorage.setItem("chat-app-user", JSON.stringify(data.account))
            navigate("/")
          }
        }
    }
    const ToastOptions = {
      position: 'bottom-right',
      autoClose: 8000,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    }
    const handleValidation = () => {
        const {password, confirmPassword, email, username} = values;
        if(password !== confirmPassword) {
          console.log("validation on", toast)
          toast.error("Password and confirmPassword must be the same", ToastOptions)
          return false;
        }
        else if(username.length < 5) {
          toast.error("Username length must be more than 5 characters", ToastOptions)
          return false
        }
        else if(password.length < 4 || password.search(/[A-Z]/) < 0) {
          toast.error("Password must be more than or equal to 4 characters and includes at least 1 uppercase letter", ToastOptions)
          return false
        }
        else if(email === "") {
          toast.error("email required", ToastOptions)
          return false
        }
        else {
          return true;
        }
    }
    const handleChange = (event) => {
         setvalues({...values, [event.target.name] : event.target.value})
    }
  return (
    <>
    <FormContainer>
      <form onSubmit = {(event) => handleSubmit(event)}>
        <div className="brand">
            <img src={Logo} alt="" />
            <h1>goro</h1>
        </div>
        <input type = "text" placeholder = "Username" name = "username" onChange={(e) =>handleChange(e)}/>
        <input type = "email" placeholder = "Email" name = "email" onChange={(e) => handleChange(e)}/>
        <input type = "password" placeholder = "Password" name = "password" onChange={(e) => handleChange(e)}/>
        <input type = "password" placeholder = "Confirm Password" name = "confirmPassword" onChange={(e) => handleChange(e)}/>
        <button type = "submit">Create User</button>
        <span>already have an account ? <Link to = "/login">Login</Link></span>
      </form>
      </FormContainer>
      <ToastContainer/>
   </>
  )
}
const FormContainer = styled.div`
height: 100vh;
width: 100vw;
display: flex;
flex-direction: column;
justify-content: center;
gap: 1rem;
align-items: center;
background-color: #131324;
.brand {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
}
`
export default Register
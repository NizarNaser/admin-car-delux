
import { useState } from "react"
import "./LoginPopup.css"
import { assets } from "../../assets/assets"
import axios from "axios"
// eslint-disable-next-line react/prop-types
const LoginPopup = ({ setShowLogin ,setToken}) => {
  const url= import.meta.env.VITE_API_URL;
  const [currstate, setCurrstate] = useState("Login")
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  })

  const onChengeHandler = (event) => {
    const name= event.target.name;
    const value = event.target.value;
    setData(data=>({...data,[name]:value}))
  }

const onLogin = async(event) =>{
   event.preventDefault()

   let newUrl = url;
   if(currstate==="Login"){
    newUrl+="/api/user/login";
   }else{
    newUrl+="/api/user/register";
   }
   const response = await axios.post(newUrl,data);
   if(response.data.success){
     setToken(response.data.token)

     localStorage.setItem("token",response.data.token);
     setShowLogin(false);
   }else{
    alert(response.data.message);
   }
}

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currstate}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
        </div>
        <div className="login-popup-inputs">
          {currstate === "Login" ? <></> : <input name="name" onChange={onChengeHandler} value={data.name} type="text" placeholder="Your name" required />}

          <input name="email" onChange={onChengeHandler} value={data.email} type="email" placeholder="Your Email" required />
          <input  name="password" onChange={onChengeHandler} value={data.password} type="password" placeholder="Password" required />
        </div>
        <button type="submit">{currstate === "Sign Up" ? "Create account" : "Login"}</button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, i agree to the terms of use & privacy policy.</p>
        </div>
        {currstate === "Login"
          ? <p>Create a new account? <span onClick={() => setCurrstate("Sign Up")}>Click here</span></p>
          : <p>Already have an account? <span onClick={() => setCurrstate("Login")}>Login here</span></p>
        }


      </form>
    </div>
  )
}

export default LoginPopup
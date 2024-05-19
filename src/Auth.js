import React from 'react'
import {auth, provider} from './Firebase.js'
import { signInWithPopup } from 'firebase/auth';
import {useNavigate} from "react-router-dom"
import {useEffect } from 'react';
import {useGetUserInfo} from "./Home.js"

export const Auth = () => {

    const navigate = useNavigate()
    const {isAuth} = useGetUserInfo

    useEffect(()=>{
    
        if(isAuth){
            navigate("/app")
        }
    },[isAuth, navigate])

    const signInWithGoogle = async()=>{
        try{
        const results= await signInWithPopup(auth, provider)
        console.log(results)
        const authinfo={
            userID: results.user.uid,
            name: results.user.displayName,
            photo: results.user.photoURL,
            isAuth:true,
        }
        localStorage.setItem("auth", JSON.stringify(authinfo))
        navigate("/app")
    }
        catch (error) {
            console.error("Error signing in with Google:", error);
        }
    };

  return (
    <div className="Auth">
    <div className="login-card">
    <div className='title'>
        <h1>Budget Padmanabhan</h1>
        <p>Your Buget Companion</p>
        </div>
    <div className='login-header'>
    <img src="https://cdn.iconscout.com/icon/free/png-256/free-google-152-189813.png" alt="Google icon" width={50} height={50} className="google-icon" />
    <h1>Google Authentication</h1>
    </div>
     
      <button onClick={signInWithGoogle}>Sign In With Google</button>
    </div>
  </div>
  )
}

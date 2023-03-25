import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useState } from 'react';

const LoginPage = () => {
  const initialValues={email:'', password:''}
  const [userInfo, setUserInfo]=useState(initialValues)
  const {signIn}=useAuth();
  const navigate=useNavigate();
  const handleChange= (e) => {
    const {name, value}=e.target
     setUserInfo({...userInfo, [name]:value})
  }

   
  const handleSubmit= async (e)=>{
    e.preventDefault();
    try{
      await signIn(userInfo.email, userInfo.password)
      navigate('/')

    }
    catch(err){
      console.log(err);
    }
  }
  return (
    <main className='login-container'>
        <form onSubmit={handleSubmit} className='login-form'>
            <span className='logintext'>Login</span>
           <label>Email</label>
           <input onChange={handleChange} spellCheck={false} value={userInfo.email} name='email'  type='text'></input>
           <label>Password</label>
           <input onChange={handleChange} value={userInfo.password}  name='password' type='password' ></input>
           <input type="submit" value="Login"></input>
           <p>If you don't own an account, click <Link to='/signup' className='here'>here</Link> to sign up</p>
        </form>
    </main>
  )
}

export default LoginPage
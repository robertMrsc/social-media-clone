import React from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useState, useEffect } from 'react';
import { db } from './firebase-config';
import { doc, setDoc } from 'firebase/firestore';
import { auth } from './firebase-config';
import { collection } from 'firebase/firestore';
const SignupPage = (setStatus) => {
  const navigate=useNavigate();
  const [loading, setLoading]=useState(false);
  const [submitted, setSubmitted]=useState(false);
   const initialValues={username:'', email:'', password:''};
  const [formValues, setFormValues]=useState(initialValues);
    const [formErrors, setFormErrors]=useState({});
    const {signupEmailPassword, updateProfilez, currentUser }=useAuth();
    const loginEmail=formValues.email;
    const loginPassword=formValues.password;
            const usersRef=collection(db, 'users');
     
    const handleSubmit= async (e) => {
    e.preventDefault()
    setSubmitted(true);
    try{
        if(Object.keys(formErrors).length===0){
        await signupEmailPassword(loginEmail, loginPassword);
        console.log('it worked')
        setLoading(true);
        navigate('/')
        const update=updateProfilez(formValues.username);
        Promise.allSettled([update]).then(()=>{
       setDoc(doc(db, 'users', auth.currentUser.uid),
    {
      'displayName':auth.currentUser.displayName,
      'photoURL':auth.currentUser.photoURL,
      'uid':auth.currentUser.uid,
      'email':auth.currentUser.email,
      'jobText':'',
      'gradText':'',
      'Location':'',
      'coverPhoto':'',
      'friends':[],
      'sentRequests':[],
      'pendingRequests':[]
      

    }
    )
        }).then(()=>{
          setStatus(true)
        })
      
        }
    }
    catch(e){
      console.log(e.message);
    }
    
    finally{
      setStatus(false)
    }
  }
  
  const regex= /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g

  const handleErrors= (values) => {
      const errors={};
      if (!values.username){
        errors.username='Username field is required';
      }
       if(!values.email){
        errors.email='Email is required';
      }
      else if (!regex.test(values.email)){
        errors.email='This is not a valid format'
      }
      if(!values.password){
        errors.password='Password is required'
      }
      else if(values.password.length <=6){
          errors.password='Password must have more than 6 characters'
      }
       if(values.password!==values.confirm){
        errors.confirm='Confirmed password does not match the current password'
      }
      return errors;
  }

  const handleChange= (e) => {
      const {name, value}=e.target;
      setFormValues({...formValues, [name]:value});
      
  }

  useEffect(()=>{
    setFormErrors(handleErrors(formValues));
  }, [formValues])

  return (
    <main className='signup-container'>
        <form onSubmit={handleSubmit} className='signup-form'>
            <span className='signuptext'>Sign-up</span>
        <label>Username</label>
        <input onChange={handleChange} type='text' spellCheck={false} name='username' value={formValues.username}></input>
          {formErrors.username && submitted && <p className='form-error'>{formErrors.username}</p>}
        <label>Email</label>
        <input spellCheck={false} onChange={handleChange} value={formValues.email} name='email' type="email"></input>
          {formErrors.email && submitted && <p className='form-error'>{formErrors.email}</p>}
        <label>Password</label>
        <input onChange={handleChange} value={formValues.password} type="password" name='password'></input>
          {formErrors.password && submitted && <p className='form-error'>{formErrors.password}</p>}
        <label>Confirm your password</label>
        <input onChange={handleChange}  name='confirm' type='password'></input>
          {formErrors.confirm && submitted && <p className='form-error'>{formErrors.confirm}</p>}
        <input  type="submit" disabled={loading} value="Sign-up" ></input>
        <p>If you already own an account, click <Link to='/login'>here</Link>to log in.</p>
        </form>
    </main> 
  )
}

export default SignupPage
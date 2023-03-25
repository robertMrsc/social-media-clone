import { createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword, updateProfile, getAuth} from 'firebase/auth';
import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, db } from './firebase-config';
import { doc, updateDoc, getDocs, collection, setDoc} from 'firebase/firestore';
import { storageRef } from './firebase-config';


const AuthContext=createContext();


export function useAuth(){
    return useContext(AuthContext)
}
const updateProfilez=async(displayName)=>{
    return  await updateProfile(auth.currentUser,{
        displayName:displayName,
        photoURL:'http://i.stack.imgur.com/Dj7eP.jpg'
    })
}
const signupEmailPassword=(email, password) => {
    return createUserWithEmailAndPassword(auth, email, password)
}

const signOff=()=>{
    return signOut(auth);
}
const signIn=(email, password)=>{
    return signInWithEmailAndPassword(auth, email, password)
}


 
export const AuthProvider = ({children}) => {
    const [loading, setLoading]=useState(true);
    const [currentUser, setCurrentUser]=useState();
    useEffect(()=>{
        const updateRef=doc(db, 'posts', 'post')
    const unsubscribe=onAuthStateChanged(auth, user=>{
        setCurrentUser(user);
        setLoading(false);
        if(user){
            
        }
        else{
            console.log('not logged in')
        }

    })
    return unsubscribe;
}, [])
   
    const value={
        currentUser,
        signupEmailPassword,
        signOff,
        signIn,
        updateProfilez,
    }

  return (
    <AuthContext.Provider value={value}>
        {!loading && children}
    </AuthContext.Provider>
  )
}



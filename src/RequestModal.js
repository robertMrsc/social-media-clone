import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { useEffect } from 'react';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase-config';

const RequestModal =({currentUserObj, setRequests, getUsers}) => {
    const navigate=useNavigate();
    const navigateToFriendProfile=(uid)=>{
        navigate(`/profile/${uid}`)
    }

    const essentialsCurrentUser={
    'displayName':currentUserObj?.displayName,
    'uid':currentUserObj?.uid,
    'photo':currentUserObj?.photoURL
  }

    const refModal=useRef(null);
     useEffect(()=>{

    const handleOutsideClick=(e)=>{
      if (refModal.current && !refModal.current.contains(e.target)){
        setRequests(false);
       
      };
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return()=>{
      document.removeEventListener('mousedown', handleOutsideClick)
    };
  },[refModal]);
  const handleAcceptRequest=(request)=>{
    currentUserObj.friends.push(request);
    currentUserObj.pendingRequests=currentUserObj.pendingRequests.filter((req)=>{
        return !req.uid===request.uid
    })
    const handleAsync=async()=>{
        try{
        await updateDoc(doc(db,'users', currentUserObj.uid),{
            friends:arrayUnion(request),
            pendingRequests:arrayRemove(request)
        })
        await updateDoc(doc(db, 'users', request.uid),{
            friends:arrayUnion(essentialsCurrentUser),
            sentRequests:arrayRemove(essentialsCurrentUser)
        })
    }
    catch(err){
        console.log(err)
    }
    finally{
        getUsers();
    }
    }
    handleAsync();
  }
  const handleRejectRequests=(request)=>{
    currentUserObj.pendingRequests=currentUserObj.pendingRequests.filter((req)=>{
        return !req.uid===request.uid
    })
    const handleAsync=async()=>{
        try {
            await updateDoc(doc(db, 'users', currentUserObj),{
                pendingRequests:arrayRemove(request)
            })
            await updateDoc(doc(db, 'users', request.uid),{
                sentRequests:arrayRemove(essentialsCurrentUser)
            })
        } catch (error) {
            console.log(error)
        }
        finally{
            getUsers();
        }
    }
    handleAsync();
  }

  return (
    
    <div ref={refModal} className='request-modal'>
        <div className='request-container'>
            <p className='request-intro'>Friend requests</p>
            { currentUserObj.pendingRequests > 0 ? currentUserObj?.pendingRequests?.map((request,index)=>{
                return (
                    <div key={index} className='request'> 
                    <div onClick={()=> navigateToFriendProfile(request.uid)} className='request-image' style={{backgroundImage:`url(${request.photo})`}}> </div>
                    <p onClick={()=> navigateToFriendProfile(request.uid)} className='request-user'>{request.displayName}</p>
                    <div className='request-buttons'> 
                    <button onClick={()=> handleAcceptRequest(request)} className='accept-button' >Accept friend request</button>
                    <span onClick={()=> handleRejectRequests(request)} className='reject-button'>&#10006;</span>
                    </div>
                    </div>
                )
            }) : <p className='missing-requests'>You currently have no friend requests</p>}
        </div>
    </div> 

  )
}

export default RequestModal
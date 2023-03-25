import React from 'react';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import EditModal from './EditModal';
import { arrayRemove, arrayUnion, updateDoc } from 'firebase/firestore';
import { doc } from 'firebase/firestore';
import { db } from './firebase-config';




const ProfileIntro = ({user, profPosts, getUsers, getPosts, setProfPosts, currentUserObj}) => {
const {currentUser}=useAuth();
const [editModal , setEditModal]=useState(false);
const [functional, setFunctional]=useState(false);
const [loading, setLoading]=useState(false);
const currentRef=doc(db, 'users', currentUser.uid);
const userRef=doc(db, 'users', user.uid )

     const handleEditModal=()=>{
     
    setEditModal(!editModal);
  }

  // const handleReq=()=>{
  //   if (reqStatus==='sent'){
  //     const index=currentUserObj?.indexOf({'displayName':user.displayName,
  //     'uid':user.uid
  //   })
  //   console.log(index)
  //   }
  // }
  // handleReq();
  // useEffect(()=>{

  // }, [user])
  const essentialsUser={
    'displayName':user.displayName,
    'uid':user.uid,
    'photo':user.photoURL
  }
  const essentialsCurrentUser={
    'displayName':currentUserObj?.displayName,
    'uid':currentUserObj?.uid,
    'photo':currentUserObj?.photoURL
  }
  console.log(currentUserObj)
  console.log(essentialsCurrentUser)
  const indexUser=user.pendingRequests.indexOf(essentialsCurrentUser);
  const handleSent=currentUserObj?.sentRequests?.find((req)=>{
      return req.uid===user.uid
    });
  
    const handleFriends=currentUserObj?.friends?.find((friend)=>{
      return friend.uid===user.uid
    })
    const handlePending=user?.pendingRequests?.find((req)=>{
      return req.uid===currentUserObj.uid
    })
    const handleSentToCurrent=user.sentRequests?.find(req => req.uid===currentUserObj.uid)
  const handleRequests=()=>{
    if (!handleSent && !handleFriends && !handlePending && !handleSentToCurrent) {
      setLoading(true)
    currentUserObj.sentRequests?.push(essentialsUser)
    user.pendingRequests?.push(essentialsCurrentUser)
    const handleAsync=async()=>{
      try{
    await updateDoc(doc(db, 'users', currentUser.uid),{
     sentRequests:arrayUnion(essentialsUser)
   })
   await updateDoc(doc(db, 'users', user.uid),{
     pendingRequests:arrayUnion(essentialsCurrentUser)
   })
  }
  catch(err){
    console.log(err.message)
  }
   finally{
    getUsers()
    setLoading(false);
   }
 }
 handleAsync();
 
 
  }
  else if (handlePending &&  !handleFriends){
    setLoading(true);
      currentUserObj.sentRequests=currentUser.sentRequests?.filter(req=> !req.uid===user.uid)
      user.pendingRequests=user.pendingRequests?.filter(req=> !req.uid===currentUserObj.uid)
      const handleAsync=async()=>{
        try{
        await updateDoc((currentRef),{
          sentRequests:arrayRemove(essentialsUser)
        })
        await updateDoc((userRef),{
          pendingRequests:arrayRemove(essentialsCurrentUser)
        })
      }
      catch(err){
        console.log(err.message)
      }
        finally{
          getUsers();
          setLoading(false);
        }
      }
      handleAsync();
  }
  else if (handleSentToCurrent && !handleFriends){
    setLoading(true);
    user.friends.push(essentialsCurrentUser);
    
    currentUserObj.friends.push(essentialsUser);
    
    const handleAsync=async()=>{
      try{
        await updateDoc((currentRef),{
          friends:arrayUnion(essentialsUser),
          pendingRequests:arrayRemove(essentialsUser)
          
        })
        await updateDoc ((userRef),{
          friends:arrayUnion(essentialsCurrentUser),
          sentRequests:arrayRemove(essentialsCurrentUser)
          
        })
      }
      catch(err){
        console.log(err)
      }
      finally{
        getUsers();
        setLoading(false);
      }
    }
    handleAsync();
  }

  else if(handleFriends){
    setLoading(true);

    const handleAsync=async()=>{
      try {
        await updateDoc((currentRef),{
          friends:arrayRemove(essentialsUser)
        })
        await updateDoc((userRef),{
          friends:arrayRemove(essentialsCurrentUser)
        })
      } catch (error) {
        console.log(error)
      }
      finally{
        getUsers();
        setLoading(false);
      }
    }
    handleAsync();
  }
  }
  const handleBtnText=()=>{
    if (currentUserObj?.sentRequests?.find((req)=>{
      return req.uid===user.uid
    })){
      return 'Cancel friend request'
    }
    else if (currentUserObj?.friends?.find((friend)=>{
      return friend.uid===user.uid
    })){
      return 'Unfriend'
    }
    else if(user.sentRequests?.find((req)=>{
      return currentUserObj.uid===req.uid
    })){
      return "Accept friend request"
    }
    else{
      return 'Add friend'
    }
  }

  useEffect(()=>{
    if (editModal){
      document.body.style.overflow='hidden';
      document.body.style.userSelect='none';
      document.body.style.pointerEvents='none';
    }
   return()=>{
    document.body.style='none'
   }
  }, [editModal])
  return (
    <>
    <div style={{backgroundImage:`url(${user.coverPhoto})`}}className='cover-photo'></div>
    { editModal && <div className='overlay'></div>}
    
          <div className='basic-info'>
              <div className='basic-info-essentials'>
                <div className='profile-image' style={{backgroundImage:`url(${user.photoURL})`}}></div>
                <div className='profile-socials'>
                    <p className='profile-name'>{user.displayName}</p>
                    <p  className='profile-friends'>{user.friends.length} {user.friends.length===1 ? 'friend' : 'friends'}</p> 
                </div>
                
                    
                <div className='profile-interact'> 
                {user.uid!=currentUser.uid ?
                        <div> 
                        <button  onClick={handleRequests} className='friend-button'>{handleBtnText()}</button> 
                        <button className='message-button'>Message</button>
                        </div>
                        : <button onClick={handleEditModal} className='edit-profile'>Edit your profile</button>
                }
                    </div> 
                
                {editModal && <EditModal setProfPosts={setProfPosts} getPosts={getPosts} functional={functional} setFunctional={setFunctional} set getUsers={getUsers} profPosts={profPosts} user={user} editModal={editModal} setEditModal={setEditModal}/>}

                

              </div>
              <div className='basic-info-options'>
                  <ul className='options-list'>
                    <Link to={`/profile/${currentUser.uid}#top`} className='option'>Posts</Link>
                    <Link className='option'>About</Link>
                    <Link to={`/profile/${currentUser.uid}/friends`} className='option'>Friends</Link>
                    <Link to={`/profile/${user.uid}/photos`} className='option'>Images</Link>
                  </ul>
              </div>
          </div>
    </>
  )
}

export default ProfileIntro
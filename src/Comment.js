import React from 'react';
import { useAuth } from './AuthContext';
import { AiFillLike } from 'react-icons/ai';
import { db } from './firebase-config';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Comment = ({comment, post, getPosts,index}) => {
  const navigate=useNavigate();
  const {currentUser}=useAuth();
  const navigateToProfile=(uid)=>{
    navigate(`/profile/${uid}`)
  }
  const handleLikes=()=>{
    const index=comment.likedBy.indexOf(currentUser.displayName);
    if (!comment.likedBy.includes(currentUser.displayName)){
      comment.likes++
      comment.likedBy.push(currentUser.displayName)
    
    }
    else{
      comment.likes--
      comment.likedBy.splice(index, 1)
    }
    const docUpdate=async () =>{
      const postRef=doc(db, 'posts', post.postId)
      try{
        await updateDoc(postRef,{
          comments:[{...comment}]
        })
        getPosts();
      }
      catch(err){
        console.log(err.message)
      }
    }
    docUpdate();
    
  }
  const handleColor=()=>{
      if (comment.likedBy.includes(currentUser.displayName)){
        return '#3336f3'
      }
    }
  return (
    <div className='comment'>
        <div onClick={()=> navigateToProfile(comment.uid)} className='user-image' style={{backgroundImage:`url(${comment.photoUrl})`}}></div>
        <div className='user-comment'>
           <p onClick={()=> navigateToProfile(comment.uid)} className='comment-author'>{comment.Username}</p>
           <p className='comment-text'>{comment.comment}</p>
           <div className='comment-buttons'>
          <p className='likes-number' style={{color:handleColor()}} onClick={handleLikes}>Like</p>
          <div className='comment-likes'>
            <span><AiFillLike/></span>
            <p>{comment.likes}</p>
          </div>
           </div>
        </div>
  
    </div>
  )
}

export default Comment
import React from 'react';
import {AiFillLike} from 'react-icons/ai';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';


const LikesModal = ({post, closeLikers}) => {
  const {currentUser}=useAuth();
  const navigate=useNavigate();
  const navigateToProfile=()=>{
    navigate(`/profile/${currentUser.uid}`)
  }
  return (
    <div className='modal-box'>
        <div className='modal-box-content'>
          <div className='like-tracker'>
            <div className='likes-number'>
              <span><AiFillLike/></span>
              <p>{post.likes}</p>
            </div>
          <div className='icon-div'>< AiOutlineCloseCircle onClick={closeLikers} className='close-icon'/></div>
          </div>
        {post.likedBy.map((liker)=>(
        
          <div className='post-liker'>
            <div className='liker-info'>
    <div onClick={navigateToProfile} className='user-image' style={{backgroundImage:`url(${liker.photo})`}}></div>
         <p onClick={navigateToProfile} className='liker-name' >{liker.username}</p>
         </div>
         </div>
        ))}
        </div>
    </div>
  )
}

export default LikesModal
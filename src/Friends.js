import React from 'react';
import ProfileIntro from './ProfileIntro';
import { useNavigate } from 'react-router-dom';

const Friends = ({user}) => {
    const navigate=useNavigate();
    const handleGoTo=(friend)=>{
        navigate(`/profile/${friend.uid}`)
    }
  return (
    <div className='friends'>
        <div className='profile-intro'>
        <ProfileIntro user={user}/>
    </div>
    <div className='friends-container'>
        <div className='friends-list'>
            <p>Friends</p>
            <div className='friends-grid'>
            {user.friends?.map((friend)=>{
                return(
                    <div onClick={()=> handleGoTo(friend)} className='friend'>
                        <div className='user-image' style={{backgroundImage:`url(${friend.photo})`}}> </div>
                        <p className='user-name'>{friend.displayName}</p>
                    </div>
                )
            })}
        </div>
        </div>
    </div>
    </div>
  )
}

export default Friends
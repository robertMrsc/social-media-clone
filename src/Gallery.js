import React from 'react';
import ProfileIntro from './ProfileIntro';
import { useEffect } from 'react';

const Gallery = ({user, profPosts, setProfPosts, posts}) => {
    const profilePosts=posts.filter((post)=>{
    return post.uid===user.uid
  })
  useEffect(()=>{
    setProfPosts(profilePosts)
  }, [posts])


  const display=()=>{
    if(userPostWithPhotos > 0){
      return(
        'block'
      )
    }
  }
  const userPostWithPhotos=profPosts?.filter((post)=>{
    return post.photoURL > 0
  })
  return (
    <div className='gallery'>
    <div className='profile-intro'>
        <ProfileIntro user={user}/>
    </div>
    <div className='photos-container'>
    <div className='photos-album'>
        <p>Photos</p>
        <div style={{display:display()}} className='photos-grid'>
        { userPostWithPhotos ? profPosts.map((post, index)=>{
            return <div key={index} style={{backgroundImage:`url(${post.imageUrl})`}} className='grid-photo' ></div>
        }) : <p className='missing-photos'>This user has no photos</p> }
        </div>
    </div>
    </div>
    </div>
  )
}

export default Gallery
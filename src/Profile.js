import React, {useState, useEffect } from 'react';
import './Profile.scss';
import {BsFillBriefcaseFill} from 'react-icons/bs';
import {FaGraduationCap} from 'react-icons/fa';
import {AiFillClockCircle} from 'react-icons/ai';
import {FaUserAlt} from 'react-icons/fa';
import Post from './Post';
import { useAuth } from './AuthContext';
import { updateDoc } from 'firebase/firestore';
import { doc } from 'firebase/firestore';
import { db } from './firebase-config';
import ProfileIntro from './ProfileIntro';
import { Link } from 'react-router-dom';
import {HiOutlineLocationMarker} from 'react-icons/hi';

const Profile = ({user, posts, currentUserObj, profPosts, setProfPosts, edit, setEdit, jobText, setJobText, gradText, setGradText, getPosts, getUsers, showLikers, setShowLikers}) => {
  const [test, setTest]=useState(false);
  const [postComm, setPostComm]=useState('');
  const [options, setOptions]=useState();
  const [newPostDesc, setNewPostDesc]=useState('');
  const [editz, setEditz]=useState();
  const [editText, setEditText]=useState('');
  const [location, setLocation]=useState('')
  const currentUser=useAuth();
  const profilePosts=posts.filter((post)=>{
    return post.uid===user.uid
  })
  useEffect(()=>{
    setProfPosts(profilePosts)
  }, [posts])

 useEffect(()=>{
  window.scrollTo(0,0)
 },[])
  const handleEdit=()=>{
    setEdit(true)
  }
  const handleChange=(e)=>{
    setJobText(e.target.value)
  }
  const handleGradText=(e)=>{
      setGradText(e.target.value)
  }
  const handleLocation=(e)=>{
    setLocation(e.target.value)
  }
  const handleEditSubmit=()=>{
    user.jobText=jobText;
    user.gradText=gradText;
    const handleAsync=async()=>{
    await updateDoc(doc(db, 'users', user.uid),{
      'jobText':jobText,
      'gradText':gradText,
      'Location':location
    })
  }
  handleAsync();
  getPosts();
  setEdit(false)
  }

  return (
    
    <div className='profile' >
      <div className='profile-intro'>
        <ProfileIntro currentUserObj={currentUserObj} setProfPosts={setProfPosts} getUsers={getUsers} getPosts={getPosts} profPosts={profPosts} user={user}/>
          </div>
          <div className='profile-content'>
            <div className='detailed-info'>
              <div className='details-container'>
                <ul className='details'>
                  <li className='details-option header'>Details
                  </li>
                  <li className='details-option'>
                    <span className='details-icon'><BsFillBriefcaseFill/></span>
                    {
                      edit ? <input onChange={handleChange} type='text' value={jobText}></input> : user.jobText
                    }
                  </li>
                  
                  <li className='details-option'>
                    <span className='details-icon'><FaGraduationCap/></span>
                    {
                    edit  ? <input value={gradText} onChange={handleGradText} type='text'></input> :
                    user.gradText
                    }
                  </li>
                  <li className='details-option'>
                    <span className='details-icon'><HiOutlineLocationMarker/></span>
                    {
                      edit ? <input type='text' onChange={handleLocation} value={location} ></input> : user.Location
                    }
                  </li>
                  <li className='details-option'>
                    <span className='details-icon'><AiFillClockCircle/></span>
                    Joined February 2023
                  </li>
                  <li className='details-option'>
                    <span className='details-icon'><FaUserAlt/></span>
                    221 friends
                  </li>
                  {edit && <button onClick={handleEditSubmit} type='submit'>Save</button>}
                  {/* AS PUTEA SCHIMBA DIN SPAN IN DIV CA SA IMI FIE CENTRAT TEXTU CU ICOANELE */}
                </ul>
                </div>
                <div className='profile-photos'> {/* grid 3x3 cu poze */}
                    <div className='photos-content'>
                     <Link  className='photos-link' to={`/profile/${user.uid}/photos#top`}>Photos</Link>
                      <div className='grid-box'>
                        {profPosts.map((post,index,arr)=>{
                          if (index > arr.length - 10){
                            return <div key={index} style={{backgroundImage:`url(${post.imageUrl})`}} className='profile-grid-image' ></div>
                          }
                        })}
                      </div>
                    </div>
                </div>
            </div>
            <div className='wall'>
              {profPosts.map((post, index )=>{
                return <Post key={index} postComm={postComm} setPostComm={setPostComm} getPosts={getPosts} test={test} edit={editz} setEdit={setEditz} setOptions={setOptions} options={options} showLikers={showLikers} setShowLikers={setShowLikers} editText={editText} setEditText={setEditText} setTest={setTest} post={post}/>
              })}
            </div>
          </div>
          
    </div>
    
  )
}

export default Profile
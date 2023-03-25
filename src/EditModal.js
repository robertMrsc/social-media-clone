import React from 'react';
import { useState, useEffect } from 'react';
import {AiOutlineCloseCircle} from 'react-icons/ai';
import {useRef } from 'react';
import {BsFillBriefcaseFill} from 'react-icons/bs';
import {FaGraduationCap} from 'react-icons/fa';
import {HiOutlineLocationMarker} from 'react-icons/hi';
import FunctionalModal from './FunctionalModal';

const EditModal = ({setEditModal, functional, setFunctional, editModal, user, profPosts, getUsers, getPosts, setProfPosts}) => {
  const [editPfp, setEditPfp]=useState(false)
  const [editCover, setEditCover]=useState(false)
  const [editDetails, setEditDetails]=useState(false)
  const ref=useRef(null);
  
  console.log(ref.current)
  useEffect(()=>{

    const handleOutsideClick=(e)=>{
      if (ref.current && !ref.current.contains(e.target)){
        setEditModal(false);
        setFunctional(false);
      };
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return()=>{
      document.removeEventListener('mousedown', handleOutsideClick)
    };
  },[ref]);
    const handleExit=()=>{
      setEditModal(false);
    };
    const handlePfp=()=>{
      setEditPfp(true);
      setFunctional(true)
    }
    const handleCover=()=>{
      setEditCover(true)
      setFunctional(true)
    }
    const handleDetails=()=>{
      setEditDetails(true)
      setFunctional(true)
    }
  return (
    
    <div ref={ref}  style={editPfp || editCover || editDetails ? {pointerEvents:'none'} :{pointerEvents:'all'} } className='edit-modal'>
     {functional &&  <div  className='overlay-two'></div>}

       <div className='opening-div'>
        <p>Edit your profile</p>
        <AiOutlineCloseCircle onClick={handleExit} className='exit-icon'/>
       </div>
       <div className='content-div'> 
          <div className='profile-picture'>
            <div className='profile-picture-text'>
            <p>Profile Picture</p>
            <p onClick={handlePfp} className='edit-p'>{user.photoURL ? 'Edit' : 'Add'}</p>
            </div>
            <div style={{backgroundImage:`url(${user?.photoURL})`}} className='user-image'></div>
          </div>
          <div className='cover-picture'>
            <div className='cover-picture-text'>
            <p>Cover Picture</p>
           <p onClick={handleCover} className='edit-p'>{user.coverPhoto ? 'Edit' : 'Add'}</p>
           </div>
           <div style={ user.coverPhoto && {backgroundImage:`url(${user.coverPhoto})`}} className='user-cover'></div>
          </div>
          <div className='details'>
          <div className='details-text'>
            <p>Details</p>
            <p onClick={handleDetails} className='edit-p'>Edit</p>
          </div>
          <ul className='details-info'>
            <li className='info'>
              <span className='info-icon'><BsFillBriefcaseFill/></span>
              <span className='info-text'>Works at {user.jobText}</span>
            </li>
            <li className='info'>
              <span className='info-icon'><FaGraduationCap/></span>
              <span className='info-text'>Studied at {user.gradText}</span>
            </li>
            <li className='info'>
              <span className='info-icon'><HiOutlineLocationMarker/></span>
              <span className='info-text'>From {user.Location}</span>
            </li>
          </ul>
       </div>
       </div>
      { (editPfp || editCover || editDetails) &&  <FunctionalModal setFunctional={setFunctional} setProfPosts={setProfPosts} getUsers={getUsers} getPosts={getPosts} profPosts={profPosts} editPfp={editPfp} setEditPfp={setEditPfp} setEditCover={setEditCover} editCover={editCover} editDetails={editDetails} setEditDetails={setEditDetails} user={user}/>}
    </div>
  )
}

export default EditModal
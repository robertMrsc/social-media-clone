import React, { useEffect, useState } from 'react';
import {AiOutlineCloseCircle} from 'react-icons/ai';
import {FiEdit2} from 'react-icons/fi'
import { db } from './firebase-config';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { auth } from './firebase-config';
import { updateProfile } from 'firebase/auth';

const FunctionalModal = ({profPosts, setFunctional, user, editPfp,setEditPfp, editCover, setEditCover, editDetails, setEditDetails, getUsers, getPosts, setProfPosts}) => {
  const [pfpUrl, setPfpUrl]=useState('');
  const [coverUrl, setCoverUrl]=useState('');
  const [editWork, setEditWork]=useState(false);
  const [editGrad, setEditGrad]=useState(false);
  const [editLocation, setEditLocation]=useState(false);
  const [workText, setWorkText]=useState('');
  const [gradText, setGradText]=useState('');
  const [locationText, setLocationText]=useState('');
  const [error, setError]=useState('')
  const {currentUser}=useAuth()
  useEffect(()=>{
      if (editPfp || editCover || editDetails){
        document.body.style.overflow='hidden';
      document.body.style.userSelect='none';
      document.body.style.pointerEvents='none';
      }
  }, [editPfp, editCover, editDetails])

  const handleExit=()=>{
    setEditPfp(false);
    setEditDetails(false);
    setEditCover(false);
    setFunctional(false)
  }
  console.log(pfpUrl);

  
   
    
  const handlePfp=()=>{
    if (pfpUrl){
      user.photoURL=pfpUrl;
      updateProfile(auth.currentUser,{
            photoURL:pfpUrl
           })
      
      const handleUpdate=async()=>{
        try{
          await updateDoc(doc(db, 'users', user.uid),{
            photoURL:pfpUrl
          })
          
          
        }
        catch(err){
          console.log(err.msg)
        }
        finally{
          handleExit();
        }
        
      }
      getUsers();
      handleUpdate();
      setProfPosts(profPosts.map((post)=>{
        return {...post, avatar:pfpUrl}
      })
        
      )
    }
  }
  const handleCover=()=>{
    if (coverUrl){
      user.coverPhoto=coverUrl;
      const handleUpdate=async()=>{
        try{
          await updateDoc(doc(db, 'users', user.uid),{
            coverPhoto:coverUrl
          })
          
        }
        catch(err){
          console.log(err.msg)
        }
        finally{
          handleExit()
        }
        
      }
      getUsers();
      
      handleUpdate();
      
    }
  }
  const handleEditExit=()=>{
    setEditWork(false);
    setEditGrad(false);
    setEditLocation(false);
  }
  const handleEditWork=()=>{
    setEditWork(true);
  }

  const handleEditGrad=()=>{
    setEditGrad(true)
  }
  const handleEditLocation=()=>{
    setEditLocation(true);
  }

  const saveDetailsWork=()=>{
    if (workText.length < 2){
      setError('You must type something into the field!')
    }
    else{
    user.jobText=workText;
    const handleAsync=async()=>{
      try {
        updateDoc(doc(db, 'users', user.uid),{
          'jobText':user.jobText
        })
      } catch (error) {
        console.log(error)
      }
      finally{
        setWorkText('');
        setEditWork(false);
        setError('')
      }
    }
      getUsers();
    handleAsync();
  }
  }
  const saveDetailsGrad=()=>{
    if (gradText.length < 2){
      setError('You must type something into the field!')
    }
    else{
    user.gradText=gradText;
    const handleAsync=async()=>{
      try {
        updateDoc(doc(db, 'users', user.uid),{
          'gradText':user.gradText
        })
      } catch (error) {
        console.log(error)
      }
      finally{
        setGradText('');
        setEditGrad(false);
        setError('')
      }
    }
    getUsers();
    handleAsync();
  }
  }
  const saveDetailsLocation=()=>{
    if (locationText.length < 2){
      setError('You must type something into the field!')
    }
    else{
    user.Location=locationText;
    const handleAsync=async()=>{
      try {
        updateDoc(doc(db, 'users', user.uid),{
          'Location':user.Location
        })
      } catch (error) {
        console.log(error)
      }
      finally{
        setLocationText('');
        setEditLocation(false);
        setError('')
      }
    }
      getUsers();
    handleAsync();
  }
  }

  const handleWorkText=(e)=>{
    setWorkText(e.target.value)
  }
  const handleGradText=(e)=>{
    setGradText(e.target.value)
  }
  const handleLocationText=(e)=>{
    setLocationText(e.target.value);
  }
  const imgBorder=(post)=>{
    if (pfpUrl===post.imageUrl){
      return (
        '6px solid #011949'
      )
    }
  }
  const imgBrightness=(post)=>{

      if(pfpUrl===post.imageUrl){
        return (
          'brightness(120%)'
        )
      }
  }
   const selectedImageStyles=(post)=>{
  return(
    {
      backgroundImage:`url(${post.imageUrl})`,
      filter:imgBrightness(post),
      border:imgBorder(post)
    }
  )
 }
  return (
    <div style={{pointerEvents:'all'}} className='functional-modal'>
      <div  className='opening-div'>
        <p>
          {editPfp && 'Change your profile picture'}
          {editCover && 'Change your cover picture'}
          {editDetails && 'Edit your profile details'}
        </p>
        <AiOutlineCloseCircle onClick={handleExit} className='exit-icon' />
      </div>
      
      { editPfp &&  <div className='content-div'>
        


           <div className='select-photo'> 
              <p>Select a photo</p>
              <div className='select-album'>
                <div className='select-grid'> 
                   {profPosts.map((post,index,arr)=>{
                          if (index > arr.length - 10){
                            return <div  onClick={()=>{setPfpUrl(post.imageUrl)}} key={index} style={selectedImageStyles(post)} className='select-grid-image' ></div>
                          }
                        })}
                </div>
              </div>
              <div className='button-container'> <button onClick={handlePfp} className='save-button'>Save</button> </div>
           </div>
      </div>}

        {editCover && <div className='content-div'>
           <div className='select-photo'> 
              <p>Select a photo</p>
              <div className='select-album'>
                <div className='select-grid'> 
                   {profPosts.map((post,index,arr)=>{
                          if (index > arr.length - 10){
                            return <div onClick={()=>{setCoverUrl(post.imageUrl)}} key={index} style={selectedImageStyles(post)} className='select-grid-image' ></div>
                          }
                        })}
                </div>
              </div>
              <div className='button-container'> <button onClick={handleCover} className='save-button' >Save</button> </div>
           </div>
      </div> }
      {editDetails && <div className='content-div'>
        <div className='edit-details-text'> 
          <p>Update your profile details</p>
        </div>



        <div className='editable-details'>
          <div className='work'>
             <p>Work</p>
             <div className='details-container'> 
             <div className='edit-div'>
              { !editWork && <p>Working at {user.jobText}</p>}
              { editWork && <input spellCheck={false} placeholder={'Your workplace...'} value={workText} onChange={handleWorkText} className='edit-detail-input' type='text'></input>}
              {editWork && <p className='edit-error'>{error}</p>}
             </div>
             { !editWork ? <span className='edit-icon'> <FiEdit2 onClick={handleEditWork} /></span> : <button  onClick={saveDetailsWork} className='edit-detail-button'>Save</button> }
             </div>
          </div>
          <div className='study'> 
          <p>School</p>   
              <div className='details-container'>
              <div className='edit-div'>
              { !editGrad && <p>Studied at {user.gradText}</p>}
              { editGrad && <input value={gradText} placeholder={'Your School...'}  spellCheck={false} onChange={handleGradText} className='edit-detail-input' type='text'></input>}
              {editGrad && <p className='edit-error'>{error}</p>}
             </div>
              { !editGrad ? <span className='edit-icon'> <FiEdit2 onClick={handleEditGrad} /></span> : <button onClick={saveDetailsGrad} className='edit-detail-button'>Save</button> }
               
                <div className='details-container'> 
                </div> 
        
            </div> 

            
            
                      
          </div>
          <div className='location'> 
          <p>Place</p>
             <div className='details-container'> 
             <div className='edit-div'>
              { !editLocation && <p>From {user.Location}</p>}
              { editLocation && <input value={locationText} onChange={handleLocationText} className='edit-detail-input' placeholder={'Your hometown...'}  spellCheck={false} type='text'></input>}
              {editLocation && <p className='edit-error'>{error}</p>}
             </div>
              { !editLocation ? <span className='edit-icon'> <FiEdit2 onClick={handleEditLocation}/></span> :  <button onClick={saveDetailsLocation} className='edit-detail-button'>Save</button> }
             </div>
          </div>
         </div>
       
      </div>}

    </div>
  )
}

export default FunctionalModal
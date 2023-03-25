import React from 'react';
import { useAuth } from './AuthContext';
import { useState, useEffect, useRef } from 'react';
import {BsFillImageFill} from 'react-icons/bs';
import {doc, addDoc, collection,getDocs,updateDoc} from 'firebase/firestore';
import { db } from './firebase-config';
import Post from './Post';
import { uploadBytes,ref,getStorage,getDownloadURL } from 'firebase/storage';
import {useNavigate} from 'react-router-dom';
import { Link } from 'react-router-dom';
import {IoMdImages} from 'react-icons/io';
import {FaUserFriends} from 'react-icons/fa';

const Feed = ({currentUserObj, users}) => {
  const {currentUser}=useAuth();
  const [postText, setPostText]=useState('');
  const [image, setImage]=useState('');
  const [submit, setSubmit]=useState(false);
  const [posts, setPosts]=useState([{}]);
  const [postError, setPostError]=useState('');
  const [timestamp, setTimeStamp]=useState(new Date().getTime().toString());
  const [imageUrl, setImageUrl]=useState('');
  const [postId, setPostId]=useState('');
  const [loading, setLoading]=useState(false);
  const [newPostDesc, setNewPostDesc]=useState('');
  const [showLikers, setShowLikers]=useState(false);
  const [date, setDate]=useState(new Date().toLocaleDateString());
  const [test, setTest]=useState(false);
  const [postComm, setPostComm]=useState('')
  const storage=getStorage();
  const [options, setOptions]=useState();
  const [edit, setEdit]=useState();
  const [editText, setEditText]=useState('');
  
    const postsRef= collection(db, 'posts');
     const navigate=useNavigate();

     const navigateToProfile=()=>{
      navigate(`/profile/${currentUser.uid}`)
     }
     const navigateToImages=()=>{
      navigate(`/profile/${currentUser.uid}/photos`)
     }
     const navigateToFriends=()=>{
      navigate(`/profile/${currentUser.uid}/friends`)
     }
  const uploadImg= async()=>{
      const storageRef= ref(storage, `images/${image.name}${timestamp}`)
    try{
    const result=await uploadBytes(storageRef, image);  // Uploading to firebase storage
    downloadImg()                                       // Downloading the img asap

    }
    catch(error){
      console.log(error.message)
    }
  }
  useEffect(()=>{
    const addUser=async()=>{
   
    }
 addUser()
  }, [currentUser])
const getPosts=async() =>{
      const result=await getDocs(postsRef);
      setPosts(result.docs.map((doc)=>{            // reading data from firestore
       return {...doc.data()}; 
      }))
    }
 
    
    
  const downloadImg= async () =>{
    
    try{
    const gsReference= ref(storage, `gs://social-media-app-data-base.appspot.com/images/${image.name}${timestamp}`)
    const result=await getDownloadURL(gsReference); //Updates post object with the 
     setImageUrl(result);                             //downloaded img and reads posts      
    }
    catch(err){
      console.log(err.message);
    }
  }
  useEffect(()=>{
    let subscribed=true;                  
    if(subscribed){
    if (imageUrl){
      const postref=doc(db, 'posts', postId) 
      updateDoc(postref, {
        imageUrl:imageUrl,
        postId:postId
                     
      })
    }
    
    getPosts()
  }
  return(
     setImageUrl(''),
    setImage(''),
    setNewPostDesc(''),
    setTimeStamp('')
  );
  }, [imageUrl])
  useEffect(()=>{
    if (postId){
     const postref=doc(db, 'posts', postId)
      updateDoc(postref,{
        postId:postId
      })
    }
  }, [submit])

  const handleChange= (e) => {
    setPostText(e.target.value);
  }

 const navigateToFriendProfile=(uid)=>{
  navigate(`/profile/${uid}`)
 }

  const handleImage=(e)=>{
    const time=new Date().getTime().toString();
    let today = new Date().toLocaleDateString();
    setDate(today);
    setTimeStamp(time);
    console.log(e.target.files)
    if (e.target.files){
      console.log(e.target.files)
       const pic=e.target.files[0];
      setImage(pic)
    }
    if (e.target.files.length===0){
      e.target.files.name='x'
    }
    console.log('ah')
  }


  const handleSubmit= async (e)=>{
    e.preventDefault();
    
    try{
    if (postText || image) {
      setSubmit(true);
      if(image && !postError){
        uploadImg();
      }
     
    const docRef= await addDoc(collection(db, 'posts'),{ //adding data to firestore
      description:postText,
     timestamp:timestamp,
     imageUrl:imageUrl,
      username:currentUser.displayName,
      uid:currentUser.uid,
      date:date,
      likes:0,
      likedBy:[],
      comments:[],
      showComments:false,
      avatar:currentUser.photoURL,
      postOptions:false,
      showLikers:false,
      edit:false
    })
    setNewPostDesc(postText)
    const id=docRef.id;
    console.log(id);
    setPostId(id);
    setLoading(true);
  }
    else{
      throw new Error('You must either select an image or type some text');
    }
    
  }
  catch(err){
    setPostError(err.message);
    console.log(err.message)
  }
  finally{
    setSubmit(false);
    setPostText('');
    setLoading(false);
    getPosts();
  }
  }

const optionsRef=useRef();
  return (
    <main className='feed-container'>
      <div className='sidebar'>
        <div className='sidebar-container'>
            <div onClick={navigateToProfile} className='user-profile'> 
              <div className='user-image' style={{backgroundImage:`url(${currentUser.photoURL})`}}></div>
              <p className='user-name'>{currentUser.displayName}</p>
             </div>
             <div onClick={navigateToImages} className='user-profile'>
              <span className='sidebar-icon'><IoMdImages/></span>
              <Link className='profile-images' to={`/profile/${currentUser.uid}/photos`}>Images</Link>
             </div>
             <div onClick={navigateToFriends} className='user-profile'>
              <span className='sidebar-icon'><FaUserFriends/></span>
              <Link to={`/profile/${currentUser.uid}/friends`} className='profile-friends'>Friends</Link>
             </div>
        </div>
      </div>
      <div className='feed-content'>
      <form className='feed' onSubmit={handleSubmit}>
        <input id='create-post'  type='text' onChange={handleChange} value={postText} placeholder='Create a new post...'></input>
        <div className='upload-img'>
          <p>Upload an image</p>
           <label className='img-icon' htmlFor='img'><BsFillImageFill className='img-icon'/></label>
           <input id='img' onChange={handleImage} type='file'></input>
        </div>
        <input type="submit" disabled={loading} className='post-button' value='Post' ></input>
        {postError && <p className='form-error post'>{postError}</p>}
        {image && <p className='selected-text'>Image selected</p>}
      </form>
        {posts.map((post, index)=>{
    return <Post users={users} showLikers={showLikers} posts={posts} setShowLikers={setShowLikers} getPosts={getPosts} test={test} setTest={setTest} options={options}  setOptions={setOptions} key={index} post={post}  postComm={postComm} edit={edit} setEdit={setEdit} setPostComm={setPostComm} optionsRef={optionsRef} editText={editText} setEditText={setEditText} />
  })}
  </div>
  <div className='friends-bar'>
    <div className='friends-container'>
      <p className='friends-tag'>Friends</p>
       { currentUserObj?.friends.length > 0 ? currentUserObj?.friends?.map((friend, index)=>{
        return(
          <div key={index} onClick={()=> navigateToFriendProfile(friend.uid)} className='frnd'>
            <div style={{backgroundImage:`url(${friend.photo})`}} className='user-image'> 
            </div>
            <p className='user-name'>{friend.displayName}</p>
          </div>
        )
      }) : <p className='empty-list'>Your friend list is empty</p>}
    </div>
  </div>
    </main>
  )
}

export default Feed

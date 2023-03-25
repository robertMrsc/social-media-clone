import React, { useEffect } from 'react';
import Comment from './Comment';
import { useAuth } from './AuthContext';
import { db } from './firebase-config';
import { updateDoc , doc, arrayUnion, deleteDoc} from 'firebase/firestore';
import {AiFillLike} from 'react-icons/ai';
import {VscComment} from 'react-icons/vsc';
import LikesModal from './LikesModal';
import {SlOptions} from 'react-icons/sl'
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
const Post = ({post, getPosts, test, setTest, postComm, setPostComm, showLikers, setShowLikers, options, setOptions, setEdit, editText, setEditText, posts, users}) => {
  const postAuthor=users?.filter((user)=>{
    return user.uid===post.uid
  })
  console.log(postAuthor)
  const navigate=useNavigate();
  const navigateToProfile=(uid)=>{
    navigate(`/profile/${uid}`)
  }
  const optionsRef=useRef();
  const {currentUser}=useAuth();
  const handleLikes=()=>{
    const index=post.likedBy.indexOf(currentUser.displayName);
    const rob=post.likedBy.filter((liker)=>(
      currentUser.uid===liker.uid
    ))
      if (!rob[0]?.uid?.includes(currentUser.uid)){
        post.likes++
        post.likedBy.push({
          username:currentUser.displayName,
          photo:currentUser.photoURL,
          uid:currentUser.uid
        })
        console.log(post);
      }
       else{
        post.likes--
        post.likedBy.splice(index, 1)
      }
      


      
    const postRef=doc(db, 'posts', post.postId)
      const handleClick=async ()=>{
        try{
        await updateDoc(postRef,{
          likedBy:post.likedBy,
          likes:post.likes
        })
        getPosts();
      }
      catch(err){
        console.log(err.message)
      }
    }
      handleClick()
    }
    

    const handleComments=() => {
    post.showComments=!post.showComments;
    console.log(post.showComments)
    const postRef=doc(db, 'posts', post.postId);
    setTest(!test)
    //const handleUpdate=async () =>{
      //await updateDoc(postRef,{
      //  showComments:post.showComments
    //  })
     // getPosts();
    }
   // handleUpdate();
   // }
   const handleSubmit= async (e) => {
    const postRef=doc(db, 'posts', post.postId);
    e.preventDefault()
    
    try{
      if (postComm){
         
      await updateDoc(postRef,{
      comments:arrayUnion({
        Username:currentUser.displayName,
        photoUrl:currentUser.photoURL,
        comment:postComm,
        likes:0,
        likedBy:[],
        uid:currentUser.uid
      }),

      
    })
    getPosts()
    }
    else{
      throw new Error('You must type something in order to post a comment')
    }
  }
    catch(err){
      console.log(err.message)
    }
    finally{
      setPostComm('');
        

    }
   }
   const handleChange=(e) => {
      setPostComm(e.target.value)
   }
   const handleLikers=()=>{
    setShowLikers(true);
    post.showLikers=true;
   }
   const handleOptions=()=>{
    setOptions(!post.postOptions)
    post.postOptions=!post.postOptions;
    console.log(optionsRef.current)
    console.log(post)
    
   }
   const hideOptions=()=>{
    setOptions(false);
    post.postOptions=false;
    
   }
   
   const windowEvent=(e)=>{
    if(optionsRef.current && !optionsRef.current.contains(e.target)){
      console.log('aaaa')
     
    }
   }
       document.addEventListener('mousedown', windowEvent )

       const handleEdit=()=>{
        post.edit=true;
        setEdit(post.edit);
        post.postOptions=false;
        setOptions(false);
        setEditText(post.description)
       }
       const handleEditChange=(e)=>{
        setEditText(e.target.value)
       }
       const handleEditSubmit=(e)=>{
        e.preventDefault();
        post.description=editText;
        post.edit=false;
        setEdit(false);
        const updatePosts= async () =>{
         await updateDoc(doc(db, 'posts', post.postId),{
            description:post.description
          })
          getPosts()
        }
        updatePosts();
       }
       const handlePostDelete= async ()=>{
          await deleteDoc(doc(db, 'posts', post.postId))
          getPosts();
       }
       const closeLikers=()=>{
        setShowLikers(false);
    post.showLikers=false;
   }
  return (
    <div className='post-container'>
      {post?.showLikers && showLikers && <LikesModal closeLikers={closeLikers} post={post}/>}
      <div className='post-info'>
        <div onClick={()=>navigateToProfile(post.uid)} className='user-image' style={{backgroundImage:`url(${post?.avatar})`}} ></div>
        <div className='author-date'>
        <p onClick={() => navigateToProfile(post.uid)} className='post-author'>{post?.username}</p>
        <p className='post-date'>{post?.date}</p>
        </div>
        <div  className='post-options'>
          <div  className='relative-container'>
                <span  onClick={handleOptions} className='options-icon'> < SlOptions/> </span>
                <div  className={  options &&  post.postOptions ? 'options-menu open' : 'options-menu'}>
                <ul className='options-list'>
            <li onClick={handleEdit} className='option'>Edit your post</li>
            <li onClick={handlePostDelete} className='option'>Delete your post</li>
                </ul>
              </div>
              </div>
                
                
              
              </div>
              
        </div>
        { post?.edit ? <form onSubmit={handleEditSubmit} className='edit-post'> 
          <input spellCheck={false} onChange={handleEditChange} value={editText} type='text'></input>
          <button className='submit-edit' type='submit'>Submit</button>
        </form> : 
       post?.description && <p className='post-description'>{ post?.description}</p>
        }
        { post?.imageUrl && <div className='post-image' style={{backgroundImage:`url(${post?.imageUrl})`}}></div>}
        <div className='container-likez'>
        <div  className='post-likez'>
          <span onClick={handleLikers} className='likes-icon'><AiFillLike/></span>
        <p onClick={handleLikers} className='like-count'>{post?.likes}</p>
        </div>
        <p className='commentz'>Comments: {post.comments?.length}</p>
        </div>
        <div className='post-buttons'>
          <div role='button'  onClick={handleLikes} className={post?.likedBy?.filter((liker)=>(
      currentUser.uid===liker.uid
    ))[0]?.uid?.includes(currentUser?.uid) ? 'like liked': 'like'}>
              <span className={'like-icon'}><AiFillLike/></span>
              <p>Like</p>
          </div>
          <div className='comment' onClick={handleComments}>
              <span className='comment-icon'><VscComment/></span>
              <p>Comment</p>
          </div>
        </div>
        { post?.showComments &&
         <div className='comments'>
         <form onSubmit={handleSubmit} className='new-comment'>
          <div className='user-image' style={{backgroundImage:`url(${currentUser?.photoURL})`}}></div>
            <input type="text" value={postComm} onChange={handleChange} placeholder='Add a new comment...' ></input>
            <button className='submit-comment' type='submit'>Post</button>
          </form>
         <div className='comments-list'>
           {post?.comments && post?.comments.map((comment, index)=>{
            return <Comment post={post} index={index} getPosts={getPosts} key={index} comment={comment}/>
          
          })} </div>
           
        </div>
          }
          
    </div>
  )
}

export default Post
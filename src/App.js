import './index.scss';
import { db } from './firebase-config';
import {collection, getDocs} from 'firebase/firestore'
import { useState , useEffect} from 'react';
import Header from './Header';
import Footer from './Footer';
import Feed from './Feed';
import { Routes, Route,} from 'react-router-dom';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import { AuthProvider, useAuth } from './AuthContext';
import PrivateFeed from './PrivateFeed';
import Profile from './Profile';
import Gallery from './Gallery';
import { auth } from './firebase-config';
import Friends from './Friends';


function App() {
  const [requests, setRequests]=useState(false);
   const [status, setStatus]=useState(false);
   const [users, setUsers]=useState([]);
   const [posts, setPosts]=useState([]);
   const [profPosts, setProfPosts]=useState([]);
   const [edit, setEdit]=useState(false);
   const [jobText, setJobText]=useState('');
   const [gradText, setGradText]=useState('');
   const [showLikers, setShowLikers]=useState(false);
   const [modalStatus, setModalStatus]=useState(false);
  const usersRef=collection(db, 'users');
  const postsRef=collection(db, 'posts')
      const getUsers=async()=>{
      const result=await getDocs(usersRef);
      setUsers(result.docs.map((doc)=>{
        return {...doc.data()}
      }))
      
    }
    const getPosts=async()=>{
      const result=await getDocs(postsRef)
      setPosts(result.docs.map((doc)=>{
        return {...doc.data()}
      }))
    }
    useEffect(()=>{
    getUsers();
    }, [status])
    
    useEffect(()=>{
      getPosts();
    },[])

    const currentUserObj=users?.filter((user)=>{
      if (auth.currentUser){
        return user.uid===auth.currentUser.uid
      }
    })[0]
      // const {users}=useAuth()  <<<<< empty object pana dupa primu render
  return (
    <div className="App">
    <AuthProvider>
        <Header modalStatus={modalStatus} setModalStatus={setModalStatus} requests={requests} getUsers={getUsers} currentUserObj={currentUserObj} setRequests={setRequests} users={users} />
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage status={setStatus} /> } />
          <Route forceRefresh={true} path='/' element={ <PrivateFeed> <Feed users={users} currentUserObj={currentUserObj} /> </PrivateFeed> } />
          {users?.map((user, index)=>{

            return  <Route key={index} path={'/profile/' + user.uid}  element={<Profile user={user} currentUserObj={currentUserObj} getUsers={getUsers} edit={edit} setEdit={setEdit} jobText={jobText} setJobText={setJobText} showLikers={showLikers} setShowLikers={setShowLikers} gradText={gradText} setGradText={setGradText}  profPosts={profPosts} setProfPosts={setProfPosts} getPosts={getPosts} posts={posts} />} />
          })}
          {users?.map((user, index)=>{
            return <Route key={index} path={`/profile/${user.uid}/photos`}  element={<Gallery user={user} posts={posts} setProfPosts={setProfPosts} profPosts={profPosts} />}  />
          })}
          {users?.map((user, index)=>{
            return <Route key={index} path={`/profile/${user.uid}/friends`}  element={<Friends user={user} posts={posts} setProfPosts={setProfPosts} profPosts={profPosts} />}  />
          })}
        </Routes>
        <Footer currentUser={currentUserObj}/>
        </AuthProvider>
    </div>
  );
}

export default App;

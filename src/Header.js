import React, { useState } from 'react';
import {FaMoon} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import SearchPeople from './SearchPeople';
import { useNavigate } from 'react-router-dom';
import {BsBellFill} from 'react-icons/bs';
import RequestModal from './RequestModal';
import { useRef } from 'react';
import {FaBars} from 'react-icons/fa'


const Header = ({users, currentUserObj, requests, setRequests, getUsers}) => {
  const {currentUser, signOff}=useAuth();
  const [searchText, setSearchText]=useState('');
  const handleSearchText=(e)=>{
    setSearchText(e.target.value)
  }
  const navigate=useNavigate();
  const navProfile=()=>{
    navigate(`/profile/${currentUser.uid}`)
  }
  const ref=useRef(null);
  
const openRequests=()=>{
        if (!requests){
          setRequests(true);
        }
        if (requests){
          setRequests(false)
        }
    }  
  return (
    <header className='header'>
      <div className='logo-div'>
        <span className='logo-container'> <Link onClick={()=> setSearchText('')} to='/'><FaMoon className='logo'/></Link> </span>
        </div>
        <form className='form'>
          { currentUser && <input spellCheck='false' value={searchText} onChange={handleSearchText}  className='searchbar' type='text' placeholder='Search people...'>
          </input>}
          { searchText && <SearchPeople  setSearchText={setSearchText} users={users} searchText={searchText} />}
        </form>
       { currentUser &&  <div onClick={navProfile} style={{backgroundImage:`url(${currentUser.photoURL})`}} className='your-profile'></div> }
       <div className='notifications-container'>
        { currentUser && <span ref={ref} onClick={openRequests} className='notifications'><BsBellFill/></span>}
       { requests && <RequestModal getUsers={getUsers} currentUserObj={currentUserObj} requests={requests} setRequests={setRequests}  /> } 
        </div>

        <div className='user'> 
            { !currentUser && <p><Link to='/login'>Sign in</Link></p>}
            {currentUser && <p><Link onClick={signOff} to='/login' >Sign out</Link></p>}
        </div>
        { currentUser && <span className='bars'><FaBars/></span>}
        
    </header>
  )
}

export default Header
import React from 'react';
import { useNavigate } from 'react-router-dom';
const SearchPeople = ({users, searchText, setSearchText}) => {
  const searchResults=users?.filter((user)=>{
    return user.displayName.includes(searchText)
  })
    const navigate=useNavigate();
    const navProfile=(user)=>{
      navigate(`/profile/${user.uid}`);
      setSearchText('')
    }

  return (
    <div className='search-people'>
        <div className='search-list'>
            {searchResults?.map((user)=>{
              return <div onClick={()=> navProfile(user)} className='filtered-user'>
                <div className='user-image' style={{backgroundImage:`url(${user.photoURL})`}} > </div>
                <p>{user.displayName} </p>
              </div>
            })}
        </div>
    </div>
  )
}

export default SearchPeople
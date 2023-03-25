import React, { useEffect } from 'react';
import { auth } from './firebase-config';

const Footer = ({currentUserObj}) => {

  const position=()=>{
    if (!auth.currentUser){
      return(
      {
        position:'absolute',
        bottom:'0'
      }
      )
    }
  }
  
  return (
    <footer style={position()}>By Marsch Robert</footer>
  )
}

export default Footer
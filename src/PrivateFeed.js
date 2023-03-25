import React from 'react';
import { useAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';

const PrivateFeed = ({children}) => {
    const {currentUser}=useAuth();
  return (
      currentUser ? children :<Navigate to="/login"/>
  )
}

export default PrivateFeed
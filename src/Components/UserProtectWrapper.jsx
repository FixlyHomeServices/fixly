import React, { useContext, useEffect, useState } from 'react';
import { UserDataContext } from '../context/usercontext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserProtectWrapper = ({ children }) => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserDataContext);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
        console.log("token is not there moww")
      navigate('/login');
      return;
    }
  
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.status === 200) {
          setUser(res.data);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchUserProfile();

    return () => {
      setLoading(false); // Ensures no stale state
    };
  }, [token, navigate, setUser]);

  if (loading) {
    return <>loading...</>;
  }

  return <div>{children}</div>;
};

export default UserProtectWrapper;
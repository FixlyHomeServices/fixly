import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const logoutUser = async () => {
      try {
        const res = await axios.post("http://localhost:3001/auth/logout", {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.status === 200) {
          localStorage.removeItem('token');
          navigate('/home');
        }
      } catch (err) {
        console.error("Logout error:", err);
        navigate('/home');
      }
    };

    logoutUser();
  }, [token, navigate]);

  return (
    <div>
      Logging out...
    </div>
  );
};

export default Logout;
import React, { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem('token')

    useEffect(() => {
        navigate('/home')
    }, [token])

    axios.get(`${import.meta.env.VITE_BASE_URL}user/logout`, {
        headers:{
            Authorization: `Bearer ${token}`
        }
    }).then((res) => {
        if(res.status === 200)
        {
            localStorage.removeItem('token')
        }
    })
  return (
    <div>
      Logout
    </div>
  )
}

export default Logout
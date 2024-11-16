import React, { useEffect } from 'react'
import { Navigate, useNavigate, useRouteLoaderData } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {setUser } from '../redux/userSlice';
import axios from 'axios';
import { hideLoading, showLoading } from '../redux/alertsSlice';
import { API_BASE_URL } from "../constants";

function ProtectedRoute(props) {
    console.log(props);
    const { user} = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const getUser = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.post(`${API_BASE_URL}/api/user/getUserInfo`,
              { token: localStorage.getItem('token') },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
              }
            );
            dispatch(hideLoading());
            if (response.data.success) { 
                dispatch(setUser(response.data.data));
            } else {
                localStorage.clear();
                navigate("/login");
            }
        } catch (error) {
          dispatch(hideLoading());
          localStorage.clear();
          navigate("/login");
        }
    }
  useEffect(() => {
    if (props?.pageName === "Home") {
      if (!localStorage.getItem("token")) {
        localStorage.clear();
        navigate("/");
      } else {
        getUser();
      }
    } else {
      getUser();
    }
    }, []);
    
    if (localStorage.getItem('token')) {
        return props.children;
    } else if (!localStorage.getItem("token") && props?.pageName === "Home") {
      return props.children;
    } else {
      return <Navigate to="/login" />;
    }
}

export default ProtectedRoute
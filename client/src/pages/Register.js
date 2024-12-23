import React from 'react'
import { Button, Form, Input } from "antd";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import axios from 'axios';
import toast from 'react-hot-toast';
import { hideLoading, showLoading } from '../redux/alertsSlice';
import { API_BASE_URL } from "../constants";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onComplete = async(values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `${API_BASE_URL}/api/user/register`,
        values
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        toast("Redirecting to login page");
        navigate("/login");
      } else {
        toast.error(response.data.message); 
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error('something went wrong'); 
    }
  }
  return (
    <div className="auth">
      <div className="auth-form card p-3">
        <h1 className="card-title">Nice To Meet U</h1>
        <Form layout="vertical" onFinish={onComplete}>
          <Form.Item label="Name" name="name">
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input placeholder="Password" type="password" />
          </Form.Item>

          <Button
            className="primary-button my-2 full-width-button"
            htmlType="submit"
          >
            REGISTER
          </Button>

          <Link to="/login" className="link_a mt-2">
            CLICK HERE TO LOGIN
          </Link>
        </Form>
      </div>
    </div>
  );
}

export default Register
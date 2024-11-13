import React from "react";
import { Button, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {useDispatch} from 'react-redux'
import axios from "axios";
import { toast } from "react-hot-toast";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import { API_BASE_URL } from "../constants";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onComplete = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(`${API_BASE_URL}/api/user/login`, values);
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        toast("Redirecting to home page");
        localStorage.setItem("token", response.data.data);
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("something went wrong");
    }
  };
  return (
    <div className="auth">
      <div className="auth-form card p-3">
        <h1 className="card-title">Welcome Back</h1>
        <Form layout="vertical" onFinish={onComplete}>
          <Form.Item label="Email" name="email">
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input placeholder="Password" type="password" />
          </Form.Item>

          <Button className="primary-button my-2 full-width-button" htmlType="submit">
            LOGIN
          </Button>

          <Link to="/register" className="link_a mt-2">
            CLICK HERE TO Register
          </Link>
        </Form>
      </div>
    </div>
  );
}

export default Login;

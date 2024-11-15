import React, { useState } from 'react'
import '../layout.css'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Badge, Button } from 'antd';

function Layout({ children }) {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const userWithoutLogin = [
    {
      name: "Home",
      link: "/",
      icon: "ri-home-line",
    }
  ];
  const userMenu = [
    {
      name: "Home",
      link: "/",
      icon: "ri-home-line",
    },
    {
      name: "Appointments",
      link: "/appointments",
      icon: "ri-file-list-line",
    },
    {
      name: "Apply Doctor",
      link: "/apply-doctor",
      icon: "ri-hospital-line",
    },
    {
      name: "Profile",
      link: "/profile",
      icon: "ri-user-line",
    },
  ];
  const adminMenu = [
    {
      name: "Home",
      link: "/",
      icon: "ri-home-line",
    },
    {
      name: "Users",
      link: "/admin/userslist",
      icon: "ri-user-line",
    },
    {
      name: "Doctors",
      link: "/admin/doctorslist",
      icon: "ri-user-heart-line",
    },
    {
      name: "Profile",
      link: "/profile",
      icon: "ri-user-line",
    },
  ];

  const doctorMenu = [
    {
      name: "Home",
      link: "/",
      icon: "ri-home-line",
    },
    {
      name: "Appointments",
      link: "/doctor/appointments",
      icon: "ri-file-list-line",
    },
    {
      name: "Profile",
      link: `/doctor/profile/${user?._id}`,
      icon: "ri-user-line",
    },
  ];
  
  const menuTobeRendered = user==null ? userWithoutLogin : user?.isAdmin ? adminMenu : user?.isDoctor ? doctorMenu : userMenu;
  const role = user?.isAdmin ? "Admin" : user?.isDoctor ? "Doctor" : "User";
  

  return (
    <div className="main">
      <div className="layout d-flex">
        <div className="sidebar">
          <div className="sidebar-header">
            {!collapsed && <h1 className="logo">OOSADHI</h1>}
            {!collapsed && <h1 className="role">{role}</h1>}
          </div>
          <div className="sidebar-menu">
            {menuTobeRendered.map((menu) => {
              const isActive = location.pathname === menu.link;
              return (
                <div
                  className={`d-flex menu-item ${
                    isActive && "active-menu-item"
                  }`}
                >
                  <i className={menu.icon}></i>
                  {!collapsed && <Link to={menu.link}>{menu.name}</Link>}
                </div>
              );
            })}
            {user != null && (
              <div
                className={`d-flex menu-item`}
                onClick={() => {
                  localStorage.clear();
                  // navigate("/login");
                }}
              >
                <i className="ri-logout-box-line"></i>
                {!collapsed && <Link to="/login">Logout</Link>}
              </div>
            )}
            {user == null && (
              <div
                className={`d-flex menu-item`}
                onClick={() => {
                  localStorage.clear();
                  // navigate("/login");
                }}
              >
                <i className="ri-login-box-line"></i>
                {!collapsed && <Link to="/login">Login</Link>}
              </div>
            )}
            {user == null && (
              <div
                className={`d-flex menu-item`}
                onClick={() => {
                  localStorage.clear();
                  // navigate("/register");
                }}
              >
                <i className="ri-registered-line"></i>
                {!collapsed && <Link to="/register">Register</Link>}
              </div>
            )}
          </div>
        </div>
        <div className="content">
          <div className="header">
            {collapsed ? (
              <i
                className="ri-menu-line close-icon"
                onClick={() => setCollapsed(!collapsed)}
              ></i>
            ) : (
              <i
                className="ri-close-line close-icon"
                onClick={() => setCollapsed(!collapsed)}
              ></i>
            )}
            {user != null && (
              <div className="d-flex align-items-center px-4">
                <Badge
                  count={user?.unseenNotifications.length}
                  onClick={() => navigate("/notifications")}
                >
                  <i className="ri-notification-line close-icon px-3"></i>
                </Badge>
                <Link className="link_a mx-3" to="/profile">
                  {user?.name}
                </Link>
              </div>
            )}
            {user == null && (
              <div className="d-flex align-items-center px-4">
                <Button
                  type="primary"
                  className="primary-button mx-2"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
                <Button
                  type="primary"
                  className="primary-button mx-2"
                  onClick={() => navigate("/register")}
                >
                  Register
                </Button>
              </div>
            )}
          </div>
          <div className="body">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default Layout
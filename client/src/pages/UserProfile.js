import React from "react";
import Layout from "../components/Layout";
import { useSelector } from "react-redux";
import "../static/css/profile.css";

function UserProfile() {
  const { user } = useSelector((state) => state.user);
  console.log(user);
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(1) || ""}`;
  };

  const formatDate = (createdDate) => {
    const dateStr = createdDate;
    const date = new Date(dateStr);

    const formattedDate = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);

    return formattedDate;
  };

  return (
    user !== null && (
      <Layout>
        <div className="user-profile">
          <div className="user-basic-details">
            <img
              src={user.coverImage}
              alt="coverImage"
              className="cover-image"
            />
            <div className="basic-info">
              <div className="profile-image">
                {user?.profileImage === "N/A" ? (
                  <div className="card-profile-initials">
                    {getInitials(user.name, user.name)}
                  </div>
                ) : (
                  <img
                    src={user.profileImage}
                    alt="userImage"
                    className="card-profile-img"
                  />
                )}
              </div>
              <div className="profile-info">
                <span className="normal-text">{user.name}</span>
                <span className="normal-text">{user.email}</span>
                <span className="normal-text">
                  Memeber since {formatDate(user.createdAt)}
                </span>
              </div>
            </div>
          </div>
          <div className="appointment-detais">
            <div class="container">
              <div class="row">
                <div class="col-lg-4 col-md-6 mb-4">
                  <div class="card">
                    <div class="card-body">
                      <h5 class="card-title">1200</h5>
                      <p class="card-text">
                        Total Appointments
                      </p>
                    </div>
                  </div>
                </div>

                <div class="col-lg-4 col-md-6 mb-4">
                  <div class="card">
                    <div class="card-body">
                      <h5 class="card-title">100</h5>
                      <p class="card-text">
                        Appointments Attended
                      </p>
                    </div>
                  </div>
                </div>

                <div class="col-lg-4 col-md-12 mb-4">
                  <div class="card">
                    <div class="card-body">
                      <h5 class="card-title">200</h5>
                      <p class="card-text">
                        Upcoming Appointments
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="upcoming-appointments">
            <h4>Upcoming Appointments</h4>
          </div>
          <div className="previous-appointments">
            <h4>Previous Appointments</h4>
          </div>
          <div className="uploaded-documents">
            <h4>Uploaded Documents</h4>
          </div>
        </div>
      </Layout>
    )
  );
}

export default UserProfile;

import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

function Doctor({ doctor }) {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`;
  };
  return (
    <div
      className="card p-2 cursor-pointer"
      onClick={() => {
        if (user != null) {
          navigate(`/book-appointment/${doctor._id}`);
        } else {
          toast.error("Please login to book an appointment");
        }
      }}
    >
      <div className="d-flex">
        {doctor?.userId?.profileImage === "N/A" ? (
          <div className="card-profile-initials">
            {getInitials(doctor.firstName, doctor.lastName)}
          </div>
        ) : (
          <img
            src={doctor.userId.profileImage}
            alt="userImage"
            className="card-profile-img"
          />
        )}
        <div className="ml-1">
          <h1 className="card-title">
            {doctor.firstName} {doctor.lastName}
          </h1>
          <p>
            <b>Specialization : </b>
            {doctor.specialization}
          </p>
        </div>
      </div>
      <hr />
      {user != null && (
        <p>
          <b>Phone Number : </b>
          {doctor.phoneNumber}
        </p>
      )}
      <p>
        <b>Address : </b>
        {doctor.address}
      </p>
      <p>
        <b>Fee per Visit : </b>
        {doctor.feePerConsultation}
      </p>
      <p>
        <b>Timings : </b>
        {doctor.timings[0]} - {doctor.timings[1]}
      </p>
    </div>
  );
}

export default Doctor;

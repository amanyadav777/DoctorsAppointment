import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

function Doctor({ doctor }) {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  return (
    <div
      className="card p-2 cursor-pointer"
      onClick={() => {
        if (user != null) {
          navigate(`/book-appointment/${doctor._id}`)
        } else {
          toast.error("Please login to book an appointment");
        }
      }
      }
    >
      <h1 className="card-title">
        {doctor.firstName} {doctor.lastName}
      </h1>
        <p>
          <b>Specialization : </b>
          {doctor.specialization}
        </p>
      <hr />
      {user!=null && <p>
        <b>Phone Number : </b>
        {doctor.phoneNumber}
      </p>}
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

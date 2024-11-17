import { Button, Col, DatePicker, Row, TimePicker } from "antd";
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import {useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { API_BASE_URL } from "../constants";

function BookAppointment() {
  const [isAvailable, setIsAvailable] = useState(false);
  const navigate = useNavigate();
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const { user } = useSelector((state) => state.user);
  const [doctor, setDoctor] = useState(null);
  const params = useParams();
  const dispatch = useDispatch();

  const getDoctorData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `${API_BASE_URL}/api/doctor/get-doctor-info-by-id`,
        {
          doctorId: params.doctorId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideLoading());
      if (response.data.success) {
        setDoctor(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };
  const checkAvailability = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `${API_BASE_URL}/api/user/check-booking-availability`,
        {
          doctorId: params.doctorId,
          date: date,
          time: time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        setIsAvailable(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error booking appointment");
      dispatch(hideLoading());
    }
  };
  const bookNow = async () => {
    setIsAvailable(false);
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `${API_BASE_URL}/api/user/book-appointment`,
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctor,
          userInfo: user,
          date: date,
          time: time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/appointments");
      }
    } catch (error) {
      toast.error("Error booking appointment");
      dispatch(hideLoading());
    }
  };

    const disabledTime = () => {
      if (!doctor?.timings) return {};

      const [start, end] = doctor.timings.map((time) => moment(time, "HH:mm"));

      const doctorStartHour = start.hour();
      const doctorEndHour = end.hour();
      const doctorStartMinute = start.minute();
      const doctorEndMinute = end.minute();

      if (date && date === moment().format("DD-MM-YYYY")) {
        const currentHour = moment().hour();
        const currentMinute = moment().minute();

        return {
          disabledHours: () => {
            const disabledHours = [];

            for (let i = 0; i < doctorStartHour; i++) {
              disabledHours.push(i);
            }

            for (let i = doctorEndHour + 1; i < 24; i++) {
              disabledHours.push(i);
            }

            if (date === moment().format("DD-MM-YYYY")) {
              for (let i = 0; i < currentHour; i++) {
                disabledHours.push(i);
              }
            }

            return [...new Set(disabledHours)];
          },
          disabledMinutes: (selectedHour) => {
            // Disable all minutes initially if no hour is selected
            if (selectedHour === undefined) {
              return Array.from({ length: 60 }, (_, i) => i);
            }

            const disabledMinutes = [];

            if (selectedHour === doctorStartHour) {
              for (let i = 0; i < doctorStartMinute; i++) {
                disabledMinutes.push(i);
              }
            }

            if (selectedHour === doctorEndHour) {
              for (let i = doctorEndMinute + 1; i < 60; i++) {
                disabledMinutes.push(i);
              }
            }

            if (
              date === moment().format("DD-MM-YYYY") &&
              selectedHour === currentHour
            ) {
              for (let i = 0; i < currentMinute; i++) {
                disabledMinutes.push(i);
              }
            }

            return [...new Set(disabledMinutes)];
          },
        };
      }

      return {
        disabledHours: () => {
          const disabledHours = [];

          for (let i = 0; i < doctorStartHour; i++) {
            disabledHours.push(i);
          }
          for (let i = doctorEndHour + 1; i < 24; i++) {
            disabledHours.push(i);
          }

          return disabledHours;
        },
        disabledMinutes: (selectedHour) => {
          // Disable all minutes initially if no hour is selected
          if (selectedHour === undefined) {
            return Array.from({ length: 60 }, (_, i) => i);
          }

          if (selectedHour === doctorStartHour) {
            return Array.from({ length: doctorStartMinute }, (_, i) => i);
          }
          if (selectedHour === doctorEndHour) {
            return Array.from(
              { length: 60 - doctorEndMinute - 1 },
              (_, i) => i + doctorEndMinute + 1
            );
          }
          return [];
        },
      };
  };
  
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`;
  };
  
  useEffect(() => {
    getDoctorData();
  }, []);
  return (
    <Layout>
      {doctor && (
        <div>
          <div className="d-flex">
            {doctor?.userId?.profileImage === "N/A" ? (
              <div className="card-profile-initials">
                {getInitials(doctor.firstName, doctor.lastName)}
              </div>
            ) : (
              <img
                src="{doctor.profileImage}"
                alt="userImage"
                className="card-profile-img"
              />
            )}
            <div className="ml-1">
              <h1 className="page-title">
                {doctor.firstName} {doctor.lastName}
              </h1>
              <p>
                <b>Specialization : </b>
                {doctor.specialization}
              </p>
            </div>
          </div>
          <hr />
          <Row gutter={20} className="mt-5" align="middle">
            <Col span={8} sm={24} xs={24} lg={8}>
              <img
                src="https://thumbs.dreamstime.com/b/finger-press-book-now-button-booking-reservation-icon-online-149789867.jpg"
                alt=""
                width="100%"
                height="300"
              />
            </Col>
            <Col span={8} sm={24} xs={24} lg={8}>
              <h1 className="normal-text">
                <b>Timings :</b> {doctor.timings[0]} - {doctor.timings[1]}
              </h1>
              <p>
                <b>Phone Number : </b>
                {doctor.phoneNumber}
              </p>
              <p>
                <b>Address : </b>
                {doctor.address}
              </p>
              <p>
                <b>Fee per Visit : </b>
                {doctor.feePerConsultation}
              </p>
              <p>
                <b>Website : </b>
                {doctor.website}
              </p>
              <div className="d-flex flex-column pt-2 mt-2">
                <DatePicker
                  format="DD-MM-YYYY"
                  disabledDate={(current) => {
                    return current && current < moment().startOf("day");
                  }}
                  onChange={(value) => {
                    setDate(moment(value.$d).format("DD-MM-YYYY"));
                    setTime();
                    setIsAvailable(false);
                  }}
                />
                <TimePicker
                  format="HH:mm"
                  className="mt-3"
                  disabled={!date}
                  disabledTime={disabledTime}
                  showNow={false}
                  // value={time ? moment(time, "HH:mm") : ""}
                  onChange={(value) => {
                    setTime(moment(value.$d).format("HH:mm"));
                    setIsAvailable(false);
                  }}
                />
                {!isAvailable && (
                  <Button
                    className="primary-button mt-3 full-width-button"
                    onClick={checkAvailability}
                  >
                    Check Availability
                  </Button>
                )}

                {isAvailable && (
                  <Button
                    className="primary-button mt-3 full-width-button"
                    onClick={bookNow}
                  >
                    Book Now
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </div>
      )}
    </Layout>
  );
}

export default BookAppointment;
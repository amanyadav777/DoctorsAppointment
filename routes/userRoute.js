const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Doctor = require('../models/doctorModel');
const Appointment = require('../models/appointmentModel');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const authMiddleware = require('../middlewares/authMiddleware');
const moment = require('moment');

router.post('/register', async (req,res) => {
    try {
        const userExist = await User.findOne({ email: req.body.email });
        if (userExist) {
            return res.status(200).send({ message: "User already exists", success: false }); 
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;
        const newuser = new User(req.body);
        await newuser.save();
        res.status(200).send({ message: "User created successfully", success: true });
    } catch (error) {
        res.status(500).send({ message: "Error in creating user", success: true });
    }
})

router.post('/login', async (req,res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
          return res.status(200).send({ message: "User does not exist", success: false });
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
          return res.status(200).send({ message: "Invalid Credentials", success: false });
        } else {
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET, {
                expiresIn: "1d"
            })
            res.status(200).send({ message: "Login Successful", success: true, data:token });
        }  
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error in logging", success: false, error }); 
    }
})

router.post('/getUserInfo', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId });
        user.password = undefined;
        if (!user) {
            return res.status(200).send({ message: "User does not exist", success: false });
        } else {
            return res.status(200).send({
                success: true,
                data: user,
            });
        }
    } catch (error) {
        return res.status(500).send({ message: "Error in getting user Info", success: false, error });
    }
});

router.post("/apply-doctor-account", authMiddleware, async (req, res) => {
  try {
    const newdoctor = new Doctor({ ...req.body, status: "pending" });
    await newdoctor.save();
    const adminUser = await User.findOne({ isAdmin: true });

    const unseenNotifications = adminUser.unseenNotifications;
    unseenNotifications.push({
      type: "new-doctor-request",
      message: `${newdoctor.firstName} ${newdoctor.lastName} has applied for a doctor account`,
      data: {
        doctorId: newdoctor._id,
        name: newdoctor.firstName + " " + newdoctor.lastName,
      },
      onClickPath: "/admin/doctorslist",
    });
    await User.findByIdAndUpdate(adminUser._id, { unseenNotifications });
    res.status(200).send({
      success: true,
      message: "Doctor account applied successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error applying doctor account",
      success: false,
      error,
    });
  }
});

router.post(
  "/mark-all-notifications-as-seen",
  authMiddleware,
  async (req, res) => {
      try {
          const user = await User.findOne({ _id: req.body.userId });
          const unseenNotifications = user.unseenNotifications;
          const seenNotifications = user.seenNotifications;
          seenNotifications.push(...unseenNotifications);
          user.unseenNotifications = [];
          user.seenNotifications = seenNotifications;
          const updatedUser = await user.save();
          updatedUser.password = undefined;
          res.status(200).send({
            success: true,
            message: "All notifications marked as seen",
            data:updatedUser
          });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error applying doctor account",
        success: false,
        error,
      });
    }
  }
);
router.post(
  "/delete-all-notifications",
  authMiddleware,
  async (req, res) => {
      try {
          const user = await User.findOne({ _id: req.body.userId });
          user.seenNotifications = [];
          user.unseenNotifications = [];
          const updatedUser = await user.save();
          updatedUser.password = undefined;
          res.status(200).send({
            success: true,
            message: "All notifications deleted",
            data:updatedUser
          });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error applying doctor account",
        success: false,
        error,
      });
    }
  }
);

router.get("/get-all-approved-doctors", async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: "approved" }).populate(
      "userId",
      "name profileImage coverImage"
    );
    res.status(200).send({
      message: "Doctors featched successfully",
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error in featching doctors", success: false });
  }
});

router.post("/book-appointment", authMiddleware, async (req, res) => {
  try {
    req.body.status = "pending";
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    const newAppointment = new Appointment(req.body);
    await newAppointment.save();
    const user = await User.findOne({ _id: req.body.doctorInfo.userId });
    user.unseenNotifications.push({
      type: "new-appointment-request",
      message: `A new appointment request has been made by ${req.body.userInfo.name}`,
      onClickPath: "/doctor/appointments",
    });
    await user.save();
    res.status(200).send({
      message: "Appointment booked successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error booking appointment",
      success: false,
      error,
    });
  }
});

router.post("/check-booking-availability", authMiddleware, async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm")
      .subtract(19, "minutes")
      .toISOString();
    const toTime = moment(req.body.time, "HH:mm")
      .add(19, "minutes")
      .toISOString();
    const doctorId = req.body.doctorId;
    const appointments = await Appointment.find({
      doctorId,
      date,
      time: { $gte: fromTime, $lte: toTime },
    });
    if (appointments.length > 0) {
      return res.status(200).send({
        message: "Appointments not available",
        success: false,
      });
    } else {
      return res.status(200).send({
        message: "Appointments available",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error booking appointment",
      success: false,
      error,
    });
  }
});

router.get("/get-appointments-by-user-id", authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.body.userId });
    res.status(200).send({
      message: "Appointments fetched successfully",
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in fetching appointments",
      success: false,
      error,
    });
  }
});

module.exports = router;
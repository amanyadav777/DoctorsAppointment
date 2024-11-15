import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { Col, Row } from "antd";
import Doctor from "../components/Doctor";
import { useDispatch} from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import { API_BASE_URL } from "../constants";

function Home() {
  const [doctors, setDoctors] = useState([]);
  const dispatch = useDispatch();
  const getData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(`${API_BASE_URL}/api/user/get-all-approved-doctors`);
      dispatch(hideLoading());
      if (response.data.success) {
        setDoctors(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <Layout>
      <Row gutter={20}>
        {doctors.map((doctor) => (
          <Col span={8} xs={24} sm={24} lg={8} className="mt-2">
            <Doctor doctor={doctor} />
          </Col>
        ))}
      </Row>
    </Layout>
  );
}

export default Home;
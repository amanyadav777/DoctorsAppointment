import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { Col, Row, Input, Button } from "antd";
import { SearchOutlined } from '@ant-design/icons';
import Doctor from "../components/Doctor";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import { API_BASE_URL } from "../constants";
import { toast } from "react-hot-toast";
const { Search } = Input;

function Home() {
  const [doctors, setDoctors] = useState([]);
  const [filteredData, setFilteredData] = useState(doctors);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  const onChange = (e) => {
    setSearchTerm(e.target.value);

    const filtered = doctors.filter((doctor) => {
      return (
        doctor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doctor.firstName+' '+doctor.lastName).toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    setFilteredData(filtered);
  };

  const getData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        `${API_BASE_URL}/api/user/get-all-approved-doctors`
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setDoctors(response.data.data);
        setFilteredData(response.data.data);
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
      <div className="search-bar">
      <Search
        placeholder="Search Doctors..."
        value={searchTerm}
        onChange={onChange}
        className="custom-search"
        enterButton
      />
      <p className="no-result" style={{ display: filteredData.length === 0 ? 'block' : 'none' }}>No result found...</p>
      </div>
      <Row gutter={20}>
        {filteredData.map((doctor) => (
          <Col span={8} xs={24} sm={24} lg={8} className="mt-2">
            <Doctor doctor={doctor} />
          </Col>
        ))}
      </Row>
    </Layout>
  );
}

export default Home;

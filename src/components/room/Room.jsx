import React, { useEffect, useState } from "react";
import { getAllRooms, getRoomTypes } from "../utils/ApiFunctions";
import RoomCard from "./RoomCard";
import { Col, Container, Row } from "react-bootstrap";
import { Checkbox, Pagination, Select, Slider } from "antd";
import { useLocation } from "react-router-dom";
import { formatVND } from "../helpers/helpers";
import { getAllServices } from "../utils/services";
import { use } from "react";
import { getSearchAvailableRoom } from "../utils/room";
import dispatchToast from "../helpers/toast";
import RoomSearch from "../common/RoomSearch";
// import RoomFilter from "../common/RoomFilter"
// import RoomPaginator from "../common/RoomPaginator"

const Room = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage, setRoomsPerPage] = useState(10);
  const [filteredData, setFilteredData] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [amount, setAmount] = useState({
    smallLimit: 0,
    largeLimit: 20000000,
  });
  const location = useLocation();
  const state = location.state;
  const [popularFilters, setPopularFilters] = useState({
    highRating: false,
    twoBeds: false,
    noAgeLimit: false,
    highFloor: false,
  });
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);

  const handleCheckboxChange = (key) => {
    setPopularFilters((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const fetchData = async () => {
    setIsLoading(true);
    const request = {
      checkInDate: state?.checkInDate || "",
      checkOutDate: state?.checkOutDate || "",
      numberAdult: state?.quantities.adults || 0,
      numberChildren: state?.quantities.children || 0,
      minPrice: amount.smallLimit || 0,
      maxPrice: amount.largeLimit || 20000000,
      hasHighFloor: popularFilters.highFloor,
      hasHighRating: popularFilters.highRating,
      hasTwoOrMoreBeds: popularFilters.twoBeds,
      serviceIds: selectedServiceIds.join(","),
    };
    console.log("request", request);
    const res = await getSearchAvailableRoom(request);
    console.log("res", res);
    if (res?.success) {
      setData(res?.data?.data);
      // dispatchToast("success", "Cập nhật danh sách phòng thành công!");
    } else {
      // dispatchToast("error", "Không tìm thấy phòng nào phù hợp!");
      setData([]);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [state, amount, popularFilters, selectedServiceIds]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await getAllServices();
      console.log("services", res);
      if (res?.data.success) {
        setAllServices(res?.data?.data.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // if (isLoading) {
  //   return <div>Loading rooms.....</div>;
  // }
  if (error) {
    return <div className=" text-danger">Error : {error}</div>;
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePageSizeChange = (current, pageSize) => {
    setRoomsPerPage(pageSize);
    setCurrentPage(1);
  };

  // const totalPages = Math.ceil(filteredData.length / roomsPerPage)

  const renderRooms = () => {
    const startIndex = (currentPage - 1) * roomsPerPage;
    const endIndex = startIndex + roomsPerPage;
    return data
      .slice(startIndex, endIndex)
      .map((room) => <RoomCard room={room} key={room.id} />);
  };

  const marks = {
    0: "0 VNĐ",
    20000000: {
      style: {
        color: "#f50",
      },
      label: <strong>20tr+VNĐ</strong>,
    },
  };

  // const renderCheckbox = (type) => {
  //   return allServices
  //     .filter((service) => service.serviceType === type)
  //     .map((service) => {
  //       return (
  //         <Checkbox key={service.id} value={service.id} >
  //           {service.name}
  //         </Checkbox>
  //       );
  //     });
  // };
  const handleSingleServiceToggle = (serviceId) => {
    setSelectedServiceIds((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const renderCheckbox = (type) => {
    return allServices
      .filter((service) => service.serviceType === type)
      .map((service) => {
        return (
          <Checkbox
            key={service.id}
            value={service.id}
            checked={selectedServiceIds.includes(service.id)}
            onChange={() => handleSingleServiceToggle(service.id)}
          >
            {service.name}
          </Checkbox>
        );
      });
  };

  const ItemCheckbox = ({ type }) => {
    return (
      <div
        style={{
          borderBottom: "1px solid #ccc",
          paddingTop: 10,
          paddingBottom: 20,
        }}
      >
        <p
          style={{
            fontSize: 16,
            fontWeight: 700,
            textAlign: "start",
          }}
        >
          {type + ":"}
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            gap: 10,
          }}
        >
          {renderCheckbox(type)}
        </div>
      </div>
    );
  };

  return (
    <Container>
      <h1 className="text-center">Danh sách phòng</h1>
      <RoomSearch state={state} />
      
      <Row
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 10,
          marginTop: 20
        }}
      >
        <div
          style={{
            border: "1px solid #ccc",
            width: "30%",
            borderRadius: 8,
            padding: 10,
          }}
        >
          <p
            style={{
              fontWeight: 700,
              textAlign: "start",
              borderBottom: "1px solid #ccc",
              paddingBottom: 10,
            }}
          >
            Chọn lọc theo:
          </p>

          <div
            style={{
              borderBottom: "1px solid #ccc",
              paddingBottom: 40,
            }}
          >
            <p
              style={{
                fontSize: 16,
                fontWeight: 700,
                textAlign: "start",
              }}
            >
              {"Ngân sách của bạn (mỗi đêm):"}
            </p>
            <p
              style={{
                fontSize: 14,
                fontWeight: 600,
                textAlign: "start",
              }}
            >
              {formatVND(amount.smallLimit)} VNĐ -{" "}
              {formatVND(amount.largeLimit)} VNĐ
            </p>
            <Slider
              range
              min={0}
              max={20000000}
              step={500000}
              defaultValue={[0, 20000000]}
              marks={marks}
              onAfterChange={(value) => {
                setAmount({
                  smallLimit: value[0],
                  largeLimit: value[1],
                });
                const filteredData2 = data.filter(
                  (room) =>
                    room.roomPrice >= value[0] && room.roomPrice <= value[1]
                );
                setFilteredData(filteredData2);
                setCurrentPage(1);
              }}
              style={{
                margin: "0 40px",
              }}
            />
          </div>

          <div
            style={{
              borderBottom: "1px solid #ccc",
              paddingTop: 10,
              paddingBottom: 20,
            }}
          >
            <p
              style={{
                fontSize: 16,
                fontWeight: 700,
                textAlign: "start",
              }}
            >
              {"Các bộ lọc phổ biến:"}
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                gap: 10,
              }}
            >
              <Checkbox
                checked={popularFilters.highRating}
                onChange={() => handleCheckboxChange("highRating")}
              >
                Rất tốt: 4 sao trở lên
              </Checkbox>

              <Checkbox
                checked={popularFilters.twoBeds}
                onChange={() => handleCheckboxChange("twoBeds")}
              >
                Có 2 giường trở lên
              </Checkbox>

              <Checkbox
                checked={popularFilters.noAgeLimit}
                onChange={() => handleCheckboxChange("noAgeLimit")}
              >
                Không giới hạn độ tuổi nhận phòng
              </Checkbox>

              <Checkbox
                checked={popularFilters.highFloor}
                onChange={() => handleCheckboxChange("highFloor")}
              >
                Tầng 15 trở lên
              </Checkbox>
            </div>
          </div>

          <ItemCheckbox type="Tiện nghi" />
          <ItemCheckbox type="Kèm theo" />
          <ItemCheckbox type="Công nghệ" />
          <ItemCheckbox type="Vip" />
        </div>
        <div
          style={{
            width: "70%",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Pagination
              showQuickJumper
              align="center"
              current={currentPage}
              pageSize={roomsPerPage} // Kích thước trang hiện tại
              total={filteredData.length} // Tổng số phòng
              onChange={handlePageChange} // Thay đổi trang
              onShowSizeChange={handlePageSizeChange} // Thay đổi kích thước trang
              showSizeChanger // Hiển thị bộ chọn kích thước trang
              style={{ margin: "20px 0" }}
            />
          </div>
          {!isLoading && renderRooms()}
        </div>
      </Row>
      <Pagination
        showQuickJumper
        align="center"
        current={currentPage}
        pageSize={roomsPerPage} // Kích thước trang hiện tại
        total={filteredData.length} // Tổng số phòng
        onChange={handlePageChange} // Thay đổi trang
        onShowSizeChange={handlePageSizeChange} // Thay đổi kích thước trang
        showSizeChanger // Hiển thị bộ chọn kích thước trang
        style={{ margin: "20px 0" }}
      />
    </Container>
  );
};

export default Room;

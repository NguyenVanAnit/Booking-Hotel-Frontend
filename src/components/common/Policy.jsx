import { useEffect, useState } from "react";
import { getServicesByRoomId } from "../utils/services";
import PropTypes from "prop-types";
import {
  LoginOutlined,
  LogoutOutlined,
  SolutionOutlined,
  TeamOutlined,
  LinuxOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";
import { Descriptions } from "antd";
import { getDetailRoomById } from "../utils/room";

const Policy = ({ roomId }) => {
  const [data, setData] = useState([]);
  const [roomData, setRoomData] = useState({});

  const fetchData = async () => {
    try {
      const res = await getServicesByRoomId(roomId);
      if (res?.data.success) {
        setData(res?.data.data.data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDataRoom = async () => {
      try {
        const res = await getDetailRoomById(roomId);
        if (res?.data.success) {
          setRoomData(res?.data.data.data);
        } else {
          setRoomData({});
        }
      } catch (error) {
        console.log(error);
      }
    };

  useEffect(() => {
    fetchData();
    fetchDataRoom();
  }, []);

  return (
    <Descriptions style={{ width: "100%" }} bordered>
      <Descriptions.Item
        label={
          <div style={{ fontSize: 18, fontWeight: 600 }}>
            <LoginOutlined style={{ marginRight: 5 }} />
            Thời gian nhận phòng
          </div>
        }
        span={3}
        style={{ textAlign: "start", fontSize: 16 }}
      >
        Từ 14:00 - 23:00
      </Descriptions.Item>
      <Descriptions.Item
        label={
          <div style={{ fontSize: 18, fontWeight: 600 }}>
            <LogoutOutlined style={{ marginRight: 5 }} />
            Thời gian trả phòng
          </div>
        }
        span={3}
        style={{ textAlign: "start", fontSize: 16 }}
      >
        Từ 08:00 - 23:00
      </Descriptions.Item>
      <Descriptions.Item
        label={
          <div style={{ fontSize: 18, fontWeight: 600 }}>
            <SolutionOutlined style={{ marginRight: 5 }} />
            Không giới hạn độ tuổi
          </div>
        }
        span={3}
        style={{ textAlign: "start", fontSize: 16 }}
      >
        {
          roomData?.ageLimit == 0
            ? "Không giới hạn độ tuổi"
            : roomData?.ageLimit + " tuổi trở lên"
        }
      </Descriptions.Item>
      <Descriptions.Item
        label={
          <div style={{ fontSize: 18, fontWeight: 600 }}>
            <TeamOutlined style={{ marginRight: 5 }} />
            Chính sách trẻ em
          </div>
        }
        span={3}
        style={{ textAlign: "start", fontSize: 16 }}
      >
        {
          roomData?.maxNumberChildren == 0
            ? "Không phù hợp với trẻ em"
            : "Tối đa " + roomData?.maxNumberChildren + " trẻ"
        }
      </Descriptions.Item>
      <Descriptions.Item
        label={
          <div style={{ fontSize: 18, fontWeight: 600 }}>
            <LinuxOutlined style={{ marginRight: 5 }} />
            Vật nuôi
          </div>
        }
        span={3}
        style={{ textAlign: "start", fontSize: 16 }}
      >
        {data?.some(item => item.id === 30) ? "Cho phép mang vật nuôi" : "Không cho phép mang vật nuôi"}
      </Descriptions.Item>
      <Descriptions.Item
        label={
          <div style={{ fontSize: 18, fontWeight: 600 }}>
            <ExperimentOutlined style={{ marginRight: 5 }} />
            Tiệc tùng
          </div>
        }
        span={3}
        style={{ textAlign: "start", fontSize: 16 }}
      >
        {data?.some(item => item.id === 31) ? "Cho phép tổ chức tiệc" : "Không cho phép tổ chức tiệc"}
      </Descriptions.Item>
    </Descriptions>
  );
};
Policy.propTypes = {
  roomId: PropTypes.string.isRequired,
};

export default Policy;

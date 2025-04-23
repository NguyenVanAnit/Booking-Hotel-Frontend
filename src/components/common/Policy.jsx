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

const Policy = ({ roomId }) => {
  const [data, setData] = useState([]);

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

  useEffect(() => {
    fetchData();
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
        Không giới hạn độ tuổi nhận phòng
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
      ></Descriptions.Item>
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
        Tùy vào yêu cầu của mỗi phòng
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
        Không cho phép tổ chức tiệc tùng hay sự kiện
      </Descriptions.Item>
    </Descriptions>
  );
};
Policy.propTypes = {
  roomId: PropTypes.string.isRequired,
};

export default Policy;

import { useEffect, useState } from "react";
import { getServicesByRoomId } from "../utils/services";
import PropTypes from "prop-types";
import {
  CheckOutlined,
  IeOutlined,
  DesktopOutlined,
  DatabaseOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { Col, Row, Tooltip } from "antd";

const ServiceInRoom = ({ roomId }) => {
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
    <Row style={{ marginTop: 20, padding: 10 }}>
      <Col span={8}>
        <div
          style={{
            flexDirection: "column",
            display: "flex",
            justifyContent: "start",
            alignItems: "start",
            gap: 4
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              textAlign: "left",
              marginBottom: 10,
            }}
          >
            <IeOutlined /> Công nghệ
          </div>
          {data
            ?.filter((item) => item?.serviceType == "Công nghệ")
            .map((item) => (
              <Tooltip
                key={item?.id}
                style={{ textAlign: "left", marginBottom: 5, fontSize: 13 }}
                title={item?.description}
              >
                <CheckOutlined />
                <span style={{ marginLeft: 10 }}>{item?.name}</span>
              </Tooltip>
            ))}
        </div>
        <div
          style={{
            flexDirection: "column",
            display: "flex",
            justifyContent: "start",
            alignItems: "start",
            gap: 4
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              textAlign: "left",
              marginBottom: 10,
              marginTop: 15,
            }}
          >
            <LockOutlined /> An ninh
          </div>
          {data
            ?.filter((item) => item?.serviceType == "An ninh")
            .map((item) => (
              <Tooltip
                title={item?.description}
                key={item?.id}
                style={{ textAlign: "left", marginBottom: 5, fontSize: 13 }}
              >
                <CheckOutlined />
                <span style={{ marginLeft: 10 }}>{item?.name}</span>
              </Tooltip>
            ))}
        </div>
      </Col>
      <Col span={8}>
        <div
          style={{
            flexDirection: "column",
            display: "flex",
            justifyContent: "start",
            alignItems: "start",
            gap: 4
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              textAlign: "left",
              marginBottom: 10,
              marginTop: 15,
            }}
          >
            <DatabaseOutlined /> Kèm theo
          </div>
          {data
            ?.filter((item) => item?.serviceType == "Kèm theo")
            .map((item) => (
              <Tooltip
                title={item?.description}
                key={item?.id}
                style={{ textAlign: "left", marginBottom: 5, fontSize: 13 }}
              >
                <CheckOutlined />
                <span style={{ marginLeft: 10 }}>{item?.name}</span>
              </Tooltip>
            ))}
        </div>
        <div
          style={{
            flexDirection: "column",
            display: "flex",
            justifyContent: "start",
            alignItems: "start",
            gap: 4
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              textAlign: "left",
              marginBottom: 10,
              marginTop: 15,
            }}
          >
            <DatabaseOutlined /> VIP
          </div>
          {data
            ?.filter((item) => item?.serviceType == "Vip")
            .map((item) => (
              <Tooltip
                title={item?.description}
                key={item?.id}
                style={{ textAlign: "left", marginBottom: 5, fontSize: 13 }}
              >
                <CheckOutlined />
                <span style={{ marginLeft: 10 }}>{item?.name}</span>
              </Tooltip>
            ))}
        </div>
      </Col>
      <Col>
        <div
          style={{
            flexDirection: "column",
            display: "flex",
            justifyContent: "start",
            alignItems: "start",
            gap: 4
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              textAlign: "left",
              marginBottom: 10,
              marginTop: 15,
            }}
          >
            <DesktopOutlined /> Tiện nghi
          </div>
          {data
            ?.filter((item) => item?.serviceType == "Tiện nghi")
            .map((item) => (
              <Tooltip
                title={item?.description}
                key={item?.id}
                style={{ textAlign: "left", marginBottom: 5, fontSize: 13 }}
              >
                <CheckOutlined />
                <span style={{ marginLeft: 10 }}>{item?.name}</span>
              </Tooltip>
            ))}
        </div>
      </Col>
    </Row>
  );
};
ServiceInRoom.propTypes = {
  roomId: PropTypes.string.isRequired,
};

export default ServiceInRoom;

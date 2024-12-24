import React, { useContext } from "react";
import { Card, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Image, Button } from "antd";
import { formatVND } from "../helpers/helpers";


const RoomCard = ({ room }) => {
  const navigate = useNavigate();
  return (
    <Col key={room.id} className="mb-4" xs={12}>
      <Card>
        <Card.Body className="d-flex flex-wrap align-items-center">
          <div>
            <Card.Title style={{ padding: "10px 40px 10px 0", fontSize: '40px', color: "rgb(12, 111, 168) " }}>{room.roomNumber ?? '??'}</Card.Title>
          </div>
          <div className="flex-shrrink-0 mr-3 mb-3 mb-md-0">
            <Image
              src={`data:image/png;base64, ${room.photo}`}
              alt="Room Photo"
              style={{ width: "100%", maxWidth: "200px", height: "auto", borderRadius: "10px" }}
            />
          </div>
          <div className="flex-grow-1 ml-3 px-5" style={{ textAlign: "left" }}>
            <Card.Title className="hotel-color">{room.roomType}</Card.Title>
            <Card.Title className="room-price">
              {formatVND(room.roomPrice)} VND / đêm
            </Card.Title>
            <Card.Text>
              Some room information goes here for the guest to read through
            </Card.Text>
          </div>
          <div className="flex-shrink-0 mt-3">
            <Button type="primary" onClick={() => navigate('/book-room', { state: room })}>Đặt phòng ngay</Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default RoomCard;

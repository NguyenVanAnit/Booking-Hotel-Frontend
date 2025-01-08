import React, { useState } from "react";
import { Card, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Image, Button } from "antd";
import { formatVND } from "../helpers/helpers";


const RoomCard = ({ room }) => {
  const navigate = useNavigate();
  const ads = [
    'Khách sạn sang trọng, tiện nghi hiện đại, giá cả phải chăng!',
    'Trải nghiệm không gian nghỉ dưỡng tuyệt vời tại khách sạn chúng tôi!',
    'Phòng nghỉ sạch sẽ, thoải mái, phù hợp cho mọi chuyến đi!',
    'Khám phá không gian nghỉ dưỡng đẳng cấp ngay hôm nay!',
    'Khách sạn gần trung tâm, dễ dàng di chuyển, giá tốt!',
    'Chúng tôi mang đến cho bạn một kỳ nghỉ tuyệt vời và thoải mái nhất!',
    'Tận hưởng không gian yên bình tại khách sạn chất lượng cao của chúng tôi!',
    'Khách sạn đẳng cấp, dịch vụ chuyên nghiệp, luôn làm hài lòng khách hàng!',
    'Chào đón bạn đến với khách sạn của chúng tôi – nơi lưu giữ những kỷ niệm đẹp!',
    'Phòng nghỉ hiện đại, sang trọng, sẵn sàng chào đón bạn!'
  ];

  // Hàm để random câu quảng cáo
  const getRandomAd = () => {
    const randomIndex = Math.floor(Math.random() * ads.length);
    return ads[randomIndex];
  };

  // Sử dụng hook useState để lưu câu quảng cáo được chọn ngẫu nhiên
  const [ad, setAd] = useState(getRandomAd);

  return (
    <Col key={room.id} className="mb-4" xs={12}>
      <Card>
        <Card.Body className="d-flex flex-wrap align-items-center">
          <div>
            <Card.Title style={{ padding: "10px 40px 10px 0", fontSize: '40px', color: "rgb(12, 111, 168)" }}>
              {room.roomNumber ?? ''}
            </Card.Title>
          </div>
          <div className="flex-shrink-0 mr-3 mb-3 mb-md-0">
            <Image
              src={`data:image/png;base64, ${room.photo}`}
              alt="Room Photo"
              style={{ width: "100%", maxWidth: "200px", height: "auto", borderRadius: "10px" }}
            />
          </div>
          <div className="flex-grow-1 ml-3 px-5" style={{ textAlign: "left", overflow: "hidden", textOverflow: "ellipsis" }}>
            <Card.Title className="hotel-color">{room.roomType}</Card.Title>
            <Card.Title className="room-price">
              {formatVND(room.roomPrice)} VND / đêm
            </Card.Title>
            <Card.Text style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {ad}
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

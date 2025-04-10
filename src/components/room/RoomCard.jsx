import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Image, Button } from "antd";
import { formatVND } from "../helpers/helpers";
import { ArrowRightOutlined, StarFilled } from "@ant-design/icons";

const RoomCard = ({ room }) => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        width: "100%",
        height: 250,
        borderRadius: 10,
        overflow: "hidden",
        marginBottom: 20,
        backgroundColor: "#f8f9fa",
        border: "1px solid #003b95",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          width: 300,
          backgroundColor: "#CFCFCF",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <Image
          src={room?.photo1}
          alt="Room Photo"
          width="100%"
          height="100%"
          style={{ height: "100%", objectFit: "cover", width: "100%" }}
          preview={true}
          // onClick={() => navigate("/book-room", { state: room })}
        />
      </div>
      <div style={{ width: "80%", padding: 10 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
            height: "20%",
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#006ce4",
              cursor: "pointer",
              width: "70%",
              textAlign: "start",
            }}
          >
            {room?.name}
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
          >
            <div>Tuyệt vời</div>
            <div
              style={{
                backgroundColor: "#003b95",
                color: "white",
                padding: "5px 10px",
                borderRadius: 10,
              }}
            >
              {room?.totalRating ? room?.totalRating : '4.1'} <StarFilled style={{ color: "#FFFF00" }} />
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 10,
            height: "80%",
          }}
        >
          <div
            style={{
              width: "60%",
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <div
              style={{
                fontSize: 12,
                textAlign: "start",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 3,
              }}
            >
              {room?.description}
            </div>
          </div>
          <div
            style={{
              width: "40%",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "end",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                fontSize: 12,
                textAlign: "end",
              }}
            >
              3 đêm, 2 người lớn, 1 trẻ em
            </div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 600,
                textAlign: "end",
              }}
            >
              {formatVND(room?.roomPrice)} VNĐ
            </div>
            <div
              style={{
                fontSize: 12,
                textAlign: "end",
                marginBottom: 10,
              }}
            >
              Đã bao gồm thuế và phí
            </div>
            <Button type="primary" onClick={() => navigate("/detail-room", { state: room?.id })}>
                Xem chi tiết
                <ArrowRightOutlined style={{ marginLeft: 5 }} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;

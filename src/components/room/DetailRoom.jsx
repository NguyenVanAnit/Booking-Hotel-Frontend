import { Button, Image, Calendar } from "antd";
import { useEffect, useRef, useState } from "react";
import { getDetailRoomById } from "../utils/room";
import { useLocation } from "react-router-dom";
import {
  ArrowDownOutlined,
  StarFilled,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
} from "@ant-design/icons";
import dayjs from "dayjs";
import ServiceInRoom from "../service/ServiceInRoom";

const itemButton = [
  {
    id: 0,
    title: "Tổng quan",
  },
  {
    id: 1,
    title: "Thông tin và giá",
  },
  {
    id: 2,
    title: "Tiện nghi và dịch vụ",
  },
  {
    id: 3,
    title: "Chính sách và quy định",
  },
  {
    id: 4,
    title: "Đánh giá",
  },
  {
    id: 5,
    title: "Liên quan",
  },
];

const availableDates = [
  "2025-04-08",
  "2025-04-10",
  "2025-04-12",
  "2025-05-01",
  "2025-05-03",
];

const DetailRoom = () => {
  const location = useLocation();
  const roomId = location?.state;
  const sectionsRefs = useRef([]);
  const [selectSection, setSelectSection] = useState(0);
  const [data, setData] = useState({});
  const [currentDate, setCurrentDate] = useState(dayjs());

  // Hàm cuộn đến phần tử mục tiêu
  const scrollToSection = (index) => {
    setSelectSection(index);
    window.scrollTo({
      top: sectionsRefs.current[index].offsetTop - 120, // Cuộn đến vị trí của phần tử
      behavior: "smooth", // Cuộn mượt mà
    });
  };

  const fetchData = async () => {
    try {
      const res = await getDetailRoomById(roomId);
      if (res?.data.success) {
        setData(res?.data.data.data);
      } else {
        setData({});
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
    scrollToSection(0); // Cuộn đến phần đầu tiên khi tải trang
  }, []);

  const isAvailable = (date) => {
    return availableDates.includes(date.format("YYYY-MM-DD"));
  };

  const dateCellRender = (value) => {
    const available = isAvailable(value);

    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: available ? "red" : "#fff1f0",
          borderRadius: 6,
          border: available ? "3px solid #87e8de" : "3px solid #ffa39e",
        }}
      />
    );
  };

  return (
    <div
      style={{
        padding: 20,
        maxWidth: 1200,
        margin: "auto",
      }}
    >
      <div
        style={{ display: "flex", gap: "10px", borderBottom: "1px solid #ccc" }}
      >
        {/* <button onClick={() => scrollToSection(0)}>Section 1</button>
        <button onClick={() => scrollToSection(1)}>Section 2</button>
        <button onClick={() => scrollToSection(2)}>Section 3</button> */}
        {itemButton.map((item) => (
          <Button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            style={{
              padding: "30px 20px",
              border: "none",
              cursor: "pointer",
              borderBottom:
                selectSection === item.id ? "2px solid blue" : "none",
              borderRadius: 0,
              fontSize: 16,
              fontWeight: 500,
            }}
          >
            {item.title}
          </Button>
        ))}
      </div>

      {/* Các phần mục tiêu */}
      <div
        ref={(el) => (sectionsRefs.current[0] = el)}
        style={{
          height: "600px",
          marginTop: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              textAlign: "start",
              marginBottom: 10,
            }}
          >
            {data?.name}
          </div>
          <div>
            <Button type="primary">Đặt phòng của bạn</Button>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginTop: 20,
          }}
        >
          <div
            style={{
              width: "70%",
              padding: 10,
              gap: 10,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 10,
                width: "100%",
              }}
            >
              <div
                style={{
                  backgroundColor: "#f0f0f0",
                  maxHeight: 300,
                  width: "70%",
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                <Image
                  src={data?.photo1}
                  alt="Room Photo"
                  width="100%"
                  height="100%"
                  style={{ objectFit: "cover", height: "100%", width: "100%" }}
                  preview={true}
                />
              </div>
              <div
                style={{
                  width: "30%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    backgroundColor: "#f0f0f0",
                    width: "100%",
                    height: 145,
                    borderRadius: 10,
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={data?.photo2}
                    alt="Room Photo"
                    width="100%"
                    height="100%"
                    style={{
                      objectFit: "cover",
                      height: "100%",
                      width: "100%",
                    }}
                    preview={true}
                  />
                </div>
                <div
                  style={{
                    backgroundColor: "#f0f0f0",
                    width: "100%",
                    height: 145,
                    borderRadius: 10,
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={data?.photo3}
                    alt="Room Photo"
                    width="100%"
                    height="100%"
                    style={{
                      objectFit: "cover",
                      height: "100%",
                      width: "100%",
                    }}
                    preview={true}
                  />
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 10,
              }}
            >
              <div
                style={{
                  backgroundColor: "#f0f0f0",
                  width: "50%",
                  height: 150,
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                <Image
                  src={data?.photo4}
                  alt="Room Photo"
                  width="100%"
                  height="100%"
                  style={{
                    objectFit: "cover",
                    height: "100%",
                    width: "100%",
                  }}
                  preview={true}
                />
              </div>
              <div
                style={{
                  backgroundColor: "#f0f0f0",
                  width: "50%",
                  height: 150,
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                <Image
                  src={data?.photo5}
                  alt="Room Photo"
                  width="100%"
                  height="100%"
                  style={{
                    objectFit: "cover",
                    height: "100%",
                    width: "100%",
                  }}
                  preview={true}
                />
              </div>
            </div>
          </div>
          <div
            style={{
              border: "1px solid #ccc",
              width: "30%",
              borderRadius: 8,
            }}
          >
            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 5,
                padding: 10,
                borderBottom: "1px solid #ccc",
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
                {data?.totalRating ? data?.totalRating : "4.1"}{" "}
                <StarFilled style={{ color: "#FFFF00" }} />
              </div>
            </div>

            <div
              style={{
                padding: 10,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  textAlign: "start",
                  fontWeight: 600,
                }}
              >
                Khách lưu trú ở đây thích điều gì?
              </div>
              <div
                style={{
                  fontSize: 12,
                  textAlign: "start",
                }}
              >
                “Căn hộ gần hồ rất thoáng đãng, trong lành. Phòng sạch đẹp, nhân
                viên thân thiện. Sẽ quoay lại ủng hộ tiếp”
              </div>
              <Button onClick={() => scrollToSection(4)}>
                Xem thêm đánh giá <ArrowDownOutlined />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={(el) => (sectionsRefs.current[1] = el)}
        style={{
          height: "500px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontSize: 24, fontWeight: 700, textAlign: "start" }}>
          Mô tả
        </div>
        <div
          style={{
            fontSize: 13,
            textAlign: "start",
            marginBottom: 10,
            width: "40%",
          }}
        >
          {/* {data?.description} */}
          Giảm giá Genius tại chỗ nghỉ này tùy thuộc vào ngày đặt phòng, ngày
          lưu trú và các ưu đãi có sẵn khác. Cung cấp chỗ nghỉ có Wi-Fi miễn
          phí, điều hòa và TV màn hình phẳng, Luxe Paradise Residence 9 Quang
          Khanh tọa lạc cách Hồ Tây 3.5 km và Đền Quán Thánh 4.7 km. Tất cả các
          căn có thiết kế gồm ban công nhìn ra thành phố, bếp với tủ lạnh và lò
          vi sóng, cùng phòng tắm riêng. Căn hộ có dịch vụ cho thuê xe đạp. Luxe
          Paradise Residence 9 Quang Khanh cách Lăng Chủ tịch Hồ Chí Minh 4.8
          km. Sân bay Quốc tế Nội Bài cách 20 km, đồng thời chỗ nghỉ có cung cấp
          dịch vụ đưa đón sân bay mất phí. Các nhóm khách đặc biệt thích địa
          điểm này — họ cho điểm 8,6 khi đánh giá chuyến đi theo nhóm.
        </div>
        <div
          style={{
            width: "40%",
          }}
        >
          <div></div>
          <Calendar
            fullscreen={false}
            value={currentDate}
            onPanelChange={(value) => setCurrentDate(value)}
            dateCellRender={dateCellRender}
            disabledDate={(current) =>
              current && current.isBefore(dayjs().startOf("month"), "month")
            }
            style={{
              border: "2px solid #ccc",
              backgroundColor: "#f0f6ff",
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 20,
              alignItems: "center",
              marginTop: 10,
              justifyContent: "center",
              fontSize: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 5,
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  backgroundColor: "#ffa39e",
                  borderRadius: 10,
                }}
              />
              <div>: Đã được đặt</div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 5,
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  backgroundColor: "#87e8de",
                  borderRadius: 10,
                }}
              />
              <div>: Đang còn trống</div>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={(el) => (sectionsRefs.current[2] = el)}
        style={{ height: "500px" }}
      >
        <div style={{ fontSize: 24, fontWeight: 700, textAlign: "start" }}>
          Các tiện nghi và dịch vụ
        </div>
        <ServiceInRoom roomId={roomId} />
      </div>

      <div
        ref={(el) => (sectionsRefs.current[3] = el)}
        style={{ height: "500px" }}
      >
        <div style={{ fontSize: 24, fontWeight: 700, textAlign: "start" }}>
          Các chính sách và quy định
        </div>
      </div>

      <div
        ref={(el) => (sectionsRefs.current[4] = el)}
        style={{ height: "500px" }}
      >
        <div style={{ fontSize: 24, fontWeight: 700, textAlign: "start" }}>
          Đánh giá của khách
        </div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 5,
            paddingTop: 10,
          }}
        >
          <div
            style={{
              backgroundColor: "#003b95",
              color: "white",
              padding: "5px 10px",
              borderRadius: 10,
            }}
          >
            {data?.totalRating ? data?.totalRating : "4.1"}{" "}
            <StarFilled style={{ color: "#FFFF00" }} />
          </div>
          <div>Tuyệt vời</div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default DetailRoom;

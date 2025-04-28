import { Button, Image, Calendar, Rate, Modal, Divider, Input } from "antd";
import { useEffect, useRef, useState } from "react";
import { getAvailebleDay, getDetailRoomById } from "../utils/room";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowDownOutlined,
  ArrowRightOutlined,
  StarFilled,
} from "@ant-design/icons";
import dayjs from "dayjs";
import ServiceInRoom from "../service/ServiceInRoom";
import Policy from "../common/Policy";
import { descriptionsExample } from "../helpers/descriptions";
const { TextArea } = Input;

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

const commentList = [
  {
    id: 0,
    title: "Đánh giá về phòng",
  },
  {
    id: 1,
    title: "Đánh giá chung về khách sạn",
  },
];

function getRandomDescriptions(count = 5) {
  const shuffled = descriptionsExample.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

const DetailRoom = () => {
  const location = useLocation();
  const roomId = location?.state;
  const sectionsRefs = useRef([]);
  const [selectSection, setSelectSection] = useState(0);
  const [data, setData] = useState({});
  const [currentDate, setCurrentDate] = useState(dayjs());
  const navigate = useNavigate();
  const [availableDates, setAvailableDates] = useState([]);
  const [openComment, setOpenComment] = useState(false);
  const [selectedComment, setSelectedComment] = useState(0);

  const randomDescriptions = getRandomDescriptions(5);

  const fetchDataAvailableDates = async () => {
    try {
      const res = await getAvailebleDay({
        roomId: roomId,
        month: 4,
        year: 2025,
      });
      console.log("res adadadw", res?.data.data.data);
      if (res?.data.success) {
        setAvailableDates(res?.data.data.data);
      } else {
        setAvailableDates([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
    fetchDataAvailableDates();
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
            <Button
              type="primary"
              onClick={() =>
                navigate("/book-room", { state: { record: data } })
              }
            >
              Đặt phòng của bạn
            </Button>
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
          {data?.description}
          {randomDescriptions.map((desc, index) => (
            <p key={index}>{desc}</p>
          ))}
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
        // style={{ height: "500px" }}
      >
        <div style={{ fontSize: 24, fontWeight: 700, textAlign: "start" }}>
          Các tiện nghi và dịch vụ
        </div>
        <ServiceInRoom roomId={roomId} />
      </div>

      <div
        ref={(el) => (sectionsRefs.current[3] = el)}
        // style={{ height: "500px" }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            textAlign: "start",
            marginBottom: 30,
          }}
        >
          Các chính sách và quy định
        </div>
        <Policy roomId={roomId} />
      </div>

      <div
        ref={(el) => (sectionsRefs.current[4] = el)}
        style={{ marginTop: 30 }}
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
          <Button
            style={{
              marginLeft: 20,
            }}
            type="link"
            onClick={() => setOpenComment(true)}
          >
            Xem tất cả đánh giá <ArrowRightOutlined />
          </Button>
        </div>

        <p
          style={{
            textAlign: "left",
            fontSize: 16,
            marginTop: 12,
            fontWeight: 700,
          }}
        >
          Khách lưu trú ở đây thích điều gì?
        </p>

        <div
          style={{
            marginTop: 20,
            display: "flex",
            flexDirection: "row",
            gap: 10,
            justifyContent: "space-between",
          }}
        >
          {[
            {
              fullName: "Nguyễn Văn A",
              comment: "Phòng sạch sẽ, view đẹp, nhân viên thân thiện.",
              score: 5,
              createdAt: "2025-04-01 12:00:00",
            },
            {
              fullName: "Trần Thị B",
              comment: "Vị trí thuận tiện, gần trung tâm. Giá hơi cao xíu.",
              score: 4,
              createdAt: "2025-04-02 14:30:00",
            },
            {
              fullName: "Lê Văn C",
              comment: "Máy lạnh hơi yếu nhưng tổng thể vẫn ổn.",
              score: 3.7,
              createdAt: "2025-04-03 09:15:00",
            },
          ].map((review, index) => (
            <div
              key={index}
              style={{
                padding: 20,
                border: "1px solid #ccc",
                borderRadius: 8,
                backgroundColor: "#f9f9f9",
                width: "31%",
                minHeight: 200,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: "#003b95",
                    color: "white",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    fontWeight: 600,
                  }}
                >
                  {review.fullName.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 600, textAlign: "left" }}>
                    {review.fullName}
                  </div>
                  <div style={{ fontSize: 12, textAlign: "left" }}>
                    {review.createdAt}
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: 10,
                  marginBottom: 10,
                  justifyContent: "start",
                }}
              >
                <Rate allowHalf defaultValue={review.score} />
              </div>
              <div style={{ fontSize: 14, margin: "5px 0", textAlign: "left" }}>
                {review.comment}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        visible={openComment}
        footer={null}
        width={800}
        onCancel={() => setOpenComment(false)}
      >
        <div
          style={{
            display: "flex",
            gap: "10px",
            borderBottom: "1px solid #ccc",
            marginBottom: 20,
          }}
        >
          {commentList.map((item) => (
            <Button
              key={item.id}
              onClick={() => setSelectedComment(item.id)}
              style={{
                padding: "30px 20px",
                border: "none",
                cursor: "pointer",
                borderBottom:
                  selectedComment === item.id ? "2px solid blue" : "none",
                borderRadius: 0,
                fontSize: 16,
                fontWeight: 500,
              }}
            >
              {item.title}
            </Button>
          ))}
        </div>
        {selectedComment == 0 ? (
          <>
            <p style={{ fontWeight: 700, fontSize: 18 }}>Đánh giá của khách</p>
            <div
            // style={{ maxHeight: 800, overflowY: "auto",  }}
            >
              {[
                {
                  fullName: "Nguyễn Văn A",
                  comment: "Phòng sạch sẽ, view đẹp, nhân viên thân thiện.",
                  score: 5,
                  createdAt: "2025-04-01 12:00:00",
                },
                {
                  fullName: "Trần Thị B",
                  comment: "Vị trí thuận tiện, gần trung tâm. Giá hơi cao xíu.",
                  score: 4,
                  createdAt: "2025-04-02 14:30:00",
                },
                {
                  fullName: "Lê Văn C",
                  comment: "Máy lạnh hơi yếu nhưng tổng thể vẫn ổn.",
                  score: 3.7,
                  createdAt: "2025-04-03 09:15:00",
                },
                {
                  fullName: "Lê Văn C",
                  comment: "Máy lạnh hơi yếu nhưng tổng thể vẫn ổn.",
                  score: 3.7,
                  createdAt: "2025-04-03 09:15:00",
                },
              ].map((review, index) => (
                <div
                  key={index}
                  style={{
                    padding: 20,
                    display: "flex",
                    flexDirection: "row",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "start",
                      justifyContent: "start",
                      flexDirection: "column",
                      width: "25%",
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        backgroundColor: "#003b95",
                        color: "white",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 20,
                        fontWeight: 600,
                      }}
                    >
                      {review.fullName.charAt(0)}
                    </div>
                    <div style={{ fontWeight: 600, textAlign: "left" }}>
                      {review.fullName}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "start",
                      width: "70%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <div style={{ fontSize: 14 }}>
                        Thời gian nhận xét phòng: {review.createdAt}
                      </div>
                      <div
                        style={{
                          backgroundColor: "#003b95",
                          color: "white",
                          padding: "5px 10px",
                          borderRadius: 10,
                        }}
                      >
                        {review?.score
                          ? review?.score.toFixed(1).replace(".", ",")
                          : "4.1"}
                      </div>
                    </div>
                    <div
                      style={{ fontSize: 14, marginTop: 10, textAlign: "left" }}
                    >
                      {review.comment}
                    </div>
                    <Divider
                      style={{ width: "100%", border: "2px dashed #DCDCDC " }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <p style={{ fontWeight: 700, fontSize: 18 }}>Đánh giá về hệ thống trang web</p>
            <TextArea
              rows={4}
              placeholder="Nhập đánh giá của bạn tại đây..."
              style={{ marginBottom: 20 }}
            />
            <div style={{ display: "flex", justifyContent: "end" }}>
              <Button type="primary">
                Gửi đánh giá
              </Button>
            </div>
            <p style={{ fontWeight: 700, fontSize: 16 }}>Một số bình luận</p>
          </>
        )}
      </Modal>
    </div>
  );
};

export default DetailRoom;

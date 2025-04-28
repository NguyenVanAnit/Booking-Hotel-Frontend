import { useState, useEffect } from "react";
// import {
//     cancelBooking,
//     getAllBookings,
//     confirmBooking,
//     rejectBooking,
// } from "../utils/ApiFunctions";
import Header from "../common/Header";
// import BookingsTable from "./BookingsTable"
// import DateSlider from "../common/DateSlider"
// import { parseISO } from "date-fns"
import {
    Table,
    Popconfirm,
    Button,
    DatePicker,
    Modal,
    Form,
    Input,
    Tag,
    Row,
    Segmented,
} from "antd";
const { RangePicker } = DatePicker;
import moment from "moment";
import { formatVND } from "../helpers/helpers";
import {
    ExclamationCircleOutlined,
    CheckCircleOutlined,
    DeleteOutlined,
    SearchOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import emailjs from "emailjs-com";
import { getBookingsByCheckInDate, updateBookingChecked } from "../utils/booking";
import { useNavigate } from "react-router-dom";
import { BarcodeOutlined } from "@ant-design/icons";
import dispatchToast from "../helpers/toast";

const Bookings = () => {
    const [bookingInfo, setBookingInfo] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filteredBookings, setFilteredBookings] = useState(bookingInfo);
    const [dateCheckIn, setDateCheckIn] = useState(moment().format("YYYY-MM-DD"));
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigate = useNavigate();
    const [isChecked, setIsChecked] = useState(0);
    // const [detailBookingModal, setDetailBookingModal] = useState(false);
    // const [selectedBooking, setSelectedBooking] = useState(null);
    // const [totalPrice, setTotalPrice] = useState(0);

    const fetchData = async () => {
        setIsLoading(true);
        const response = await getBookingsByCheckInDate({
            // checkInDate: moment().format("YYYY-MM-DD"),
            checkInDate: dateCheckIn,
        });
        if (response?.success) {
            setBookingInfo(response?.data?.data);
            console.log("booking data adada", response.data.data);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [dateCheckIn]);

    useEffect(() => {
        setFilteredBookings(bookingInfo);
    }, [bookingInfo]);

    // const handleDeleteBooking = async (bookingId) => {
    //     const reponse = await cancelBooking(bookingId);
    //     console.log(bookingId, "Xóa");
    //     fetchData();
    //     setDetailBookingModal(false);
    // };

    // const sendEmail = async (record, confirm) => {
    //     try {
    //         // Logic duyệt đơn
    //         // (Gửi thông tin duyệt đơn tới backend nếu cần)

    //         // Thông tin email
    //         const templateParams = {
    //             to_name: record.guestFullName,
    //             to_email: record.guestEmail, // Email của người dùng
    //             message: confirm ? `Đơn đặt phòng với mã code ${record.bookingConfirmationCode} đã được duyệt thành công!` : `Đơn đặt phòng với mã ${record.bookingConfirmationCode} đã bị từ chối vì phòng đã được đặt!`
    //         };

    //         // Gửi email qua EmailJS
    //         await emailjs.send(
    //             'service_ro6hg6v',       // Service ID từ EmailJS
    //             'template_kfrd1g8',      // Template ID từ EmailJS
    //             templateParams,
    //             'xR7FSz5qWevMG6w_2'           // User ID từ EmailJS
    //         );

    //         console.log('Duyệt đơn và gửi email thành công!');
    //     } catch (error) {
    //         console.error(error);
    //         console.log('Có lỗi xảy ra khi gửi email!');
    //     }
    // };

    // const handleConfirmBooking = async (record) => {
    //     const response = await confirmBooking(record.bookingId);
    //     await sendEmail(record, true);
    //     console.log(response);
    //     fetchData();
    // };

    // const handleRejectBooking = async (record) => {
    //     const response = await rejectBooking(record.bookingId);
    //     await sendEmail(record, false);
    //     console.log(response);
    //     fetchData();
    // };

    // const filterBookings = (startDate, endDate) => {
    //     if (startDate && endDate) {
    //         const adjustedStartDate = new Date(startDate.setHours(0, 0, 0, 0));
    //         const adjustedEndDate = new Date(endDate.setHours(23, 59, 59, 999));

    //         const filteredData = bookingInfo.filter((booking) => {
    //             const checkInDate = new Date(booking.checkInDate);
    //             const checkOutDate = new Date(booking.checkOutDate);
    //             return (
    //                 checkInDate >= adjustedStartDate && checkOutDate <= adjustedEndDate
    //             );
    //         });
    //         setFilteredBookings(filteredData);
    //     } else {
    //         setFilteredBookings(bookingInfo);
    //     }
    // };

    const handleSearch = (values) => {
        const filteredData = bookingInfo.filter((booking) => {
            return (
                (!values.bookingConfirmationCode ||
                    booking.bookingConfirmationCode.includes(
                        values.bookingConfirmationCode
                    )) &&
                (!values.guestName ||
                    booking.guestName
                        .toLowerCase()
                        .includes(values.guestName.toLowerCase())) &&
                (!values.email ||
                    booking.email.toLowerCase().includes(values.email.toLowerCase())) &&
                (!values.phoneNumber ||
                    booking.phoneNumber.includes(values.phoneNumber))
            );
        });

        console.log("filter", filteredData);
    };

    // const openDetailModal = (record) => {
    //     setSelectedBooking(record); // Lưu thông tin đơn đặt phòng
    //     setDetailBookingModal(true); // Mở modal
    // };

    const formatDate = (date) => {
        if (Array.isArray(date)) {
            const [year, month, day] = date;
            const formattedMonth = String(month).padStart(2, "0");
            const formattedDay = String(day).padStart(2, "0");
            return `${year}-${formattedMonth}-${formattedDay}`;
        } else if (typeof date === "string" || date instanceof Date) {
            const parsedDate = new Date(date);
            const year = parsedDate.getFullYear();
            const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
            const day = String(parsedDate.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        }
        return "Invalid Date";
    };

    // const calculateDays = (checkIn, checkOut) => {
    //     const checkInDateObj = new Date(checkIn);
    //     const checkOutDateObj = new Date(checkOut);
    //     const differenceInTime = checkOutDateObj - checkInDateObj; // milliseconds
    //     const differenceInDays = differenceInTime / (1000 * 60 * 60 * 24); // convert to days
    //     return differenceInDays;
    // };

    const confirmCheckIn = async (bookingId, isChecked) => {
        const res = await updateBookingChecked(bookingId, isChecked);
        if (res?.success) {
            if (isChecked == 1) {
                dispatchToast("success", "Đã xác nhận nhận phòng thành công!");
            } else if (isChecked == 2) {
                dispatchToast("success", "Đã xác nhận trả phòng thành công!");
            }
            fetchData();
        } else {
            console.error("Có lỗi xảy ra khi xác nhận nhận phòng!");
        }
    }

    const columns = [
        {
            title: "STT",
            dataIndex: "index",
            key: "index",
            width: 50,
            align: "center",
            render: (text, record, index) => index + 1,
        },
        {
            title: "Tên người đặt",
            dataIndex: "guestName",
            key: "guestName",
            width: 150,
            align: "center",
        },
        {
            title: "Phòng",
            dataIndex: "roomName",
            key: "roomName",
            width: 150,
            align: "center",
        },
        {
            title: "Ngày nhận phòng",
            dataIndex: "checkInDate",
            width: 120,
            align: "center",
            render: (text) => formatDate(text),
        },
        {
            title: "Ngày trả phòng",
            dataIndex: "checkOutDate",
            width: 120,
            align: "center",
            render: (text) => formatDate(text),
        },
        {
            title: "Số người",
            width: 150,
            align: "center",
            render: (record) =>
                `${record?.numOfAdults} người lớn, ${record?.numOfChildren} trẻ em`,
        },
        {
            title: "Tổng chi phí",
            dataIndex: "totalPrice",
            width: 150,
            align: "center",
            render: (record) => formatVND(record) + " VNĐ",
        },
        {
            title: "Khách yêu cầu",
            key: "isChecked",
            width: 150,
            align: "center",
            render: (record) => {
                if (record?.isChecked == 0) {
                    return (
                        <Popconfirm
                            title="Xác nhận nhận phòng"
                            description="Khách đã xác nhận nhận phòng này?"
                            onConfirm={() => confirmCheckIn(record.bookingId, 1)}
                            okText="Đồng ý"
                            cancelText="Hủy"
                            icon={<ExclamationCircleOutlined style={{ color: "yellow" }} />}
                            placement="topRight"
                        >
                            <Button style={{ fontWeight: "500", fontSize: "14px", color: "#0066FF" }} type="dashed">
                                Nhận phòng
                            </Button>
                        </Popconfirm>
                    );
                } else if (record?.isChecked == 1) {
                    return (
                        <Popconfirm
                            title="Xác nhận trả phòng"
                            description="Khách đã xác nhận trả phòng này?"
                            onConfirm={() => confirmCheckIn(record.bookingId, 2)}
                            okText="Đồng ý"
                            cancelText="Hủy"
                            icon={<ExclamationCircleOutlined style={{ color: "yellow" }} />}
                            placement="topRight"
                        >
                            <Button style={{ fontWeight: "500", fontSize: "14px", color: "#33CC33	" }} type="dashed">
                                Trả phòng
                            </Button>
                        </Popconfirm>
                    );
                } else if (record?.isChecked == 2) {
                    return (
                        <Tag
                            color="success"
                            style={{ fontWeight: "500", fontSize: "14px" }}
                        >
                            Đã trả phòng
                        </Tag>
                    );
                } else {
                    return (
                        <Tag
                            color="warning"
                            style={{ fontWeight: "500", fontSize: "14px" }}
                        >
                            Lỗi
                        </Tag>
                    );
                }
            },
        },
        {
            title: "Xem chi tiết",
            width: 70,
            align: "center",
            render: (record) => {
                return (
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={() => {
                            // navigate("/booking-detail", {
                            //     state: { bookingId: record.bookingId },
                            // });
                            window.open(
                                `/booking-detail?bookingId=${record.bookingId}`, 
                                "_blank", 
                                "noopener,noreferrer"
                            );
                        }}
                    />
                )
            }
        },
        // {
        //     title: "Duyệt/ Hủy đơn",
        //     width: 150,
        //     align: "center",
        //     render: (record) => {
        //         if (record?.isChecked == 0) {
        //             return (
        //                 <div
        //                     style={{
        //                         display: "flex",
        //                         justifyContent: "center",
        //                         alignItems: "center",
        //                     }}
        //                 >
        //                     <Popconfirm
        //                         title="Xác nhận duyệt đơn đặt phòng"
        //                         description="Có chắc chắn duyệt đơn đặt phòng này?"
        //                         // onConfirm={() => handleConfirmBooking(record)}
        //                         okText="Đồng ý"
        //                         cancelText="Hủy"
        //                     >
        //                         <Button style={{ marginLeft: "5%" }} type="primary">
        //                             Duyệt
        //                         </Button>
        //                     </Popconfirm>

        //                     <Popconfirm
        //                         title="Xác nhận từ chối đơn đặt phòng"
        //                         description="Có chắc chắn từ chối đơn đặt phòng này?"
        //                         // onConfirm={() => handleRejectBooking(record)}
        //                         okText="Đồng ý"
        //                         cancelText="Hủy"
        //                     >
        //                         <Button style={{ marginLeft: "5%" }} danger>
        //                             Từ chối
        //                         </Button>
        //                     </Popconfirm>
        //                 </div>
        //             );
        //         } else if (record?.status == 1) {
        //             return (
        //                 <div>
        //                     {" "}
        //                     <Tag
        //                         icon={<CheckCircleOutlined />}
        //                         color="success"
        //                         style={{ fontWeight: "500", fontSize: "14px" }}
        //                     >
        //                         Đã duyệt
        //                     </Tag>
        //                 </div>
        //             );
        //         } else if (record?.status == 2) {
        //             return (
        //                 <div>
        //                     <Tag
        //                         icon={<ExclamationCircleOutlined />}
        //                         color="warning"
        //                         style={{ fontWeight: "500", fontSize: "14px" }}
        //                     >
        //                         Đã từ chối
        //                     </Tag>
        //                 </div>
        //             );
        //         } else {
        //             return (
        //                 <div>
        //                     <Tag
        //                         color="error"
        //                         style={{ fontWeight: "500", fontSize: "14px" }}
        //                     >
        //                         Lỗi đơn
        //                     </Tag>
        //                 </div>
        //             );
        //         }
        //     },
        // },
    ];

    return (
        <section
            style={{ backgroundColor: "whitesmoke", color: "white", padding: 30 }}
        >
            <Header title={"Danh sách đặt phòng"} />

            <h5 style={{ textAlign: "left", color: "#000", marginTop: 40 }}>
                Khách đến nhận phòng vào ngày: {dateCheckIn}
            </h5>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 20,
                }}
            >
                <DatePicker
                    title="Chọn ngày nhận phòng (Check-in)"
                    style={{ marginBottom: 20, width: 300 }}
                    format="YYYY-MM-DD"
                    placeholder="Chọn ngày nhận phòng (Check-in)"
                    onChange={(date, dateString) => {
                        if (date) {
                            setDateCheckIn(dateString); // Đây là string format YYYY-MM-DD
                        } else {
                            setDateCheckIn(moment().format("YYYY-MM-DD")); // Nếu không có ngày nào được chọn thì mặc định là ngày hôm nay
                        }
                    }}
                />
                <Segmented
                    options={[
                        { label: "Chưa nhận phòng", value: 0 },
                        { label: "Đã nhận phòng", value: 1 },
                        { label: "Đã trả phòng", value: 2 },
                    ]}
                    defaultValue={isChecked}
                    onChange={(value) => {
                        setIsChecked(value);
                    }}
                    style={{ backgroundColor: "#99CCFF", marginBottom: 20 }}
                />
                <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={() => setIsModalVisible(true)}
                >
                    Tìm kiếm
                </Button>
            </div>

            <Table
                dataSource={filteredBookings.filter(
                    (item) => item.isChecked === isChecked
                )}
                columns={columns}
                loading={isLoading}
                key={filteredBookings.bookingConfirmationCode}
                bordered
                style={{
                    borderRadius: "10px",
                }}
                rowKey={(record) => record.bookingId}
            />

            <Modal
                title="Tìm kiếm đơn đặt phòng"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={400}
            >
                <Form
                    layout="vertical"
                    onFinish={handleSearch}
                    style={{ marginTop: 20 }}
                >
                    <Form.Item label="Mã đơn đặt phòng" name="bookingConfirmationCode">
                        <Input placeholder="Nhập mã đơn đặt phòng" />
                    </Form.Item>
                    <Form.Item label="Tên người đặt" name="guestName">
                        <Input placeholder="Nhập tên người đặt" />
                    </Form.Item>
                    <Form.Item label="Email người đặt" name="email">
                        <Input placeholder="Nhập email người đặt" />
                    </Form.Item>
                    <Form.Item label="Số điện thoại" name="phoneNumber">
                        <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>
                    <Row style={{ display: "flex", justifyContent: "space-between" }}>
                        <Button
                            type="primary"
                            icon={<BarcodeOutlined />}
                            onClick={() => navigate("/search-booking")}
                        // style={{ marginRight: 10 }}
                        >
                            Quét mã hóa đơn
                        </Button>
                        <Form.Item style={{ textAlign: "right" }}>
                            <Button type="primary" htmlType="submit">
                                Tìm kiếm
                            </Button>
                        </Form.Item>
                    </Row>
                </Form>
            </Modal>
        </section>
    );
};

export default Bookings;

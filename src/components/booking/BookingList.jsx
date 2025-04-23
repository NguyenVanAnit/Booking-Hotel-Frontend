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
} from "antd";
const { RangePicker } = DatePicker;
import moment from "moment";
import { formatVND } from "../helpers/helpers";
import {
    ExclamationCircleOutlined,
    CheckCircleOutlined, DeleteOutlined, SearchOutlined, EyeOutlined
} from "@ant-design/icons";
import emailjs from 'emailjs-com';
import { getBookingsByCheckInDate } from "../utils/booking";

const Bookings = () => {
    const [bookingInfo, setBookingInfo] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filteredBookings, setFilteredBookings] = useState(bookingInfo);
    const [dateCheckIn, setDateCheckIn] = useState(moment().format("YYYY-MM-DD"));
    // const [isModalVisible, setIsModalVisible] = useState(false);
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

    // const handleSearch = (values) => {
    //     const filteredData = bookingInfo.filter((booking) => {
    //         const bookingCode = values?.bookingConfirmationCode?.toLowerCase() || "";
    //         const guestName = values?.guestFullName?.toLowerCase() || "";
    //         const guestEmail = values?.guestEmail?.toLowerCase() || "";

    //         return (
    //             booking.bookingConfirmationCode?.toLowerCase().includes(bookingCode) &&
    //             booking.guestFullName?.toLowerCase().includes(guestName) &&
    //             booking.guestEmail?.toLowerCase().includes(guestEmail)
    //         );
    //     });

    //     setFilteredBookings(filteredData);
    //     setIsModalVisible(false);
    // };

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
            render: (record) => `${record?.numOfAdults} người lớn, ${record?.numOfChildren} trẻ em`,
        },
        {
            title: "Tổng chi phí",
            dataIndex: "totalPrice",
            width: 150,
            align: "center",
            render: (record) => formatVND(record) + " VNĐ",
        }
        // {
        //     title: "Xem chi tiết",
        //     width: 70,
        //     align: "center",
        //     render: (text, record) => {
        //         // Chuyển mảng thành đối tượng moment
        //         const date1 = moment([record?.checkOutDate[0], record?.checkOutDate[1] - 1, record?.checkOutDate[2]]);
        //         const date2 = moment([record?.checkInDate[0], record?.checkInDate[1] - 1, record?.checkInDate[2]]);

        //         // Tính số ngày giữa hai ngày
        //         const daysDifference = date1.diff(date2, 'days');
        //         setTotalPrice((Number(record?.room?.roomPrice) * daysDifference));

        //         return (
        //             <div>
        //                 <Button
        //                     primary
        //                     style={{ marginRight: "5%" }}
        //                     onClick={() => openDetailModal(record)}
        //                 >
        //                     <EyeOutlined />
        //                 </Button>
        //             </div>
        //         );
        //     },
        // },
        // {
        //     title: "Duyệt/ Hủy đơn",
        //     width: 150,
        //     align: "center",
        //     render: (record) => {
        //         if (record?.status == 0) {
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
        //                         onConfirm={() => handleConfirmBooking(record)}
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
        //                         onConfirm={() => handleRejectBooking(record)}
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
        <section style={{ backgroundColor: "whitesmoke", color: "white" }}>
            <Header title={"Danh sách đặt phòng"} />

            <DatePicker 
                title="Chọn ngày nhận phòng (Check-in)"
                style={{ marginBottom: 20, marginTop: 30, width: 300 }}
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

            <Table
                dataSource={filteredBookings}
                columns={columns}
                loading={isLoading}
                key={filteredBookings.bookingConfirmationCode}
                bordered
                style={{
                    borderRadius: "10px",
                    padding: "20px",
                }}
                rowKey={(record) => record.bookingId}
            />
        </section>
    );
};

export default Bookings;

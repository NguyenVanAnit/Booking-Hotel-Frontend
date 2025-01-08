import { useState, useEffect } from "react"
import { cancelBooking, getAllBookings, confirmBooking, rejectBooking } from "../utils/ApiFunctions"
import Header from "../common/Header"
// import BookingsTable from "./BookingsTable"
// import DateSlider from "../common/DateSlider"
// import { parseISO } from "date-fns"
import { Table, Popconfirm, Button, DatePicker, Modal, Form, Input, Tag } from "antd"
const { RangePicker } = DatePicker
import { DeleteOutlined, SearchOutlined, EyeOutlined } from "@ant-design/icons"
import moment from "moment"
import { formatVND } from "../helpers/helpers"
import { ExclamationCircleOutlined, CheckCircleOutlined } from "@ant-design/icons"

const Bookings = () => {
    const [bookingInfo, setBookingInfo] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [filteredBookings, setFilteredBookings] = useState(bookingInfo)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [detailBookingModal, setDetailBookingModal] = useState(false)
    const [selectedBooking, setSelectedBooking] = useState(null);

    const fetchData = async () => {
        setIsLoading(true)
        const response = await getAllBookings()
        if (response) {

            setBookingInfo(response)
            console.log("booking data", bookingInfo)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        setFilteredBookings(bookingInfo)
    }, [bookingInfo])

    const handleDeleteBooking = async (bookingId) => {
        const reponse = await cancelBooking(bookingId);
        console.log(bookingId, "Xóa")
        fetchData()
    }

    const handleConfirmBooking = async (bookingId) => {
        const response = await confirmBooking(bookingId);
        console.log(response)
        fetchData()
    }

    const handleRejectBooking = async (bookingId) => {
        const response = await rejectBooking(bookingId);
        console.log(response)
        fetchData()
    }


    const filterBookings = (startDate, endDate) => {
        if (startDate && endDate) {
            const adjustedStartDate = new Date(startDate.setHours(0, 0, 0, 0));
            const adjustedEndDate = new Date(endDate.setHours(23, 59, 59, 999));

            const filteredData = bookingInfo.filter((booking) => {
                const checkInDate = new Date(booking.checkInDate)
                const checkOutDate = new Date(booking.checkOutDate)
                return checkInDate >= adjustedStartDate && checkOutDate <= adjustedEndDate
            })
            setFilteredBookings(filteredData)
        } else {
            setFilteredBookings(bookingInfo)
        }
    }

    const handleSearch = (values) => {
        const filteredData = bookingInfo.filter((booking) => {
            const bookingCode = values?.bookingConfirmationCode?.toLowerCase() || "";
            const guestName = values?.guestFullName?.toLowerCase() || "";
            const guestEmail = values?.guestEmail?.toLowerCase() || "";

            return (
                booking.bookingConfirmationCode?.toLowerCase().includes(bookingCode) &&
                booking.guestFullName?.toLowerCase().includes(guestName) &&
                booking.guestEmail?.toLowerCase().includes(guestEmail)
            );
        });

        setFilteredBookings(filteredData);
        setIsModalVisible(false);
    };


    const openDetailModal = (record) => {
        setSelectedBooking(record); // Lưu thông tin đơn đặt phòng
        setDetailBookingModal(true); // Mở modal

    };

    const formatDate = (date) => {
        if (Array.isArray(date)) {
            const [year, month, day] = date;
            const formattedMonth = String(month).padStart(2, '0');
            const formattedDay = String(day).padStart(2, '0');
            return `${year}-${formattedMonth}-${formattedDay}`;
        } else if (typeof date === 'string' || date instanceof Date) {
            const parsedDate = new Date(date);
            const year = parsedDate.getFullYear();
            const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
            const day = String(parsedDate.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
        return "Invalid Date";
    };

    const calculateDays = (checkIn, checkOut) => {
        const checkInDateObj = new Date(checkIn);
        const checkOutDateObj = new Date(checkOut);
        const differenceInTime = checkOutDateObj - checkInDateObj; // milliseconds
        const differenceInDays = differenceInTime / (1000 * 60 * 60 * 24); // convert to days
        return differenceInDays;
    };

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
            title: "ID phòng",
            width: 70,
            align: "center",
            render: (record) => record?.room?.id
        },
        {
            title: "Thời gian đặt phòng",
            dataIndex: "bookingTime",
            key: "bookingTime",
            width: 200,
            align: "center",
        },
        {
            title: "Mã đặt phòng",
            dataIndex: "bookingConfirmationCode",
            key: "bookingConfirmationCode",
            width: 100,
            align: "center",
        },
        {
            title: "Tên người đặt",
            dataIndex: "guestFullName",
            key: "guestFullName",
            width: 150,
            align: "center",
        },
        {
            title: "Email",
            dataIndex: "guestEmail",
            key: "guestEmail",
            width: 150,
            align: "center",
        },
        {
            title: 'Loại phòng',
            width: 150,
            align: "center",
            render: (record) => record.room.roomType
        },
        {
            title: "Ngày nhận phòng",
            dataIndex: "checkInDate",
            width: 150,
            align: "center",
            render: (text) => formatDate(text)
        },
        {
            title: "Ngày trả phòng",
            dataIndex: "checkOutDate",
            width: 150,
            align: "center",
            render: (text) => formatDate(text)
        },
        {
            title: "Số người",
            dataIndex: "numOfAdults",
            width: 100,
            align: "center",
        },
        {
            title: "Số trẻ em",
            dataIndex: "numOfChildren",
            width: 100,
            align: "center",
        },
        {
            title: "Xem chi tiết",
            width: 70,
            align: "center",
            render: (text, record) => {
                const checkIn = formatDate(record?.checkInDate);
                const checkOut = formatDate(record?.checkOutDate);
                const diffInDays = calculateDays(checkIn, checkOut);
                const paymentPerDay = record?.room?.roomPrice;
                const totalPrice = diffInDays * paymentPerDay;

                return (
                    <div>
                        <Button primary style={{ marginRight: "5%" }} onClick={() => openDetailModal(record)}>
                            <EyeOutlined />
                        </Button>
                    </div>
                )
            },
        },
        {
            title: "Duyệt/ Hủy đơn",
            width: 150,
            align: "center",
            render: (record) => {
                if (record?.status == 0) {
                    return (
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Popconfirm
                                title="Xác nhận duyệt đơn đặt phòng"
                                description="Có chắc chắn duyệt đơn đặt phòng này?"
                                onConfirm={() => handleConfirmBooking(record.bookingId)}
                                okText="Đồng ý"
                                cancelText="Hủy"
                            >
                                <Button style={{ marginLeft: "5%" }} type="primary">
                                    Duyệt
                                </Button>
                            </Popconfirm>

                            <Popconfirm
                                title="Xác nhận từ chối đơn đặt phòng"
                                description="Có chắc chắn từ chối đơn đặt phòng này?"
                                onConfirm={() => handleRejectBooking(record.bookingId)}
                                okText="Đồng ý"
                                cancelText="Hủy"
                            >
                                <Button style={{ marginLeft: "5%" }} danger>
                                    Từ chối
                                </Button>
                            </Popconfirm>

                        </div>
                    )
                } else if (record?.status == 1) {
                    return (
                        <div> <Tag icon={<CheckCircleOutlined />} color="success" style={{ fontWeight: '500', fontSize: '14px' }}>
                            Đã duyệt
                        </Tag></div>
                    )
                } else if (record?.status == 2) {
                    return (
                        <div><Tag icon={<ExclamationCircleOutlined />} color="warning" style={{ fontWeight: '500', fontSize: '14px' }}>
                            Đã từ chối
                        </Tag></div>
                    )
                } else {
                    return (
                        <div><Tag color="error" style={{ fontWeight: '500', fontSize: '14px' }}>
                            Lỗi đơn
                        </Tag></div>
                    )
                }
            }
        }
    ];

    return (
        <section style={{ backgroundColor: "whitesmoke", color: 'white' }}>
            <Header title={"Danh sách đặt phòng"} />

            <div style={{ padding: "10px 30px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                    <div style={{ display: "flex", color: "black", alignItems: "center", }}>
                        <p>Chọn khoảng thời gian đặt phòng: </p>
                        <RangePicker
                            style={{ marginLeft: "20px", marginBottom: "20px" }}
                            onChange={(dates) => {
                                // Chuyển đổi Moment sang Date
                                const startDate = dates ? dates[0]?.toDate() : null;
                                const endDate = dates ? dates[1]?.toDate() : null;
                                filterBookings(startDate, endDate);
                            }}
                        />
                    </div>

                    <Button type="primary" onClick={() => setIsModalVisible(true)}>
                        Tìm kiếm <SearchOutlined />
                    </Button>
                </div>
                <Table
                    dataSource={filteredBookings}
                    columns={columns}
                    loading={isLoading}
                    key={filteredBookings.bookingConfirmationCode}
                    bordered
                />
                <Modal
                    title="Tìm kiếm đặt phòng"
                    open={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={null}
                    width={400}
                >
                    <Form layout="vertical" onFinish={handleSearch}>
                        <Form.Item label="Mã đặt phòng" name={"bookingConfirmationCode"}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Tên người đặt" name={"guestFullName"}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Email" name={"guestEmail"}>
                            <Input />
                        </Form.Item>
                        <Form.Item style={{ textAlign: "right" }}>
                            <Button
                                style={{ marginRight: "10px" }}
                                onClick={() => {
                                    setFilteredBookings(bookingInfo)
                                    setIsModalVisible(false)

                                }}>
                                Reset
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Tìm kiếm
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    title={"Chi tiết đặt phòng: "}
                    open={detailBookingModal}
                    onCancel={() => setDetailBookingModal(false)}
                    footer={null}
                    width={500}
                >
                    <div style={{ fontSize: "20px" }}>
                        <p className="text-success">Confirmation Code: {selectedBooking?.bookingConfirmationCode}</p>
                        <p>ID phòng: <span style={{ fontWeight: 600 }}>{selectedBooking?.room?.id ?? ''}</span></p>
                        <p>Loại phòng: <span style={{ fontWeight: 600 }}>{selectedBooking?.room?.roomType ?? ''}</span></p>
                        <p>
                            Ngày nhận phòng:{" "}<span style={{ fontWeight: 600 }}>{selectedBooking?.checkInDate}</span>
                        </p>
                        <p>
                            Ngày trả phòng:{" "}<span style={{ fontWeight: 600 }}>{selectedBooking?.checkOutDate}</span>
                        </p>
                        <p>Người đặt phòng: <span style={{ fontWeight: 600 }}>{selectedBooking?.guestFullName}</span></p>
                        <p>Email: <span style={{ fontWeight: 600 }}>{selectedBooking?.guestEmail}</span></p>
                        <p>Số người lớn: <span style={{ fontWeight: 600 }}>{selectedBooking?.numOfAdults}</span></p>
                        <p>Số trẻ em: <span style={{ fontWeight: 600 }}>{selectedBooking?.numOfChildren}</span></p>
                        {/* <p>Tổng số tiền: <span style={{ fontWeight: 600 }}>{formatVND(selectedBooking?.totalPrice)} VND</span></p> */}
                    </div>

                    <Popconfirm
                        title="Xác nhận xóa đơn đặt phòng"
                        description="Có chắc chắn xóa đơn đặt phòng này?"
                        onConfirm={() => handleDeleteBooking(selectedBooking.bookingId)}
                        okText="Đồng ý"
                        cancelText="Hủy"
                    >
                        <Button danger>
                            <DeleteOutlined />
                        </Button>
                    </Popconfirm>

                </Modal>
            </div>
        </section>
    )
}

export default Bookings
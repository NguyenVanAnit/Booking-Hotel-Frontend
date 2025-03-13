import React, { useEffect, useState } from "react"
import { deleteUser, getBookingsByUserId, getUser } from "../utils/ApiFunctions"
import { useNavigate } from "react-router-dom"
import { Table, Modal, Button, Tag } from "antd"
import { formatVND } from "../helpers/helpers"
import { EyeOutlined } from "@ant-design/icons"
import moment from 'moment';

const Profile = () => {
    const [detailBookingModal, setDetailBookingModal] = useState(false)
    const [record, setRecord] = useState({})
    const [totalPrice, setTotalPrice] = useState(0)
    const [user, setUser] = useState({
        id: "",
        email: "",
        firstName: "",
        lastName: "",
        roles: [{ id: "", name: "" }]
    })

    const [bookings, setBookings] = useState([
        {
            id: "",
            room: { id: "", roomType: "" },
            checkInDate: "",
            checkOutDate: "",
            bookingConfirmationCode: ""
        }
    ])
    const [message, setMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const navigate = useNavigate()

    const userId = localStorage.getItem("userId")
    const token = localStorage.getItem("token")

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getUser(userId, token)
                setUser(userData)
            } catch (error) {
                console.error(error)
            }
        }

        fetchUser()
    }, [userId])

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await getBookingsByUserId(userId, token)
                setBookings(response)
            } catch (error) {
                console.error("Error fetching bookings:", error.message)
                setErrorMessage(error.message)
            }
        }

        fetchBookings()
    }, [userId])

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

    // const handleDeleteAccount = async () => {
    //     const confirmed = window.confirm(
    //         "Bạn có chắc chắn muốn xóa tài khoản. Hành động này không thể hoàn tác!"
    //     )
    //     if (confirmed) {
    //         await deleteUser(userId)
    //             .then((response) => {
    //                 setMessage(response.data)
    //                 localStorage.removeItem("token")
    //                 localStorage.removeItem("userId")
    //                 localStorage.removeItem("userRole")
    //                 navigate("/")
    //                 window.location.reload()
    //             })
    //             .catch((error) => {
    //                 setErrorMessage(error.data)
    //             })
    //     }
    // }

    const columns = [
        {
            title: "Booking ID",
            dataIndex: "bookingId",
            key: "id",
            align: "center"
        },
        {
            title: "Room ID",
            align: "center",
            render: (record) => record?.room?.id,
        },
        {
            title: "Loại phòng",
            key: "room.roomType",
            align: "center",
            render: (record) => record?.room?.roomType
        },
        {
            title: "Ngày nhận phòng",
            dataIndex: "checkInDate",
            key: "checkInDate",
            align: "center",
            render: (text) => `${text[0]}-${text[1]}-${text[2]}`
        },
        {
            title: "Ngày trả phòng",
            dataIndex: "checkOutDate",
            key: "checkOutDate",
            align: "center",
            render: (text) => `${text[0]}-${text[1]}-${text[2]}`
        },
        {
            title: "Mã đặt phòng",
            dataIndex: "bookingConfirmationCode",
            align: "center",
            key: "bookingConfirmationCode"
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            align: "center",
            key: "status",
            render: (value) => {
                if (value == 0) return (<Tag color="blue">Chờ xác nhận</Tag>)
                else if (value == 1) return (<Tag color="green">Thành công</Tag>)
                else if (value == 2) return (<Tag color="red">Từ chối</Tag>)

            }
        },
        {
            title: "Xem chi tiết",
            key: "action",
            align: "center",
            render: (record) => (
                <Button
                    type="primary"
                    onClick={() => {
                        setDetailBookingModal(true)
                        setRecord(record)

                        // Chuyển mảng thành đối tượng moment
                        const date1 = moment([record?.checkOutDate[0], record?.checkOutDate[1] - 1, record?.checkOutDate[2]]);
                        const date2 = moment([record?.checkInDate[0], record?.checkInDate[1] - 1, record?.checkInDate[2]]);

                        // Tính số ngày giữa hai ngày
                        const daysDifference = date1.diff(date2, 'days');
                        setTotalPrice((Number(record?.room?.roomPrice) * daysDifference));
                    }}
                >
                    <EyeOutlined />
                </Button>
            )
        }
    ]

    return (
        <div className="container">
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
            {message && <p className="text-danger">{message}</p>}
            {user ? (
                <div className="card p-5 mt-5" style={{ backgroundColor: "whitesmoke" }}>
                    <h4 className="card-title text-center">Thông tin cá nhân</h4>
                    <div className="card-body">
                        <div className="col-md-10 mx-auto">
                            <div className="card mb-3 shadow">
                                <div className="row g-0">
                                    <div className="col-md-2">
                                        <div className="d-flex justify-content-center align-items-center mb-4">
                                            <img
                                                src="https://themindfulaimanifesto.org/wp-content/uploads/2020/09/male-placeholder-image.jpeg"
                                                alt="Profile"
                                                className="rounded-circle"
                                                style={{ width: "150px", height: "150px", objectFit: "cover" }}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-10">
                                        <div className="card-body">
                                            <div className="form-group row">
                                                <label className="col-md-2 col-form-label fw-bold">ID:</label>
                                                <div className="col-md-10">
                                                    <p className="card-text">{user.id}</p>
                                                </div>
                                            </div>
                                            <hr />

                                            <div className="form-group row">
                                                <label className="col-md-2 col-form-label fw-bold">Tên người dùng:</label>
                                                <div className="col-md-10">
                                                    <p className="card-text">{user.firstName}</p>
                                                </div>
                                            </div>
                                            <hr />

                                            <div className="form-group row">
                                                <label className="col-md-2 col-form-label fw-bold">Họ người dùng:</label>
                                                <div className="col-md-10">
                                                    <p className="card-text">{user.lastName}</p>
                                                </div>
                                            </div>
                                            <hr />

                                            <div className="form-group row">
                                                <label className="col-md-2 col-form-label fw-bold">Email:</label>
                                                <div className="col-md-10">
                                                    <p className="card-text">{user.email}</p>
                                                </div>
                                            </div>
                                            <hr />

                                            <div className="form-group row">
                                                <label className="col-md-2 col-form-label fw-bold">Vai trò:</label>
                                                <div className="col-md-10">
                                                    <ul className="list-unstyled">
                                                        {user.roles.map((role) => (
                                                            <li key={role.id} className="card-text">
                                                                {role.name}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <h4 className="card-title text-center mt-5">Lịch sử đặt phòng</h4>

                            <Modal
                                title={"Chi tiết đặt phòng: "}
                                open={detailBookingModal}
                                onCancel={() => setDetailBookingModal(false)}
                                footer={null}
                                width={500}
                            >
                                <div style={{ fontSize: "20px" }}>
                                    <p className="text-success">Confirmation Code: {record.bookingConfirmationCode}</p>
                                    <p>ID phòng: <span style={{ fontWeight: 600 }}>{record?.room?.id ?? ''}</span></p>
                                    <p>Loại phòng: <span style={{ fontWeight: 600 }}>{record?.room?.roomType}</span></p>
                                    <p>
                                        Thời gian đặt phòng:{" "}
                                        <span style={{ fontWeight: 600 }}>
                                            {record?.bookingTime}
                                        </span>
                                    </p>
                                    <p>
                                        Ngày nhận phòng:{" "}<span style={{ fontWeight: 600 }}>{formatDate(record.checkInDate)}</span>
                                    </p>
                                    <p>
                                        Ngày trả phòng:{" "}<span style={{ fontWeight: 600 }}>{formatDate(record.checkOutDate)}</span>
                                    </p>
                                    <p>Người đặt phòng: <span style={{ fontWeight: 600 }}>{record.guestFullName}</span></p>
                                    <p>Email: <span style={{ fontWeight: 600 }}>{record.guestEmail}</span></p>
                                    <p>
                                        Số điện thoại:{" "}
                                        <span style={{ fontWeight: 600 }}>
                                            {record?.phoneNumber}
                                        </span>
                                    </p>
                                    <p>Số người lớn: <span style={{ fontWeight: 600 }}>{record.numOfAdults}</span></p>
                                    <p>Tổng số tiền: <span style={{ fontWeight: 600 }}>{formatVND(totalPrice)} VND</span></p>
                                    <p>
                                        Kiểu thanh toán:{" "}
                                        <span style={{ fontWeight: 600 }}>
                                            {record?.accountBank ? "Chuyển khoản" : "Trực tiếp"}
                                        </span>
                                    </p>
                                    {record?.accountBank && (
                                        <div>
                                            <p>
                                                Ngân hàng:{" "}
                                                <span style={{ fontWeight: 600 }}>
                                                    {record?.bank}
                                                </span>
                                            </p>
                                            <p>
                                                Tên tài khoản:{" "}
                                                <span style={{ fontWeight: 600 }}>
                                                    {record?.nameUserBank}
                                                </span>
                                            </p>
                                            <p>
                                                Số tài khoản:{" "}
                                                <span style={{ fontWeight: 600 }}>
                                                    {record?.accountBank}
                                                </span>
                                            </p>
                                            <p>
                                                Mã giao dịch:{" "}
                                                <span style={{ fontWeight: 600 }}>
                                                    {record?.transactionCode}
                                                </span>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </Modal>
                            <Table
                                columns={columns}
                                dataSource={bookings}
                                pagination={{ pageSize: 10 }}
                                rowKey={(record) => record.id}
                                bordered
                            />

                            {/* <Button className="mt-5" type="primary" danger onClick={handleDeleteAccount}>
                                Xóa tài khoản
                            </Button> */}
                        </div>
                    </div>
                </div>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
    )
}

export default Profile
import { useState, useEffect } from "react"
import { cancelBooking, getAllBookings } from "../utils/ApiFunctions"
import Header from "../common/Header"
// import BookingsTable from "./BookingsTable"
// import DateSlider from "../common/DateSlider"
// import { parseISO } from "date-fns"
import { Table } from "antd"

const Bookings = () => {
    const [bookingInfo, setBookingInfo] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(true)
            getAllBookings()
                .then((data) => {
                    setBookingInfo(data)
                    console.log("booking data", bookingInfo)
                    setIsLoading(false)
                })
                .catch((error) => {
                    setError(error.message)
                    setIsLoading(false)
                })

        }, 1000)
    }, [])

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
            width: 300,
            align: "center",
        },
        {
            title: "Email",
            dataIndex: "guestEmail",
            key: "guestEmail",
            width: 200,
            align: "center",
        },
        {
            title: 'Loại phòng',
            width: 200,
            align: "center",
            render: (record) => <p>{record.room.roomType}</p>
        },
        {
            title: "Ngày nhận phòng",
            dataIndex: "checkInDate",
            width: 200,
            align: "center",
        },
        {
            title: "Ngày trả phòng",
            dataIndex: "checkOutDate",
            width: 200,
            align: "center",
        },
        {
            title: "Số người lớn",
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
            title: "Chức năng",
            dataIndex: "action",
            key: "action",
            width: 200,
            align: "center",
            render: (text, record) => (
                <div>
                    {/* <Button
                color="primary"
                variant="outlined"
                onClick={() => handleEditRoom(record.id)}
              >
                <EditOutlined />
              </Button>
              <Popconfirm
                title="Xác nhận xóa phòng"
                description="Có chắc chắn xóa phòng này?"
                onConfirm={() => handleDeleteRoom(record.id)}
                okText="Xóa"
                cancelText="Hủy"
              >
                <Button style={{ marginLeft: "5%" }} danger>
                  <DeleteOutlined />
                </Button>
              </Popconfirm> */}
                </div>
            ),
        },
    ];

    const handleBookingCancellation = async (bookingId) => {
        try {
            await cancelBooking(bookingId)
            const data = await getAllBookings()
            setBookingInfo(data)
        } catch (error) {
            setError(error.message)
        }
    }

    const [filteredBookings, setFilteredBookings] = useState(bookingInfo)

    // const filterBooknigs = (startDate, endDate) => {
    //     let filtered = bookingInfo
    //     if (startDate && endDate) {
    //         filtered = bookingInfo.filter((booking) => {
    //             const bookingStarDate = parseISO(booking.checkInDate)
    //             const bookingEndDate = parseISO(booking.checkOutDate)
    //             return (
    //                 bookingStarDate >= startDate && bookingEndDate <= endDate && bookingEndDate > startDate
    //             )
    //         })
    //     }
    //     setFilteredBookings(filtered)
    // }

    useEffect(() => {
        setFilteredBookings(bookingInfo)
    }, [bookingInfo])

    return (
        <section style={{ backgroundColor: "whitesmoke", color: 'white' }}>
            <Header title={"Danh sách đặt phòng"} />
            {error && <div className="text-danger">{error}</div>}

            <div>
                {/* <DateSlider onDateChange={filterBooknigs} onFilterChange={filterBooknigs} /> */}
                <Table
                    dataSource={bookingInfo}
                    columns={columns}
                    loading={isLoading}
                />
            </div>
        </section>
    )
}

export default Bookings
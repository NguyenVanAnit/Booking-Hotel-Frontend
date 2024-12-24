import { useEffect } from "react"
import moment from "moment"
import { useState } from "react"
// import { Form, FormControl, Button } from "react-bootstrap"
import BookingSummary from "./BookingSummary"
import { bookRoom, getRoomById } from "../utils/ApiFunctions"
import { useNavigate } from "react-router-dom"
import { Form, Input, Row, DatePicker, Col, Button } from "antd";
const { RangePicker } = DatePicker;
// import { useAuth } from "../auth/AuthProvider"

const BookingForm = ({ room }) => {
    const { form } = Form.useForm();
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [roomPrice, setRoomPrice] = useState(0)

    const currentUser = localStorage.getItem("userId")

    const [booking, setBooking] = useState({
        guestFullName: "",
        guestEmail: currentUser,
        checkInDate: "",
        checkOutDate: "",
        numOfAdults: "",
        numOfChildren: ""
    })

    const roomId = room?.id || '';
    const navigate = useNavigate()

    const getRoomPriceById = async (roomId) => {
        try {
            const response = await getRoomById(roomId)
            setRoomPrice(response.roomPrice)
        } catch (error) {
            throw new Error(error)
        }
    }

    useEffect(() => {
        getRoomPriceById(roomId)
    }, [roomId])

    const calculatePayment = () => {
        const checkInDate = moment(booking.checkInDate)
        const checkOutDate = moment(booking.checkOutDate)
        const diffInDays = checkOutDate.diff(checkInDate, "days")
        const paymentPerDay = roomPrice ? roomPrice : 0
        return diffInDays * paymentPerDay
    }

    const handleSubmit = async (values) => {
        setBooking(
            {
                guestFullName: values.guestFullName,
                guestEmail: currentUser || values.guestEmail,
                checkInDate: values.checkInDate[0].format("YYYY-MM-DD"),
                checkOutDate: values.checkInDate[1].format("YYYY-MM-DD"),
                numOfAdults: values.numOfAdults,
                numOfChildren: values.numOfChildren ?? 0
            }
        )
        setIsSubmitted(true);
    }

    const handleFormSubmit = () => async () => {
        console.log("booking", booking)
        console.log("room id", roomId)
        try {
            const confirmationCode = await bookRoom(roomId, booking)
            setIsSubmitted(true)
            navigate("/booking-success", { state: { message: confirmationCode } })
        } catch (error) {
            const errorMessage = error.message
            console.log(errorMessage)
            navigate("/booking-success", { state: { error: errorMessage } })
        }
    }

    return (
        <>
            <div className="container mb-5">
                <div className="row">
                    <div className="col-md-6">
                        <div className="card card-body mt-5">
                            <h4 className="card-title">Đăng ký phòng</h4>

                            <Form form={form} layout="vertical" onFinish={handleSubmit} >
                                <Form.Item label="Tên đầy đủ" name="guestFullName" rules={[{ required: true, message: "Vui lòng nhập tên đầy đủ" }]} >
                                    <Input />
                                </Form.Item>
                                <Form.Item label="Email" name="guestEmail">
                                    <Input />
                                </Form.Item>
                                <Form.Item label="Ngày nhận phòng - Ngày trả phòng" name="checkInDate" rules={[{ required: true, message: "Vui lòng chọn ngày nhận phòng" }]}>
                                    <RangePicker format="YYYY-MM-DD" placeholder={['Từ ngày', 'Đến ngày']} style={{ width: "100%" }} />
                                </Form.Item>
                                <Row style={{ display: "flex", justifyContent: "space-between" }}>
                                    <Col span={11}>
                                        <Form.Item label="Số người lớn" name="numOfAdults" rules={[{ required: true, message: "Vui lòng chọn số người lớn" }]}>
                                            <Input type="number" min={1} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={11}>
                                        <Form.Item label="Số trẻ em" name="numOfChildren">
                                            <Input type="number" min={0} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Tiếp tục
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>

                    <div className="col-md-6" >
                        {isSubmitted && (
                            <BookingSummary
                                booking={booking}
                                payment={calculatePayment()}
                                onConfirm={handleFormSubmit()}
                                isFormValid={true}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
export default BookingForm
import React from "react"
import { Link, useLocation } from "react-router-dom"
import Header from "../common/Header"
import { Image, Button } from "antd"
import QR from "../../assets/images/qr.jpg"

const BookingSuccess = () => {
    const location = useLocation()
    const message = location.state?.message
    const error = location.state?.error
    return (
        <div className="container">
            <Header title="Kết quả đặt phòng" />
            <div className="mt-5">
                {message ? (
                    <div>
                        <h3 className="text-success"> Booking Success!</h3>
                        <p className="text-success">{message}</p>
                        <p className="text-warning">Vui lòng đến xác nhận tại khách sạn trong 2 ngày gần nhất để tránh bị hủy đơn!</p>
                        <p className="text-warning">Nếu bạn đã thanh toán bằng hình thức chuyển khoản, hãy bỏ qua thông báo này</p>
                        <Image
                            src={QR}
                            alt="QR code"
                            style={{ width: "200px", height: "auto" }}
                        />
                        <p style={{ fontWeight: 600, fontSize: 20 }} className="text-success">Nội dung chuyển khoản là mã đặt phòng</p>
                        <Button type="primary" href="/">
                            Quay lại trang chủ
                        </Button>
                    </div>
                ) : (
                    <div>
                        <h3 className="text-danger"> Error Booking Room!</h3>
                        <p className="text-danger">{error}</p>

                    </div>
                )}
            </div>
        </div>
    )
}

export default BookingSuccess
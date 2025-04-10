import { useEffect } from "react";
import moment from "moment";
import { useState } from "react";
// import { Form, FormControl, Button } from "react-bootstrap"
// import { bookRoom, getRoomById } from "../utils/ApiFunctions";
import { useNavigate } from "react-router-dom";
import { Form, Input, Row, DatePicker, Col, Button, Image, Upload, Radio, Modal } from "antd";
const { RangePicker } = DatePicker;
import QR from "../../assets/images/qr.jpg";
import { UploadOutlined } from "@ant-design/icons";
import { formatVND } from "../helpers/helpers";
// import { useAuth } from "../auth/AuthProvider"


const BookingForm = ({ room }) => {
    const { form } = Form.useForm();
    const [roomPrice, setRoomPrice] = useState(0);
    const [totalMoney, setTotalMoney] = useState(0);
    const [totalDays, setTotalDays] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState(true);
    const [resultResponse, setResultResponse] = useState(false);
    const [messageResponse, setMessageResponse] = useState('');
    const [isSuccess, setIsSuccess] = useState(true);

    const currentUser = localStorage.getItem("email");

    const roomId = room?.id || "";
    const navigate = useNavigate();

    const getRoomPriceById = async (roomId) => {
        try {
            const response = await getRoomById(roomId);
            setRoomPrice(response.roomPrice);
        } catch (error) {
            throw new Error(error);
        }
    };

    useEffect(() => {
        getRoomPriceById(roomId);
    }, [roomId]);

    const calculatePayment = (dates) => {
        const [checkInDate, checkOutDate] = dates;
        const diffInDays = checkOutDate.diff(checkInDate, "days");
        const paymentPerDay = roomPrice ? roomPrice : 0;
        setTotalMoney(diffInDays * paymentPerDay)
        setTotalDays(diffInDays)
    };

    const handleFormSubmit = async (values) => {
        const today = moment().format("YYYY-MM-DD HH:mm:ss");

        console.log({
            guestFullName: values.guestFullName,
            guestEmail: currentUser,
            checkInDate: values.checkInDate[0].format("YYYY-MM-DD"),
            checkOutDate: values.checkInDate[1].format("YYYY-MM-DD"),
            numOfAdults: values.numOfAdults,
            numOfChildren: values.numOfChildren ?? 0,
            bookingTime: today,
            phoneNumber: values.phoneNumber,
            transactionCode: values.transactionCode,
            nameUserBank: values.nameUserBank,
            accountBank: values.accountBank,
            bank: values.bank
        });

        try {
            const response = await bookRoom(roomId, {
                guestFullName: values.guestFullName,
                guestEmail: currentUser,
                checkInDate: values.checkInDate[0].format("YYYY-MM-DD"),
                checkOutDate: values.checkInDate[1].format("YYYY-MM-DD"),
                numOfAdults: values.numOfAdults,
                numOfChildren: values.numOfChildren ?? 0,
                bookingTime: today,
                phoneNumber: values.phoneNumber,
                transactionCode: values.transactionCode,
                nameUserBank: values.nameUserBank,
                accountBank: values.accountBank,
                bank: values.bank
            });

            if (response.status === 200) {
                console.log("Đặt phòng thành công");
                setIsSuccess(true)
                setResultResponse(true);
                setMessageResponse(response.data)
            } else {
                console.log("Đặt phòng thất bại");
                setIsSuccess(false)
                setResultResponse(true);
                setMessageResponse(response.data)
            }

            // navigate("/booking-success", { state: { message: confirmationCode } });
        } catch (error) {
            const errorMessage = error.message;
            console.log(errorMessage);
            setIsSuccess(false)
            setResultResponse(true);
            setMessageResponse(errorMessage)
            // navigate("/booking-success", { state: { error: errorMessage } });
        }
    };


    const disabledDate = (current) => {
        // Không cho chọn ngày trong quá khứ
        return current && current < moment().endOf("day");
    };

    return (
        <>
            <div className="container mb-5">
                <div className="row">
                    <div className="col-md-8">
                        <div className="card card-body mt-5">
                            <h4 className="card-title">Đăng ký phòng</h4>

                            <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
                                <Form.Item label="Hình thức thanh toán" name="paymentMethod">
                                    <Radio.Group
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    >
                                        <Radio.Button value={true}>Chuyển khoản</Radio.Button>
                                        <Radio.Button value={false}>Trả tiền trực tiếp</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                                {!paymentMethod && (
                                    <p style={{ color: "red" }}>Sau khi đặt phòng, hãy liên hệ hoặc đến thanh toán trực tiếp để chắc chắn nhận phòng</p>
                                )}
                                <Form.Item
                                    label={"Tên đầy đủ"}
                                    name="guestFullName"
                                    rules={[
                                        { required: true, message: "Vui lòng nhập tên đầy đủ" },
                                    ]}

                                >
                                    <Input />
                                </Form.Item>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item label="Email" name="guestEmail">
                                            <Input defaultValue={currentUser} disabled />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label="Số điện thoại"
                                            name="phoneNumber"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Vui lòng nhập số điện thoại",
                                                },
                                                {
                                                    pattern: /^0\d{9}$/,
                                                    message: "Số điện thoại chưa đúng định dạng",
                                                },
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col span={18}>
                                        <Form.Item
                                            label="Ngày nhận phòng - Ngày trả phòng"
                                            name="checkInDate"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Vui lòng chọn ngày nhận phòng",
                                                },
                                            ]}
                                        >
                                            <RangePicker
                                                format="YYYY-MM-DD"
                                                placeholder={["Từ ngày", "Đến ngày"]}
                                                style={{ width: "100%" }}
                                                disabledDate={disabledDate}
                                                onChange={calculatePayment}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item
                                            label="Số người"
                                            name="numOfAdults"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Vui lòng chọn số người lớn",
                                                },
                                            ]}
                                        >
                                            <Input type="number" min={1} />
                                        </Form.Item>
                                    </Col>
                                </Row>


                                {paymentMethod && (
                                    <>
                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <Form.Item label="Tên ngân hàng" name="bank" rules={[{ required: true, message: "Vui lòng nhập tên ngân hàng" }]} >
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item label="Mã giao dịch chuyển khoản" name="transactionCode" rules={[{ required: true, message: "Vui lòng nhập mã giao dịch" }]} >
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <Form.Item label="Tên tài khoản ngân hàng" name="nameUserBank" rules={[{ required: true, message: "Vui lòng nhập tên tài khoản" }]} >
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item label="Số tài khoản" name="accountBank" rules={[{ required: true, message: "Vui lòng nhập số tài khoản" }]} >
                                                    <Input type="number" />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </>
                                )}

                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Đặt phòng
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>

                        <Modal open={resultResponse} onCancel={() => setResultResponse(false)} footer>
                            <div className={{ padding: '40px' }}>
                                <h3>{isSuccess ? 'Đặt phòng thành công, vui lòng chờ duyệt đơn từ khách sạn' : 'Lỗi đặt phòng'}</h3>
                                <p style={{ fontWeight: 600, fontSize: 20 }} className={isSuccess ? "text-success" : 'text-warning'}>{messageResponse}</p>
                                {isSuccess && <p style={{ fontSize: '16px' }}>Vui lòng kiểm tra email để theo dõi việc duyệt đơn của đơn đặt phòng</p>}
                                <Button href="/">
                                    Quay lại trang chủ
                                </Button>
                            </div>
                        </Modal>
                    </div>

                    <div className="col-md-4" style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                        {/* {isSubmitted && (
                            <BookingSummary
                                booking={booking}
                                payment={calculatePayment()}
                                onConfirm={handleFormSubmit()}
                                isFormValid={true}
                            />
                        )} */}
                        {paymentMethod && (
                            <div>
                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                                    <Image
                                        src={QR}
                                        alt="QR code"
                                        style={{ width: "200px", height: "auto" }}
                                    />
                                    <div>
                                        <p style={{ fontWeight: 600, fontSize: 20 }} className="text-success">Tổng tiền: {formatVND(totalMoney)} VNĐ</p>
                                        <p style={{ fontWeight: 600, fontSize: 17 }}>Thuê trong <span className="text-primary">{totalDays}</span> ngày</p>
                                        <p style={{ fontWeight: 400, fontSize: 14 }} className="">Nội dung chuyển khoản là email + id phòng</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
export default BookingForm;

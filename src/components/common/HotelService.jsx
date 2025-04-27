import React from "react"
import { Container, Row, Col, Card } from "react-bootstrap"
import Header from "./Header"
import { WifiOutlined, PlaySquareOutlined, CoffeeOutlined, CarOutlined, TruckOutlined, SkinOutlined, LoadingOutlined } from "@ant-design/icons"

const HotelService = () => {
    return (
        <>
            <div className="mb-2">
                <Header title={"Các dịch vụ hàng đầu"} />

                <Row className="mt-4">
                    <h4 className="text-center">
                        Dịch vụ nổi tiếng ở Khách sạn <span className="hotel-color"> An An </span>
                        <span className="gap-2">
                            {/* <FaClock className="ml-5" />  */}
                            phục vụ bạn 24/7
                        </span>
                    </h4>
                </Row>
                <hr />

                <Row xs={1} md={2} lg={3} className="g-4 mt-2">
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title className="hotel-color">
                                    <WifiOutlined /> Wifi
                                </Card.Title>
                                <Card.Text>Tốc độ truy cập nhanh chóng.</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title className="hotel-color">
                                    <CoffeeOutlined /> Ăn uống
                                </Card.Title>
                                <Card.Text>Các đầu bếp 5 sao hàng đầu.</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title className="hotel-color">
                                    <SkinOutlined /> Giặt là
                                </Card.Title>
                                <Card.Text>Sự sạch sẽ của bạn luôn được ưu tiên.</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title className="hotel-color">
                                    <PlaySquareOutlined /> Netfilx Premium
                                </Card.Title>
                                <Card.Text>Cung cấp dịch vụ miễn phí.</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title className="hotel-color">
                                    <TruckOutlined /> Bãi đỗ xe
                                </Card.Title>
                                <Card.Text>Bãi đỗ xe rộng rãi không bao giờ thiếu.</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title className="hotel-color">
                                    <CarOutlined /> Dịch vụ vận chuyển
                                </Card.Title>
                                <Card.Text>Cung cấp dịch vụ vận chuyển miễn phí.</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
            <hr />
        </>
    )
}

export default HotelService
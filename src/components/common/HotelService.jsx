import React from "react"
import { Container, Row, Col, Card } from "react-bootstrap"
import Header from "./Header"
import { WifiOutlined, PlaySquareOutlined, CoffeeOutlined, CarOutlined, TruckOutlined, SkinOutlined, LoadingOutlined } from "@ant-design/icons"

const HotelService = () => {
    return (
        <>
            <div className="mb-2">
                <Header title={"Our Services"} />

                <Row className="mt-4">
                    <h4 className="text-center">
                        Services at <span className="hotel-color"> lakeSide - </span>Hotel
                        <span className="gap-2">
                            {/* <FaClock className="ml-5" />  */}
                            24-Hour Front Desk
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
                                <Card.Text>Stay connected with high-speed internet access.</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title className="hotel-color">
                                    <CoffeeOutlined /> Ăn uống
                                </Card.Title>
                                <Card.Text>Start your day with a delicious breakfast buffet.</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title className="hotel-color">
                                    <SkinOutlined /> Giặt là
                                </Card.Title>
                                <Card.Text>Keep your clothes clean and fresh with our laundry service.</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title className="hotel-color">
                                    <PlaySquareOutlined /> Netfilx Premium
                                </Card.Title>
                                <Card.Text>Enjoy a refreshing drink or snack from our in-room mini-bar.</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title className="hotel-color">
                                    <TruckOutlined /> Bãi đỗ xe
                                </Card.Title>
                                <Card.Text>Park your car conveniently in our on-site parking lot.</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title className="hotel-color">
                                    <CarOutlined /> Dịch vụ chăm sóc xe
                                </Card.Title>
                                <Card.Text>Stay cool and comfortable with our air conditioning system.</Card.Text>
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
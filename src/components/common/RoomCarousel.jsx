import { useEffect, useState } from "react"
import { getAllRooms } from "../utils/ApiFunctions"
import {  useNavigate } from "react-router-dom"
import { Card, Carousel, Col, Container, Row } from "react-bootstrap"
import { Image, Button } from "antd"
import { formatVND } from "../helpers/helpers"

const RoomCarousel = () => {
    const [rooms, setRooms] = useState([{ id: "", roomType: "", roomPrice: "", photo: "" }])
    const [errorMessage, setErrorMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        setIsLoading(true)
        getAllRooms({
            pageSize: 20,
            pageNumber: 1
        })
            .then((data) => {
                setRooms(data.data || [])
                setIsLoading(false)
            })
            .catch((error) => {
                setErrorMessage(error.message)
                setIsLoading(false)
            })
    }, [])

    if (isLoading) {
        return <div className="mt-5">Loading rooms....</div>
    }
    if (errorMessage) {
        return <div className=" text-danger mb-5 mt-5">Error : {errorMessage}</div>
    }

    return (
        <section className="bg-light mb-5 mt-5 shadow">
            <Container>
                <Carousel indicators={false}>
                    {[...Array(Math.ceil(rooms.length / 4))].map((_, index) => (
                        <Carousel.Item key={index}>
                            <Row>
                                {rooms.slice(index * 4, index * 4 + 4).map((room) => (
                                    <Col key={room.id} className="mb-4" xs={12} md={6} lg={3}>
                                        <Card>
                                            <Image
                                                variant="top"
                                                src={room?.photo1 || ''}
                                                alt="Room Photo"
                                                className="w-100"
                                                style={{ height: "200px", objectFit: "cover" }}
                                                preview={false}
                                                onClick={() => navigate("/detail-room", { state: room?.id })}
                                            />
                                            <Card.Body>
                                                <Card.Title className="hotel-color">{room.name}</Card.Title>
                                                <Card.Title className="room-price">{formatVND(room.roomPrice)} VND/đêm</Card.Title>
                                                <div className="flex-shrink-0">
                                                    <Button type="primary" onClick={() => navigate("/detail-room", { state: room?.id })}>Đặt ngay</Button>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Carousel.Item>
                    ))}
                </Carousel>

                <Button onClick={() => navigate('/browse-all-rooms')} style={{ marginBottom: '20px' }} size="large">Xem thêm</Button>
            </Container>
        </section>
    )
}

export default RoomCarousel
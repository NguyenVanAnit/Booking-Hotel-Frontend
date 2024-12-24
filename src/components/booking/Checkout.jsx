import { useEffect, useState } from "react"
import BookingForm from "../booking/BookingForm"
import { WifiOutlined, PlaySquareOutlined, CoffeeOutlined, CarOutlined, TruckOutlined, SkinOutlined, LoadingOutlined } from "@ant-design/icons"

import { useLocation } from "react-router-dom"
import { getRoomById } from "../utils/ApiFunctions"
import RoomCarousel from "../common/RoomCarousel"
import { Image } from "antd";
import { formatVND } from "../helpers/helpers"

const Checkout = () => {
    const location = useLocation();
    const room = location?.state;
    // console.log("adawda", room.id)
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [roomInfo, setRoomInfo] = useState(room)

    useEffect(() => {
        getRoomById(room.id)
            .then((response) => {
                setRoomInfo(response)
                setIsLoading(false)
            })
            .catch((error) => {
                setError(error)
                setIsLoading(false)
            })
    }, [room.id])

    return (
        <div>
            <section className="container">
                <div className="row">
                    <div className="col-md-4 mt-5 mb-5">
                        {isLoading ? (
                            <div>
                                <LoadingOutlined />
                                <p>Loading room information...</p>
                            </div>
                        ) : error ? (
                            <p>{error}</p>
                        ) : (
                            <div className="room-info">
                                <Image
                                    src={`data:image/png;base64,${roomInfo.photo}`}
                                    alt="Room photo"
                                    style={{ width: "100%", height: "200px" }}
                                />
                                <table className="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <th>Loại phòng:</th>
                                            <td>{roomInfo.roomType}</td>
                                        </tr>
                                        <tr>
                                            <th>Giá phòng / đêm:</th>
                                            <td>{formatVND(roomInfo?.roomPrice ?? 0)} VNĐ</td>
                                        </tr>
                                        <tr>
                                            <th>Các dịch vụ phòng:</th>
                                            <td>
                                                <ul className="list-unstyled" style={{ textAlign: 'left' }}>
                                                    <li>
                                                        <WifiOutlined /> Wifi
                                                    </li>
                                                    <li>
                                                        <PlaySquareOutlined /> Netfilx Premium
                                                    </li>
                                                    <li>
                                                        <CoffeeOutlined /> Ăn uống
                                                    </li>
                                                    <li>
                                                        <CarOutlined /> Dịch vụ chăm sóc xe
                                                    </li>
                                                    <li>
                                                        <TruckOutlined /> Bãi đỗ xe
                                                    </li>
                                                    <li>
                                                        <SkinOutlined /> Giặt là
                                                    </li>
                                                </ul>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                    <div className="col-md-8">
                        <BookingForm room={room} />
                    </div>
                </div>
            </section>
            <div className="container">
                <RoomCarousel />
            </div>
        </div>
    )
}
export default Checkout
import { useEffect, useState } from "react"
import BookingForm from "../booking/BookingForm"
import { WifiOutlined, PlaySquareOutlined, CoffeeOutlined, CarOutlined, TruckOutlined, SkinOutlined, LoadingOutlined } from "@ant-design/icons"

import { useLocation } from "react-router-dom"
// import { getRoomById } from "../utils/ApiFunctions"
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
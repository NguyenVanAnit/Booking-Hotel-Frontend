import React, { useEffect, useState } from "react"
import { getAllRooms, getRoomTypes } from "../utils/ApiFunctions"
import RoomCard from "./RoomCard"
import { Col, Container, Row } from "react-bootstrap"
import { Pagination, Select } from "antd"
// import RoomFilter from "../common/RoomFilter"
// import RoomPaginator from "../common/RoomPaginator"

const Room = () => {
    const [data, setData] = useState([])
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [roomsPerPage, setRoomsPerPage] = useState(10)
    const [filteredData, setFilteredData] = useState([])
    const [listRoomTypes, setListRoomTypes] = useState([])
    const [selectedRoomType, setSelecterdRoomType] = useState("")

    const fetchData = async () => {
        setIsLoading(true)
        await getAllRooms()
            .then((data) => {
                setData(data)
                setFilteredData(data)
                setIsLoading(false)
            })
            .catch((error) => {
                setError(error.message)
                setIsLoading(false)
            })
    }

    const fetchRoomTypes = async () => {
        const response = await getRoomTypes()
        setListRoomTypes(response)
    }

    useEffect(() => {
        fetchData()
        fetchRoomTypes()
    }, [])

    useEffect(() => {
        if (selectedRoomType == undefined) {
            setFilteredData(data); // Dùng dữ liệu gốc
        } else {
            const filteredData2 = data.filter((room) => // Lọc từ `data`, không phải `filteredData`
                room.roomType.includes(selectedRoomType)
            );
            setFilteredData(filteredData2);
        }
        setCurrentPage(1);
    }, [selectedRoomType, data]);

    if (isLoading) {
        return <div>Loading rooms.....</div>
    }
    if (error) {
        return <div className=" text-danger">Error : {error}</div>
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    const handlePageSizeChange = (current, pageSize) => {
        setRoomsPerPage(pageSize);
        setCurrentPage(1);
    }

    // const totalPages = Math.ceil(filteredData.length / roomsPerPage)

    const renderRooms = () => {
        const startIndex = (currentPage - 1) * roomsPerPage
        const endIndex = startIndex + roomsPerPage
        return filteredData
            .slice(startIndex, endIndex)
            .map((room, index) => <RoomCard key={room.id} room={{ ...room, roomNumber: index + 1 }} />)
    }

    return (
        <Container>
            <h1 className="text-center my-4">Danh sách phòng</h1>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Select
                    style={{
                        width: "20%",
                        marginBottom: "20px",
                    }}
                    allowClear
                    options={listRoomTypes.map((roomType) => ({
                        label: roomType,
                        value: roomType,
                    }))}
                    placeholder="Tìm kiếm loại phòng"
                    onChange={(value) => {
                        // console.log(value);
                        setSelecterdRoomType(value)
                    }}
                />

                <Pagination
                    showQuickJumper
                    align="center"
                    current={currentPage}
                    pageSize={roomsPerPage} // Kích thước trang hiện tại
                    total={filteredData.length} // Tổng số phòng
                    onChange={handlePageChange} // Thay đổi trang
                    onShowSizeChange={handlePageSizeChange} // Thay đổi kích thước trang
                    showSizeChanger // Hiển thị bộ chọn kích thước trang
                    style={{ margin: "20px 0" }}
                />
            </div>

            <Row>{renderRooms()}</Row>
            <Pagination
                showQuickJumper
                align="center"
                current={currentPage}
                pageSize={roomsPerPage} // Kích thước trang hiện tại
                total={filteredData.length} // Tổng số phòng
                onChange={handlePageChange} // Thay đổi trang
                onShowSizeChange={handlePageSizeChange} // Thay đổi kích thước trang
                showSizeChanger // Hiển thị bộ chọn kích thước trang
                style={{ margin: "20px 0" }}
            />

        </Container>
    )
}

export default Room
import { useEffect, useState } from "react"
import { Row, Col, Container } from "react-bootstrap"
import moment from "moment"
import RoomSearchResults from "./RoomSearchResult"
// import RoomTypeSelector from "./RoomTypeSelector"
import { Form, Button, DatePicker, Select } from "antd"
const { RangePicker } = DatePicker
import { getRoomTypes, getAvailableRooms } from "../utils/ApiFunctions"
import { SearchOutlined } from "@ant-design/icons";

const RoomSearch = () => {
	const [searchQuery, setSearchQuery] = useState({
		checkInDate: "",
		checkOutDate: "",
		roomType: ""
	})
	const [listRoomTypes, setListRoomTypes] = useState([])

	const fetchRoomTypes = async () => {
		const response = await getRoomTypes()
		setListRoomTypes(response)
	}

	useEffect(() => {
		fetchRoomTypes();
	}, [])

	const [errorMessage, setErrorMessage] = useState("")
	const [availableRooms, setAvailableRooms] = useState([])
	const [isLoading, setIsLoading] = useState(false)

	const handleSearch = (values) => {
		setIsLoading(true)

		const checkInDate = moment(values.datestr[0]).format("YYYY-MM-DD")
		const checkOutDate = moment(values.datestr[1]).format("YYYY-MM-DD")
		const roomType = values.roomType

		getAvailableRooms(checkInDate, checkOutDate, roomType)
			.then((response) => {
				setAvailableRooms(response.data)
				setTimeout(() => setIsLoading(false), 2000)
			})
			.catch((error) => {
				console.log(error)
			})
			.finally(() => {
				setIsLoading(false)
			})
	}

	const handleClearSearch = () => {
		setSearchQuery({
			checkInDate: "",
			checkOutDate: "",
			roomType: ""
		})
		setAvailableRooms([])
	}

	const disabledDate = (current) => {
		// Không cho chọn ngày trong quá khứ
		return current && current < moment().endOf('day');
	};

	return (
		<>
			<Container className="shadow mt-5 mb-5 py-5">
				<h2 className="mb-3">Tìm phòng nhanh chóng</h2>
				<Form
					layout="vertical"
					onFinish={handleSearch}
				>
					<Row className="justify-content-center">
						<Col xs={12} md={3}>
							<Form.Item
								name="datestr"
								label="Ngày nhận phòng - Ngày trả phòng"
								rules={[
									{
										required: true,
										message: "Ngày nhận phòng và trả phòng không được để trống",
									},
								]}

							>
								<RangePicker format="YYYY-MM-DD" disabledDate={disabledDate} />
							</Form.Item>
						</Col>
						<Col xs={12} md={3}>
							<Form.Item
								name="roomType"
								label="Loại phòng"
								rules={[
									{
										required: true,
										message: "Loại phòng không được để trống",
									},
								]}
							>
								<Select
									style={{
										width: "100%",
									}}
									allowClear
									options={listRoomTypes.map((roomType) => ({
										label: roomType,
										value: roomType,
									}))}
									placeholder="Tìm kiếm loại phòng"
								/>
							</Form.Item>
						</Col>
						<Col xs={12} md={3}>
							<Form.Item>
								<Button type="primary" htmlType="submit" style={{ marginTop: "30px" }}>
									Tìm phòng <SearchOutlined />
								</Button>
							</Form.Item>
						</Col>
					</Row>
				</Form>

				{isLoading ? (
					<p className="mt-4 text-primary">Đang tìm kiếm phòng....</p>
				) : availableRooms ? (
					<RoomSearchResults results={availableRooms} onClearSearch={handleClearSearch} />
				) : (
					<p className="mt-4">Không tìm thấy phòng phù hợp</p>
				)}
				{errorMessage && <p className="text-danger">{errorMessage}</p>}
			</Container>
		</>
	)
}

export default RoomSearch
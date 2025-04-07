import { Button, Select, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { deleteRemoveServiceFromRoom, getAllServices, getServicesByRoomId, postAddServicesToRoom } from "../utils/services";
import dispatchToast from "../helpers/toast";
import { DeleteOutlined } from "@ant-design/icons";

const ServiceOfRoom = () => {
    const location = useLocation();
    const roomId = location.state?.id;
    const roomName = location.state?.name;
    const [data, setData] = useState([]);
    const [allServices, setAllServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [listSelectedServices, setListSelectedServices] = useState([]);
    console.log('data', data);

    const fetchData = async () => {
        setLoading(true);
        try{
            const res = await getServicesByRoomId(roomId);
            console.log("res", res);
            if (res?.data.success) {
                setData(res?.data?.data.data);
            }
        }catch(e){
            console.log(e);
            dispatchToast("error", "Có lỗi xảy ra khi lấy danh sách dịch vụ của phòng");
        }finally{
            setLoading(false);
        }
    }

    const fetchAllServices = async () => {
        try{
            const res = await getAllServices();
            console.log("res", res);
            if (res?.data.success) {
                setAllServices(res?.data?.data.data);
            }
        }catch(e){
            console.log(e);
        }
    }

    useEffect(() => {
        fetchData();
        fetchAllServices();
    }, []);

    const handleSelectServices = (value) => {
        setListSelectedServices(value);
    }

    const handleAddServices = async () => {
        setLoading(true);
        try{
            const res = await postAddServicesToRoom(roomId, listSelectedServices);
            console.log("res", res);
            if (res?.data.success) {
                dispatchToast("success", "Thêm dịch vụ vào phòng thành công");
                fetchData();
            }else{
                dispatchToast("error", "Thêm dịch vụ vào phòng thất bại");
            }
        }catch(e){
            console.log(e);
            dispatchToast("error", "Có lỗi xảy ra khi thêm dịch vụ vào phòng");
        }finally{
            setLoading(false);
        }
    }

    const handleRemoveService = async (serviceId) => {
        try{
            const res = await deleteRemoveServiceFromRoom(roomId, serviceId);
            console.log("res", res);
            if (res?.data.success) {
                dispatchToast("success", "Xóa dịch vụ khỏi phòng thành công");
                fetchData();
            }else{
                dispatchToast("error", "Xóa dịch vụ khỏi phòng thất bại");
            }
        } catch(e){
            console.log(e);
            dispatchToast("error", "Có lỗi xảy ra khi xóa dịch vụ khỏi phòng");
        }

    }

    const columns = [
        {
            title: "STT",
            dataIndex: "stt",
            key: "stt",
            align: "center",
            width: 10,
            render: (text, record, index) => index + 1,
        },
        {
            title: "Tên dịch vụ",
            dataIndex: "name",
            key: "name",
            width: 200,
            align: "center",
        },
        {
            title: "Xóa khỏi phòng",
            dataIndex: "id",
            key: "id",
            align: "center",
            width: 20,
            render: (record) => {
                return (
                    <Button>
                        <DeleteOutlined
                            style={{
                                color: "red",
                                fontSize: 20,
                            }}
                            onClick={() => handleRemoveService(record)}
                        />
                    </Button>
                )
            }
        }
    ];

    return (
        <div>
            <h2>{`Danh sách dịch vụ của ${roomName}`}</h2>

            <div
                style={{flexDirection: "row", display: "flex"}}
            >
                <Table
                    columns={columns}
                    dataSource={data}
                    bordered
                    style={{
                        width: "40%",
                        alignSelf: "start",
                        margin: 40
                    }}
                    loading={loading}
                    pagination={false}
                />
                <div
                    style={{
                        margin: 40,
                        width: "40%",
                    }}
                >
                    <Tag color="blue">Lựa chọn trong danh sách dưới đây</Tag>                    
                    <Select
                        mode="multiple"
                        allowClear
                        style={{
                            width: "100%",
                            marginTop: "20px",
                        }}
                        options={
                            allServices.map((service) => ({
                                label: service.name,
                                value: service.id,
                            }))
                        }
                        onChange={handleSelectServices}
                    />
                    <Button 
                        onClick={handleAddServices}
                        style={{
                            marginTop: 20,
                        }}
                        type="primary"
                    >
                        Thêm dịch vụ
                    </Button>
                </div>
            </div>
        </div>
    )
};

export default ServiceOfRoom;
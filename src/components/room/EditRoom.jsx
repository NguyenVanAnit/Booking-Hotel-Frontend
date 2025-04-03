import React, { useState } from "react";
import { getRoomById } from "../utils/ApiFunctions";
// import RoomTypeSelector from "../common/RoomTypeSelector";
import {
  Input,
  Form,
  Button,
  Upload,
  Image,
  Row,
  Col,
  InputNumber,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import { updateRoom } from "../utils/ApiFunctions";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const EditRoom = () => {
  const [form] = Form.useForm();
  const location = useLocation();
  const roomId = location.state.id;
  console.log("dada", roomId);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const [data, setData] = useState({});

  const fetchData = async () => {
    try {
      const response = await getRoomById(roomId);
      console.log("room by id", response);
      setData(response);

      form.setFieldsValue({
        roomType: response.roomType,
        roomPrice: response.roomPrice,
        name: response.name,
        photo: response.photo
          ? [
              {
                uid: "-1",
                // name: "room-image.jpg",
                status: "done",
                url: `data:image/jpeg;base64,${response.photo}`,
              },
            ]
          : [],
      });
    } catch (error) {
      console.log(error);
    }
  };

  console.log(data);

  useState(() => {
    if (roomId) {
      fetchData();
    }
  });

  const [imagePreview, setImagePreview] = useState("");

  const handleImageChange = (e) => {
    const selectImage = e.target.files[0];
    setImagePreview(URL.createObjectURL(selectImage));
    console.log(selectImage);
  };

  const handleSubmit = async (values) => {
    // e.preventDefault();
    console.log(values);
    try {
      const success = await updateRoom(roomId, values
      //   {
      //   photo: values.photo[0].originFileObj,
      //   roomType: values.roomType,
      //   roomPrice: values.roomPrice,
      // }
    );
      if (success != undefined) {
        console.log("Room updated successfully");
      } else {
        alert("Failed to add room");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  return (
    <>
      <section>
        <div
          style={{
            width: 600,
            margin: "auto",
            boxShadow: "0 0 10px 0 #ccc",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h2>{roomId ? "Chỉnh sửa chi tiết phòng" : "Thêm phòng"}</h2>

          <Form form={form} onFinish={handleSubmit} layout="vertical">
            <Row gutter={32}>
              <Col span={12}>
                <Form.Item
                  label="Tên phòng"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Tên phòng không được để trống",
                    },
                  ]}
                >
                  <Input type="text" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Loại phòng"
                  name="roomType"
                  rules={[
                    {
                      required: true,
                      message: "Loại phòng không được để trống",
                    },
                  ]}
                >
                  <Input type="text" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={32}>
              <Col span={12}>
                <Form.Item
                  label="Tầng"
                  name="floor"
                  rules={[
                    { required: true, message: "Tầng không được để trống" },
                  ]}
                >
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Giới hạn độ tuổi"
                  name="ageLimit"
                  rules={[
                    {
                      required: true,
                      message: "Giới hạn độ tuổi không được để trống",
                    },
                  ]}
                >
                  <Input type="text" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={32}>
              <Col span={8}>
                <Form.Item
                  label="Số người tối đa"
                  name="maxNumberPeople"
                  rules={[
                    {
                      required: true,
                      message: "Số người tối đa không được để trống",
                    },
                  ]}
                >
                  <InputNumber style={{ width: "100%" }} min={0} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Số người lớn tối đa"
                  name="maxNumberAdult"
                  rules={[
                    {
                      required: true,
                      message: "Số người lớn tối đa không được để trống",
                    },
                  ]}
                >
                  <InputNumber style={{ width: "100%" }} min={0} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Số trẻ em tối đa"
                  name="maxNumberChildren"
                  rules={[
                    {
                      required: true,
                      message: "Số trẻ em tối đa không được để trống",
                    },
                  ]}
                >
                  <InputNumber style={{ width: "100%" }} min={0} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={32}>
              <Col span={12}>
              <Form.Item
              label="Giá phòng"
              name="roomPrice"
              rules={[
                {
                  required: true,
                  message: "Giá phòng không được để trống",
                },
              ]}
            >
              <Input type="number" addonAfter="VND"/>
            </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Số lượng giường"
                  name="numberBed"
                  rules={[
                    {
                      required: true,
                      message: "Số lượng giường không được để trống",
                    },
                  ]}
                >
                  <InputNumber style={{ width: "100%" }} min={0} />
                </Form.Item>
              </Col>
            </Row>
            
            {/* <Form.Item
              name="photo"
              label="Ảnh phòng"
              valuePropName="fileList"
              onChange={handleImageChange}
              rules={[
                {
                  validator: async (_, value) => {
                    const validImageTypes = [
                      "image/jpeg",
                      "image/png",
                      "image/jpg",
                    ];
                    if (!value || value.length == 0) {
                      return Promise.reject("Vui lòng chọn ảnh bài viết");
                    }
                    if (!validImageTypes.includes(value[0]?.type)) {
                      return Promise.reject(
                        "Vui lòng chọn định dạng ảnh png, jpeg, jpg"
                      );
                    }
                    return Promise.resolve();
                  },
                  required: true,
                },
              ]}
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) {
                  return e;
                }
                return e?.fileList;
              }}
            >
              <Upload
                listType="picture-card"
                maxCount={1}
                beforeUpload={() => false} // Để tránh tải lên ngay lập tức
                style={{ width: "200%", height: "200%" }}
                accept="image/png, image/jpeg, image/jpg"
                onPreview={handlePreview}
              >
                {previewImage && (
                  <Image
                    wrapperStyle={{
                      display: "none",
                    }}
                    preview={{
                      visible: previewOpen,
                      onVisibleChange: (visible) => setPreviewOpen(visible),
                      afterOpenChange: (visible) =>
                        !visible && setPreviewImage(""),
                    }}
                    src={previewImage}
                  />
                )}
                <Button>Chọn ảnh</Button>
              </Upload>
            </Form.Item> */}
            <Form.Item>
              <Button type="primary" htmlType="submit">
                {roomId ? "Lưu phòng" : "Thêm phòng"}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </section>
    </>
  );
};

export default EditRoom;

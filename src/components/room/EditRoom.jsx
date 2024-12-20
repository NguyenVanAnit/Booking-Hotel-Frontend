import React, { useState } from "react";
import { getRoomById } from "../utils/ApiFunctions";
// import RoomTypeSelector from "../common/RoomTypeSelector";
import { Input, Form, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import { updateRoom } from "../utils/ApiFunctions";

const EditRoom = () => {
  const [form] = Form.useForm();
  const location = useLocation();
  const roomId = location.state.id;
  console.log(roomId);

  const [data, setData] = useState({});

  const fetchData = async () => {
    try {
      const response = await getRoomById(roomId);
      console.log("room by id", response);
      setData(response);

      form.setFieldsValue({
        roomType: response.roomType,
        roomPrice: response.roomPrice,
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
    fetchData();
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
      const success = await updateRoom(roomId, {
        photo: values.photo[0].originFileObj,
        roomType: values.roomType,
        roomPrice: values.roomPrice,
      });
      if (success != undefined) {
        // alert("Room added successfully");
        console.log("Room updated successfully");
        setImagePreview("");
      } else {
        alert("Failed to add room");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <section>
        <div>
          <h2>Chỉnh sửa chi tiết phòng</h2>

          <Form form={form} onFinish={handleSubmit} layout="vertical">
            <Form.Item
              label="Loại phòng"
              name="roomType"
              rules={[
                { required: true, message: "Loại phòng không được để trống" },
              ]}
            >
              <Input type="text" />
            </Form.Item>
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
              <Input type="number" />
            </Form.Item>
            <Form.Item
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
                // onPreview={handlePreview}
              >
                {/* <UploadOutlined /> */}
                <Button>Chọn ảnh</Button>
              </Upload>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Thêm phòng
              </Button>
            </Form.Item>
          </Form>
        </div>
      </section>
    </>
  );
};

export default EditRoom;

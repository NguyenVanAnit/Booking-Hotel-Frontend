import { useState } from "react";
import { addRoom } from "../utils/ApiFunctions";
// import RoomTypeSelector from "../common/RoomTypeSelector";
import { Input, Form, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const AddRoom = () => {
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
      const success = await addRoom({
        photo: values.photo[0].originFileObj,
        roomType: values.roomType,
        roomPrice: values.roomPrice,
      });
      if (success != undefined) {
        // alert("Room added successfully");
        console.log("Room added successfully");
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
        <div style={{ width: "20%", margin: "auto", boxShadow: "0 0 10px 0 #ccc", padding: "20px", borderRadius: "10px" }}>
          <h2 style={{ marginBottom: "30px" }}>Thêm phòng mới</h2>

          <Form onFinish={handleSubmit} layout="vertical" >
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
                listType="picture"
                maxCount={1}
                beforeUpload={() => false} // Để tránh tải lên ngay lập tức
                style={{ width: "100%", height: "100%" }}
                accept="image/png, image/jpeg, image/jpg"
              >
                <Button><UploadOutlined />Chọn ảnh</Button>
              </Upload>
            </Form.Item>
            <Form.Item style={{ marginTop: "50px" }}>
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

export default AddRoom;

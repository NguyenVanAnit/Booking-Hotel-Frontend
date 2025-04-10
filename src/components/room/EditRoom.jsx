import { useState } from "react";
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
import { useLocation } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import { getRoomById, postAddNewRoom, putUpdateRoom } from "../utils/room";
import dispatchToast from "../helpers/toast";

const EditRoom = () => {
  const [form] = Form.useForm();
  const location = useLocation();
  const roomId = location.state.id;
  const [data, setData] = useState({});

  const fetchData = async () => {
    const response = await getRoomById(roomId);
    setData(response); // vẫn giữ để re-render nếu cần

    const photoList = [];

    for (let i = 1; i <= 5; i++) {
      const photo = response[`photo${i}`];
      if (photo) {
        photoList.push({
          uid: `${i}`,
          name: `photo${i}.jpg`,
          status: "done",
          url: photo,
        });
      }
    }

    form.setFieldsValue({
      ...response,
      photos: photoList,
    });
  };

  useState(() => {
    if (roomId) {
      fetchData();
    }
  });

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async (values) => {
    const files = values.photos || [];

    const base64Images = await Promise.all(
      files.map(async (fileObj) => {
        if (fileObj.originFileObj) {
          return await toBase64(fileObj.originFileObj);
        } else if (fileObj.url) {
          return fileObj.url;
        }
        return null;
      })
    );

    // Tạo object theo đúng 5 trường backend yêu cầu
    const payload = {
      ...values,
      photo1: base64Images[0] || null,
      photo2: base64Images[1] || null,
      photo3: base64Images[2] || null,
      photo4: base64Images[3] || null,
      photo5: base64Images[4] || null,
    };
    console.log("payload", payload);
    if (roomId) {
      try {
        const success = await putUpdateRoom(roomId, payload);
        if (success?.data.success) {
          dispatchToast("success", "Cập nhật phòng thành công");
        } else {
          dispatchToast("error", "Cập nhật phòng thất bại");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const res = await postAddNewRoom(payload);
        if (res?.data.success) {
          dispatchToast("success", "Thêm phòng thành công");
        } else {
          dispatchToast("error", "Thêm phòng thất bại");
        }
      } catch (e) {
        console.log(e);
        dispatchToast("error", "Thêm phòng thất bại");
      }
    }
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

          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            initialValues={data}
          >
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
                  label="Giới hạn độ tuổi nhận phòng"
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
                  <Input type="number" addonAfter="VND" />
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
            <Form.Item name="description" label="Mô tả">
              <TextArea rows={4} placeholder="Nhập mô tả phòng" />
            </Form.Item>

            <Form.Item
              name="photos"
              label="Ảnh phòng"
              valuePropName="fileList"
              getValueFromEvent={(e) => e?.fileList}
              rules={[
                {
                  validator: async (_, value) => {
                    if (!value || value.length === 0) {
                      return Promise.reject("Vui lòng chọn ít nhất 1 ảnh");
                    }
                    if (value.length > 5) {
                      return Promise.reject("Chỉ được chọn tối đa 5 ảnh");
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Upload
                listType="picture-card"
                maxCount={5}
                multiple
                beforeUpload={() => false}
                accept="image/png, image/jpeg, image/jpg"
              >
                <div>+ Thêm ảnh</div>
              </Upload>
            </Form.Item>
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

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { postPaymentConfirm } from "../utils/booking";
import { formatDate, formatVND } from "../helpers/helpers";
import { Button, Divider, Image, Popover } from "antd";
import SuccessIcon from "../../assets/images/success-480.png";
import ErrorIcon from "../../assets/images/no-480.png";
import Barcode from "react-barcode";
import { CopyOutlined } from "@ant-design/icons";
import html2canvas from "html2canvas";

const VNPayReturn = () => {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState({});
  const [open, setOpen] = useState(false);
  const invoiceRef = useRef();

  const fetchData = async (params) => {
    try {
      const res = await postPaymentConfirm(params);
      console.log("res", res?.data?.data);
      if (res?.success) {
        setData(res?.data?.data);
      }
    } catch (err) {
      console.error("Lỗi khi xác nhận thanh toán: ", err);
    }
  };

  console.log('dadadadad', data);

  useEffect(() => {
    const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
    // const vnp_Amount = searchParams.get("vnp_Amount");
    // const vnp_OrderInfo = searchParams.get("vnp_OrderInfo");
    const vnp_TxnRef = searchParams.get("vnp_TxnRef");
    const vnp_SecureHash = searchParams.get("vnp_SecureHash");

    if (vnp_ResponseCode === "00") {
      console.log("✅ Thanh toán thành công 🎉");
      // Gọi API xác nhận đơn nếu cần
      const params = {
        vnp_TxnRef,
        vnp_ResponseCode,
        vnp_SecureHash,
      };
      fetchData(params);
    } else {
      console.log("❌ Thanh toán thất bại hoặc bị huỷ");
    }

    console.log("Toàn bộ params:", Object.fromEntries(searchParams.entries()));
  }, [searchParams]);

  const handleDownloadInvoice = async () => {
    const canvas = await html2canvas(invoiceRef.current);
    const imgData = canvas.toDataURL("image/png");
  
    const link = document.createElement("a");
    link.href = imgData;
    link.download = "hoa-don-thanh-toan-khach-san-an-an.png";
    link.click();
  };

  return (
    <div
      ref={invoiceRef}
      style={{
        width: 550,
        border: "1px solid #ccc",
        padding: 20,
        margin: "30px auto",
        minHeight: 500,
        borderRadius: 16,
      }}
    >
      {(searchParams.get("vnp_ResponseCode") === "00") ? (
        <div style={{ width: "100%", textAlign: "center" }}>
          <Image
            width={200}
            src={SuccessIcon}
            preview={false}
            style={{ margin: "0 auto", display: "block" }}
          />
          <h3>Thanh toán thành công</h3>
          <p>Thời gian đặt đơn: {formatDate(data?.bookingTime)}</p>
        </div>
      ) : (
        <div style={{ width: "100%", textAlign: "center" }}>
          <Image
            width={200}
            src={ErrorIcon}
            preview={false}
            style={{ margin: "0 auto", display: "block" }}
          />
          <h3>Thanh toán thất bại</h3>
        </div>
      )}
      <Divider style={{ width: "100%", border: "2px dashed #DCDCDC " }} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ width: "50%", textAlign: "left" }}>
          <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 5 }}>
            Mã giao dịch
          </p>
          <p style={{ fontSize: 16 }}>{searchParams.get("vnp_TxnRef")}</p>
        </div>
        <div style={{ width: "50%", textAlign: "end" }}>
          <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 5 }}>
            Tổng giao dịch
          </p>
          <p style={{ fontSize: 16 }}>{formatVND(data?.totalPrice) + " VNĐ"}</p>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ width: "50%", textAlign: "left" }}>
          <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 5 }}>
            Phòng
          </p>
          <p style={{ fontSize: 16 }}>{data?.roomName}</p>
        </div>
        <div style={{ width: "50%", textAlign: "end" }}>
          <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 5 }}>
            Người đặt
          </p>
          <p style={{ fontSize: 16 }}>{data?.guestName}</p>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ width: "50%", textAlign: "left" }}>
          <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 5 }}>
            Thời gian nhận/trả phòng
          </p>
          <p style={{ fontSize: 16 }}>{formatDate(data?.checkInDate) + ", " + formatDate(data?.checkOutDate)}</p>
        </div>
        <div style={{ width: "50%", textAlign: "end" }}>
          <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 5 }}>
            Số lượng người
          </p>
          <p style={{ fontSize: 16 }}>{data?.numOfAdults + " người lớn, " + data?.numOfChildren + " trẻ em"}</p>
        </div>
      </div>
      <Divider style={{ width: "100%", border: "2px dashed #DCDCDC " }} />
      {(searchParams.get("vnp_ResponseCode") === "00") ? (
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, textAlign: "left" }}>
            Mã đơn:{" "}
            <span style={{ fontSize: 16, fontWeight: 500 }}>{data?.bookingConfirmationCode}</span>
            <Popover
              open={open}
              onOpenChange={(newOpen) => setOpen(newOpen)}
              content={
                <div style={{ width: 300, textAlign: "center", fontSize: 16, color: "#fff" }}>
                    Mã đơn đã được sao chép vào clipboard
                </div>
              }
              trigger="click"
              placement="topLeft"
              color="#000"
            >
              <Button size="small" type="text" style={{ marginLeft: 10 }}
                onClick={() => {
                  navigator.clipboard.writeText(data?.bookingConfirmationCode);
                }}
                icon={<CopyOutlined />}
              />
            </Popover>
          </div>
          <Barcode
            value={data?.bookingConfirmationCode}
            width={3}
            height={100}
            // format="EAN13"
            displayValue={false}
          />
          <div style={{ marginTop: 20, fontSize: 18 }}>
            Vui lòng bảo mật và xuất trình hóa đơn này khi nhận phòng <Button type="text" style={{color: "blue"}} onClick={handleDownloadInvoice}>Tải hóa đơn</Button>
          </div>
        </div>
      ) : (
        <p style={{ marginTop: 50, fontSize: 18 }}>
          Vui lòng thực hiện lại giao dịch
        </p>
      )}
    </div>
  );
};

export default VNPayReturn;

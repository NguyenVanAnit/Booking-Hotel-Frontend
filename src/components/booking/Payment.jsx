import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { postPaymentConfirm } from "../utils/booking";
import { formatVND } from "../helpers/helpers";

const VNPayReturn = () => {
  const [searchParams] = useSearchParams();

  const fetchData = async (params) => {
    try {
      const res = await postPaymentConfirm(params);
      console.log("res", res);
    } catch (err) {
      console.error("Lỗi khi xác nhận thanh toán: ", err);
    }
  }

  useEffect(() => {
    const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
    const vnp_Amount = searchParams.get("vnp_Amount");
    const vnp_OrderInfo = searchParams.get("vnp_OrderInfo");
    const vnp_TxnRef = searchParams.get("vnp_TxnRef");
    const vnp_SecureHash = searchParams.get("vnp_SecureHash");

    console.log('object', {
      vnp_ResponseCode,
      vnp_Amount: parseInt(vnp_Amount || "0"),
      vnp_OrderInfo,
      vnp_TxnRef,
      vnp_SecureHash,
    });

    if (vnp_ResponseCode === "00") {
      console.log("✅ Thanh toán thành công 🎉");
      // Gọi API xác nhận đơn nếu cần
      const params = {
        vnp_TxnRef,
        vnp_ResponseCode,
        vnp_SecureHash,
        
      }
      fetchData(params);
    } else {
      console.log("❌ Thanh toán thất bại hoặc bị huỷ");
    }

    console.log("Toàn bộ params:", Object.fromEntries(searchParams.entries()));
  }, [searchParams]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Kết quả thanh toán</h1>
      <p>Mã giao dịch: {searchParams.get("vnp_TxnRef")}</p>
      <p>Số tiền: {formatVND(parseInt(searchParams.get("vnp_Amount") || "0") / 100)} VND</p>
      <p>Trạng thái: {searchParams.get("vnp_ResponseCode") === "00" ? "✅ Thành công" : "❌ Thất bại"}</p>
    </div>
  );
};

export default VNPayReturn;

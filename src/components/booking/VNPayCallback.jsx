import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const VNPayCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const vnp_TransactionStatus = searchParams.get("vnp_TransactionStatus");
    const vnp_SecureHash = searchParams.get("vnp_SecureHash");
    const bookingId = searchParams.get("vnp_OrderInfo");

    // Optional: gọi API backend để xác nhận kết quả thanh toán an toàn hơn
    // fetch(`/api/vnpay-confirm?bookingId=${bookingId}&...`)

    if (vnp_TransactionStatus === "00") {
      navigate("/payment-result?status=success");
    } else {
      navigate("/payment-result?status=fail");
    }
  }, []);

  return <div>🔄 Đang xử lý thanh toán...</div>;
};

export default VNPayCallback;
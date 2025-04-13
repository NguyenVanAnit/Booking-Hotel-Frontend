import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "success") {
      // Chờ 2s rồi chuyển sang trang khác
      setTimeout(() => {
        navigate("/booking-detail");
      }, 2000);
    } else if (status === "fail") {
      setTimeout(() => {
        navigate("/payment-failed");
      }, 2000);
    }
  }, [status]);

  return (
    <div style={{ textAlign: "center", paddingTop: 50 }}>
      {status === "success" && <h2>🎉 Thanh toán thành công! Đang chuyển hướng...</h2>}
      {status === "fail" && <h2>😢 Thanh toán thất bại! Đang chuyển về trang thanh toán...</h2>}
      {status === "invalid" && <h2>🚫 Dữ liệu không hợp lệ!</h2>}
    </div>
  );
};

export default PaymentResult;

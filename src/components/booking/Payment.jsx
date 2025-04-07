import { useSearchParams } from "react-router-dom";

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");

  return (
    <div>
      {status === "success" && <h1>🎉 Thanh toán thành công!</h1>}
      {status === "fail" && <h1>❌ Thanh toán thất bại</h1>}
      {status === "invalid" && <h1>⚠️ Dữ liệu không hợp lệ</h1>}
    </div>
  );
};

export default PaymentResult;
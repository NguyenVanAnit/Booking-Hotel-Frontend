import { useEffect, useState } from "react";
import { Modal, Input, Button, Alert } from "antd";

const OtpModal = ({ isModalVisible, onConfirm, onCancel, sendOtpAgain }) => {
  const [otpInput, setOtpInput] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const MAX_RESEND = 1;

  useEffect(() => {
    let timer;
    if (isModalVisible) {
      setCountdown(60);
      setCanResend(false);
      setResendCount(0); // reset lại số lần gửi khi mở modal mới

      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isModalVisible]);

  const handleResend = () => {
    if (resendCount >= MAX_RESEND) return;

    sendOtpAgain(); // gọi API gửi lại OTP
    setResendCount((prev) => prev + 1);
    setCountdown(60);
    setCanResend(false);
  };

  return (
    <Modal
      title="Xác thực OTP"
      open={isModalVisible}
      onOk={() => onConfirm(otpInput)}
      onCancel={onCancel}
      okText="Xác nhận"
      cancelText="Hủy"
    >
      <p>Nhập mã OTP đã được gửi đến email của bạn:</p>
      <Input
        value={otpInput}
        onChange={(e) => setOtpInput(e.target.value)}
        maxLength={6}
        style={{ marginBottom: "10px" }}
      />

      {resendCount < MAX_RESEND ? (
        canResend ? (
          <Button type="link" onClick={handleResend}>
            Gửi lại OTP
          </Button>
        ) : (
          <p style={{ color: "gray" }}>
            Bạn có thể gửi lại OTP sau {countdown}s
          </p>
        )
      ) : (
        <Alert
          message="Bạn đã vượt quá số lần gửi lại OTP."
          type="warning"
          showIcon
        />
      )}
    </Modal>
  );
};

export default OtpModal;

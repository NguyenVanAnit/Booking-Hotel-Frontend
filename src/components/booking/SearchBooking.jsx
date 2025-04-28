import { useState } from "react";
import BarcodeScanner from "react-qr-barcode-scanner";
// import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { getBookingIdByCode } from "../utils/booking";

const SearchBooking = () => {
    const [data, setData] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [bookingId, setBookingId] = useState(null);

    // const navigate = useNavigate();

    const handleDetected = async (result) => {
        setData(result.text);
        setScanned(true); 

        const res = await getBookingIdByCode(result.text);
        if (res?.success) {
            setBookingId(res?.data?.data);
        }
    };

    return (
        <div
            style={{
                maxWidth: "1200px",
                margin: "40px auto",
            }}
        >
            <h4>Quét mã hóa đơn</h4>
            <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "5px", width: 1000, margin: "0 auto" }}>
                {!scanned && ( // 👈 Nếu đã quét thì ẩn Scanner luôn
                    <BarcodeScanner
                        width={500}
                        height={500}
                        onUpdate={(err, result) => {
                            if (result && !scanned) { // 👈 Check chưa quét thì mới xử lý
                                handleDetected(result);
                            }
                        }}
                    />
                )}
                <h5>Mã đặt phòng: {data}</h5>
                {scanned && (
                    <div style={{ textAlign: "center", marginTop: 20 }}>
                        <div style={{ marginBottom: 20, flexDirection: "row", display: "flex", justifyContent: "center", gap: 20 }}>
                            <h4 style={{ color: "green" }}>Đã quét thành công mã đặt phòng!</h4>
                            <Button
                                onClick={() => {
                                    setScanned(false); 
                                    setData(null);
                                    setBookingId(null);
                                }}
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor: "#28a745",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "5px",
                                }}
                            >
                                Quét lại
                            </Button>
                        </div>
                        <Button
                            onClick={() => {
                                window.open(
                                    `/booking-detail?bookingId=${bookingId}`, 
                                    "_blank", 
                                    "noopener,noreferrer"
                                );
                            }}
                            style={{
                                padding: "10px 20px",
                                backgroundColor: "#007BFF",
                                color: "#fff",
                                border: "none",
                                borderRadius: "5px",
                            }}
                        >
                            Chuyển đến trang chi tiết đặt phòng
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchBooking;

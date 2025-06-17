import { useEffect, useState } from "react";
import { getUserByEmail } from "../utils/user";

// Hàm chuyển ID vai trò thành tên
const getRoleName = (roleId) => {
  switch (Number(roleId)) {
    case 1:
      return "Khách hàng";
    case 3:
      return "Quản trị viên";
    case 4:
      return "Bộ phận nhân sự";
    case 5:
      return "Lễ tân";
    default:
      return "Không xác định";
  }
};

const Profile = () => {
  const email = localStorage.getItem("email");
  const [data, setData] = useState(null);

  const fetchUserData = async () => {
    const res = await getUserByEmail(email);
    if (res.success) {
      setData(res.data?.data);
    } else {
      console.error("Failed to fetch user data:", res.message);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🌟 Thông tin cá nhân</h2>

        {!data ? (
          <p style={styles.loading}>Đang tải dữ liệu...</p>
        ) : (
          <div style={styles.info}>
            <InfoRow label="👤 Họ và tên:" value={data.fullName} />
            <InfoRow label="📧 Email:" value={data.email} />
            <InfoRow label="📱 Số điện thoại:" value={data.phoneNumber} />
            <InfoRow
              label="🛡️ Vai trò:"
              value={getRoleName(data.roleId) || "Không xác định"}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Component dòng thông tin
const InfoRow = ({ label, value }) => (
  <div style={styles.row}>
    <span style={styles.label}>{label}</span>
    <span style={styles.value}>{value}</span>
  </div>
);

// CSS-in-JS style
const styles = {
  container: {
    padding: "40px 20px",
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#f2f6fc",
    minHeight: "100vh",
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    padding: "30px",
    width: "100%",
    maxWidth: "500px",
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "24px",
    color: "#3f3f3f",
  },
  loading: {
    textAlign: "center",
    color: "#888",
  },
  info: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px dashed #ccc",
    paddingBottom: "8px",
  },
  label: {
    fontWeight: "bold",
    color: "#555",
  },
  value: {
    color: "#222",
    textAlign: "right",
  },
};

export default Profile;

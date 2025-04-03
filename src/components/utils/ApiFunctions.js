import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:9192",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const addRoom = (params) => {
  const formData = new FormData();
  formData.append("photo", params.photo);
  formData.append("roomType", params.roomType);
  formData.append("roomPrice", params.roomPrice);

  // console.log("photo", photo);
  // console.log("type", roomType);
  // console.log("price", roomPrice);
  const response = api.post("/rooms/add/new-room", formData);
  console.log("add room", response);
  if (response.status === 201) {
    return true;
  } else {
    return false;
  }
};

export const getRoomTypes = async () => {
  try {
    const response = await api.get("/rooms/room/types");
    console.log("room types", response);
    return response.data.data.data;
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching room types");
  }
};

export const getAllRooms = async () => {
  try {
    const response = await api.get("/rooms/all-rooms");
    // console.log("all rooms", response);
    return response.data.data.data;
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching all rooms");
  }
};

export const deleteRoom = async (roomId) => {
  try {
    const response = await api.delete(`/rooms/delete/room/${roomId}`);
    console.log("delete room", response);
    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Error deleting room");
  }
};

export const updateRoom = async (roomId, roomData) => {
  // const formData = new FormData();
  // formData.append("photo", roomData.photo);
  // formData.append("roomType", roomData.roomType);
  // formData.append("roomPrice", roomData.roomPrice);
  console.log('roomdata', roomData);

  try {
    const response = await api.put(`/rooms/update/room/${roomId}`, roomData);
    console.log("update room", response);
    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Error updating room");
  }
};

export const getRoomById = async (roomId) => {
  try {
    const response = await api.get(`/rooms/room/${roomId}`);
    console.log("room by id", response);
    return response.data.data.data;
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching room by id");
  }
};

export const bookRoom = async (roomId, booking) => {
  try {
    const response = await api.post(
      `/bookings/room/${roomId}/booking`,
      booking
    );
    console.log("booked room", response);
    return response;
  } catch (error) {
    if (error.response && error.response.data.data.data) {
      throw new Error(error.response.data.data.data);
    } else {
      throw new Error(`Lỗi khi đặt phòng: ${error.message}`);
    }
  }
};

export const getAllBookings = async () => {
  try {
    const response = await api.get("/bookings/all-bookings", {
      headers: getHeader(),
    });
    console.log("all bookings", response);
    return response.data.data.data;
  } catch (error) {
    if (error.response && error.response.data.data.data) {
      throw new Error(error.response.data.data.data);
    } else {
      throw new Error(`Lỗi khi đặt phòng: ${error.message}`);
    }
  }
};

export const getBookingByConfirmationCode = async (confirmationCode) => {
  try {
    const response = await api.get(
      `/bookings/confirmation/${confirmationCode}`
    );
    console.log("confirmationcode", response);
    return response.data.data.data;
  } catch (error) {
    if (error.response && error.response.data.data.data) {
      throw new Error(error.response.data.data.data);
    } else {
      throw new Error(`Lỗi khi đặt phòng: ${error.message}`);
    }
  }
};

export const cancelBooking = async (bookingId) => {
  try {
    const response = await api.delete(`/bookings/booking/${bookingId}/delete`);
    console.log("cancel booking", response);
    return response.data.data.data;
  } catch (error) {
    if (error.response && error.response.data.data.data) {
      throw new Error(error.response.data.data.data);
    } else {
      throw new Error(`Lỗi khi đặt phòng: ${error.message}`);
    }
  }
};

export async function getAvailableRooms(checkInDate, checkOutDate, roomType) {
  const result = await api.get(
    `rooms/available-rooms?checkInDate=${checkInDate}
		&checkOutDate=${checkOutDate}&roomType=${roomType}`
  );
  console.log(result);
  return result;
}

/* This function register a new user */
export async function registerUser(registration) {
  try {
    const response = await api.post("/auth/register-user", registration);
    return response.data;
  } catch (error) {
    if (error.reeponse && error.response.data.data.data) {
      throw new Error(error.response.data.data.data);
    } else {
      throw new Error(`User registration error : ${error.message}`);
    }
  }
}

/* This function login a registered user */
export async function loginUser(login) {
  try {
    const response = await api.post("/auth/login", login);
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

/*  This is function to get the user profile */
export async function getUserProfile(userId, token) {
  try {
    const response = await api.get(`users/profile/${userId}`, {
      headers: getHeader(),
    });
    return response.data.data.data;
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    throw new Error("Failed to fetch user profile");
  }
}

/* This isthe function to delete a user */
export async function deleteUser(userId) {
  try {
    const response = await api.delete(`/users/delete/${userId}`, {
      headers: getHeader(),
    });
    return response.data.data.data;
  } catch (error) {
    return error.message;
  }
}

/* This is the function to get a single user */
export async function getUser(userId, token) {
  try {
    const response = await api.get(`/users/${userId}`, {
      headers: getHeader(),
    });
    return response.data.data.data;
  } catch (error) {
    console.error("Error fetching user:", error.message);
    throw new Error("Failed to fetch user");
  }
}

/* This is the function to get user bookings by the user id */
export async function getBookingsByUserId(userId, token) {
  try {
    const response = await api.get(`/bookings/user/${userId}/bookings`, {
      headers: getHeader(),
    });
    return response.data.data.data;
  } catch (error) {
    console.error("Error fetching bookings:", error.message);
    throw new Error("Failed to fetch bookings");
  }
}

export const confirmBooking = async (bookingId) => {
  try {
    const response = await api.patch(`/bookings/booking/${bookingId}/accept`, {
      headers: getHeader(),
    });
    return response.data.data.data;
  } catch (error) {
    console.error("Error confirming booking:", error.message);
    throw new Error("Failed to confirm booking");
  }
};

export const rejectBooking = async (bookingId) => {
  try {
    const response = await api.patch(`/bookings/booking/${bookingId}/reject`, {
      headers: getHeader(),
    });
    return response.data.data.data;
  } catch (error) {
    console.error("Error rejecting booking:", error.message);
    throw new Error("Failed to reject booking");
  }
};


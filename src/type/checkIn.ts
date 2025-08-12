import axios from "axios";

// Lấy URL cơ sở API từ biến môi trường
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Tạo một instance Axios để sử dụng chung
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Thêm interceptor để tự động thêm token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("userToken");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const checkIn = async (userId: string) => {
    try {
        // Gửi yêu cầu POST với body là { "id": userId }
        const response = await api.post("/participants/checkin", { id: userId });
        return response.data;
    } catch (error) {
        console.error("Check-in API error:", error);
        throw error;
    }
};


// Định nghĩa kiểu dữ liệu cho Participant nếu bạn chưa có
interface Participant {
    id: string;
    name: string;
    seatNumber: string;
    // ... các trường khác
}

interface StatsResponse {
    checkedInParticipants: Participant[];
}

// Hàm mới để lấy danh sách người đã check-in
export const getCheckedInStats = async (): Promise<StatsResponse> => {
    try {
        const response = await api.get<StatsResponse>("/participants/stats");
        return response.data;
    } catch (error) {
        console.error("Lỗi khi fetch stats:", error);
        throw error;
    }
};
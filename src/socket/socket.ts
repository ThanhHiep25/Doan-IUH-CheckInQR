import { io } from "socket.io-client";

// Lấy URL cơ sở từ biến môi trường
const API_BASE_URL ="http://localhost:5000";

// Tạo một instance Socket.io duy nhất
export const socket = io(API_BASE_URL);

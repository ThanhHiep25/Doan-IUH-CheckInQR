import { io } from "socket.io-client";

// Lấy URL cơ sở từ biến môi trường
const API_BASE_URL = import.meta.env.VITE_API_SOCKET_URL;

// Tạo một instance Socket.io duy nhất
export const socket = io(API_BASE_URL);

import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const login = async (username: string, password: string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, {
            username,
            password,
        });
        return response.data;
    } catch (error) {
        console.error("Login API error:", error);
        throw error;
    }
};
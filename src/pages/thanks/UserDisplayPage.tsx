import React, { useState, useEffect } from "react";
import type { User } from "../../interface/user_its";

const UserDisplayPage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);


    useEffect(() => {
        const handleStorageChange = () => {
            const participantInfo = localStorage.getItem("participantInfo");
            if (participantInfo) {
                try {
                    const parsedUser = JSON.parse(participantInfo);
                    // Giả sử dữ liệu participantInfo khớp với kiểu User
                    setUser(parsedUser);
                } catch (e) {
                    console.error("Lỗi khi phân tích dữ liệu từ localStorage:", e);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };

        // Lắng nghe sự kiện storage để cập nhật tự động khi có thay đổi
        window.addEventListener("storage", handleStorageChange);
        handleStorageChange(); // Lần đầu tiên tải trang
        
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8">
            {user && (
                <div className="mt-12 p-6 bg-gray-800 rounded-xl shadow-2xl text-center max-w-md w-full animate-fade-in">
                    <img src="/logo_doan.png" alt="Logo" className="mx-auto mb-4 w-20 h-20" />
                    <h2 className="text-3xl font-bold text-green-400 mb-2">Chào mừng tham gia đại hội!</h2>
                    <img src={user.avatar} alt=" Avatar" className="mx-auto mb-4 w-60 h-60  border-2 border-green-400" />
                    <p className="text-lg text-gray-200">
                       {user.name}
                    </p>
                    <p className="text-lg text-gray-200">
                        {user.organization}
                    </p>
                    <p className="text-2xl mt-4 font-extrabold text-green-400">
                        Hàng ghế của bạn: {user.seatNumber}
                    </p>
                </div>
            )}
        </div>
    );
};

export default UserDisplayPage;
import React, { useState, useEffect } from "react";
import type { User } from "../../interface/user_its";
import { socket } from "../../socket/socket";

const UserDisplayPage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);

    // Sử dụng useEffect để lắng nghe sự kiện 'welcome' từ server
    useEffect(() => {
        // Lắng nghe sự kiện 'welcome'
        socket.on('welcome', (participant: User) => {
            console.log("Đã nhận sự kiện 'welcome' từ server:", participant);
            setUser(participant);
        });

        // Dọn dẹp listener khi component bị hủy
        return () => {
            socket.off('welcome');
        };
    }, []);

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8">
             <img src="/bg.jpg" alt="bg" className="w-full h-full object-cover absolute top-0 left-0 z-0" />
            {user ? (
                <div className="mt-[-52%] p-4  rounded-xl text-center max-w-xl w-full animate-fade-in z-10">
                    <img src="/logo_dang.png" alt="Logo" className="mx-auto mb-5 w-40 h-30" />
                    <h2 className="text-3xl roboto-6 text-red-600 mb-2">ĐẠI HỘI ĐẠI BIỂU</h2>
                   <h2 className="text-3xl roboto-6 text-red-600 mb-2">ĐẢNG BỘ PHƯỜNG THÔNG TÂY HỘI </h2>
                   <h2 className="text-3xl roboto-6 text-red-600 mb-2">LẦN THỨ I, NHIỆM KỲ 2025 - 2030</h2>
                   <h3 className="text-5xl mt-28 dancing-script text-red-600 my-5">Chào mừng Đại biểu</h3>
                    {user.avatar && (
                        <img src={user.avatar} alt="Avatar" className="mx-auto mb-4 w-50 h-60 object-cover" />
                    )}
                    <p className="text-3xl text-red-500 roboto-6">
                        {user.name}
                    </p>
                    <p className="text-xl text-red-500">
                        {user.organization}
                    </p>
                    {/* <p className="text-2xl mt-4 font-extrabold text-green-400">
                        Hàng ghế của bạn: {user.seatNumber}
                    </p> */}
                </div>
            ):(
                <div className="text-center z-10 p-8 bg-gray-800 rounded-3xl shadow-xl max-w-lg w-full">
                    <h2 className="text-3xl font-bold text-red-500 mb-4">Không tìm thấy người dùng!</h2>
                    <p className="text-lg text-gray-400">Vui liệu kiểm tra lại đường dẫn.</p>
                </div>
            )}
            
        </div>
    );
};

export default UserDisplayPage;
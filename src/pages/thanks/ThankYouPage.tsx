import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import users from "../../data/users.json";
import type { User } from "../../interface/user_its";

// Icon từ thư viện lucide-react (bạn có thể cài đặt nếu chưa có)
// hoặc thay thế bằng SVG của riêng bạn
import { QrCode } from "lucide-react";


const MyQRCodePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        if (id) {
            const foundUser = users.find(u => u.id === (id));
            setUser(foundUser || null);
        }
    }, [id]);

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8 animate-fade-in">
                <div className="text-center p-8 bg-gray-800 rounded-3xl shadow-xl max-w-lg w-full">
                    <h2 className="text-3xl font-bold text-red-500 mb-4">Không tìm thấy người dùng!</h2>
                    <p className="text-lg text-gray-400">Vui lòng kiểm tra lại đường dẫn.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8">
            <div className="text-center p-8 bg-gray-800 rounded-3xl shadow-xl max-w-lg w-full transform transition-all duration-500 ease-in-out scale-95 hover:scale-100">
                <div className="mb-4 flex flex-col items-center">
                    <QrCode size={64} strokeWidth={1.5} className="text-blue-400 animate-pulse-slow" />
                </div>
                
                <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-white">
                    Chào mừng, <span className="text-blue-400">{user.name}</span>!
                </h1>
                
                <p className="text-lg md:text-xl text-gray-400 mb-6">
                    Email của bạn: {user.email}
                </p>

                <div className="p-4 bg-white rounded-2xl inline-block shadow-lg border-4 border-blue-400 animate-scale-in">
                    <QRCodeCanvas
                        level="H"
                        includeMargin={false}
                        value={user.id}
                        size={256}
                    />
                </div>
                
                <p className="mt-8 text-md md:text-lg font-semibold text-gray-300">
                    Đây là mã QR của bạn.
                </p>
                <p className="text-sm md:text-md text-gray-500 mt-2">
                    Vui lòng đưa mã này cho ban tổ chức để check-in.
                </p>
            </div>
        </div>
    );
};

export default MyQRCodePage;
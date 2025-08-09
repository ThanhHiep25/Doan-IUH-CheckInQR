import React, { useState, useEffect, useMemo } from "react";
import type { User } from "../../interface/user_its";

const SeatDisplayPage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [checkedInSeats, setCheckedInSeats] = useState<string[]>([]);

    useEffect(() => {
        const handleStorageChange = () => {
            const participantInfo = localStorage.getItem("participantInfo");
            if (participantInfo) {
                try {
                    const parsedUser = JSON.parse(participantInfo);
                    setUser(parsedUser);
                } catch (e) {
                    console.error("Lỗi khi phân tích dữ liệu từ localStorage:", e);
                    setUser(null);
                }
            } else {
                setUser(null);
            }

            const checkedInSeatsData = localStorage.getItem("checkedInSeats");
            if (checkedInSeatsData) {
                try {
                    const parsedSeats = JSON.parse(checkedInSeatsData) as string[];
                    setCheckedInSeats(parsedSeats);
                } catch (e) {
                    console.error("Lỗi khi phân tích danh sách ghế đã check-in:", e);
                    setCheckedInSeats([]);
                }
            } else {
                setCheckedInSeats([]);
            }
        };

        window.addEventListener("storage", handleStorageChange);
        handleStorageChange();

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    const getSeatColor = (seatNumber: string) => {
        if (user && user.seatNumber === seatNumber) {
            return "bg-green-500 text-white scale-110 shadow-lg ring-4 ring-green-400";
        }
        if (checkedInSeats.includes(seatNumber)) {
            return "bg-blue-500 text-white";
        }
        return "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white";
    };

    // Tạo các mảng ghế cho từng khu vực
    // Tạo một hàm tạo mảng ghế có thể đảo ngược
    const createSeats = (start: number, end: number, reverse = false) => {
        const seatsArray = [];
        const min = Math.min(start, end);
        const max = Math.max(start, end);

        for (let i = min; i <= max; i++) {
            seatsArray.push(i.toString());
        }

        // Đảo ngược mảng nếu reverse là true
        return reverse ? seatsArray.reverse() : seatsArray;
    };

    // Hàm tạo số thứ tự các dãy
    const createSeatNumbers = (start: number, end: number) => {
        const numbers = [];
        for (let i = start; i <= end; i++) {
            numbers.push(i);
        }
        return numbers
    }

    const seats = useMemo(() => ({
        lanhDaoKhachMoi: {
            left: [
                ...createSeats(192, 187, true),
                ...createSeats(193, 198),
                ...createSeats(204, 199, true),
                ...createSeats(205, 210),
                ...createSeats(216, 211, true),
            ].map(String),
            backrow: [
                ...createSeats(217, 222),
                ...createSeats(232, 227, true),
                ...createSeats(233, 238),
                ...createSeats(244, 239, true),
                ...createSeats(245, 250),
            ].map(String),
        },
        lanhDaoKhachMoi2: {
            left: [
                ...createSeats(132, 127, true),
                ...createSeats(133, 138),
                ...createSeats(144, 139, true),
                ...createSeats(145, 150),
                ...createSeats(156, 151, true),
            ].map(String),

            backrow: [
                ...createSeats(157, 162),
                ...createSeats(168, 163, true),
                ...createSeats(169, 174),
                ...createSeats(180, 175, true),
                ...createSeats(181, 186),
            ].map(String),
        },
        lanhDaoKhachMoi3: {
            left: [
                ...createSeats(72, 67, true),
                ...createSeats(73, 78),
                ...createSeats(84, 79, true),
                ...createSeats(85, 90),
                ...createSeats(96, 91, true),
            ].map(String),

            backrow: [
                ...createSeats(97, 102),
                ...createSeats(108, 103, true),
                ...createSeats(109, 114),
                ...createSeats(120, 115, true),
                ...createSeats(121, 126),
            ].map(String),
        },
        btttcdbBCH: {
            left: [
                ...createSeats(6, 1, true),
                ...createSeats(7, 12),
                ...createSeats(18, 13, true),
                ...createSeats(19, 24),
                ...createSeats(30, 25, true),
            ].map(String),

            backrow: [
                ...createSeats(31, 36),
                ...createSeats(42, 37, true),
                ...createSeats(43, 48),
                ...createSeats(54, 49, true),
                ...createSeats(55, 60),
                ...createSeats(66, 61, true),
            ].map(String),
        },

        thuky: {
            left: [
                ...createSeats(251, 260),
            ].map(String),
        }

    }), []);

    const renderSeatBlock = (title: string, seatNumbers: string[]) => (
        <div className="flex flex-col items-center">
            <h3 className="text-[14px] font-bold text-gray-300 mb-2">{title}</h3>
            <div className="w-full h-10 bg-yellow-200 rounded-2xl"></div>

            <div className="grid grid-cols-6 gap-1.5 p-2 mt-5 bg-gray-800 rounded-lg">
                {seatNumbers.map(seatNumber => (
                    <div
                        key={seatNumber}
                        className={`flex items-center justify-center p-2 rounded-md font-bold text-sm transition-all duration-300 ease-in-out w-10 h-10 ${getSeatColor(seatNumber)}`}
                    >
                        {seatNumber}
                    </div>
                ))}
            </div>


        </div>
    );

    const renderSeatBlockBackRow = (title: string, seatNumbers: string[]) => (
        <div className="flex flex-col items-center">
            <h3 className="text-[14px] font-bold text-gray-300 mb-2">{title}</h3>
            <div className="grid grid-cols-6 gap-1.5 p-2 bg-gray-800 rounded-lg">
                {seatNumbers.map(seatNumber => (
                    <div
                        key={seatNumber}
                        className={`flex items-center justify-center p-2 rounded-md font-bold text-sm transition-all duration-300 ease-in-out w-10 h-10 ${getSeatColor(seatNumber)}`}
                    >
                        {seatNumber}
                    </div>
                ))}
            </div>
        </div>
    );

    const renderSeatBlockUltra = (title: string, seatNumbers: string[]) => (
        <div className="flex flex-col items-center">
            <h3 className="text-[14px] font-bold text-gray-300 mb-2">{title}</h3>
            <div className="grid grid-cols-10 gap-1.5 p-2 bg-yellow-400 text-red-500 rounded-lg">
                {seatNumbers.map(seatNumber => (
                    <div
                        key={seatNumber}
                        className={`flex items-center justify-center p-2 rounded-md font-bold text-sm transition-all duration-300 ease-in-out w-10 h-10 ${getSeatColor(seatNumber)}`}
                    >
                        {seatNumber}
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8">
            <div className="absolute top-[36%] left-30 md:grid hidden grid-cols-1 gap-1 p-1 bg-gray-800 rounded-lg">
                {...createSeatNumbers(1, 6).map(seatNumber => (
                    <div
                        key={seatNumber}
                        className={`flex items-center justify-center p-1 rounded-md font-bold text-sm bg-blue-500 text-white transition-all duration-300 ease-in-out w-30 h-10 `}
                    >
                        Hàng ghế {seatNumber}
                    </div>
                ))
                }
            </div>

              <div className="absolute top-[63%] left-30 md:grid hidden grid-cols-1 gap-1 p-1 bg-gray-800 rounded-lg">
                {...createSeatNumbers(7, 12).map(seatNumber => (
                    <div
                        key={seatNumber}
                        className={`flex items-center justify-center p-1 bg-blue-500 text-white rounded-md font-bold text-sm transition-all duration-300 ease-in-out w-30 h-10 `}
                    >
                        Hàng ghế {seatNumber}
                    </div>
                ))
                }
            </div>

            <div className="relative w-full max-w-7xl mx-auto flex flex-col items-center space-y-8">
                {/* Khu vực sân khấu và Đoàn chủ tịch */}
                <div className="bg-red-900 p-4 rounded-lg shadow-xl w-full text-center">
                    <h2 className="text-2xl font-bold mb-2">Sơ đồ sân khấu</h2>
                    <div className="flex justify-center flex-wrap gap-2">
                        <img src="/banner-sankhau.jpg" alt="Đoàn Chủ tịch" className="w-full h-60" />
                    </div>
                </div>

                {/* Khu vực Ban thư ký và Đại biểu */}
                <div className="flex flex-col md:flex-row justify-center w-full space-y-4 md:space-y-0 md:space-x-8">
                    <div className="flex-1 space-y-10">
                        {renderSeatBlock("LÃNH ĐẠO - KHÁCH MỜI 1", seats.lanhDaoKhachMoi.left)}
                        {renderSeatBlockBackRow(" ", seats.lanhDaoKhachMoi.backrow)}
                    </div>


                    {/* Khu vực Đại biểu */}
                    <div className="flex-1 space-y-10">
                        {renderSeatBlock("LÃNH ĐẠO - KHÁCH MỜI 2", seats.lanhDaoKhachMoi2.left)}
                        {renderSeatBlockBackRow(" ", seats.lanhDaoKhachMoi2.backrow)}

                    </div>
                    <div className="flex-1 space-y-10">
                        {renderSeatBlock("LÃNH ĐẠO - KHÁCH MỜI 3", seats.lanhDaoKhachMoi3.left)}
                        {renderSeatBlockBackRow(" ", seats.lanhDaoKhachMoi3.backrow)}
                    </div>

                    <div className="flex-1 space-y-10">
                        {renderSeatBlock("BAN THẨM TRA TƯ CÁCH ĐẠI BIỂU - BCH ", seats.btttcdbBCH.left)}
                        {renderSeatBlockBackRow(" ", seats.btttcdbBCH.backrow)}
                    </div>
                </div>

                <div className="w-full flex justify-center items-center">
                    {renderSeatBlockUltra("GHẾ CHỜ ĐOÀN CHỦ TỊCH - ĐOÀN THƯ KÝ", seats.thuky.left)}
                </div>


            </div>

            {/* {user && (
                <div className="mt-12 p-6 bg-gray-800 rounded-xl shadow-2xl text-center max-w-md w-full animate-fade-in">
                    <h2 className="text-3xl font-bold text-green-400 mb-2">Check-in thành công!</h2>
                    <p className="text-lg text-gray-200">
                        <span className="font-semibold">Tên:</span> {user.name}
                    </p>
                    <p className="text-lg text-gray-200">
                        <span className="font-semibold">Tổ chức:</span> {user.organization}
                    </p>
                    <p className="text-2xl mt-4 font-extrabold text-green-400">
                        Hàng ghế của bạn: {user.seatNumber}
                    </p>
                </div>
            )} */}
        </div>
    );
};

export default SeatDisplayPage;
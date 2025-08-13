// src/components/SeatDisplayPage.tsx

import React, { useState, useEffect, useMemo } from "react";
import type { User } from "../../interface/user_its";
import { getCheckedInStats } from "../../type/checkIn";
import { socket } from "../../socket/socket";

const SeatDisplayPage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [checkedInSeats, setCheckedInSeats] = useState<string[]>([]);

    // Hàm fetch dữ liệu và cập nhật trạng thái
    const fetchStats = async () => {
        try {
            const data = await getCheckedInStats();
            if (data.checkedInParticipants) {
                const seats = data.checkedInParticipants
                    .filter((p: User) => p.seatNumber)
                    .map((p: User) => p.seatNumber);
                setCheckedInSeats(seats);
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu thống kê:", error);
        }
    };

    // Hook useEffect: Lấy dữ liệu ban đầu và lắng nghe sự kiện Socket.io
    useEffect(() => {
        fetchStats(); // Lấy dữ liệu ban đầu khi component mount

        const handleWelcome = (participant: User) => {
            console.log("Đã nhận sự kiện 'welcome' từ server:", participant);
            setUser(participant);
            if (participant.seatNumber) {
                setCheckedInSeats(prevSeats => [...new Set([...prevSeats, participant.seatNumber])]);
            }
            // Ẩn thông tin người dùng sau 10 giây
            setTimeout(() => {
                setUser(null);
            }, 10000);
        };

        const handleStatsUpdate = () => {
            console.log("Đã nhận sự kiện 'stats-update'. Đang cập nhật danh sách ghế.");
            fetchStats(); // Gọi lại hàm fetch để cập nhật toàn bộ danh sách
        };

        socket.on('welcome', handleWelcome);
        socket.on('stats-update', handleStatsUpdate);

        return () => {
            // Dọn dẹp các listeners khi component bị hủy
            socket.off('welcome', handleWelcome);
            socket.off('stats-update', handleStatsUpdate);
        };
    }, []); // Mảng rỗng đảm bảo hook chỉ chạy một lần

    const getSeatColor = (seatNumber: string): string => {
        if (user && user.seatNumber === seatNumber) {
            return "bg-green-500 text-white scale-110 shadow-lg ring-4 ring-green-400 animate-pulse";
        }
        if (checkedInSeats.includes(seatNumber)) {
            return "bg-blue-500 text-white";
        }
        return "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white";
    };

    const createSeats = (start: number, end: number, reverse = false): string[] => {
        const seatsArray: string[] = [];
        const min = Math.min(start, end);
        const max = Math.max(start, end);
        for (let i = min; i <= max; i++) {
            seatsArray.push(i.toString());
        }
        return reverse ? seatsArray.reverse() : seatsArray;
    };

    const seats = useMemo(() => ({
        lanhDaoKhachMoi: {
            left: [
                '223', '239', '240', '222', '218', '233',
                '181', '182', '183', '184', '185', '186',
                '192', '191', '190', '189', '188', '187',
                '193', '194', '195', '196', '197', '198',
                '204', '203', '202', '201', '200', '199',
                '205', '206', '207', '208', '209', '236',
            ],
            backrow: [
                '216', '215', '214', '213', '212', '210',
                '221', '224', '225', '226', '227', '228',
                '238', '237', '234', '232', '230', '229',
                '242', '243', '244', '245', '246', '247',
                ' ', ' ', ' ', ' ', '249', '248',
            ]
        },
        lanhDaoKhachMoi2: {
            left: createSeats(121, 126).concat(
                createSeats(132, 127, true),
                createSeats(133, 138),
                createSeats(144, 139, true),
                createSeats(145, 150)),
            backrow: createSeats(156, 151, true).concat(
                createSeats(157, 162),
                createSeats(168, 163, true),
                createSeats(169, 174),
                createSeats(180, 175, true))
        },
        lanhDaoKhachMoi3: {
            left: createSeats(66, 61, true).concat(
                createSeats(72, 67),
                createSeats(78, 73, true),
                createSeats(79, 84),
                createSeats(85, 90, true),
            ),
            backrow: createSeats(91, 96).concat(
                createSeats(102, 97, true),
                createSeats(103, 108),
                createSeats(114, 109, true),
                createSeats(115, 120)),
        },
        btttcdbBCH: {
            left: createSeats(6, 1, true).concat(createSeats(7, 12),
                createSeats(18, 13, true),
                createSeats(19, 24),
                createSeats(30, 25, true)),
            backrow: createSeats(31, 36).concat(createSeats(42, 37, true),
                createSeats(43, 48),
                createSeats(54, 49, true),
                createSeats(55, 60),
            ),
        },
        thuky: {
            left: [
                '217', '219', '211', '231', '235', '', '220', '241'
            ],
        }
    }), []);

    const renderSeatBlock = (title: string, seatNumbers: string[], showStage = false) => (
        <div className="flex flex-col items-center">
            {title && <h3 className="text-[14px] text-blue-600 font-extrabold mb-2">{title}</h3>}
            {showStage && <div className="w-full h-10 mb-[-10px] bg-yellow-200 rounded-2xl"></div>}
            <div className={`grid grid-cols-6 gap-1.5 p-2 mt-5 bg-gray-800/10 backdrop-blur-md rounded-lg`}>
                {seatNumbers.map(seatNumber => (
                    <div
                        key={seatNumber}
                        className={`flex items-center justify-center p-2 rounded-md font-bold text-sm transition-all duration-300 ease-in-out w-10 h-10 mb-2 ${getSeatColor(seatNumber)}`}
                    >
                        {seatNumber}
                    </div>
                ))}
            </div>
        </div>
    );
    const createSeatNumbers = (start: number, end: number): number[] => {
        const numbers: number[] = [];
        for (let i = start; i <= end; i++) {
            numbers.push(i);
        }
        return numbers
    }

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8">
            <img src="/bg.jpg" alt="bg" className="w-full h-full object-cover absolute top-0 left-0 z-0" />

            <div className="absolute top-[33%] left-30 md:grid hidden grid-cols-1 gap-1 p-1 bg-gray-800/10 backdrop-blur-md rounded-lg">
                {createSeatNumbers(1, 6).map(seatNumber => (
                    <div
                        key={seatNumber}
                        className={`flex items-center mb-3 justify-center p-1 rounded-md font-bold text-sm bg-blue-500 text-white transition-all duration-300 ease-in-out w-30 h-10 `}
                    >
                        Hàng ghế {seatNumber}
                    </div>
                ))}
            </div>

            <div className="absolute top-[64%] left-30 md:grid hidden grid-cols-1 gap-1 p-1 bg-gray-800/10 backdrop-blur-md rounded-lg">
                {createSeatNumbers(7, 12).map(seatNumber => (
                    <div
                        key={seatNumber}
                        className={`flex items-center mb-3 justify-center p-1 bg-blue-500 text-white rounded-md font-bold text-sm transition-all duration-300 ease-in-out w-30 h-10 `}
                    >
                        Hàng ghế {seatNumber}
                    </div>
                ))}
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
                    <div className="flex-1 space-y-[10px] ">
                        {renderSeatBlock("", seats.lanhDaoKhachMoi.left)}
                        {renderSeatBlock(" ", seats.lanhDaoKhachMoi.backrow)}
                    </div>
                    <div className="flex-1 space-y-2">
                        {renderSeatBlock("LÃNH ĐẠO - KHÁCH MỜI", seats.lanhDaoKhachMoi2.left, true)}
                        {renderSeatBlock(" ", seats.lanhDaoKhachMoi2.backrow)}
                    </div>
                    <div className="flex-1 space-y-2">
                        {renderSeatBlock("LÃNH ĐẠO - KHÁCH MỜI", seats.lanhDaoKhachMoi3.left, true)}
                        {renderSeatBlock(" ", seats.lanhDaoKhachMoi3.backrow)}
                    </div>
                    <div className="flex-1 space-y-2">
                        {renderSeatBlock("BAN THẨM TRA TƯ CÁCH ĐẠI BIỂU - BCH ", seats.btttcdbBCH.left, true)}
                        {renderSeatBlock(" ", seats.btttcdbBCH.backrow)}
                    </div>
                </div>

                <div className="w-full flex justify-center items-center">
                    <div className="flex flex-col items-center">
                        <h3 className="text-[14px] font-bold text-red-500 mb-2">GHẾ CHỜ ĐOÀN CHỦ TỊCH - ĐOÀN THƯ KÝ</h3>
                        <div className="grid grid-cols-8 gap-1.5 p-2 bg-yellow-400 text-red-500 rounded-lg">
                            {seats.thuky.left.map(seatNumber => (
                                <div
                                    key={seatNumber}
                                    className={`flex items-center justify-center p-2 rounded-md font-bold text-sm transition-all duration-300 ease-in-out w-10 h-10 ${getSeatColor(seatNumber)}`}
                                >
                                    {seatNumber}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default SeatDisplayPage;
// src/components/QRCodeScanner.tsx

import React, { useRef, useState, useEffect } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { QrCode, CheckCircle, XCircle } from "lucide-react";
import { checkIn } from "../../type/checkIn";
import type { User } from "../../interface/user_its";
import { socket } from "../../socket/socket";

const QRCodeScanner: React.FC = () => {
    const [isScanning, setIsScanning] = useState(false);
    const [scanResult, setScanResult] = useState<"success" | "invalid" | "error" | "already-checked-in" | null>(null);
    const [scannedId, setScannedId] = useState<string | null>(null);
    const [participantInfo, setParticipantInfo] = useState<User | null>(null);
    const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
    const [scanKey, setScanKey] = useState(0);

    // useEffect này chỉ để lắng nghe các sự kiện từ socket và chạy một lần
    useEffect(() => {
        const handleWelcome = (data: User) => {
            console.log("Sự kiện 'welcome' đã nhận được:", data);
            setParticipantInfo(data);
            setScanResult("success");
            // Tự động quét lại sau 5 giây
            setTimeout(handleScanAgain, 5000);
            console.log('====================================');
            console.log(scannedId);
            console.log('====================================');
        };
        
        const handleStatsUpdate = () => {
            console.log("Sự kiện 'stats-update' đã nhận được. Cập nhật thống kê.");
            // Logic để cập nhật thống kê có thể được đặt ở đây
        };

        socket.on('welcome', handleWelcome);
        socket.on('stats-update', handleStatsUpdate);

        return () => {
            socket.off('welcome', handleWelcome);
            socket.off('stats-update', handleStatsUpdate);
        };
    }, []); // Mảng rỗng đảm bảo hook chỉ chạy một lần

    const stopScanner = async () => {
        if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
            try {
                await html5QrCodeRef.current.stop();
                console.log("Scanner đã dừng thành công.");
            } catch (err) {
                console.error("Lỗi khi dừng scanner:", err);
            } finally {
                html5QrCodeRef.current = null;
            }
        }
    };

    const startScanner = async () => {
        const config = {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        };

        if (!html5QrCodeRef.current) {
            html5QrCodeRef.current = new Html5Qrcode("qr-reader", true);
        }

        try {
            await html5QrCodeRef.current.start(
                { facingMode: "environment" },
                config,
                async (qrCodeMessage) => {
                    await stopScanner();

                    const match = qrCodeMessage.match(/^P(\d{3})$/);

                    if (match && match[0]) {
                        const userId = match[0];
                        setScannedId(userId);
                        try {
                            // Gửi yêu cầu check-in đến backend
                            await checkIn(userId);
                            // Sau khi check-in thành công, không cần setScanResult ở đây.
                            // Chúng ta sẽ đợi sự kiện 'welcome' từ server.
                        } catch (error) {
                            if (error instanceof Error && error.message.includes("Already checked in")) {
                                setScanResult("already-checked-in");
                                console.log("Người dùng đã check-in trước đó.");
                                setTimeout(handleScanAgain, 5000);
                            } else {
                                setScanResult("error");
                                console.error("Lỗi khi check-in:", error);
                                setTimeout(handleScanAgain, 5000);
                            }
                        }
                    } else {
                        setScanResult("invalid");
                        console.error("Mã QR không hợp lệ:", qrCodeMessage);
                        setTimeout(handleScanAgain, 3000);
                    }
                },
                (errorMessage) => {
                    if (!errorMessage.includes("NotFoundException")) {
                        console.error("Lỗi quét QR:", errorMessage);
                    }
                }
            );
        } catch (err) {
            console.error("Lỗi khi khởi động camera:", err);
            await stopScanner();
        }
    };

    // useEffect này để khởi động và dừng scanner dựa trên trạng thái `isScanning`
    useEffect(() => {
        if (isScanning) {
            startScanner();
        } else {
            stopScanner();
        }
        return () => {
            stopScanner();
        };
    }, [isScanning, scanKey]);

    const handleStartScanning = () => {
        setScannedId(null);
        setScanResult(null);
        setParticipantInfo(null);
        setIsScanning(true);
        setScanKey(prevKey => prevKey + 1);
    };

    const handleStopScanning = () => {
        setIsScanning(false);
    };

    const handleScanAgain = () => {
        handleStartScanning();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8 animate-fade-in">
            {/* Trạng thái ban đầu */}
            {!isScanning && !scanResult && (
                <div className="flex flex-col items-center justify-center p-8 bg-gray-800 rounded-3xl shadow-xl max-w-sm w-full text-center transform transition-all duration-500 ease-in-out scale-100 hover:scale-105">
                    <div className="mb-6">
                        <QrCode size={96} strokeWidth={1} className="text-blue-400 animate-pulse-slow" />
                    </div>
                    <h2 className="text-3xl font-extrabold mb-2 text-blue-400">Sẵn sàng để check-in?</h2>
                    <p className="mb-6 text-gray-400">
                        Bấm nút bên dưới để mở camera và bắt đầu quét.
                    </p>
                    <button
                        onClick={handleStartScanning}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Bắt đầu quét QR
                    </button>
                </div>
            )}

            {/* Trạng thái đang quét */}
            {isScanning && (
                <div className="flex flex-col items-center justify-center p-8 bg-gray-800 rounded-3xl shadow-xl max-w-sm w-full text-center">
                    <h2 className="text-2xl font-bold mb-4 text-gray-300">Đưa mã QR vào camera</h2>
                    <div id="qr-reader" className="w-full max-w-[300px] mb-6" />
                    <button
                        onClick={handleStopScanning}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50"
                    >
                        Tắt camera
                    </button>
                </div>
            )}

            {/* Trạng thái quét thành công và check-in thành công */}
            {scanResult === "success" && participantInfo && (
                <div className="mt-10 flex flex-col items-center justify-center p-8 bg-gray-800 rounded-3xl shadow-xl max-w-sm w-full text-center animate-scale-in">
                    <CheckCircle size={64} strokeWidth={2} className="text-green-500" />
                    <h2 className="text-3xl font-extrabold my-4 text-green-400">Check-in thành công!</h2>
                    {participantInfo.avatar && (
                        <img
                            src={participantInfo.avatar}
                            alt="Avatar"
                            className="w-40 h-40 rounded-md mx-auto mb-4 border-2 border-green-500"
                        />
                    )}
                    <p className="text-2xl font-bold text-gray-100 mb-2">{participantInfo.name}</p>
                    <p className="text-xl text-gray-300 mb-2">Tổ chức: {participantInfo.organization}</p>
                    <p className="text-lg font-semibold text-gray-300 mb-6">Số ghế: {participantInfo.seatNumber}</p>
                    <button
                        onClick={handleScanAgain}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
                    >
                        Quét tiếp
                    </button>
                </div>
            )}

            {/* Trạng thái mã QR không hợp lệ */}
            {scanResult === "invalid" && (
                <div className="flex flex-col items-center justify-center p-8 bg-gray-800 rounded-3xl shadow-xl max-w-sm w-full text-center animate-shake">
                    <XCircle size={64} strokeWidth={2} className="text-red-500" />
                    <h2 className="text-3xl font-extrabold my-4 text-red-400">Mã QR không hợp lệ!</h2>
                    <p className="text-xl mb-6 text-gray-300">
                        Vui lòng thử lại với mã QR khác.
                    </p>
                    <button
                        onClick={handleScanAgain}
                        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:ring-opacity-50"
                    >
                        Quét lại
                    </button>
                </div>
            )}

            {/* Trạng thái lỗi check-in */}
            {(scanResult === "error" || scanResult === "already-checked-in") && (
                <div className="flex flex-col items-center justify-center p-8 bg-gray-800 rounded-3xl shadow-xl max-w-sm w-full text-center animate-shake">
                    <XCircle size={64} strokeWidth={2} className="text-red-500" />
                    <h2 className="text-3xl font-extrabold my-4 text-red-400">{scanResult === "already-checked-in" ? "Đã check-in trước đó!" : "Lỗi check-in!"}</h2>
                    <p className="text-xl mb-6 text-gray-300">
                        {scanResult === "already-checked-in" ? "Người dùng này đã được check-in." : "Hiện tại không thể check-in. Vui lòng thử lại."}
                    </p>
                    <button
                        onClick={handleScanAgain}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50"
                    >
                        Quét lại
                    </button>
                </div>
            )}
        </div>
    );
};

export default QRCodeScanner;
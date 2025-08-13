// import React, { useRef, useState, useEffect } from "react";
// import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
// import { QrCode, CheckCircle, XCircle } from "lucide-react";
// import { checkIn } from "../../type/checkIn";
// import type { User } from "../../interface/user_its";

// const QRCodeScanner: React.FC = () => {
//     const [isScanning, setIsScanning] = useState(false);
//     const [scanResult, setScanResult] = useState<"success" | "invalid" | "error" | null>(null);
//     const [scannedId, setScannedId] = useState<string | null>(null);
//     const [participantInfo, setParticipantInfo] = useState<User | null>(null);
//     const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
//     const [scanKey, setScanKey] = useState(0);

//     // Hàm để khởi động scanner
//     const startScanner = async () => {
//         const config = {
//             fps: 10,
//             qrbox: { width: 250, height: 250 },
//             formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
//         };

//         if (!html5QrCodeRef.current) {
//             html5QrCodeRef.current = new Html5Qrcode("qr-reader", true);
//         }

//         try {
//             await html5QrCodeRef.current.start(
//                 { facingMode: "environment" },
//                 config,
//                 async (qrCodeMessage) => {
//                     await stopScanner();
                    
//                     const match = qrCodeMessage.match(/^P(\d{3})$/);
                    
//                     if (match && match[0]) {
//                         const userId = match[0];
//                         setScannedId(userId);
//                         try {
//                             const response = await checkIn(userId);
//                             setScanResult("success");
//                             setParticipantInfo(response.participant);
                            
//                             // Lấy danh sách ghế đã check-in từ localStorage
//                             const existingSeats = JSON.parse(localStorage.getItem('checkedInSeats') || '[]') as string[];
//                             // Thêm ghế mới vào danh sách nếu chưa tồn tại
//                             if (!existingSeats.includes(response.participant.seatNumber)) {
//                                 existingSeats.push(response.participant.seatNumber);
//                             }
//                             // Lưu lại danh sách đã cập nhật
//                             localStorage.setItem('checkedInSeats', JSON.stringify(existingSeats));
//                             // Lưu thông tin người vừa check-in
//                             localStorage.setItem('participantInfo', JSON.stringify(response.participant));

//                             console.log(`Check-in thành công cho người dùng ID: ${userId}`);
//                         } catch (error) {
//                             setScanResult("error");
//                             console.error("Lỗi khi check-in:", error);
//                         }
//                     } else {
//                         setScanResult("invalid");
//                         console.error("Mã QR không hợp lệ:", qrCodeMessage);
//                     }
//                 },
//                 (errorMessage) => {
//                     if (!errorMessage.includes("NotFoundException")) {
//                         console.error("Lỗi quét QR:", errorMessage);
//                     }
//                 }
//             );
//         } catch (err) {
//             console.error("Lỗi khi khởi động camera:", err);
//             stopScanner();
//         }
//     };

//     // Hàm để dừng scanner
//     const stopScanner = async () => {
//         if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
//             try {
//                 await html5QrCodeRef.current.stop();
//                 console.log("Scanner đã dừng thành công.");
//             } catch (err) {
//                 console.error("Lỗi khi dừng scanner:", err);
//             } finally {
//                 html5QrCodeRef.current = null;
//             }
//         }
//     };

//     // Sử dụng useEffect để theo dõi isScanning và scanKey
//     useEffect(() => {
//         if (isScanning) {
//             startScanner();
//         } else {
//             stopScanner();
//         }
//         return () => {
//             stopScanner();
//         };
//     }, [isScanning, scanKey]);

//     // Hàm bắt đầu quét
//     const handleStartScanning = () => {
//         if (scannedId) localStorage.setItem("scannedUserId", scannedId);
//         // Xóa thông tin người dùng vừa check-in để UserDisplayPage reset
//         localStorage.removeItem('participantInfo'); 
//         setScannedId(null);
//         setScanResult(null);
//         setParticipantInfo(null);
//         setIsScanning(true);
//         setScanKey(prevKey => prevKey + 1);
//     };

//     // Hàm dừng quét
//     const handleStopScanning = () => {
//         setIsScanning(false);
//     };

//     // Hàm xử lý việc quét lại
//     const handleScanAgain = () => {
//         handleStartScanning();
//     };

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8 animate-fade-in">
//             {/* Trạng thái ban đầu */}
//             {!isScanning && !scanResult && (
//                 <div className="flex flex-col items-center justify-center p-8 bg-gray-800 rounded-3xl shadow-xl max-w-sm w-full text-center transform transition-all duration-500 ease-in-out scale-100 hover:scale-105">
//                     <div className="mb-6">
//                         <QrCode size={96} strokeWidth={1} className="text-blue-400 animate-pulse-slow" />
//                     </div>
//                     <h2 className="text-3xl font-extrabold mb-2 text-blue-400">Sẵn sàng để check-in?</h2>
//                     <p className="mb-6 text-gray-400">
//                         Bấm nút bên dưới để mở camera và bắt đầu quét.
//                     </p>
//                     <button
//                         onClick={handleStartScanning}
//                         className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
//                     >
//                         Bắt đầu quét QR
//                     </button>
//                 </div>
//             )}

//             {/* Trạng thái đang quét */}
//             {isScanning && (
//                 <div className="flex flex-col items-center justify-center p-8 bg-gray-800 rounded-3xl shadow-xl max-w-sm w-full text-center">
//                     <h2 className="text-2xl font-bold mb-4 text-gray-300">Đưa mã QR vào camera</h2>
//                     <div id="qr-reader" className="w-full max-w-[300px] mb-6" />
//                     <button
//                         onClick={handleStopScanning}
//                         className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50"
//                     >
//                         Tắt camera
//                     </button>
//                 </div>
//             )}

//             {/* Trạng thái quét thành công và check-in thành công */}
//             {scanResult === "success" && participantInfo && (
//                 <div className="flex flex-col items-center justify-center p-8 bg-gray-800 rounded-3xl shadow-xl max-w-sm w-full text-center animate-scale-in">
//                     <CheckCircle size={64} strokeWidth={2} className="text-green-500" />
//                     <h2 className="text-3xl font-extrabold my-4 text-green-400">Check-in thành công!</h2>
//                     {participantInfo.avatar && (
//                         <img
//                             src={participantInfo.avatar}
//                             alt="Avatar"
//                             className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-green-500"
//                         />
//                     )}
//                     <p className="text-2xl font-bold text-gray-100 mb-2">{participantInfo.name}</p>
//                     <p className="text-xl text-gray-300 mb-2">Tổ chức: {participantInfo.organization}</p>
//                     <p className="text-lg font-semibold text-gray-300 mb-6">Số ghế: {participantInfo.seatNumber}</p>
//                     <button
//                         onClick={handleScanAgain}
//                         className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
//                     >
//                         Quét tiếp
//                     </button>
//                 </div>
//             )}

//             {/* Trạng thái mã QR không hợp lệ */}
//             {scanResult === "invalid" && (
//                 <div className="flex flex-col items-center justify-center p-8 bg-gray-800 rounded-3xl shadow-xl max-w-sm w-full text-center animate-shake">
//                     <XCircle size={64} strokeWidth={2} className="text-red-500" />
//                     <h2 className="text-3xl font-extrabold my-4 text-red-400">Mã QR không hợp lệ!</h2>
//                     <p className="text-xl mb-6 text-gray-300">
//                         Vui lòng thử lại với mã QR khác.
//                     </p>
//                     <button
//                         onClick={handleScanAgain}
//                         className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:ring-opacity-50"
//                     >
//                         Quét lại
//                     </button>
//                 </div>
//             )}

//             {/* Trạng thái lỗi check-in */}
//             {scanResult === "error" && (
//                 <div className="flex flex-col items-center justify-center p-8 bg-gray-800 rounded-3xl shadow-xl max-w-sm w-full text-center animate-shake">
//                     <XCircle size={64} strokeWidth={2} className="text-red-500" />
//                     <h2 className="text-3xl font-extrabold my-4 text-red-400">Lỗi check-in!</h2>
//                     <p className="text-xl mb-6 text-gray-300">
//                         Đã có lỗi xảy ra khi gọi API check-in.
//                     </p>
//                     <button
//                         onClick={handleScanAgain}
//                         className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50"
//                     >
//                         Quét lại
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default QRCodeScanner;
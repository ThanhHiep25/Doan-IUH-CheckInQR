// src/RoutesBr.tsx

import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LadingPage from "../pages/ladingPage/LadingPage";
import Menu from "../components/menu/Menu";
import MyQRCodePage from "../pages/thanks/ThankYouPage";
import QRCodeScanner from "../pages/thanks/QRScannerLink.tsx";
import UserDisplayPage from "../pages/thanks/UserDisplayPage.tsx";
import SeatDisplayPage from "../pages/thanks/SeatDisplay.tsx";
import Footer from "../components/footer/Footer.tsx";
import { AirplayIcon } from "lucide-react";

const RoutesBr: React.FC = () => {
    // Khởi tạo state để điều khiển việc hiển thị
    const [showComponents, setShowComponents] = useState(true);

    const handleToggle = () => {
        setShowComponents(!showComponents);
    };

    return (
        <BrowserRouter>
            {/* Nút bấm để bật/tắt Menu và Footer */}
            <button
                onClick={handleToggle}
                style={{
                    position: "fixed",
                    top: "100px",
                    right: "10px",
                    zIndex: 1000,
                    padding: "10px 15px",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
                title="Toggle Menu and Footer"
                className="bg-white/20 backdrop-blur-md hover:bg-white/30 shadow-md transition-all duration-300 ease-in-out"
            >
                {showComponents ? <AirplayIcon/> : <AirplayIcon/>}
            </button>

            {/* Hiển thị Menu nếu showComponents là true */}
            {showComponents && <Menu />}

            <Routes>
                <Route path="/" element={<LadingPage />} />
                <Route path="/my-qrcode/:id" element={<MyQRCodePage />} />
                <Route path="/scan" element={<QRCodeScanner />} />
                <Route path="/display" element={<UserDisplayPage />} />
                <Route path="/seat-display" element={<SeatDisplayPage />} />
                <Route path="*" element={<h1>404 Not Found</h1>} />
            </Routes>

            {/* Hiển thị Footer nếu showComponents là true */}
            {showComponents && <Footer />}
        </BrowserRouter>
    );
};

export default RoutesBr;
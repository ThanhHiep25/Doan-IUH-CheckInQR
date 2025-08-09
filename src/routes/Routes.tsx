import { BrowserRouter, Route, Routes } from "react-router-dom";
import LadingPage from "../pages/ladingPage/LadingPage";
import Menu from "../components/menu/Menu";
//import Footer from "../components/footer/Footer";
import MyQRCodePage from "../pages/thanks/ThankYouPage";
import QRCodeScanner from "../pages/thanks/QRScannerLink.tsx";
import UserDisplayPage from "../pages/thanks/UserDisplayPage.tsx";
import SeatDisplayPage from "../pages/thanks/SeatDisplay.tsx";




const RoutesBr: React.FC = () => {
    return (
        <BrowserRouter>
            <Menu />
            <Routes>
                <Route path="/" element={<LadingPage />} />
                {/* <Route path="/gioi-thieu-ngay-hoi-doan" element={<h1>gioi thieu</h1>} />
                <Route path="/hoat-dong-doan" element={<h1>hoat dong</h1>} />
                <Route path="/lien-he-doan" element={<h1>Lien he</h1>} /> */}
                 <Route path="/my-qrcode/:id" element={<MyQRCodePage />} />
                <Route path="/scan" element={<QRCodeScanner />} />
                <Route path="/display" element={<UserDisplayPage />} />
                 <Route path="/seat-display" element={<SeatDisplayPage/>} />
                <Route path="*" element={<h1>404 Not Found</h1>} />

            </Routes>
            {/* <Footer /> */}
        </BrowserRouter>
    )
}

export default RoutesBr;
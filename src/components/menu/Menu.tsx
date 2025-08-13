
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Component Popup đăng nhập
interface LoginPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: () => void;
}

const LoginPopup = ({ isOpen, onClose, onLoginSuccess }: LoginPopupProps) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", {
                username,
                password,
            });

            if (response.data.token) {
                // Lưu token vào localStorage
                localStorage.setItem("userToken", response.data.token);
                // Thêm một cờ để đánh dấu đã đăng nhập
                localStorage.setItem("isLoggedIn", "true"); 
                onLoginSuccess();
            } else {
                setError("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
            }
        } catch {
            setError("Có lỗi xảy ra. Vui lòng thử lại.");
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur bg-opacity-50">
                    <motion.div
                        initial={{ y: "-100vh", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "-100vh", opacity: 0 }}
                        className="bg-white p-8 rounded-lg shadow-xl w-96"
                    >
                        <img src="/logo_dang.png" alt=" Logo" className="mx-auto mb-5 w-40 h-30" />
                        <p className="text-3xl roboto-6 text-red-600 mb-2 text-center">Đăng nhập</p>
                        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                        <form onSubmit={handleLogin} className="flex flex-col gap-4">
                            <input
                                type="text"
                                placeholder="Tên đăng nhập"
                                className="p-3 border-b text-black focus:outline-none"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Mật khẩu"
                                className="p-3 border-b text-black focus:outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                            >
                                Đăng nhập
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-gray-300 text-black p-3 rounded-lg font-bold hover:bg-gray-400 transition-colors"
                            >
                                Hủy
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};


const menuItems = [
    //{ label: "Giới thiệu", path: "/gioi-thieu-ngay-hoi-doan" },
    //{ label: "Hoạt động", path: "/hoat-dong-doan" },
    { label: "Hiển thị người dùng", path: "/display" },
    { label: "Hiển thị ghế", path: "/seat-display" },
];

const Menu: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("userToken");
        const loggedInFlag = localStorage.getItem("isLoggedIn");
        setIsLoggedIn(!!token && loggedInFlag === "true");
    }, []);

    const handleNavigation = (path: string) => {
        navigate(path);
        setIsMenuOpen(false);
    };

    const handleLoginSuccess = () => {
        setIsLoginPopupOpen(false);
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem("userToken");
        localStorage.removeItem("isLoggedIn");
        setIsLoggedIn(false);
        navigate("/");
    };

    const handleLoginClick = () => {
        setIsLoginPopupOpen(true);
        setIsMenuOpen(false);
    };

    return (
        <>
            <div className="backdrop-blur-sm h-20 flex justify-between items-center p-3 sticky top-0 z-50 text-white shadow-lg">
                <div onClick={() => handleNavigation("/")} className="flex items-center gap-2 justify-center ml-3 cursor-pointer">
                    <img src='/Logo_IUH.png' alt="logo" className="w-20 h-8" />
                    <span className="font-bold text-2xl text-gray-400">|</span>
                </div>
                {/* Menu trên Desktop */}
                <div className="hidden md:flex items-center justify-center gap-4 mr-10 ">
                    {menuItems.map((item, i) => (
                        <motion.button
                            variants={{
                                hidden: { opacity: 0, x: "100%" },
                                animate: { opacity: 1, x: 0 },
                                hover: { scale: 1.05 },
                                tap: { scale: 0.9 },
                            }}
                            key={item.label}
                            className="h-full font-bold text-lg px-4 py-1 rounded-lg relative overflow-hidden hover:text-white bg-transparent transition-colors duration-200"
                            initial="hidden"
                            animate="animate"
                            whileHover="hover"
                            whileTap="tap"
                            custom={i}
                            onClick={() => handleNavigation(item.path || "")}
                        >
                            {item.label}
                        </motion.button>
                    ))}
                    {/* Thêm lại nút Quét QR */}
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        whileHover={{ scale: 1.05 }}
                        variants={{
                            hidden: { opacity: 0, x: "100%" },
                            visible: (i: number) => ({
                                opacity: 1,
                                x: 0,
                                transition: { delay: (i - 1) * 0.2 },
                            }),
                        }}
                        className="text-lg font-bold text-white py-1 px-2 rounded-lg w-50 
                        bg-gradient-to-r from-pink-500 via-blue-700 to-blue-600 text-center
                        hover:from-blue-600 hover:via-pink-500 hover:to-pink-500
                        hover:bg-white transition-colors duration-300"
                        initial="hidden"
                        animate="visible"
                        custom={menuItems.length + 1}
                        onClick={() => handleNavigation("/scan")}
                    >
                        😍 Quét mã QR
                    </motion.button>
                    {isLoggedIn ? (
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            whileHover={{ scale: 1.05 }}
                            variants={{
                                hidden: { opacity: 0, x: "100%" },
                                visible: (i: number) => ({
                                    opacity: 1,
                                    x: 0,
                                    transition: { delay: (i - 1) * 0.2 },
                                }),
                            }}
                            className="text-lg font-bold text-white py-1 px-2 rounded-lg w-50 
                            bg-gradient-to-r from-green-500 to-green-700 text-center
                            hover:from-green-700 hover:to-green-500 transition-colors duration-300"
                            initial="hidden"
                            animate="visible"
                            custom={menuItems.length + 2}
                            onClick={handleLogout}
                        >
                            Đăng xuất
                        </motion.button>
                    ) : (
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            whileHover={{ scale: 1.05 }}
                            variants={{
                                hidden: { opacity: 0, x: "100%" },
                                visible: (i: number) => ({
                                    opacity: 1,
                                    x: 0,
                                    transition: { delay: (i - 1) * 0.2 },
                                }),
                            }}
                            className="text-lg font-bold text-white py-1 px-2 rounded-lg w-50 
                            bg-gradient-to-r from-blue-500 via-purple-700 to-purple-600 text-center
                            hover:from-purple-600 hover:via-blue-500 hover:to-blue-500
                            hover:bg-white transition-colors duration-300"
                            initial="hidden"
                            animate="visible"
                            custom={menuItems.length + 2}
                            onClick={handleLoginClick}
                        >
                            Đăng nhập
                        </motion.button>
                    )}
                </div>
                {/* Nút Hamburger cho Mobile */}
                <div className="md:hidden mr-3">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                        aria-label="Toggle menu"
                    >
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            )}
                        </svg>
                    </button>
                </div>
                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, x: "100%" },
                                visible: { opacity: 1, x: 0 },
                                exit: { opacity: 0, x: "100%" },
                            }}
                            className="fixed top-20 left-0 w-full z-40 flex flex-col items-center justify-center space-y-8 md:hidden bg-black/80"
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            {menuItems.map((item, i) => (
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                    key={item.label}
                                    className="text-lg font-bold text-white py-2 w-full text-center hover:bg-white hover:text-black transition-colors duration-300"
                                    initial="hidden"
                                    animate="visible"
                                    custom={i}
                                    onClick={() => handleNavigation(item.path || "")}
                                >
                                    {item.label}
                                </motion.button>
                            ))}
                            {/* Thêm lại nút Quét QR cho mobile */}
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                                whileHover={{ scale: 1.05 }}
                                variants={{
                                    hidden: { opacity: 0, x: "100%" },
                                    visible: (i: number) => ({
                                        opacity: 1,
                                        x: 0,
                                        transition: { delay: (i - 1) * 0.1 },
                                    }),
                                }}
                                className="text-lg font-bold text-white py-1 px-2 rounded-lg w-50 
                                bg-gradient-to-r from-pink-500 via-blue-700 to-blue-600 text-center
                                hover:from-blue-600 hover:via-pink-500 hover:to-pink-500
                                hover:bg-white transition-colors duration-300"
                                initial="hidden"
                                animate="visible"
                                custom={menuItems.length + 1}
                                onClick={() => {
                                    handleNavigation("/scan");
                                    setIsMenuOpen(false);
                                }}
                            >
                                😍 Quét mã QR
                            </motion.button>
                            {isLoggedIn ? (
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                    whileHover={{ scale: 1.05 }}
                                    className="text-lg font-bold text-white py-1 px-2 rounded-lg w-50 
                                    bg-gradient-to-r from-green-500 to-green-700 text-center
                                    hover:from-green-700 hover:to-green-500 transition-colors duration-300 mb-10"
                                    onClick={handleLogout}
                                >
                                    Đăng xuất
                                </motion.button>
                            ) : (
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                    whileHover={{ scale: 1.05 }}
                                    variants={{
                                        hidden: { opacity: 0, x: "100%" },
                                        visible: (i: number) => ({
                                            opacity: 1,
                                            x: 0,
                                            transition: { delay: (i - 1) * 0.1 },
                                        }),
                                    }}
                                    className="text-lg font-bold text-white py-1 px-2 rounded-lg w-50 
                                    bg-gradient-to-r from-blue-500 via-purple-700 to-purple-600 text-center
                                    hover:from-purple-600 hover:via-blue-500 hover:to-blue-500
                                    hover:bg-white transition-colors duration-300 mb-10"
                                    initial="hidden"
                                    animate="visible"
                                    custom={menuItems.length + 2}
                                    onClick={handleLoginClick}
                                >
                                    Đăng nhập
                                </motion.button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <LoginPopup
                isOpen={isLoginPopupOpen}
                onClose={() => setIsLoginPopupOpen(false)}
                onLoginSuccess={handleLoginSuccess}
            />
        </>
    );
};

export default Menu;
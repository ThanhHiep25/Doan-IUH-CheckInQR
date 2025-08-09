import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import logodoan from "../../assets/logo_doan.png"
import UpcomingEvents from '../../components/upcoming/UpcomingIUH';
import doan002 from "../../assets/daihoixi-02.jpg"

import slideImage1 from "../../assets/daihoixi-01.jpg";
import slideImage2 from "../../assets/daihoixi-03.jpg";
import slideImage3 from "../../assets/daihoixi-12.jpg";

const LadingPage: React.FC = () => {
    // Mảng chứa các đường dẫn ảnh cho slideshow
    const slideImages = [
        slideImage1,
        slideImage2,
        slideImage3,
        doan002,
    ];

    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    // Hàm chuyển slide về phía trước
    const nextSlide = () => {
        setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slideImages.length);
    };

    // Hàm chuyển slide về phía sau
    const prevSlide = () => {
        setCurrentSlideIndex((prevIndex) => (prevIndex - 1 + slideImages.length) % slideImages.length);
    };

    useEffect(() => {
        const interval = setInterval(nextSlide, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="mt-[-80px]">
            {/* --- Phần giới thiệu chính (Logo & Tiêu đề) --- */}
            <section className="w-full h-screen bg-gradient-to-bl from-blue-700 via-slate-900/20 to-blue-700 pt-30 flex flex-col items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col justify-center items-center text-white px-4 text-center">
                    <img src={logodoan} alt="logo doan" className="w-20 h-24" />
                    <h1 className="text-5xl font-bold mt-4">ĐOÀN TRƯỜNG ĐẠI HỌC CÔNG NGHIỆP TP HỒ CHÍ MINH - IUH</h1>
                </motion.div>

                {/* --- Phần slideshow ảnh riêng biệt với nút điều hướng --- */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="relative md:w-2/3 w-full h-[500px] overflow-hidden mt-10 md:rounded-2xl">
                    {slideImages.map((image, index) => (
                        <motion.img
                            key={index}
                            src={image}
                            alt={`Slide ${index + 1}`}
                            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: index === currentSlideIndex ? 1 : 0 }}
                            transition={{ duration: 1 }}
                        />
                    ))}

                    {/* Các nút điều hướng */}
                    <button
                        onClick={prevSlide}
                        className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/50 hover:bg-white/80 text-blue-700 p-2 rounded-full z-30 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/50 hover:bg-white/80 text-blue-700 p-2 rounded-full z-30 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </motion.div>
            </section>

            {/* --- Phần giới thiệu Ngày hội của Đoàn --- */}
            <section className="py-20 bg-white max-w-7xl">
                <div className="container mx-auto px-4 grid md:grid-cols-2 items-center gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="order-last md:order-first"
                    >
                        <h2 className="text-4xl font-bold text-blue-700 mb-6">Chào mừng đến với Ngày hội Đoàn IUH!</h2>
                        <p className="text-gray-700 leading-relaxed text-lg mb-4">
                            Ngày hội Đoàn là sự kiện lớn nhất trong năm, nơi sinh viên được tham gia vào các hoạt động văn hóa, thể thao, và tình nguyện sôi nổi. Đây là cơ hội để các bạn thể hiện tài năng, kết nối bạn bè và cùng nhau tạo nên những kỷ niệm đáng nhớ. Hãy cùng chờ đón những điều bất ngờ tại Ngày hội năm nay!
                        </p>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300">
                            Tìm hiểu thêm
                        </button>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex justify-center"
                    >
                        <img src={doan002} alt="Ngày hội Đoàn" className="rounded-lg shadow-lg" />
                    </motion.div>
                </div>
            </section>

            {/* Phần sự kiện sắp tới (đã có từ trước) */}
            <UpcomingEvents />

            {/* --- Phần thông tin chung về Đoàn --- */}
            <section className="py-20 bg-blue-700 text-white h-screen flex items-center justify-center">
                <div className="container mx-auto px-4">
                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="md:text-5xl text-4xl font-bold text-center mb-6"
                    >
                        Về Đoàn trường Đại học Công nghiệp TP.HCM
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="max-w-4xl mx-auto text-center leading-relaxed md:text-2xl text-lg"
                    >
                        Với vai trò là cầu nối giữa nhà trường và sinh viên, Đoàn trường IUH luôn nỗ lực tạo ra môi trường học tập và rèn luyện năng động, toàn diện. Chúng tôi tổ chức các hoạt động nhằm bồi dưỡng lý tưởng, kỹ năng sống và tinh thần cống hiến cho thanh niên. Đoàn trường IUH là nơi các bạn có thể phát triển bản thân, tạo dựng những giá trị tốt đẹp cho cộng đồng.
                    </motion.p>
                </div>
            </section>
        </div>
    )
}

export default LadingPage;

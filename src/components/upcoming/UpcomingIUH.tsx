

import React from 'react';
import { motion } from 'framer-motion';

const upcomingEvents = [
  {
    id: 1,
    title: 'Giải bóng đá sinh viên IUH 2024',
    description: 'Giải đấu bóng đá thường niên dành cho sinh viên IUH.',
    date: '15/10/2024',
  },
  {
    id: 2,
    title: 'Hội trại truyền thống 26/03',
    description: 'Đêm lửa trại, văn nghệ và các trò chơi dân gian ý nghĩa.',
    date: '26/03/2025',
  },
  {
    id: 3,
    title: 'Tình nguyện mùa hè xanh 2025',
    description: 'Chung tay xây dựng cộng đồng, giúp đỡ các hoàn cảnh khó khăn.',
    date: '01/07/2025',
  },
];

const UpcomingEvents: React.FC = () => {
  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center text-blue-700 mb-12"
        >
          Sự kiện sắp tới
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {upcomingEvents.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: event.id * 0.1 }}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
              <p className="text-gray-600 mb-4">{event.description}</p>
              <p className="text-sm font-semibold text-blue-500">Ngày: {event.date}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
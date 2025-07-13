import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { FaUsers, FaMale, FaFemale, FaUserCheck, FaUserTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import api from '../../api/api';
const DashboardCompo = () => {
    const [count, setCount] = useState({
        female: 0,
        male: 0,
        total: 0,
        active: 0,
        inactive: 0,
        expiring: 0,
        revenue: 0,
    });

    useEffect(() => {
        // Member gender/total count
        api.get('/dashboard/memberCount')
            .then(res => {
                if (res.status === 200) {
                    const genderData = res.data;
                    setCount(prev => ({
                        ...prev,
                        female: genderData.find(g => g.gender === 'female')?.gender_count || 0,
                        male: genderData.find(g => g.gender === 'male')?.gender_count || 0,
                        total: genderData.find(g => g.gender === 'Total')?.gender_count || 0
                    }));
                }
            })
            .catch(error => {
                console.error('Error fetching member count:', error);
            });

        // Active/Inactive members
        api.get('/members/getMember')
            .then(res => {
                if (res.status === 200) {
                    const today = new Date();
                    let active = 0, inactive = 0, expiring = 0;
                    res.data.forEach(m => {
                        const end = new Date(m.endDate);
                        if (end >= today) active++;
                        else inactive++;
                        // Expiring in next 7 days
                        const diff = (end - today) / (1000 * 60 * 60 * 24);
                        if (diff > 0 && diff <= 7) expiring++;
                    });
                    setCount(prev => ({
                        ...prev,
                        active,
                        inactive,
                        expiring
                    }));
                }
            })
            .catch(error => {
                console.error('Error fetching active/inactive:', error);
            });

        // Revenue (example: sum of all paid amounts)
        api.get('/transaction/getTransaction')
            .then(res => {
                if (res.status === 200) {
                    const revenue = res.data.reduce((sum, t) => sum + (Number(t.transaction_amount_paid) || 0), 0);
                    setCount(prev => ({
                        ...prev,
                        revenue
                    }));
                }
            })
            .catch(error => {
                console.error('Error fetching revenue:', error);
            });

    }, []);

    // Animation variants
    const cardVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: i => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.1, type: "spring", stiffness: 120 }
        })
    };

    // Card data
    const cards = [
        {
            label: "Total Members",
            value: count.total,
            icon: <FaUsers size={36} />,
            color: "bg-green-400",
        },
        {
            label: "Male Members",
            value: count.male,
            icon: <FaMale size={36} />,
            color: "bg-blue-400",
        },
        {
            label: "Female Members",
            value: count.female,
            icon: <FaFemale size={36} />,
            color: "bg-pink-400",
        },
        {
            label: "Active Members",
            value: count.active,
            icon: <FaUserCheck size={36} />,
            color: "bg-emerald-400",
        },
        {
            label: "Inactive Members",
            value: count.inactive,
            icon: <FaUserTimes size={36} />,
            color: "bg-gray-400",
        },
    ];

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 gap-4 px-2 mt-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:px-8">
                {cards.map((card, i) => (
                    <motion.div
                        key={card.label}
                        className="flex items-center bg-white border rounded-xl overflow-hidden shadow hover:shadow-lg transition"
                        custom={i}
                        initial="hidden"
                        animate="visible"
                        variants={cardVariants}
                    >
                        <div className={`p-4 ${card.color} flex items-center justify-center`}>
                            <span className="text-white">{card.icon}</span>
                        </div>
                        <div className="px-4 py-2 text-gray-700">
                            <h3 className="text-xs tracking-wider font-semibold">{card.label}</h3>
                            <p className="text-2xl font-bold">{card.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default DashboardCompo;
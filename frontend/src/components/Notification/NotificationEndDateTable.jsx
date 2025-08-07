import React from 'react'
import { useMemberDialog } from '../../context/MemberDialogContext';
import { FaWhatsapp } from 'react-icons/fa';
import { motion } from 'framer-motion';

const NotificationEndDateTable = ({ data }) => {
    const { openDialog } = useMemberDialog();

    const handleReminder = (ele) => {
        const text = `Hi ${ele.name}, your gym membership is about to expire on ${ele.endDate}   ! Keep the momentum going—renew your membership today and continue achieving your fitness goals. See you at the gym`;
        const whatsappUrl = `https://api.whatsapp.com/send?phone=91${ele.mobile}&text=${text}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleNameClick = (member) => {
        openDialog({
            name: member.name,
            mobile: member.mobile,
            endDate: member.endDate,
            ...member
        });
    };

    return (
        data.map((ele, index) => (
            <motion.tr
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.03 }}
                className="hover:bg-blue-50 transition"
            >
                <td
                    className="px-6 py-4 whitespace-nowrap font-medium text-blue-700 cursor-pointer hover:underline"
                    onClick={() => handleNameClick(ele)}
                >
                    {ele.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{ele.mobile}</td>
                <td className="px-6 py-4 whitespace-nowrap">{ele.endDate}</td>
                <td className={`px-6 py-4 whitespace-nowrap ${ele.days_left <= 0 ? 'text-red-600' : 'text-green-600'}`}>{ele.days_left}</td>
                <td className="px-6 py-4 whitespace-nowrap text-red-500">{ele.transaction_amount_due}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleReminder(ele)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white font-semibold shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                        title="Send WhatsApp Reminder"
                    >
                        <FaWhatsapp size={18} className="text-white" />
                        Send Reminder
                    </motion.button>
                </td>
            </motion.tr>
        ))
    );
};

export default NotificationEndDateTable;
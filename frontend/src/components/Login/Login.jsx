import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import logActivity from '../../globalFunction/ActivityLog';
import { FaUserCircle, FaLock, FaDumbbell } from 'react-icons/fa';
import { motion } from 'framer-motion';
import api from '../../api/api';

const Login = () => {
    const [values, setValues] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        api.post('/auth/login', values)
            .then(res => {
                setLoading(false);
                if (res.data.user) {
                    localStorage.setItem('isLoggedIn', true);
                    localStorage.setItem('loginId', res.data.user.id);
                    localStorage.setItem('admin', res.data.user.admin ? 'true' : 'false');
                    localStorage.setItem('adminEmail', res.data.user.email);
                    Swal.fire({
                        toast: true,
                        position: "top-end",
                        icon: "success",
                        title: `Welcome ${res.data.user.email}`,
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true
                    });
                    navigate('/Dashboard');
                    logActivity(res.data.user.id, 'User logged in');
                } else {
                    Swal.fire('Login Failed', res.data.message, 'error');
                }
            })
            .catch(() => {
                setLoading(false);
                Swal.fire('Error', 'Something went wrong', 'error');
            });
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSubmit(event);
        }
    };

    return (
        <div className="w-screen min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, type: "spring" }}
                className="relative py-6 sm:max-w-xs sm:mx-auto w-full"
            >
                <motion.div
                    initial={{ scale: 0.7, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className="flex flex-col items-center mb-8"
                >
                    <div className="bg-blue-600 rounded-full p-4 shadow-lg mb-2">
                        <FaDumbbell size={36} className="text-white" />
                    </div>
                    <p className="m-0 text-xl font-bold text-blue-800">Gym Management</p>
                    <span className="text-xs text-center text-gray-500 mt-1">
                        Welcome back! Please login to your admin dashboard.
                    </span>
                </motion.div>
                <div className="px-8 py-8 mt-4 text-left bg-white rounded-2xl shadow-2xl border border-blue-100">
                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="relative"
                        >
                            <FaUserCircle className="absolute left-3 top-3 text-blue-700" size={20} />
                            <input
                                onChange={handleInput}
                                name='email'
                                type='email'
                                value={values.email}
                                className="pl-10 border border-blue-200 rounded-lg px-3 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Email"
                                required
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="relative"
                        >
                            <FaLock className="absolute left-3 top-3 text-blue-700" size={20} />
                            <input
                                onChange={handleInput}
                                onKeyDown={handleKeyPress}
                                name='password'
                                value={values.password}
                                type="password"
                                className="pl-10 border border-blue-200 rounded-lg px-3 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Password"
                                required
                            />
                        </motion.div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="py-2 px-8 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none rounded-lg"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;

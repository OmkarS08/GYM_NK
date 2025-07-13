import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import logActivity from '../../globalFunction/ActivityLog';
import Swal from 'sweetalert2';

const SteamBathForm = ({ close }) => {
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [members, setMembers] = useState([]);

    useEffect(() => {
        axios.get(`http://http://localhost:8081/members/getOnlyMember`)
            .then(res => {
                if (res.status === 200) {
                    setMembers(res.data);
                } else {
                    console.log(res.status);
                }
            })
            .catch(err => console.log(err));
    }, []); // Empty dependency array to run only on component mount

    const handleMemberChange = (selectedOptions) => {
        setSelectedMembers(selectedOptions);
    };

    const submitSteamForm = (e) => {
        e.preventDefault(); // Prevent default form submission

        const formData = {
            members: selectedMembers.map((member) => member.value), // Extract the member IDs or relevant info
            date,
            time,
        };


        axios.post('http://http://localhost:8081/steamBath/addSteamBath', formData)
            .then(res => {
                if (res.status === 200) {
                    close(false);
                    logActivity(localStorage.getItem('loginId'), `Steam Schedule Added for --> ${formData.members}`);
                    Swal.fire({
                        toast: true,
                        position: "top-end",
                        icon: "success",
                        title: `Steam Schedule Added`,
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true,
                    });
                }
            })
            .catch(err => console.log(err));

            const myreload = () => {
                window.location.reload()
              }

              setTimeout(myreload, 1590)

    };

    return (
        <div>
            {/* Form */}
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
                <form onSubmit={submitSteamForm} className="py-4 px-6 bg-white rounded">
                    {/* Search for Members */}
                    <div className="mb-4">
                        <div className="text-xl my-4 py-2 px-2 bg-gray-900 text-white text-center font-bold uppercase">
                            Book an Appointment
                        </div>
                        <label className="block text-gray-700 font-bold mb-2">Add Members</label>
                        <Select
                            options={members}
                            isMulti
                            placeholder="Search and select members"
                            onChange={handleMemberChange} // Handle member selection
                        />
                    </div>

                    {/* Date and Time */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Date</label>
                        <input
                            type="date"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)} // Handle date input
                            className="shadow border rounded w-full py-2 px-3 text-gray-700"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Time</label>
                        <input
                            type="time"
                            id="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)} // Handle time input
                            className="shadow border rounded w-full py-2 px-3 text-gray-700"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-center mb-4">
                        <button
                            type="submit" // Changed to submit to allow form submission
                            className="bg-blue-500 mx-4 my-4 text-white px-6 py-2 rounded-lg"
                        >
                            Book Appointment
                        </button>
                        <button
                            onClick={() => close(false)}
                            type="button"
                            className="mx-4 my-4 bg-red-600 text-white px-6 py-2 rounded-lg"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SteamBathForm;

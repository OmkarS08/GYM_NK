import React, { useEffect, useState } from 'react'
import api from '../../api/api';
import Swal from 'sweetalert2';
import logActivity from '../../globalFunction/ActivityLog';

const StaffMember = () => {

    const [staffMemberData, setStaffMemberData] = useState([]);
    useEffect(() => {
        api.get('/staffMember/getStaffMember')
            .then(res => {
                if (res.status === 200) {
                    setStaffMemberData(res.data)
                
                }
                else {
                    console.log(res.status)
                }
            })
            .catch(err => console.log(err))
    }, [])

    const handleDelete = (id, name) => {

        Swal.fire({
            title: `Are you sure want to delete ${name}?`,
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                api.post(`/staffMember/deleteStaffMember/${id}`)
                    .then(res => {
                        if (res.status === 200) {
                            Swal.fire({
                                toast: true,
                                position: 'top-end',
                                title: "Deleted!",
                                text: `${name} has been deleted.`,
                                icon: "error",
                                timer: 1500,
                                timerProgressBar: true,
                                showConfirmButton: false,
                            });
                            logActivity(localStorage.getItem('loginId'), `Staff Member Deleted -->${name}`)

                            const myreload = () => {
                                window.location.reload()
                            }

                            setTimeout(myreload, 1590)



                        } else {
                            console.log('failed');
                        }
                    })
                    .catch(err => {
                        console.error('Error:', err); // Add error handling
                    });
              

            }
        });

    }

    const handleSelect = (id, name, newRole) => {
        // newRole will be either '0' (staff) or '1' (admin)
        api.post(`/staffMember/updateStaff/${id}`, { admin: newRole })
            .then(res => {
                if (res.status === 200) {
                    Swal.fire({
                        title: "Success!",
                        text: "Staff Member information has been updated.",
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false,
                        timerProgressBar: true
                    });
    
                    const myreload = () => {
                        window.location.reload();
                    };
                    setTimeout(myreload, 1600);
    
                    logActivity(localStorage.getItem('loginId'), `Staff Member with name ${name} has been edited`);
                }
            })
            .catch(err => {
                console.error('Error updating staff member:', err);
            });
    };
    

    return (
        <div class="flex items-center justify-center px-auto py-auto">
            <table class="w-[90%] text-md bg-white shadow-md rounded mb-4">
                <tbody>
                    <tr class="border-b">
                        <th class="text-left p-4 px-5">ID</th>
                        <th class="text-left p-4 px-5">USERNAME</th>
                        <th class="text-left p-4 px-5">ROLE</th>
                        <th class="text-left p-4 px-5">ACTIONS</th>
                        <th></th>
                    </tr>
                    {staffMemberData ?
                        staffMemberData.map((ele,index) => (
                            <tr class="border-b hover:bg-orange-100 bg-gray-100">
                                <td class="p-4 px-5">
                                    {index + +1}
                                </td>
                                <td class="p-4 px-5">
                                    {ele.username}
                                </td>
                                <td className="p-4 px-5">
                                    <select
                                        id="role"
                                        value={ele.admin === 0 ? "staff" : "admin"}  // Map 0 to "staff" and 1 to "admin"
                                        onChange={(e) => handleSelect(ele.id, ele.username, e.target.value === 'staff' ? 0 : 1)} // Send the new role
                                    >
                                        <option value="staff">Staff</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td class="p-3 px-5">
                                    <button
                                        onClick={() => handleDelete(ele.id, ele.username)}
                                        type="button"
                                        class="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">
                                        <svg
                                            width="20px"
                                            height="20px"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            stroke="#ffffff"
                                        >
                                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                            <g id="SVGRepo_iconCarrier">
                                                <path
                                                    d="M6 5H18M9 5V5C10.5769 3.16026 13.4231 3.16026 15 5V5M9 20H15C16.1046 20 17 19.1046 17 18V9C17 8.44772 16.5523 8 16 8H8C7.44772 8 7 8.44772 7 9V18C7 19.1046 7.89543 20 9 20Z"
                                                    stroke="#ffffff"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                ></path>
                                            </g>
                                        </svg></button>
                                </td>
                            </tr>)) : ''}
                </tbody>
            </table>
        </div>
    )

}

export default StaffMember
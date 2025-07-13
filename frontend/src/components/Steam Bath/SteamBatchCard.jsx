import React from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import logActivity from '../../globalFunction/ActivityLog';

const SteamBatchCard = ({ data }) => {
  const steamData = data;

  const handleDelete = (id, members) => {
    Swal.fire({
      title: `Are you sure want to delete Steam Bath ${members}?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post(`http://http://localhost:8081/steamBath/deleteSteam/${id}`)
          .then(res => {
            if (res.status === 200) {
              Swal.fire({
                toast: true,
                position: 'top-end',
                title: "Deleted!",
                text: ` Steam has been deleted.`,
                icon: "error",
                timer: 1500,
                timerProgressBar: true,
                showConfirmButton: false,
              });
              logActivity(localStorage.getItem('loginId'), `Steam Deleted for -->${members}`)

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

  return (
    <div className="grid grid-cols-4 gap-4 mt-10">
    {steamData.map((ele, index) => (
      <div 
        key={index} 
        className="bg-white shadow-lg rounded-lg p-4 flex flex-col justify-between" 
        style={{ minHeight: '250px' }} // Adjust this height as needed
      >
        <div>
          <h3 className="text-xl font-bold mb-4">{ele.Steam_members}</h3>
          <p className="text-gray-700">Date: {ele.Steam_date}</p>
          <p className="text-gray-700">Time: {ele.Steam_time}</p>
        </div>
        
        <div className="flex justify-center items-center">
          <button
            onClick={() => handleDelete(ele.steam_id, ele.Steam_members)}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-full flex justify-center items-center"
          >
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
            </svg>
          </button>
        </div>
      </div>
    ))}
  </div>
  
  );
};

export default SteamBatchCard;



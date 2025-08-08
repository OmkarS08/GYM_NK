import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import api from '../../api/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardTChart = () => {
  const [barChartData, setBarChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    api.get('/dashboard/BarChart')
      .then(res => {
        if (res.status === 200) {
          // Process the data
          const data = res.data;
          const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
          ];

          // Create a mapping of month names to member counts
          const monthData = {};
          data.forEach(item => {
            if (!monthData[item.month]) {
              monthData[item.month] = item.member_count;
            } else {
              monthData[item.month] += item.member_count;
            }
          });

          // Prepare the chart data
          const labels = months.filter(month => monthData[month]);
          const memberCounts = labels.map(month => monthData[month]);

          setBarChartData({
            labels,
            datasets: [
              {
                label: 'Members per Month',
                data: memberCounts,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',  // Light blue color for the bars
                borderColor: 'rgba(54, 162, 235, 1)',        // Darker blue border color
                borderWidth: 2,
                hoverBackgroundColor: 'rgba(75, 192, 192, 0.6)', // Hover color
                hoverBorderColor: 'rgba(75, 192, 192, 1)',       // Hover border color
              }
            ]
          });
        } else {
          console.log(res.status);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,  // Remove x-axis grid lines
        }
      },
      y: {
        grid: {
          display: false,  // Remove y-axis grid lines
        },
        beginAtZero: true,  // Ensure y-axis starts at 0
      }
    },
    plugins: {
      legend: {
        display: true,  // Show legend
      },
      tooltip: {
        enabled: true,  // Enable tooltips on hover
      },
    },
  };

  return (
    <div className="bg-white px-2 sm:px-6 py-4 my-4 flex flex-col items-center justify-center w-full">
      <h2 className="mx-auto mb-2 text-base sm:text-lg font-semibold">Member Growth</h2>
      <div className="w-[220px] h-[180px] sm:w-[340px] sm:h-[260px] md:w-[420px] md:h-[320px]">
        <Bar data={barChartData} options={options} />
      </div>
    </div>
  );
};

export default DashboardTChart;

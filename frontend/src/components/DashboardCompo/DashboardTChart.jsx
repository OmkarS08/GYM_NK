import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import axios from 'axios';

const DashboardTChart = () => {
  const [barChartData, setBarChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    axios.get('https://gym-royal-fitness.onrender.com/dashboard/BarChart')
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
}
  return (
    <div className='bg-white  px-10 mx-2 py-9 my-8'>
      <h2 className='mx-auto'>Member Growth</h2>
      <Bar
        data={barChartData}
        options={options}
      />
    </div>
  );
};

export default DashboardTChart;

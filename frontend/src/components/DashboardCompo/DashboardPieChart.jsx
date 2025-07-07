import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';

const DashboardPieChart = () => {
    const [pieChartData, setPieChartData] = useState({
        labels: [],
        datasets: [],
      });
    
      useEffect(() => {
        axios.get('https://gym-royal-fitness.onrender.com/dashboard/PieChart')
          .then(res => {
            if (res.status === 200) {
              // Process the data for package distribution
              const data = res.data;
              const packages = [];
              const packageCounts = [];
    
              data.forEach(item => {
                packages.push(item.package + ' month');
                packageCounts.push(item.package_count);
              });
    
              setPieChartData({
                labels: packages,
                datasets: [
                  {
                    data: packageCounts,
                    backgroundColor: [
                      'rgba(75, 192, 192, 0.6)',  // Color 1
                      'rgba(255, 99, 132, 0.6)',  // Color 2
                      'rgba(54, 162, 235, 0.6)',  // Color 3
                      'rgba(255, 206, 86, 0.6)',  // Color 4
                      'rgba(153, 102, 255, 0.6)', // Color 5
                    ],
                    borderColor: [
                      'rgba(75, 192, 192, 1)',
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(153, 102, 255, 1)',
                    ],
                    borderWidth: 1,
                  }
                ]
              });
            } else {
              console.log(res.status);
            }
          })
          .catch(err => console.error(err));
      }, []);
    
      return (
        <div className='bg-white  px-10 mx-2 py-4 my-8'>
          <h2 className='mx-auto'>Package Distribution</h2>
          <Pie data={pieChartData} options={{ responsive: true }} />
        </div>
      );
    };

export default DashboardPieChart


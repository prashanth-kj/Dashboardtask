import React from 'react'
import { useContext } from 'react'
import { DashboardDataContext } from './context/DashboardContext'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function TripTile({startdate,enddate}) {
        
      let {dashboardData} =useContext(DashboardDataContext)
      const startDate = new Date(startdate);
      const endDate = new Date(enddate);
      
        // startDate.setHours(0, 0, 0, 0);
        // endDate.setHours(23, 59, 59, 999);

      let filteredData = dashboardData.filter((trip)=>{
        let tripDate = new Date(trip['Schedule Trip Start Time']);
        return tripDate >= startDate && tripDate <= endDate
      })

      console.log(filteredData)

      let lorryTypeCounts= filteredData.reduce((acc,cur)=>{
         let lorryType = +cur['Lorry Type']
         
         if(acc[lorryType]){
            acc[lorryType] += 1
         }else{
             acc[lorryType]= 1
         }
         return acc
      },{})

      console.log(lorryTypeCounts)
       
      const chartdata={
        labels:Object.keys(lorryTypeCounts),
        datasets:[
            {
                label:'Number of Trips by Lorry Type',
                data:Object.values(lorryTypeCounts),
                backgroundColor: [
                    '#158CFC',
                    '#FFDA13'
                ],
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }
        ]
      }
      
      const chartOptions = {
        indexAxis: 'y', // Horizontal bar chart
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
          },
        },
        scales: {
          x: {
            beginAtZero: true,
          },
        },
      };

  return <>
    
     <div className='container'>
          <h5>No of Trips by lorry Type</h5>
          {
            filteredData.length > 0 ?
            (
              <Bar data={chartdata} options={chartOptions}/>
            ):(
                <p>No trips found for the selected date range.</p>
            ) 
          }
     </div>
  
  </>
}

export default TripTile
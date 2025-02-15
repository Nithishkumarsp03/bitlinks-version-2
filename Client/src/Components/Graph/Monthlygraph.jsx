import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom';
import Diamond from "../../Assets/Gem.svg";
import ReactApexChart from 'react-apexcharts';

export default function Monthlygraph({setTotalPoints}) {

    const [seriesData, setSeriesData] = useState([]);
  const [labels, setLabels] = useState([]);
  const {uuid} = useParams()

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API}/api/history/fetchdata`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ uuid }),
        });

        if (!response.ok) {
          console.error('Failed to fetch data:', response.statusText);
          return;
        }

        const result = await response.json();
        // console.log('Fetched Data:', result);

        // Extract the array from the 'data' property
        const data = result.history;
        setTotalPoints(data[0].total_points);

        // Initialize total points counter and monthly data object
        // let totalPoints = 0;
        const monthlyData = {};

        // Process the data
        data.forEach(entry => {
          const date = new Date(entry.datetime);
          const yearMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

          if (!monthlyData[yearMonth]) {
            monthlyData[yearMonth] = 0;
          }
          monthlyData[yearMonth] += entry.points;
          // totalPoints += entry.points;
        });

        // Function to generate the last 6 months dynamically
        const generateLastSixMonths = () => {
          const months = [];
          const currentDate = new Date();
          for (let i = 5; i >= 0; i--) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const yearMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            months.push(yearMonth);
          }
          return months;
        };

        // Generate the last 6 months
        const recentLabels = generateLastSixMonths();

        // Fill in missing months with 0 points
        const values = recentLabels.map(label => monthlyData[label] || 0);

        setLabels(recentLabels);
        setSeriesData([
          {
            name: "Points",
            data: values,
          }
        ]);

        // setTotalPoints(totalPoints);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchMonthlyData();
  }, [uuid]);

  const options = {
    chart: {
      height: 350,
      type: 'bar',
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    colors: ['#2867B2'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'],
        opacity: 0.5
      },
    },
    xaxis: {
      categories: labels,
      title: {
        text: "Month",
        style: { color: "#2867B2", fontSize: 16 , fontFamily: "Open Sans, sans-serif",},
      },
    },
    yaxis: {
      labels: {
        style: { fontSize: "15", colors: ["#2867B2"] },
      },
      title: {
        text: "Points",
        style: { color: "#2867B2", fontSize: 16 , fontFamily: "Open Sans, sans-serif",},
      },
    },
    tooltip: {
      enabled: true,
      custom: function({ series, seriesIndex, dataPointIndex }) {
        return `<div style="display: flex; align-items: center; background-color: #f3f3f3; padding: 5px; border-radius: 5px;">
                  <img src="${Diamond}" style="width: 20px; height: 20px; margin-right: 8px;" alt="Diamond Icon" />
                  <span style="font-size: 14px; font-weight: 600;">
                    ${series[seriesIndex][dataPointIndex]} Points
                  </span>
                </div>`;
      }
    }
  };

  return (
    <div style={{height: "100%", width: "100%"}}>
          
          {seriesData.length > 0 ? (
            <ReactApexChart options={options} series={seriesData} type="bar" height={270} />
          ) : (
            // Check CSS in Home.css
            <div className='empty-error'>
              <div>
                <i class="fa-solid fa-circle-info" ></i>
                <div>No data found for this connection</div>
              </div>
            </div>
          )}   
        </div>
  )
}

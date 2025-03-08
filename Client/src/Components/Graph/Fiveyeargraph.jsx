import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { useParams } from "react-router-dom";
import Diamond from "../../Assets/Gem.svg";
import { decryptData } from "../../Utils/crypto/cryptoHelper";
import useStore from "../../store/store";

export default function Fiveyeargraph({ setTotalPoints }) {
  const {setLogopen} = useStore();
  const [seriesData, setSeriesData] = useState([]);
  const [labels, setLabels] = useState([]);
  const { uuid } = useParams();

  useEffect(() => {
    const fetchYearlyData = async () => {
      if (!uuid) {
        console.error("Selected person ID is not defined.");
        return;
      }

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API}/api/history/fetchdata`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "authorization": `Bearer ${decryptData(localStorage.getItem("token"))}`,
            },
            body: JSON.stringify({ uuid }),
          }
        );

        if(response.status == 401){
          setLogopen(true);
          return;
        }

        if (!response.ok) {
          console.error("Failed to fetch data:", response.statusText);
          return;
        }

        const result = await response.json();
        // console.log('Fetched Data:', result);

        // Extract the array from the 'data' property
        const data = result.history;
        setTotalPoints(data[0].total_points);

        // Check if 'data' is an array
        if (!Array.isArray(data)) {
          console.error("Unexpected data format:", data);
          return;
        }

        let totalPoints = 0;
        const currentYear = new Date().getFullYear();
        let maxYear = currentYear;

        // Process the data
        data.forEach((entry) => {
          if (!entry.datetime || entry.points === undefined) {
            console.error("Invalid entry format:", entry);
            return;
          }

          const entryYear = new Date(entry.datetime).getFullYear();
          if (entryYear > maxYear) {
            maxYear = entryYear;
          }
        });

        const fiveYearRanges = {};
        for (let startYear = maxYear - 4; startYear <= maxYear; startYear++) {
          const range = `${startYear - 4}-${startYear}`;
          fiveYearRanges[range] = 0;
        }

        data.forEach((entry) => {
          const entryYear = new Date(entry.datetime).getFullYear();
          Object.keys(fiveYearRanges).forEach((range) => {
            const [startYear, endYear] = range.split("-").map(Number);
            if (entryYear >= startYear && entryYear <= endYear) {
              fiveYearRanges[range] += entry.points;
            }
          });
          totalPoints += entry.points;
        });

        const labels = Object.keys(fiveYearRanges).slice(-5);
        const values = Object.values(fiveYearRanges).slice(-5);

        if (labels.length === 0 || values.length === 0) {
          console.error("No data to display.");
          return;
        }

        setLabels(labels);
        setSeriesData([{ name: "Points", data: values }]);
        // setTotalPoints(totalPoints);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchYearlyData();
  }, [uuid]);

  const totalPoints =
    seriesData[0]?.data.reduce((acc, curr) => acc + curr, 0) || 0;

  const options = {
    chart: {
      height: 350,
      type: "bar",
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    colors: ["#2867B2"],
    dataLabels: { enabled: false },
    stroke: { curve: "smooth" },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"],
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: labels, // Display the 5-year ranges as labels on the x-axis
      title: {
        text: "5 Years",
        style: {
          color: "#2867B2",
          fontSize: 16,
          fontFamily: "Open Sans, sans-serif",
        },
      },
    },
    yaxis: {
      labels: {
        style: { fontSize: "15", colors: ["#2867B2"] },
      },
      title: {
        text: "Points",
        style: {
          color: "#2867B2",
          fontSize: 16,
          fontFamily: "Open Sans, sans-serif",
        },
      },
    },
    tooltip: {
      enabled: true,
      custom: function ({ series, seriesIndex, dataPointIndex }) {
        return `<div style="display: flex; align-items: center; background-color: #f3f3f3; padding: 5px; border-radius: 5px;">
                  <img src="${Diamond}" style="width: 20px; height: 20px; margin-right: 8px;" alt="Diamond Icon" />
                  <span style="font-size: 14px; font-weight: 600;">
                    ${series[seriesIndex][dataPointIndex]} Points
                  </span>
                </div>`;
      },
    },
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      {seriesData.length > 0 ? (
        <ReactApexChart
          options={options}
          series={seriesData}
          type="bar"
          height={270}
        />
      ) : (
        <div className="empty-error">
          <div>
            <i class="fa-solid fa-circle-info"></i>
            <div>No data found for this connection</div>
          </div>
        </div>
      )}
    </div>
  );
}

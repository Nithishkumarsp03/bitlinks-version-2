import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Diamond from "../../Assets/Gem.svg";
import ReactApexChart from "react-apexcharts";
import { decryptData } from "../../Utils/crypto/cryptoHelper";
import useStore from "../../store/store";

export default function Yearlygraph({ setTotalPoints }) {
  const {setLogopen} = useStore();
  const [seriesData, setSeriesData] = useState([]);
  const [labels, setLabels] = useState([]);
  const { uuid } = useParams();

  useEffect(() => {
    const fetchYearlyData = async () => {
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
        const data = result.history;
        setTotalPoints(data[0].total_points);

        const yearlyData = {};

        // Get current year
        const currentYear = new Date().getFullYear();

        // Prepopulate the last 5 years with 0 points
        const recentLabels = [];
        for (let i = 4; i >= 0; i--) {
          const year = currentYear - i;
          yearlyData[year] = 0; // Set 0 points initially for each year
          recentLabels.push(year.toString()); // Store the label as a string
        }

        // Process the fetched data
        data.forEach((entry) => {
          const date = new Date(entry.datetime);
          const year = date.getFullYear();

          // If the year exists in the last 5 years, update its points
          if (yearlyData[year] !== undefined) {
            yearlyData[year] += entry.points;
          }
        });

        // Get values for the last 5 years
        const values = recentLabels.map((label) => yearlyData[label]);

        setLabels(recentLabels); // Set the last 5 years as labels
        setSeriesData([
          {
            name: "Points",
            data: values,
          },
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchYearlyData();
  }, [uuid]);

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
      categories: labels,
      title: {
        text: "Year",
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
        // Check CSS in Home.css
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

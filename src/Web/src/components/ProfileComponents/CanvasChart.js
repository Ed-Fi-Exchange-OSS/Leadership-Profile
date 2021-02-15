import React, { useState, useEffect, useRef } from "react";
import Chartjs from "chart.js";

const CanvasChart = (props) => {
  const chartConfig = {
    type: "horizontalBar",
    data: {
      labels: ["Staff Score", "Distric Avg", "Distric Max"],
      datasets: [
        {
          data: [
            props.data.staffScore,
            props.data.districtAvg,
            props.data.districtMax,
          ],
          backgroundColor: [
            "rgba(11, 110, 0, 0.2)",
            "rgba(255, 166, 0, 0.2)",
            "rgba(0, 136, 255, 0.2)",
          ],
          borderColor: [
            "rgba(11, 110, 0,1)",
            "rgba(255, 166, 0, 1)",
            "rgba(0, 136, 255, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        xAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
      legend: {
        display: false,
      },
    },
  };

  const chartContainer = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    if (chartContainer && chartContainer.current) {
      const newChartInstance = new Chartjs(chartContainer.current, chartConfig);
      setChartInstance(newChartInstance);
    }
  }, [chartContainer]);

  return <canvas width="600" height="200" ref={chartContainer} />;
};

export default CanvasChart;

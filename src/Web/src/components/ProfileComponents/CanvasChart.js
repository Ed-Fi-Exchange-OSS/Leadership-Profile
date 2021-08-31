import React, { useState, useEffect, useRef } from "react";
import Chartjs from "chart.js";

const CanvasChart = (props) => {
  return(<div></div>);

  // var periods = []; 
  // var datasets = [
  //   {
  //     data: [],
  //     backgroundColor: [],
  //     borderColor: [],
  //     borderWidth: 1
  //   },
  //   {
  //     data: [],
  //     backgroundColor: [],
  //     borderColor: [],
  //     borderWidth: 1
  //   },
  //   {
  //     data: [],
  //     backgroundColor: [],
  //     borderColor: [],
  //     borderWidth: 1
  //   }
  // ];

  // props.data.scoresByPeriod.forEach((e,i) => {
  //   periods.push(e.period);
    
  //   datasets[0].label = "Staff Score";
  //   datasets[0].data.push(e.staffScore);
  //   datasets[0].backgroundColor.push("rgba(11, 110, 0, 0.2)");
  //   datasets[0].borderColor.push("rgba(11, 110, 0, 1)");
    
  //   datasets[1].label = "District Avg";
  //   datasets[1].data.push(e.districtAvg);
  //   datasets[1].backgroundColor.push("rgba(255, 166, 0, 0.2)");
  //   datasets[1].borderColor.push("rgba(255, 166, 0, 1)");
    
  //   datasets[2].label = "District Max";
  //   datasets[2].data.push(e.districtMax);
  //   datasets[2].backgroundColor.push("rgba(0, 136, 255, 0.2)");
  //   datasets[2].borderColor.push("rgba(0, 136, 255, 1)");
  // });

  // const chartConfig = {
  //   type: "bar",
  //   data: {
  //     labels: periods,
  //     datasets: datasets
  //   },
  //   options: {
  //     scales: {
  //       yAxes: [
  //         {
  //           ticks: {
  //             beginAtZero: true,
  //             autoSkip: true,
  //             maxTicksLimit: 5
  //           },
  //         },
  //       ],
  //     },
  //     legend: {
  //       position: 'top',
  //       fontSize: 10
  //     },
  //   },
  // };

  // const chartContainer = useRef(null);
  // const [chartInstance, setChartInstance] = useState(null);

  // useEffect(() => {
  //   if (chartContainer && chartContainer.current) {
  //     const newChartInstance = new Chartjs(chartContainer.current, {chartConfig});
  //     setChartInstance(newChartInstance);
  //   }
  // }, [chartContainer]);

  // return <canvas width="600" height="200" ref={chartContainer} />;
};

export default CanvasChart;

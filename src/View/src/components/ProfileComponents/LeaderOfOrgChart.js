import React, { useState, useEffect, useRef } from 'react';
import Chartjs from 'chart.js';
import { Collapse, Table } from 'reactstrap';
import { PersonIcon, GeoIcon, PhoneIcon, MailIcon } from '../Icons';

const chartConfig = {
    type: 'bar',
    data: {
        labels: ["Capacity", "Values Driven", "Collaborative", "Recognition", "Effective", "Visionary", "Achievement", "Leading"],
        datasets: [{
            data: [10, 20, 30, 40, 50, 60, 70, 80]
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
};

const LeaderOfOrgChart = () => {
    const chartContainer = useRef(null);
    const [chartInstance, setChartInstance] = useState(null);

    useEffect(() => {
        if (chartContainer && chartContainer.current) {
            const newChartInstance = new Chartjs(chartContainer.current, chartConfig);
            setChartInstance(newChartInstance);
        }
    }, [chartContainer]);

    return (
        <div>
            <canvas  width="600" height="100" ref={chartContainer} />
        </div>
    );
}

export default LeaderOfOrgChart;
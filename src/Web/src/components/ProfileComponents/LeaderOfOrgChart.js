import React, { useState, useEffect, useRef } from 'react';
import Chartjs from 'chart.js';
import config from '../../config';

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

const id = 1;

const LeaderOfOrgChart = () => {
    const chartContainer = useRef(null);
    const [chartInstance, setChartInstance] = useState(null);
    const { API_URL, API_CONFIG } = config();
    
    useEffect(() => {
        if (chartContainer && chartContainer.current) {
            const newChartInstance = new Chartjs(chartContainer.current, chartConfig);
            setChartInstance(newChartInstance);
        }
    }, [chartContainer]);

    return (
        <div>
            <div className="profile-collapsible-container">
                <h2 className="profile-collapsible-header">
                    <span class="profile-collapsible-icon">
                    </span>
                    <span>Education</span>
                    <span class="profile-collapsible-down-icon">
                        <img alt="right arrow" src="/icons/arrow-ios-down.svg"/>
                    </span>
                </h2>
                <div className="collapse">
                    <div className="container profile-info-text">
                        <div className="row row-cols-3 top-buffer">
                            <div className="col">
                                <div class="card">
                                    <div class="card-body">                                
                                        <p class="card-text"> Scores Graph </p>                                
                                    </div>
                                    <div class="card-footer text-muted">
                                        Sub Category 1
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div class="card">
                                    <div class="card-body">                                
                                        <p class="card-text"> Scores Graph </p>                                
                                    </div>
                                    <div class="card-footer text-muted">
                                        Sub Category 2
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div class="card">
                                    <div class="card-body">                                
                                        <p class="card-text"> Scores Graph </p>                                
                                    </div>
                                    <div class="card-footer text-muted">
                                        Sub Category 3
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row row-cols-3 top-buffer">
                            <div className="col">
                                <div class="card">
                                    <div class="card-body">                                
                                        <p class="card-text"> Scores Graph </p>                                
                                    </div>
                                    <div class="card-footer text-muted">
                                        Sub Category 4
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div class="card">
                                    <div class="card-body">                                
                                        <p class="card-text"> Scores Graph </p>                                
                                    </div>
                                    <div class="card-footer text-muted">
                                        Sub Category 5
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>                
            </div>
            <canvas  width="600" height="100" ref={chartContainer} />
        </div>
    );
}

export default LeaderOfOrgChart;
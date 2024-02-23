// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import React, {useState, useEffect } from 'react';
import {Bar} from 'react-chartjs-2';
import { DownPointingIcon } from '../Icons';
import { Collapse} from 'reactstrap';


const EvaluationChart = (props) =>{

    const { title, data } = props;
    const [isOpen, setIsOpen] = useState(false);
    const [icon, setIcon] = useState('');
    const [ratings, setRatings] =  useState();
    const [selectedYearOption] = useState();
    const [chartDataSets, setChartDataSets] = useState([]);
    const [barColors] = useState(
        [
            'rgba(12, 101, 184, 1.0)',
            'rgba(91, 106, 208, 1.0)',
            'rgba(65, 195, 224, 1.0)',
            'rgba(161, 99, 223, 1.0)',
            'rgba(31, 142, 243, 1.0)',
            'rgba(117, 164, 210, 1.0)'
        ]
    );
    const [barBorderColors] = useState([
            'rgb(12, 101, 184)',
            'rgb(91, 106, 208)',
            'rgb(65, 195, 224)',
            'rgb(161, 99, 223)',
            'rgb(31, 142, 243)',
            'rgb(117, 164, 210)'
    ]);

    const toggle = () => setIsOpen(!isOpen);

    const [yearsToSelect, setYearsToSelect] = useState([]);

    function buildYearOptions(data)
    {
        let years =  [];
        if (yearsToSelect.length == 0) {
            data.forEach(element => {
                years.push({label:element, value:element})
            });
        }

        setYearsToSelect(years);
    }

    useEffect(()=> {
        if (data !== undefined) {
            var evaluation =  data.filter(x=> x.title === props.title);
            let title =  evaluation[0].title;
            setRatings(evaluation[0].ratingsByYear);
            let ratings = evaluation[0].ratingsByYear;
            let selectedYear =  Object.keys(ratings)[0];
            let ratingYears = Object.keys(evaluation[0].ratingsByYear);
            buildYearOptions(ratingYears);
            setChartData(selectedYear, ratings);
        }
    }, data);

    const chartData = {
        labels: [''],
        datasets: chartDataSets
      }



    function setChartData(selectedYear, ratings) {
        let dataSets = [];
        let barNumber = 0;
        let ratingsByYear = ratings[selectedYear];
        if (ratingsByYear !== undefined) {
            ratingsByYear.forEach(element => {
                let dataSet ={
                            label: element.category,
                            backgroundColor: barColors[barNumber],
                            borderColor: barBorderColors[barNumber],
                            maxBarThickness:100,
                            minBarThickness:36,
                            borderWidth: 1,
                            borderRadius: 4,
                            barPercentage: 0.5,
                            categoryPercentage: 0.5,
                            data:[element.score]
                        }
                barNumber++
                dataSets.push(dataSet);
            });
            setChartDataSets(dataSets);
        }

    }
    const updateEvaluationData = (selectedYear) => {
        setChartData(selectedYear, ratings);
    }

    const chartOptions = {
        responsive: true,
        layout: {
            padding: 25
        },
        plugins:{
            legend: {
                position: 'top',
                display: true,
                labels: {
                    boxWidth: 15,
                    boxHeight: 15,
                    padding: 25
                }
            },
            title: {
                display: false,
                text: ''
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                suggestedMax: 5,
                display:true
            },
            x: {
                display: true
            }
        }
    };

    return (
        <div className="profile-collapsible-container">
            <h2 className="profile-collapsible-header" onClick={toggle}>
                <span className="profile-collapsible-icon">{icon}</span>
                <span>{title}</span>
                <span className="profile-collapsible-down-icon"><DownPointingIcon /></span>
            </h2>
            <Collapse isOpen={isOpen}>
            <div className="chartContainer">
                <span>Year </span>
            <select id="dddEvaluationsYear" onChange={ e => updateEvaluationData(e.currentTarget.value) }
                value= {selectedYearOption}>
                {
                    yearsToSelect.map( year =>
                        <option value = { year.value } key= {year.value}>
                            { year.label }
                        </option>
                    )
                }
            </select>
                    { chartData.datasets.length > 0 ? (
                            <Bar
                                data={chartData}
                                options = {chartOptions}
                            />
                    ):
                    <div><br/>
                        <h3>No ratings found for this evaluation</h3>
                    </div>
                    }
                </div>
            </Collapse>
        </div>
      );
}

export default EvaluationChart

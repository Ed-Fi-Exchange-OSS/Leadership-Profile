import React, {useState, useEffect } from 'react';
import {Bar} from 'react-chartjs-2';
import { DownPointingIcon } from '../Icons';
import { CardTitle, Collapse, Table } from 'reactstrap';
import { Form, FormGroup, Label, Input, Row, Col, UncontrolledDropdown, DropdownToggle, DropdownMenu, Button } from 'reactstrap';


const EvaluationChart = (props) =>{

    const { title, data } = props;
    const [isOpen, setIsOpen] = useState(false);
    const [icon, setIcon] = useState('');
    const [chartCategories, setCategories] = useState();
    const [chartScores, setScores] = useState();
    const [ratings, setRatings] =  useState();
    const [evaluationYears, setEvaluationYears] = useState();
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


    function setTable(title) {

    }


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
        setTable(title);
    },[CardTitle]);

    useEffect(()=> {
        if (data !== undefined) {
            var evaluation =  data.filter(x=> x.title === props.title);
            let title =  evaluation[0].title;
            setRatings(evaluation[0].ratingsByYear);
            let ratings = evaluation[0].ratingsByYear;
            let selectedYear =  Object.keys(ratings)[0];
            let ratingYears = Object.keys(evaluation[0].ratingsByYear);
            buildYearOptions(ratingYears);
            setEvaluationYears(ratingYears);
            setChartData(selectedYear, ratings);
        }

    }, data);

    // const state = {
    //     labels: chartCategories,//['Label1','Label2','Label3','Label4','LAbel5'],
    //     datasets: [{
    //       label: '',
    //       data: chartScores,//[65, 59, 80, 81, 56, 55, 40],
    //       maxBarThickness:36,
    //       minBarThickness:36,
    //       backgroundColor: [
    //         'rgba(12, 101, 184, 1.0)',
    //         'rgba(91, 106, 208, 1.0)',
    //         'rgba(65, 195, 224, 1.0)',
    //         'rgba(161, 99, 223, 1.0)',
    //         'rgba(31, 142, 243, 1.0)',
    //         'rgba(117, 164, 210, 1.0)'
    //       ],
    //       borderColor: [
    //         'rgb(12, 101, 184)',
    //         'rgb(91, 106, 208)',
    //         'rgb(65, 195, 224)',
    //         'rgb(161, 99, 223)',
    //         'rgb(31, 142, 243)',
    //         'rgb(117, 164, 210)'

    //       ],
    //       borderWidth: 1,
    //       borderRadius:4,
    //       barPercentage: 1.0
    //     }]
    //   };


    // const state = {
    //     labels: [''],
    //     datasets: [
    //       { label: 'Rainfall1', backgroundColor: 'rgba(75,192,192,1)', borderColor: 'rgba(0,0,0,1)', borderWidth: 1, borderRadius:4, maxBarThickness:36, minBarThickness:36, data: [3.0] },
    //       { label: 'Rainfall2', backgroundColor: 'rgba(75,192,192,1)', borderColor: 'rgba(0,0,0,1)', borderWidth: 1, borderRadius:4, maxBarThickness:36, minBarThickness:36, data: [4.2] },
    //       { label: 'Rainfall3', backgroundColor: 'rgba(75,192,192,1)', borderColor: 'rgba(0,0,0,1)', borderWidth: 1, borderRadius:4, maxBarThickness:36, minBarThickness:36, data: [5.1] },
    //       { label: 'Rainfall4', backgroundColor: 'rgba(75,192,192,1)', borderColor: 'rgba(0,0,0,1)', borderWidth: 1, borderRadius:4, maxBarThickness:36, minBarThickness:36, data: [2.3] },
    //       { label: 'Rainfall5', backgroundColor: 'rgba(75,192,192,1)', borderColor: 'rgba(0,0,0,1)', borderWidth: 1, borderRadius:4, maxBarThickness:36, minBarThickness:36, data: [4.5] }
    //     ]
    //   }

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
                            label: element.category,//.length > 20 ? element.category.substring(0,20)+'...': element.category,
                            backgroundColor: barColors[barNumber],
                            borderColor: barBorderColors[barNumber],
                            maxBarThickness:36,
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
            // setCategories(ratingsByYear.map(x => x.category));
            // setScores(ratingsByYear.map(x => x.score));
        }

    }
    const updateEvaluationData = (selectedYear) => {
        setChartData(selectedYear, ratings);
    }

    // const chartOptions ={
    //         response: true,
    //         title:{
    //             display:false,
    //             text:'',
    //             fontSize:10
    //         },
    //         legend:{
    //             display:true,
    //             position:'right',
    //             padding:1000
    //         },
    //         scales: {
    //             y:{
    //                 begintAtZero : true,
    //                 suggestedMax : 5
    //             }
    //         }
    //     };

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
            <div class="chartContainer">
                <span>Year/s </span>
            <select id="dddEvaluationsYear" onChange={ e => updateEvaluationData(e.currentTarget.value) }
                value= {selectedYearOption}>
                {
                    yearsToSelect.map( year =>
                        <option value = { year.value }>
                            { year.label }
                        </option>
                    )
                }
            </select>
                    <Bar
                        data={chartData}
                        options = {chartOptions}
                    />
                </div>
            </Collapse>
        </div>
      );
}

export default EvaluationChart

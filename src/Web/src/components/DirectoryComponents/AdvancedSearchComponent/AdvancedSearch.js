import { Button } from 'bootstrap';
import React, { useState, useRef } from 'react';
import { UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, Label, Input } from 'reactstrap';
import UseAdvancedSearch from './UseAdvancedSearch';

const AdvancedSearch = (props) =>
{
    const {degrees, assignment, certifications, categories,
        setDegrees, setAssignment, setCertifications, setCategories } = UseAdvancedSearch();

    const listSpeciaizations = {};
    const [listSubCategories, getListSubCategories] = useState([]);

    const [lastClickedCat, setLastClickedCat] = useState('Select');
    const [lastClickedSub, setLastClickedSub] = useState('Select');

    const [positionStartDate, setPositionStartDate] = useState("");
    const [issuranceDate, setIssuranceDate] = useState("");
    const [rateScore, setRateScore] = useState(0);
    const [maxYears, setMaxYears] = useState(0);
    const [minYears, setMinYears] = useState(0);

    const modifiers ={
      setMaxHeight: {
          enabled: true,
          order: 890,
          fn: (data) => {
          return {
              ...data,
              styles: {
              ...data.styles,
              overflow: 'auto',
              maxHeight: '300px',
              },
          };
          },
      },
    };

    function OnClickCat(e){
        let newCategories = [...categories];
        newCategories.forEach((element,i) => {
            if(element.value == e.currentTarget.value){
                element.selected = true;
            }
            else{
                element.selected = false;
            }
        });
        setCategories(newCategories);
    //   UpDateSubCategories(e.target.value);
    }
    function OnClickSub(e){
      setLastClickedSub(e.target.innerText)
    }
    function UpDateSubCategories(categorieId){
    //   getListSubCategories(GetSubCategories(categorieId));
    }
    function Certification_OnChange(e){
        let newCertification = [...certifications];
        newCertification.forEach((element,i) => {
            if(element.value == e.currentTarget.value){
                element.checked = e.currentTarget.checked;
            }
        });
        setCertifications(newCertification);
    }
    function Position_OnChange(e){
        let newAssignment = [...assignment];
        newAssignment.forEach((element,i) => {
            if(element.value == e.currentTarget.value){
                element.checked = e.currentTarget.checked;
            }
        });
        setAssignment(newAssignment);
    }
    function Degree_OnChange(e){
        let newdegrees = [...degrees];
        newdegrees.forEach((element,i) => {
            if(element.value == e.currentTarget.value){
                element.checked = e.currentTarget.checked;
            }
        });
        setDegrees(newdegrees);
    }



    function Specialization_OnChange(e){
        // if(filterSpecializations.indexOf(e.currentTarget.value) != -1){
        //     let newfilterSpecializations = [...filterSpecializations];
        //     if(e.currentTarget.checked == false)
        //     {
        //         newfilterSpecializations.splice(filterSpecializations.indexOf(e.currentTarget.value), 1)
        //     }
        //     setFilterSpecialization(newfilterSpecializations);
        // }
        // else{
        //     let newfilterSpecializations = [...filterSpecializations];
        //     newfilterSpecializations.push(e.currentTarget.value);
        //     setFilterSpecialization(newfilterSpecializations);
        // }
    }

    function SendFilter(){
        var filterDegrees = [];
        if(Object.keys(degrees).length !== 0){
            degrees.forEach((e) => {
                if(e.checked == true)
                {
                    filterDegrees.push(e.value)
                }
            });
        }

        var filterRoles = [];
        if(Object.keys(assignment).length !== 0){
            assignment.forEach((e) => {
                if(e.checked == true)
                {
                    filterRoles.push(e.value)
                }
            });
        }

        var filterCertifications = [];
        if(Object.keys(certifications).length !== 0){
            certifications.forEach((e) => {
                if(e.checked == true)
                {
                    filterCertifications.push(e.value)
                }
            });
        }   

        var filters = {
            "MinYears": minYears,
            "MaxYears": maxYears,
            "Ratings": {
              "CategoryId": 0,
              "SubCategory": "",
              "Score": rateScore
            },
            "Certifications": {
              "IssueDate": issuranceDate,
              "Values": filterCertifications
            },
            "Assignments": {
              "StartDate": positionStartDate,
              "Values": filterRoles
            },
            "Degrees": {
              "Values": filterDegrees
            }
        }
        // ApplyFilter(filters);
        props.directoryCallback(filters);
    }
    function ClearFilters(){
        if(Object.keys(degrees).length !== 0){
            let newdegrees = [...degrees];
            newdegrees.forEach((element,i) => {
                element.checked = false
            });
            setDegrees(newdegrees);
        }
        if(Object.keys(assignment).length !== 0){
            let newAssignment = [...assignment];
            newAssignment.forEach((element,i) => {
                element.checked = false
            });
            setAssignment(newAssignment);
        }
        if(Object.keys(certifications).length !== 0){
            let newCertification = [...certifications];
            newCertification.forEach((element,i) => {
                element.checked = false;
            });
            setCertifications(newCertification);
        }

        setMinYears(0);
        setMaxYears(0);
        setPositionStartDate("");
        setRateScore(0);
    }

    return(
        <div className="advanced-filters-container">         
            <div className="col-md-12 row advanced-search-row">
                <h4 className="col-md-2">Years of Service</h4>
                <div className="col-md-5 row">
                    <div className="col-md-6 row">
                        <Label className="col-md-6">Min Years</Label>
                        <Input className="col-md-6"  onChange={event => setMinYears(event.target.value)} type="number" value={minYears}/>
                    </div>
                    <div className="col-md-6 row">
                        <Label className="col-md-6">Max Years</Label>
                        <Input className="col-md-6"  onChange={event => setMaxYears(event.target.value)} type="number" value={maxYears}/>
                    </div>
                </div>
            </div>   
            <div className="col-md-12 row advanced-search-row">
                <h4 className="col-md-2">Education</h4>
                <div className="col-md-5 row">
                    <Label className="col-md-3">Degree</Label>
                    <UncontrolledDropdown className="col-md-4">
                        <DropdownToggle caret>
                            Select
                        </DropdownToggle>
                        <DropdownMenu modifiers={modifiers} right>{
                            Object.keys(degrees).length !== 0 ? (
                                degrees.map((eduElement, index) => {
                                    return(
                                    <div><input type="checkbox" 
                                    onChange={e => {Degree_OnChange(e)}} 
                                    value={eduElement.value}
                                    checked={eduElement.checked}
                                    />
                                    <Label>{eduElement.text}</Label></div>)
                                 })
                            ): ("")
                        }
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </div>
                <div className="col-md-5 row" style={{"display": "none"}}>
                    <Label className="col-md-6">Specialization</Label>
                    <UncontrolledDropdown className="col-md-6">
                        <DropdownToggle caret>
                            Select
                        </DropdownToggle>
                        <DropdownMenu modifiers={modifiers} right>
                            {
                                // listSpeciaizations.degrees.map((eduElement, index) => {
                                //     return(<div><input type="checkbox"
                                //     onChange={e => {Specialization_OnChange(e)}}
                                //     value={eduElement.value}/>
                                //     <Label>{eduElement.text}</Label></div>)
                                // })
                            }
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </div>
            </div>
            <div className="col-md-12 row advanced-search-row">
                <h4 className="col-md-2">Position History</h4>
                <div className="col-md-5 row">
                    <Label className="col-md-3">Role</Label>
                    <UncontrolledDropdown className="col-md-4">
                        <DropdownToggle caret>
                            Select
                        </DropdownToggle>
                        <DropdownMenu modifiers={modifiers} right>
                            {
                                Object.keys(assignment).length !== 0 ? (
                                    assignment.map((positElement, index) => {
                                        return(
                                        <div><input type="checkbox" 
                                        name="desc1" 
                                        value={positElement.value}
                                        checked={positElement.checked}
                                        onChange={e => {Position_OnChange(e)}}
                                        />
                                        <Label>{positElement.text}</Label></div>)
                                    })
                                ): ("")
                            }
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </div>
                <div className="col-md-5 row">
                    <Label className="col-md-3">Start Date</Label>
                    <Input className="col-md-3" onChange={event => setPositionStartDate(event.target.value)} value={positionStartDate} type="date"></Input>
                </div>
            </div>
            <div className="col-md-12 row advanced-search-row">
                <h4 className="col-md-2">Certification</h4>
                <div className="col-md-5 row">
                    <Label className="col-md-3">Description</Label>
                    <UncontrolledDropdown className="col-md-4">
                        <DropdownToggle caret>
                            Select
                        </DropdownToggle>
                        <DropdownMenu modifiers={modifiers} right>
                            {
                                Object.keys(certifications).length !== 0 ? (
                                    certifications.map((certElement, index) => {
                                        return(<div><input type="checkbox" 
                                        name={certElement.value} 
                                        value={certElement.value}
                                        checked={certElement.checked}
                                        onChange={e => {Certification_OnChange(e)}}
                                        />
                                        <Label>{certElement.text}</Label></div>)
                                    })
                                ) : ("")
                            }
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </div>
                <div className="col-md-5 row">
                    <Label className="col-md-3">Issurance Date</Label>
                    <Input className="col-md-3" onChange={event => setIssuranceDate(event.target.value)} value={issuranceDate} type="date"></Input>
                </div>
            </div>
            <div className="col-md-12 row advanced-search-row">
                <h4 className="col-md-2">Ratings</h4>
                <div className="col-md-3 row">
                    <Label className="col-md-3">Score</Label>
                    <Input className="col-md-6"  onChange={event => setRateScore(event.target.value)} type="number" value={rateScore}/>
                </div>
                <div className="col-md-3 row">
                    <Label className="col-md-4">Category</Label>
                    <UncontrolledDropdown className="col-md-6" setActiveFromChild>
                        <DropdownToggle caret>
                            {lastClickedCat}
                        </DropdownToggle>
                        <DropdownMenu modifiers={modifiers} persist={false}>
                            <DropdownItem value="0" key={"cat-1"} onClick={OnClickCat}>Select</DropdownItem>
                            {
                                Object.keys(categories).length !== 0 ? (
                                    categories.map((catElement, index) => {
                                        return(
                                            <DropdownItem key={"cat" + index} onClick={OnClickCat} value={catElement.value} active={catElement.selected}>
                                                {catElement.text}
                                            </DropdownItem>
                                        )
                                    })
                                ): ("")
                            }
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </div>
                <div className="col-md-3 row"  style={{"display": "none"}}>
                    <Label className="col-md-6">Sub Category</Label>
                    <UncontrolledDropdown className="col-md-6" setActiveFromChild>
                        <DropdownToggle caret>
                            {lastClickedSub}
                        </DropdownToggle>
                        <DropdownMenu modifiers={modifiers}>
                            <DropdownItem value="0" onClick={OnClickSub}>Select</DropdownItem>
                            {listSubCategories.map((catElement, index) => {
                                return(
                                    <DropdownItem value={catElement.SubCategory} onClick={OnClickSub}>
                                        {catElement.SubCategory}
                                    </DropdownItem>
                                )
                            })}
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </div>
            </div>
            <div className="col-md-12 row">
                <Input type="button" className="col-md-2" value="Execute Search" onClick={() => {SendFilter()}}/>
                <Input type="button" className="col-md-1 offset-md-1" value="Clear" onClick={() => {ClearFilters()}}/>
            </div>
        </div>
    )
}

export default AdvancedSearch;
import { Button } from 'bootstrap';
import React, { useState, useRef } from 'react';
import { UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, Label, Input, Table, Row, Col } from 'reactstrap';
import UseAdvancedSearch from './UseAdvancedSearch';

const AdvancedSearch = (props) =>
{
    const {degrees, assignment, certifications, categories, subCategories,
        setDegrees, setAssignment, setCertifications, setCategories,
        setSubCategories, GetSubCategories } = UseAdvancedSearch();

    const listSpeciaizations = {};
    const [listSubCategories, getListSubCategories] = useState([]);

    let defaultCategoryText = 'Select Category';
    let defaultSubCategoryText = 'Select SubCategory';
    const [lastClickedCat, setLastClickedCat] = useState(defaultCategoryText);
    const [lastClickedSub, setLastClickedSub] = useState(defaultSubCategoryText);
    
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
              vw: '500px'
              },
          };
          },
      },
    };

    function OnClickCat(e){
        setLastClickedCat(e.target.innerText);

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
        UpDateSubCategories(e.currentTarget.value);
    }
    function OnClickSub(e){
        setLastClickedSub(e.target.innerText);

        let newSubCategories = [...subCategories];
        newSubCategories.forEach((element,i) => {
            if(element.value == e.currentTarget.value){
                element.selected = true;
            }
            else{
                element.selected = false;
            }
        });
        setSubCategories(newSubCategories);
    }
    function UpDateSubCategories(categorieId){
        GetSubCategories(categorieId);
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

        var catId = 0;
        if(Object.keys(categories).length !== 0){
            categories.forEach((e) => {
                if(e.selected == true)
                {
                    catId = e.value;
                }
            });
        } 

        var subCatId = "";
        if(Object.keys(subCategories).length !== 0){
            subCategories.forEach((e) => {
                if(e.selected == true)
                {
                    subCatId = e.value;
                }
            });
        } 

        var filters = {
            "MinYears": minYears,
            "MaxYears": maxYears,
            "Ratings": {
              "CategoryId": catId,
              "SubCategory": subCatId,
              "Score": rateScore
            },
            "Certifications": {
              "IssueDate": issuranceDate ? issuranceDate : null,
              "Values": filterCertifications
            },
            "Assignments": {
              "StartDate": positionStartDate ? positionStartDate : null,
              "Values": filterRoles
            },
            "Degrees": {
              "Values": filterDegrees
            }
        }
        
        props.directoryCallback(filters);
    }

    function ClearFilters(){
        if(Object.keys(degrees).length !== 0){
            let newdegrees = [...degrees];
            newdegrees.forEach((element) => {
                element.checked = false
            });
            setDegrees(newdegrees);
        }
        if(Object.keys(assignment).length !== 0){
            let newAssignment = [...assignment];
            newAssignment.forEach((element) => {
                element.checked = false
            });
            setAssignment(newAssignment);
        }
        if(Object.keys(certifications).length !== 0){
            let newCertification = [...certifications];
            newCertification.forEach((element) => {
                element.checked = false;
            });
            setCertifications(newCertification);
        }
        if(Object.keys(categories).length !== 0){

            let newCategories = [...categories];
            newCategories.forEach((element) => {
                element.selected = false;
            });
            setCategories(newCategories);
        }
        if(Object.keys(subCategories).length !== 0){

            let newSubCategories = [...subCategories];
            newSubCategories.forEach((element) => {
                element.selected = false;
            });
            setSubCategories(newSubCategories);
        }
        setMinYears(0);
        setMaxYears(0);
        setPositionStartDate("");
        setIssuranceDate("");
        setRateScore(0);
        setLastClickedCat(defaultCategoryText);
        setLastClickedSub(defaultSubCategoryText);
    }

    function setIntegersOnly(setter, value) {
        const regex = /^[0-9\b]+$/;
        
        if (regex.test(value)) {
            value = parseInt(value, 10);
            setter(value);
        }
    }    

    return(
        <div className="container advanced-filters-container">
            <div className="row">
                <div className="col">
                    <div className="row">
                        <div className="col">
                            <div className="row control-spacing">
                                <div className="col-5">
                                    <h5>Position History</h5>
                                </div>
                                <div className="col">
                                    <div className="row mb-2">
                                        <div className="col">
                                            <UncontrolledDropdown>
                                                <DropdownToggle className="advanced-search-dropdown-button" caret>
                                                    Select Assignments
                                                </DropdownToggle>
                                                <DropdownMenu modifiers={modifiers} right>
                                                    {
                                                        Object.keys(assignment).length !== 0 ? (
                                                            assignment.map((positElement, index) => {
                                                                return(
                                                                <div key={index}><input type="checkbox"                                                                 
                                                                style={{"display": "inline"}}
                                                                name="desc1" 
                                                                value={positElement.value}
                                                                checked={positElement.checked}
                                                                onChange={e => {Position_OnChange(e)}}
                                                                />
                                                                <Label style={{"display": "inline"}}>{positElement.text}</Label></div>)
                                                            })
                                                        ): ("")
                                                    }
                                                </DropdownMenu>
                                            </UncontrolledDropdown>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td style={{"width": "100px"}}>
                                                            <Label>Start Date</Label>    
                                                        </td>
                                                        <td>
                                                            <Input onChange={event => setPositionStartDate(event.target.value)} 
                                                            value={positionStartDate} className="date-picker-sm" type="date"></Input>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>                                        
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row control-spacing">
                                <div className="col-5">
                                    <h5>Certificates</h5>
                                </div>
                                <div className="col">
                                    <div className="row mb-2">
                                        <div className="col">
                                            <UncontrolledDropdown>
                                                <DropdownToggle className="advanced-search-dropdown-button" caret>
                                                    Select Certification
                                                </DropdownToggle>
                                                <DropdownMenu modifiers={modifiers} right>
                                                    {
                                                        Object.keys(certifications).length !== 0 ? (
                                                            certifications.map((certElement, index) => {
                                                                return(<div key={index}>
                                                                    <input type="checkbox" 
                                                                    style={{"display": "inline"}}
                                                                    name={certElement.value} 
                                                                    value={certElement.value}
                                                                    checked={certElement.checked}
                                                                    onChange={e => {Certification_OnChange(e)}}
                                                                    />
                                                                    <Label style={{"display": "inline"}}>{certElement.text}</Label>
                                                                </div>)
                                                            })
                                                        ) : ("")
                                                    }
                                                </DropdownMenu>
                                            </UncontrolledDropdown>
                                        </div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col">
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td style={{"width": "100px"}}>
                                                            <Label>Issue Date</Label>                                                        
                                                        </td>
                                                        <td>
                                                            <Input onChange={event => setIssuranceDate(event.target.value)} 
                                                    value={issuranceDate} className="date-picker-sm" type="date"></Input>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row control-spacing">
                                <div className="col-5">
                                    <h5>Education</h5>
                                </div>
                                <div className="col">
                                    <div className="row">
                                        <div className="col">
                                            <UncontrolledDropdown>
                                                <DropdownToggle className="advanced-search-dropdown-button" caret>
                                                    Select Degree
                                                </DropdownToggle>
                                                <DropdownMenu modifiers={modifiers} right>{
                                                    Object.keys(degrees).length !== 0 ? (
                                                        degrees.map((eduElement, index) => {
                                                            return(
                                                            <div key={index}><input type="checkbox"                                                             
                                                            style={{"display": "inline"}}
                                                            onChange={e => {Degree_OnChange(e)}} 
                                                            value={eduElement.value}
                                                            checked={eduElement.checked}
                                                            />
                                                            <Label style={{"display": "inline"}}>{eduElement.text}</Label></div>)
                                                        })
                                                    ): ("")
                                                }
                                                </DropdownMenu>
                                            </UncontrolledDropdown>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="row">
                        <div className="col">
                            <div className="row mt-4">
                                <div className="col-5">
                                    <h5>Ratings</h5>
                                </div>
                                <div className="col">
                                    <div className="row mb-2">
                                        <div className="col">
                                            <UncontrolledDropdown setActiveFromChild>
                                                <DropdownToggle className="advanced-search-dropdown-button" caret>
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
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col">
                                            <UncontrolledDropdown className="menu-item-button" setActiveFromChild disabled={lastClickedCat===defaultCategoryText}>
                                                <DropdownToggle className="advanced-search-dropdown-button" caret>
                                                    {lastClickedSub}
                                                </DropdownToggle>
                                                <DropdownMenu modifiers={modifiers}>
                                                    <DropdownItem value="0" onClick={OnClickSub}>Select SubCategory</DropdownItem>
                                                    {
                                                        Object.keys(subCategories).length !== 0 ? (
                                                            subCategories.map((catElement, index) => {
                                                                return(
                                                                    <DropdownItem key={index} value={catElement.value} onClick={OnClickSub} active={catElement.selected}>
                                                                        {catElement.text}
                                                                    </DropdownItem>
                                                                )
                                                            })
                                                        ): ("")
                                                    }
                                                </DropdownMenu>
                                            </UncontrolledDropdown>                                   
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-2">
                                            <Label>Score</Label>
                                        </div>
                                        <div className="col-5">
                                            <Input type="number" min="0" max="4" step="1" value={rateScore} onChange={event => {setIntegersOnly(setRateScore, event.target.value);}} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-5">
                                <div className="col-5">
                                    <h5>Years Of Service</h5>
                                </div>
                                <div className="col">
                                    <div className="row mb-2">
                                        <div className="col-2">
                                            <Label>Min</Label>
                                        </div>
                                        <div className="col-5">
                                            <Input type="number" min="0" step="1" value={minYears} onChange={event => {setIntegersOnly(setMinYears, event.target.value);}} />
                                        </div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-2">
                                            <Label>Max</Label>
                                        </div>
                                        <div className="col-5">
                                            <Input type="number" min="0" step="1" value={maxYears} onChange={event => {setIntegersOnly(setMaxYears, event.target.value);}} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mt-4 mb-2">
                <div className="col text-center">
                    <Input type="button" className="btn btn-primary w-50" value="Execute Search" onClick={() => {SendFilter()}}/>          
                </div>
                <div className="col text-center">
                    <Input type="button" className="btn btn-light w-50" value="Clear" onClick={() => {ClearFilters()}}/>      
                </div>
            </div>        
        </div>   
    )
}

export default AdvancedSearch;
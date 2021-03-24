import { Button } from 'bootstrap';
import React, { useState, useRef } from 'react';
import { UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, Label, Input } from 'reactstrap';
import UseAdvancedSearch from './UseAdvancedSearch';

const AdvancedSearch = (props) =>
{
    const {ApplyFilter, GetDegrees, GetSpeciaizations,
      GetPositionHistory, GetCertifications, GetCatergories, 
      GetSubCategories} = UseAdvancedSearch();

    const listDegrees = GetDegrees();
    const listSpeciaizations = GetSpeciaizations();
    const listPositionHistory = GetPositionHistory();
    const listCertifications = GetCertifications();
    const listCategories = GetCatergories();

    const [listSubCategories, getListSubCategories] = useState([]);

    const [lastClickedCat, setLastClickedCat] = useState('Select');
    const [lastClickedSub, setLastClickedSub] = useState('Select');

    const [filterDegrees, setFilterDegrees] = useState([]);
    const [filterSpecializations, setFilterSpecialization] = useState([]);
    const [filterRoles, setFilterRoles] = useState([]);
    const [filterCertifications, setFilterCertifications] = useState([]);

    const [positionStartDate, setPositionStartDate] = useState("");
    const [issuranceDate, setIssuranceDate] = useState("");
    const [rateScore, setRateScore] = useState("");

    const inputRef = useRef([]);

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
      setLastClickedCat(e.target.innerText);
      UpDateSubCategories(e.target.value);
    }
    function OnClickSub(e){
      setLastClickedSub(e.target.innerText)
    }
    function UpDateSubCategories(categorieId){
      getListSubCategories(GetSubCategories(categorieId));
    }
    function Certification_OnChange(e){
        if(filterCertifications.indexOf(e.currentTarget.value) != -1){
            let newfilterCertifications = [...filterCertifications];
            if(e.currentTarget.checked == false)
            {
                newfilterCertifications.splice(filterCertifications.indexOf(e.currentTarget.value), 1)
            }
            setFilterCertifications(newfilterCertifications);
        }
        else{
            let newfilterCertifications = [...filterCertifications];
            newfilterCertifications.push(e.currentTarget.value);
            setFilterCertifications(newfilterCertifications);
        }
    }
    function Position_OnChange(e){
        if(filterRoles.indexOf(e.currentTarget.value) != -1){
            let newfilterRoles = [...filterRoles];
            if(e.currentTarget.checked == false)
            {
                newfilterRoles.splice(filterRoles.indexOf(e.currentTarget.value), 1)
            }
            setFilterRoles(newfilterRoles);
        }
        else{
            let newfilterRoles = [...filterRoles];
            newfilterRoles.push(e.currentTarget.value);
            setFilterRoles(newfilterRoles);
        }
    }
    function Specialization_OnChange(e){
        if(filterSpecializations.indexOf(e.currentTarget.value) != -1){
            let newfilterSpecializations = [...filterSpecializations];
            if(e.currentTarget.checked == false)
            {
                newfilterSpecializations.splice(filterSpecializations.indexOf(e.currentTarget.value), 1)
            }
            setFilterSpecialization(newfilterSpecializations);
        }
        else{
            let newfilterSpecializations = [...filterSpecializations];
            newfilterSpecializations.push(e.currentTarget.value);
            setFilterSpecialization(newfilterSpecializations);
        }
    }
    function Degree_OnChange(e){
        if(filterDegrees.indexOf(e.currentTarget.value) != -1){
        let newfilterDegrees = [...filterDegrees];
        if(e.currentTarget.checked == false)
        {
            newfilterDegrees.splice(filterDegrees.indexOf(e.currentTarget.value), 1)
        }
        setFilterDegrees(newfilterDegrees);
        }
        else{
        let newfilterDegrees = [...filterDegrees];
        newfilterDegrees.push(e.currentTarget.value);
        setFilterDegrees(newfilterDegrees);
        }
        
        // filterDegrees.forEach((degree, index) => {
        //     const degreeItem = inputRef.current[index];
        //     if(degreeItem.value == degree)
        //     {
        //         degreeItem.checked = true;
        //     }            
        // });

    }

    function SendFilter(){
        var filters = {
            "MinYears": null,
            "MaxYears": null,
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
            },
            "SortField": 0,
            "SortBy": 0,
            "Page": 0
        }
        ApplyFilter(filters);
    }
    
    function Degree_OnClick(){
        filterDegrees.forEach((degree, index) => {
            const degreeItem = inputRef.current[index];
            if(degreeItem.value == degree)
            {
                degreeItem.checked = true;
            }            
        });
    }
    return(
        <div className="advanced-filters-container">            
            <div className="col-md-12 row advanced-search-row">
                <h4 className="col-md-2">Education</h4>
                <div className="col-md-5 row">
                    <Label className="col-md-3">Degree</Label>
                    <UncontrolledDropdown className="col-md-4">
                        <DropdownToggle caret onClick={() => {Degree_OnClick()}}>
                            Degree
                        </DropdownToggle>
                        <DropdownMenu modifiers={modifiers} right>{
                            
                                listDegrees.degrees.map((eduElement, index) => {
                                    return(
                                    <div><input type="checkbox" 
                                    onChange={e => {Degree_OnChange(e)}} 
                                    value={eduElement.Value}
                                    ref={el => inputRef.current[index] = el}
                                    />
                                    <Label>{eduElement.Text}</Label></div>)
                                 })
                            }
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </div>
                <div className="col-md-5 row">
                    <Label className="col-md-6">Specialization</Label>
                    <UncontrolledDropdown className="col-md-6">
                        <DropdownToggle caret>
                            Select
                        </DropdownToggle>
                        <DropdownMenu modifiers={modifiers} right>
                            {
                                listSpeciaizations.degrees.map((eduElement, index) => {
                                    return(<div><input type="checkbox"
                                    onChange={e => {Specialization_OnChange(e)}}
                                    value={eduElement.value}/>
                                    <Label>{eduElement.text}</Label></div>)
                                })
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
                                listPositionHistory.assignments.map((positElement, index) => {
                                    return(
                                    <div><input type="checkbox" 
                                    name="desc1" 
                                    value={positElement.value}
                                    onChange={e => {Position_OnChange(e)}}
                                    />
                                    <Label>{positElement.text}</Label></div>)
                                })
                            }
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </div>
                <div className="col-md-5 row">
                    <Label className="col-md-3">Start Date</Label>
                    <Input className="col-md-3" onChange={event => setPositionStartDate(event.target.value)} type="date"></Input>
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
                            {listCertifications.certifications.map((certElement, index) => {
                                return(<div><input type="checkbox" 
                                name={certElement.Value} 
                                value={certElement.value}
                                onChange={e => {Certification_OnChange(e)}}
                                />
                                <Label>{certElement.text}</Label></div>)
                            })}
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </div>
                <div className="col-md-5 row">
                    <Label className="col-md-3">Issurance Date</Label>
                    <Input className="col-md-3" onChange={event => setIssuranceDate(event.target.value)} type="date"></Input>
                </div>
            </div>
            <div className="col-md-12 row advanced-search-row">
                <h4 className="col-md-2">Ratings</h4>
                <div className="col-md-3 row">
                    <Label className="col-md-3">Score</Label>
                    <Input className="col-md-6"  onChange={event => setRateScore(event.target.value)} type="number"/>
                </div>
                <div className="col-md-3 row">
                    <Label className="col-md-4">Category</Label>
                    <UncontrolledDropdown className="col-md-6" setActiveFromChild>
                        <DropdownToggle caret>
                            {lastClickedCat}
                        </DropdownToggle>
                        <DropdownMenu modifiers={modifiers} persist={false}>
                            <DropdownItem value="0" onClick={OnClickCat}>Select</DropdownItem>
                            {listCategories.map((catElement, index) => {
                                return(
                                    <DropdownItem onClick={OnClickCat} value={catElement.CategoryId}>
                                        {catElement.Category}
                                    </DropdownItem>
                                )
                            })}
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </div>
                <div className="col-md-3 row">
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
                <Input type="button" className="col-md-1 offset-md-1" value="Clear"/>
            </div>
        </div>
    )
}

export default AdvancedSearch;
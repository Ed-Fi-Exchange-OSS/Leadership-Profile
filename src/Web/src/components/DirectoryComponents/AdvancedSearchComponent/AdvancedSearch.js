import React, { useState} from 'react';
import { UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, Label, Input } from 'reactstrap';
import UseAdvancedSearch from './UseAdvancedSearch';

const AdvancedSearch = (props) =>
{
    const {degrees, assignment, certifications, categories, subCategories,
        setDegrees, setAssignment, setCertifications, setCategories,
        setSubCategories, GetSubCategories } = UseAdvancedSearch();

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
            if(element.value === e.currentTarget.value){
                element.selected = true;
            }
            else{
                element.selected = false;
            }
        });
        setCategories(newCategories);
        UpdateSubcategories(e.currentTarget.value);
    }
    function OnClickSub(e){
        setLastClickedSub(e.target.innerText);

        let newSubCategories = [...subCategories];
        newSubCategories.forEach((element) => {
            element.selected = element.value === e.currentTarget.value;
        });
        setSubCategories(newSubCategories);
    }
    function UpdateSubcategories(categoryId){
        GetSubCategories(categoryId);
    }
    function CheckSelectedItem(e, elements, setter) {
        let newElements = [...elements];
        newElements.forEach((element) => {
            if (element.value == e.currentTarget.value) {
                element.checked = e.currentTarget.checked;
            }
        });
        setter(newElements);
    }
    function GetCheckedOrSelectedValues(elements) {
        return elements?.filter(x => x.checked || x.selected).map(x => x.value) ?? [];
    }
    function UncheckAllElements(elements, setter) {
        if (Object.keys(elements).length !== 0) {
            let newElements = [...elements];
            newElements.forEach((element) => {
                element.checked = false
            });
            setter(newElements);
        }
    }
    function UnselectAllElements(elements, setter) {
        if (Object.keys(elements).length !== 0) {
            let newElements = [...elements];
            newElements.forEach((element) => {
                element.selected = false
            });
            setter(newElements);
        }
    }
    function Certification_OnChange(e){
        CheckSelectedItem(e, certifications, setCertifications);
    }
    function Position_OnChange(e){
        CheckSelectedItem(e, assignment, setAssignment);
    }
    function Degree_OnChange(e){
        CheckSelectedItem(e, degrees, setDegrees);
    }
    function SendFilter(){
        let filterRoles = GetCheckedOrSelectedValues(assignment);
        let filterCertifications = GetCheckedOrSelectedValues(certifications);
        let filterDegrees = GetCheckedOrSelectedValues(null);
        let catId = GetCheckedOrSelectedValues(categories)[0] ?? 0;
        let subCatId = GetCheckedOrSelectedValues(subCategories)[0] ?? "";

        let filters = {
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
        UncheckAllElements(degrees, setDegrees);
        UncheckAllElements(assignment, setAssignment);
        UncheckAllElements(certifications, setCertifications);
        UnselectAllElements(categories, setCategories);
        UnselectAllElements(subCategories, setSubCategories);

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
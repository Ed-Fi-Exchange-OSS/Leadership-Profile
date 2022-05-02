import React from "react";
import ReactExport from "react-export-excel";

import { Button } from "reactstrap";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default class ResultsDownload extends React.Component {
        
    
    render() {

        const downloadButton = 
            <Button  style={{display: "none"}} innerRef={this.props.buttonRef}>
                Download
            </Button>;

        return (
            <ExcelFile element={downloadButton}>
                <ExcelSheet data={this.props.dataSet} name="Staff">
                    <ExcelColumn label="Name" value="fullName"/>
                    <ExcelColumn label="Position" value="assignment"/>
                    <ExcelColumn label="School" value="institution"/>
                    <ExcelColumn label="Years" value="yearsOfService"/>
                    {/* <ExcelColumn label="De" value="yearsOfService"/> */}
                    {/* <ExcelColumn label="Years" value={(col) => col.is_married ? "Married" : "Single"}/> */}
                </ExcelSheet>
            </ExcelFile>
        );
    }
}
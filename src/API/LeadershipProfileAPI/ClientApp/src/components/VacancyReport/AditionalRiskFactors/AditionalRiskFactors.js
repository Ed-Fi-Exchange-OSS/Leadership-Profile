import { Col, Row } from "reactstrap";

const AditionalRiskFactors = () => {

    return (
        <Row>
            <Col md="12">
                <h3 className="fw-bold">What additional risk factors impact vacancies?</h3>                
            </Col>
            <Col md="6">
                <h5 className="color">
                    <span className="color" style={{color: 'orange', fontWeight: 'bold', marginRight: '0.7rem'}}>10%</span>
                     Average Principal
                </h5>
                <h5>5-Year Vacancy Rate</h5>
            </Col>
            <Col md="3">                
            
            </Col>
            <Col md="3">                
            </Col>
        </Row>
    );
};

export default AditionalRiskFactors;
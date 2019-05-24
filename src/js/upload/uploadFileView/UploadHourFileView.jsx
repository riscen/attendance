import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Col, Row, Table} from 'reactstrap';
//import {BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

import "../../../css/upload/uploadFileView.css";

class UploadHourFileView extends Component {
    createChart(employee) {
        const data = employee.days;
        /*const canvasChart = document.getElementsByClassName('upload-hour-modal-chart');
        const employeeChart = new Chart(canvasChart, {
            type: 'bar',
            data: data
        });*/
    }
    
    render() {
        const employeeRows = this.props.fileData.employees.map((employee, index) => {
            return (
                <tr key={index}>
                    <td className="upload-hour-modal-batch-cell">{employee.batchNumber}</td>
                    <td className="upload-hour-modal-name-cell">{employee.name}</td>
                </tr>
                );
        })
        return (
            <React.Fragment>
                <Row>
                    <Col sm="6" style={{borderRight: "1px solid #dee2e6"}}>
                        <Row className="upload-hour-modal-general-data">
                            <Col sm="12">
                                <div className="upload-hour-modal-department">
                                    <h4>Department's name</h4>
                                </div>
                                
                                <div className="upload-hour-modal-period">
                                    <h5>Time period</h5>
                                    <div>
                                        <input type="text" value="from" readonly />
                                        {' '}--{' '}
                                        <input type="text" value="to" readonly />
                                    </div>
                                </div>
                                
                                <div className="upload-hour-modal-date">
                                    <h5>Upload date</h5>
                                    <input type="text" value="Upload date" readonly />
                                </div>
                                
                                <div className="upload-hour-modal-upload-by">
                                    <h5>Uploaded by</h5>
                                    <input type="text" value="Upload by" readonly />
                                </div>
                                
                            </Col>
                        </Row>
                        
                        <Row>
                            <Col sm="12">
                                <h1>
                                    Employee data
                                </h1>
                                <div>
                                    <canvas className="my-4 w-100" className="upload-hour-modal-chart"></canvas>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                        
                    <Col sm="6">
                        <Row>
                            <Col sm="12">
                                <h3>Employees</h3>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="modal-table-container" sm="12">
                                <div className="modal-table-header">
                                    <Table bordered responsive style={{marginBottom: "0"}}>
                                        <thead>
                                            <tr>
                                                <th className="upload-hour-modal-batch-cell">Batch</th>
                                                <th className="upload-hour-modal-name-cell">Name</th>
                                            </tr>
                                        </thead>
                                    </Table>
                                </div>
                                
                                <div className="modal-table-content">
                                    <Table bordered responsive>
                                        <tbody>
                                            {employeeRows}
                                        </tbody>
                                    </Table>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </React.Fragment>
            );
    }
}

UploadHourFileView.propTypes = {
    fileData: PropTypes.any
};

export default UploadHourFileView;

import React, { Component } from "react";
import { Button, Table } from "reactstrap";
import PropTypes from "prop-types";
import { Upload, Trash2, Eye } from "react-feather";
import { bytesToMb, mapDate } from "../util";

import "../../css/upload/uploadTable.css";

class UploadHourFileTable extends Component {
  render() {
    const buttonStyle = {
      width: "40%"
    };
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth();
    const from = {
      day: day >= 1 && day <= 15 ? 15 : 1,
      month: day >= 1 && day <= 15 ? month - 1 : month,
      year: date.getUTCFullYear()
    };
    const to = {
      day: day >= 1 && day <= 15 ? new Date(date.getFullYear(), month, 0).getDate() : 15,
      month: day >= 1 && day <= 15 ? month - 1 : month,
      year: date.getUTCFullYear()
    };
    const files = this.props.files;
    const fileRows = files.map((file, index) => {
      const uploaded = this.props.checkIfFileUploaded(file);
      return (
        <tr key={index}>
          <td>{file.name}</td>
          <td>{bytesToMb(file.size, 2)}</td>
          <td>{file.department}</td>
          <td>{`${file.timePeriod.from} to ${file.timePeriod.to}`}</td>
          <td>{file.totalEmployees}</td>
          <td>
            <div className="upload-file-button-group">
              <Button
                className="upload-file-table-btn"
                outline
                color="success"
                size="sm"
                style={buttonStyle}
                disabled={uploaded}
                onClick={() => this.props.handleUpload(file)}
              >
                <Upload />
              </Button>{" "}
              <Button
                className="upload-file-table-btn"
                outline
                color="danger"
                size="sm"
                style={buttonStyle}
                disabled={uploaded}
                onClick={() => this.props.handleFileDelete(index)}
              >
                <Trash2 />
              </Button>{" "}
              <Button
                className="upload-file-table-btn"
                outline
                color="primary"
                size="sm"
                style={buttonStyle}
                onClick={() => this.props.handleVisualization(file)}
              >
                <Eye />
              </Button>
            </div>
          </td>
        </tr>
      );
    });

    return (
      <div className="upload-file-props">
        <span className="upload-file-title">Hour files' properties</span>
        <Table bordered responsive>
          <thead>
            <tr>
              <th className="upload-hour-file-name-cell">Name</th>
              <th className="upload-hour-file-size-cell">Size</th>
              <th className="upload-hour-file-department-cell">Department</th>
              <th className="upload-hour-file-date-cell">Time period</th>
              <th className="upload-hour-file-emp-cell">Total Employees</th>
              <th className="upload-hour-file-actions-cell">Actions</th>
            </tr>
          </thead>
          <tbody>{fileRows}</tbody>
        </Table>
        {this.props.files.length > 0 ? (
          <div className="upload-files-button">
            <Button color="primary" onClick={() => this.props.handleUpload(null)}>
              Upload All
            </Button>
          </div>
        ) : (
          <React.Fragment />
        )}
      </div>
    );
  }
}

UploadHourFileTable.propTypes = {
  checkIfFileUploaded: PropTypes.func,
  files: PropTypes.any,
  handleFileDelete: PropTypes.func,
  handleUpload: PropTypes.func,
  handleVisualization: PropTypes.any
};

export default UploadHourFileTable;

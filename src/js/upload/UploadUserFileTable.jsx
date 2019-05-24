import React, { Component } from "react";
import { Button, Table } from "reactstrap";
import PropTypes from "prop-types";
import { Upload, Trash2, Eye } from "react-feather";
import { bytesToMb } from "../util";

import "../../css/upload/uploadTable.css";

class UploadUserFileTable extends Component {
  render() {
    const buttonStyle = {
      width: "40%"
    };
    const date = new Date();
    const files = this.props.files;
    const fileRows = files.map((file, index) => {
      return (
        <tr key={index}>
          <td>{file.name}</td>
          <td>{bytesToMb(file.size, 2)}</td>
          <td>{file.totalEmployees}</td>
          <td>
            <div className="upload-file-button-group">
              <Button
                className="upload-file-table-btn"
                outline
                color="success"
                size="sm"
                style={buttonStyle}
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
                onClick={() => this.props.handleVisualization(index)}
                disabled
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
        <span className="upload-file-title">User files' properties</span>
        <Table bordered responsive>
          <thead>
            <tr>
              <th className="upload-user-file-name-cell">Name</th>
              <th className="upload-user-file-size-cell">Size</th>
              <th className="upload-user-file-emp-cell">Total new users</th>
              <th className="upload-user-file-actions-cell">Actions</th>
            </tr>
          </thead>
          <tbody>{fileRows}</tbody>
        </Table>
        {this.props.files.length > 0 ? (
          <div className="upload-files-button">
            <Button color="primary" onClick={() => this.props.handleUpload(null)}>
              Upload all
            </Button>
          </div>
        ) : (
          <React.Fragment />
        )}
      </div>
    );
  }
}

UploadUserFileTable.propTypes = {
  files: PropTypes.any,
  handleClick: PropTypes.any,
  handleFileDelete: PropTypes.func,
  handleUpload: PropTypes.func
};

export default UploadUserFileTable;

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, ButtonGroup, Row, Col } from "reactstrap";
import Dropzone from "react-dropzone";
import { Cloud } from "react-feather";
import { post } from "../axios/";
import UploadHourFileTable from "./UploadHourFileTable";
import UploadUserFileTable from "./UploadUserFileTable";
import RejectedUsersTable from './RejectedUsersTable';
import HourFileToJson from "./hourFileToJson";
import UserFileToJson from "./userFileToJson";
import {
  ACCEPTED_FILE_EXT,
  UPLOAD_HOUR_FILE,
  UPLOAD_USER_FILE,
  UPLOAD_URL,
  BULK_USERS_URL
} from "../../constants/util";
import PopUpLoading from "../util/PopUpLoading";
import FileViewModal from "../util/FileViewModal";
import UploadHourFileView from "./uploadFileView/UploadHourFileView";

import "../../css/upload/upload.css";

class Upload extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hourFiles: [],
      hourFileSelected: null,
      hourFilesUploaded: [],
      processing: false,
      rejectedEmployees: [],
      uploading: false,
      userFiles: [],
      userFileSelected: null,
      userFilesUploaded: [],
      rSelected: 1
    };

    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);
    this.handleView = this.handleView.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleFileDelete = this.handleFileDelete.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.checkIfFileUploaded = this.checkIfFileUploaded.bind(this);
    this.toggleFileViewModal = this.toggleFileViewModal.bind(this);
  }

  /**@abstract Maps the dropped files into Javascript objects.
   * @param {array} droppedFiles An array of files which has been dropped.
   */
  processHourFiles(droppedFiles) {
    if (droppedFiles.length > 0) {
      console.log('Processing', droppedFiles);
      this.setState({
        processing: true
      });
      const fileToJson = new HourFileToJson(
        this.props.user,
        (json, totalFiles = droppedFiles.length) => {
          const currentIndex = json.length - 1;
          droppedFiles[currentIndex] = {
            name: droppedFiles[currentIndex].name,
            size: droppedFiles[currentIndex].size,
            department: json[currentIndex].department,
            timePeriod: {
              from: json[currentIndex].from,
              to: json[currentIndex].to
            },
            totalEmployees: json[currentIndex].employees.length,
            json: json[currentIndex]
          };
          if (json.length === totalFiles) {
            this.setState({
              hourFiles: [...this.state.hourFiles, ...droppedFiles],
              processing: false
            });
          }
        }
      );
      droppedFiles.forEach(file => {
        fileToJson.do_file(file, fileToJson.process_wb);
      });
    }
  }

  /**@abstract Maps the dropped files into Javascript objects.
   * @param {array} droppedFiles An array of files which has been dropped.
   */
  processUserFiles(droppedFiles) {
    console.log(droppedFiles);
    if (droppedFiles.length > 0) {
      const errorFiles = [];
      this.setState({
        processing: true
      });
      const fileToJson = new UserFileToJson((json, totalFiles = droppedFiles.length) => {
        const currentIndex = json.length - 1;
        droppedFiles[currentIndex] = {
            name: droppedFiles[currentIndex].name,
            size: droppedFiles[currentIndex].size,
            totalEmployees: json[currentIndex].employees.length,
            json: json[currentIndex]
          };
        if (json === '') { //This means error on file
          errorFiles.push(droppedFiles[currentIndex]);
        }
        if (json.length === totalFiles) {
            this.setState({
              userFiles: [...this.state.userFiles, ...droppedFiles],
              processing: false
            });
          }
      });
      if (errorFiles.length > 0) {
        alert(`Error: ${errorFiles.length} couldn't be uploaded`);
      }
      droppedFiles.forEach(file => {
        fileToJson.readFile(file, fileToJson.process_wb);
      });
    }
  }

  /**@abstract Upload the selected files, ensuring there's no a repeated upload.
   * @param {array} uploadFiles An array containing the files that are going to be uploaded.
   */
  uploadHourFiles(uploadFiles) {
    if (uploadFiles.length > 0) {
      let newHourFiles = this.state.hourFiles;
      let fileIndex;
      uploadFiles.forEach(file => {
        console.log("upload ", file.json);
        post(
          UPLOAD_URL,
          file.json,
          this.setState({
            uploading: true
          })
        )
          .then(res => {
            if (res.data === "ok") {
              console.log("Success");
              fileIndex = newHourFiles.findIndex(currentFile => currentFile === file);
              this.setState({
                hourFiles: [...newHourFiles.slice(0, fileIndex), ...newHourFiles.slice(fileIndex + 1)],
                hourFilesUploaded: uploadFiles
              });
            } else if (res.data === "fail") {
              console.log("Processing error");
  
            } else {
              console.log("Other thing (file duplicate)");
            }
            this.setState({
              uploading: false
            });
          })
          .catch(error => {
            console.log("Connection error");
            this.setState({
                uploading: false
              });
          });
      });
      /*this.setState({
        uploading: uploading,
        hourFiles: newHourFiles,
        hourFilesUploaded: uploadFiles
      });*/
    }
  }

  validateEmployeeFile(empFile) {
    const employees = empFile.json.employees;
    const rightEmps = [];
    const wrongEmps = [];
    const emps = {
      rightEmps: [],
      wrongEmps: []
    }
    for (let i = 0; i < employees.length; i++) {
      if (this.validateEmployee(employees[i])) {
        emps.rightEmps.push(employees[i]);
      }
      else {
        emps.wrongEmps.push(employees[i]);
      }
    }
    return emps;
  }

  validateEmployee(employee) {
    if (employee.batchNumber.length !== 3) {
      return false;
    }
    else if (employee.sapId.length !== 8) {
      return false;
    }
    //Validate fields
    //email
    //reportingManager sapId
    return true;
  }

  /**@abstract Upload the selected files, ensuring there's no a repeated upload.
   * @param {object} uploadFiles An array containing the files that are going to be uploaded.
   */
  uploadUserFiles(uploadFiles) {
    if (uploadFiles.length > 0) {
      let newUserFiles = this.state.userFiles;
      let fileIndex;
      uploadFiles.forEach(file => {
        //console.log("upload ", file.json.employees) //Can be change?;
        const {rightEmps, wrongEmps} = this.validateEmployeeFile(file);
        //console.log({rightEmps, wrongEmps})
        
        this.setState({
          uploading: true,
          rejectedEmployees: [...this.state.rejectedEmployees, ...wrongEmps]
        })
        post(
          BULK_USERS_URL,
          rightEmps
        )
          .then(res => {
            fileIndex = newUserFiles.findIndex(currentFile => currentFile === file);
            this.setState({
              uploading: false,
              userFiles: [...newUserFiles.slice(0, fileIndex), ...newUserFiles.slice(fileIndex + 1)],
              userFilesUploaded: uploadFiles
            });
            console.log(res.data);
            //fileIndex = newUserFiles.findIndex(currentFile => currentFile === file);
        //newUserFiles = [...newUserFiles.slice(0, fileIndex), ...newUserFiles.slice(fileIndex + 1)];
            /*if (res.data === "ok") {
              console.log("Success");
              //Uncomment these lines in prod
              fileIndex = newUserFiles.findIndex(currentFile => currentFile === file);
        newUserFiles = [...newUserFiles.slice(0, fileIndex), ...newUserFiles.slice(fileIndex + 1)];
            } else if (res.data === "fail") {
              console.log("Processing error");
            } else {
              console.log("Other thing");
            }*/
          })
          .catch(error => {
            this.setState({
              uploading: false
            });
            console.log("Connection error:", error);
          });
        //Remove these linen in prod
        //fileIndex = newUserFiles.findIndex(currentFile => currentFile === file);
        //newUserFiles = [...newUserFiles.slice(0, fileIndex), ...newUserFiles.slice(fileIndex + 1)];
      });
      /*this.setState({
        uploading: false,
        userFiles: newUserFiles,
        userFilesUploaded: uploadFiles
      });*/
    }
  }

  /**@abstract Changes the state depending on the selected option.
   * @param {number} rSelected The value of the button clicked.
   */
  onRadioBtnClick(rSelected) {
    this.setState({
      rSelected
    });
  }

  /**@abstract Handles table row's click
   * @param {file} file The file which is going to be viewed.
   */
  handleView(file) {
    switch (this.state.rSelected) {
      case UPLOAD_HOUR_FILE:
        console.log("Click hour", file);
        this.setState({
          hourFileSelected: file.json
        });
        break;
      case UPLOAD_USER_FILE:
        console.log("Click user", file);
        this.setState({
          userFileSelected: file.json
        });
        break;
      default:
        break;
    }
  }

  /**@abstract Handles drop event, and appends the given files to the list
   * @param {object} files List of files
   */
  handleDrop(files) {
    switch (this.state.rSelected) {
      case UPLOAD_HOUR_FILE:
        this.processHourFiles(files.length ? files : [files]);
        break;
      case UPLOAD_USER_FILE:
        this.processUserFiles(files.length ? files : [files]);
        break;
      default:
        break;
    }
  }

  /**@abstract Deletes a file from the file list the component uses.
   * @param {number} fileIndex File's index
   */
  handleFileDelete(fileIndex) {
    switch (this.state.rSelected) {
      case UPLOAD_HOUR_FILE:
        this.setState({
          hourFiles: [
            ...this.state.hourFiles.slice(0, fileIndex),
            ...this.state.hourFiles.slice(fileIndex + 1)
          ]
        });
        break;
      case UPLOAD_USER_FILE:
        this.setState({
          userFiles: [
            ...this.state.userFiles.slice(0, fileIndex),
            ...this.state.userFiles.slice(fileIndex + 1)
          ]
        });
        break;
      default:
        break;
    }
  }

  /**@abstract Handles the upload of the given file(s)
   * @param {object} files The file(s) that are going to be uploaded. If null, the state's files are uploaded (ALL).
   */
  handleUpload(files) {
    switch (this.state.rSelected) {
      case UPLOAD_HOUR_FILE:
        this.uploadHourFiles(files ? [files] : this.state.hourFiles);
        break;
      case UPLOAD_USER_FILE:
        this.uploadUserFiles(files ? [files] : this.state.userFiles);
        break;
      default:
        break;
    }
  }

  /**@abstract Checks if the given file has been uploaded.
   * @param {object} file The file you want to check if was uploaded.
   * @param {object} files The list of files which has been uploaded (state.hourFilesUploades, state.userFilesUploaded).
   * @returns {boolean} True if it was uploaded, false otherwise.
   */
  checkIfFileUploaded(file) {
    const files =
      this.state.rSelected === UPLOAD_HOUR_FILE
        ? this.state.hourFilesUploaded
        : this.state.userFilesUploaded;
    for (let i = 0; i < files.length; i++) {
      if (file === files[i]) {
        return true;
      }
    }
    return false;
  }

  toggleFileViewModal() {
    this.setState({
      hourFileSelected: null,
      userFileSelected: null
    });
  }

  render() {
    const dndStyle = {
      width: "100%",
      height: "100px",
      border: "1px solid #dbdbdb",
      borderRadius: "5px",
      cursor: "pointer"
    };
    return (
      <div className="container-fluid upload-container">
        <h1 className="h2">Upload file</h1>
        <div className="upload-toggle-button">
          <ButtonGroup className="upload-button-group">
            <Button
              className="upload-option-btn"
              color={this.state.rSelected === UPLOAD_HOUR_FILE ? "primary" : "secondary"}
              onClick={() => this.onRadioBtnClick(UPLOAD_HOUR_FILE)}
              active={this.state.rSelected === UPLOAD_HOUR_FILE}
            >
              Hour file
            </Button>
            <Button
              className="upload-option-btn"
              color={this.state.rSelected === UPLOAD_USER_FILE ? "primary" : "secondary"}
              onClick={() => this.onRadioBtnClick(UPLOAD_USER_FILE)}
              active={this.state.rSelected === UPLOAD_USER_FILE}
            >
              User file
            </Button>
          </ButtonGroup>
        </div>

        <Row className="upload-table-container">
          <Col cm="12">
            {this.state.rSelected === UPLOAD_HOUR_FILE ? (
              <UploadHourFileTable
                checkIfFileUploaded={this.checkIfFileUploaded}
                files={this.state.hourFiles}
                handleVisualization={this.handleView}
                handleFileDelete={this.handleFileDelete}
                handleUpload={this.handleUpload}
              />
            ) : (
              <UploadUserFileTable
                files={this.state.userFiles}
                handleVisualization={this.handleView}
                handleFileDelete={this.handleFileDelete}
                handleUpload={this.handleUpload}
              />
            )}
          </Col>
        </Row>

        <Row>
          <Col sm="12">
            <div className="upload-file-dnd-container">
              <span className="upload-file-title">Choose file(s)</span>
              <div className="upload-dnd">
                <Dropzone accept={ACCEPTED_FILE_EXT} onDrop={this.handleDrop} style={dndStyle}>
                  <span className="upload-dnd-label">
                    Click here to select a file or drop it here
                  </span>
                  <br />
                  <span className="upload-dnd-icon">
                    <Cloud size={50} />
                  </span>
                </Dropzone>
              </div>
            </div>
          </Col>
        </Row>
        
        <Row>
          <Col sm="12">
            <RejectedUsersTable style={this.state.rejectedEmployees.length > 0 ? {display: "block"} : {display: "none"}} />
          </Col>
        </Row>
        
        {this.state.hourFileSelected !== null || this.state.userFileSelected !== null ?
          <FileViewModal 
            className="upload-file-view-modal"
            isOpen={this.state.hourFileSelected !== null || this.state.userFileSelected !== null}
            title={this.state.hourFileSelected !== null ? "Hour File View" : "User File View"} 
            toggle={this.toggleFileViewModal}
          >
            <UploadHourFileView 
              fileData={this.state.hourFileSelected ? 
                this.state.hourFileSelected : 
                this.state.userFileSelected} 
            />
          </FileViewModal>
          : 
          <React.Fragment />
        }

        {this.state.uploading || this.state.processing ? (
          <PopUpLoading
            className="uploading-modal"
            isOpen={this.state.uploading || this.state.processing}
            modalTitle={`${this.state.processing ? "Processing" : "Uploading"} your files`}
          >
            <div className="upload-loading">
              <img
                className="upload-loading"
                src={require("../../imgs/hourglass.gif")}
                alt="Loading"
                style={{ width: "30%", height: "auto" }}
              />
            </div>
          </PopUpLoading>
        ) : (
          <React.Fragment />
        )}
      </div>
    );
  }
}

Upload.propTypes = {};

export default Upload;

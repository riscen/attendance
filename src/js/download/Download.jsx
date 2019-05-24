/**
 * Start: 22-10-2018
 * Author: Raul Ivan Sanchez Contreras
 * Last modified: 22-10-2018
 */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import {get, post } from "../axios/";
import axios from 'axios';
import { Table, Button } from "reactstrap";
import { Eye, ArrowDownCircle } from "react-feather";
import DownloadFilter from "./DownloadFilter";
import { mapDate } from "../util/";
import { saveAs } from 'file-saver';
import Blob from 'blob';
import {
  DOWNLOAD_REPORT
} from "../../constants/util";

import "../../css/download.css";

class Download extends Component {
  constructor() {
    super();

    this.state = {
      files: [],
      filters: {}
    };

    this.seeFile = this.seeFile.bind(this);
    this.downloadFile = this.downloadFile.bind(this);
    this.handleFilterDataChange = this.handleFilterDataChange.bind(this);
  }

  seeFile(fileId) {
    console.log("Select: ", fileId);
  }
  
  extractFileName = (contentDispositionValue) => {
    let filename = "";
    if (contentDispositionValue && contentDispositionValue.indexOf('attachment') !== -1) {
      let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      let matches = filenameRegex.exec(contentDispositionValue);
      if (matches != null && matches[1]) {
         filename = matches[1].replace(/['"]/g, '');
      }
    }
    return filename;
  }

  downloadFile(file) {
    const from = file.timePeriod.from;
    const to = file.timePeriod.to;
    const payload = {
      department: file.department,
      from: this.mapDateObjectToString(from),
      to: this.mapDateObjectToString(to)
    };
    let fileJson = JSON.stringify(payload);
    //axios.get('/page', { params: { hello: 'world' } });
    //Will make a GET to /page?hello=world.
    //http://www.react-lalovar.c9users.io/downloadReport?fileName="{"department":"DEV ROOM 4 WITH SECURE AC","from":"13/08/2018","to":"19/08/2018"}"
    get(DOWNLOAD_REPORT, {
        responseType: 'arraybuffer',
        params: { fileName: fileJson },
        headers: {
        'Accept': 'application/vnd.ms-excel;charset=utf-8'
        }
      })
      .then(response => {
        //extract file name from Content-Disposition header
        let filename = this.extractFileName(response.headers['content-disposition']);
        if(typeof(filename) == "undefined" || filename == ""){
          filename = "Finance.xls";
        }

        const blob = new Blob([response.data], { type: 'application/vnd.ms-excel;charset=utf-8' })
        saveAs(blob, filename);
      })
      .catch(error => {
        console.log("error", error);
        this.setState({
          error: true,
          errorDescription: "Verify your internet connection!"
        });
      });
  }

  handleFilterDataChange(filters) {
    this.setState({
      filters: filters
    });
  }

  mapDateToObject(dateStr) {
    return {
      day: parseInt(dateStr.substr(0, 2)),
      month: parseInt(dateStr.substr(3, 2)),
      year: parseInt(dateStr.substr(6))
    };
  }
  
  mapDateObjectToString(date) {
    const day = date.day > 9 ? date.day : `0${date.day}`;
    const month = date.month > 9 ? date.month : `0${date.month}`;
    return `${day}/${month}/${date.year}`;
  }

  componentWillMount() {
    //Load files
    get("http://www.react-lalovar.c9users.io/getTimeReports")
      .then(res => {
        //Map data to work with correctly with the actual code
        const files = res.data.map((file) => {
          return {
            department: file.department,
            employees: file.employees,
            timePeriod: {
              from: this.mapDateToObject(file.from),
              to: this.mapDateToObject(file.to)
            },
            uploadDate: file.uploadDate,
            uploadedBy: file.uploadedBy
          }
        });
        this.setState({
          files: files
        }, console.log(files));
      })
      .catch(error => {
        console.log("error", error);
        this.setState({
          error: true,
          errorDescription: "Verify your internet connection!"
        });
      });

    /*let files = [],
      user,
      timePeriod;
    for (let i = 0; i < 100; i++) {
      user = i < 50 ? "riscen sanchez" : "raul sanchez";
      timePeriod = {
        from: {
          year: 2018,
          month: 11,
          day: i % 2 ? 1 : 15
        },
        to: {
          year: 2018,
          month: 11,
          day: i % 2 ? 15 : 30
        }
      };

      files = [
        ...files,
        {
          id: i,
          uploadedBy: user,
          department: "department" + Math.floor(i / 10),
          timePeriod: timePeriod,
          uploadDate: "22/10/2018"
        }
      ];
    }
    this.setState({
      files: files
    });*/
  }

  componentWillUnmount() {
    console.log("Unmount download component");
  }

  render() {
    let marginTop = {
      marginTop: "2%"
    };
    const filters = this.state.filters;
    //const filteredFiles = this.state.files;
    const filteredFiles = this.state.files.filter(file => {
      if (
        file.uploadedBy.includes(filters.uploadedBy) &&
        file.department.includes(filters.department) &&
        (file.timePeriod.from.year > filters.timePeriod.from.year ||
          (file.timePeriod.from.year === filters.timePeriod.from.year &&
            file.timePeriod.from.month >= filters.timePeriod.from.month)) &&
        (file.timePeriod.to.year < filters.timePeriod.to.year ||
          (file.timePeriod.to.year === filters.timePeriod.to.year &&
            file.timePeriod.to.month <= filters.timePeriod.to.month)) &&
        file.uploadDate.includes(filters.uploadDate)
      )
        return file;
    });
    const files = filteredFiles.map((file, index) => {
      return (
        <tr key={index} className="file-download-table-row">
          <td>{file.uploadedBy}</td>
          <td>{file.department}</td>
          {/*<td>{`${mapDate(file.timePeriod.from)} to ${mapDate(file.timePeriod.to)}`}</td>*/}
          <td>{`${this.mapDateObjectToString(file.timePeriod.from)} to 
          ${this.mapDateObjectToString(file.timePeriod.to)}`}</td>
          <td>{file.uploadDate}</td>
          <td>
            <div className="button-container">
              <Button outline color="primary" onClick={f => this.seeFile(file)}>
                <Eye />
              </Button>{" "}
              <Button outline color="primary" onClick={f => this.downloadFile(file)}>
                <ArrowDownCircle />
              </Button>
            </div>
          </td>
        </tr>
      );
    });
    return (
      <div className="container-fluid download-container">
        <h1 className="h2">Finance Files</h1>
        <div className="row">
          <div className="col-sm-12 d-none d-md-block" style={marginTop}>
            <div className="download-description">
              <label htmlFor="getPath">Select the file to download</label>
            </div>
            <DownloadFilter handleFilterDataChange={this.handleFilterDataChange} />
            <div className="file-download-table">
              <Table bordered responsive>
                <thead>
                  <tr>
                    <th className="file-download-table-cell">Uploaded by</th>
                    <th className="file-download-table-cell">Department</th>
                    <th className="file-download-table-cell">Time Period</th>
                    <th className="file-download-table-cell">Upload Date</th>
                    <th className="file-download-table-cell">Actions</th>
                  </tr>
                </thead>
                <tbody>{files}</tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Download;

import XLSX from "xlsx";
import { getNewFormattedDate } from "../util";

class UserFileToJson {
  /**@abstract Class' constructor
   * @param {function} callback A callback which is going to be executed once the processing is done.
   * @param {number} totalFiles The number of files that are going to be uploaded in one request.
   */
  constructor(callback, totalFiles) {
    this.output = "";
    this.callback = callback;
    this.reportJson = [];
    this.userProps = [];
  }

  /**@abstract Reads the given excel file and returns an object with all the employees' data.
   * @param {object} file An excel file with all the employee's data.
   */
  readFile(file) {
    let that = this;
    let reader = new FileReader();
    reader.onload = function(e) {
      let data = e.target.result;
      let binaryFile = XLSX.read(data, { type: "binary" });
      that.processWorkBook.call(that, binaryFile);
    };
    reader.readAsBinaryString(file);
  }

  /**@abstract Processes a workbook, and maps its information into a javascript object.
   * @param {object} workBook An excel binary workbook.
   */
  processWorkBook(workBook) {
    let arr = [];
    this.output = this.toCsv(workBook).split("\n");
    this.output.forEach(line => {
      arr = [...arr, ...line.split(",")];
    });
    this.output = arr;
    this.reportJson = [...this.reportJson, this.processData()];
    this.callback(this.reportJson);
  }

  /**@abstract Converts a workbook into csv's style object
   * @param {object} workBook An excel binary workbook.
   * @returns {object} An object representing a csv file.
   */
  toCsv(workbook) {
    let result = [];
    workbook.SheetNames.forEach(function(sheetName) {
      let csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
      if (csv.length) {
        result.push(csv);
      }
    });
    return result.join("\n");
  }

  /**@abstract Maps the available data into a Javascript object.
   * @returns {object} A Javascript object.
   */
  processData() {
    //WRONG
    //Use headers of temp file.
    if(this.validateFile(this.output.slice(0, 10))) {
      this.shiftJump(10);
      const jsonMaster = {
        employees: this.getEmployees()
      };
      return jsonMaster;
    }
    return '';//Error
  }

  //Get the headers from a template file, so it can be changed without using the code.
  //To check if the file is correct, see the template and compare with headers
  validateFile(headers) {
    //Compare headers HERE
    if(headers.length !== 10) {
      return false;
    }
    this.userProps = headers;
    return true;
  }

  /**@abstract Maps all the employees with the given info.
   * @returns {object} An array with all the employees.
   */
  getEmployees() {
    const employees = [];
    while (this.output.length > 1) {
      const user = {};
      /*const user = {
        batchNumber: this.popValue(),
        email: this.popValue(),
        employeeName: this.getEmpName(),
        client: this.popValue(),
        password: this.popValue(),
        projectCode: this.popValue(),
        projectName: this.popValue(),
        reportingManager: this.popValue(),
        role: this.popValue(),
        sapId: this.popValue()
      };*/
      this.userProps.forEach(prop => {
        user[prop] = (prop === 'employeeName') ?  //Hardcoded >:(
          this.getEmpName() :
          this.popValue();
      });
      employees.push(user);
    }
    return employees;
  }

  /**@abstract Maps the employee's name. NOTE: Names are comming with extra double quotes ("), this is the main reason for this function.
   * The files, in the future, may not come with this weird format.
   * This is a problem coming from fill in the file.
   * Example: lastName: "name, firstName: name"
   * @returns {string} A mapped name
   */
  getEmpName() {
    const lastName = this.popValue();
    const firstName = this.popValue();
    return (firstName.slice(-1) === '"' ? firstName.slice(0, -1) : firstName) + " " + 
      (lastName[0] === '"' ? lastName.slice(1) : lastName);
  }

  /**@abstract Pops the top value from the output attribute.
   * @returns {string} The top of the array's value.
   */
  popValue() {
    const value = this.output[0];
    this.output.shift();
    return value;
  }

  /**@abstract Removes n elements from the output attribute.
   * @param {number} iterator The number of elements which will be removed.
   */
  shiftJump(iterator) {
    for (let paso = 0; paso < iterator; paso++) {
      this.output.shift();
    }
  }
}

export default UserFileToJson;

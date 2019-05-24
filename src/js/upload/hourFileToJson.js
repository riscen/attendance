import { getNewFormattedDate } from "../util";
import XLSX from "xlsx";

class HourFileToJson {
  constructor(user, callback, totalFiles) {
    this.user = user;
    this.output = "";
    this.callback = callback;
    this.reportJson = [];
  }

  do_file(file, proccessFile) {
    let that = this;
    let reader = new FileReader();
    reader.onload = function(e) {
      let data = e.target.result;
      let binaryFile = XLSX.read(data, { type: "binary" });
      proccessFile.call(that, binaryFile);
    };
    reader.readAsBinaryString(file);
  }

  to_csv(workbook) {
    let result = [];
    workbook.SheetNames.forEach(function(sheetName) {
      let csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
      if (csv.length) {
        result.push(csv);
      }
    });
    return result.join("\n");
  }

  async process_wb(wb) {
    //OUTPUT
    this.output = "";
    this.output = await this.to_csv(wb);
    this.output = this.output
      .split(",")
      .join(" ")
      .match(/\S+/g);
    this.reportJson = [...this.reportJson, this.processData(this.output)];
    
    //console.log(this.reportJson.slice(-1)); //FOR DEVELOP PORPUSES
    console.log(this.reportJson);
    this.callback(this.reportJson);
  }

  processData() {
    this.shiftJump(21);

    let jsonMaster = {
      uploadedBy: this.user,
      uploadDate: getNewFormattedDate(),
      from: this.shiftAppendReturnJump(1, 2),
      to: this.shiftAppendReturnJump(1, 3),
      department: this.shiftAppendReturnJump(6, 0),
      employees: []
    };
    while (this.output.length > 1) {
      let employee = this.processSingleEmployee();
      jsonMaster.employees.push(employee);
    }
    return jsonMaster;
  }

  shiftJump(iterator) {
    for (let paso = 0; paso < iterator; paso++) {
      this.output.shift();
    }
  }

  shiftAppendReturnJump(iterator, saltos) {
    let cadena = "";
    for (let paso = 0; paso < iterator; paso++) {
      cadena += this.output.shift() + " ";
    }
    this.shiftJump(saltos);
    return this.removeFinalWhiteSpaces(cadena);
  }

  removeFinalWhiteSpaces(cad) {
    if (cad.substr(cad.length - 1, cad.length) == " ") {
      return cad.substr(0, cad.length - 1);
    }
    return cad;
  }

  processSingleEmployee() {
    let employee = {};
    let nameNBatch = this.empGetNameAndBatch();
    employee.name = nameNBatch.name;
    employee.batchNumber = nameNBatch.batch;
    this.shiftJump(6);
    employee.days = this.empGetDays();

    return employee;
  }

  empGetDays() {
    //here all the days for each employee are storage
    let dayArr = []; 
    //REGEX for comparation porpuses
    let hourReg = /^[\*]?[\*]?\d*:\d*$/;
    //this ban checks if the first entrance of the day is normal or nigthShift
    let banShiftMorning = false;
    
    //its gonna stop when there were no more day to read
    while (true) {
      //each day this ban will check if theres exists mark as **
      let banShiftNigth = false;
      
      // each day starts empty
      let day = {};
      // the time record where the hours are gonna be place
      day.timeRecord = [];
      //the total worked hours start at 00:00
      day.totalWorked = "0:0";
      //the first token (output[0]) is the name of the day (monday, tues...)
      day.dateCalendar = this.output[0];
      let targetDay = this.output[0];
      // the nightShiftTemp var is used to save the last hour if its theres no **XX:XX
      let nightShiftTemp = "";
      
      // this condition checks if theres an entrance *XX:XX
      if( this.output[2].charAt(0) != '*' && this.output[2].charAt(0) != '-'){
        banShiftMorning=true;
      } 
      
      //while the target variable is the same as the current checked day
      while (targetDay === day.dateCalendar) {
        this.shiftJump(2); //it jumps the date and nameDay tokens
        let ban = this.output.shift();//used for keep that value

        //if the ban is was set as true before its gonna add the hour to totalWorked
        //and its gonna add the record 00:00
        if(banShiftMorning){
            day.timeRecord.push("00:00");
            day.totalWorked = this.sumaHoras("00:00", ban);
            banShiftMorning = false;
          }
        //if the regex matches then analize else its an absence day
        if (hourReg.test(ban)) {
          if(!banShiftNigth){
            banShiftNigth = this.checkExits(ban)
          }
          //I/0 hours are procces by possition
          let temp = "";
          temp += ban;
          nightShiftTemp = temp;
          if (day.timeRecord.indexOf(this.cleanHour(temp)) === -1) // "indexOf" instead of "includes" method due to compatibility issues
            day.timeRecord.push(this.cleanHour(temp));
          ban = this.output.shift();
          if (hourReg.test(ban)) {
            //si hay segunda hora i/o
            if (day.timeRecord.indexOf(this.cleanHour(ban)) === -1)
              day.timeRecord.push(this.cleanHour(ban));
            this.shiftJump(1);
          }
          //once the hours are procces we add the total token to the totalWorked
          day.totalWorked = this.sumaHoras(day.totalWorked, this.output.shift());
        } else {
          this.shiftJump(4);
          break; // absence
        }
        targetDay = this.output[0];
      }//END WHILE TARGET DAY
      //if ban is false it means there were not exit token **XX:XX
      if(!banShiftNigth){
            let horaASumar = this.sumaHoras("24:00", this.cleanHour(nightShiftTemp), '-');
            day.timeRecord.push("23:59");
            day.totalWorked = this.sumaHoras(day.totalWorked, horaASumar);
          }
      dayArr.push(day);
      if (this.output[0] == "Summaries") {
        this.shiftJump(26);
        break;
      }
    }//END WHILE TRUE
    return dayArr;
  }

  empGetNameAndBatch() {
    this.shiftJump(3);
    let res = {};
    let emp = "";
    while (true) {
      if (this.output[0].substr(0, 1) === "#") {
        res.batch = this.output[0].substr(1, this.output[0].length - 2);
        this.output.shift();
        break;
      }
      emp += this.output.shift() + " ";
    }
    res.name = emp.substr(1, emp.length - 2);
    return res;
  }

  checkExits(hora){
    if (hora.substr(0, 2) == "**") {
      return true
    }
    return false
  }

  cleanHour(hora) {
    if (hora.substr(0, 1) == "*") {
      return this.cleanHour(hora.substr(1, hora.length));
    }
    return hora;
  }

  sumaHoras(horas1, horas2, operador = '+') {
    horas1 = horas1.split(":");
    horas2 = horas2.split(":");
    let horatotale = new Array();
    for (let a = 0; a < 3; a++) {
      horas1[a] = isNaN(parseInt(horas1[a])) ? 0 : parseInt(horas1[a]);
      horas2[a] = isNaN(parseInt(horas2[a])) ? 0 : parseInt(horas2[a]);
      operador == '+' ?
        horatotale[a] = horas1[a] + horas2[a]:
        horatotale[a] = horas1[a] - horas2[a];
    }
    let horatotal = new Date();
    horatotal.setHours(horatotale[0]);
    horatotal.setMinutes(horatotale[1]);
    let minutos = horatotal.getMinutes();
    if (minutos < 10) minutos = "0" + minutos;
    return horatotal.getHours() + ":" + minutos;
  }
}

export default HourFileToJson;

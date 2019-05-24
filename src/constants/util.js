export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

  export const ACCEPTED_FILE_EXT = ".xls, .csv, .xlsx";
  //export const UPLOAD_HOUR_FILE = "12:00";
  //export const UPLOAD_USER_FILE = "yes";
  //export const UPLOAD_URL = "https://react-lalovar.c9users.io/uploadTime";

export const MONTHS_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

export const WEEK_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];



export const DAY_TYPE = {
  SHIFT_NACC: {
    symbol: "S",
    name: "Shift Nacc",
    description: "Shift (13pm-21pm)"
  },
  MORNING_SHIFT: {
    symbol: "MS",
    name: "Morning Shift",
    description: "The employee will take the morning shift (only on weekends 6am-13pm)."
  },
  NIGHT_SHIFT: {
    symbol: "NS",
    name: "Night Shift",
    description: "The employee will take the night shift (21pm-6am)."
  },
  GENERAL_ODC_WORK: {
    symbol: "G",
    name: "General ODC Work",
    description: ""
  },
  OUT_OF_OFFICE: {
    symbol: "O",
    name: "Out Of Office",
    description: "The employee won't come to work (day off)."
  },
  VACATION: {
    symbol: "V",
    name: "Vacation",
    description: "The employee will take a vacation day."
  },
  HOLIDAY: {
    symbol: "H",
    name: "Holiday",
    description: "The company will have a holiday (day off)."
  },
  SUSTAINMENT: {
    symbol: "SUS",
    name: "Sustainment",
    description: "The employee is working as a backup, attending tasks with low priority."
  },
  /*SECONDARY: {
    symbol: "SEC",
    name: "Secondary",
    description: "(Not Eligible for Bonus)"
  },*/
  TRAINING: {
    symbol: "T",
    name: "Training",
    description: "The employee will have a special training."
  }
};

export const EXTRA_DAY_TYPE = "X";

export const DAYS_IN_MONTH = 31;

export const UPLOAD_HOUR_FILE = 1;
export const UPLOAD_USER_FILE = 2;

export const GET_EMPLOYEES_URL = `http://www.react-lalovar.c9users.io/getUsers`;
export const BULK_USERS_URL = `http://www.react-lalovar.c9users.io/bulkUsers`;

export const UPLOAD_URL = `http://www.react-lalovar.c9users.io/uploadTime`;
export const GET_CALENDAR_URL = `http://www.react-lalovar.c9users.io/getCalendar`;
export const UPLOAD_CALENDAR_URL = `http://www.react-lalovar.c9users.io/uploadCalendar`;

export const DOWNLOAD_REPORT = `http://www.react-lalovar.c9users.io/downloadReport`;

export const GET_HOLIDAYS_URL = `http://www.react-lalovar.c9users.io/getHolidays`;

export const ADMIN_USER = "1";

export const TOTAL_EMPS_PER_PAGE = 7;


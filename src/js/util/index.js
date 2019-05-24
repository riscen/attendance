import { MONTHS } from "../../constants/util";

/**@abstract Maps a date into the format: DD/MM/YYYY. If some value is null, its going to be ommitted on the final string.
 * @param {object} date A date object: {day, month, year}
 * @returns {string} A string representing the date with the new format.
 */
export function mapDate(date) {
  if (date) {
    const { day, year, month } = date;
    let mappedDate = "";
    if (day) {
      mappedDate += `${day}/`;
    }
    if (month !== null) {
      mappedDate += `${MONTHS[month]}`;
    }
    mappedDate += `/`;
    if (year !== null) {
      mappedDate += `${year}`;
    }
    return mappedDate;
  }
  return "";
}

/**@abstract Return a string date with the next format: DD/MM/YYYY
 * @returns {string} A formatted date
 */
export function getNewFormattedDate() {
  const today = new Date();
  const day = today.getDate() < 10 ? `0${today.getDate()}` : today.getDate();
  const month = today.getMonth() + 1 < 10 ? `0${today.getMonth() + 1}` : today.getMonth() + 1; //January is 0!
  const year = today.getFullYear();
  return `${day}/${month}/${year}`;
}

/**@abstract Gets a byte quantity and returns a string wit its value on Bytes, KB, MB, GB, TB, PB, EB, ZB, or YB.
 * @param {number} bytes Bytes quantity.
 * @param {number} decimals The number of decimals hte user wants to print.
 * @returns {string} A string representing the value.
 */
export function bytesToMb(bytes, decimals) {
  if (bytes === 0) return "0 Bytes";
  var k = 1024,
    dm = decimals <= 0 ? 0 : decimals || 2,
    sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

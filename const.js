/**
 * Load AlaSQL
 * Library ID: 1XWR3NzQW6fINaIaROhzsxXqRREfKXAdbKoATNbpygoune43oCmez1N8U
 * Library URL: https://github.com/contributorpw/alasqlgs
 */

const alaSQL = AlaSQLGS.load();

/**
 * Table
 * Can use other method like SpreadsheetApp.openById or SpreadsheetApp.openByUrl
 */
const sheet = SpreadsheetApp.getActiveSpreadsheet();
const settingsTable = sheet.getSheetByName('Settings');
const urlsTable = sheet.getSheetByName('URLs');
const jobsTable = sheet.getSheetByName('Jobs');
const companiesTable = sheet.getSheetByName('Companies');

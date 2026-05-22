/**
 * Google Apps Script - Job Hunt Automation Sheet Formatter
 * 
 * PURPOSE: Automatically format the Google Sheet with:
 * - Frozen header rows
 * - Bold headers
 * - Optimized column widths
 * - Data validation dropdowns
 * - Conditional formatting (color coding)
 * 
 * HOW TO USE:
 * 1. Open your Google Sheet
 * 2. Go to: Extensions → Apps Script
 * 3. Delete any default code
 * 4. Paste this entire script
 * 5. Save (Ctrl+S or Cmd+S)
 * 6. Click Run → formatJobHuntSheet
 * 7. Grant permissions when prompted
 * 8. Wait for "Execution completed" message
 * 
 * IMPORTANT: Run this AFTER you've created all 5 tabs and added column headers
 */

function formatJobHuntSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  Logger.log('🚀 Starting sheet formatting...');
  
  // Format each tab
  formatJobsTab(ss);
  formatContactsTab(ss);
  formatOutreachTab(ss);
  formatApplicationsTab(ss);
  formatLogsTab(ss);
  
  Logger.log('✅ Sheet formatting completed successfully!');
  SpreadsheetApp.getUi().alert('✅ Formatting Complete!\n\nAll tabs have been formatted with:\n- Frozen headers\n- Bold headers\n- Optimized column widths\n- Data validation\n- Conditional formatting');
}

/**
 * FORMAT TAB 1: JOBS
 */
function formatJobsTab(ss) {
  const sheet = ss.getSheetByName('Jobs');
  if (!sheet) {
    Logger.log('⚠️ Jobs tab not found - skipping');
    return;
  }
  
  Logger.log('📋 Formatting Jobs tab...');
  
  // Freeze header row
  sheet.setFrozenRows(1);
  
  // Format header row (bold, background, center align)
  const headerRange = sheet.getRange(1, 1, 1, 20);
  headerRange.setFontWeight('bold')
            .setBackground('#4285F4')
            .setFontColor('#FFFFFF')
            .setHorizontalAlignment('center')
            .setVerticalAlignment('middle');
  
  // Set column widths (in pixels)
  const columnWidths = [
    150,  // A: Job ID
    120,  // B: Date Scraped
    120,  // C: Source Platform
    200,  // D: Job Title
    180,  // E: Company Name
    120,  // F: Company Size
    180,  // G: Location
    100,  // H: Work Mode
    120,  // I: Experience Level
    120,  // J: Salary Range
    400,  // K: Job Description (wide)
    200,  // L: Key Skills
    300,  // M: Job URL
    120,  // N: Posted Date
    150,  // O: Application Deadline
    100,  // P: Match Score
    120,  // Q: Status
    300,  // R: Resume Link
    250,  // S: Notes
    150   // T: Last Updated
  ];
  
  columnWidths.forEach((width, index) => {
    sheet.setColumnWidth(index + 1, width);
  });
  
  // Add data validation for Status column (Q)
  const statusValues = [
    'Discovered',
    'Filtered',
    'Resume Sent',
    'Applied',
    'Contacted',
    'Interview',
    'Offer',
    'Rejected'
  ];
  
  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(statusValues)
    .setAllowInvalid(false)
    .build();
  
  sheet.getRange('Q2:Q1000').setDataValidation(statusRule);
  
  // Add data validation for Work Mode column (H)
  const workModeValues = ['Remote', 'Hybrid', 'On-site'];
  const workModeRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(workModeValues)
    .setAllowInvalid(false)
    .build();
  
  sheet.getRange('H2:H1000').setDataValidation(workModeRule);
  
  // Add number validation for Match Score column (P)
  const scoreRule = SpreadsheetApp.newDataValidation()
    .requireNumberBetween(0, 100)
    .setAllowInvalid(false)
    .build();
  
  sheet.getRange('P2:P1000').setDataValidation(scoreRule);
  
  // Conditional formatting - Color code by Status
  // Green: Interview, Offer
  const greenRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=OR($Q2="Interview", $Q2="Offer")')
    .setBackground('#D9EAD3')
    .setRanges([sheet.getRange('A2:T1000')])
    .build();
  
  // Yellow: Applied, Contacted
  const yellowRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=OR($Q2="Applied", $Q2="Contacted")')
    .setBackground('#FFF2CC')
    .setRanges([sheet.getRange('A2:T1000')])
    .build();
  
  // Blue: Resume Sent
  const blueRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$Q2="Resume Sent"')
    .setBackground('#CFE2F3')
    .setRanges([sheet.getRange('A2:T1000')])
    .build();
  
  // Red: Rejected
  const redRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$Q2="Rejected"')
    .setBackground('#F4CCCC')
    .setRanges([sheet.getRange('A2:T1000')])
    .build();
  
  const rules = [greenRule, yellowRule, blueRule, redRule];
  sheet.setConditionalFormatRules(rules);
  
  Logger.log('✓ Jobs tab formatted');
}

/**
 * FORMAT TAB 2: CONTACTS
 */
function formatContactsTab(ss) {
  const sheet = ss.getSheetByName('Contacts');
  if (!sheet) {
    Logger.log('⚠️ Contacts tab not found - skipping');
    return;
  }
  
  Logger.log('📋 Formatting Contacts tab...');
  
  // Freeze header row
  sheet.setFrozenRows(1);
  
  // Format header row
  const headerRange = sheet.getRange(1, 1, 1, 15);
  headerRange.setFontWeight('bold')
            .setBackground('#4285F4')
            .setFontColor('#FFFFFF')
            .setHorizontalAlignment('center')
            .setVerticalAlignment('middle');
  
  // Set column widths
  const columnWidths = [
    150,  // A: Contact ID
    150,  // B: Job ID
    180,  // C: Company Name
    150,  // D: Contact Name
    180,  // E: Job Title
    220,  // F: Email
    120,  // G: Email Status
    250,  // H: LinkedIn URL
    140,  // I: Phone Number
    120,  // J: Source
    120,  // K: Confidence Score
    120,  // L: Contact Type
    120,  // M: Date Found
    120,  // N: Last Contacted
    250   // O: Notes
  ];
  
  columnWidths.forEach((width, index) => {
    sheet.setColumnWidth(index + 1, width);
  });
  
  // Add data validation for Email Status column (G)
  const emailStatusValues = ['Verified', 'Unverified', 'Bounced'];
  const emailStatusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(emailStatusValues)
    .setAllowInvalid(false)
    .build();
  
  sheet.getRange('G2:G1000').setDataValidation(emailStatusRule);
  
  // Add data validation for Contact Type column (L)
  const contactTypeValues = ['Recruiter', 'Hiring Manager', 'HR', 'Other'];
  const contactTypeRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(contactTypeValues)
    .setAllowInvalid(false)
    .build();
  
  sheet.getRange('L2:L1000').setDataValidation(contactTypeRule);
  
  // Conditional formatting - Color code by Email Status
  // Green: Verified
  const greenRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$G2="Verified"')
    .setBackground('#D9EAD3')
    .setRanges([sheet.getRange('A2:O1000')])
    .build();
  
  // Yellow: Unverified
  const yellowRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$G2="Unverified"')
    .setBackground('#FFF2CC')
    .setRanges([sheet.getRange('A2:O1000')])
    .build();
  
  // Red: Bounced
  const redRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$G2="Bounced"')
    .setBackground('#F4CCCC')
    .setRanges([sheet.getRange('A2:O1000')])
    .build();
  
  const rules = [greenRule, yellowRule, redRule];
  sheet.setConditionalFormatRules(rules);
  
  Logger.log('✓ Contacts tab formatted');
}

/**
 * FORMAT TAB 3: OUTREACH
 */
function formatOutreachTab(ss) {
  const sheet = ss.getSheetByName('Outreach');
  if (!sheet) {
    Logger.log('⚠️ Outreach tab not found - skipping');
    return;
  }
  
  Logger.log('📋 Formatting Outreach tab...');
  
  // Freeze header row
  sheet.setFrozenRows(1);
  
  // Format header row
  const headerRange = sheet.getRange(1, 1, 1, 13);
  headerRange.setFontWeight('bold')
            .setBackground('#4285F4')
            .setFontColor('#FFFFFF')
            .setHorizontalAlignment('center')
            .setVerticalAlignment('middle');
  
  // Set column widths
  const columnWidths = [
    180,  // A: Outreach ID
    150,  // B: Job ID
    150,  // C: Contact ID
    180,  // D: Company Name
    150,  // E: Contact Name
    120,  // F: Outreach Type
    300,  // G: Subject Line
    500,  // H: Message Body (very wide)
    120,  // I: Status
    120,  // J: Generated Date
    120,  // K: Sent Date
    120,  // L: Response Date
    250   // M: Notes
  ];
  
  columnWidths.forEach((width, index) => {
    sheet.setColumnWidth(index + 1, width);
  });
  
  // Add data validation for Outreach Type column (F)
  const outreachTypeValues = ['Cold Email', 'LinkedIn DM'];
  const outreachTypeRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(outreachTypeValues)
    .setAllowInvalid(false)
    .build();
  
  sheet.getRange('F2:F1000').setDataValidation(outreachTypeRule);
  
  // Add data validation for Status column (I)
  const statusValues = ['Draft', 'Approved', 'Sent', 'Replied', 'No Response'];
  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(statusValues)
    .setAllowInvalid(false)
    .build();
  
  sheet.getRange('I2:I1000').setDataValidation(statusRule);
  
  // Conditional formatting - Color code by Status
  // Green: Replied
  const greenRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$I2="Replied"')
    .setBackground('#D9EAD3')
    .setRanges([sheet.getRange('A2:M1000')])
    .build();
  
  // Blue: Sent
  const blueRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$I2="Sent"')
    .setBackground('#CFE2F3')
    .setRanges([sheet.getRange('A2:M1000')])
    .build();
  
  // Yellow: Approved
  const yellowRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$I2="Approved"')
    .setBackground('#FFF2CC')
    .setRanges([sheet.getRange('A2:M1000')])
    .build();
  
  // Red: No Response
  const redRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$I2="No Response"')
    .setBackground('#F4CCCC')
    .setRanges([sheet.getRange('A2:M1000')])
    .build();
  
  const rules = [greenRule, blueRule, yellowRule, redRule];
  sheet.setConditionalFormatRules(rules);
  
  Logger.log('✓ Outreach tab formatted');
}

/**
 * FORMAT TAB 4: APPLICATIONS
 */
function formatApplicationsTab(ss) {
  const sheet = ss.getSheetByName('Applications');
  if (!sheet) {
    Logger.log('⚠️ Applications tab not found - skipping');
    return;
  }
  
  Logger.log('📋 Formatting Applications tab...');
  
  // Freeze header row
  sheet.setFrozenRows(1);
  
  // Format header row
  const headerRange = sheet.getRange(1, 1, 1, 12);
  headerRange.setFontWeight('bold')
            .setBackground('#4285F4')
            .setFontColor('#FFFFFF')
            .setHorizontalAlignment('center')
            .setVerticalAlignment('middle');
  
  // Set column widths
  const columnWidths = [
    180,  // A: Application ID
    150,  // B: Job ID
    180,  // C: Company Name
    200,  // D: Job Title
    120,  // E: Application Date
    180,  // F: Application Method
    200,  // G: Resume Version
    100,  // H: Cover Letter
    150,  // I: Current Stage
    200,  // J: Next Action
    150,  // K: Next Action Date
    180   // L: Final Outcome
  ];
  
  columnWidths.forEach((width, index) => {
    sheet.setColumnWidth(index + 1, width);
  });
  
  // Add data validation for Application Method column (F)
  const methodValues = ['Direct', 'Via Recruiter', 'LinkedIn Easy Apply', 'Company Website'];
  const methodRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(methodValues)
    .setAllowInvalid(false)
    .build();
  
  sheet.getRange('F2:F1000').setDataValidation(methodRule);
  
  // Add data validation for Current Stage column (I)
  const stageValues = ['Applied', 'Screening', 'Interview 1', 'Interview 2', 'Offer', 'Rejected', 'Withdrawn'];
  const stageRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(stageValues)
    .setAllowInvalid(false)
    .build();
  
  sheet.getRange('I2:I1000').setDataValidation(stageRule);
  
  // Conditional formatting - Color code by stage and outcome
  // Dark Green: Offer Accepted
  const darkGreenRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$L2="Offer Accepted"')
    .setBackground('#93C47D')
    .setFontColor('#FFFFFF')
    .setBold(true)
    .setRanges([sheet.getRange('A2:L1000')])
    .build();
  
  // Light Green: Offer stage
  const lightGreenRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$I2="Offer"')
    .setBackground('#D9EAD3')
    .setRanges([sheet.getRange('A2:L1000')])
    .build();
  
  // Blue: Interview stages
  const blueRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=OR($I2="Interview 1", $I2="Interview 2", $I2="Screening")')
    .setBackground('#CFE2F3')
    .setRanges([sheet.getRange('A2:L1000')])
    .build();
  
  // Yellow: Applied
  const yellowRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$I2="Applied"')
    .setBackground('#FFF2CC')
    .setRanges([sheet.getRange('A2:L1000')])
    .build();
  
  // Red: Rejected
  const redRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=OR($I2="Rejected", $L2="Rejected")')
    .setBackground('#F4CCCC')
    .setRanges([sheet.getRange('A2:L1000')])
    .build();
  
  const rules = [darkGreenRule, lightGreenRule, blueRule, yellowRule, redRule];
  sheet.setConditionalFormatRules(rules);
  
  Logger.log('✓ Applications tab formatted');
}

/**
 * FORMAT TAB 5: LOGS
 */
function formatLogsTab(ss) {
  const sheet = ss.getSheetByName('Logs');
  if (!sheet) {
    Logger.log('⚠️ Logs tab not found - skipping');
    return;
  }
  
  Logger.log('📋 Formatting Logs tab...');
  
  // Freeze header row
  sheet.setFrozenRows(1);
  
  // Format header row
  const headerRange = sheet.getRange(1, 1, 1, 10);
  headerRange.setFontWeight('bold')
            .setBackground('#4285F4')
            .setFontColor('#FFFFFF')
            .setHorizontalAlignment('center')
            .setVerticalAlignment('middle');
  
  // Set column widths
  const columnWidths = [
    200,  // A: Log ID
    180,  // B: Timestamp
    150,  // C: Workflow Run ID
    200,  // D: Module
    200,  // E: Action
    100,  // F: Status
    150,  // G: Records Processed
    400,  // H: Error Message (wide)
    100,  // I: Retry Count
    250   // J: Notes
  ];
  
  columnWidths.forEach((width, index) => {
    sheet.setColumnWidth(index + 1, width);
  });
  
  // Add data validation for Status column (F)
  const statusValues = ['Success', 'Error', 'Warning', 'Info'];
  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(statusValues)
    .setAllowInvalid(false)
    .build();
  
  sheet.getRange('F2:F1000').setDataValidation(statusRule);
  
  // Conditional formatting - Color code by Status
  // Green: Success
  const greenRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$F2="Success"')
    .setBackground('#D9EAD3')
    .setRanges([sheet.getRange('A2:J1000')])
    .build();
  
  // Yellow: Warning
  const yellowRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$F2="Warning"')
    .setBackground('#FFF2CC')
    .setRanges([sheet.getRange('A2:J1000')])
    .build();
  
  // Red: Error
  const redRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$F2="Error"')
    .setBackground('#F4CCCC')
    .setRanges([sheet.getRange('A2:J1000')])
    .build();
  
  const rules = [greenRule, yellowRule, redRule];
  sheet.setConditionalFormatRules(rules);
  
  Logger.log('✓ Logs tab formatted');
}

/**
 * MENU FUNCTION - Add custom menu to run formatter
 * This runs automatically when sheet is opened
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🤖 Job Hunt Automation')
    .addItem('🎨 Format All Tabs', 'formatJobHuntSheet')
    .addSeparator()
    .addItem('📊 Refresh Jobs Tab Only', 'formatJobsTab')
    .addItem('👥 Refresh Contacts Tab Only', 'formatContactsTab')
    .addItem('📧 Refresh Outreach Tab Only', 'formatOutreachTab')
    .addItem('📋 Refresh Applications Tab Only', 'formatApplicationsTab')
    .addItem('📝 Refresh Logs Tab Only', 'formatLogsTab')
    .addToUi();
}

/**
 * HELPER FUNCTION - Clear all formatting (use with caution!)
 */
function clearAllFormatting() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    '⚠️ Clear All Formatting?',
    'This will remove all conditional formatting, data validation, and styling. Continue?',
    ui.ButtonSet.YES_NO
  );
  
  if (response == ui.Button.YES) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheets = ss.getSheets();
    
    sheets.forEach(sheet => {
      sheet.clearConditionalFormatRules();
      sheet.getDataRange().clearDataValidations();
      Logger.log(`Cleared formatting for: ${sheet.getName()}`);
    });
    
    ui.alert('✅ All formatting cleared. Run "Format All Tabs" to reapply.');
  }
}

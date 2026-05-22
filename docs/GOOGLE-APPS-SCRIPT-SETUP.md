# Google Apps Script Setup Guide

## Overview
This guide walks you through setting up the Google Apps Script that automatically formats your Job Hunt Automation Google Sheet.

## What the Script Does

The script (`scripts/google-apps-script.js`) automatically applies:

✅ **Frozen header rows** - Headers stay visible when scrolling  
✅ **Bold headers with blue background** - Professional appearance  
✅ **Optimized column widths** - No manual resizing needed  
✅ **Data validation dropdowns** - Prevents typos in status fields  
✅ **Conditional formatting** - Color-coded rows based on status  
✅ **Custom menu** - Easy access to formatting functions  

---

## Step-by-Step Setup

### Step 1: Open Your Google Sheet
1. Go to your `Job Hunt Automation Tracker` sheet
2. Make sure all 5 tabs are created: `Jobs`, `Contacts`, `Outreach`, `Applications`, `Logs`
3. Make sure column headers are added to Row 1 of each tab (refer to `docs/02-GOOGLE-SHEETS-SCHEMA.md`)

### Step 2: Open Apps Script Editor
1. In your Google Sheet, click: **Extensions → Apps Script**
2. A new tab will open with the Apps Script editor

### Step 3: Delete Default Code
1. You'll see a default function called `myFunction()`
2. **Select all the code** (Ctrl+A or Cmd+A)
3. **Delete it**

### Step 4: Paste the Formatter Script
1. Open the file: `scripts/google-apps-script.js` from this repository
2. **Copy all the code** (the entire file)
3. **Paste it** into the Apps Script editor

### Step 5: Save the Script
1. Click the **Save icon** (💾) or press Ctrl+S / Cmd+S
2. Give your project a name: `Job Hunt Sheet Formatter`
3. Click **OK**

### Step 6: Run the Formatter
1. In the Apps Script editor, find the function dropdown at the top
2. Select: **`formatJobHuntSheet`**
3. Click the **Run button** (▶️)

### Step 7: Grant Permissions (First Time Only)
When you run the script for the first time, Google will ask for permissions:

1. A popup will appear: *"Authorization required"*
2. Click **Review permissions**
3. Select your Google account
4. You'll see: *"Google hasn't verified this app"*
   - Click **Advanced**
   - Click **Go to Job Hunt Sheet Formatter (unsafe)**
   - ⚠️ This is safe - it's YOUR script, not a third-party app
5. Review the permissions:
   - ✅ View and manage spreadsheets
6. Click **Allow**

### Step 8: Wait for Completion
1. The script will run (takes 5-15 seconds)
2. You'll see: **"Execution completed"** in the log
3. A popup will appear: *"✅ Formatting Complete!"*
4. Click **OK**

### Step 9: Verify the Formatting
1. Go back to your Google Sheet tab
2. Check each tab - you should see:
   - Row 1 is frozen (stays visible when scrolling down)
   - Headers are bold with blue background
   - Columns are properly sized
   - Status columns have dropdown arrows
3. Try changing a Status field - you should see the row color change!

---

## Using the Custom Menu

After running the script once, a new menu will appear in your Google Sheet:

**Menu Location**: Top menu bar → **🤖 Job Hunt Automation**

### Menu Options:

| Option | What It Does |
|--------|--------------|
| 🎨 Format All Tabs | Re-applies formatting to all 5 tabs |
| 📊 Refresh Jobs Tab Only | Re-formats only the Jobs tab |
| 👥 Refresh Contacts Tab Only | Re-formats only the Contacts tab |
| 📧 Refresh Outreach Tab Only | Re-formats only the Outreach tab |
| 📋 Refresh Applications Tab Only | Re-formats only the Applications tab |
| 📝 Refresh Logs Tab Only | Re-formats only the Logs tab |

**When to use:**
- After adding new columns
- If formatting gets messed up
- When sharing the sheet with others

---

## Troubleshooting

### Issue: "Script function not found: formatJobHuntSheet"
**Solution:** You didn't save the script. Click the Save icon (💾) and try again.

### Issue: "Exception: Sheet 'Jobs' not found"
**Solution:** The tab names don't match. Make sure your tabs are named exactly:
- `Jobs` (not "jobs" or "Jobs Tab")
- `Contacts`
- `Outreach`
- `Applications`
- `Logs`

### Issue: Conditional formatting not working
**Solution:** 
1. Make sure you have data in the rows (not just headers)
2. Run the script again: **🤖 Job Hunt Automation → 🎨 Format All Tabs**

### Issue: Dropdowns not appearing in Status columns
**Solution:**
1. Click on a cell in the Status column
2. Look for a dropdown arrow on the right
3. If missing, re-run the formatter

### Issue: "Authorization required" popup keeps appearing
**Solution:**
1. Clear your authorization: Apps Script Editor → Run → Clear all authorizations
2. Run the script again and grant permissions properly

### Issue: Column widths are too narrow/wide
**Solution:** You can manually adjust column widths. The script sets optimal defaults, but adjust as needed.

---

## Advanced: Editing the Script

### Changing Column Widths
Find the `columnWidths` array in each function:

```javascript
const columnWidths = [
  150,  // A: Job ID
  120,  // B: Date Scraped
  // ...
];
```

Change the numbers (in pixels) to your preference, then save and re-run.

### Changing Color Codes
Find the conditional formatting rules:

```javascript
const greenRule = SpreadsheetApp.newConditionalFormatRule()
  .whenFormulaSatisfied('=OR($Q2="Interview", $Q2="Offer")')
  .setBackground('#D9EAD3')  // ← Change this hex color
  .setRanges([sheet.getRange('A2:T1000')])
  .build();
```

**Color Reference:**
- `#D9EAD3` - Light green
- `#FFF2CC` - Light yellow
- `#CFE2F3` - Light blue
- `#F4CCCC` - Light red
- `#93C47D` - Dark green

### Adding New Status Values
Find the `statusValues` array:

```javascript
const statusValues = [
  'Discovered',
  'Filtered',
  'Resume Sent',
  // Add your new status here
  'Your New Status',
  'Rejected'
];
```

Save and re-run to update the dropdown.

---

## Backing Up the Script

The script is automatically saved in Google's cloud, but for extra safety:

### Method 1: Export from Apps Script Editor
1. Apps Script Editor → Project Settings → Export as ZIP
2. Save the ZIP file to your computer

### Method 2: Copy the Code
1. Select all code in the editor (Ctrl+A / Cmd+A)
2. Copy and save to a `.js` file on your computer
3. This repository already has a backup: `scripts/google-apps-script.js`

---

## Re-Running the Script

**You only need to run the script once**, but re-run it if:
- You add new columns
- Formatting breaks
- You want to refresh colors
- You share the sheet and formatting is lost

**How to re-run:**
1. Open your Google Sheet
2. Click: **🤖 Job Hunt Automation → 🎨 Format All Tabs**
3. Done!

---

## Security & Privacy

**Is this script safe?**
✅ Yes - the script only accesses YOUR Google Sheet  
✅ No external APIs or third-party services  
✅ Code is open-source and visible in the editor  
✅ You can review every line before running  

**What permissions does it need?**
- View and manage spreadsheets: To apply formatting, validation, and colors

**Can others access my script?**
- No - only you can see and run the script
- If you share the sheet, others don't get the script automatically
- They would need to copy the script themselves

---

## Next Steps

After successfully setting up the Apps Script:

1. ✅ Your sheet is now fully formatted
2. ✅ Ready to receive data from n8n workflows
3. ➡️ Next: Configure Google Sheets credentials in n8n
4. ➡️ Refer to: `docs/03-CREDENTIALS-SETUP.md`

---

## Support

If you encounter issues:
1. Check the Apps Script execution log: View → Logs
2. Review the error message carefully
3. Verify tab names and column headers match the schema
4. Try running the script manually from the editor

**Common Error Messages:**

| Error | Meaning | Fix |
|-------|---------|-----|
| `Sheet 'X' not found` | Tab name mismatch | Rename tab exactly as specified |
| `Cannot read property 'setBackground'` | No data range found | Add at least 1 test row |
| `Authorization required` | Permissions not granted | Follow Step 7 again |
| `Script timeout` | Script took too long | Sheet might be huge, run one tab at a time |

---

**Last Updated:** 2026-05-22  
**Script Version:** 1.0  
**Compatibility:** Google Sheets (all versions)

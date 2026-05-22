# Module 4 - Google Sheets Logger Setup Guide

## Overview

**Module 4** writes filtered jobs to your Google Sheet's Jobs tab and logs the execution to the Logs tab.

**File**: `workflows/module-4-sheets-logger.json`

**Input**: Filtered jobs from Module 3 (20-50 jobs)  
**Output**: Jobs written to sheet + execution logged

---

## What This Module Does

1. 📊 **Writes jobs** to Google Sheets → Jobs tab
2. 📈 **Counts** how many jobs were written
3. 📝 **Formats** execution log entry
4. 🗂️ **Logs** to Google Sheets → Logs tab
5. 🚀 **Outputs** to Module 5 (Resume Tailor)

---

## Workflow Nodes (6 Total)

| # | Node Name | Type | Purpose |
|---|-----------|------|---------|
| 1 | Start from Module 3 | No-Op | Entry point |
| 2 | Write Jobs to Sheet | Google Sheets | Writes to Jobs tab |
| 3 | Count Jobs Written | Code | Counts and summarizes |
| 4 | Format Log Entry | Set | Formats for Logs schema |
| 5 | Write to Logs Tab | Google Sheets | Writes to Logs tab |
| 6 | Output to Module 5 | Set | Prepares output |

---

## Step-by-Step Setup

### Step 1: Import the Workflow

1. Open n8n
2. Click **"+"** → **"Import from File"**
3. Select: `workflows/module-4-sheets-logger.json`
4. Click **"Open"**

---

### Step 2: Configure Google Sheets - Jobs Tab

**Node**: "Write Jobs to Sheet" (Node #2)

This is the main node that writes filtered jobs to your sheet.

#### 2A. Get Your Sheet ID

If you haven't already:

1. Open your `Job Hunt Automation Tracker` Google Sheet
2. Copy the Sheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[SHEET-ID-HERE]/edit
   ```
3. Keep it handy

#### 2B. Configure the Node

1. Click **"Write Jobs to Sheet"** node
2. **Credential to connect with**:
   - Select your existing Google Sheets credential (from Module 1)
   - Or create new one if needed

3. **Document** field:
   - Select "By ID"
   - Paste your Sheet ID

4. **Sheet** field:
   - Select **"Jobs"** from dropdown
   - Must match tab name exactly

5. **Operation**:
   - Verify: **"Append or Update Row"**

6. **Columns** mapping:
   - Should already be configured with all 20 columns
   - Verify they match your Jobs tab schema:
     ```
     jobId, dateScraped, sourcePlatform, jobTitle, companyName,
     companySize, location, workMode, experienceLevel, salaryRange,
     jobDescription, keySkills, jobUrl, postedDate, applicationDeadline,
     matchScore, status, resumeLink, notes, lastUpdated
     ```

7. **Options**:
   - Check: **"Use Append"** = true
   - This makes writes faster (adds to bottom instead of searching)

#### 2C. Test the Node

1. Make sure you have test data flowing from Module 3
2. Click **"Execute Node"**
3. Check output:
   - Should show "Items: X" (number of jobs written)
   - Green checkmark = success
4. **Verify in Google Sheets**:
   - Open your sheet
   - Go to Jobs tab
   - Scroll to bottom
   - Should see new job rows added!

---

### Step 3: Configure Google Sheets - Logs Tab

**Node**: "Write to Logs Tab" (Node #5)

This logs the execution for tracking.

1. Click **"Write to Logs Tab"** node
2. **Credential**: Select same Google Sheets credential
3. **Document**: Same Sheet ID as above
4. **Sheet**: Select **"Logs"** from dropdown
5. **Operation**: **"Append"**
6. **Columns**: Should be pre-configured with 10 columns:
   ```
   logId, timestamp, workflowRunId, module, action,
   status, recordsProcessed, errorMessage, retryCount, notes
   ```

#### Test:
1. Click **"Execute Node"**
2. Check your sheet → Logs tab
3. Should see a new log entry with:
   - Module: "Module 4 - Google Sheets Logger"
   - Action: "Write Jobs to Sheet"
   - Records Processed: Number of jobs written

---

### Step 4: Test the Complete Workflow

1. **Test with sample data**:
   - Either run Modules 1-3 first
   - Or manually trigger with test data

2. **Execute Module 4**:
   - Click **"Execute Workflow"**
   - All 6 nodes should run

3. **Verify each step**:
   - Node 2: Jobs written to Jobs tab ✓
   - Node 3: Count shows correct number ✓
   - Node 5: Log entry in Logs tab ✓
   - Node 6: Output prepared for Module 5 ✓

4. **Check Google Sheets**:
   - **Jobs tab**: New rows at bottom
   - **Logs tab**: New log entry
   - **Data**: Verify columns are filled correctly

---

## Understanding the Data Flow

### Input (from Module 3):
```json
{
  "filteredJobs": [
    {
      "jobId": "linkedin-123456",
      "dateScraped": "2026-05-22",
      "sourcePlatform": "LinkedIn",
      "jobTitle": "Sales Development Representative",
      "companyName": "Salesforce",
      "location": "Bangalore, India",
      "workMode": "Remote",
      "jobUrl": "https://linkedin.com/jobs/view/123456",
      "matchScore": 50,
      "status": "Discovered",
      ...
    },
    // ... more jobs
  ],
  "jobCount": 25,
  "runId": "run-2026-05-22-exec123"
}
```

### Output (to Module 5):
```json
{
  "runId": "run-2026-05-22-exec123",
  "jobsLogged": 25,
  "status": "Logged",
  "message": "Jobs successfully logged to Google Sheets..."
}
```

---

## Column Mapping Explained

### Jobs Tab (20 columns)

| Column | Source | Example Value |
|--------|--------|---------------|
| A: jobId | Generated | `linkedin-123456` |
| B: dateScraped | Today's date | `2026-05-22` |
| C: sourcePlatform | From scraper | `LinkedIn` |
| D: jobTitle | From RSS | `Sales Development Representative` |
| E: companyName | From RSS | `Salesforce` |
| F: companySize | Default | `Unknown` |
| G: location | From RSS | `Bangalore, India` |
| H: workMode | Extracted | `Remote` |
| I: experienceLevel | Default | `Mid-Level` |
| J: salaryRange | Default | `Not Specified` |
| K: jobDescription | From RSS | `We're looking for...` |
| L: keySkills | From filter | `Apollo, CRM, cold email` |
| M: jobUrl | From RSS | `https://linkedin.com/...` |
| N: postedDate | From RSS | `2026-05-20` |
| O: applicationDeadline | Default | `Not Specified` |
| P: matchScore | From filter | `50` |
| Q: status | Initial | `Discovered` |
| R: resumeLink | Empty | `` |
| S: notes | Auto | `Filtered and added by automation` |
| T: lastUpdated | Timestamp | `2026-05-22 07:15:30` |

---

## Error Handling

### Built-in Retry Logic

n8n has automatic retry for Google Sheets operations:
- **Default**: 3 retries with exponential backoff
- **Delay**: 1s, 2s, 4s between retries
- **Why**: Handles temporary network issues, rate limits

### Common Errors & Solutions

#### Error: "Insufficient permissions"
**Cause**: Google Sheets credential doesn't have access

**Solution**:
1. Re-authenticate the credential
2. In Google Sheets, verify service account has Editor access
3. Re-test the connection

---

#### Error: "Sheet 'Jobs' not found"
**Cause**: Tab name mismatch

**Solution**:
1. Check your Google Sheet has a tab named exactly **"Jobs"** (case-sensitive)
2. In n8n node, re-select the sheet from dropdown
3. Save and test again

---

#### Error: "Column mismatch"
**Cause**: Column headers in sheet don't match n8n mapping

**Solution**:
1. Check your Jobs tab has all 20 column headers in Row 1
2. Verify spelling and order match schema
3. Re-run the Google Apps Script formatter if needed

---

#### Error: "Request timeout"
**Cause**: Writing too many rows at once or slow connection

**Solution**:
1. Check your internet connection
2. If writing 100+ jobs, consider batching:
   - Split into chunks of 50
   - Use Loop node
3. Increase timeout in node settings (advanced)

---

## Performance Optimization

### For High Volume (100+ jobs/day)

**Issue**: Writing 100+ rows can be slow

**Solution 1 - Batch Append** (recommended):
- n8n's "Append" operation is already optimized
- Writes multiple rows in one API call
- Should handle 100-200 rows easily

**Solution 2 - Use Google Sheets API Directly**:
- If still slow, use HTTP Request node
- Call Sheets API's batchUpdate method
- More complex but faster for bulk writes

### Current Setup Performance

With default configuration:
- **20-50 jobs**: ~3-5 seconds
- **100 jobs**: ~10-15 seconds
- **200 jobs**: ~20-30 seconds

**Good enough for daily automation!**

---

## Monitoring & Validation

### After Each Run, Check:

1. **Jobs Count**:
   - Compare "jobsLogged" with actual rows added
   - Should match exactly

2. **Data Quality**:
   - Spot-check a few rows
   - Verify URLs are clickable
   - Check dates are formatted correctly

3. **Logs Tab**:
   - Should have a new entry after each run
   - Status should be "Success"
   - recordsProcessed should match jobs written

### Weekly Health Check:

1. **Duplicate Check**:
   - Conditional formatting should highlight duplicates
   - If found, investigate Module 3 deduplication

2. **Empty Fields**:
   - Check for rows with too many "Unknown" or "Not Specified"
   - May indicate scraper data quality issues

3. **Archive Old Jobs**:
   - Move jobs older than 60 days to archive sheet
   - Keeps main sheet fast and manageable

---

## Advanced: Custom Validation

Want to validate data before writing? Add a validation node before "Write Jobs to Sheet":

```javascript
// Validation Code Example
const items = $input.all();
const validJobs = [];
const invalidJobs = [];

for (const item of items) {
  const data = item.json;
  
  // Validation rules
  const isValid = 
    data.jobUrl && data.jobUrl.startsWith('http') && // Valid URL
    data.jobTitle && data.jobTitle.length > 5 && // Real title
    data.companyName && data.companyName !== 'Unknown' && // Known company
    data.matchScore >= 30; // Passes threshold
  
  if (isValid) {
    validJobs.push(item);
  } else {
    invalidJobs.push({
      json: {
        ...data,
        validationError: 'Failed validation checks'
      }
    });
  }
}

// Return only valid jobs
return validJobs;
```

Add this before the "Write Jobs to Sheet" node for extra quality control.

---

## Integration with Other Modules

### How Module 4 Fits In

```
Module 1 (Scheduler) → Triggers daily
    ↓
Module 2 (Scraper) → Finds 100-200 jobs
    ↓
Module 3 (Filter) → Filters to 20-50 relevant jobs
    ↓
Module 4 (Logger) → ✓ Writes to Google Sheets [YOU ARE HERE]
    ↓
Module 5 (Resume Tailor) → Reads jobs with status='Discovered'
    ↓
Module 6 (Contact Finder) → Finds recruiters
    ↓
Module 7 (Outreach) → Generates messages
    ↓
Module 8 (Tracker) → Updates statuses, sends notifications
```

### Key Point:
Module 4 is the **gateway** to your central data store. All downstream modules read from Google Sheets, so this module must work perfectly.

---

## Troubleshooting Checklist

Before asking for help, verify:

- [ ] Google Sheets credential is authenticated
- [ ] Sheet ID is correct
- [ ] Both "Jobs" and "Logs" tabs exist
- [ ] Column headers match schema exactly
- [ ] Test execution works manually
- [ ] Logs tab shows successful writes
- [ ] Jobs appear in Google Sheet
- [ ] No error messages in n8n

If all checked and still issues:
1. Check n8n logs
2. Verify Google Sheet sharing settings
3. Test with a single job first
4. Check for API quota limits (rare)

---

## Next Steps

✅ Module 4 is now configured!

**What happens next**:
1. Jobs are now in your Google Sheet
2. Status = "Discovered" for all new jobs
3. Ready for Module 5 to generate tailored resumes

**Next Module**: **Module 5 - Resume Tailor**
- Reads jobs from sheet
- Generates customized resumes using AI
- Uploads PDFs to Google Drive
- Updates resumeLink column

---

## Configuration Checklist

- [ ] Module 4 imported into n8n
- [ ] Google Sheets credential configured
- [ ] Sheet ID set in both nodes (Jobs + Logs)
- [ ] "Jobs" tab selected in node #2
- [ ] "Logs" tab selected in node #5
- [ ] Test execution successful
- [ ] Jobs appear in Google Sheet
- [ ] Log entry appears in Logs tab
- [ ] Ready to proceed to Module 5

---

**Last Updated**: 2026-05-22  
**Module Version**: 1.0  
**Status**: Production Ready ✅

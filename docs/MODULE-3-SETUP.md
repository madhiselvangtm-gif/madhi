# Module 3 - Filter & Deduplicate Setup Guide

## Overview

**Module 3** filters scraped jobs based on your criteria and removes duplicates.

**File**: `workflows/module-3-filter-dedupe.json`

**Input**: Raw jobs from Module 2 (100-200 jobs)  
**Output**: Filtered, unique jobs (typically 20-50 jobs)

---

## What This Module Does

1. 🔍 **Keyword Filtering**: Matches jobs against preferred keywords
2. ❌ **Exclusion Filtering**: Removes jobs with blacklisted keywords
3. 📊 **Scoring**: Assigns match score (0-100) based on relevance
4. 🔄 **Deduplication**: Removes jobs already in your Google Sheet
5. 📋 **Formatting**: Structures data for Google Sheets schema
6. ✅ **Validation**: Ensures only quality jobs proceed to next modules

---

## Filtering Logic

### Step 1: Exclusion Filter (Blacklist)

Jobs containing ANY of these keywords are **automatically rejected**:
- senior manager
- field sales
- door-to-door sales
- customer support
- unpaid internship

**Why first**: Saves processing time by eliminating unsuitable jobs immediately.

---

### Step 2: Scoring (Preferred Keywords)

Jobs are scored based on keyword matches:

| Keyword Category | Points Per Match | Your Keywords |
|------------------|------------------|---------------|
| **Core Skills** | 10 points | outbound automation, lead generation, Apollo, Clay |
| **Tools** | 10 points | cold email, LinkedIn outreach, CRM, HubSpot, Salesforce |
| **Automation** | 10 points | AI automation, sales automation, workflow automation |
| **Location Bonus** | 20 points | Bangalore, Hyderabad, Chennai, Coimbatore, Gurugram, Mumbai |

**Minimum Score**: 30 points (to pass to next stage)

**Examples**:
- Job mentions "Apollo" + "cold email" + "Bangalore" = 10 + 10 + 20 = **40 points** ✅
- Job mentions "CRM" + "HubSpot" = 10 + 10 = **20 points** ❌ (below threshold)
- Job mentions "sales automation" + "prospecting" + "Chennai" = 10 + 10 + 20 = **40 points** ✅

---

### Step 3: Deduplication

**Method**: Compare job URLs against existing jobs in Google Sheets

**Deduplication Key**: Job URL (most reliable unique identifier)

**Why URL**:
- Same job may have different titles
- Company names can vary (Inc. vs Inc vs Incorporated)
- URL is always unique per job posting

**Process**:
1. Read all existing job URLs from Google Sheets → Jobs tab
2. Create a lookup set (fast O(1) checking)
3. Compare each new job URL
4. Keep only jobs NOT in the set

**Edge Case**: If a job has no URL, it's skipped (cannot deduplicate)

---

## Workflow Nodes (8 Total)

| # | Node Name | Type | Purpose |
|---|-----------|------|---------|
| 1 | Start from Module 2 | No-Op | Entry point |
| 2 | Apply Keyword Filter | Code | Filters by keywords + scores jobs |
| 3 | Read Existing Jobs from Sheet | Google Sheets | Reads current jobs for deduplication |
| 4 | Deduplicate Jobs | Code | Removes duplicates |
| 5 | Format for Google Sheets | Code | Formats to schema |
| 6 | Any Jobs to Add? | IF Condition | Checks if jobs exist |
| 7 | Output to Module 4 | Set | Prepares output (if jobs found) |
| 8 | No New Jobs Found | Set | Handles empty state |

---

## Step-by-Step Setup

### Step 1: Import the Workflow

1. Open n8n
2. Click **"+"** → **"Import from File"**
3. Select: `workflows/module-3-filter-dedupe.json`
4. Click **"Open"**

---

### Step 2: Configure Google Sheets Connection

**Node**: "Read Existing Jobs from Sheet" (Node #3)

1. Click the node
2. **Credential**: Select your Google Sheets credential (same as Module 1)
3. **Document**: Select your Google Sheet or paste Sheet ID
4. **Sheet**: Select **"Jobs"** from dropdown
5. **Operation**: Verify it's set to **"Read Rows"**
6. **Options**: Leave default (read all rows)

**Test**:
- Click **"Execute Node"**
- Should show your existing jobs (or empty if new sheet)

---

### Step 3: Customize Filter Criteria (Optional)

**Node**: "Apply Keyword Filter" (Node #2)

By default, it uses your specified criteria. To customize:

1. Click the node
2. Click **"Edit Code"**
3. Find these arrays:

```javascript
const preferredKeywords = [
  'outbound automation', 'lead generation', 'Apollo', 'Clay',
  'cold email', 'LinkedIn outreach', 'CRM', 'AI automation',
  'sales automation', 'prospecting', 'workflow automation',
  'HubSpot', 'Salesforce'
];

const excludedKeywords = [
  'senior manager', 'field sales', 'door-to-door sales',
  'customer support', 'unpaid internship'
];

const priorityLocations = [
  'Bangalore', 'Bengaluru', 'Hyderabad', 'Chennai',
  'Coimbatore', 'Gurugram', 'Gurgaon', 'Mumbai'
];
```

4. **Edit** as needed:
   - Add/remove keywords
   - Change priority locations
   - Adjust scoring logic

5. **Save**

---

### Step 4: Adjust Match Score Threshold (Optional)

**Default**: 30 points minimum

**To change**:

1. In "Apply Keyword Filter" node code
2. Find this line:
   ```javascript
   if (matchScore >= 30) {
   ```
3. Change `30` to your desired threshold:
   - **Lower** (e.g., 20) = More jobs pass, less strict
   - **Higher** (e.g., 40) = Fewer jobs pass, more strict

**Recommendation**: Start with 30, adjust after seeing results

---

### Step 5: Test the Workflow

1. **Prepare test data**:
   - Run Module 2 first (or have sample RSS data)
   - Or manually trigger with test job data

2. **Execute Module 3**:
   - Click **"Execute Workflow"**
   - Watch each node process

3. **Check outputs**:
   - **"Apply Keyword Filter"**: Should show jobs with matchScore
   - **"Deduplicate Jobs"**: Should show only new jobs
   - **"Any Jobs to Add?"**: 
     - TRUE path → jobs found
     - FALSE path → no new jobs

4. **Verify filtering worked**:
   - Check that excluded keywords are absent
   - Check that jobs have minimum match score
   - Check that duplicates were removed

---

## Understanding the Output

### If Jobs Found (TRUE Path)

Output to Module 4:
```json
{
  "filteredJobs": [...],
  "jobCount": 25,
  "runId": "run-2026-05-22-exec123",
  "status": "Filtered",
  "message": "Jobs filtered and deduplicated successfully"
}
```

### If No Jobs (FALSE Path)

```json
{
  "jobCount": 0,
  "runId": "run-2026-05-22-exec123",
  "status": "No New Jobs",
  "message": "No new jobs found after filtering..."
}
```

---

## Data Transformation

### Input (from Module 2 RSS):
```json
{
  "title": "Sales Development Representative",
  "creator": "Salesforce",
  "link": "https://linkedin.com/jobs/view/123456",
  "pubDate": "2026-05-20",
  "contentSnippet": "We're looking for an SDR with Apollo..."
}
```

### Output (to Module 4):
```json
{
  "jobId": "linkedin-123456",
  "dateScraped": "2026-05-22",
  "sourcePlatform": "LinkedIn",
  "jobTitle": "Sales Development Representative",
  "companyName": "Salesforce",
  "location": "Bangalore, India",
  "workMode": "Remote",
  "experienceLevel": "Mid-Level",
  "jobDescription": "We're looking for an SDR with Apollo...",
  "keySkills": "Apollo, cold email, CRM",
  "jobUrl": "https://linkedin.com/jobs/view/123456",
  "matchScore": 50,
  "status": "Discovered"
}
```

---

## Performance Optimization

### For Large Job Volumes (500+ jobs/day)

**Issue**: Reading all existing jobs can be slow

**Solutions**:

1. **Read only recent jobs** (last 30 days):
   - In "Read Existing Jobs from Sheet" node
   - Add filter: `Date Scraped >= TODAY() - 30`

2. **Use Job ID instead of URL**:
   - Faster lookup
   - But requires standardized ID format

3. **Archive old jobs**:
   - Move jobs older than 60 days to separate sheet
   - Keeps main sheet lean

---

## Troubleshooting

### Issue: Too many jobs passing filter

**Cause**: Match score threshold too low

**Solution**:
1. Increase threshold from 30 to 40 or 50
2. Add more exclusion keywords
3. Make preferred keywords more specific

---

### Issue: No jobs passing filter

**Cause**: Threshold too high or keywords too strict

**Solution**:
1. Lower threshold from 30 to 20
2. Review your preferred keywords (are they too specific?)
3. Check if RSS feeds are returning data at all

---

### Issue: Duplicates still appearing

**Cause**: Job URLs are slightly different (query parameters)

**Solution**:
1. In "Deduplicate Jobs" code, normalize URLs:
   ```javascript
   const normalizedUrl = url.split('?')[0]; // Remove query params
   ```
2. Or use job title + company name as dedup key

---

### Issue: "Sheet not found" error

**Cause**: Credentials or sheet name incorrect

**Solution**:
1. Verify Google Sheets credential is connected
2. Check sheet tab is named exactly **"Jobs"** (case-sensitive)
3. Re-authenticate if needed

---

### Issue: Location not being extracted correctly

**Cause**: RSS feeds have inconsistent location format

**Solution**:
1. In "Format for Google Sheets" node
2. Update location extraction logic:
   ```javascript
   let location = data.location || '';
   // Add custom parsing for your specific RSS format
   ```

---

## Filter Statistics

To track filter performance, monitor these metrics:

| Metric | What It Means | Target |
|--------|---------------|--------|
| **Input Jobs** | Total scraped | 100-200/day |
| **After Exclusions** | Passed blacklist | 80-180/day |
| **After Scoring** | Score >= 30 | 40-100/day |
| **After Deduplication** | Truly new jobs | 20-50/day |
| **Conversion Rate** | New jobs / Input | 20-50% |

**Healthy metrics**:
- 20-50% conversion rate
- 20-50 new jobs per day
- <10% duplicates

**If conversion <10%**: Filters too strict  
**If conversion >70%**: Filters too loose (quality may suffer)

---

## Advanced: Multi-Criteria Scoring

Want more sophisticated scoring? Enhance the code:

```javascript
// Job title exact match (higher weight)
if (jobTitle.includes('sales development representative')) {
  matchScore += 30; // Big bonus
}

// Experience level
if (fullText.includes('3-5 years') || fullText.includes('mid-level')) {
  matchScore += 15;
}

// Work mode preference
if (fullText.includes('remote')) {
  matchScore += 10;
} else if (fullText.includes('hybrid')) {
  matchScore += 5;
}

// Salary indicator
if (fullText.includes('lpa') || fullText.includes('salary')) {
  matchScore += 5; // Jobs with salary info are valuable
}
```

---

## Next Steps

After Module 3 is configured:

1. ✅ Test with sample data
2. ✅ Verify filtering works as expected
3. ✅ Check deduplication prevents duplicates
4. ➡️ **Next**: Build Module 4 - Google Sheets Logger

Module 4 will take the filtered jobs and write them to your Google Sheet.

---

## Configuration Checklist

Before moving to Module 4:

- [ ] Module 3 imported into n8n
- [ ] Google Sheets credential configured
- [ ] Sheet ID and "Jobs" tab verified
- [ ] Filter keywords customized (if needed)
- [ ] Match score threshold set
- [ ] Test execution successful
- [ ] Output format verified
- [ ] Deduplication working

---

**Last Updated**: 2026-05-22  
**Module Version**: 1.0  
**Status**: Production Ready ✅

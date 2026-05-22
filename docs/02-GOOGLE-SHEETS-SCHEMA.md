# Google Sheets Schema Documentation

## Overview
This document defines the complete structure of the Google Sheet that serves as the central database for the job hunting automation system.

**Sheet Name**: `Job Hunt Automation Tracker`

**Total Tabs**: 5
1. Jobs
2. Contacts
3. Outreach
4. Applications
5. Logs

---

## Tab 1: Jobs

**Purpose**: Store all scraped and filtered jobs. This is the source of truth for job listings.

### Columns (20 total)

| Column | Name | Data Type | Description | Example |
|--------|------|-----------|-------------|---------|
| A | Job ID | Text (unique) | Unique identifier for deduplication | `linkedin-123456789` |
| B | Date Scraped | Date | When the job was first discovered | `2026-05-22` |
| C | Source Platform | Text | Which job board it came from | `LinkedIn`, `BuiltIn`, `Wellfound` |
| D | Job Title | Text | Exact job title from posting | `Sales Development Representative` |
| E | Company Name | Text | Company name | `Salesforce` |
| F | Company Size | Text | Employee count range | `1001-5000`, `51-200`, `Unknown` |
| G | Location | Text | Job location | `Bangalore, Karnataka, India` |
| H | Work Mode | Text | Remote/Hybrid/On-site | `Remote`, `Hybrid`, `On-site` |
| I | Experience Level | Text | Seniority level | `Mid-Level`, `Entry Level`, `Senior` |
| J | Salary Range | Text | Salary if available | `₹8-12 LPA`, `Not Specified` |
| K | Job Description | Long Text | Full job description | (truncated in sheet, full text stored) |
| L | Key Skills | Text | Extracted key skills | `Apollo, Cold Email, CRM` |
| M | Job URL | URL | Direct link to job posting | `https://linkedin.com/jobs/view/123...` |
| N | Posted Date | Date | When job was originally posted | `2026-05-20` |
| O | Application Deadline | Date | Deadline if mentioned | `2026-06-20`, `Not Specified` |
| P | Match Score | Number (0-100) | Rule-based relevance score | `85`, `92` |
| Q | Status | Dropdown | Current status | `Discovered`, `Filtered`, `Resume Sent`, `Applied`, `Contacted`, `Interview`, `Offer`, `Rejected` |
| R | Resume Link | URL | Google Drive link to tailored resume | `https://drive.google.com/file/d/...` |
| S | Notes | Long Text | Manual notes or flags | `Requires manual review`, `High priority` |
| T | Last Updated | Timestamp | Last modification time | `2026-05-22 14:30:00` |

### Color Coding Rules
- **Green Row**: Status = `Interview`, `Offer`
- **Yellow Row**: Status = `Applied`, `Contacted`
- **Blue Row**: Status = `Resume Sent`
- **White Row**: Status = `Discovered`, `Filtered`
- **Red Row**: Status = `Rejected`

### Data Validation
- **Status Column (Q)**: Dropdown list
- **Work Mode Column (H)**: Dropdown (`Remote`, `Hybrid`, `On-site`)
- **Match Score Column (P)**: Number between 0-100

---

## Tab 2: Contacts

**Purpose**: Store recruiter and hiring manager contact information found for each job.

### Columns (15 total)

| Column | Name | Data Type | Description | Example |
|--------|------|-----------|-------------|---------|
| A | Contact ID | Text (unique) | Unique contact identifier | `apollo-contact-789` |
| B | Job ID | Text | Links to Jobs tab | `linkedin-123456789` |
| C | Company Name | Text | Company name | `Salesforce` |
| D | Contact Name | Text | Full name of recruiter/hiring manager | `Priya Sharma` |
| E | Job Title | Text | Their role/title | `Talent Acquisition Specialist` |
| F | Email | Email | Work email address | `priya.sharma@salesforce.com` |
| G | Email Status | Text | Email validity | `Verified`, `Unverified`, `Bounced` |
| H | LinkedIn URL | URL | LinkedIn profile link | `https://linkedin.com/in/priyasharma` |
| I | Phone Number | Text | Phone if available | `+91-9876543210`, `Not Found` |
| J | Source | Text | How contact was found | `Apollo.io`, `LinkedIn Scraper`, `Manual` |
| K | Confidence Score | Number (0-100) | Accuracy confidence | `95`, `70` |
| L | Contact Type | Text | Role classification | `Recruiter`, `Hiring Manager`, `HR` |
| M | Date Found | Date | When contact was extracted | `2026-05-22` |
| N | Last Contacted | Date | Last outreach date | `2026-05-23`, `Not Yet` |
| O | Notes | Long Text | Additional contact info | `Also handles APAC hiring` |

### Color Coding Rules
- **Green Row**: Email Status = `Verified`
- **Yellow Row**: Email Status = `Unverified`
- **Red Row**: Email Status = `Bounced`

### Data Validation
- **Email Status Column (G)**: Dropdown (`Verified`, `Unverified`, `Bounced`)
- **Contact Type Column (L)**: Dropdown (`Recruiter`, `Hiring Manager`, `HR`, `Other`)

---

## Tab 3: Outreach

**Purpose**: Store generated cold emails and LinkedIn DM drafts for each job application.

### Columns (13 total)

| Column | Name | Data Type | Description | Example |
|--------|------|-----------|-------------|---------|
| A | Outreach ID | Text (unique) | Unique outreach identifier | `outreach-20260522-001` |
| B | Job ID | Text | Links to Jobs tab | `linkedin-123456789` |
| C | Contact ID | Text | Links to Contacts tab | `apollo-contact-789` |
| D | Company Name | Text | Target company | `Salesforce` |
| E | Contact Name | Text | Recipient name | `Priya Sharma` |
| F | Outreach Type | Text | Email or LinkedIn DM | `Cold Email`, `LinkedIn DM` |
| G | Subject Line | Text | Email subject (if email) | `Experienced SDR interested in...` |
| H | Message Body | Long Text | Full message content | (AI-generated personalized message) |
| I | Status | Dropdown | Outreach status | `Draft`, `Approved`, `Sent`, `Replied`, `No Response` |
| J | Generated Date | Date | When message was created | `2026-05-22` |
| K | Sent Date | Date | When actually sent | `2026-05-23`, `Not Sent` |
| L | Response Date | Date | If they replied | `2026-05-25`, `No Reply` |
| M | Notes | Long Text | Follow-up notes | `Send follow-up on May 28` |

### Color Coding Rules
- **Green Row**: Status = `Replied`
- **Blue Row**: Status = `Sent`
- **Yellow Row**: Status = `Approved`
- **White Row**: Status = `Draft`
- **Red Row**: Status = `No Response` (after 7+ days)

### Data Validation
- **Outreach Type Column (F)**: Dropdown (`Cold Email`, `LinkedIn DM`)
- **Status Column (I)**: Dropdown (`Draft`, `Approved`, `Sent`, `Replied`, `No Response`)

---

## Tab 4: Applications

**Purpose**: High-level tracking of application pipeline and status across all jobs.

### Columns (12 total)

| Column | Name | Data Type | Description | Example |
|--------|------|-----------|-------------|---------|
| A | Application ID | Text (unique) | Unique application identifier | `app-20260522-001` |
| B | Job ID | Text | Links to Jobs tab | `linkedin-123456789` |
| C | Company Name | Text | Target company | `Salesforce` |
| D | Job Title | Text | Position applied for | `Sales Development Representative` |
| E | Application Date | Date | When applied | `2026-05-22` |
| F | Application Method | Text | How you applied | `Direct`, `Via Recruiter`, `LinkedIn Easy Apply` |
| G | Resume Version | Text | Which tailored resume used | `SDR-Salesforce-v1.pdf` |
| H | Cover Letter | Text | Cover letter status | `Yes`, `No`, `N/A` |
| I | Current Stage | Dropdown | Pipeline stage | `Applied`, `Screening`, `Interview 1`, `Interview 2`, `Offer`, `Rejected`, `Withdrawn` |
| J | Next Action | Text | What's next | `Wait for response`, `Follow-up on May 28` |
| K | Next Action Date | Date | When to take next action | `2026-05-28` |
| L | Final Outcome | Text | Final result | `Offer Accepted`, `Rejected`, `In Progress` |

### Color Coding Rules
- **Dark Green Row**: Final Outcome = `Offer Accepted`
- **Light Green Row**: Current Stage = `Offer`
- **Blue Row**: Current Stage = `Interview 1`, `Interview 2`, `Screening`
- **Yellow Row**: Current Stage = `Applied`
- **Red Row**: Final Outcome = `Rejected`, Current Stage = `Rejected`

### Data Validation
- **Current Stage Column (I)**: Dropdown (`Applied`, `Screening`, `Interview 1`, `Interview 2`, `Offer`, `Rejected`, `Withdrawn`)
- **Application Method Column (F)**: Dropdown (`Direct`, `Via Recruiter`, `LinkedIn Easy Apply`, `Company Website`)

---

## Tab 5: Logs

**Purpose**: System execution logs, errors, and workflow run history for debugging and monitoring.

### Columns (10 total)

| Column | Name | Data Type | Description | Example |
|--------|------|-----------|-------------|---------|
| A | Log ID | Text (unique) | Unique log entry ID | `log-20260522-143045` |
| B | Timestamp | Timestamp | Exact time of log entry | `2026-05-22 14:30:45` |
| C | Workflow Run ID | Text | n8n execution ID | `exec-abc123xyz` |
| D | Module | Text | Which module ran | `Module 2 - Job Scraper` |
| E | Action | Text | What action was performed | `Scraped LinkedIn`, `Filtered Jobs`, `Sent Email` |
| F | Status | Text | Success or error | `Success`, `Error`, `Warning` |
| G | Records Processed | Number | Count of items processed | `47` (jobs scraped), `12` (emails sent) |
| H | Error Message | Long Text | Error details if failed | `Apollo API rate limit exceeded` |
| I | Retry Count | Number | How many retries attempted | `0`, `1`, `2`, `3` |
| J | Notes | Long Text | Additional context | `First run of the day` |

### Color Coding Rules
- **Green Row**: Status = `Success`
- **Yellow Row**: Status = `Warning`
- **Red Row**: Status = `Error`

### Data Validation
- **Status Column (F)**: Dropdown (`Success`, `Error`, `Warning`, `Info`)

---

## Sheet Setup Instructions

### Step 1: Create the Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Click "Blank" to create a new sheet
3. Rename it to: `Job Hunt Automation Tracker`
4. **Copy the Sheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[THIS-IS-YOUR-SHEET-ID]/edit
   ```

### Step 2: Create All 5 Tabs
1. Rename the default "Sheet1" to `Jobs`
2. Click the "+" button to add a new tab, name it `Contacts`
3. Repeat for: `Outreach`, `Applications`, `Logs`

### Step 3: Add Column Headers
For each tab, copy-paste the column headers from the tables above into Row 1.

**Example for Jobs tab:**
Row 1: `Job ID | Date Scraped | Source Platform | Job Title | Company Name | ...` (all 20 columns)

### Step 4: Run the Auto-Formatter Script
1. In your Google Sheet, go to: **Extensions → Apps Script**
2. Delete any default code
3. Copy-paste the script from: `scripts/google-apps-script.js`
4. Click **Run → formatJobHuntSheet**
5. Grant permissions when prompted
6. Script will:
   - Freeze row 1 (headers)
   - Bold all headers
   - Set optimal column widths
   - Add data validation dropdowns
   - Apply conditional formatting (color coding)

### Step 5: Share the Sheet with n8n
1. Click the "Share" button
2. Add the Google Service Account email used by n8n
3. Give it "Editor" access
4. Save

### Step 6: Test Manual Entry
Add one test row in each tab to verify the structure works correctly.

**Example test row for Jobs tab:**
```
linkedin-test-001 | 2026-05-22 | LinkedIn | Test SDR Role | Test Company | 51-200 | Bangalore | Remote | Mid-Level | ₹10 LPA | Sample description | Apollo, CRM | https://test.com | 2026-05-20 | Not Specified | 85 | Discovered | | Manual test entry | 2026-05-22 14:30:00
```

---

## Sheet ID Configuration

After setup, you'll need to configure the Sheet ID in your n8n workflows:

**Where to add the Sheet ID:**
- Module 3: Filter & Deduplicate (reads existing jobs)
- Module 4: Google Sheets Logger (writes new jobs)
- Module 5: Resume Tailor (reads job data)
- Module 6: Contact Finder (writes contact data)
- Module 7: Outreach Generator (writes outreach drafts)
- Module 8: Tracker & Notifier (reads/updates statuses)

**How to add in n8n:**
1. Open each workflow
2. Find nodes with "Google Sheets" icon
3. Click the node → Configure credentials
4. Paste your Sheet ID in the "Document" field

---

## Data Flow Between Tabs

```
Module 2 (Job Scraper) → Jobs Tab (new rows)
                              ↓
Module 3 (Filter) → reads Jobs Tab → updates Status column
                              ↓
Module 5 (Resume Tailor) → reads Jobs Tab → writes Resume Link column
                              ↓
Module 6 (Contact Finder) → reads Jobs Tab → writes to Contacts Tab
                              ↓
Module 7 (Outreach) → reads Jobs + Contacts → writes to Outreach Tab
                              ↓
Module 8 (Tracker) → reads all tabs → updates Applications Tab + Logs Tab
```

---

## Maintenance & Cleanup

### Weekly Cleanup (Manual)
- Archive jobs older than 60 days with Status = `Rejected`
- Delete duplicate entries (shouldn't happen, but check)
- Review flagged jobs in Notes column

### Monthly Cleanup (Manual)
- Export Applications tab as backup CSV
- Clear old Logs entries (keep last 1000 rows only)
- Update salary ranges based on market changes

### Backup
- **Google Sheets auto-saves** - no manual backup needed
- For extra safety: **File → Download → CSV** monthly for each tab

---

## Troubleshooting

**Issue**: n8n can't access the sheet
- **Solution**: Verify the service account email has Editor access

**Issue**: Color coding not working
- **Solution**: Re-run the Apps Script formatter

**Issue**: Duplicate jobs appearing
- **Solution**: Check Job ID uniqueness in Module 3 deduplication logic

**Issue**: Columns misaligned
- **Solution**: Do NOT manually insert/delete columns - always add to the end

---

## Advanced: Custom Views (Optional)

Create filtered views for quick access:

**View 1: Active Applications**
- Filter: Status = `Applied`, `Contacted`, `Interview`
- Sort by: Application Date (newest first)

**View 2: High Priority Jobs**
- Filter: Match Score > 85, Status = `Discovered`
- Sort by: Match Score (highest first)

**View 3: Needs Follow-up**
- Filter: Next Action Date = TODAY or earlier
- Color: Highlight in orange

To create: **Data → Create a filter → Save as "View Name"**

---

## Schema Version

**Current Version**: 1.0  
**Last Updated**: 2026-05-22  
**Author**: AI Job Hunt Automation System  

For schema changes, update this document and re-run the Apps Script formatter.

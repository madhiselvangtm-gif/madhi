# Module 1 - Scheduler & Trigger Setup Guide

## Overview

**Module 1** is the heartbeat of your job hunting automation system. It runs once daily at 7:00 AM IST and kicks off the entire workflow pipeline.

**File**: `workflows/module-1-scheduler.json`

---

## What This Module Does

1. ⏰ **Triggers daily at 7:00 AM IST** using a cron scheduler
2. 📋 **Generates execution metadata** (unique run ID, timestamp)
3. 🏥 **Performs health check** (optional) to verify system is running
4. 📝 **Logs execution start** to Google Sheets Logs tab
5. 🚀 **Passes data to Module 2** (Job Scraper)

---

## Workflow Nodes (10 Total)

| # | Node Name | Type | Purpose |
|---|-----------|------|---------|
| 1 | Daily Scheduler - 7 AM IST | Cron Trigger | Fires workflow daily at 7 AM |
| 2 | Generate Execution Metadata | Code | Creates unique run ID and timestamp |
| 3 | Health Check Endpoint | HTTP Request | Pings health check webhook (optional) |
| 4 | Health Check OK? | IF Condition | Validates health check response |
| 5 | Log Health Success | Code | Logs successful health check |
| 6 | Log Health Warning | Code | Logs failed health check (but continues) |
| 7 | Merge Health Results | Merge | Combines both paths |
| 8 | Format Log Entry | Set | Formats data for Logs tab |
| 9 | Write to Logs Tab | Google Sheets | Writes execution log |
| 10 | Output to Module 2 | Set | Prepares data for next module |

---

## Step-by-Step Setup

### Step 1: Import the Workflow into n8n

1. **Open your n8n instance**
   - VPS: `http://your-vps-ip:5678`
   - Or your custom domain

2. **Import the workflow**
   - Click **"+"** (New workflow)
   - Click **"⋯"** (three dots menu) → **"Import from File"**
   - Select: `workflows/module-1-scheduler.json`
   - Click **"Open"**

3. **Workflow loaded!**
   - You should see 10 nodes arranged on the canvas
   - Don't worry about the red errors yet - we'll fix them

---

### Step 2: Configure Google Sheets Credentials

The workflow needs access to your Google Sheet to write logs.

#### 2A. Get Your Google Sheet ID

1. Open your `Job Hunt Automation Tracker` sheet
2. Look at the URL:
   ```
   https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p/edit
                                          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                          THIS IS YOUR SHEET ID
   ```
3. **Copy the Sheet ID** (the long string between `/d/` and `/edit`)

#### 2B. Create Google Sheets Credential in n8n

1. In the workflow, click the **"Write to Logs Tab"** node (node #9)
2. You'll see a red warning: **"Missing credentials"**
3. Under **"Credential to connect with"**:
   - Click **"Select Credential"**
   - Click **"+ Create New Credential"**
   - Select **"Google Sheets OAuth2 API"**

4. In the credential dialog:
   - **Name**: `Google Sheets - Job Hunt`
   - Click **"Connect my account"**
   - **Sign in with your Google account**
   - Grant permissions: "View and manage your spreadsheets"
   - Click **"Allow"**

5. **Save** the credential

#### 2C. Configure the Google Sheets Node

Still in the **"Write to Logs Tab"** node:

1. **Document** field:
   - Click the dropdown
   - Select **"From list"** or **"By ID"**
   - If "By ID": Paste your Sheet ID from Step 2A
   - If "From list": Find and select your sheet from the list

2. **Sheet** field:
   - Select **"Logs"** from the dropdown
   - (Must match the tab name exactly)

3. **Operation**:
   - Verify it's set to **"Append or Update Row"**

4. **Columns** mapping:
   - Should already be configured with 10 columns
   - Verify they match your Logs tab structure

5. Click **"Execute Node"** to test
   - Should see: "Node executed successfully"
   - Check your Google Sheet → Logs tab
   - You should see a new row!

---

### Step 3: Configure the Cron Scheduler

1. Click the **"Daily Scheduler - 7 AM IST"** node (node #1)

2. Verify settings:
   - **Trigger Interval**: `Cron`
   - **Cron Expression**: `0 7 * * *`
   
3. **Understanding the Cron Expression**:
   ```
   0 7 * * *
   │ │ │ │ │
   │ │ │ │ └─ Day of week (0-7) [Sunday=0 or 7] (* = every day)
   │ │ │ └─── Month (1-12) (* = every month)
   │ │ └───── Day of month (1-31) (* = every day)
   │ └─────── Hour (0-23) (7 = 7 AM)
   └───────── Minute (0-59) (0 = at the top of the hour)
   ```

4. **To change the time**:
   - 8:00 AM: `0 8 * * *`
   - 6:30 AM: `30 6 * * *`
   - Every 6 hours: `0 */6 * * *`
   - Twice daily (7 AM & 7 PM): `0 7,19 * * *`

5. **IMPORTANT: Timezone Configuration**
   - The cron runs based on your **server's timezone**
   - To verify your VPS timezone:
     ```bash
     timedatectl
     ```
   - To set to IST (if not already):
     ```bash
     sudo timedatectl set-timezone Asia/Kolkata
     ```

---

### Step 4: Setup Health Check (Optional)

The health check verifies n8n is responding. You can skip this or disable it.

#### Option A: Skip Health Check (Easiest)

1. Click the **"Health Check Endpoint"** node (node #3)
2. Click the **three dots** on the node → **"Disable"**
3. The node will turn gray (disabled)
4. Workflow will skip health check and continue normally

#### Option B: Configure Health Check

1. **Create a health check webhook**:
   - In n8n, create a **new workflow**
   - Add a **"Webhook"** node
   - Configure:
     - **HTTP Method**: GET
     - **Path**: `health-check`
     - **Response Mode**: "Last Node"
   - Add a **"Respond to Webhook"** node
   - Configure:
     - **Respond With**: JSON
     - **Response Body**: `{"status": "ok", "timestamp": "{{$now.toISO()}}"}`
   - **Activate** this workflow
   - Copy the webhook URL (e.g., `http://localhost:5678/webhook/health-check`)

2. **Update the Health Check Endpoint node**:
   - Go back to Module 1 workflow
   - Click **"Health Check Endpoint"** node
   - Update **URL** field:
     - If localhost: `http://localhost:5678/webhook/health-check`
     - If VPS with domain: `https://your-domain.com/webhook/health-check`
   - **Timeout**: 5000ms (5 seconds)
   - **Ignore SSL Issues**: Enable if using self-signed certificate

3. **Test**:
   - Click **"Execute Node"**
   - Should return: `{"status": "ok", ...}`

---

### Step 5: Test the Entire Workflow

1. **Manual Test Execution**:
   - Click **"Execute Workflow"** button at the top
   - All nodes should execute in sequence
   - Check for green checkmarks on all nodes
   - Red X = error (hover for details)

2. **Verify Outputs**:
   - Click each node to see its output data
   - Especially check:
     - **"Generate Execution Metadata"**: Should have runId, timestamp
     - **"Write to Logs Tab"**: Should show 1 row added
     - **"Output to Module 2"**: Should have clean output data

3. **Check Google Sheets**:
   - Open your sheet → **Logs tab**
   - Should see a new row with:
     - Log ID
     - Timestamp (current time)
     - Module: "Module 1 - Scheduler"
     - Action: "Workflow Started"
     - Status: "Success" or "Warning"

4. **Common Errors**:
   - **"Missing credentials"**: Go back to Step 2B
   - **"Sheet 'Logs' not found"**: Check tab name is exactly "Logs"
   - **"Insufficient permissions"**: Re-authenticate Google credentials
   - **"Health check failed"**: Normal if you disabled it or haven't set it up

---

### Step 6: Activate the Scheduler

Once everything works in testing:

1. **Toggle the workflow to "Active"**
   - At the top right, switch the toggle from **"Inactive"** to **"Active"**
   - Should turn green

2. **Verify it's scheduled**:
   - Go to **"Executions"** tab in n8n
   - Click **"Waiting"** filter
   - Should see this workflow listed with next execution time: "Tomorrow at 7:00 AM"

3. **First automatic run**:
   - Will occur tomorrow at 7:00 AM IST
   - Check your Logs tab after 7:05 AM to verify it ran

---

## Configuration Summary

### Required Configuration

| Setting | What to Update | Where |
|---------|----------------|-------|
| Google Sheet ID | Your actual Sheet ID | Node #9 "Write to Logs Tab" |
| Google Credentials | Your Google account | Node #9 credential dropdown |
| Sheet Name | Verify "Logs" matches | Node #9 "Sheet" field |
| Cron Schedule | Adjust time if needed | Node #1 "Cron Expression" |

### Optional Configuration

| Setting | What to Update | Where |
|---------|----------------|-------|
| Health Check URL | Your webhook URL or disable | Node #3 "URL" field |
| Timezone | Set to IST on VPS | Server: `timedatectl` |

---

## Understanding the Data Flow

```
START: Cron fires at 7 AM
  ↓
Generate unique runId + timestamp
  ↓
[Optional] Ping health check endpoint
  ↓
IF health OK → Log success
IF health FAIL → Log warning (but continue)
  ↓
Merge both paths
  ↓
Format data to match Logs schema
  ↓
Write to Google Sheets → Logs tab
  ↓
Prepare output for Module 2
  ↓
END: Pass runId to Job Scraper
```

---

## Troubleshooting

### Issue: Workflow doesn't activate

**Possible causes:**
- Errors in nodes (fix all red errors first)
- Missing credentials
- Invalid cron expression

**Solution:**
1. Test execute the workflow manually
2. Fix any errors shown
3. Re-save the workflow
4. Try activating again

---

### Issue: Cron doesn't fire at 7 AM

**Possible causes:**
- Server timezone is not IST
- Workflow is inactive
- n8n container restarted and lost schedule

**Solution:**
1. Check server timezone:
   ```bash
   timedatectl
   ```
2. Set to IST if needed:
   ```bash
   sudo timedatectl set-timezone Asia/Kolkata
   ```
3. Verify workflow is **Active** (green toggle)
4. Check n8n logs:
   ```bash
   docker logs <n8n-container-name> | grep "Module 1"
   ```

---

### Issue: "Sheet not found" error

**Solution:**
1. Open your Google Sheet
2. Verify you have a tab named exactly **"Logs"** (case-sensitive)
3. In n8n node, re-select the sheet from dropdown
4. Test again

---

### Issue: Google Sheets credentials expired

**Solution:**
1. Click the node with the error
2. Under credentials, click the **"⋯"** menu
3. Select **"Reconnect"**
4. Sign in with Google again
5. Grant permissions
6. Save

---

### Issue: Health check always fails

**Solution:**
- **Option 1**: Disable the health check node (easiest)
- **Option 2**: Verify the health check webhook is active and accessible
- **Option 3**: Check firewall rules allow localhost connections

---

## Error Handling in This Module

### Retry Logic
- **Health Check**: No retry (continues on failure)
- **Google Sheets Write**: Will fail workflow if can't write (by design - you want to know if logging fails)

### Failure Scenarios
- **Health check fails**: Logs warning, continues
- **Google Sheets fails**: Workflow stops, sends error notification (in Module 8)
- **Cron fails to trigger**: Check n8n logs and server health

---

## Next Steps

✅ Module 1 is now configured!

**Next**: Build **Module 2 - Job Scraper**
- File: `workflows/module-2-job-scraper.json`
- Setup guide: `docs/MODULE-2-SETUP.md`

Module 2 will receive the `runId` and `timestamp` from this module and use them to tag all scraped jobs.

---

## Monitoring

### Daily Monitoring (Automated)
- Module 8 will send you Telegram/Email notifications
- Check your Logs tab in Google Sheets

### Manual Checks
- **Executions page in n8n**: Shows all workflow runs
- **Google Sheets Logs tab**: Historical log of all executions
- **n8n Docker logs**: `docker logs <container-id>`

---

## Advanced: Customizing the Scheduler

### Run Multiple Times Per Day

To run every 6 hours (7 AM, 1 PM, 7 PM, 1 AM):
```
0 7,13,19,1 * * *
```

### Run Only on Weekdays

Monday to Friday at 7 AM:
```
0 7 * * 1-5
```

### Run Twice Daily (Morning & Evening)

7 AM and 7 PM:
```
0 7,19 * * *
```

---

## Backup & Version Control

After configuring, **export a backup**:

1. In n8n workflow editor:
   - Click **"⋯"** → **"Download"**
   - Saves JSON file to your computer

2. Commit to git:
   ```bash
   cd /projects/sandbox/madhi
   git add workflows/module-1-scheduler.json
   git commit -m "Configured Module 1 with credentials"
   git push
   ```

---

**Last Updated**: 2026-05-22  
**Module Version**: 1.0  
**Status**: Production Ready ✅

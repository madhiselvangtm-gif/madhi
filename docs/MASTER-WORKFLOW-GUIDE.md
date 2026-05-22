# Master Workflow Integration Guide

## Overview

The **Master Workflow** combines all 8 modules into a single, cohesive automation system that runs daily.

---

## Master Workflow Structure

```
START (7:00 AM IST Daily)
    ↓
[Module 1] Scheduler & Trigger
    ↓
[Module 2] Job Scraper → Scrapes LinkedIn & Indeed RSS feeds
    ↓
[Module 3] Filter & Deduplicate → Applies filters, removes duplicates
    ↓
[Module 4] Google Sheets Logger → Writes to Jobs tab
    ↓
[Module 5] Resume Tailor (OPTIONAL) → Generates tailored resumes
    ↓
[Module 6] Contact Finder → Finds recruiters via Apollo.io
    ↓
[Module 7] Outreach Generator → Creates cold emails & LinkedIn DMs
    ↓
[Module 8] Tracker & Notifier → Sends Telegram/Email summary
    ↓
END (Notifications sent)
```

---

## Two Implementation Options

### Option A: Modular Approach (Recommended)

**What it means**:
- Keep each module as a separate workflow
- Activate all 8 workflows
- They run in sequence automatically
- Easier to debug and maintain

**How it works**:
1. Module 1 runs at 7 AM (cron trigger)
2. At the end, triggers Module 2 via webhook
3. Module 2 completes, triggers Module 3
4. And so on...

**Pros**:
- ✅ Easier to test individual modules
- ✅ Can disable modules without affecting others
- ✅ Better error isolation
- ✅ Simpler troubleshooting

**Cons**:
- ⚠️ Requires webhook configuration
- ⚠️ More workflows to manage in n8n

---

### Option B: Single Master Workflow

**What it means**:
- One huge workflow with all modules combined
- Single cron trigger
- All nodes in sequence

**How it works**:
- Import master-workflow.json
- One workflow with 50+ nodes
- Runs start to finish in one execution

**Pros**:
- ✅ Single workflow to manage
- ✅ No webhooks needed
- ✅ Simpler activation (one toggle)

**Cons**:
- ⚠️ Harder to debug
- ⚠️ One error can stop everything
- ⚠️ Large workflow can be slow to edit in n8n UI

---

## Recommended: Hybrid Approach

**Best of both worlds**:

Keep these as **separate workflows**:
1. ✅ Module 1 (Scheduler) - Separate
2. ✅ Module 2-4 - **Combined** (Scrape → Filter → Log)
3. ✅ Module 5 (Resume) - Separate (optional)
4. ✅ Module 6-7 - **Combined** (Contacts → Outreach)
5. ✅ Module 8 (Notifier) - Separate

**Result**: 5 workflows instead of 8 or 1

**Why this works**:
- Modules 2-4 are tightly coupled (data pipeline)
- Module 5 is optional
- Modules 6-7 work together
- Module 8 needs to run last

---

## Implementation Steps

### Step 1: Import All Module Workflows

1. Open n8n
2. Import each module JSON:
   - `module-1-scheduler.json`
   - `module-2-job-scraper-simplified.json`
   - `module-3-filter-dedupe.json`
   - `module-4-sheets-logger.json`
   - `module-5-resume-tailor.json` (optional)
   - `module-6-contact-finder.json`
   - `module-7-outreach-generator.json`
   - `module-8-tracker-notifier.json`

3. Configure credentials for each (Google Sheets, Apollo, etc.)

---

### Step 2: Connect Modules via Execute Workflow Nodes

#### Method 1: Execute Workflow Node (n8n built-in)

In each module's last node, add an **"Execute Workflow"** node:

**Module 1 → Module 2**:
- Last node in Module 1: "Output to Module 2"
- Add after it: **Execute Workflow** node
- Configuration:
  - **Source**: "Database"
  - **Workflow**: Select "Module 2 - Job Scraper"
  - **Mode**: "Wait for completion"

**Module 2 → Module 3**:
- Last node in Module 2
- Add **Execute Workflow** node
- Workflow: "Module 3 - Filter & Deduplicate"

**Continue for all modules...**

---

#### Method 2: Webhook Triggers (Alternative)

Each module starts with a **Webhook** node instead of "Start from Module X":

**Module 2**:
- Replace "Start from Module 1" with **Webhook** node
- Path: `/module-2-start`
- Method: POST

**Module 1 last node**:
- Add **HTTP Request** node
- URL: `http://localhost:5678/webhook/module-2-start`
- Method: POST
- Body: Pass runId and data

**Repeat for all modules**

---

### Step 3: Activate All Workflows

1. Go to each workflow
2. Toggle **"Active"** switch (top right)
3. Verify green checkmark appears

**Order doesn't matter** - they'll trigger in sequence.

---

### Step 4: Test the Full Pipeline

#### Initial Test (Manual):
1. Open Module 1 workflow
2. Click **"Execute Workflow"** (manual trigger)
3. Watch it cascade through all modules
4. Check Logs tab for results

#### Daily Test (Automated):
1. Wait until 7:00 AM IST tomorrow
2. Check your Telegram/Email for notification
3. Verify Google Sheets updated

---

## Error Handling Strategy

### Built-in Safeguards:

1. **Continue on Error**:
   - In each workflow settings
   - Settings → "Error Workflow" → "Continue"
   - Logs error but doesn't stop pipeline

2. **Retry Logic**:
   - Each HTTP/API node: 3 retries
   - Exponential backoff: 1s, 2s, 4s

3. **Fallback Paths**:
   - Module 3: IF no jobs → skip to Module 8
   - Module 6: IF no contacts → flag for manual
   - Module 7: IF AI fails → use templates

4. **Error Notifications**:
   - Module 8 detects errors
   - Sends alert via Telegram/Email
   - Includes error details and affected module

---

## Data Flow & Dependencies

### Data Passed Between Modules:

**Module 1 → 2**:
```json
{
  "runId": "run-2026-05-22-exec123",
  "timestamp": "2026-05-22 07:00:00",
  "date": "2026-05-22"
}
```

**Module 2 → 3**:
```json
{
  "runId": "run-2026-05-22-exec123",
  "jobs": [ /* array of scraped jobs */ ],
  "jobCount": 112
}
```

**Module 3 → 4**:
```json
{
  "runId": "run-2026-05-22-exec123",
  "filteredJobs": [ /* filtered, deduplicated jobs */ ],
  "jobCount": 48
}
```

**Module 4 → 5/6**:
```json
{
  "runId": "run-2026-05-22-exec123",
  "jobsLogged": 25,
  "status": "Logged"
}
```

**Module 6 → 7**:
```json
{
  "runId": "run-2026-05-22-exec123",
  "contactsFound": 15,
  "status": "Contacts Enriched"
}
```

**Module 7 → 8**:
```json
{
  "runId": "run-2026-05-22-exec123",
  "outreachGenerated": 10,
  "status": "Outreach Generated"
}
```

---

## Performance Metrics

### Expected Execution Times:

| Module | Duration | Bottleneck |
|--------|----------|------------|
| Module 1 | 5-10 sec | Google Sheets write |
| Module 2 | 30-60 sec | RSS feed fetching |
| Module 3 | 10-20 sec | Sheet read + filtering |
| Module 4 | 10-20 sec | Sheet write (batch) |
| Module 5 | 60-120 sec | AI generation (if enabled) |
| Module 6 | 30-60 sec | Apollo API calls |
| Module 7 | 60-90 sec | AI generation |
| Module 8 | 5-10 sec | Notifications |
| **Total** | **4-7 min** | **Full pipeline** |

### Optimization Tips:

1. **Parallel Processing** (Advanced):
   - Run Modules 5 & 6 in parallel
   - Both read from same Sheet
   - Join before Module 7

2. **Batch Operations**:
   - Already implemented in Sheet writes
   - Reduces API calls

3. **Caching**:
   - Cache job deduplication list
   - Refresh daily instead of per-run

---

## Monitoring & Maintenance

### Daily Checks (Automated):
- ✅ Telegram notification received
- ✅ Email received
- ✅ No errors in summary

### Weekly Checks (Manual):
- Review Google Sheets:
  - Jobs tab: New entries?
  - Contacts tab: Populated?
  - Outreach tab: Drafts ready?
  - Logs tab: Any repeated errors?

### Monthly Maintenance:
- Archive old jobs (60+ days)
- Clear old logs (keep last 1000)
- Review filter criteria effectiveness
- Check API credit usage:
  - Apollo.io: Should be <50/month
  - OpenAI: Check billing (if used)

---

## Troubleshooting the Pipeline

### Issue: Pipeline stops at Module X

**Debug steps**:
1. Check Module X's last execution in n8n
2. Look for error message
3. Check Logs tab in Google Sheets
4. Review Module X setup guide

**Common causes**:
- Credential expired
- API rate limit
- Sheet permission issue
- Network timeout

---

### Issue: Modules run but don't trigger next module

**Cause**: Connection not configured

**Solution**:
- Verify Execute Workflow nodes exist
- Check workflow IDs are correct
- Ensure all workflows are Active

---

### Issue: Duplicate notifications

**Cause**: Multiple Module 8 instances running

**Solution**:
- Check only ONE instance of each workflow is active
- Deactivate duplicates
- Clear execution queue

---

### Issue: Data not flowing between modules

**Cause**: Data structure mismatch

**Solution**:
- Check output of Module X matches input expected by Module X+1
- Review "Output to Module Y" nodes
- Verify field names match (runId, jobCount, etc.)

---

## Advanced: Creating the Single Master Workflow

If you want ONE big workflow instead of 8:

### Steps:

1. **Create new blank workflow** in n8n

2. **Copy-paste nodes** from each module:
   - Module 1: All 10 nodes
   - Module 2: All nodes (skip "Start" node)
   - Module 3: All nodes (skip "Start" node)
   - ... continue for all modules

3. **Connect them sequentially**:
   - Module 1's last node → Module 2's first real node
   - Module 2's last node → Module 3's first real node
   - And so on...

4. **Remove "Start from Module X" placeholder nodes**

5. **Test execution**

**Result**: One workflow with ~60 nodes

**Warning**: n8n UI can get slow with 60+ nodes. Consider the modular approach.

---

## Deployment Checklist

Before going live:

### Pre-Deployment:
- [ ] All 8 modules imported
- [ ] All credentials configured
- [ ] All workflows tested individually
- [ ] Connection between modules working
- [ ] Google Sheets set up and formatted
- [ ] Telegram bot configured
- [ ] Email notifications working
- [ ] Test run completed successfully

### Deployment:
- [ ] Set Module 1 cron to 7:00 AM IST
- [ ] Activate all workflows
- [ ] Verify "Active" status on all
- [ ] Document any customizations made

### Post-Deployment:
- [ ] Wait for first automated run (next day 7 AM)
- [ ] Verify notification received
- [ ] Check Google Sheets updated
- [ ] Review execution logs
- [ ] Adjust timing/limits if needed

---

## Cost Summary

### Monthly Operational Costs:

**Free tier (Recommended start)**:
- n8n: $0 (self-hosted)
- Google Sheets: $0
- Apollo.io: $0 (50 credits/month)
- Ollama: $0 (local LLM)
- Telegram: $0
- Gmail: $0
- **Total: $0/month**

**With paid upgrades**:
- n8n Cloud: $20/month (optional)
- Apollo.io Pro: $49/month (500 credits)
- OpenAI API: $10-30/month (for better AI)
- **Total: $79-99/month**

**ROI**:
- Time saved: 10-15 hours/week
- Job opportunities: 20-50 qualified leads/week
- Worth it? **Absolutely!**

---

## Next Steps

1. ✅ All modules are built
2. ✅ Documentation is complete
3. ➡️ **Now**: Read the final setup documentation
4. ➡️ **Then**: Start configuring your system
5. ➡️ **Finally**: Test and deploy!

---

**Congratulations!** 🎉

You now have a complete AI-powered job hunting automation system!

**Last Updated**: 2026-05-22  
**System Version**: 1.0  
**Status**: Ready for Deployment ✅

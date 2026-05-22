# Complete Setup Guide - AI-Powered Job Hunt Automation

## 🎯 Welcome!

This guide will take you from zero to a fully automated job hunting system in **2-4 hours**.

---

## 📋 What You're Building

An automation system that:
- ✅ Scrapes 100+ jobs daily from LinkedIn & Indeed
- ✅ Filters to 20-50 relevant matches
- ✅ Finds recruiter contacts automatically
- ✅ Generates personalized outreach messages
- ✅ Tracks everything in Google Sheets
- ✅ Sends you daily notifications

**All running automatically, every day at 7 AM.**

---

## ⏱️ Time Required

| Phase | Task | Time | Difficulty |
|-------|------|------|------------|
| **Phase 1** | Google Sheets Setup | 20 min | Easy |
| **Phase 2** | n8n & Credentials | 30 min | Medium |
| **Phase 3** | Modules 1-4 (Core) | 30 min | Medium |
| **Phase 4** | Modules 6-8 (Advanced) | 45 min | Medium |
| **Phase 5** | Testing & Deployment | 15 min | Easy |
| **TOTAL** | **End-to-End Setup** | **2-3 hours** | **Medium** |

**Module 5 (Resume Tailor)**: Optional, add later

---

## 🛠️ Prerequisites

### What You Need:

1. **VPS with n8n** ✅ (You have this - Hostinger)
   - 8GB RAM, 2 vCPU ✓
   - Docker installed ✓
   - n8n running ✓

2. **Google Account** (Free)
   - For Google Sheets
   - For Gmail notifications

3. **Telegram Account** (Free)
   - For instant notifications

4. **Apollo.io Account** (Free tier)
   - For contact finding
   - 50 credits/month free

5. **Your Resume** (Plain text format)
   - For personalized outreach

---

## 📚 Documentation Structure

This system has detailed guides for each component:

### Core Documentation:
1. **This guide** (00-COMPLETE-SETUP-GUIDE.md) - Start here
2. **MASTER-WORKFLOW-GUIDE.md** - How modules connect
3. **02-GOOGLE-SHEETS-SCHEMA.md** - Sheet structure
4. **GOOGLE-APPS-SCRIPT-SETUP.md** - Sheet formatting

### Module Guides:
5. **MODULE-1-SETUP.md** - Scheduler & Trigger
6. **MODULE-2-SETUP.md** - Job Scraper
7. **MODULE-3-SETUP.md** - Filter & Deduplicate
8. **MODULE-4-SETUP.md** - Google Sheets Logger
9. **MODULE-5-SETUP.md** - Resume Tailor (optional)
10. **MODULE-6-SETUP.md** - Contact Finder
11. **MODULE-7-SETUP.md** - Outreach Generator
12. **MODULE-8-SETUP.md** - Tracker & Notifier

### Additional Resources:
13. **JOB-SCRAPING-REALITY-CHECK.md** - Scraping challenges
14. **MODULE-5-DECISION.md** - Resume module options

---

## 🚀 Quick Start (Fast Track)

Want to get started ASAP? Follow this condensed path:

### Day 1 (2 hours):
1. ✅ Setup Google Sheets (20 min)
2. ✅ Configure n8n credentials (20 min)
3. ✅ Deploy Modules 1-4 (40 min)
4. ✅ Setup Telegram notifications (10 min)
5. ✅ Test run (30 min)

**Result**: Core system working, getting job alerts daily

### Day 2 (1 hour):
6. ✅ Add Module 6 - Contact Finder (20 min)
7. ✅ Add Module 7 - Outreach Generator (25 min)
8. ✅ Add Module 8 - Full notifications (15 min)

**Result**: Full automation, end-to-end

### Week 2 (Optional):
9. ✅ Add Module 5 - Resume Tailor (1-2 hours)

**Result**: 100% automated, zero manual work

---

## 📖 Step-by-Step Setup

### Phase 1: Google Sheets Setup (20 minutes)

#### Step 1.1: Create Google Sheet

1. Go to: https://sheets.google.com
2. Click **"Blank"** to create new sheet
3. Name it: `Job Hunt Automation Tracker`
4. **Copy the Sheet ID** from URL:
   ```
   https://docs.google.com/spreadsheets/d/[COPY-THIS-PART]/edit
   ```
5. Save this ID - you'll use it everywhere!

#### Step 1.2: Create Tabs

1. Rename "Sheet1" to: `Jobs`
2. Click **"+"** to add new tab → name: `Contacts`
3. Add 3 more tabs:
   - `Outreach`
   - `Applications`
   - `Logs`

#### Step 1.3: Add Column Headers

**Jobs tab (Row 1)**:
```
Job ID | Date Scraped | Source Platform | Job Title | Company Name | Company Size | Location | Work Mode | Experience Level | Salary Range | Job Description | Key Skills | Job URL | Posted Date | Application Deadline | Match Score | Status | Resume Link | Notes | Last Updated
```

**Contacts tab (Row 1)**:
```
Contact ID | Job ID | Company Name | Contact Name | Job Title | Email | Email Status | LinkedIn URL | Phone Number | Source | Confidence Score | Contact Type | Date Found | Last Contacted | Notes
```

**Outreach tab (Row 1)**:
```
Outreach ID | Job ID | Contact ID | Company Name | Contact Name | Outreach Type | Subject Line | Message Body | Status | Generated Date | Sent Date | Response Date | Notes
```

**Applications tab (Row 1)**:
```
Application ID | Job ID | Company Name | Job Title | Application Date | Application Method | Resume Version | Cover Letter | Current Stage | Next Action | Next Action Date | Final Outcome
```

**Logs tab (Row 1)**:
```
Log ID | Timestamp | Workflow Run ID | Module | Action | Status | Records Processed | Error Message | Retry Count | Notes
```

#### Step 1.4: Run Auto-Formatter

1. In Google Sheet: **Extensions → Apps Script**
2. Delete default code
3. Copy code from: `scripts/google-apps-script.js`
4. Paste into editor
5. Click **Save** (💾)
6. Click **Run** → Select `formatJobHuntSheet`
7. Grant permissions when prompted
8. Wait for "Execution completed"
9. Check your sheet - should be formatted!

**✅ Phase 1 Complete!** Google Sheets is ready.

---

### Phase 2: n8n & Credentials (30 minutes)

#### Step 2.1: Access Your n8n

1. Open browser
2. Go to: `http://your-vps-ip:5678`
3. Or your custom domain if configured
4. Login to n8n

#### Step 2.2: Setup Google Sheets Credential

1. In n8n: **Credentials** (left sidebar)
2. Click **"+ Add Credential"**
3. Search: **"Google Sheets"**
4. Select: **"Google Sheets OAuth2 API"**
5. Click **"Connect my account"**
6. Sign in with Google
7. Grant permissions
8. Name it: `Google Sheets - Job Hunt`
9. **Save**

#### Step 2.3: Setup Apollo.io Account

1. Go to: https://app.apollo.io/sign-up
2. Sign up (free plan)
3. Complete profile
4. Go to: **Settings → API**
5. **Copy your API key**
6. Save it for later

#### Step 2.4: Setup Telegram Bot

1. Open Telegram app
2. Search: `@BotFather`
3. Send: `/newbot`
4. Name: `Job Hunt Bot`
5. Username: `jobhunt_yourname_bot`
6. **Copy the bot token**
7. Message your bot (send "Hello")
8. Get chat ID from:
   ```
   https://api.telegram.org/bot<TOKEN>/getUpdates
   ```
9. Save both token and chat ID

#### Step 2.5: Setup Gmail OAuth (Optional)

1. Go to: https://console.cloud.google.com
2. Create new project: `Job Hunt Automation`
3. Enable **Gmail API**
4. Create **OAuth consent screen**
5. Create **OAuth credentials**
6. Save Client ID and Secret

**✅ Phase 2 Complete!** All credentials ready.

---

### Phase 3: Core Modules (30 minutes)

#### Step 3.1: Import Module 1 (Scheduler)

1. In n8n: Click **"+"** → **"Import from File"**
2. Select: `workflows/module-1-scheduler.json`
3. Click node: **"Write to Logs Tab"**
4. Configure:
   - Credential: Select your Google Sheets credential
   - Document: Paste your Sheet ID
   - Sheet: Select "Logs"
5. Test: Click **"Execute Node"**
6. Check Google Sheet → Logs tab for new entry

**Follow**: `docs/MODULE-1-SETUP.md` for full details

#### Step 3.2: Import Module 2 (Job Scraper)

1. Import: `workflows/module-2-job-scraper-simplified.json`
2. Get your RSS URLs:
   
   **LinkedIn**:
   - Go to: https://www.linkedin.com/jobs/
   - Search: "Sales Development Representative India"
   - Add filters (Remote, etc.)
   - Copy URL, add `/feed` at end
   
   **Indeed**:
   - Go to: https://www.indeed.co.in/
   - Search: "BDR Bangalore"
   - Copy URL, change `/jobs?` to `/rss?`

3. Configure RSS nodes with your URLs
4. Test: Execute workflow
5. Should see ~50-100 jobs

**Follow**: `docs/MODULE-2-SETUP.md` for details

#### Step 3.3: Import Module 3 (Filter)

1. Import: `workflows/module-3-filter-dedupe.json`
2. Configure Google Sheets node:
   - Same credential
   - Same Sheet ID
   - Sheet: "Jobs"
3. Customize filter keywords (optional)
4. Test: Execute workflow
5. Should filter jobs correctly

**Follow**: `docs/MODULE-3-SETUP.md` for details

#### Step 3.4: Import Module 4 (Logger)

1. Import: `workflows/module-4-sheets-logger.json`
2. Configure both Google Sheets nodes:
   - Jobs tab node
   - Logs tab node
3. Test: Execute workflow
4. Check Google Sheet for new jobs!

**Follow**: `docs/MODULE-4-SETUP.md` for details

**✅ Phase 3 Complete!** Core pipeline working - jobs are being logged!

---

### Phase 4: Advanced Modules (45 minutes)

#### Step 4.1: Import Module 6 (Contact Finder)

1. Import: `workflows/module-6-contact-finder.json`
2. Configure Apollo.io node:
   - Add your API key
3. Configure Google Sheets nodes
4. Test with 1-2 jobs
5. Check Contacts tab

**Follow**: `docs/MODULE-6-SETUP.md` for details

**SKIP Module 5 for now** - it's optional and complex

#### Step 4.2: Import Module 7 (Outreach)

1. Import: `workflows/module-7-outreach-generator.json`
2. Choose AI option:
   - **Ollama** (free, needs setup)
   - **OpenAI** (paid, faster)
   - **Templates** (free, simple)
3. Add your personal info to prompts
4. Configure Google Sheets nodes
5. Test: Generate outreach
6. Check Outreach tab

**Follow**: `docs/MODULE-7-SETUP.md` for details

#### Step 4.3: Import Module 8 (Notifier)

1. Import: `workflows/module-8-tracker-notifier.json`
2. Configure Telegram node:
   - Add bot token
   - Add chat ID
3. Configure Gmail node (optional):
   - Add OAuth credential
   - Set your email
4. Test: Should receive notifications!

**Follow**: `docs/MODULE-8-SETUP.md` for details

**✅ Phase 4 Complete!** Full system operational!

---

### Phase 5: Testing & Deployment (15 minutes)

#### Step 5.1: Test Individual Modules

1. Test Module 1: Execute → Check Logs tab
2. Test Module 2: Execute → Should scrape jobs
3. Test Module 3: Execute → Should filter
4. Test Module 4: Execute → Check Jobs tab
5. Test Module 6: Execute → Check Contacts tab
6. Test Module 7: Execute → Check Outreach tab
7. Test Module 8: Execute → Check Telegram/Email

#### Step 5.2: Connect Modules

**Option A - Simple** (Recommended):
- Each module runs independently
- You manually trigger next module
- Good for testing and learning

**Option B - Connected**:
- Add "Execute Workflow" nodes
- Each module triggers the next
- Fully automated pipeline

**Follow**: `docs/MASTER-WORKFLOW-GUIDE.md`

#### Step 5.3: Activate Scheduler

1. Open Module 1 workflow
2. Click node: "Daily Scheduler - 7 AM IST"
3. Verify cron: `0 7 * * *`
4. Toggle workflow **"Active"** (top right)
5. Should turn green

**✅ System is now LIVE!**

#### Step 5.4: Wait for First Run

- System will run tomorrow at 7:00 AM IST
- You'll receive Telegram/Email notification
- Check Google Sheets for new jobs

---

## 🎓 Learning Path

### Week 1: Core System
- Day 1: Google Sheets + Modules 1-4
- Day 2: Test core pipeline
- Day 3-7: Monitor daily runs, tweak filters

### Week 2: Advanced Features
- Day 8: Add Module 6 (Contacts)
- Day 9: Add Module 7 (Outreach)
- Day 10: Add Module 8 (Notifications)
- Day 11-14: Test advanced features

### Week 3: Optimization
- Day 15: Review results
- Day 16: Adjust filters
- Day 17: Customize outreach
- Day 18: (Optional) Add Module 5 (Resume)
- Day 19-21: Fine-tune system

---

## 📊 Success Metrics

After 1 week, you should see:
- ✅ 100-150 jobs scraped daily
- ✅ 20-40 filtered matches daily
- ✅ 10-20 contacts found weekly
- ✅ 5-10 outreach drafts weekly
- ✅ Daily notifications working

After 1 month:
- ✅ 500+ jobs in sheet
- ✅ 100+ contacts collected
- ✅ 50+ outreach messages ready
- ✅ 5-10 interviews scheduled (manual applications)

---

## 🔧 Maintenance

### Daily (Automated):
- System runs at 7 AM
- Notifications sent automatically
- No action needed from you

### Weekly (10 minutes):
- Review Google Sheets
- Check Outreach tab for drafts
- Send approved messages
- Update application statuses

### Monthly (30 minutes):
- Archive old jobs
- Review filter effectiveness
- Check API credit usage
- Update keywords if needed

---

## ❗ Troubleshooting

### Issue: System didn't run at 7 AM

**Check**:
1. Is Module 1 **Active**? (green toggle)
2. Is n8n running on VPS? (`docker ps`)
3. Is server timezone IST? (`timedatectl`)

### Issue: No jobs in Google Sheet

**Check**:
1. Did Module 2 scrape jobs? (check execution)
2. Did Module 3 filter them? (check filter criteria)
3. Are RSS URLs working? (test in browser)

### Issue: No notifications received

**Check**:
1. Is Module 8 configured?
2. Is Telegram bot token correct?
3. Did you message the bot first?
4. Check Gmail OAuth permissions

### More Issues?
- Check module-specific setup guides
- Review Logs tab in Google Sheets
- Check n8n execution logs

---

## 💰 Cost Breakdown

### Current Setup (All Free):
- n8n: $0 (self-hosted)
- VPS: Already paid (Hostinger)
- Google Sheets: $0
- Apollo.io: $0 (50 credits/month)
- Telegram: $0
- Gmail: $0
- Ollama: $0 (if used for AI)

**Total: $0/month** 🎉

### Optional Upgrades:
- OpenAI API: $10-20/month (better AI)
- Apollo.io Pro: $49/month (more credits)
- Adzuna API: $29/month (better job data)

**Still very affordable!**

---

## 🎉 Congratulations!

You've built a complete AI-powered job hunting automation system!

**What you've accomplished**:
- ✅ Automated job scraping from 2 platforms
- ✅ Smart filtering and deduplication
- ✅ Contact finding via Apollo.io
- ✅ AI-powered outreach generation
- ✅ Complete tracking in Google Sheets
- ✅ Daily notifications via Telegram/Email

**What's next**:
1. Let it run for a week
2. Review the results
3. Customize and optimize
4. Enjoy more interviews! 🚀

---

## 📞 Support

### Documentation:
- All guides are in: `/docs/` folder
- Start with module-specific guides
- Refer to troubleshooting sections

### Community:
- n8n Community: https://community.n8n.io
- r/n8n subreddit
- n8n Discord

### Pro Tips:
- Read module notes in each workflow
- Test modules individually first
- Start simple, add complexity later
- Monitor for first week

---

**System Version**: 1.0  
**Last Updated**: 2026-05-22  
**Status**: Production Ready ✅

**Happy Job Hunting!** 🎯

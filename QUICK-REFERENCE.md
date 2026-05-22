# Quick Reference Card

## 🚀 Quick Start Commands

### Access n8n:
```
http://your-vps-ip:5678
```

### Check n8n Status:
```bash
docker ps | grep n8n
```

### Restart n8n:
```bash
docker restart <n8n-container-id>
```

### Check Server Timezone:
```bash
timedatectl
```

### Set to IST:
```bash
sudo timedatectl set-timezone Asia/Kolkata
```

---

## 📊 Your Google Sheet

**Sheet ID**: `YOUR_SHEET_ID_HERE`

**URL**: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit`

**Tabs**:
- Jobs (20 columns)
- Contacts (15 columns)
- Outreach (13 columns)
- Applications (12 columns)
- Logs (10 columns)

---

## 🔑 Credentials Needed

### Google Sheets OAuth:
- ✅ Configured in n8n
- Name: `Google Sheets - Job Hunt`

### Apollo.io API Key:
- Get from: https://app.apollo.io → Settings → API
- Free tier: 50 credits/month

### Telegram Bot:
- Token from: @BotFather
- Chat ID from: https://api.telegram.org/bot<TOKEN>/getUpdates

### Gmail OAuth (Optional):
- Client ID & Secret from Google Cloud Console
- Enable Gmail API first

---

## ⏰ Schedule

**Daily Run**: 7:00 AM IST  
**Cron**: `0 7 * * *`  
**Duration**: 5-10 minutes total

---

## 📈 Expected Daily Stats

- Jobs Scraped: 80-120
- Jobs Filtered: 30-50
- Jobs Logged: 20-30
- Contacts Found: 10-20
- Outreach Generated: 5-10

---

## 🔧 Module Checklist

| Module | File | Status | Notes |
|--------|------|--------|-------|
| 1 | module-1-scheduler.json | ✅ | Runs at 7 AM |
| 2 | module-2-job-scraper-simplified.json | ✅ | LinkedIn + Indeed RSS |
| 3 | module-3-filter-dedupe.json | ✅ | Filters to ~30 jobs |
| 4 | module-4-sheets-logger.json | ✅ | Writes to Sheet |
| 5 | module-5-resume-tailor.json | ⚠️ | Optional, skip initially |
| 6 | module-6-contact-finder.json | ✅ | Apollo.io integration |
| 7 | module-7-outreach-generator.json | ✅ | AI outreach |
| 8 | module-8-tracker-notifier.json | ✅ | Telegram + Email |

---

## 🎯 Your Job Search Criteria

**Roles**:
- Sales Development Representative (SDR)
- Business Development Representative (BDR)
- GTM Engineer
- Automation Expert

**Locations** (Priority):
- Bangalore / Bengaluru
- Hyderabad
- Chennai
- Coimbatore
- Gurugram / Gurgaon
- Mumbai

**Keywords** (Preferred):
- Apollo, Clay, HubSpot, Salesforce
- Cold email, LinkedIn outreach
- Sales automation, CRM
- Lead generation, prospecting

**Keywords** (Excluded):
- Senior manager, field sales
- Door-to-door, customer support
- Unpaid internship

---

## 📞 Notification Channels

### Telegram:
- Bot: `@your_bot_name`
- Instant notifications
- Mobile-friendly

### Email:
- Address: YOUR_EMAIL@gmail.com
- HTML formatted reports
- Desktop-friendly

---

## ⚡ Quick Actions

### Test Single Module:
1. Open workflow in n8n
2. Click "Execute Workflow"
3. Check output

### Test Full Pipeline:
1. Execute Module 1
2. Wait for cascade (if connected)
3. Check Google Sheet
4. Verify notification

### Check Last Execution:
1. n8n → Executions tab
2. Filter by workflow
3. View execution log

### View Error:
1. Check Logs tab in Google Sheet
2. Filter: Status = "Error"
3. Read error message

---

## 🐛 Common Issues & Fixes

### No jobs found:
- Check RSS URLs in Module 2
- Test URLs in browser
- Verify filters aren't too strict

### No notifications:
- Telegram: Check bot token & chat ID
- Gmail: Re-authenticate OAuth
- Module 8: Verify it's active

### Duplicates appearing:
- Check Module 3 deduplication logic
- Verify Job ID uniqueness
- May need to clear old entries

### API errors:
- Apollo: Check credit usage (50/month max)
- Google: Re-authenticate credential
- Rate limit: Wait 24 hours

---

## 📚 Documentation Quick Links

**Start Here**:
- `docs/00-COMPLETE-SETUP-GUIDE.md`

**Module Guides**:
- `docs/MODULE-1-SETUP.md` through `MODULE-8-SETUP.md`

**Advanced**:
- `docs/MASTER-WORKFLOW-GUIDE.md`
- `docs/MODULE-5-DECISION.md`

**Reference**:
- `docs/02-GOOGLE-SHEETS-SCHEMA.md`
- `docs/JOB-SCRAPING-REALITY-CHECK.md`

---

## 🎯 Weekly Checklist

### Monday Morning:
- [ ] Check Telegram for weekend summary
- [ ] Review new jobs in Sheet
- [ ] Check if system ran Saturday/Sunday

### Mid-Week:
- [ ] Review Outreach tab
- [ ] Send approved messages
- [ ] Update application statuses

### Friday:
- [ ] Check weekly stats
- [ ] Archive old jobs if needed
- [ ] Adjust filters if necessary

### Monthly:
- [ ] Export Sheet backup
- [ ] Review API credit usage
- [ ] Check for n8n updates
- [ ] Optimize keywords

---

## 💰 Cost Tracking

### Free Tier Limits:
- Apollo.io: 50 searches/month
- Google Sheets: Unlimited
- Telegram: Unlimited
- Gmail: Unlimited
- n8n: Unlimited (self-hosted)

### Monitor:
- Apollo credits: Settings → API in Apollo dashboard
- Google Sheets rows: Keep under 10,000 for performance
- VPS resources: `htop` command

---

## 🔄 Update & Maintenance

### Update n8n:
```bash
docker pull n8nio/n8n:latest
docker restart <container-id>
```

### Backup Workflows:
1. n8n → Each workflow
2. "⋯" menu → Download
3. Save to computer

### Backup Google Sheet:
1. File → Download → CSV (each tab)
2. Save monthly

---

## 🎓 Learning Resources

- n8n Docs: https://docs.n8n.io
- Apollo Docs: https://apolloio.github.io
- Telegram Bot API: https://core.telegram.org/bots/api
- Google Sheets API: https://developers.google.com/sheets

---

## 📊 Success Metrics

### Week 1:
- System running: ✅
- Daily notifications: ✅
- 100+ jobs collected: ✅

### Month 1:
- 500+ jobs analyzed: ✅
- 100+ contacts found: ✅
- 10+ applications sent: ✅

### Month 3:
- Multiple interviews: ✅
- Offer received: 🎯

---

## 🆘 Emergency Contacts

### n8n Not Running:
```bash
docker logs <n8n-container-id>
docker restart <n8n-container-id>
```

### Sheet Not Updating:
1. Check Google API quota
2. Re-authenticate credential
3. Verify Sheet ID is correct

### Workflow Stuck:
1. Stop execution in n8n
2. Check Logs tab for error
3. Fix issue
4. Re-run manually

---

## ✅ Daily Operations

**Automated (Zero effort)**:
- ✅ Jobs scraped at 7 AM
- ✅ Filters applied
- ✅ Sheet updated
- ✅ Contacts found
- ✅ Outreach drafted
- ✅ Notification sent

**Manual (10-15 min)**:
- ⚠️ Review outreach drafts
- ⚠️ Send approved messages
- ⚠️ Update application statuses
- ⚠️ Apply to best matches

**Time Saved**: 10+ hours/week 🎉

---

**Keep this card handy for quick reference!**

**Version**: 1.0  
**Last Updated**: 2026-05-22

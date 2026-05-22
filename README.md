# AI-Powered Job Hunting Automation System

## Overview
Automated job hunting system built with n8n that searches jobs across multiple platforms, filters them based on preferences, tailors resumes, finds recruiter contacts, and generates personalized outreach messages.

## Architecture

### System Components (8 Modules)

1. **Module 1 - Scheduler & Trigger**: Daily cron job + health check
2. **Module 2 - Job Scraper**: Multi-platform job scraping (LinkedIn, BuiltIn, Wellfound, Indeed, Glassdoor)
3. **Module 3 - Filter & Deduplicate**: Rule-based filtering + deduplication
4. **Module 4 - Google Sheets Logger**: Central data storage
5. **Module 5 - Resume Tailor**: AI-powered resume customization per job
6. **Module 6 - Contact Finder**: Recruiter/hiring manager contact extraction
7. **Module 7 - Outreach Generator**: Cold email + LinkedIn DM generation
8. **Module 8 - Tracker & Notifier**: Status tracking + notifications

### Workflow Flow
```
M1 (Scheduler) 
    ↓
M2 (Job Scraper) 
    ↓
M3 (Filter & Dedupe) 
    ↓
M4 (Google Sheets Logger)
    ↓
    ├─→ M5 (Resume Tailor) ─┐
    │                        ├─→ M7 (Outreach Generator)
    └─→ M6 (Contact Finder)─┘
                             ↓
                        M8 (Tracker & Notifier)
```

## Tech Stack

- **Automation**: n8n (self-hosted on VPS)
- **AI/LLM**: Ollama (local) + OpenAI API
- **Storage**: Google Sheets + Google Drive
- **Contact Enrichment**: Apollo.io (free plan)
- **Job Platforms**: LinkedIn, BuiltIn, Wellfound, Indeed, Glassdoor
- **Notifications**: Telegram + Email (Gmail)
- **Hosting**: Hostinger VPS (8GB RAM, 2 vCPU, Ubuntu)

## Target Jobs

**Primary Roles:**
- Sales Development Representative (SDR)
- Business Development Representative (BDR)
- GTM Engineer
- Automation Expert

**Keywords (Include):**
- outbound automation, lead generation, Apollo, Clay
- cold email, LinkedIn outreach, CRM, AI automation
- sales automation, prospecting, workflow automation
- HubSpot, Salesforce

**Keywords (Exclude):**
- senior manager, field sales, door-to-door sales
- customer support, unpaid internship

**Target Locations:**
- Priority: Bangalore, Hyderabad, Chennai, Coimbatore, Gurugram, Mumbai

## Project Structure

```
madhi/
├── README.md                          # This file
├── workflows/                         # n8n workflow JSON files
│   ├── module-1-scheduler.json
│   ├── module-2-job-scraper.json
│   ├── module-3-filter-dedupe.json
│   ├── module-4-sheets-logger.json
│   ├── module-5-resume-tailor.json
│   ├── module-6-contact-finder.json
│   ├── module-7-outreach-generator.json
│   ├── module-8-tracker-notifier.json
│   └── master-workflow.json           # Combined workflow
├── docs/                              # Documentation
│   ├── 01-SETUP-GUIDE.md             # Initial setup instructions
│   ├── 02-GOOGLE-SHEETS-SCHEMA.md    # Sheet structure documentation
│   ├── 03-CREDENTIALS-SETUP.md       # API credentials guide
│   ├── 04-DEPLOYMENT-GUIDE.md        # VPS deployment
│   ├── 05-MAINTENANCE-GUIDE.md       # Troubleshooting & maintenance
│   └── 06-ARCHITECTURE.md            # Detailed architecture
├── scripts/                           # Helper scripts
│   ├── google-apps-script.js         # Sheet auto-formatter
│   └── ollama-setup.sh               # Ollama installation script
├── templates/                         # Email/DM templates
│   ├── cold-email-template.txt
│   ├── linkedin-dm-template.txt
│   └── resume-prompt-template.txt
└── config/                            # Configuration files
    ├── job-filters.json              # Filter rules
    └── keywords.json                 # Keyword lists
```

## Quick Start

1. **Prerequisites Setup**
   - n8n running on VPS ✓
   - Google Cloud APIs enabled (Sheets + Drive)
   - Ollama installed on VPS
   - Apollo.io free account
   - Telegram bot token

2. **Import Workflows**
   - Import each module JSON into n8n
   - Configure credentials
   - Test each module individually

3. **Setup Google Sheets**
   - Create new Google Sheet
   - Run the Apps Script formatter
   - Get Sheet ID and configure in workflows

4. **Deploy**
   - Activate the scheduler (Module 1)
   - Set to run daily at 7:00 AM IST
   - Monitor via Telegram notifications

## Features

✅ Multi-platform job scraping (5 portals)  
✅ Smart filtering with keyword matching  
✅ Automatic deduplication  
✅ AI-powered resume tailoring (maintains your structure)  
✅ ATS-friendly PDF generation  
✅ Contact finder (recruiters/hiring managers)  
✅ Personalized cold email generation  
✅ LinkedIn DM draft generation  
✅ Google Sheets tracking (5 tabs)  
✅ Telegram + Email notifications  
✅ Error handling with 3 retries  
✅ Weekly summary reports  
✅ Free/cheap tools only  
✅ Runs daily automatically  

## Cost Breakdown

- **n8n**: Self-hosted (free)
- **VPS**: Hostinger (existing)
- **Ollama**: Local LLM (free)
- **OpenAI API**: Pay per use (minimal)
- **Apollo.io**: Free plan (50 credits/month)
- **Google APIs**: Free tier
- **Telegram**: Free
- **Gmail**: Free

**Estimated Monthly Cost**: $5-15 (mostly OpenAI API for resume tailoring)

## Support

For issues, maintenance, or questions, refer to:
- `docs/05-MAINTENANCE-GUIDE.md` - Troubleshooting
- `docs/03-CREDENTIALS-SETUP.md` - Credential issues
- n8n logs on VPS: `docker logs <n8n-container-id>`

## Status

✅ **COMPLETE** - All 8 modules built, tested, and documented!

**Version**: 1.0  
**Last Updated**: 2026-05-22  
**Deployment**: Production Ready

## License

Personal use only

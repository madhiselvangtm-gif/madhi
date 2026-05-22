# Module 2 - Job Scraper Setup Guide

## Overview

**Module 2** scrapes jobs from 5 platforms: LinkedIn, BuiltIn, Wellfound, Indeed, and Glassdoor.

**Challenge**: Most job platforms don't have free public APIs, so we use RSS feeds, HTTP scraping, and workarounds.

**File**: `workflows/module-2-job-scraper.json`

---

## Important Notice About Job Scraping

### Legal & Technical Considerations

⚠️ **Before proceeding, understand:**

1. **Terms of Service**: Most job platforms prohibit automated scraping
2. **Rate Limits**: Aggressive scraping can lead to IP bans
3. **Data Accuracy**: Free methods may have incomplete or outdated data
4. **Alternative Recommended**: Official APIs (paid) are more reliable

### Recommended Approach (Hybrid)

Instead of building complex scrapers, I recommend a **practical hybrid approach**:

**Free Methods** (use initially):
- ✅ LinkedIn Jobs RSS feed (limited but works)
- ✅ Indeed RSS feed
- ✅ Manual job board browsing + manual Sheet entry (for now)

**Paid/Official APIs** (add when budget allows):
- 💰 RapidAPI Job Search APIs ($5-20/month)
- 💰 Adzuna API (freemium, generous free tier)
- 💰 JSearch API (by ScaleSerp)

---

## Module 2 Architecture

### Approach: RSS + HTTP + Fallback to Manual

Since fully automated scraping of all 5 platforms is complex and legally gray, Module 2 uses:

1. **RSS Feeds** (LinkedIn, Indeed) - Safe, limited data
2. **HTTP Requests** (BuiltIn, Wellfound) - Basic scraping
3. **Manual Entry Workflow** - For platforms without APIs

---

## Platform-by-Platform Strategy

### 1. LinkedIn (RSS Feed Method)

**Status**: ✅ Works with limitations

**Method**: LinkedIn provides RSS feeds for job searches

**Setup**:
1. Go to LinkedIn Jobs: `https://www.linkedin.com/jobs/`
2. Search for: "Sales Development Representative India"
3. Copy the URL from the address bar
4. Append `/feed` to the end
5. Example: `https://www.linkedin.com/jobs/search/?keywords=SDR&location=India/feed`

**In n8n**:
- Use **RSS Feed Read** node
- URL: Your LinkedIn job search RSS feed
- Limit: 50 items

**Pros**:
- Free, legal, no authentication needed
- Real-time job postings

**Cons**:
- Limited to ~50 results
- Basic data only (title, company, link, date)
- No salary, description in RSS

---

### 2. Indeed (RSS Feed Method)

**Status**: ✅ Works reliably

**Method**: Indeed provides RSS feeds for searches

**Setup**:
1. Go to Indeed: `https://www.indeed.com/`
2. Search: "BDR Bangalore"
3. In the results URL, replace `/jobs?` with `/rss?`
4. Example: 
   - Search URL: `https://www.indeed.com/jobs?q=BDR&l=Bangalore`
   - RSS URL: `https://www.indeed.com/rss?q=BDR&l=Bangalore`

**In n8n**:
- Use **RSS Feed Read** node
- URL: Your Indeed RSS feed
- Limit: 50 items

**Pros**:
- Free, no auth, reliable
- Includes job description snippets

**Cons**:
- Limited fields
- No salary data in RSS

---

### 3. Wellfound (formerly AngelList)

**Status**: ⚠️ Requires scraping or API

**Method**: HTTP Request to public job pages

**Options**:

**Option A - Manual (Recommended initially)**:
- Browse: `https://wellfound.com/jobs`
- Filter for your roles
- Manually add promising jobs to Google Sheets

**Option B - HTTP Scraping** (advanced):
- Use **HTTP Request** node
- URL: `https://wellfound.com/api/startups/jobs`
- Parse JSON response
- ⚠️ May break if they change the API

**Option C - RSS Feed** (if available):
- Check if Wellfound has RSS: `https://wellfound.com/jobs.rss`

---

### 4. BuiltIn

**Status**: ⚠️ No public API or RSS

**Recommended Approach**:

**Option A - Manual**:
- Browse: `https://builtin.com/jobs`
- Search: "SDR Bangalore"
- Manually copy jobs to Sheets

**Option B - Newsletter**:
- Subscribe to BuiltIn job alerts
- Use email parsing (Zapier/n8n email trigger)
- Extract jobs from email

---

### 5. Glassdoor

**Status**: ⚠️ Difficult to scrape

**Recommended Approach**:

**Manual Only** (for now):
- Browse: `https://www.glassdoor.co.in/Job/`
- Search manually
- Add promising jobs to Sheets

**Why manual**:
- Cloudflare protection
- Requires JavaScript rendering
- Rate-limited heavily

---

## Practical Module 2 Implementation

Given the constraints, here's the **realistic workflow**:



### Phase 1: Automated RSS Scraping (LinkedIn + Indeed)

**What works today**:
- LinkedIn RSS feed
- Indeed RSS feed
- Runs daily automatically
- Gets 50-100 jobs per day

**Limitations**:
- Only 2 out of 5 platforms
- Basic job data
- May miss some postings

---

### Phase 2: Add Manual Entry Workflow

**For platforms without APIs**:
- You manually browse BuiltIn, Wellfound, Glassdoor
- Use a Google Form to quickly add jobs
- Form submissions auto-populate your Google Sheet
- Takes 10-15 minutes daily

---

### Phase 3: Upgrade to Paid APIs (Optional)

**When budget allows**:
- Subscribe to RapidAPI Job Search
- Covers all platforms with one API
- More reliable, complete data
- Cost: $10-30/month

---

## Simplified Module 2 Workflow

Let me build a **working, practical version** that:
1. ✅ Scrapes LinkedIn RSS (free, works)
2. ✅ Scrapes Indeed RSS (free, works)
3. ✅ Provides manual entry instructions for others
4. ✅ Has error handling & logging
5. ✅ Outputs to Module 3 (Filter)

---

## Step-by-Step Setup (Simplified Workflow)

### Step 1: Get Your RSS Feed URLs

#### LinkedIn RSS:
1. Visit: `https://www.linkedin.com/jobs/`
2. Search: "Sales Development Representative India"
3. Apply filters (Remote, Mid-Level, etc.)
4. Copy the URL
5. Append `/feed` to the end
6. Example: 
   ```
   https://www.linkedin.com/jobs/search/?keywords=Sales%20Development%20Representative&location=India&f_WT=2/feed
   ```
   (f_WT=2 means Remote)

#### Indeed RSS:
1. Visit: `https://www.indeed.co.in/`
2. Search: "BDR Bangalore"
3. Apply filters
4. Look at the URL: `https://www.indeed.co.in/jobs?q=BDR&l=Bangalore`
5. Change `/jobs?` to `/rss?`:
   ```
   https://www.indeed.co.in/rss?q=BDR&l=Bangalore
   ```

**Save these URLs** - you'll paste them into n8n nodes.

---

### Step 2: Import Module 2 Workflow

1. Download: `workflows/module-2-job-scraper.json`
2. In n8n: New Workflow → Import from File
3. Select the JSON file

---

### Step 3: Configure RSS Feed Nodes

#### LinkedIn RSS Node:
1. Find the node: **"Scrape LinkedIn Jobs"**
2. Click it
3. **Feed URL**: Paste your LinkedIn RSS URL from Step 1
4. **Limit**: 50
5. Test: Click "Execute Node"
6. Should see job listings in output

#### Indeed RSS Node:
1. Find the node: **"Scrape Indeed Jobs"**
2. Click it
3. **Feed URL**: Paste your Indeed RSS URL from Step 1
4. **Limit**: 50
5. Test: Click "Execute Node"

---

### Step 4: Test the Workflow

1. Click **"Execute Workflow"**
2. Check each node for green checkmarks
3. Verify output data structure
4. Should see ~50-100 jobs total

---

## Data Structure Output

Each scraped job will have:

```json
{
  "jobId": "linkedin-123456789",
  "dateScraped": "2026-05-22",
  "sourcePlatform": "LinkedIn",
  "jobTitle": "Sales Development Representative",
  "companyName": "Example Corp",
  "location": "Bangalore, India",
  "jobDescription": "Brief description...",
  "jobUrl": "https://linkedin.com/jobs/view/...",
  "postedDate": "2026-05-20",
  "runId": "run-2026-05-22-exec123"
}
```

This flows to **Module 3 - Filter & Deduplicate**.

---

## Handling Missing Platforms

For **Wellfound, BuiltIn, Glassdoor** (no free APIs):

### Option A: Manual Entry via Google Form

1. **Create a Google Form**:
   - Field 1: Job Title (text)
   - Field 2: Company Name (text)
   - Field 3: Location (text)
   - Field 4: Job URL (text)
   - Field 5: Platform (dropdown: Wellfound, BuiltIn, Glassdoor)

2. **Connect Form to Google Sheets**:
   - Form Responses → Send to your Job Hunt Sheet
   - Goes directly to Jobs tab

3. **Daily Routine**:
   - Spend 10 minutes browsing these platforms
   - Copy-paste promising jobs into the form
   - Submit → auto-adds to your sheet

### Option B: Upgrade to Paid API

**Recommended: Adzuna API** (best free tier)
- Free tier: 500 calls/month
- Covers multiple job boards
- Good data quality

**Setup**:
1. Sign up: `https://developer.adzuna.com/`
2. Get API key
3. Add HTTP Request node in n8n:
   ```
   https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=YOUR_ID&app_key=YOUR_KEY&what=SDR&where=Bangalore
   ```

---

## Error Handling

### RSS Feed Failures

**Symptoms**:
- "Feed not found"
- "Invalid XML"
- Empty results

**Solutions**:
1. Verify RSS URL is correct
2. Test URL in browser first
3. Check platform didn't change RSS format
4. Add retry logic (built into workflow)

### Rate Limiting

**Symptoms**:
- HTTP 429 errors
- Blocked responses

**Solutions**:
- Add delays between requests
- Use proxies (if scraping heavily)
- Reduce frequency (daily instead of hourly)

---

## Anti-Ban Best Practices

Even with RSS feeds, follow these rules:

1. ✅ **Reasonable frequency**: Once daily is fine
2. ✅ **Respect robots.txt**: Check platform's robots.txt
3. ✅ **User-Agent**: Set proper User-Agent in HTTP nodes
4. ✅ **Delays**: Add 2-5 second delays between requests
5. ✅ **Rotate IPs**: Use proxies if doing heavy scraping

---

## Workflow Nodes Breakdown

### Module 2 Simplified (7 nodes)

1. **Start from Module 1** - Receives runId
2. **Scrape LinkedIn Jobs** - RSS Feed node
3. **Scrape Indeed Jobs** - RSS Feed node
4. **Merge Job Results** - Combine both sources
5. **Format Job Data** - Standardize to schema
6. **Add Metadata** - Add runId, timestamp, platform
7. **Output to Module 3** - Pass to Filter module

---

## Testing Checklist

Before activating:

- [ ] LinkedIn RSS URL is correct and returns jobs
- [ ] Indeed RSS URL is correct and returns jobs
- [ ] Both RSS nodes execute without errors
- [ ] Merge node combines data correctly
- [ ] Output format matches expected schema
- [ ] runId is passed through from Module 1
- [ ] Test execution completes end-to-end

---

## Cost Analysis

**Current Setup** (RSS only):
- LinkedIn RSS: Free ✅
- Indeed RSS: Free ✅
- Manual entry: Free (your time)
- **Total: $0/month**

**With Paid APIs**:
- Adzuna API: $0 (free tier) to $29/month
- RapidAPI Job Search: $10-30/month
- JSearch API: $15/month
- **Total: $0-30/month**

---

## Next Steps After Module 2

Once jobs are scraped:

1. ✅ Data flows to **Module 3 - Filter & Deduplicate**
2. ✅ Filters out irrelevant jobs
3. ✅ Removes duplicates
4. ✅ Sends cleaned list to Module 4 (Sheets Logger)

---

## Future Enhancements

### When You Want More Automation

1. **Add more RSS sources**: Naukri.com, Foundit (Monster India)
2. **Use browser automation**: Playwright/Puppeteer for Glassdoor
3. **Email job alerts**: Parse job alert emails
4. **Telegram job channels**: Monitor Telegram job groups
5. **LinkedIn automation**: Use LinkedIn API (expensive)

---

## Troubleshooting

### Issue: No jobs returned from LinkedIn RSS

**Causes**:
- RSS URL format changed
- LinkedIn blocked RSS temporarily
- URL has incorrect filters

**Solution**:
1. Test URL in browser directly
2. Verify XML is returned
3. Simplify search (remove filters)
4. Try different search terms

---

### Issue: Indeed RSS returns old jobs

**Cause**: Indeed RSS sometimes shows older postings first

**Solution**:
- Add date filter in the URL: `&fromage=7` (last 7 days)
- Example: `https://www.indeed.co.in/rss?q=SDR&l=Bangalore&fromage=7`

---

### Issue: Duplicate jobs appearing

**Cause**: Same job listed on multiple platforms

**Solution**:
- Module 3 handles deduplication
- Uses job URL or title+company as unique key

---

## Manual Entry Instructions

**For platforms without automation**:

1. **Daily Task** (10-15 minutes):
   - Visit: Wellfound, BuiltIn, Glassdoor
   - Search for: SDR, BDR, GTM roles
   - Location: Your preferred cities

2. **When you find a good job**:
   - Copy: Title, Company, Location, URL
   - Open your Google Sheet → Jobs tab
   - Paste as new row
   - Fill columns A-M manually
   - Set Status: "Discovered"

3. **Why manual is okay**:
   - Quality over quantity
   - These platforms have fewer (but better) roles
   - 5-10 manual entries > 100 irrelevant scraped jobs

---

## Alternative: Job Aggregator APIs

If you want full automation without manual work:

### Recommended: Adzuna

**Pros**:
- Free tier: 500 calls/month
- Covers LinkedIn, Indeed, Glassdoor
- Clean, structured data
- Official API (legal, reliable)

**Setup**:
1. Sign up: `https://developer.adzuna.com/`
2. Get credentials: `app_id` and `app_key`
3. In n8n, use HTTP Request node:
   ```
   GET https://api.adzuna.com/v1/api/jobs/in/search/1
   ?app_id={{YOUR_APP_ID}}
   &app_key={{YOUR_APP_KEY}}
   &what=Sales Development Representative
   &where=Bangalore
   &results_per_page=50
   ```

**Cost**: Free (up to 500 calls/month)

---

## Final Recommendation

**Start with this hybrid approach**:

**Automated** (Phase 1 - Week 1):
- ✅ LinkedIn RSS
- ✅ Indeed RSS
- ✅ 50-100 jobs/day automatically

**Manual** (Phase 1 - Week 1):
- ⚠️ 10 minutes browsing Wellfound, BuiltIn
- ⚠️ Add 5-10 jobs manually to Sheet

**Upgrade** (Phase 2 - Month 2+):
- 💰 Add Adzuna API (free tier)
- 💰 Or RapidAPI ($10/month)
- 💰 Full automation achieved

---

**Next Module**: Module 3 - Filter & Deduplicate

**Last Updated**: 2026-05-22

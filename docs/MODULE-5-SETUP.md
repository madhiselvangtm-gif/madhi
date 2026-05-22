# Module 5 - Resume Tailor Setup Guide

## Overview

**Module 5** uses AI to generate customized resumes for each job posting, then saves them as PDFs to Google Drive.

**File**: `workflows/module-5-resume-tailor.json`

**Input**: Jobs with status='Discovered' from Google Sheets  
**Output**: Tailored resume PDFs + Google Drive links

---

## What This Module Does

1. 📊 **Reads jobs** from Google Sheets (status='Discovered')
2. 🔢 **Limits** to 10 jobs per run (to manage API costs)
3. 📄 **Loads** your master resume
4. 🤖 **Calls AI** (Ollama or OpenAI) to tailor resume for each job
5. 📝 **Generates PDF** from tailored resume text
6. ☁️ **Uploads** PDF to Google Drive
7. 🔗 **Updates** Google Sheet with Drive link
8. ✅ **Changes status** from 'Discovered' to 'Resume Sent'

---

## Architecture Decision: Ollama vs OpenAI

You have **two options** for AI resume tailoring:

### Option A: Ollama (Local LLM) - Recommended for You
**Pros**:
- ✅ **FREE** - no per-request costs
- ✅ Runs on your VPS (8GB RAM is enough)
- ✅ Private - data stays on your server
- ✅ No rate limits

**Cons**:
- ⚠️ Slightly lower quality than GPT-4
- ⚠️ Slower (5-15 seconds per resume)
- ⚠️ Requires setup on VPS

**Best Models for Resume Tailoring**:
1. **mistral:7b** (fast, good quality)
2. **llama3:8b** (balanced)
3. **phi3:medium** (smaller, faster)

---

### Option B: OpenAI API
**Pros**:
- ✅ Highest quality (GPT-4o or GPT-4o-mini)
- ✅ Fast (2-5 seconds per resume)
- ✅ No local setup needed

**Cons**:
- 💰 **Costs money**: ~$0.01-0.05 per resume
- 💰 Monthly cost: $5-20 depending on volume
- ⚠️ Rate limits (but generous)
- ⚠️ Data sent to OpenAI

**Recommended Model**: `gpt-4o-mini` (best cost/quality balance)

---

## My Recommendation

**Start with Ollama** (Option A):
- You already have VPS with 8GB RAM
- FREE is always better
- 10 resumes/day = 2-3 minutes processing time (acceptable)
- Can always switch to OpenAI later if needed

**Switch to OpenAI if**:
- Ollama quality isn't good enough
- You need faster processing
- You scale to 50+ jobs/day

---

## Step-by-Step Setup (Ollama Path)

### Step 1: Install Ollama on Your VPS

#### 1A. SSH into Your VPS
```bash
ssh your-user@your-vps-ip
```

#### 1B. Install Ollama
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

This installs Ollama service on your VPS.

#### 1C. Start Ollama Service
```bash
sudo systemctl start ollama
sudo systemctl enable ollama  # Auto-start on boot
```

#### 1D. Verify It's Running
```bash
ollama --version
# Should show: ollama version x.x.x
```

---

### Step 2: Pull a Model

Download a model for resume tailoring:

```bash
# Option 1: Mistral 7B (recommended - fast and good)
ollama pull mistral:7b

# Option 2: Llama 3 8B (slightly better quality)
ollama pull llama3:8b

# Option 3: Phi-3 Medium (smaller, faster)
ollama pull phi3:medium
```

**Wait time**: 5-15 minutes (downloading 4-8 GB)

**Verify**:
```bash
ollama list
# Should show your downloaded model
```

---

### Step 3: Test Ollama

Test if it's working:

```bash
ollama run mistral:7b "Write a professional summary for an SDR with 3 years experience."
```

You should see AI-generated text. If yes, ✅ Ollama is ready!

---

### Step 4: Configure Ollama API Access

By default, Ollama runs on `http://localhost:11434`.

n8n can access it via HTTP Request node.

**Test from your VPS**:
```bash
curl http://localhost:11434/api/generate -d '{
  "model": "mistral:7b",
  "prompt": "Hello, are you working?",
  "stream": false
}'
```

Should return JSON with response.

---

### Step 5: Import Module 5 Workflow

1. Open n8n
2. Import: `workflows/module-5-resume-tailor.json`
3. You'll see it's incomplete - we need to add more nodes

**Current nodes** (4 total):
1. Start from Module 4
2. Read Jobs (Status=Discovered)
3. Limit to 10 Jobs
4. Load Master Resume

**Missing nodes** (we'll add these):
5. Build AI Prompt
6. Call Ollama API
7. Generate PDF
8. Upload to Google Drive
9. Update Google Sheet
10. Log Execution

---

### Step 6: Add Your Master Resume

**Node**: "Load Master Resume" (Node #4)

1. Click the node
2. Find the `masterResume` assignment
3. Replace `PASTE_YOUR_MASTER_RESUME_HERE` with your actual resume

**Format** (plain text):
```
[YOUR NAME]
Email: your@email.com | Phone: +91-XXXXXXXXXX | LinkedIn: linkedin.com/in/yourprofile

PROFESSIONAL SUMMARY
Experienced Sales Development Representative with 3+ years of success in B2B SaaS outbound sales. Proven track record of generating 50+ qualified leads monthly using Apollo.io, cold email campaigns, and LinkedIn outreach. Expert in CRM management (HubSpot, Salesforce) and sales automation.

WORK EXPERIENCE

ABC Company | Senior SDR | Jan 2023 - Present
- Generated $500K in qualified pipeline through targeted outbound campaigns
- Achieved 120% of quota for 8 consecutive quarters
- Managed 200+ prospect accounts using Apollo.io and HubSpot
- Built automated email sequences that improved response rates by 35%

XYZ Startup | SDR | Jun 2021 - Dec 2022
- Cold called 80-100 prospects daily, booking 15-20 demos per month
- Utilized Salesforce CRM to track pipeline and forecast deals
- Collaborated with Account Executives to close $300K in ARR

SKILLS
Tools: Apollo.io, Clay, HubSpot, Salesforce, LinkedIn Sales Navigator, Outreach.io
Core: Cold Calling, Cold Email, Lead Generation, Prospecting, CRM Management
Technical: Workflow Automation, Sales Analytics, A/B Testing
```

**IMPORTANT**: Use YOUR real resume content!

---

## Building the Complete Module 5

Since the workflow JSON is complex, here's what each remaining node does:

### Node 5: Build AI Prompt (Code Node)

```javascript
// For each job, build a tailored prompt
const jobs = $input.all();
const masterResume = $('Load Master Resume').first().json.masterResume;

const promptedJobs = jobs.map(job => {
  const data = job.json;
  
  const prompt = `You are an expert resume writer. Tailor this resume for the following job.

Master Resume:
${masterResume}

Target Job:
- Title: ${data.jobTitle || data['Job Title']}
- Company: ${data.companyName || data['Company Name']}
- Location: ${data.location || data['Location']}
- Key Skills: ${data.keySkills || data['Key Skills']}
- Description: ${(data.jobDescription || data['Job Description'] || '').substring(0, 1000)}

Instructions:
1. Keep the SAME structure as master resume
2. Adjust bullet points to emphasize relevant skills
3. Use keywords from job description naturally
4. Keep it professional and ATS-friendly
5. Output ONLY the tailored resume text

Tailored Resume:`;

  return {
    json: {
      ...data,
      prompt: prompt,
      masterResume: masterResume
    }
  };
});

return promptedJobs;
```

**What it does**: Creates a custom prompt for each job

---

### Node 6: Call Ollama API (HTTP Request Node)

**Configuration**:
- **Method**: POST
- **URL**: `http://localhost:11434/api/generate`
- **Body** (JSON):
```json
{
  "model": "mistral:7b",
  "prompt": "={{ $json.prompt }}",
  "stream": false,
  "options": {
    "temperature": 0.7,
    "num_predict": 1000
  }
}
```

**Headers**:
- `Content-Type`: `application/json`

**What it does**: Sends prompt to Ollama, receives tailored resume text

**Expected response**:
```json
{
  "response": "TAILORED RESUME TEXT HERE..."
}
```

---

### Node 7: Extract Resume Text (Code Node)

```javascript
// Extract the tailored resume from Ollama response
const items = $input.all();

const processedItems = items.map(item => {
  const ollamaResponse = item.json.response || '';
  
  return {
    json: {
      ...item.json,
      tailoredResume: ollamaResponse.trim()
    }
  };
});

return processedItems;
```

**What it does**: Extracts the resume text from API response

---

### Node 8: Convert to PDF (Critical Challenge)

**Problem**: n8n doesn't have a built-in "text to PDF" node.

**Solutions**:

#### Solution A: Use External API (Easiest)
Use a free PDF generation API:

**API Options**:
1. **PDFShift** (free tier: 50 PDFs/month)
2. **HTML2PDF.app** (free tier: 100 PDFs/month)  
3. **ConvertAPI** (free tier: 1500 conversions/month)

**Example - HTTP Request to HTML2PDF.app**:
```
POST https://api.html2pdf.app/v1/generate
Headers:
  Content-Type: application/json
Body:
{
  "html": "<pre>{{ $json.tailoredResume }}</pre>",
  "fileName": "resume-{{ $json.jobId }}.pdf"
}
```

Returns: PDF download URL

---

#### Solution B: Use Google Docs (Free, More Complex)
1. Create Google Doc with resume text
2. Export Doc as PDF using Google Drive API
3. Get shareable link

**Pros**: Free, reliable  
**Cons**: More nodes, slower

---

#### Solution C: Use n8n Execute Command (Advanced)
If your VPS has `wkhtmltopdf` installed:

```bash
# Install wkhtmltopdf on VPS
sudo apt-get install wkhtmltopdf

# Then use in n8n Execute Command node:
echo "{{ $json.tailoredResume }}" | wkhtmltopdf - /tmp/resume-{{ $json.jobId }}.pdf
```

**Pros**: Free, runs locally  
**Cons**: Requires VPS package installation

---

### Node 9: Upload to Google Drive

**Use**: Google Drive node (n8n built-in)

**Configuration**:
- **Operation**: Upload
- **File**: PDF from previous node
- **Parent Folder**: Create a "Resumes" folder in your Drive, use its ID
- **File Name**: `resume-{{$json.companyName}}-{{$json.jobId}}.pdf`

**Returns**: Google Drive file ID and shareable link

---

### Node 10: Update Google Sheet

**Use**: Google Sheets node

**Configuration**:
- **Operation**: Update
- **Document**: Your Sheet ID
- **Sheet**: Jobs
- **Filter**: jobId = `{{$json.jobId}}`
- **Columns to Update**:
  - `resumeLink`: `={{$json.driveLink}}`
  - `status`: `Resume Sent`
  - `lastUpdated`: `={{$now}}`

---

## Simplified Implementation (Recommended Start)

Given the complexity, I recommend starting with a **simpler v1**:

### Simplified Module 5 - No PDF, No Drive

**What it does**:
1. Read jobs (status='Discovered')
2. Call Ollama to tailor resume
3. Store tailored resume TEXT in a new column in Google Sheets
4. Update status to 'Resume Tailored'
5. **You manually** copy/paste text to PDF when applying

**Pros**:
- Much simpler (6 nodes instead of 10)
- No PDF generation complexity
- No Google Drive setup needed
- Still saves 90% of the work

**Cons**:
- Manual step to create PDF (but quick)

---

## Alternative: Skip Module 5 Initially

**Pragmatic approach**:

Since Module 5 is complex and you said you need working workflows fast, consider:

**Phase 1** (Now):
- Skip Module 5 initially
- Modules 1-4 get you 20-50 filtered jobs daily
- Manually tailor resumes (10-15 min/day)
- Continue to Modules 6-8 (contact finding, outreach)

**Phase 2** (Month 2):
- Come back to Module 5
- By then you'll have:
  - Real job data to test with
  - Better understanding of what customization you need
  - Time to set up Ollama properly

**Why this makes sense**:
- Your original requirement was "focus on reliability and cheap"
- Manual resume tailoring (10 min/day) vs building complex PDF pipeline (4+ hours)
- Modules 6-8 provide more immediate value (finding contacts, generating outreach)

---

## My Recommendation for You

**Option 1 - Skip Module 5 for Now** (Fastest):
- Mark Module 5 as "planned for later"
- Proceed to Module 6 (Contact Finder) - simpler, high value
- Come back to Module 5 after testing the system

**Option 2 - Build Simplified Module 5** (Middle Ground):
- Just do: Read jobs → Call Ollama → Store text in Sheets
- No PDF, no Drive
- Still automates 90% of work

**Option 3 - Build Full Module 5** (Most Time):
- Implement everything (PDF + Drive)
- Takes 2-3 hours of additional work
- Most complete solution

---

## What Would You Like?

Please choose:

**A)** Skip Module 5 now, build Modules 6-8, come back later  
**B)** Build simplified Module 5 (text only, no PDF)  
**C)** Build full Module 5 with PDF + Google Drive  

Let me know and I'll proceed accordingly!

---

**Status**: Awaiting your decision  
**Last Updated**: 2026-05-22

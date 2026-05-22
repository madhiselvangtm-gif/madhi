# Module 7 - Outreach Generator Setup Guide

## Overview

**Module 7** generates personalized cold emails and LinkedIn DM drafts for each recruiter contact using AI.

**File**: `workflows/module-7-outreach-generator.json`

**Input**: Contacts from Contacts tab (lastContacted='Not Yet')  
**Output**: Personalized outreach messages in Outreach tab

---

## What This Module Does

1. 📊 **Reads contacts** from Contacts tab (not yet contacted)
2. 🔢 **Limits** to 5 contacts per run (cost management)
3. 📋 **Fetches** job details for each contact (for personalization)
4. 🤝 **Merges** contact + job data
5. 🤖 **Calls AI** (Ollama or OpenAI) to generate personalized messages
6. ✉️ **Creates** both cold email AND LinkedIn DM
7. 💾 **Writes** to Outreach tab with status='Draft'
8. 🏷️ **Updates** contact's lastContacted date
9. 📧 **Logs** execution

---

## Message Generation Strategy

### Two Types of Outreach:

#### 1. Cold Email (Priority if email available)
- **Length**: 100-150 words
- **Structure**: Subject + Greeting + Body + CTA + Signature
- **Tone**: Professional but conversational
- **Goal**: Get them to open and respond

#### 2. LinkedIn DM (Alternative if no email)
- **Length**: 50-75 words
- **Structure**: Greeting + Brief intro + CTA
- **Tone**: Casual, friendly, VERY brief
- **Goal**: Get connection acceptance or reply

---

## AI Options (Same as Module 5)

### Option A: Ollama (Local LLM) - FREE
**Recommended if**:
- You already set up Ollama for Module 5
- Want zero per-message costs
- Have VPS with 8GB RAM

**Models**:
- `mistral:7b` (best balance)
- `llama3:8b` (slightly better)

**Cost**: $0  
**Speed**: 5-10 seconds per message

---

### Option B: OpenAI API - PAID
**Recommended if**:
- Higher quality messages needed
- Faster processing required
- Don't want local setup

**Models**:
- `gpt-4o-mini` (best cost/quality)
- `gpt-4o` (highest quality, pricier)

**Cost**: ~$0.001-0.01 per message  
**Speed**: 2-5 seconds per message

---

### Option C: Template-Based (No AI) - FREE

**Recommended if**:
- You want to start immediately
- Don't want to set up AI
- Prefer more control over messaging

**How it works**:
- Use pre-written templates
- Fill in variables (name, company, role, etc.)
- Quick and free
- But less personalized

---

## Step-by-Step Setup

### Step 1: Import Module 7 Workflow

1. Open n8n
2. Import: `workflows/module-7-outreach-generator.json`
3. You'll see 4 base nodes (need to add 6 more)

---

### Step 2: Configure Google Sheets Nodes

**Two nodes need configuration**:

#### Node 2: "Read Contacts (Not Contacted)"
- **Sheet**: Contacts
- **Filter**: lastContacted = 'Not Yet'

#### Node 4: "Read Job Details"
- **Sheet**: Jobs
- **No filter**: Reads all jobs for matching

---

### Step 3: Add Your Personal Info

You'll need to provide:
- **Your Name**: "John Doe"
- **Your Background**: "3 years SDR experience with Apollo, HubSpot, Salesforce. Achieved 120% quota for 8 consecutive quarters."
- **Your Contact**: email, LinkedIn, phone

**Where to add**: In the prompt-building node (Node 5)

---

## Building the Complete Workflow

The imported workflow has 4 nodes. Here are the remaining 6:

### Node 5: Merge Contact + Job Data (Code Node)

```javascript
// Merge contact with their related job details
const contacts = $('Limit to 5 Contacts').all();
const jobs = $('Read Job Details').all();

const mergedData = contacts.map(contact => {
  const contactData = contact.json;
  const jobId = contactData.jobId || contactData['Job ID'];
  
  // Find matching job
  const matchingJob = jobs.find(job => {
    const jId = job.json.jobId || job.json['Job ID'];
    return jId === jobId;
  });
  
  if (!matchingJob) {
    // No job found - skip this contact
    return null;
  }
  
  const jobData = matchingJob.json;
  
  return {
    json: {
      // Contact info
      contactId: contactData.contactId || contactData['Contact ID'],
      contactName: contactData.contactName || contactData['Contact Name'],
      contactTitle: contactData.jobTitle || contactData['Job Title'],
      email: contactData.email || contactData['Email'],
      linkedinUrl: contactData.linkedinUrl || contactData['LinkedIn URL'],
      
      // Job info
      jobId: jobId,
      jobTitle: jobData.jobTitle || jobData['Job Title'],
      companyName: jobData.companyName || jobData['Company Name'],
      location: jobData.location || jobData['Location'],
      keySkills: jobData.keySkills || jobData['Key Skills'],
      jobDescription: (jobData.jobDescription || jobData['Job Description'] || '').substring(0, 500),
      jobUrl: jobData.jobUrl || jobData['Job URL']
    }
  };
}).filter(item => item !== null);

return mergedData;
```

**What it does**: Combines contact info with job info for AI context

---

### Node 6: Build AI Prompt (Code Node)

```javascript
// Build personalized prompt for each contact
const items = $input.all();

// YOUR PERSONAL INFO - EDIT THIS!
const YOUR_NAME = "Your Full Name";
const YOUR_BACKGROUND = "3 years of SDR experience with Apollo.io and HubSpot. Achieved 120% quota for 8 consecutive quarters. Generated $500K+ pipeline through outbound automation.";

const promptedItems = items.map(item => {
  const data = item.json;
  
  const prompt = `You are an expert at writing personalized cold outreach for job applications.

CONTEXT:
- Your Name: ${YOUR_NAME}
- Your Background: ${YOUR_BACKGROUND}
- Target Job: ${data.jobTitle} at ${data.companyName}
- Location: ${data.location}
- Key Skills: ${data.keySkills}
- Recruiter: ${data.contactName} (${data.contactTitle})

TASK: Generate TWO versions:
1. Cold Email (100-150 words with subject line)
2. LinkedIn DM (50-75 words)

GUIDELINES:
- Personalize using company/role details
- Show genuine interest in THIS role
- Highlight relevant experience
- Keep it conversational and human
- Include clear call-to-action

OUTPUT FORMAT:
EMAIL_SUBJECT: [subject line]
EMAIL_BODY: [full email text]

LINKEDIN_MESSAGE: [DM text]

Generate now:`;

  return {
    json: {
      ...data,
      prompt: prompt
    }
  };
});

return promptedItems;
```

**IMPORTANT**: Replace `YOUR_NAME` and `YOUR_BACKGROUND` with your actual info!

---

### Node 7A: Call Ollama API (If using local LLM)

**HTTP Request Node**:
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
    "num_predict": 500
  }
}
```

---

### Node 7B: Call OpenAI API (If using OpenAI)

**HTTP Request Node**:
- **Method**: POST
- **URL**: `https://api.openai.com/v1/chat/completions`
- **Headers**:
  - `Authorization`: `Bearer YOUR_OPENAI_API_KEY`
  - `Content-Type`: `application/json`
- **Body** (JSON):
```json
{
  "model": "gpt-4o-mini",
  "messages": [
    {
      "role": "user",
      "content": "={{ $json.prompt }}"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 500
}
```

---

### Node 8: Parse AI Response (Code Node)

```javascript
// Extract email and LinkedIn message from AI response
const items = $input.all();

const parsedItems = items.map(item => {
  // Get AI response text
  const aiText = item.json.response || item.json.choices?.[0]?.message?.content || '';
  
  // Parse out EMAIL_SUBJECT, EMAIL_BODY, LINKEDIN_MESSAGE
  const subjectMatch = aiText.match(/EMAIL_SUBJECT:(.+?)(?=EMAIL_BODY:|$)/s);
  const emailMatch = aiText.match(/EMAIL_BODY:(.+?)(?=LINKEDIN_MESSAGE:|$)/s);
  const linkedinMatch = aiText.match(/LINKEDIN_MESSAGE:(.+?)$/s);
  
  const emailSubject = subjectMatch ? subjectMatch[1].trim() : 'Experienced SDR Interested in Your Role';
  const emailBody = emailMatch ? emailMatch[1].trim() : aiText;
  const linkedinMessage = linkedinMatch ? linkedinMatch[1].trim() : aiText.substring(0, 300);
  
  return {
    json: {
      ...item.json,
      emailSubject: emailSubject,
      emailBody: emailBody,
      linkedinMessage: linkedinMessage
    }
  };
});

return parsedItems;
```

**What it does**: Extracts structured messages from AI's free-form response

---

### Node 9: Format for Outreach Tab (Code Node)

```javascript
// Create two rows per contact: one for email, one for LinkedIn
const items = $input.all();
const formattedRows = [];
const timestamp = new Date().toISOString().split('T')[0];

for (const item of items) {
  const data = item.json;
  
  // Row 1: Cold Email (if email exists)
  if (data.email) {
    formattedRows.push({
      json: {
        outreachId: `outreach-email-${data.contactId}`,
        jobId: data.jobId,
        contactId: data.contactId,
        companyName: data.companyName,
        contactName: data.contactName,
        outreachType: 'Cold Email',
        subjectLine: data.emailSubject,
        messageBody: data.emailBody,
        status: 'Draft',
        generatedDate: timestamp,
        sentDate: 'Not Sent',
        responseDate: 'No Reply',
        notes: 'AI-generated outreach. Review before sending.'
      }
    });
  }
  
  // Row 2: LinkedIn DM (if LinkedIn URL exists)
  if (data.linkedinUrl) {
    formattedRows.push({
      json: {
        outreachId: `outreach-linkedin-${data.contactId}`,
        jobId: data.jobId,
        contactId: data.contactId,
        companyName: data.companyName,
        contactName: data.contactName,
        outreachType: 'LinkedIn DM',
        subjectLine: '',
        messageBody: data.linkedinMessage,
        status: 'Draft',
        generatedDate: timestamp,
        sentDate: 'Not Sent',
        responseDate: 'No Reply',
        notes: 'AI-generated LinkedIn DM. Review before sending.'
      }
    });
  }
}

return formattedRows;
```

**What it does**: Creates separate entries for email and LinkedIn in Outreach tab

---

### Node 10: Write to Outreach Tab (Google Sheets Node)

**Configuration**:
- **Operation**: Append or Update Row
- **Document**: Your Sheet ID
- **Sheet**: **Outreach**
- **Columns**: Map all 13 columns from Outreach schema

---

### Node 11: Update Contact Status (Google Sheets Node)

**Configuration**:
- **Operation**: Update
- **Document**: Your Sheet ID
- **Sheet**: **Contacts**
- **Filter**: contactId = `{{$json.contactId}}`
- **Update Column**: lastContacted
- **New Value**: Current date

---

### Node 12: Output to Module 8

```javascript
const outreachGenerated = $input.all().length;
const runId = $('Start from Module 6').first().json.runId;

return [{
  json: {
    runId: runId,
    outreachGenerated: outreachGenerated,
    status: 'Outreach Generated',
    message: `Generated ${outreachGenerated} personalized outreach messages. Review in Outreach tab before sending.`
  }
}];
```

---

## Template-Based Alternative (No AI)

If you want to skip AI and use simple templates:

### Replace Nodes 6-8 with:

**Single Code Node**: "Fill Template"

```javascript
const items = $input.all();
const YOUR_NAME = "Your Name";
const YOUR_EMAIL = "your@email.com";

const messages = items.map(item => {
  const data = item.json;
  const firstName = data.contactName.split(' ')[0];
  
  // Simple email template
  const emailSubject = `Experienced SDR interested in ${data.jobTitle} at ${data.companyName}`;
  
  const emailBody = `Hi ${firstName},

I noticed you're hiring for a ${data.jobTitle} at ${data.companyName}. I'm impressed by your work in ${data.location} and would love to contribute.

I bring 3+ years of SDR experience with strong results in ${data.keySkills}. I've consistently exceeded quota through outbound automation and strategic prospecting.

Would you be open to a 15-minute call to discuss how I can add value to your team?

Best regards,
${YOUR_NAME}
${YOUR_EMAIL}`;

  const linkedinMessage = `Hi ${firstName},

Saw ${data.companyName} is hiring for ${data.jobTitle}. I have relevant SDR experience and would love to connect to learn more about the role.

Open to a quick chat?

Best,
${YOUR_NAME}`;

  return {
    json: {
      ...data,
      emailSubject: emailSubject,
      emailBody: emailBody,
      linkedinMessage: linkedinMessage
    }
  };
});

return messages;
```

**Pros**: Simple, fast, free, works immediately  
**Cons**: Less personalized, same template for all

---

## Message Quality Tips

### Good Outreach Has:
- ✅ Personalization (mention company, role, location)
- ✅ Specific achievements (numbers, results)
- ✅ Clear value proposition (what you bring)
- ✅ Simple CTA (15-min call, quick chat)
- ✅ Professional but friendly tone

### Avoid:
- ❌ Generic templates ("I am writing to express my interest...")
- ❌ Too long (over 150 words)
- ❌ No personalization
- ❌ Desperate tone
- ❌ Unclear next steps

---

## Testing & Iteration

### Test Process:
1. Run Module 7 with 1-2 contacts
2. Check Outreach tab
3. Read the generated messages
4. Evaluate quality:
   - Is it personalized?
   - Does it sound human?
   - Would you respond to this?
5. Adjust prompt or template
6. Test again

### Common Adjustments:
- **Too formal**: Lower temperature (0.5)
- **Too casual**: Increase temperature (0.9)
- **Too long**: Reduce max_tokens
- **Not specific enough**: Add more context to prompt

---

## Manual Review Process

**IMPORTANT**: All outreach is saved as **'Draft'** status.

**Before sending**:
1. Open Google Sheets → Outreach tab
2. Filter: status = 'Draft'
3. Read each message
4. Edit if needed
5. Copy message
6. Paste into Gmail or LinkedIn
7. Send manually
8. Update status to 'Sent'
9. Update sentDate

**Why manual**:
- Quality control
- Legal compliance
- Avoid spam issues
- Build genuine relationships

---

## Cost Analysis

### With Ollama (Local):
- **Setup**: 1 hour
- **Cost per message**: $0
- **Monthly cost**: $0
- **Quality**: Good (7/10)

### With OpenAI (gpt-4o-mini):
- **Setup**: 10 minutes
- **Cost per message**: ~$0.001-0.005
- **Monthly cost**: ~$5-10 (200 messages)
- **Quality**: Excellent (9/10)

### With Templates (No AI):
- **Setup**: 5 minutes
- **Cost per message**: $0
- **Monthly cost**: $0
- **Quality**: Basic (5/10)

---

## Troubleshooting

### Issue: AI messages are too generic

**Solution**:
- Add more context to prompt
- Include specific job description snippets
- Mention company news or achievements

---

### Issue: Messages are too long

**Solution**:
- Reduce max_tokens to 300
- Add "Keep under 150 words" to prompt
- Post-process to trim

---

### Issue: Ollama is slow (20+ seconds per message)

**Solution**:
- Use smaller model (phi3:medium)
- Process fewer contacts per run (3 instead of 5)
- Or switch to OpenAI for speed

---

### Issue: OpenAI API errors

**Check**:
- API key is correct
- Account has credits
- Not hitting rate limits
- Internet connection works

---

## Next Steps

After Module 7 is configured:

1. ✅ Choose AI option (Ollama, OpenAI, or Templates)
2. ✅ Configure the workflow
3. ✅ Add your personal info
4. ✅ Test with 1-2 contacts
5. ✅ Review generated messages
6. ✅ Adjust as needed
7. ➡️ **Next**: Build Module 8 (Tracker & Notifier)

---

## Configuration Checklist

- [ ] Module 7 imported
- [ ] Google Sheets nodes configured
- [ ] AI option chosen (Ollama/OpenAI/Template)
- [ ] Personal info added to prompts
- [ ] Test execution successful
- [ ] Messages appear in Outreach tab
- [ ] Quality is acceptable
- [ ] Manual review process understood
- [ ] Ready to proceed to Module 8

---

**Last Updated**: 2026-05-22  
**Module Version**: 1.0  
**Status**: Ready for Configuration ✅

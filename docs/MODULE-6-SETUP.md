# Module 6 - Contact Finder Setup Guide

## Overview

**Module 6** finds recruiter and hiring manager contact information using Apollo.io's free API.

**File**: `workflows/module-6-contact-finder.json`

**Input**: Jobs from Google Sheets (status='Discovered')  
**Output**: Contact information written to Contacts tab

---

## What This Module Does

1. 📊 **Reads jobs** from Google Sheets needing contact enrichment
2. 🔢 **Limits** to 10 jobs per run (Apollo.io free tier protection)
3. 🔍 **Searches** Apollo.io for recruiters at each company
4. 📋 **Processes** results (name, title, email, LinkedIn)
5. ✅ **Validates** contact quality (email format, completeness)
6. 💾 **Writes** to Contacts tab in Google Sheets
7. 🔗 **Links** contacts to jobs via Job ID
8. 🏷️ **Updates** job notes to mark contact search completed

---

## Apollo.io Free Tier

### What You Get:
- ✅ 50 API credits per month
- ✅ 1 search = 1 credit
- ✅ Access to 275M+ contacts
- ✅ Email verification
- ✅ LinkedIn profiles

### Limits:
- ⚠️ 50 searches/month total
- ⚠️ Resets on 1st of each month
- ⚠️ No bulk export
- ⚠️ Basic data only (no phone numbers usually)

### Strategy:
- Process 10 jobs/day = 10 credits/day
- Run 5 days/week = 50 credits/month ✓
- Leaves buffer for re-searches if needed

---

## Step-by-Step Setup

### Step 1: Sign Up for Apollo.io

1. Go to: `https://app.apollo.io/sign-up`
2. Sign up with your email
3. Choose **Free Plan**
4. Complete profile setup

---

### Step 2: Get Your API Key

1. In Apollo.io dashboard, click your profile (bottom left)
2. Go to **Settings**
3. Click **API** in left sidebar
4. Click **Create New Key** or copy existing key
5. **Save this key** - you'll need it in n8n

Example key format: `1a2b3c4d5e6f7g8h9i0j`

---

### Step 3: Import Module 6 Workflow

1. Open n8n
2. Click **"+"** → **"Import from File"**
3. Select: `workflows/module-6-contact-finder.json`
4. Click **"Open"**

---

### Step 4: Configure Apollo.io API Node

**Node**: "Search Apollo.io for Contacts" (Node #4)

1. Click the node
2. Find **"Query Parameters"** section
3. Locate the `api_key` parameter
4. **Replace** `YOUR_APOLLO_API_KEY_HERE` with your actual API key

**Test the API**:
1. Click **"Execute Node"**
2. Should return contact data
3. If error 401: API key is wrong
4. If error 429: Rate limit hit (wait 24 hours)

---

### Step 5: Configure Google Sheets Node

**Node**: "Read Jobs Needing Contacts" (Node #2)

1. Click the node
2. **Credential**: Select your Google Sheets credential
3. **Document**: Your Sheet ID
4. **Sheet**: Select **"Jobs"**
5. **Filter**: status = 'Discovered'

---

## Understanding the Workflow

### Complete Node Structure (10 nodes)

| # | Node Name | Type | Purpose |
|---|-----------|------|---------|
| 1 | Start from Module 4/5 | No-Op | Entry point |
| 2 | Read Jobs Needing Contacts | Google Sheets | Read jobs |
| 3 | Limit to 10 Jobs | Code | Credit protection |
| 4 | Search Apollo.io for Contacts | HTTP Request | API call |
| 5 | Process Apollo Results | Code | Extract contact data |
| 6 | Check if Contacts Found | IF Condition | Validation |
| 7 | Format for Contacts Tab | Code | Schema mapping |
| 8 | Write to Contacts Tab | Google Sheets | Save contacts |
| 9 | Update Job Notes | Google Sheets | Mark as processed |
| 10 | Output to Module 7 | Set | Prepare output |

---

## Adding Missing Nodes

The imported workflow has 4 nodes. Here's how to add the remaining 6:

### Node 5: Process Apollo Results (Code Node)

```javascript
// Extract contact information from Apollo response
const items = $input.all();
const processedContacts = [];

for (const item of items) {
  const apolloResponse = item.json;
  const jobData = item.json; // Original job data
  
  // Apollo returns array of people
  const people = apolloResponse.people || [];
  
  if (people.length === 0) {
    // No contacts found - flag for manual search
    processedContacts.push({
      json: {
        jobId: jobData.jobId || jobData['Job ID'],
        companyName: jobData.companyName || jobData['Company Name'],
        contactFound: false,
        source: 'Apollo.io',
        notes: 'No contacts found - manual search needed'
      }
    });
    continue;
  }
  
  // Process each contact (max 5 per company)
  for (const person of people.slice(0, 5)) {
    // Generate unique contact ID
    const contactId = `apollo-${person.id || Date.now()}`;
    
    // Determine email status
    let emailStatus = 'Unverified';
    if (person.email) {
      emailStatus = person.email_status === 'verified' ? 'Verified' : 'Unverified';
    }
    
    // Determine contact type
    let contactType = 'Recruiter';
    const title = (person.title || '').toLowerCase();
    if (title.includes('hiring manager')) contactType = 'Hiring Manager';
    else if (title.includes('hr')) contactType = 'HR';
    else if (title.includes('talent')) contactType = 'Recruiter';
    
    processedContacts.push({
      json: {
        contactId: contactId,
        jobId: jobData.jobId || jobData['Job ID'],
        companyName: person.organization_name || jobData.companyName,
        contactName: person.name || 'Unknown',
        jobTitle: person.title || 'Unknown',
        email: person.email || '',
        emailStatus: emailStatus,
        linkedinUrl: person.linkedin_url || '',
        phoneNumber: person.phone_numbers?.[0] || 'Not Found',
        source: 'Apollo.io',
        confidenceScore: person.email ? 90 : 50,
        contactType: contactType,
        dateFound: new Date().toISOString().split('T')[0],
        lastContacted: 'Not Yet',
        notes: `Found via Apollo.io API. ${person.email ? 'Email available' : 'No email found'}`
      }
    });
  }
}

return processedContacts;
```

**Add this node**:
1. Add **Code** node after "Search Apollo.io"
2. Name: "Process Apollo Results"
3. Paste the code above
4. Connect from Apollo node

---

### Node 6: Check if Contacts Found (IF Node)

**Configuration**:
- **Condition**: `{{ $json.contactFound }}` is not equal to `false`
- **True branch**: Contacts found → proceed to write
- **False branch**: No contacts → flag for manual review

**Add this node**:
1. Add **IF** node after "Process Apollo Results"
2. Configure condition as above
3. Connect both branches (we'll handle both paths)

---

### Node 7: Format for Contacts Tab (Code Node)

```javascript
// Format data to match Contacts tab schema
const contacts = $input.all();

const formattedContacts = contacts.map(contact => {
  const data = contact.json;
  
  return {
    json: {
      contactId: data.contactId,
      jobId: data.jobId,
      companyName: data.companyName,
      contactName: data.contactName,
      jobTitle: data.jobTitle,
      email: data.email,
      emailStatus: data.emailStatus,
      linkedinUrl: data.linkedinUrl,
      phoneNumber: data.phoneNumber,
      source: data.source,
      confidenceScore: data.confidenceScore,
      contactType: data.contactType,
      dateFound: data.dateFound,
      lastContacted: data.lastContacted,
      notes: data.notes
    }
  };
});

return formattedContacts;
```

---

### Node 8: Write to Contacts Tab (Google Sheets Node)

**Configuration**:
- **Operation**: Append or Update Row
- **Document**: Your Sheet ID
- **Sheet**: **Contacts**
- **Columns**: Map all 15 columns from schema

---

### Node 9: Update Job Notes (Google Sheets Node)

**Configuration**:
- **Operation**: Update
- **Document**: Your Sheet ID
- **Sheet**: **Jobs**
- **Filter**: jobId = `{{$json.jobId}}`
- **Update Column**: notes
- **New Value**: `Contact search completed via Apollo.io. {{$json.contactName}} found.`

---

### Node 10: Output to Module 7

**Code**:
```javascript
const contactsWritten = $input.all().length;
const runId = $('Start from Module 4/5').first().json.runId;

return [{
  json: {
    runId: runId,
    contactsFound: contactsWritten,
    status: 'Contacts Enriched',
    message: `Found and saved ${contactsWritten} contacts for job applications.`
  }
}];
```

---

## Apollo.io API Response Format

### Example Response:

```json
{
  "people": [
    {
      "id": "abc123",
      "name": "Priya Sharma",
      "title": "Talent Acquisition Specialist",
      "email": "priya.sharma@company.com",
      "email_status": "verified",
      "linkedin_url": "https://linkedin.com/in/priyasharma",
      "phone_numbers": ["+91-9876543210"],
      "organization_name": "Salesforce"
    }
  ],
  "breadcrumbs": [...],
  "pagination": {...}
}
```

### Fields We Use:
- ✅ `name`: Contact's full name
- ✅ `title`: Their job title
- ✅ `email`: Work email (if available)
- ✅ `email_status`: 'verified' or 'guessed'
- ✅ `linkedin_url`: LinkedIn profile
- ✅ `phone_numbers`: Rarely available
- ✅ `organization_name`: Company name

---

## Handling Edge Cases

### Case 1: No Contacts Found

**What happens**:
- Apollo returns empty `people` array
- We flag the job for manual search
- Notes field updated: "No contacts found - manual search needed"

**Manual action needed**:
- Visit company's LinkedIn page
- Find recruiters manually
- Add to Contacts tab manually

---

### Case 2: Email Not Available

**What happens**:
- Contact found but no email
- We save the contact anyway (LinkedIn URL is valuable)
- Email Status = "Unverified"
- Confidence Score = 50 (lower)

**Next steps**:
- Use LinkedIn for outreach (Module 7)
- Or manually find email using Hunter.io, etc.

---

### Case 3: Multiple Contacts Found

**What happens**:
- Apollo returns 5+ people
- We take top 5 (most relevant)
- All saved to Contacts tab
- Linked to same Job ID

**Benefit**:
- More options for outreach
- Can prioritize based on title

---

### Case 4: API Rate Limit Hit

**Error**: 429 Too Many Requests

**What happens**:
- Workflow stops
- Error logged

**Solution**:
- Wait 24 hours (monthly quota resets)
- Or upgrade Apollo plan
- Or reduce to 5 jobs/day instead of 10

---

## Cost Management

### Free Tier Strategy

**Daily Limit**: 1-2 jobs/day  
**Monthly Total**: 30-50 jobs/month  
**Cost**: $0

**Why so conservative**:
- Leaves credits for re-searches
- Avoids hitting limit mid-month
- Quality over quantity

### Paid Plan ($49/month)

If you need more:
- **500 credits/month**
- **Bulk export**
- **Phone numbers**
- **Better accuracy**

**ROI Calculation**:
- $49 ÷ 30 days = $1.63/day
- Process 15-20 jobs/day
- Worth it if you're serious about volume

---

## Alternative: Free Manual Methods

If you don't want to use Apollo.io credits:

### Method 1: LinkedIn Manual Search
1. Visit company's LinkedIn page
2. Click "People" tab
3. Search for: "Recruiter", "Talent Acquisition", "HR"
4. Manually add to Contacts tab

**Time**: 5 minutes per company

---

### Method 2: Hunter.io (Free Tier)
- 25 searches/month free
- Finds email patterns
- Good for smaller companies

**Setup**:
1. Sign up: `https://hunter.io`
2. Get API key
3. Use HTTP Request node similar to Apollo

---

### Method 3: RocketReach (Free Tier)
- 5 lookups/month free
- More phone numbers than Apollo
- Good for decision-makers

---

## Monitoring Apollo Credits

### Check Usage:
1. Login to Apollo.io
2. Settings → API
3. View "Credits Used This Month"

### Alerts:
- Set up email alert at 80% usage
- Apollo sends notification at 90%

### Optimization:
- Process high-priority jobs first
- Skip jobs at small/unknown companies
- Batch process once per week instead of daily

---

## Troubleshooting

### Issue: "Invalid API Key"

**Error**: 401 Unauthorized

**Solution**:
1. Re-check API key (no extra spaces)
2. Regenerate key in Apollo dashboard
3. Verify account is active

---

### Issue: "Company not found"

**Cause**: Company name from job posting doesn't match Apollo's database

**Solution**:
1. Try variations: "Inc" vs "Inc." vs no suffix
2. Use company domain instead: `organization_domains: ["company.com"]`
3. Manually search as fallback

---

### Issue: No email addresses returned

**Cause**: Apollo's free tier has limited email access

**Solutions**:
- Still save contact (LinkedIn URL is valuable)
- Use LinkedIn for outreach
- Upgrade to paid plan
- Use Hunter.io to find email pattern

---

### Issue: Rate limit hit mid-month

**Cause**: Used all 50 credits

**Solutions**:
1. **Wait** until next month
2. **Reduce** to 1-2 jobs/day going forward
3. **Upgrade** to paid plan
4. **Manual** search for remaining jobs

---

## Integration with Module 7

### Data Flow:

```
Module 6 Output:
- contactsFound: 25
- contacts stored in: Contacts tab
- jobs updated with: "Contact search completed"

↓

Module 7 Input:
- Reads from Contacts tab
- Generates personalized outreach
- Uses contact name, title, email, LinkedIn
```

---

## Next Steps

After Module 6 is configured:

1. ✅ Sign up for Apollo.io (free)
2. ✅ Get API key
3. ✅ Import workflow
4. ✅ Configure API key in node
5. ✅ Test with 1-2 jobs
6. ✅ Verify Contacts tab populated
7. ➡️ **Next**: Build Module 7 (Outreach Generator)

---

## Configuration Checklist

- [ ] Apollo.io account created
- [ ] API key obtained and saved
- [ ] Module 6 workflow imported
- [ ] API key configured in HTTP Request node
- [ ] Google Sheets credential configured
- [ ] Sheet ID set for Jobs tab
- [ ] Sheet ID set for Contacts tab
- [ ] Test execution successful
- [ ] Contacts appear in Contacts tab
- [ ] Job notes updated correctly
- [ ] Ready to proceed to Module 7

---

**Last Updated**: 2026-05-22  
**Module Version**: 1.0  
**Status**: Ready for Configuration ✅

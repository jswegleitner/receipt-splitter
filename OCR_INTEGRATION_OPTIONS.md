# Receipt OCR Integration Options

**Prepared:** January 2026  
**Status:** ✅ Azure Document Intelligence IMPLEMENTED  
**Decision:** Azure selected over Mindee due to genuine free tier (500 pages/month forever)

---

## Executive Summary

~~Instead of iterating on custom Google Vision + parsing logic, you can integrate a **specialized receipt OCR API** that handles all the parsing automatically.~~

**COMPLETED:** Azure Document Intelligence is now integrated and working. This:

1. ✅ Eliminates custom parsing code maintenance
2. ✅ Improves accuracy immediately (pretrained on millions of receipts)
3. ✅ Enables OCR as a premium paid feature (your margin opportunity)
4. ✅ Matches competitors like FLICK2SPLIT and Smart Bill Splitter
5. ✅ Has a genuine free tier (500 pages/month forever)

---

## Selected Provider: Azure Document Intelligence

### Why Azure Won

| Factor | Mindee | Azure | Winner |
|--------|--------|-------|--------|
| **Free Tier** | 14-day trial only | 500 pages/month forever | ✅ Azure |
| **Cost at Scale** | $0.04-0.05/page | $0.01/page | ✅ Azure |
| **Minimum Spend** | $44/month (Starter) | $0 (Pay-as-you-go) | ✅ Azure |
| **Receipt Accuracy** | 95%+ | 95%+ | Tie |
| **Line Item Extraction** | ✅ Yes | ✅ Yes | Tie |
| **Integration Effort** | Simple | Moderate (polling) | Mindee |

**Azure is 4-5x cheaper and has a real free tier.**

---

## AI Receipt Parsing API Comparison

### Quick Comparison

| Provider | Receipt Cost | Free Tier | Accuracy | Speed | Best For |
|----------|--------------|-----------|----------|-------|----------|
| **Veryfi** | $0.08/receipt | 100/mo | 99%+ | 2-3 sec | Production apps |
| **Mindee** | ~$0.05/page | 500 pages/mo | 95%+ | 2-4 sec | Startups |
| **Google Document AI** | $0.01/10 pages | Trial credits | 95%+ | 3-5 sec | Google ecosystem |
| **AWS Textract** | $0.01/expense | 100/mo (3 mo) | 95%+ | 3-5 sec | AWS ecosystem |
| **Azure Doc Intel** | $0.01/page | 500/mo | 95%+ | 3-5 sec | Azure ecosystem |
| **TabScanner** | $0.08/receipt | 200/mo | 99%+ | 2 sec | Receipt specialists |

---

## Recommended Option: Veryfi

### Why Veryfi?

| Factor | Score | Notes |
|--------|-------|-------|
| **Receipt Specialization** | ⭐⭐⭐⭐⭐ | Built specifically for receipts |
| **Accuracy** | ⭐⭐⭐⭐⭐ | 99%+ on receipts |
| **Speed** | ⭐⭐⭐⭐⭐ | 2-3 seconds average |
| **Data Fields** | ⭐⭐⭐⭐⭐ | Line items, tax, tip, vendor, date |
| **Free Tier** | ⭐⭐⭐ | 100 docs/mo (enough to test) |
| **Pricing** | ⭐⭐⭐⭐ | $0.08/receipt |
| **Integration** | ⭐⭐⭐⭐⭐ | Simple REST API, SDKs |

### Veryfi Returns (Example Response)

```json
{
  "vendor": {
    "name": "Chipotle Mexican Grill",
    "address": "123 Main St, San Francisco, CA"
  },
  "date": "2026-01-24",
  "line_items": [
    {
      "description": "Burrito Bowl",
      "quantity": 2,
      "unit_price": 11.75,
      "total": 23.50
    },
    {
      "description": "Chips & Guac",
      "quantity": 1,
      "unit_price": 4.25,
      "total": 4.25
    }
  ],
  "subtotal": 27.75,
  "tax": 2.43,
  "tip": 5.00,
  "total": 35.18
}
```

**This eliminates ALL your parsing logic!**

---

## Cost & Revenue Model

### Your Cost per Scan

| Provider | Cost/Receipt | At 1,000 scans/mo | At 10,000 scans/mo |
|----------|--------------|-------------------|---------------------|
| Veryfi | $0.08 | $80 | $800 |
| Mindee | $0.05 | $50 | $500 |
| Google Doc AI | $0.01 | $10 | $100 |
| TabScanner | $0.08 | $80 | $800 |
| Current (Vision) | ~$0.0015 | $1.50 | $15 |

### Your Revenue per Scan (Suggested Pricing)

| Tier | Your Price | Your Cost | Margin |
|------|------------|-----------|--------|
| **Single Scan** | $0.25 | $0.08 | 68% |
| **5-Pack** | $0.99 | $0.40 | 60% |
| **10-Pack** | $1.49 | $0.80 | 46% |
| **Unlimited Month** | $4.99 | ~$2.00 (est 25 scans) | 60% |

### Revenue Projection

| Users/Month | Conversion | Scans | Revenue | Cost | Profit |
|-------------|------------|-------|---------|------|--------|
| 1,000 | 5% | 50 | $12.50 | $4.00 | $8.50 |
| 10,000 | 5% | 500 | $125 | $40 | $85 |
| 50,000 | 5% | 2,500 | $625 | $200 | $425 |
| 100,000 | 5% | 5,000 | $1,250 | $400 | $850 |

---

## Implementation Options

### Option A: Veryfi (Recommended)

**Pros:**
- Best receipt accuracy in market
- Returns structured line items immediately
- 38 languages supported
- SOC 2 Type 2 certified
- Simple integration

**Cons:**
- Higher per-receipt cost ($0.08)
- $500/mo minimum on paid tier (but free tier is 100 free)

**Integration:**

```javascript
// Veryfi Client-Side (needs proxy for API key security)
const processReceipt = async (imageBase64) => {
  const response = await fetch('/api/scan-receipt', {
    method: 'POST',
    body: JSON.stringify({ image: imageBase64 })
  });
  return response.json();
};

// Your Backend Proxy (Node.js/Cloudflare Worker)
app.post('/api/scan-receipt', async (req, res) => {
  const veryfiResponse = await fetch('https://api.veryfi.com/v8/partner/documents', {
    method: 'POST',
    headers: {
      'Client-Id': process.env.VERYFI_CLIENT_ID,
      'Authorization': `apikey ${process.env.VERYFI_USERNAME}:${process.env.VERYFI_API_KEY}`
    },
    body: JSON.stringify({
      file_data: req.body.image,
      categories: ['Restaurants']
    })
  });
  res.json(await veryfiResponse.json());
});
```

---

### Option B: Mindee (Budget Alternative)

**Pros:**
- Lower cost ($0.05/page with annual plan)
- 500 free pages/month
- Good receipt accuracy
- Modern API

**Cons:**
- Less specialized than Veryfi
- European company (data locality considerations)

**Integration:**

```javascript
const mindee = require('mindee');
const client = new mindee.Client({ apiKey: process.env.MINDEE_API_KEY });

const processReceipt = async (imageBuffer) => {
  const input = client.docFromBuffer(imageBuffer, 'receipt.jpg');
  const response = await client.parse(mindee.product.ReceiptV5, input);
  return response.document.inference.prediction;
};
```

---

### Option C: Google Document AI Expense Parser

**Pros:**
- You already have Google Cloud setup
- Very low cost ($0.01 per 10 pages)
- Good accuracy

**Cons:**
- Requires more setup (processor creation)
- Less specialized than Veryfi
- More complex API

**Integration:**

```javascript
const { DocumentProcessorServiceClient } = require('@google-cloud/documentai').v1;

const client = new DocumentProcessorServiceClient();

const processReceipt = async (imageBuffer) => {
  const request = {
    name: `projects/${projectId}/locations/us/processors/${processorId}`,
    rawDocument: {
      content: imageBuffer.toString('base64'),
      mimeType: 'image/jpeg',
    },
  };
  
  const [result] = await client.processDocument(request);
  return result.document.entities;
};
```

---

### Option D: TabScanner (Receipt Specialist)

**Pros:**
- Receipt-specialized (like Veryfi)
- 99%+ accuracy
- 200 free scans/month
- Simple API

**Cons:**
- Smaller company
- Less documentation

**Integration:**

```javascript
const processReceipt = async (imageBase64) => {
  // Upload
  const uploadResponse = await fetch('https://api.tabscanner.com/api/2/process', {
    method: 'POST',
    headers: { 'apikey': process.env.TABSCANNER_API_KEY },
    body: JSON.stringify({ image: imageBase64 })
  });
  const { token } = await uploadResponse.json();
  
  // Poll for result
  const resultResponse = await fetch(`https://api.tabscanner.com/api/result/${token}`, {
    headers: { 'apikey': process.env.TABSCANNER_API_KEY }
  });
  return resultResponse.json();
};
```

---

## Architecture Change Required

### Current Flow
```
User → Upload Image → Google Vision (raw OCR) → Your Parsing Logic → Items
                              ↓
                     User's API Key (BYOK)
```

### New Flow (Recommended)
```
User → Upload Image → Your Backend Proxy → Veryfi API → Structured Items
                              ↓
                     Your API Key (hidden)
                              ↓
                     Payment Check (Stripe)
```

### What You Need

1. **Backend Proxy** (to hide API key)
   - Options: Cloudflare Workers, Vercel Edge Functions, Netlify Functions
   - Free tier sufficient for your scale

2. **Payment Integration** (Stripe)
   - Already recommended in GTM strategy
   - Check credits before allowing scan

3. **Database (Optional)**
   - Track user credits
   - Options: Firebase (already using), Supabase, Upstash

---

## Migration Plan

### Phase 1: Backend Setup (1-2 days)

1. Create Cloudflare Worker or Vercel Edge Function
2. Sign up for Veryfi free tier (100 free/month)
3. Create proxy endpoint that:
   - Receives image from frontend
   - Calls Veryfi API
   - Returns structured data

### Phase 2: Frontend Changes (1 day)

1. Remove Google Vision API key input
2. Replace image upload handler to call your proxy
3. Remove custom parsing logic (parseReceiptText function)
4. Map Veryfi response to your existing item format

### Phase 3: Paywall (2-3 days)

1. Integrate Stripe
2. Add credit check before OCR
3. Add "Buy Credits" flow
4. Track usage per browser (localStorage + optional account)

### Phase 4: Cleanup (1 day)

1. Remove old parsing code
2. Update documentation
3. Test edge cases

**Total Effort: 5-7 days**

---

## Comparison: Build vs Buy

| Factor | Build (Current) | Buy (Veryfi) |
|--------|-----------------|--------------|
| **Development Time** | Ongoing | 5-7 days once |
| **Accuracy** | 70-85% | 99%+ |
| **Maintenance** | Every receipt format | None |
| **Edge Cases** | Handle yourself | Veryfi handles |
| **Cost per Scan** | $0.0015 | $0.08 |
| **Revenue Potential** | Hard to charge (unreliable) | Easy to charge (reliable) |
| **User Experience** | Frustrating failures | Consistent success |

### ROI Calculation

**If you charge $0.25/scan and use Veryfi at $0.08/scan:**
- Margin per scan: $0.17 (68%)
- Break-even vs current BYOK: N/A (you couldn't monetize BYOK easily)

**At 100 scans/month:**
- Revenue: $25
- Veryfi cost: $8 (free tier)
- Profit: $25

---

## Free Tier Strategy

| Provider | Free Tier | Strategy |
|----------|-----------|----------|
| **Veryfi** | 100/mo | Use free tier to start, upgrade at scale |
| **Mindee** | 500/mo | Best free tier for testing |
| **TabScanner** | 200/mo | Good middle ground |
| **Google Doc AI** | Trial credits | Time-limited |

### Recommendation

1. **Start with Mindee** (500 free pages/mo)
2. **Switch to Veryfi** when quality matters more than cost
3. **Use free tiers** until you hit ~$100/mo in revenue

---

## Competitive Advantage After Integration

| Feature | Before | After |
|---------|--------|-------|
| OCR Accuracy | 70-85% | 99%+ |
| User Friction | High (BYOK) | Low (just upload) |
| Revenue Potential | Hard | Easy ($0.25/scan) |
| Parsing Maintenance | Ongoing | None |
| Supported Receipt Types | Limited | Universal |
| Multi-language | Limited | 38+ languages |

### New Positioning

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   "The only WEB app with INSTANT OCR, real-time sync,          │
│    and NO ACCOUNT required"                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Recommendation

### Best Path Forward

1. **Sign up for Mindee free tier** (500 pages/month free)
2. **Create a simple backend proxy** (Cloudflare Worker)
3. **Replace custom parsing with API response**
4. **Add Stripe for pay-per-scan** ($0.25 per scan)
5. **Remove BYOK requirement entirely**

### Estimated Timeline

| Task | Time | Priority |
|------|------|----------|
| Backend proxy setup | 4 hours | P0 |
| API integration | 4 hours | P0 |
| Frontend refactor | 8 hours | P0 |
| Stripe integration | 8 hours | P1 |
| Testing | 4 hours | P0 |
| **Total** | **28 hours** | ~1 week |

### Costs to Launch

| Item | Cost | Notes |
|------|------|-------|
| Mindee free tier | $0 | 500 pages/month |
| Cloudflare Worker | $0 | Free tier |
| Stripe | 2.9% + $0.30 | Per transaction |
| **Total Fixed Cost** | **$0** | Until you scale |

---

## Appendix: API Response Comparison

### Veryfi Receipt Response
```json
{
  "line_items": [
    {"description": "Burger", "quantity": 2, "total": 28.00},
    {"description": "Fries", "quantity": 1, "total": 5.00}
  ],
  "subtotal": 33.00,
  "tax": 2.89,
  "tip": 6.00,
  "total": 41.89
}
```

### Mindee Receipt Response
```json
{
  "line_items": [
    {"description": "Burger", "quantity": 2.0, "total_amount": 28.00},
    {"description": "Fries", "quantity": 1.0, "total_amount": 5.00}
  ],
  "total_tax": {"value": 2.89},
  "tip": {"value": 6.00},
  "total_amount": {"value": 41.89}
}
```

### Google Document AI Expense Response
```json
{
  "entities": [
    {"type": "line_item/description", "text": "Burger"},
    {"type": "line_item/amount", "text": "28.00"},
    {"type": "total_tax_amount", "text": "2.89"}
  ]
}
```

**Note:** Veryfi and Mindee return the cleanest, most usable structured data.

---

*Document prepared for Receipt Splitter OCR integration planning.*

# Receipt Splitter - Go-To-Market Strategy

**Prepared:** January 2026  
**Version:** 1.1  
**Last Updated:** January 24, 2026  
**Change:** Migrated from Google Vision BYOK to Azure Document Intelligence

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Product Positioning](#product-positioning)
3. [Monetization Strategy](#monetization-strategy)
4. [Cost to Operate](#cost-to-operate)
5. [Legal Concerns](#legal-concerns)
6. [Trademark Concerns](#trademark-concerns)
7. [Privacy Concerns](#privacy-concerns)
8. [Azure Account Migration Path](#azure-account-migration-path)
9. [Additional Work Required](#additional-work-required)
10. [Go-To-Market Timeline](#go-to-market-timeline)
11. [Risk Assessment](#risk-assessment)

---

## Executive Summary

Receipt Splitter is a zero-friction, web-based bill splitting tool that differentiates from competitors (Splitwise, Tricount, Tab) through:
- **No app download required** - Works in any browser
- **No account creation** - Instant access
- **Auto-expiring data** - Privacy by default (7-day room expiration)
- **AI-Powered OCR** - Azure Document Intelligence for structured receipt parsing
- **Real-time collaboration** - Firebase-powered room sharing

**Target Market:** Social diners, travelers, and friend groups who want to split one-time bills without committing to an app ecosystem.

**OCR Technology:** Azure Document Intelligence (previously Google Vision BYOK)

---

## Product Positioning

### Tagline Options
- "Split the bill, not your patience"
- "No app. No account. No awkward math."
- "The fastest way to split a receipt"

### Value Proposition
| Pain Point | Our Solution |
|------------|--------------|
| Don't want to download another app | Web-based, works instantly |
| Don't want to create an account | Zero registration required |
| Privacy concerns about financial data | Data auto-deletes after 7 days |
| Splitting shared items is complicated | Fractional quantity support (½, ⅓) |
| OCR is a premium feature elsewhere | AI-powered receipt scanning (Azure) |

### Target Users
1. **Primary:** Friend groups dining out (ages 22-40)
2. **Secondary:** Travelers splitting trip expenses
3. **Tertiary:** Roommates with one-off purchases

---

## Monetization Strategy

### Recommended Model: Freemium with Pay-Per-Use

#### Free Tier (Always Available)
- Unlimited manual entry splits
- Real-time room collaboration
- Up to 4 people per split
- Basic tip calculation
- 7-day data retention
- URL sharing

#### Premium Features (Pay-Per-Use)

| Feature | Price | Rationale |
|---------|-------|-----------|
| **OCR Scan** | $0.15-0.25 per receipt | Covers Azure API cost ($0.01) + healthy margin |
| **Extended Room** | $0.99 for 30 days | For ongoing group expenses |
| **Large Groups** | $0.99 per split (5+ people) | Value-based pricing |
| **Export to PDF** | $0.49 per export | Convenience feature |
| **Bundle: 10 Scans** | $1.49 (save 40%) | Encourages bulk purchase |

#### Payment Implementation Options

**Option A: Stripe Payment Links (Lowest Friction)**
```
Flow: User clicks "Scan Receipt" → Stripe Checkout → Redirect with token → Feature unlocked
```
- No account required
- Works with Apple Pay, Google Pay
- One-time purchases only
- Implementation: ~2-3 days

**Option B: Stripe Credits System**
```
Flow: User buys credits ($5 = 50 credits) → Credits stored in localStorage → Deducted per use
```
- Slightly more friction (but still no account)
- Enables micro-transactions
- Risk: User clears browser data = lost credits
- Implementation: ~1 week

**Option C: Tip Jar / Donation Model**
```
Flow: After successful split → "Buy us a coffee? ☕" → Optional $1-5 payment
```
- Zero friction to core features
- Relies on goodwill
- Lower revenue but maximum adoption
- Implementation: ~1 day

### Revenue Projections (Conservative)

| Scenario | Monthly Users | Conversion | ARPU | Monthly Revenue |
|----------|---------------|------------|------|-----------------|
| **Launch** | 1,000 | 5% | $0.50 | $25 |
| **6 Months** | 10,000 | 5% | $0.50 | $250 |
| **1 Year** | 50,000 | 5% | $0.50 | $1,250 |
| **2 Years** | 200,000 | 7% | $0.60 | $8,400 |

---

## Cost to Operate

### OCR Provider: Azure Document Intelligence

**Current Setup:** Personal Azure account with F0 (Free) tier  
**Free Tier:** 500 pages/month forever

| Tier | Pages/Month | Cost | Per Page |
|------|-------------|------|----------|
| **F0 (Free)** | 500 | $0 | Free |
| **S0 (Pay-as-you-go)** | Unlimited | $10/1,000 pages | $0.01 |
| **Commitment (20K)** | 20,000 | $190/month | $0.0095 |
| **Commitment (100K)** | 100,000 | $900/month | $0.009 |

### Fixed Costs (Monthly)

| Service | Free Tier | Paid Tier | Notes |
|---------|-----------|-----------|-------|
| **Domain** | - | $1/mo | ~$12/year |
| **Hosting (GitHub Pages)** | $0 | $0 | Free, unlimited deploys |
| **Firebase Realtime DB** | $0 | $25+ | Free: 1GB storage, 10GB/mo transfer |
| **Azure Document Intelligence** | $0 | $10/1K pages | Free: 500 pages/month |
| **SSL Certificate** | $0 | $0 | Included with hosting |
| **Stripe** | 2.9% + $0.30 | - | Per transaction |

### Variable Costs (Per User Action)

| Action | Cost | Your Price | Margin |
|--------|------|------------|--------|
| **Azure Receipt OCR** | $0.01/page | $0.25 | 96% |
| **Firebase Read** | $0.06/100K | - | Included in free tier |
| **Firebase Write** | $0.18/100K | - | Included in free tier |

### Break-Even Analysis

**Scenario: 10,000 monthly active users**
```
Fixed Costs:    $20/mo (domain + buffer)
Variable Costs: ~$50/mo (5,000 OCR scans × $0.01)
Total Costs:    $70/mo

Revenue at $0.25/scan: $1,250
Net Profit: $1,180/mo (94% margin)
```

### Cost Scaling Concerns

| Users | Firebase Cost | Mitigation |
|-------|---------------|------------|
| < 50K | Free tier | None needed |
| 50K-100K | $25-50/mo | Room cleanup optimization |
| 100K+ | $100+/mo | Consider Supabase migration |

---

## Legal Concerns

### Terms of Service (Required)
You MUST create a Terms of Service that includes:

1. **Disclaimer of Accuracy**
   - OCR may contain errors
   - Mathematical calculations are provided "as-is"
   - Users are responsible for verifying amounts

2. **Limitation of Liability**
   - Not liable for disputes between users
   - Not responsible for payment disagreements
   - Maximum liability = amount paid by user

3. **Acceptable Use**
   - No fraudulent receipt manipulation
   - No illegal activities
   - Right to terminate access

4. **Data Retention**
   - Rooms expire after 7 days
   - No data recovery after expiration
   - User-initiated deletion available

### Key Legal Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| **User disputes over amounts** | Medium | Disclaimer in ToS, no liability |
| **Incorrect OCR leading to wrong payments** | Medium | "Verify before paying" warning |
| **Data breach** | High | Minimize data collection, encrypt transit |
| **GDPR/CCPA compliance** | Medium | Privacy policy, no PII collection |
| **Payment processing issues** | Low | Use Stripe (they handle compliance) |

### Recommended Legal Documents

1. ✅ Terms of Service
2. ✅ Privacy Policy
3. ✅ Cookie Notice (if using analytics)
4. ⚠️ Consider: Arbitration clause
5. ⚠️ Consider: DMCA/Copyright notice

### Legal Costs (Estimated)

| Option | Cost | Coverage |
|--------|------|----------|
| **DIY with templates** | $0-50 | Basic protection |
| **Legal template service** | $100-300 | Termly, Iubenda |
| **Lawyer review** | $500-2,000 | Full coverage |
| **Startup law firm package** | $2,000-5,000 | Complete legal setup |

---

## Trademark Concerns

### "Receipt Splitter" Trademark Search

**USPTO Search Results (as of analysis date):**

| Term | Status | Risk |
|------|--------|------|
| "Receipt Splitter" | ❓ Check required | Descriptive term, likely unregistrable |
| "Splitwise" | ® Registered | DO NOT USE |
| "Tricount" | ® Registered | DO NOT USE |
| "Tab" | Common word | Low risk |

### Trademark Recommendations

1. **"Receipt Splitter" is likely too descriptive**
   - USPTO may reject as merely descriptive
   - Hard to enforce even if granted
   - Competitors could use similar names

2. **Consider a unique brand name:**
   - "Divvy Up" ❓ (check availability)
   - "FairShare" ❓ (check availability)
   - "SplitSnap" ❓ (check availability)
   - "TabMath" ❓ (check availability)
   - "Chekmate" ❓ (check availability)

3. **Action Items:**
   - [ ] Search USPTO TESS database: https://tmsearch.uspto.gov
   - [ ] Search state trademark databases
   - [ ] Check domain availability
   - [ ] Search App Store / Play Store for conflicts
   - [ ] Consider trademark filing ($250-400 per class)

### Domain Considerations

| Domain | Estimated Cost | Availability |
|--------|---------------|--------------|
| receiptsplitter.com | $10-15/yr | Check registrar |
| receiptsplitter.app | $15-20/yr | Check registrar |
| splitreceipt.com | $10-15/yr | Check registrar |
| [brandname].app | $15-20/yr | Preferred TLD |

---

## Privacy Concerns

### Data Collected (Current Implementation)

| Data Type | Storage Location | Retention | Risk Level |
|-----------|------------------|-----------|------------|
| Room code | Firebase | 7 days | Low |
| Item names | Firebase | 7 days | Low |
| Item prices | Firebase | 7 days | Low |
| Person names | Firebase | 7 days | Medium |
| Azure endpoint | localStorage | Permanent | Medium |
| Azure API key | localStorage | Permanent | High |
| Receipt images | NOT stored (processed in memory) | None | None ✅ |

### Privacy Compliance Requirements

#### GDPR (EU Users)
| Requirement | Status | Action Needed |
|-------------|--------|---------------|
| Lawful basis | ⚠️ Implied consent | Add consent banner |
| Right to deletion | ✅ Auto-delete | Document in policy |
| Right to access | ⚠️ No mechanism | Add data export |
| Privacy policy | ❌ Missing | Create policy |
| Data minimization | ✅ Minimal data | None |
| Cross-border transfers | ⚠️ Firebase US | Add SCCs to policy |

#### CCPA (California Users)
| Requirement | Status | Action Needed |
|-------------|--------|---------------|
| Privacy policy | ❌ Missing | Create policy |
| "Do Not Sell" link | ✅ N/A | No data selling |
| Disclosure of collection | ⚠️ Missing | Add to policy |

### Privacy Recommendations

1. **Create a Privacy Policy** covering:
   - What data is collected (minimal)
   - How long it's stored (7 days)
   - Third-party services (Firebase, Azure Document Intelligence)
   - User rights (deletion happens automatically)
   - No account = no persistent personal data
   - Receipt images are processed but never stored

2. **Add GDPR Cookie Consent** (if adding analytics):
   ```
   Essential cookies: localStorage for Azure credentials (testing only)
   Analytics: Google Analytics (optional, requires consent)
   ```

3. **API Key Security Warning** (for BYOK testing mode):
   - User's Azure credentials are stored in localStorage
   - Add warning: "Your API credentials are stored in this browser only"
   - Production: Proxy through your server (hides credentials)

4. **Firebase Security Rules**:
   - Current: Rooms are world-readable with room code
   - Risk: Anyone with room code can access data
   - Mitigation: This is acceptable given 7-day expiration

### Privacy Red Flags to Address

| Issue | Severity | Fix |
|-------|----------|-----|
| No privacy policy | High | Create policy |
| Azure endpoint in localStorage | Medium | Add warning text |
| Names stored in Firebase | Low | Auto-deletion covers this |
| No cookie notice | Medium | Add if using analytics |

---

## Azure Account Migration Path

### Current State: Personal Account Testing

**Your Setup:**
- Personal Azure account (free trial → Pay-as-you-go)
- F0 (Free) tier Document Intelligence: 500 pages/month
- Endpoint and API key stored in YOUR browser's localStorage
- YOU are currently the only user of the OCR feature

### Problem: Personal Account Limitations

| Concern | Impact | When It Matters |
|---------|--------|-----------------|
| **Single API key** | Only YOU can use OCR | Immediately |
| **F0 quota limits** | 500 pages/month total | When you share |
| **Personal billing** | Your credit card | When you scale |
| **No SLA** | Microsoft can restrict | Production use |
| **Terms of Service** | Personal ≠ Commercial | Legal risk |

### Migration Path to Production

#### Phase 1: Testing (Current - 0-2 weeks)
```
Status: Personal Azure account, F0 tier
Capacity: 500 pages/month (just you testing)
Cost: $0
Action: Test and validate the integration works
```

#### Phase 2: Soft Launch (Weeks 3-4)
```
Status: Still personal account, upgrade to S0 tier
Capacity: Unlimited pages at $0.01/page
Cost: ~$5-10/month
Action: 
  - Upgrade to S0 (Pay-as-you-go)
  - Create a backend proxy to hide your API key
  - Add payment gate before OCR calls
```

**⚠️ CRITICAL: Backend Proxy Required**

Before going live, you MUST create a backend proxy because:
1. Your API key cannot be exposed to users
2. You need to validate payments before allowing OCR
3. You need to track usage for billing alerts

**Proxy Options (Free Tiers):**
| Service | Free Tier | Effort |
|---------|-----------|--------|
| Cloudflare Workers | 100K requests/day | 2-4 hours |
| Vercel Edge Functions | 100K requests/month | 2-4 hours |
| Netlify Functions | 125K requests/month | 2-4 hours |
| AWS Lambda | 1M requests/month | 4-6 hours |

#### Phase 3: Production (Month 2+)
```
Status: Business Azure account OR continue personal with S0
Capacity: Scale to demand
Cost: $0.01/page + Stripe fees
Action:
  - Consider Azure for Startups program ($1,000-150,000 credits)
  - Set up billing alerts
  - Monitor usage dashboard
```

### Option A: Stay on Personal Account (Simpler)

**Pros:**
- No new account setup
- Works immediately
- Same free tier benefits

**Cons:**
- Commingled personal/business finances (tax complexity)
- No enterprise support
- Microsoft ToS technically requires commercial account for commercial use

**Recommendation:** Fine for soft launch, migrate later if successful

### Option B: Create Business Azure Account (Recommended for Scale)

**When to Do This:**
- When monthly revenue exceeds $100
- When you incorporate as LLC/etc
- When you want to apply for Azure for Startups

**Steps:**
1. Create new Azure account with business email
2. Apply for Azure for Startups: https://azure.microsoft.com/free/startups/
   - Up to $150,000 in Azure credits
   - Requires brief application
3. Create new Document Intelligence resource
4. Update your backend proxy with new credentials
5. (Optional) Close old personal resource

### Azure for Startups Program

| Benefit | Value | Eligibility |
|---------|-------|-------------|
| Azure credits | $1,000 - $150,000 | Seed stage, <$10M funding |
| Technical support | Free | All participants |
| Partner benefits | GitHub, OpenAI, etc | All participants |
| Office 365 | Free for 1 year | Some programs |

**Application:** https://azure.microsoft.com/free/startups/  
**Approval time:** 1-2 weeks

### Required Architecture Change for Production

```
CURRENT (Testing Only):
┌──────────┐     ┌─────────────────┐
│  User    │────▶│  Azure API      │
│  Browser │     │  (YOUR key)     │
└──────────┘     └─────────────────┘
        ↑
        ⚠️ API key exposed in localStorage

PRODUCTION (Required):
┌──────────┐     ┌─────────────────┐     ┌─────────────────┐
│  User    │────▶│  Your Backend   │────▶│  Azure API      │
│  Browser │     │  (Cloudflare)   │     │  (key hidden)   │
└──────────┘     └─────────────────┘     └─────────────────┘
        │                │
        │                ├── Check payment/credits
        │                └── Rate limiting
        │
        └── User never sees API key
```

### Action Items for Production

| Task | Priority | Effort | Status |
|------|----------|--------|--------|
| Create backend proxy (Cloudflare Worker) | P0 | 4 hours | ❌ |
| Add Stripe payment check in proxy | P0 | 4 hours | ❌ |
| Set up Azure billing alerts | P1 | 30 min | ❌ |
| Move credentials to environment variables | P1 | 1 hour | ❌ |
| Apply for Azure for Startups | P2 | 1 hour | ❌ |
| Create business Azure account | P3 | 2 hours | ❌ |

---

## Additional Work Required

### Priority 1: Legal & Compliance (Launch Blockers)

| Task | Effort | Status |
|------|--------|--------|
| Create Terms of Service | 4 hours | ❌ Not done |
| Create Privacy Policy | 4 hours | ❌ Not done |
| Add ToS/Privacy links to app | 30 min | ❌ Not done |
| Cookie consent (if analytics) | 2 hours | ❌ Not done |
| Trademark search | 2 hours | ❌ Not done |

### Priority 2: Monetization (Revenue Enablers)

| Task | Effort | Status |
|------|--------|--------|
| Stripe account setup | 1 hour | ❌ Not done |
| Payment integration | 1-3 days | ❌ Not done |
| OCR usage tracking | 4 hours | ❌ Not done |
| Premium feature gates | 4 hours | ❌ Not done |
| Pricing page | 2 hours | ❌ Not done |

### Priority 3: Product Polish

| Task | Effort | Status |
|------|--------|--------|
| Error handling improvements | 4 hours | ⚠️ Partial |
| Mobile responsiveness audit | 2 hours | ⚠️ Partial |
| Accessibility (a11y) audit | 4 hours | ❌ Not done |
| Loading states | 2 hours | ⚠️ Partial |
| PWA manifest (add to home screen) | 2 hours | ❌ Not done |
| Offline support | 8 hours | ❌ Not done |

### Priority 4: Growth Features

| Task | Effort | Status |
|------|--------|--------|
| Analytics (privacy-friendly) | 2 hours | ❌ Not done |
| Share to social media | 2 hours | ❌ Not done |
| "How it works" tutorial | 4 hours | ❌ Not done |
| Landing page | 8 hours | ❌ Not done |
| SEO optimization | 4 hours | ❌ Not done |

### Priority 5: Scalability

| Task | Effort | Status |
|------|--------|--------|
| Backend OCR proxy (Cloudflare Worker) | 4 hours | ❌ Not done |
| Move Azure credentials to server-side | 2 hours | ❌ Not done |
| Rate limiting | 4 hours | ❌ Not done |
| Firebase usage monitoring | 2 hours | ❌ Not done |
| Azure billing alerts | 30 min | ❌ Not done |
| Apply for Azure for Startups | 1 hour | ❌ Not done |

### Total Effort Estimate

| Priority | Hours | Timeline |
|----------|-------|----------|
| P1: Legal | 12 hours | Week 1 |
| P2: Monetization | 24 hours | Week 2-3 |
| P3: Polish | 20 hours | Week 3-4 |
| P4: Growth | 20 hours | Month 2 |
| P5: Scale | 16 hours | As needed |
| **Total** | **92 hours** | **4-6 weeks** |

---

## Go-To-Market Timeline

### Phase 1: Foundation (Weeks 1-2)
- [ ] Complete legal documents (ToS, Privacy)
- [ ] Trademark search and domain registration
- [ ] Fix critical bugs and polish UI
- [ ] Set up Stripe account

### Phase 2: Soft Launch (Weeks 3-4)
- [ ] Deploy to production domain
- [ ] Implement basic monetization (OCR paywall)
- [ ] Add analytics (Plausible or Simple Analytics)
- [ ] Share with friends/family for testing

### Phase 3: Marketing Push (Weeks 5-8)
- [ ] Create landing page with value prop
- [ ] Post on Product Hunt
- [ ] Share on Reddit (r/personalfinance, r/frugal, r/splitwise)
- [ ] Create TikTok/Instagram demo videos
- [ ] Reach out to personal finance bloggers

### Phase 4: Iterate & Scale (Months 3+)
- [ ] Analyze usage patterns
- [ ] A/B test pricing
- [ ] Add requested features
- [ ] Explore partnerships (restaurants, travel apps)

---

## Risk Assessment

### Risk Matrix

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Low user adoption | Medium | High | Focus on virality (sharing) |
| Competitors copy features | Medium | Medium | Speed to market, brand building |
| Firebase costs spike | Low | Medium | Set up billing alerts, migrate plan |
| Azure API changes/pricing | Low | Medium | Abstract OCR layer, keep Google Vision as backup |
| Azure account limits | Low | Medium | Upgrade to S0, apply for Startups program |
| Legal action | Low | High | Proper ToS, insurance |
| Security breach | Low | High | Backend proxy, minimize data, HTTPS only |
| Negative reviews | Medium | Medium | Customer support, quick fixes |

### Competitive Response

If Splitwise/Tricount respond with free OCR:
1. **They likely won't** - Their business model depends on subscriptions
2. **If they do** - Emphasize no-account, instant access
3. **Fallback** - Pivot to restaurant/venue partnerships

---

## Appendix: Quick Start Checklist

### Before Launch (Must Have)
- [ ] Terms of Service live
- [ ] Privacy Policy live
- [ ] Domain registered and configured
- [ ] SSL certificate active
- [ ] Basic error tracking (Sentry free tier)
- [ ] Firebase security rules reviewed
- [ ] Backup of codebase

### Nice to Have
- [ ] Analytics dashboard
- [ ] Payment processing
- [ ] Custom branding
- [ ] PWA support
- [ ] Social sharing images (OG tags)

---

## Summary

**Receipt Splitter has strong product-market fit** for one-time bill splitting. The path to market involves:

1. **Legal foundation** (2 weeks, ~$0-500)
2. **Soft launch** with friends (1 week)
3. **Backend proxy** for production OCR (4-8 hours)
4. **Monetization** via OCR pay-per-use ($0.25/scan, 96% margin)
5. **Marketing push** on Product Hunt + social (ongoing)

**Current OCR Setup:** Azure Document Intelligence (personal account, F0 free tier)  
**Production Requirement:** Backend proxy to hide API credentials

**Projected first-year costs:** $200-500 (domain, legal templates, Azure overage)  
**Projected first-year revenue:** $500-5,000 (higher margins with Azure)  
**Break-even point:** ~2-4 months with organic growth

**Key Migration Tasks:**
- [ ] Create backend proxy (Cloudflare Workers) - **Required before public launch**
- [ ] Add Stripe payment integration
- [ ] Set up Azure billing alerts
- [ ] (Optional) Apply for Azure for Startups program ($1K-$150K credits)

**Biggest risks:** Low adoption, exposing API credentials without proxy  
**Biggest opportunities:** Viral sharing, restaurant partnerships, 96% OCR margins

---

*Document updated January 24, 2026. Migrated from Google Vision BYOK to Azure Document Intelligence.*  
*Review with legal/financial professionals before launch.*

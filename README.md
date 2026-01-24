# Receipt Splitter

A simple web app to split bills and receipts among friends. Scan receipts with AI-powered OCR, claim items in real-time, and calculate who owes what!

**🌐 Live Site:** [jswegleitner.github.io/receipt-splitter](https://jswegleitner.github.io/receipt-splitter/)

---

## 🏗️ Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  GitHub Pages   │     │  Firebase       │     │  Azure Document │
│  (Hosting)      │     │  Realtime DB    │     │  Intelligence   │
│  Free, instant  │     │  (Room Sync)    │     │  (OCR)          │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │      index.html         │
                    │   (Single-file App)     │
                    │   React 18 + Tailwind   │
                    └─────────────────────────┘
```

## 🔧 Services Used

| Service | Purpose | Free Tier |
|---------|---------|-----------|
| **GitHub Pages** | Static hosting | ✅ Unlimited |
| **Firebase Realtime Database** | Real-time room sync | ✅ 1GB storage |
| **Azure Document Intelligence** | AI receipt OCR | ✅ 500 pages/mo |
| **Google Cloud Vision** | Backup OCR option | BYOK |

### Firebase Configuration
The app connects to Firebase Realtime Database for room-based collaboration:
- Project: `receipt-splitter-a199b`
- Rooms auto-expire after 7 days

### OCR Options
| Provider | Setup | Best For |
|----------|-------|----------|
| **Azure AI** ✨ | Enter endpoint + API key | Structured receipt parsing, 500 free/mo |
| **Google Vision** | Enter API key | Raw text OCR, BYOK |

---

## 🚀 Deployment

### Continuous Deployment (Current Setup)
- **Platform:** GitHub Pages
- **Branch:** `main`
- **Auto-deploy:** Yes - pushes to `main` trigger automatic deployment (~1 min)

### To Deploy Changes:
```bash
git add .
git commit -m "Your commit message"
git push origin main
# GitHub Pages automatically deploys within ~1 minute
```

---

## 🚀 Local Development

**Option 1: Direct Browser**
- Simply open `index.html` in any web browser
- Double-click the file or right-click → Open with → Browser

**Option 2: Live Server (VS Code)**
- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

---

## ✨ Features

- **📷 OCR Receipt Scanning**: Take a photo → auto-extract items & prices
- **👥 Room-Based Collaboration**: Create a room, share the code, claim items together in real-time
- **🧮 Smart Splitting**: Handles partial claims, shared items, quantities
- **💰 Tax & Tip**: Automatically distributes proportionally
- **📤 Export**: Download as CSV or copy to Google Sheets
- **📱 Mobile Friendly**: Works on phones, tablets, and desktops

---

## 💡 Workflow

### Solo Use:
1. **Scan/Enter Receipt**: Upload photo or manually enter items
2. **Review Items**: Edit names, prices, quantities
3. **Add People**: Enter names of everyone splitting
4. **Claim Items**: Assign items to people
5. **Calculate & Share**: View breakdown, export results

### Collaborative Use (Room Mode):
1. **Host creates room**: Scans receipt, creates room with 5-letter code
2. **Friends join**: Enter room code on their devices
3. **Everyone claims**: Each person selects their items in real-time
4. **Auto-sync**: All changes sync via Firebase
5. **View totals**: Everyone sees their share

---

## 🛠️ Technical Details

- **Single HTML File** - No build tools, no Node.js required
- **React 18** - Loaded via CDN (unpkg.com)
- **Tailwind CSS** - Styled via CDN
- **Babel Standalone** - JSX transformation in browser
- **Lucide Icons** - Icons via CDN
- **Firebase SDK** - Realtime Database via CDN
- **localStorage** - API key storage, session persistence

---

## 📁 Project Structure

```
Receipt Splitter/
├── index.html              # Main app (single-file React application)
├── README.md               # This file
├── .gitignore              # Excludes strategy docs & test files
├── .nojekyll               # GitHub Pages config
└── .github/
    └── copilot-instructions.md  # AI assistant context
```

**Local Only (not in repo):**
- `GO_TO_MARKET_STRATEGY.md` - Business planning
- `COMPETITOR_ANALYSIS.md` - Market research
- `Test Receipts/` - Sample receipts for testing

---

## 🔐 Privacy & Data

- **Room data**: Stored in Firebase Realtime Database (temporary, for active sessions)
- **API keys**: Stored in browser localStorage (never sent to our servers)
- **No user accounts**: No login required
- **No tracking**: No analytics or third-party trackers

---

## 🐛 Troubleshooting

### OCR Not Working (Azure)
- Ensure both Endpoint and API Key are entered
- Endpoint format: `https://your-resource.cognitiveservices.azure.com`
- Check Azure portal for remaining free tier quota
- Verify the Document Intelligence resource is active

### OCR Not Working (Google Vision)
- Ensure Google Vision API key is entered
- Check browser console for error messages
- Verify API key has Vision API enabled in Google Cloud Console

### Room Sync Issues
- Check Firebase console for database rules/connectivity
- Ensure both users have same room code (case-sensitive)
- Try refreshing the page

---

## 🔄 Recent Updates

- **Jan 24, 2026**: Migrated to Azure Document Intelligence (500 free pages/mo)
- **Jan 24, 2026**: Switched hosting from Netlify to GitHub Pages (free, unlimited)
- **Jan 24, 2026**: Added OCR provider toggle (Azure AI / Google Vision)
- **Jan 2026**: Fixed parser for receipts with prices on separate lines
- Added tip detection from OCR
- Improved skip patterns for receipt headers/footers

---

## 📱 Access from Mobile

**Direct URL:** [jswegleitner.github.io/receipt-splitter](https://jswegleitner.github.io/receipt-splitter/)

**From GitHub Mobile App:**
1. Open the GitHub app
2. Go to your `receipt-splitter` repository
3. Tap the **Deployments** section (or look for 🌐 icon)
4. Tap the deployment URL

**Add to Home Screen (iOS/Android):**
1. Open the URL in your mobile browser
2. Tap Share → "Add to Home Screen"
3. Access like a native app!

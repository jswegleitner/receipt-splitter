# Receipt Splitter

A simple web app to split bills and receipts among friends. Scan receipts with OCR, claim items, and calculate who owes what!

**Live Site:** [receipt-splitter.netlify.app](https://receipt-splitter.netlify.app) *(update with your actual Netlify URL)*

---

## 🏗️ Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Netlify       │     │  Firebase       │     │  Google Cloud   │
│   (Hosting)     │     │  Realtime DB    │     │  Vision API     │
│                 │     │  (Room Sync)    │     │  (OCR)          │
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

| Service | Purpose | Console Link |
|---------|---------|--------------|
| **Netlify** | Continuous deployment & hosting | [app.netlify.com](https://app.netlify.com) |
| **Firebase Realtime Database** | Real-time room sync for collaborative claiming | [console.firebase.google.com](https://console.firebase.google.com) |
| **Google Cloud Vision API** | OCR receipt scanning | [console.cloud.google.com](https://console.cloud.google.com) |

### Firebase Configuration
The app connects to Firebase Realtime Database for room-based collaboration. The config is embedded in `index.html`:
- Project: `receipt-splitter-a199b`
- Database URL: `https://receipt-splitter-a199b-default-rtdb.firebaseio.com`

### Google Vision API
Users must provide their own API key (stored in localStorage) for OCR functionality.

---

## 🚀 Deployment

### Continuous Deployment (Current Setup)
- **Platform:** Netlify
- **Branch:** `main`
- **Auto-deploy:** Yes - pushes to `main` trigger automatic deployment

### To Deploy Changes:
```bash
git add .
git commit -m "Your commit message"
git push origin main
# Netlify automatically deploys within ~1 minute
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
├── index.html          # Main app (single-file React application)
├── README.md           # This file
├── .github/
│   └── copilot-instructions.md  # AI assistant context
└── Test Receipts/      # Sample receipts for testing OCR
```

---

## 🔐 Privacy & Data

- **Room data**: Stored in Firebase Realtime Database (temporary, for active sessions)
- **API keys**: Stored in browser localStorage (never sent to our servers)
- **No user accounts**: No login required
- **No tracking**: No analytics or third-party trackers

---

## 🐛 Troubleshooting

### OCR Not Working
- Ensure Google Vision API key is entered in settings
- Check browser console for error messages
- Verify API key has Vision API enabled in Google Cloud Console

### Room Sync Issues
- Check Firebase console for database rules/connectivity
- Ensure both users have same room code (case-sensitive)
- Try refreshing the page

### Parser Not Finding Items
- Check the "Show Raw OCR Text" option to see what was detected
- The parser looks for patterns like:
  - `Item Name $12.99` (same line)
  - `Item Name` followed by `$12.99` (next line)
  - `2 Item Name $25.98` (quantity prefix)

---

## 🔄 Recent Updates

- **Jan 2026**: Fixed parser to handle receipts with prices on separate lines (e.g., Toast receipts)
- Added tip detection from OCR
- Improved skip patterns for receipt headers/footers

# Receipt Splitter

A simple web app to split bills and receipts among friends. No installation required!

## 🚀 How to Run

**Option 1: Local**
- Simply open `index.html` in any web browser
- Double-click the file or right-click → Open with → Browser

**Option 2: Live Preview in VS Code**
- Install "Live Server" extension in VS Code
- Right-click `index.html` → "Open with Live Server"

## 📤 Sharing with Friends

### Free Hosting Options:

**1. Netlify Drop (Easiest - No Account Needed)**
1. Go to https://app.netlify.com/drop
2. Drag and drop your `index.html` file
3. Get instant URL to share!

**2. GitHub Pages (Free Forever)**
1. Create a GitHub account (if you don't have one)
2. Create a new repository called `receipt-splitter`
3. Upload `index.html`
4. Go to Settings → Pages → Enable GitHub Pages
5. Your app will be live at: `https://yourusername.github.io/receipt-splitter`

**3. Vercel (Fast & Professional)**
1. Sign up at https://vercel.com
2. Drag and drop your folder
3. Get instant deployment

**4. Cloudflare Pages**
1. Sign up at https://pages.cloudflare.com
2. Upload your file
3. Free and very fast

## ✨ Features

- **Add Receipt Items**: Enter items, prices, and quantities
- **Add People**: List everyone who shared the meal
- **Claim Items**: Each person selects what they ordered
- **Smart Splitting**: Handles partial claims and shared items
- **Tax & Tip**: Automatically distributes based on proportion
- **Share Link**: Generate a unique link for friends to claim their items
- **Export**: Download results as CSV or copy to Google Sheets

## 💡 How It Works

1. **Create Receipt**: Enter all items from your bill
2. **Add Friends**: List everyone who's splitting
3. **Claim Items**: Each person marks what they ordered
4. **Calculate**: App splits unclaimed items evenly and calculates totals
5. **Share Results**: Export or share the breakdown

## 🔐 Privacy

- All data is stored locally in your browser
- No server, no database, no tracking
- Session links allow sharing state via URL parameters

## 🛠️ Technical Details

- **Pure HTML/CSS/JavaScript** - No build tools needed
- **React 18** - Loaded via CDN
- **Tailwind CSS** - Styled via CDN
- **Lucide Icons** - Icons via CDN
- **localStorage** - Session persistence

## 📱 Mobile Friendly

Works perfectly on phones, tablets, and desktops!

## 🔄 Future Enhancements

- OCR receipt scanning
- Venmo/PayPal integration
- Multiple currency support
- Save favorite groups

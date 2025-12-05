# 🏍️ Smart Parts Finder - Replace Excel with Lightning-Fast Search

A **simple automation tool** that eliminates Excel spreadsheets and manual searching. Find any motorcycle part in seconds instead of scrolling through endless rows and sheets!

## 🎯 Why This Exists

**Tired of:**
- 📊 Searching through massive Excel files?
- 🔍 Scrolling through hundreds of rows to find one part?
- ⏰ Wasting time opening multiple spreadsheets?
- 😤 Dealing with slow, cluttered Excel sheets?

**This app replaces all that** with instant search across your entire inventory. Type any keyword - part name, number, bike model, brand - and get results in milliseconds.

## 💡 What It Does

**Simple Automation:** No more Excel spreadsheets. No more manual searching. Just a fast, clean interface built specifically for finding motorcycle parts quickly.

**Offline & Private:** Runs completely on your computer. No internet needed. No cloud subscriptions. Your data stays with you.

**Zero Setup:** Download, install, and start using immediately. No configuration, no technical knowledge required.

## ✨ Key Benefits

### ⚡ **Lightning-Fast Search**
- Find any part in **under 1 second**
- No more scrolling through Excel rows
- Search by anything: name, part number, bike model, brand, category
- See all matching results instantly

### 🎯 **Built for Speed**
- Replaces slow Excel spreadsheets
- No waiting for files to load
- No clicking through multiple sheets
- Clean, distraction-free interface

### 📦 **Complete Product Information**
- Product name and part numbers
- Compatible bike models
- Categories and brands
- Stock quantities and shelf locations
- Pricing and descriptions
- All in one view - no switching between sheets

### 🔧 **Simple Management**
- Add new products in seconds
- Update information on the fly
- Delete outdated products
- Everything is faster than Excel

### 💾 **Your Data, Your Control**
- Works 100% offline
- No internet required
- No subscriptions or monthly fees
- All data stored locally on your computer
- Easy backup - just copy one file

---

## 📥 Installation

### For Users (3 Easy Steps)

1. **Download** the installer: `Mathaji Pro Setup.exe`
2. **Double-click** to install (takes ~1 minute)
3. **Launch and start searching!**

**What you DON'T need:**
- ❌ No Python, MySQL, or any technical software
- ❌ No internet connection
- ❌ No configuration files
- ❌ No IT support

**Just install and use** - simpler than opening Excel!

### For Developers

Want to build from source? See the [Development Setup](#-development-setup) section below.

---

## 🚀 Quick Start - Faster Than Excel

### First Launch

Open the app - that's it! Your search database is automatically created. No Excel file to create, no templates to download.

### Finding a Product (The Old Way vs New Way)

**❌ Old Way (Excel):**
1. Open Excel file (wait for it to load)
2. Scroll through hundreds of rows
3. Use Ctrl+F and hope you typed it right
4. Check multiple sheets
5. Time: ~30-60 seconds per search

**✅ New Way (This App):**
1. Type in search box
2. See results instantly
3. Time: **Under 1 second**

### Adding Your First Product

**Excel equivalent:** Adding a new row, typing in each column, hoping you don't mess up the formatting.

**This app:** Simple form, clear fields, done in 20 seconds.

1. Click **"Add Product"**
2. Fill in the form (only Product Name is required):
   - Product Name - e.g., "Front Brake Pad"
   - Part Number - e.g., "BP-001"
   - Compatible Bikes - e.g., "Honda CB350, RE Classic 350"
   - Category - e.g., "Brake Parts"
   - Brand - e.g., "Brembo"
   - Stock - e.g., "15"
   - Shelf - e.g., "A-12"
   - Price - e.g., "1200"
3. Click **"Create Product"** - Done!

### Searching for Products

**Excel equivalent:** Ctrl+F, type keyword, "Find Next", "Find Next", check another sheet...

**This app:** Type once, see everything instantly.

- Type **anything** in the search box
- Product name? ✓
- Part number? ✓
- Bike model? ✓
- Brand or category? ✓
- Results appear as you type
- Click any result to see full details

### Quick Edits

No more finding the right row, unlocking cells, fixing formulas...

- Click any product to view it
- Click **"Edit"** to modify
- Update any field
- Click **"Save"** - Done!
- Or click **"Delete"** if no longer needed

---

## 🗂️ Data Storage - Simpler Than Excel

**Excel:** Multiple files scattered across your computer. Which one is the latest? Which folder did you save it in?

**This app:** One file, always in the same place. Always the latest version.

- **Database**: `%APPDATA%\MotorcycleParts\inventory.db`
- **Logs**: `%APPDATA%\MotorcycleParts\logs\` (for troubleshooting)

**To find your data:**
1. Press `Win + R`
2. Type `%APPDATA%\MotorcycleParts`
3. Press Enter

---

## 💾 Backup - Just Copy One File

**Excel backup:** Save As, rename with date, hope you remember to do it, end up with 50 files.

**This app backup:** Copy one file. That's it.

### Quick Backup

```powershell
# Find your database
explorer %APPDATA%\MotorcycleParts

# Copy inventory.db to USB drive or cloud folder
copy %APPDATA%\MotorcycleParts\inventory.db D:\Backups\
```

### Restore from Backup

```powershell
# Close the app first
# Copy backup back
copy D:\Backups\inventory.db %APPDATA%\MotorcycleParts\inventory.db
# Open app - done!
```

**Pro tip:** Copy `inventory.db` to Dropbox/OneDrive for automatic cloud backup.

---

## 🐛 Troubleshooting

### Application won't start

1. Check if port 8000 is available
2. Look for error logs in `%APPDATA%\MotorcycleParts\logs\backend.log`
3. Try reinstalling the application

### Data not saving

1. Check if you have write permissions to `%APPDATA%`
2. Ensure disk space is available
3. Check logs for database errors

### Search not working

1. Verify products exist in the database
2. Try restarting the application
3. Check for special characters in search query

### Need Help?

Check the logs at: `%APPDATA%\MotorcycleParts\logs\backend.log`

---

## 🔧 Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **SQLite** - Embedded database (no server needed)
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server
- **PyInstaller** - Standalone executable packaging

### Frontend
- **Electron** - Desktop app framework
- **React** - UI framework
- **React Router** - Navigation
- **electron-builder** - Windows installer creation

---

## 📊 Database Schema

### Products Table

| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key (auto-increment) |
| product_name | VARCHAR(255) | Product name * |
| part_number | VARCHAR(100) | Part/model number |
| bike_models | TEXT | Compatible bikes |
| category | VARCHAR(100) | Product category |
| brand | VARCHAR(100) | Brand name |
| stock_quantity | INTEGER | Stock level |
| shelf_location | VARCHAR(100) | Physical location |
| price | DECIMAL(10,2) | Price |
| description | TEXT | Description |
| created_at | DATETIME | Created timestamp |
| updated_at | DATETIME | Updated timestamp |

\* Required field

---

## 🛠️ Development Setup

### Prerequisites

- **Backend**: Python 3.8+, pip
- **Frontend**: Node.js 16+, npm
- **Build**: PyInstaller, electron-builder

### Clone and Install

```powershell
# Clone the repository
git clone <repository-url>
cd listing

# Backend setup
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
cd ..

# Frontend setup
cd frontend
npm install
cd ..
```

### Running in Development Mode

#### Backend

```powershell
cd backend
.\venv\Scripts\Activate.ps1
python run.py
# Backend runs on http://127.0.0.1:8000
```

#### Frontend

```powershell
# In a new terminal
cd frontend
npm run electron:dev
# Electron app opens with React dev server
```

### Building the Application

#### Build Backend Executable

```powershell
cd backend
python build_backend.py
# Output: backend/dist/MotorcyclePartsBackend.exe
```

#### Build Frontend + Create Installer

```powershell
cd frontend
npm run build                    # Build React app
npm run electron:build:win       # Package and create installer
# Output: frontend/dist/Mathaji Pro Setup 1.0.0.exe
```

#### Complete Build (All-in-One)

```powershell
cd frontend
.\build_complete.bat
# Builds backend, frontend, and creates installer
```

### Project Structure

```
listing/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application
│   │   ├── config.py            # Configuration
│   │   ├── database.py          # Database setup
│   │   ├── models/
│   │   │   └── product.py       # SQLAlchemy models
│   │   ├── schemas/
│   │   │   └── product.py       # Pydantic schemas
│   │   └── routes/
│   │       └── products.py      # API endpoints
│   ├── build_backend.py         # PyInstaller build script
│   ├── backend.spec             # PyInstaller spec file
│   ├── requirements.txt
│   └── run.py                   # Entry point
│
├── frontend/
│   ├── electron/
│   │   ├── main.js              # Electron main process
│   │   └── preload.js           # API bridge
│   ├── src/
│   │   ├── pages/
│   │   │   ├── SearchPage.js
│   │   │   ├── AddProductPage.js
│   │   │   └── ProductDetailPage.js
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── build_complete.bat       # Complete build script
│
├── .gitignore
└── README.md
```

---

## 🔐 Security Notes

- System designed for **local use only**
- No authentication (single-user system)
- No network access required
- All data stored locally on your computer
- Secure context isolation in Electron

---

## 🎯 Future Enhancements - More Automation

Ideas to make it even faster:

- [ ] **Barcode scanning** - Scan to add/find products instantly
- [ ] **Print labels** - Generate shelf labels automatically
- [ ] **Export to Excel/CSV** - When you need to share with others
- [ ] **Low stock alerts** - Automatic notifications
- [ ] **Quick stats dashboard** - See inventory at a glance
- [ ] **Mobile app** - Search from your phone while on the shop floor
- [ ] **Voice search** - "Show me all Honda parts"
- [ ] **Auto-reorder suggestions** - Based on sales patterns

---

## 📄 License

Open source project for motorcycle spare parts shops and similar businesses.

## 📌 Version

**Current Version**: 1.0.0

---

## 💬 Final Thoughts

**Stop wasting time with Excel.** If you're spending more than 2 seconds finding a part, you're doing it the hard way.

This app replaces:
- ❌ Multiple Excel files
- ❌ Slow searching
- ❌ Manual version control
- ❌ Complicated formulas
- ❌ Copy-paste errors

With:
- ✅ One simple app
- ✅ Instant search
- ✅ Always up-to-date
- ✅ Clean interface
- ✅ Zero errors

**Time saved per search:** ~30-60 seconds  
**Searches per day:** ~50-100  
**Total time saved:** **1-2 hours every day**

---

**Built for speed and simplicity.** 🏍️⚡

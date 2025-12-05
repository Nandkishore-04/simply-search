# Motorcycle Parts Inventory System - Frontend

Electron + React desktop application for motorcycle spare parts inventory management.

## Prerequisites

- Node.js 16+
- npm or yarn
- Running backend API (see backend README)

## Installation

### 1. Install Dependencies

```powershell
cd frontend
npm install
```

## Running the Application

### Development Mode

#### Start Backend First
Make sure the FastAPI backend is running on `http://127.0.0.1:8000`

#### Run Electron + React Dev Environment

```powershell
cd frontend
npm run electron:dev
```

This will:
1. Start React development server on `http://localhost:3000`
2. Wait for React to be ready
3. Launch Electron app

### Production Build

#### Build Windows Installer

```powershell
cd frontend
npm run electron:build:win
```

The installer will be created in `frontend/dist/`:
- `Motorcycle Parts Inventory Setup X.X.X.exe` - NSIS installer

#### Install the Application

1. Navigate to `frontend/dist/`
2. Run the installer `.exe` file
3. Follow installation wizard
4. Application will be installed in `C:\Program Files\Motorcycle Parts Inventory\`
5. Desktop and Start Menu shortcuts will be created

## Configuration

### Backend API URL

The API URL is configured in `electron/preload.js`:

```javascript
const API_BASE_URL = 'http://127.0.0.1:8000';
```

Change this if your backend runs on a different host/port.

## Features

### Search Page
- Global search across all product fields
- Real-time results display
- Click on any product to view details

### Add Product Page
- Create new products
- All fields with validation
- Auto-navigation to product detail after creation

### Product Detail Page
- View complete product information
- Edit product details inline
- Delete products with confirmation
- Navigate back to search

## Building for Distribution

### Creating Windows Installer

The `electron-builder` configuration in `package.json` controls the build:

```json
{
  "build": {
    "appId": "com.motorcycleparts.inventory",
    "productName": "Motorcycle Parts Inventory",
    "win": {
      "target": ["nsis"],
      "icon": "assets/icon.ico"
    }
  }
}
```

### Custom Application Icon

1. Create a 256x256 icon
2. Convert to `.ico` format
3. Place in `frontend/assets/icon.ico`
4. Rebuild the application

## Troubleshooting

### Backend Connection Issues

**Error**: "Failed to fetch" or "Network error"

**Solution**:
1. Verify backend is running: `http://127.0.0.1:8000/health`
2. Check CORS settings in backend
3. Verify API_BASE_URL in `preload.js`

### Electron Not Starting

**Error**: "Electron app not launching"

**Solution**:
```powershell
# Clean install
rm -r node_modules
rm package-lock.json
npm install
npm run electron:dev
```

### Build Fails

**Error**: Build process fails

**Solution**:
```powershell
# Clear cache
npm run build
rm -r dist
npm run electron:build:win
```

### React Dev Server Port Conflict

**Error**: Port 3000 already in use

**Solution**:
1. Kill process using port 3000
2. Or change port in `package.json` start script

## Development Tips

### Hot Reload

In development mode, React hot reload is enabled:
- Edit React components → Browser auto-refreshes
- Edit Electron main process → Restart Electron manually

### DevTools

Development mode automatically opens Chrome DevTools:
- Inspect UI elements
- View console logs
- Debug React components
- Monitor network requests

### Production Testing

Test the production build before distribution:

```powershell
# Build the app
npm run build

# Run Electron with production build
npm run electron
```

## Project Structure

```
frontend/
├── electron/
│   ├── main.js              # Electron main process
│   └── preload.js           # Preload script (API bridge)
├── public/
│   └── index.html           # HTML template
├── src/
│   ├── pages/
│   │   ├── SearchPage.js    # Search products
│   │   ├── AddProductPage.js # Add new product
│   │   └── ProductDetailPage.js # View/Edit product
│   ├── App.js               # Main app component
│   ├── index.js             # React entry point
│   └── index.css            # Global styles
├── assets/
│   └── icon.ico             # Application icon
├── package.json
└── .gitignore
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start React dev server only |
| `npm run build` | Build React app for production |
| `npm run electron` | Run Electron with production build |
| `npm run electron:dev` | Run full dev environment |
| `npm run electron:build` | Build Windows installer |
| `npm run electron:build:win` | Build Windows installer (explicit) |

## Security Notes

### Context Isolation

The app uses Electron's security best practices:
- `contextIsolation: true`
- `nodeIntegration: false`
- Preload script with `contextBridge`

### API Communication

All API calls go through the secure preload script:
- No direct Node.js access from renderer
- Exposed APIs are whitelisted in `window.api`

## Future Enhancements

Potential improvements:
- Auto-start backend with Electron
- Offline mode with local database
- Export/Import functionality
- Advanced filtering and sorting
- Barcode scanner integration
- Print labels feature

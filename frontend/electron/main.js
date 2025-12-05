const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

let backendProcess = null;
let mainWindow = null;

// Check if backend is ready
function checkBackendHealth(retries = 30) {
  return new Promise((resolve, reject) => {
    const attempt = (count) => {
      const options = {
        hostname: '127.0.0.1',
        port: 8000,
        path: '/health',
        method: 'GET',
        timeout: 1000
      };

      const req = http.request(options, (res) => {
        if (res.statusCode === 200) {
          console.log('✓ Backend is healthy');
          resolve(true);
        } else if (count < retries) {
          console.log(`Backend not ready, retrying... (${count}/${retries})`);
          setTimeout(() => attempt(count + 1), 1000);
        } else {
          reject(new Error('Backend health check failed'));
        }
      });

      req.on('error', (err) => {
        if (count < retries) {
          console.log(`Backend not ready, retrying... (${count}/${retries})`);
          setTimeout(() => attempt(count + 1), 1000);
        } else {
          reject(new Error(`Backend health check failed: ${err.message}`));
        }
      });

      req.on('timeout', () => {
        req.destroy();
        if (count < retries) {
          setTimeout(() => attempt(count + 1), 1000);
        } else {
          reject(new Error('Backend health check timeout'));
        }
      });

      req.end();
    };

    attempt(1);
  });
}

// Start FastAPI backend server
async function startBackend() {
  try {
    if (isDev) {
      // Development mode - use Python directly
      const backendPath = path.join(__dirname, '../../backend');
      const pythonExecutable = 'python';
      const runScript = path.join(backendPath, 'run.py');

      console.log('Starting backend in development mode...');
      console.log('Backend path:', backendPath);

      backendProcess = spawn(pythonExecutable, [runScript], {
        cwd: backendPath,
        env: { ...process.env },
      });

      backendProcess.stdout.on('data', (data) => {
        console.log(`Backend: ${data}`);
      });

      backendProcess.stderr.on('data', (data) => {
        console.error(`Backend Error: ${data}`);
      });

      backendProcess.on('close', (code) => {
        console.log(`Backend process exited with code ${code}`);
      });
    } else {
      // Production mode - use standalone executable
      const backendExe = path.join(process.resourcesPath, 'backend', 'MotorcyclePartsBackend.exe');

      console.log('Starting backend in production mode...');
      console.log('Backend executable:', backendExe);
      console.log('Resources path:', process.resourcesPath);

      // Check if backend executable exists
      const fs = require('fs');
      if (!fs.existsSync(backendExe)) {
        console.error('ERROR: Backend executable not found at:', backendExe);
        throw new Error(`Backend executable not found at: ${backendExe}`);
      }

      backendProcess = spawn(backendExe, [], {
        windowsHide: false,  // Show console for debugging
        detached: false,
        stdio: ['ignore', 'pipe', 'pipe']  // Capture stdout and stderr
      });

      backendProcess.stdout.on('data', (data) => {
        console.log(`Backend: ${data}`);
      });

      backendProcess.stderr.on('data', (data) => {
        console.error(`Backend Error: ${data}`);
      });

      backendProcess.on('error', (error) => {
        console.error('Failed to start backend:', error);
        throw error;
      });

      backendProcess.on('close', (code) => {
        console.log(`Backend process exited with code ${code}`);
        if (code !== 0 && code !== null) {
          console.error(`Backend exited with error code: ${code}`);
        }
      });
    }

    // Wait for backend to be ready
    console.log('Waiting for backend to be ready...');
    await checkBackendHealth();
    console.log('Backend started successfully!');

  } catch (error) {
    console.error('Failed to start backend:', error);
    throw error;
  }
}


function createWindow() {
  const iconPath = isDev
    ? path.join(__dirname, '../assets/icon.png')
    : path.join(process.resourcesPath, 'assets/icon.png');

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    // In packaged app, load from the build directory
    // __dirname points to the electron folder inside app.asar or resources
    const indexPath = path.join(__dirname, '..', 'index.html');
    console.log('Loading app from:', indexPath);
    console.log('__dirname:', __dirname);
    console.log('Resolved path:', path.resolve(indexPath));

    mainWindow.loadFile(indexPath).catch(err => {
      console.error('Failed to load index.html:', err);
      // Fallback: try alternative path
      const fallbackPath = path.join(app.getAppPath(), 'build', 'index.html');
      console.log('Trying fallback path:', fallbackPath);
      mainWindow.loadFile(fallbackPath);
    });

    // Enable DevTools to see errors - COMMENTED OUT FOR PRODUCTION
    // mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(async () => {
  try {
    await startBackend();
    createWindow();

    app.on('activate', function () {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  } catch (error) {
    console.error('Failed to start application:', error);
    dialog.showErrorBox(
      'Backend Startup Failed',
      `Failed to start the backend server.\n\nError: ${error.message}\n\nPlease check the logs for more details.`
    );
    app.quit();
  }
});

app.on('window-all-closed', function () {
  // Kill backend process when app closes
  if (backendProcess) {
    backendProcess.kill();
  }
  if (process.platform !== 'darwin') app.quit();
});

// Cleanup on app quit
app.on('before-quit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});

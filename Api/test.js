const { machineId } = require('node-machine-id');

// In your main.js or preload.js
async function getHardwareId() {
    try {
        const id = await machineId();
        console.log("Your Machine ID:", id);
        return id;
    } catch (error) {
        console.error("Failed to get Machine ID:", error);
    }
}
getHardwareId();

/*
const { app, BrowserWindow } = require('electron');
const CryptoJS = require('crypto-js');
const { machineIdSync } = require('node-machine-id');
const fs = require('fs');
const path = require('path');

// Embed the same key inside your main process code
const SECRET_KEY = "YourUltraSecretKeyHere"; 

function verifyLicense() {
  try {
    const currentMachineId = machineIdSync();
    
    // Read the license file saved on the user's computer
    const licensePath = path.join(app.getPath('userData'), 'license.txt');
    if (!fs.existsSync(licensePath)) return false;
    
    const userLicenseKey = fs.readFileSync(licensePath, 'utf8');

    // Decrypt the payload
    const bytes = CryptoJS.AES.decrypt(userLicenseKey, SECRET_KEY);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    // Validation Checks
    const isCorrectMachine = (decryptedData.machineId === currentMachineId);
    const isStillValid = (Date.now() < decryptedData.expiresAt);

    return isCorrectMachine && isStillValid;
  } catch (error) {
    return false; // Tampered or invalid key
  }
}

app.whenReady().then(() => {
  if (verifyLicense()) {
    // Launch your full app
    createMainWindow();
  } else {
    // Force open a "License Expired / Enter Key" window instead
    createActivationWindow();
  }
});
*/


/*
const { app } = require('electron');
const fs = require('fs');
const path = require('path');
const CryptoJS = require('crypto-js');

const SECRET_KEY = "YourUltraSecretKeyHere";
const TIME_TRACK_PATH = path.join(app.getPath('userData'), 'time_tracking.dat');

// Check if the user rolled back their machine clock
function isClockTampered() {
  const currentTime = Date.now();

  if (fs.existsSync(TIME_TRACK_PATH)) {
    try {
      // 1. Read and decrypt the last recorded timestamp
      const encryptedTime = fs.readFileSync(TIME_TRACK_PATH, 'utf8');
      const bytes = CryptoJS.AES.decrypt(encryptedTime, SECRET_KEY);
      const lastRecordedTime = parseInt(bytes.toString(CryptoJS.enc.Utf8), 10);

      // 2. If the machine's current time is older than the last time the app ran, it's a cheat attempt
      if (currentTime < lastRecordedTime) {
        return true; 
      }
    } catch (e) {
      return true; // File tampered with
    }
  }

  // 3. Save the new highest current time securely
  saveCurrentTime(currentTime);
  return false;
}

// Call this function periodically or when the app closes
function saveCurrentTime(timeToSave = Date.now()) {
  const encryptedTime = CryptoJS.AES.encrypt(timeToSave.toString(), SECRET_KEY).toString();
  fs.writeFileSync(TIME_TRACK_PATH, encryptedTime, 'utf8');
}
*/

/*
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Activate License</title>
  <link rel="stylesheet" href="activation.css">
</head>
<body>
  <div class="activation-card">
    <h2>License Required</h2>
    <p>Your 10-day trial has expired or requires activation. Please paste your license key below.</p>
    
    <div class="form-group">
      <label for="license-key">License Key</label>
      <textarea id="license-key" placeholder="Enter your encrypted license key..."></textarea>
    </div>

    <div class="machine-box">
      <span>Your Machine ID:</span>
      <strong id="machine-id">Loading...</strong>
    </div>

    <button id="activate-btn">Activate Application</button>
    <div id="error-msg" class="error"></div>
  </div>

  <script src="activation-renderer.js"></script>
</body>
</html>

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background-color: #1e1e24;
  color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}

.activation-card {
  background-color: #2a2a32;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  width: 380px;
}

h2 { margin-top: 0; color: #ffffff; }
p { font-size: 14px; color: #b0b0b8; line-height: 1.4; }

.form-group { margin: 20px 0; }
label { display: block; margin-bottom: 8px; font-size: 12px; text-transform: uppercase; color: #a0a0a8; }

textarea {
  width: 100%;
  height: 80px;
  background: #1e1e24;
  border: 1px solid #444;
  border-radius: 4px;
  color: #fff;
  padding: 10px;
  box-sizing: border-box;
  resize: none;
}

.machine-box {
  background: #141418;
  padding: 10px;
  border-radius: 4px;
  font-size: 13px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #007acc;
  border: none;
  color: white;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
}

button:hover { background-color: #0062a3; }
.error { color: #ff6b6b; font-size: 13px; margin-top: 12px; text-align: center; }


// Assumes you exposed an 'electronAPI' via your preload script
const { electronAPI } = window; 

document.getElementById('activate-btn').addEventListener('click', () => {
  const key = document.getElementById('license-key').value.trim();
  const errorMsg = document.getElementById('error-msg');
  
  if (!key) {
    errorMsg.innerText = "Please enter a key.";
    return;
  }

  // Send to main.js for validation
  electronAPI.submitLicense(key).then(success => {
    if (success) {
      window.close(); // Main process will reload the primary app window
    } else {
      errorMsg.innerText = "Invalid or expired license key.";
    }
  });
});

// Fetch and display Machine ID on startup so user can give it to you
window.addEventListener('DOMContentLoaded', async () => {
  const id = await electronAPI.getMachineId();
  document.getElementById('machine-id').innerText = id;
});


*/


/*
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const CryptoJS = require('crypto-js');
const { machineIdSync } = require('node-machine-id');

// Configuration
const SECRET_KEY = "YourUltraSecretKeyHere"; 
const LICENSE_PATH = path.join(app.getPath('userData'), 'license.txt');
const TIME_TRACK_PATH = path.join(app.getPath('userData'), 'time_tracking.dat');

let mainWindow = null;
let activationWindow = null;

// ==========================================
// 1. Core Licensing Logic
// ==========================================

function isClockTampered() {
  const currentTime = Date.now();
  if (fs.existsSync(TIME_TRACK_PATH)) {
    try {
      const encryptedTime = fs.readFileSync(TIME_TRACK_PATH, 'utf8');
      const bytes = CryptoJS.AES.decrypt(encryptedTime, SECRET_KEY);
      const lastRecordedTime = parseInt(bytes.toString(CryptoJS.enc.Utf8), 10);

      if (currentTime < lastRecordedTime) return true; // Clock rolled back
    } catch (e) {
      return true; // File tampering suspected
    }
  }
  saveCurrentTime(currentTime);
  return false;
}

function saveCurrentTime(timeToSave = Date.now()) {
  const encryptedTime = CryptoJS.AES.encrypt(timeToSave.toString(), SECRET_KEY).toString();
  fs.writeFileSync(TIME_TRACK_PATH, encryptedTime, 'utf8');
}

function verifyLicense() {
  if (isClockTampered()) return false;
  if (!fs.existsSync(LICENSE_PATH)) return false;

  try {
    const currentMachineId = machineIdSync();
    const userLicenseKey = fs.readFileSync(LICENSE_PATH, 'utf8');
    const bytes = CryptoJS.AES.decrypt(userLicenseKey, SECRET_KEY);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    return (decryptedData.machineId === currentMachineId) && (Date.now() < decryptedData.expiresAt);
  } catch (error) {
    return false;
  }
}

// ==========================================
// 2. Window Control Lifecycles
// ==========================================

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {	nodeIntegration: false }
  });
  mainWindow.loadFile('index.html'); // Load your real app here
  
  // Track time continuously while open to prevent rollback mid-session
  const timeInterval = setInterval(() => saveCurrentTime(), 60000); 
  mainWindow.on('closed', () => clearInterval(timeInterval));
}

function createActivationWindow() {
  activationWindow = new BrowserWindow({
    width: 450,
    height: 480,
    resizable: false,
    frame: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  activationWindow.loadFile('activation.html');
}

// ==========================================
// 3. IPC Channel Registrations
// ==========================================

ipcMain.handle('license:get-id', () => {
  return machineIdSync();
});

ipcMain.handle('license:submit', async (event, key) => {
  try {
    // Test the submitted key first before writing to disk
    const bytes = CryptoJS.AES.decrypt(key, SECRET_KEY);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    const currentMachineId = machineIdSync();

    if (decryptedData.machineId === currentMachineId && Date.now() < decryptedData.expiresAt) {
      fs.writeFileSync(LICENSE_PATH, key, 'utf8'); // Save valid key
      
      // Pivot windows asynchronously
      setTimeout(() => {
        createMainWindow();
      }, 500);
      
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
});

// ==========================================
// 4. App Startup Orchestration
// ==========================================

app.whenReady().then(() => {
  if (verifyLicense()) {
    createMainWindow();
  } else {
    createActivationWindow();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      if (verifyLicense()) createMainWindow(); else createActivationWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});



const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Frontend requests the unique system machine ID
  getMachineId: () => ipcRenderer.invoke('license:get-id'),
  
  // Frontend submits the user's input key
  submitLicense: (licenseKey) => ipcRenderer.invoke('license:submit', licenseKey)
});


*/


//real code 

/*

const CryptoJS = require('crypto-js');
const fs = require('fs');
const { machineIdSync } = require('node-machine-id');
const moment = require('moment-timezone');

// Extracted configurations
const localMachineId = machineIdSync();
const LICENSE_FILE_PATH = 'license';
const MACHINE_ID_FILE_PATH = 'machineId';
const LICENSE_AES_KEY = 'C1NKEB4M2IBIGDHAE7PRP8596E3R';
const LICENSE_TARGET = 'licenseTar';
const LICENSE_CHECK_INTERVAL_MS = 60000; // Recalculated from the obfuscated math obfuscation loop

function exitApp() {
  console.log('Exiting App');
  setTimeout(() => {
    process.exit(1);
  }, 1000);
}

function loadAndValidateLicense() {
  // Read and decrypt the license file
  const fileBuffer = fs.readFileSync(LICENSE_FILE_PATH);
  const encryptedPayload = fileBuffer.toString();
  const decryptedBytes = CryptoJS.AES.decrypt(encryptedPayload, LICENSE_AES_KEY);
  const decryptedData = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));

  if (!decryptedData) {
    throw new Error('License data is empty');
  }

  // Check 1: Hardware lock validation
  if (decryptedData.machineId !== localMachineId) {
    throw new Error('Invalid hardware');
  }

  // Check 2: License type target validation
  if (decryptedData.licenseType !== LICENSE_TARGET) {
    throw new Error('Invalid license type');
  }

  // Check 3: Expiration validation
  const timeDifference = moment().diff(decryptedData.expiry, 'seconds');
  if (timeDifference > 0) {
    throw new Error('License has expired');
  }

  return decryptedData;
}

function scheduleLicenseRecheck() {
  setInterval(() => {
    try {
      console.log('Re-checking license..');
      const validData = loadAndValidateLicense();
      const daysRemaining = moment().diff(validData.expiry, 'days');
      
      console.log('License validation passed. Expires in: ' + daysRemaining + ' day(s).');
    } catch (error) {
      console.log('check fail:', error && error.message ? error.message : error);
      exitApp();
    }
  }, LICENSE_CHECK_INTERVAL_MS);
}

// Main entry point exported by the module
exports.checkLicense = function checkLicense() {
  try {
    // Drop the current machine ID into a local text file for reference
    fs.writeFileSync(MACHINE_ID_FILE_PATH, localMachineId);
    
    const validData = loadAndValidateLicense();
    console.log('Matching hardware and license type found');
    
    const daysRemaining = moment().diff(validData.expiry, 'days');
    console.log('License check passed. Expires in: ' + daysRemaining + ' day(s).');
    
    scheduleLicenseRecheck();
    return true;
  } catch (error) {
    console.log('Initial license check failed:', error && error.message ? error.message : error);
    exitApp();
    return false;
  }
};
license.js

*/

// ============================================
// BACKEND CONFIGURATION
// ============================================
// UPDATE THESE ENDPOINTS TO MATCH YOUR ESP32 API
const API_BASE_URL = 'http://192.168.4.1'; // Change to your ESP32 IP (AP mode default: 192.168.4.1)
const API_ENDPOINTS = {
    login: '/api/login',           // POST: {username, password} -> {success, token}
    location: '/api/location',     // GET: -> {lat, lon, altitude, speed, direction, time}
    status: '/api/status',         // GET: -> {battery, satellites, wifi, uptime, gpsFix}
    history: '/api/history',       // GET: ?limit=20 -> [{time, lat, lon, speed, alt}, ...]
    logs: '/api/logs',            // GET: -> [{time, level, message}, ...]
    config: '/api/config',        // POST: {wifiSsid, wifiPassword, pollingInterval, geofence}
};

// ============================================
// GLOBAL VARIABLES
// ============================================
let authToken = null;
let currentLocation = null;
let map = null;
let marker = null;
let updateInterval = null;

// ============================================
// AUTHENTICATION
// ============================================
// BACKEND TODO: Implement HTTP Basic Auth or token-based auth
// Store credentials in ESP32 NVS and validate on each request
// Return {success: true, token: "abc123"} on successful login

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // BACKEND TODO: Hash password on client side before sending
    // Use SHA-256 or bcrypt for password hashing
    // const hashedPassword = await hashPassword(password);
    
    try {
        // BACKEND TODO: Replace with actual API call
        // const response = await fetch(API_BASE_URL + API_ENDPOINTS.login, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ username, password: hashedPassword })
        // });
        // const data = await response.json();
        
        // Demo credentials - REMOVE IN PRODUCTION
        if (username === 'admin' && password === 'admin') {
            authToken = 'demo-token-12345';
            document.getElementById('loginPage').style.display = 'none';
            document.getElementById('dashboard').style.display = 'block';
            initDashboard();
        } else {
            document.getElementById('loginError').style.display = 'block';
        }
    } catch (error) {
        console.error('Login error:', error);
        document.getElementById('loginError').style.display = 'block';
    }
});

function logout() {
    authToken = null;
    clearInterval(updateInterval);
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('dashboard').style.display = 'none';
}

// ============================================
// MAP INITIALIZATION
// ============================================
// Uses Leaflet.js with OpenStreetMap tiles
// BACKEND TODO: Just provide GPS coordinates via API

function initDashboard() {
    // Initialize map centered at Amrita Vishwa Vidyapeetham, Coimbatore
    map = L.map('map').setView([10.9026, 76.9017], 15);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    marker = L.marker([10.9026, 76.9017]).addTo(map);
    
    // Start polling for updates
    updateDashboard();
    updateInterval = setInterval(updateDashboard, 5000); // Update every 5 seconds
}

// ============================================
// REAL-TIME DATA UPDATES
// ============================================
// BACKEND TODO: Implement /api/location endpoint
// ESP32 should read GPS data using TinyGPS++ library
// Parse NMEA sentences and return JSON:
// {
//   "lat": 10.9026,
//   "lon": 76.9017,
//   "altitude": 50.5,
//   "speed": 0.0,
//   "direction": 180,
//   "time": "2025-09-30T12:00:00"
// }

async function updateDashboard() {
    try {
        // Fetch location data
        // BACKEND TODO: Replace with actual API call
        // const locationResponse = await fetch(API_BASE_URL + API_ENDPOINTS.location, {
        //     headers: { 'Authorization': `Bearer ${authToken}` }
        // });
        // const locationData = await locationResponse.json();
        
        // Demo data - REMOVE IN PRODUCTION
        const locationData = generateDemoLocationData();
        updateLocationDisplay(locationData);
        
        // Fetch device status
        // BACKEND TODO: Implement /api/status endpoint
        // ESP32 should collect:
        // - Battery: analogRead(BAT_PIN) and convert to percentage
        // - WiFi: WiFi.RSSI() for signal strength
        // - GPS satellites: gps.satellites.value()
        // - Uptime: millis() / 1000 for seconds
        // - GPS fix: gps.location.isValid()
        const statusData = generateDemoStatusData();
        updateStatusDisplay(statusData);
        
        // Check for alerts
        checkAlerts(locationData, statusData);
        
    } catch (error) {
        console.error('Update error:', error);
        addLog('error', 'Failed to fetch data from device: ' + error.message);
    }
}

function updateLocationDisplay(data) {
    currentLocation = data;
    
    document.getElementById('latitude').textContent = data.lat.toFixed(6) + '°';
    document.getElementById('longitude').textContent = data.lon.toFixed(6) + '°';
    document.getElementById('altitude').textContent = data.altitude.toFixed(1) + ' m';
    document.getElementById('speed').textContent = data.speed.toFixed(1) + ' km/h';
    document.getElementById('direction').textContent = data.direction + '°';
    document.getElementById('lastUpdate').textContent = new Date(data.time).toLocaleTimeString();
    
    // Update map
    if (map && marker) {
        marker.setLatLng([data.lat, data.lon]);
        map.setView([data.lat, data.lon], map.getZoom());
    }
}

function updateStatusDisplay(data) {
    // Battery
    const batteryEl = document.getElementById('battery');
    batteryEl.textContent = data.battery + '%';
    batteryEl.className = 'status-value ' + 
        (data.battery > 50 ? 'status-good' : data.battery > 20 ? 'status-warning' : 'status-error');
    
    // GPS Satellites
    const satEl = document.getElementById('satellites');
    satEl.textContent = data.satellites;
    satEl.className = 'status-value ' + 
        (data.satellites >= 4 ? 'status-good' : 'status-warning');
    
    // WiFi Signal
    const wifiEl = document.getElementById('wifiSignal');
    wifiEl.textContent = data.wifi + ' dBm';
    wifiEl.className = 'status-value ' + 
        (data.wifi > -70 ? 'status-good' : data.wifi > -85 ? 'status-warning' : 'status-error');
    
    // Uptime
    document.getElementById('uptime').textContent = formatUptime(data.uptime);
    
    // GPS Fix
    const fixEl = document.getElementById('gpsFix');
    fixEl.textContent = data.gpsFix ? 'Active' : 'No Fix';
    fixEl.className = 'status-value ' + (data.gpsFix ? 'status-good' : 'status-error');
}

// ============================================
// ALERTS & NOTIFICATIONS
// ============================================
// BACKEND TODO: Implement threshold checks in ESP32
// Calculate geofence breach using Haversine formula in C
// Flag alerts in JSON response or trigger via WebSocket

function checkAlerts(location, status) {
    const alerts = [];
    
    // Low battery alert
    if (status.battery < 20) {
        alerts.push({
            type: 'danger',
            message: `⚠️ Low Battery: ${status.battery}% remaining`
        });
    }
    
    // GPS signal lost
    if (!status.gpsFix) {
        alerts.push({
            type: 'warning',
            message: '📡 GPS signal lost - no position fix'
        });
    }
    
    // Poor satellite coverage
    if (status.satellites < 4) {
        alerts.push({
            type: 'warning',
            message: `🛰️ Low satellite count: ${status.satellites} (need 4+ for accuracy)`
        });
    }
    
    // Geofence breach check
    // BACKEND TODO: Implement Haversine distance calculation in ESP32
    // Compare current position with configured geofence center/radius
    const geofenceConfig = getGeofenceConfig();
    if (geofenceConfig.enabled) {
        const distance = calculateDistance(
            location.lat, location.lon,
            geofenceConfig.lat, geofenceConfig.lon
        );
        if (distance > geofenceConfig.radius) {
            alerts.push({
                type: 'danger',
                message: `🚨 Geofence breach: ${distance.toFixed(0)}m from center`
            });
        }
    }
    
    displayAlerts(alerts);
}

function displayAlerts(alerts) {
    const container = document.getElementById('alertsList');
    if (alerts.length === 0) {
        container.innerHTML = '<p style="color: #666; text-align: center;">No active alerts</p>';
    } else {
        container.innerHTML = alerts.map(alert => 
            `<div class="alert alert-${alert.type}">${alert.message}</div>`
        ).join('');
    }
}

// ============================================
// HISTORICAL DATA
// ============================================
// BACKEND TODO: Implement /api/history endpoint
// Store recent positions in ESP32 SPIFFS or SD card
// Return JSON array: [{time, lat, lon, speed, altitude}, ...]
// Limit to last 20-50 entries to avoid memory overflow

async function loadHistory() {
    try {
        // BACKEND TODO: Replace with actual API call
        // const response = await fetch(API_BASE_URL + API_ENDPOINTS.history + '?limit=20', {
        //     headers: { 'Authorization': `Bearer ${authToken}` }
        // });
        // const historyData = await response.json();
        
        // Demo data - REMOVE IN PRODUCTION
        const historyData = generateDemoHistory();
        
        const tbody = document.getElementById('historyTableBody');
        tbody.innerHTML = historyData.map(entry => `
            <tr>
                <td>${new Date(entry.time).toLocaleString()}</td>
                <td>${entry.lat.toFixed(6)}°</td>
                <td>${entry.lon.toFixed(6)}°</td>
                <td>${entry.speed.toFixed(1)} km/h</td>
                <td>${entry.altitude.toFixed(1)} m</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('History load error:', error);
    }
}

// ============================================
// CONFIGURATION
// ============================================
// BACKEND TODO: Implement /api/config POST endpoint
// Store settings in ESP32 NVS (non-volatile storage)
// Handle WiFi reconnection if credentials changed
// Call ESP.restart() if necessary for safety

document.getElementById('configForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const config = {
        wifiSsid: document.getElementById('wifiSsid').value,
        wifiPassword: document.getElementById('wifiPassword').value,
        pollingInterval: parseInt(document.getElementById('pollingInterval').value),
        geofence: {
            lat: parseFloat(document.getElementById('geofenceLat').value),
            lon: parseFloat(document.getElementById('geofenceLon').value),
            radius: parseInt(document.getElementById('geofenceRadius').value)
        }
    };
    
    try {
        // BACKEND TODO: Replace with actual API call
        // const response = await fetch(API_BASE_URL + API_ENDPOINTS.config, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${authToken}`
        //     },
        //     body: JSON.stringify(config)
        // });
        
        // Demo - REMOVE IN PRODUCTION
        alert('Configuration saved! Device will restart to apply changes.');
        saveGeofenceConfig(config.geofence);
        addLog('info', 'Configuration updated successfully');
    } catch (error) {
        console.error('Config save error:', error);
        alert('Failed to save configuration: ' + error.message);
    }
});

// ============================================
// LOGS VIEWER
// ============================================
// BACKEND TODO: Implement /api/logs endpoint
// Maintain rolling log buffer in memory or SPIFFS
// Return JSON: [{time, level, message}, ...]
// Levels: 'info', 'warning', 'error'

async function loadLogs() {
    try {
        // BACKEND TODO: Replace with actual API call
        // const response = await fetch(API_BASE_URL + API_ENDPOINTS.logs, {
        //     headers: { 'Authorization': `Bearer ${authToken}` }
        // });
        // const logs = await response.json();
        
        // Demo data - REMOVE IN PRODUCTION
        const logs = generateDemoLogs();
        
        const viewer = document.getElementById('logViewer');
        viewer.innerHTML = logs.map(log => 
            `<div class="log-entry">
                <span class="log-timestamp">[${new Date(log.time).toLocaleTimeString()}]</span>
                <span class="log-${log.level}">${log.message}</span>
            </div>`
        ).join('');
    } catch (error) {
        console.error('Logs load error:', error);
    }
}

function addLog(level, message) {
    const viewer = document.getElementById('logViewer');
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `
        <span class="log-timestamp">[${new Date().toLocaleTimeString()}]</span>
        <span class="log-${level}">${message}</span>
    `;
    viewer.insertBefore(entry, viewer.firstChild);
    
    // Keep only last 50 entries
    while (viewer.children.length > 50) {
        viewer.removeChild(viewer.lastChild);
    }
}

// ============================================
// TAB SWITCHING
// ============================================

function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    // Load data for specific tabs
    if (tabName === 'history') {
        loadHistory();
    } else if (tabName === 'logs') {
        loadLogs();
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
}

// Haversine formula for distance calculation
// BACKEND TODO: Implement this in C for ESP32 geofence checking
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
}

// Geofence configuration storage (in-memory for demo)
let geofenceConfig = { enabled: false, lat: 0, lon: 0, radius: 0 };

function saveGeofenceConfig(config) {
    geofenceConfig = { ...config, enabled: true };
}

function getGeofenceConfig() {
    return geofenceConfig;
}

// ============================================
// DEMO DATA GENERATORS
// ============================================
// REMOVE ALL FUNCTIONS BELOW IN PRODUCTION
// Replace with actual ESP32 API calls

let demoLat = 10.9026;
let demoLon = 76.9017;
let demoBattery = 85;

function generateDemoLocationData() {
    // Simulate slight movement
    demoLat += (Math.random() - 0.5) * 0.0001;
    demoLon += (Math.random() - 0.5) * 0.0001;
    
    return {
        lat: demoLat,
        lon: demoLon,
        altitude: 50 + Math.random() * 10,
        speed: Math.random() * 5,
        direction: Math.floor(Math.random() * 360),
        time: new Date().toISOString()
    };
}

function generateDemoStatusData() {
    // Simulate battery drain
    demoBattery = Math.max(10, demoBattery - Math.random() * 0.1);
    
    return {
        battery: Math.floor(demoBattery),
        satellites: Math.floor(Math.random() * 4) + 6,
        wifi: -50 - Math.floor(Math.random() * 30),
        uptime: Math.floor(Date.now() / 1000) % 86400,
        gpsFix: Math.random() > 0.1
    };
}

function generateDemoHistory() {
    const history = [];
    const now = Date.now();
    
    for (let i = 0; i < 20; i++) {
        history.push({
            time: new Date(now - i * 300000).toISOString(), // 5 min intervals
            lat: 10.9026 + (Math.random() - 0.5) * 0.01,
            lon: 76.9017 + (Math.random() - 0.5) * 0.01,
            speed: Math.random() * 20,
            altitude: 50 + Math.random() * 20
        });
    }
    
    return history;
}

function generateDemoLogs() {
    const levels = ['info', 'warning', 'error'];
    const messages = [
        'GPS module initialized successfully',
        'WiFi connected to network',
        'Location data updated',
        'Low battery warning',
        'Geofence check performed',
        'Configuration saved to NVS',
        'WebSocket client connected',
        'Failed to read GPS data',
        'Reconnecting to WiFi...',
        'System startup complete'
    ];
    
    const logs = [];
    for (let i = 0; i < 15; i++) {
        logs.push({
            time: new Date(Date.now() - i * 60000).toISOString(),
            level: levels[Math.floor(Math.random() * levels.length)],
            message: messages[Math.floor(Math.random() * messages.length)]
        });
    }
    
    return logs;
}

// Initial log entry
setTimeout(() => {
    addLog('info', 'Dashboard initialized successfully');
}, 1000);
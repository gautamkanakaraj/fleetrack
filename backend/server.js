const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const ip = require("ip");
const { runCProgram } = require("./call_c");

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

app.use(express.json());

// ===== State =====
let routePoints = []; // store route points
let lastLat = null;
let lastLon = null;
let speedWindow = []; // sliding window speeds

// ===== Routes =====

// Root test route
app.get("/", (req, res) => {
  res.send("🚀 FleetTrack Backend is running");
});

// ESP32 sends GPS data here
app.post("/data", (req, res) => {
  const { lat, lon, alt, speed } = req.body;
  const timestamp = new Date().toISOString();

  // Save to route history
  routePoints.push({ lat, lon, alt, timestamp });

  // Calculate distance from last point if exists
  if (lastLat !== null && lastLon !== null) {
    runCProgram("haversine.exe", `${lastLat} ${lastLon} ${lat} ${lon}`, (distOutput) => {
      console.log("📏 Distance:", distOutput);

      // Maintain sliding window of speeds
      if (speed) {
        speedWindow.push(speed);
        if (speedWindow.length > 5) speedWindow.shift();
      }

      // Calculate ETA if speeds available
      if (speedWindow.length > 0) {
        const speedsStr = speedWindow.join(" ");
        runCProgram("sliding_wndow.exe", `10 ${speedsStr}`, (etaOutput) => {
          io.emit("sensorData", {
            lat,
            lon,
            alt,
            speed,
            distance: distOutput,
            eta: etaOutput,
            timestamp,
          });
        });
      } else {
        // Send without ETA
        io.emit("sensorData", { lat, lon, alt, distance: distOutput, timestamp });
      }
    });
  } else {
    // First GPS point
    io.emit("sensorData", { lat, lon, alt, timestamp });
  }

  // Update last point
  lastLat = lat;
  lastLon = lon;

  res.send({ status: "ok" });
});

// Get full route history
app.get("/route", (req, res) => {
  if (routePoints.length === 0) {
    return res.json([]);
  }

  // Prepare input string for linked_list.c
  const args = routePoints
    .map((p) => `${p.lat} ${p.lon} ${p.alt} ${p.timestamp}`)
    .join(" ");

  runCProgram("linked_list.exe", args, (output) => {
    try {
      const parsed = JSON.parse(output); // linked_list prints JSON array
      res.json(parsed);
    } catch (err) {
      res.json({ error: "Failed to parse linked list output", raw: output });
    }
  });
});

// ===== Socket.IO Handling =====
io.on("connection", (socket) => {
  console.log("✅ Frontend connected:", socket.id);
  // Test emitter: send fake GPS data every 5 seconds
setInterval(() => {
  const fakeData = {
    lat: 11.0614 + Math.random() * 0.001,
    lon: 76.9086 + Math.random() * 0.001,
    alt: 440 + Math.random() * 5,
    speed: (Math.random() * 50).toFixed(2),
    distance: `${(Math.random() * 2).toFixed(3)} km`,
    eta: `${(Math.random() * 20).toFixed(1)} mins`,
    timestamp: new Date().toISOString(),
  };

  console.log("📡 Sending test data:", fakeData);
  io.emit("sensorData", fakeData);
}, 5000);


  // Run C program manually from frontend
  socket.on("runc", ({ program, inputdata }) => {
    console.log(`⚙️ Running C program: ${program} with inputs: ${inputdata}`);
    runCProgram(program, inputdata, (output) => {
      socket.emit("output", { program, result: output });
    });
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// ===== Start Server =====
const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running at http://${ip.address()}:${PORT}`);
});

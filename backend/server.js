// backend/server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const callC = require("./call_c");

const app = express();
const server = http.createServer(app);

// Allow CORS for frontend
const io = new Server(server, {
  cors: {
    origin: "*", // change to frontend URL in production
    methods: ["GET", "POST"]
  }
});

// Serve static files if needed
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple API endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running 🚀" });
});

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("🔌 A client connected:", socket.id);

  // Listen for request to run C code
  socket.on("run_c", async (data) => {
    try {
      const output = await callC(data.program, data.args || []);
      socket.emit("c_output", { success: true, output });
    } catch (err) {
      socket.emit("c_output", { success: false, error: err.message });
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ A client disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

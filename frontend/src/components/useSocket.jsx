import { useEffect, useState } from "react";
import { io } from "socket.io-client";

// Change this to your backend server (localhost for dev, ngrok/cloud for demo)

const SOCKET_URL = "https://manuel-libriform-lumpily.ngrok-free.dev";
const useSocket = () => {
  const [data, setData] = useState(null);
  const [cOutput, setCOutput] = useState(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
    });

    console.log("🔌 Connecting to backend...");

    // On successful connection
    socket.on("connect", () => {
      console.log("✅ Connected to Socket.IO:", socket.id);
    });

    // Listen for GPS/sensor data from backend
    socket.on("sensorData", (incoming) => {
      console.log("📡 Received sensor data:", incoming);
      setData(incoming); // data includes lat, lon, speed, and distance
    });

    // Listen for C program outputs
    socket.on("output", (result) => {
      console.log("⚙️ C Program Output:", result);
      setCOutput(result);
    });

    // On disconnect
    socket.on("disconnect", () => {
      console.log("❌ Disconnected from backend");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return { data, cOutput };
};

export default useSocket;

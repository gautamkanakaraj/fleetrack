const { Socket } = require('dgram');
const expsress = require('express');
const http= require("http");
const {server}= require("socket.io");
const app= express();
const { runCProgram } = require("./call_c"); 
const server=http.createServer(app);
const io=new server(server,
    {
        cors:
        {
            origin:"*",
            METHODS:["GET","POST"]
        }
    }
);
app.get("/", (req, res) => {
  res.send("C Project Socket.IO Server is running 🚀");
});

io.on("connection",(socket)=>
{
  console.log("connected:",socket.id);
  socket.on("runc",(inputdata)=>
{
    console("running c code with inputs:",inputdata);
    runCProgram(inputdata,(output)=>
    {
        socket.emit("output",output);
        console.log("output:",output);

    })
})
  socket.on("sensorData", (data) => {
    console.log("Received sensor data:", data);
    // broadcast to all clients (including frontend)
    io.emit("sensorData", data);
  });
    socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});



server.listen(3000, ()=>
{
    console.log("server is connerted");
})

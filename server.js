const http = require('http');
const os = require('os');
const express = require('express');
const socketio = require('socket.io');

function getLocalIpAddress() {
    const networkInterfaces = os.networkInterfaces();
    const wlanInterfaces = networkInterfaces['WLAN'];
    
    for (let wlanInterface of wlanInterfaces) {
        if (wlanInterface.family === "IPv4") {
            return wlanInterface.address;  // looking for local network ip address
        }
    }
    return "127.0.0.1";  // using local machines address as fallback
}

const PORT = 8080;   // just the default
const HOST = getLocalIpAddress();

const app = express();
const server = http.createServer(app);

app.use(express.static(`${__dirname}/public`));

server.listen(PORT, HOST, (err) => {
    if (err !== undefined) {
        console.error(err);
    }
    address = server.address();
    if (address === null || address == undefined) {
        console.error("Server address unknown");
    }
    else {
        const host = address?.address === '0.0.0.0' ? os.hostname()?.toLowerCase() : address.address;
        const port = address?.port;
        const protocol = address?.family;
        console.log(`Server running on http://${host}:${port}/ using ${protocol}`);
    }
});


io = socketio(server);
const clients = {};

io.on("connect", (socket) => {
    clients[socket.id] = socket;

    socket.on("disconnect", () => {
        delete clients[socket.id];
        console.log(socket.id + " disconnected");
        // may be changed
    })

    // add your custom event handlers here
});
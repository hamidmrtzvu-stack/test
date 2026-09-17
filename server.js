const http = require("http");
const { WebSocketServer } = require("ws");

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  console.log("\n========== HTTP REQUEST ==========");
  console.log(req.method, req.url);
  console.log("Headers:", req.headers);
  console.log("==================================\n");

  res.writeHead(200, {
    "Content-Type": "text/plain",
  });

  res.end("WebSocket server is running\n");
});

const wss = new WebSocketServer({
  noServer: true,
  // Disable compression: simpler and avoids unnecessary CPU/memory usage
  perMessageDeflate: false,
});

server.on("upgrade", (req, socket, head) => {
  console.log("\n\n========================================");
  console.log("       WEBSOCKET UPGRADE REQUEST");
  console.log("========================================");

  console.log("METHOD:", req.method);
  console.log("URL:", req.url);
  console.log("HTTP VERSION:", req.httpVersion);

  console.log("\nHEADERS:");
  console.log(JSON.stringify(req.headers, null, 2));

  console.log("\nCLIENT:");
  console.log("IP:", req.socket.remoteAddress);
  console.log("PORT:", req.socket.remotePort);

  console.log("\nRAW HEADERS:");
  console.log(req.rawHeaders);

  console.log("========================================\n");

  socket.on("error", (err) => {
    console.error("SOCKET ERROR:", err);
  });

  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit("connection", ws, req);
  });
});

wss.on("connection", (ws, req) => {
  console.log("\n########################################");
  console.log("         WEBSOCKET CONNECTED");
  console.log("########################################");

  console.log("URL:", req.url);
  console.log("IP:", req.socket.remoteAddress);

  console.log("\nHEADERS:");
  console.log(JSON.stringify(req.headers, null, 2));

  console.log("########################################\n");

  ws.on("message", (data, isBinary) => {
    console.log("\n========== WEBSOCKET MESSAGE ==========");

    console.log("URL:", req.url);
    console.log("Binary:", isBinary);
    console.log("Size:", data.length);

    if (isBinary) {
      console.log("Data (hex):");
      console.log(data.toString("hex"));

      console.log("\nData (base64):");
      console.log(data.toString("base64"));
    } else {
      console.log("Data:");
      console.log(data.toString());
    }

    console.log("========================================\n");
  });

  ws.on("close", (code, reason) => {
    console.log("\n========== WEBSOCKET CLOSED ==========");
    console.log("URL:", req.url);
    console.log("Code:", code);
    console.log("Reason:", reason.toString());
    console.log("======================================\n");
  });

  ws.on("error", (err) => {
    console.error("\n========== WEBSOCKET ERROR ==========");
    console.error(err);
    console.error("=====================================\n");
  });

  ws.on("ping", (data) => {
    console.log("PING:", data.toString());
  });

  ws.on("pong", (data) => {
    console.log("PONG:", data.toString());
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("========================================");
  console.log(`HTTP/WebSocket server listening on ${PORT}`);
  console.log("========================================");
});

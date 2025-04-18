const { WebSocketServer } = require("ws");
const crypto = require("crypto");
const uuid = require("uuid");

const WEBSOCKET_MAGIC_STRING = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";

function newQuestionsProxy(httpServer) {
  const wss = new WebSocketServer({ noServer: true });
  let connections = new Map();

  // Handle HTTP upgrade
  httpServer.on("upgrade", (req, socket, head) => {
    // Verify handshake first
    if (!verifyHandshake(req)) {
      socket.write("HTTP/1.1 400 Bad Request\r\n\r\n");
      socket.destroy();
      return;
    }
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req);
    });

    // Create accept hash
    const acceptKey = crypto
      .createHash("sha1")
      .update(key + WEBSOCKET_MAGIC_STRING)
      .digest("base64");

    // Write WebSocket handshake response
    const responseHeaders =
      [
        "HTTP/1.1 101 Switching Protocols",
        "Upgrade: websocket",
        "Connection: Upgrade",
        `Sec-WebSocket-Accept: ${acceptKey}`,
      ].join("\r\n") + "\r\n\r\n";

    socket.write(responseHeaders);
    wss.emit("connection", req.socket, req);
  });

  // WebSocket connection handling
  wss.on("connection", (ws, req) => {
    const connectionId = uuid.v4();
    const connection = {
      id: connectionId,
      alive: true,
      ws: ws,
      ip: req.socket.remoteAddress,
    };

    connections.set(connectionId, connection);

    // Message handling
    ws.on("message", (data) => {
      connections.forEach((conn) => {
        if (conn.id !== connectionId && conn.ws.readyState === 1) {
          conn.ws.send(data);
        }
      });
    });

    // Ping/pong for connection health
    const pingInterval = setInterval(() => {
      if (connection.alive === false) {
        ws.terminate();
        clearInterval(pingInterval);
        return;
      }

      connection.alive = false;
      ws.ping();
    }, 30000);

    // Cleanup on close
    ws.on("close", () => {
      clearInterval(pingInterval);
      connections.delete(connectionId);
    });

    ws.on("pong", () => {
      connection.alive = true;
    });
  });

  // Broadcast to all clients
  const broadcast = (data) => {
    connections.forEach((conn) => {
      if (conn.ws.readyState === 1) {
        conn.ws.send(JSON.stringify(data));
      }
    });
  };

  // Verify WebSocket handshake requirements
  const verifyHandshake = (req) => {
    return (
      req.method === "GET" &&
      req.headers.upgrade === "websocket" &&
      req.headers.connection.toLowerCase().includes("upgrade") &&
      req.headers["sec-websocket-version"] === "13"
    );
  };

  return {
    broadcast,
    getConnectionCount: () => connections.size,
  };
}

module.exports = { newQuestionsProxy };

/**
 * ATOM Framework - WebSocket Support
 * 
 * Provides WebSocket server integration for real-time features
 */

const WebSocket = require('ws');

class WebSocketServer {
  constructor(server, options = {}) {
    this.wss = new WebSocket.Server({ 
      server,
      path: options.path || '/_atom/ws',
      ...options
    });
    this.clients = new Map();
    this.rooms = new Map();
    
    this.setup();
  }
  
  setup() {
    this.wss.on('connection', (ws, req) => {
      const clientId = this.generateClientId();
      this.clients.set(clientId, {
        ws,
        id: clientId,
        connectedAt: Date.now(),
        rooms: new Set()
      });
      
      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          this.handleMessage(clientId, data);
        } catch (error) {
          this.sendError(ws, 'Invalid message format');
        }
      });
      
      ws.on('close', () => {
        this.handleDisconnect(clientId);
      });
      
      ws.on('error', (error) => {
        console.error(`[WebSocket] Client ${clientId} error:`, error);
      });
      
      // Send welcome message
      this.send(ws, { type: 'connected', clientId });
    });
  }
  
  generateClientId() {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  handleMessage(clientId, data) {
    const client = this.clients.get(clientId);
    if (!client) return;
    
    switch (data.type) {
      case 'join':
        this.joinRoom(clientId, data.room);
        break;
      case 'leave':
        this.leaveRoom(clientId, data.room);
        break;
      case 'broadcast':
        this.broadcastToRoom(data.room, data.message);
        break;
      case 'ping':
        this.send(client.ws, { type: 'pong' });
        break;
      default:
        this.sendError(client.ws, `Unknown message type: ${data.type}`);
    }
  }
  
  joinRoom(clientId, roomName) {
    const client = this.clients.get(clientId);
    if (!client) return;
    
    if (!this.rooms.has(roomName)) {
      this.rooms.set(roomName, new Set());
    }
    
    this.rooms.get(roomName).add(clientId);
    client.rooms.add(roomName);
    
    this.send(client.ws, { type: 'joined', room: roomName });
  }
  
  leaveRoom(clientId, roomName) {
    const client = this.clients.get(clientId);
    if (!client) return;
    
    const room = this.rooms.get(roomName);
    if (room) {
      room.delete(clientId);
      if (room.size === 0) {
        this.rooms.delete(roomName);
      }
    }
    
    client.rooms.delete(roomName);
    this.send(client.ws, { type: 'left', room: roomName });
  }
  
  broadcastToRoom(roomName, message) {
    const room = this.rooms.get(roomName);
    if (!room) return;
    
    room.forEach(clientId => {
      const client = this.clients.get(clientId);
      if (client && client.ws.readyState === WebSocket.OPEN) {
        this.send(client.ws, {
          type: 'message',
          room: roomName,
          message
        });
      }
    });
  }
  
  broadcast(message) {
    this.clients.forEach((client) => {
      if (client.ws.readyState === WebSocket.OPEN) {
        this.send(client.ws, message);
      }
    });
  }
  
  send(ws, data) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }
  
  sendError(ws, error) {
    this.send(ws, { type: 'error', error });
  }
  
  handleDisconnect(clientId) {
    const client = this.clients.get(clientId);
    if (!client) return;
    
    // Leave all rooms
    client.rooms.forEach(roomName => {
      this.leaveRoom(clientId, roomName);
    });
    
    this.clients.delete(clientId);
  }
  
  getStats() {
    return {
      clients: this.clients.size,
      rooms: this.rooms.size,
      roomDetails: Array.from(this.rooms.entries()).map(([name, clients]) => ({
        name,
        clients: clients.size
      }))
    };
  }
}

module.exports = WebSocketServer;

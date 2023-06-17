import { io, Socket } from 'socket.io-client';

class WebSocketClient {
  private socket: Socket;
  private url = 'ws://localhost:5223';

  constructor() {
    this.socket = io(this.url);
  }

  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket.on('connect', () => {
        console.log('Socket.IO connected.');
        resolve();
      });

      this.socket.on('connect_error', (error: any) => {
        console.error('Socket.IO connection error:', error);
        reject(error);
      });
    });
  }

  public send(event: string, data: any): void {
    this.socket.emit(event, data);
  }

  public on(event: string, callback: () => void): void {
    this.socket.on(event, callback);
  }

  public off(event: string): void {
    this.socket.off(event);
  }

  public disconnect(): void {
    this.socket.disconnect();
  }
}

export default WebSocketClient;

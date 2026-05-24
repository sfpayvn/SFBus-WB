import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { ENV } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket | null = null;
  private enabled: boolean;

  constructor() {
    this.enabled = (ENV as any).WEBSOCKET_ENABLE !== false;

    if (this.enabled && (ENV as any).WEBSOCKET_URL) {
      this.socket = io((ENV as any).WEBSOCKET_URL);
      this.socket.on('connect', () => {
        console.log('SocketService: connected, id=', this.socket?.id);
      });
      this.socket.on('disconnect', () => {
        console.log('SocketService: disconnected');
      });
    } else {
      console.log('SocketService: disabled by environment config');
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  on(event: string, cb: (...args: any[]) => void): void {
    if (!this.enabled || !this.socket) return;
    this.socket.on(event, cb);
  }

  off(event: string, cb?: (...args: any[]) => void): void {
    if (!this.socket) return;
    if (cb) this.socket.off(event, cb);
    else this.socket.off(event);
  }

  emit(event: string, ...args: any[]): void {
    if (!this.enabled || !this.socket) return;
    this.socket.emit(event, ...args);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  connect(): void {
    if (!this.enabled) return;
    if (!this.socket && (ENV as any).WEBSOCKET_URL) {
      this.socket = io((ENV as any).WEBSOCKET_URL);
    }
  }
}

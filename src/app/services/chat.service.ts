import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ChatMessage {
  senderId: string;
  senderName: string;
  message: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;

  constructor() {
    this.socket = io(environment.socketUrl);
  }

  joinRoom(roomId: string, expertId?: string): void {
    this.socket.emit('join_room', { roomId, expertId });
  }

  sendMessage(roomId: string, message: string, senderId: string, senderName: string): void {
    this.socket.emit('send_message', { roomId, message, senderId, senderName });
  }

  setExpertStatus(expertId: string, status: string): void {
    this.socket.emit('set_expert_status', { expertId, status });
  }

  onReceiveMessage(): Observable<ChatMessage> {
    return new Observable((observer) => {
      this.socket.on('receive_message', (data: ChatMessage) => {
        observer.next(data);
      });
    });
  }

  onStatusUpdate(): Observable<{ expertId: string, status: string }> {
    return new Observable((observer) => {
      this.socket.on('status_update', (data) => {
        observer.next(data);
      });
    });
  }

  onTimerUpdate(): Observable<{ remainingSeconds: number }> {
    return new Observable((observer) => {
      this.socket.on('timer_update', (data) => {
        observer.next(data);
      });
    });
  }

  onTimerEnded(): Observable<{ message: string }> {
    return new Observable((observer) => {
      this.socket.on('timer_ended', (data) => {
        observer.next(data);
      });
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

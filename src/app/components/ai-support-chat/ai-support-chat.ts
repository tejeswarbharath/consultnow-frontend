import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
}

@Component({
  selector: 'app-ai-support-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-support-chat.html',
  styleUrl: './ai-support-chat.scss'
})
export class AiSupportChat {
  isOpen = false;
  messages: ChatMessage[] = [
    { text: "Hi! I'm your AI assistant. Briefly describe your problem, and I'll recommend the right expert category for you.", sender: 'bot' }
  ];
  userInput = '';
  isLoading = false;

  constructor(private http: HttpClient) {}

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  sendMessage() {
    if (!this.userInput.trim()) return;

    const userMessage = this.userInput.trim();
    this.messages.push({ text: userMessage, sender: 'user' });
    this.userInput = '';
    this.isLoading = true;

    this.http.post<{recommendation: string}>(`${environment.apiUrl}/ai/triage`, {
      problemDescription: userMessage
    }).subscribe({
      next: (res) => {
        this.messages.push({ text: res.recommendation, sender: 'bot' });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('AI Triage Error', err);
        this.messages.push({ text: 'Sorry, I am having trouble connecting to my brain right now.', sender: 'bot' });
        this.isLoading = false;
      }
    });
  }
}

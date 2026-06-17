import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ai-support-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-support-chat.component.html'
})
export class AiSupportChatComponent {
  isOpen = false;
  problemDescription = '';
  chatHistory: { sender: 'user' | 'ai'; text: string }[] = [
    { sender: 'ai', text: 'Hello! Please describe your problem, and I will recommend the right expert category for you.' }
  ];
  isLoading = false;

  constructor(private http: HttpClient) {}

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  sendMessage() {
    if (!this.problemDescription.trim()) return;
    this.chatHistory.push({ sender: 'user', text: this.problemDescription });
    const payload = { problemDescription: this.problemDescription };
    this.problemDescription = '';
    this.isLoading = true;

    this.http.post<{recommendedCategory: string}>('http://localhost:3000/api/ai/triage', payload)
      .subscribe({
        next: (response) => {
          this.chatHistory.push({ sender: 'ai', text: `Based on your description, I recommend searching for an expert in: **${response.recommendedCategory}**.` });
          this.isLoading = false;
        },
        error: () => {
          this.chatHistory.push({ sender: 'ai', text: 'Sorry, I am having trouble connecting to the support server right now.' });
          this.isLoading = false;
        }
      });
  }
}
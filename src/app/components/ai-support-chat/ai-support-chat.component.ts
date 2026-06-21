import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../services/ai.service'; // FIX: Import AiService

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

  // FIX: Inject AiService instead of HttpClient
  constructor(private aiService: AiService) {}

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  sendMessage() {
    if (!this.problemDescription.trim()) return;
    
    this.chatHistory.push({ sender: 'user', text: this.problemDescription });
    const currentProblem = this.problemDescription;
    this.problemDescription = '';
    this.isLoading = true;

    // FIX: Call the service method instead of a hardcoded http://localhost URL
    this.aiService.triageProblem(currentProblem)
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
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../services/ai.service';
import { ExpertService } from '../../services/expert.service';

@Component({
  selector: 'app-ai-support-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-support-chat.component.html'
})
export class AiSupportChatComponent {
  isOpen = false;
  problemDescription = '';
  chatHistory: { sender: 'user' | 'ai'; text: string; options?: string[] }[] = [
    { 
      sender: 'ai', 
      text: 'Hello! Welcome to ConsultNow. I am your Conversational Concierge. How can we help you today? Are you looking for help with:',
      options: ['Career / IT Transition', 'Business / Workplace HR', 'School / Studies / Tutoring']
    }
  ];
  isLoading = false;

  constructor(private aiService: AiService, private expertService: ExpertService) {}

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  selectOption(option: string) {
    // Add user's choice to chat history
    this.chatHistory.push({ sender: 'user', text: option });
    
    // Map human-readable option to actual category string
    let mappedCategory = '';
    switch (option) {
      case 'Career / IT Transition':
        mappedCategory = 'IT Career Guidance';
        break;
      case 'Business / Workplace HR':
        mappedCategory = 'HR Services';
        break;
      case 'School / Studies / Tutoring':
        mappedCategory = 'Student Tutoring Services';
        break;
      default:
        mappedCategory = '';
    }

    if (mappedCategory) {
      // Set the filter on discovery page
      this.expertService.setCategoryFilter(mappedCategory);
      this.chatHistory.push({ 
        sender: 'ai', 
        text: `Great choice! I have updated the dashboard to filter and expand the available experts for: **${mappedCategory}**.` 
      });
    } else {
      this.chatHistory.push({ 
        sender: 'ai', 
        text: 'I could not map that choice to a category. Feel free to describe your problem in detail below!' 
      });
    }
  }

  sendMessage() {
    if (!this.problemDescription.trim()) return;
    
    this.chatHistory.push({ sender: 'user', text: this.problemDescription });
    const currentProblem = this.problemDescription;
    this.problemDescription = '';
    this.isLoading = true;

    this.aiService.triageProblem(currentProblem)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.isEmergency) {
            this.chatHistory.push({ 
              sender: 'ai', 
              text: `🚨 **HIGH RISK / EMERGENCY WARNING:** ${response.disclaimer || 'This matches an emergency profile. Please seek immediate professional assistance.'}` 
            });
            // Also filter to the category on the main page to show disclaimers/emergency warning
            this.expertService.setCategoryFilter(response.recommendedCategory);
          } else {
            this.chatHistory.push({ 
              sender: 'ai', 
              text: `Based on your description, I recommend searching for an expert in: **${response.recommendedCategory}**.` 
            });
            if (response.reason) {
              this.chatHistory.push({ 
                sender: 'ai', 
                text: response.reason 
              });
            }
            // Trigger category filter on the discovery page
            this.expertService.setCategoryFilter(response.recommendedCategory);
          }
        },
        error: () => {
          this.chatHistory.push({ sender: 'ai', text: 'Sorry, I am having trouble connecting to the support server right now.' });
          this.isLoading = false;
        }
      });
  }
}
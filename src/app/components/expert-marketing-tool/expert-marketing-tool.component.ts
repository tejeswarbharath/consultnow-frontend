import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-expert-marketing-tool',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expert-marketing-tool.component.html'
})
export class ExpertMarketingToolComponent {
  rawSkills = '';
  generatedBio = '';
  generatedSnippet = '';
  isLoading = false;
  error = '';

  constructor(private http: HttpClient) {}

  generateMarketing() {
    if (!this.rawSkills.trim()) return;
    this.isLoading = true;
    this.error = '';
    this.generatedBio = '';
    this.generatedSnippet = '';

    const payload = { skills: this.rawSkills };

    this.http.post<{bio: string, snippet: string}>('http://localhost:3000/api/ai/generate-marketing', payload)
      .subscribe({
        next: (response) => {
          this.generatedBio = response.bio;
          this.generatedSnippet = response.snippet;
          this.isLoading = false;
        },
        error: () => {
          this.error = 'Failed to generate marketing material. Please try again.';
          this.isLoading = false;
        }
      });
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  }
}
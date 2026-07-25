import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-widget-builder',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="widget-builder-container">
      <header class="header">
        <span class="badge">VIRAL MARKETING LOOP</span>
        <h2>Embeddable Booking Widget</h2>
        <p>Embed your interactive booking widget on your website, blog, Linktree, or GitHub README.</p>
      </header>

      <div class="builder-grid">
        <!-- Control Panel -->
        <div class="card control-panel">
          <h3>Widget Settings</h3>

          <div class="form-group">
            <label>Widget Theme</label>
            <div class="theme-picker">
              <button [class.active]="theme === 'dark'" (click)="theme = 'dark'">Dark Slate</button>
              <button [class.active]="theme === 'light'" (click)="theme = 'light'">Clean Light</button>
              <button [class.active]="theme === 'gradient'" (click)="theme = 'gradient'">Neon Gradient</button>
            </div>
          </div>

          <div class="form-group">
            <label>Widget Style</label>
            <div class="style-picker">
              <button [class.active]="style === 'card'" (click)="style = 'card'">Profile Card</button>
              <button [class.active]="style === 'badge'" (click)="style = 'badge'">Compact Badge</button>
            </div>
          </div>

          <div class="form-group">
            <label>Generated iFrame Embed Code</label>
            <textarea readonly rows="4" class="code-area">{{ getEmbedCode() }}</textarea>
            <button class="btn btn-primary" (click)="copyCode()">
              {{ copied ? 'Snippet Copied!' : 'Copy iFrame HTML Code' }}
            </button>
          </div>
        </div>

        <!-- Live Preview Panel -->
        <div class="card preview-panel">
          <h3>Live Interactive Preview</h3>
          <p class="preview-sub">This is exactly how your widget appears on third-party sites:</p>

          <div class="preview-stage" [class.stage-light]="theme === 'light'">
            <iframe 
              [src]="getPreviewUrl()" 
              width="380" 
              height="260" 
              frameborder="0" 
              scrolling="no"
              class="preview-iframe">
            </iframe>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .widget-builder-container {
      max-width: 1150px;
      margin: 0 auto;
      padding: 2rem;
      color: #f3f4f6;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      font-size: 0.75rem;
      font-weight: 700;
      border-radius: 9999px;
      background: linear-gradient(135deg, #10b981, #3b82f6);
      color: white;
      margin-bottom: 0.5rem;
    }
    .builder-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-top: 1.5rem;
    }
    @media (max-width: 850px) {
      .builder-grid { grid-template-columns: 1fr; }
    }
    .card {
      background: rgba(30, 41, 59, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 1.75rem;
      backdrop-filter: blur(10px);
    }
    .form-group {
      margin-top: 1.25rem;
    }
    label {
      display: block;
      font-size: 0.875rem;
      color: #9ca3af;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }
    .theme-picker, .style-picker {
      display: flex;
      gap: 0.5rem;
    }
    .theme-picker button, .style-picker button {
      flex: 1;
      padding: 0.6rem 0.8rem;
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 8px;
      color: #cbd5e1;
      cursor: pointer;
      font-size: 0.85rem;
      font-weight: 600;
      transition: all 0.2s;
    }
    .theme-picker button.active, .style-picker button.active {
      background: #6366f1;
      color: white;
      border-color: #818cf8;
    }
    .code-area {
      width: 100%;
      background: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 8px;
      color: #34d399;
      font-family: monospace;
      font-size: 0.8rem;
      padding: 0.75rem;
      resize: none;
      box-sizing: border-box;
      margin-bottom: 0.75rem;
    }
    .btn-primary {
      width: 100%;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      border: none;
      padding: 0.75rem;
      font-weight: 700;
      border-radius: 8px;
      cursor: pointer;
    }
    .preview-stage {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: #0f172a;
      border-radius: 12px;
      margin-top: 1rem;
      min-height: 280px;
    }
    .preview-stage.stage-light {
      background: #f1f5f9;
    }
    .preview-iframe {
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    }
  `]
})
export class WidgetBuilderComponent implements OnInit {
  expertId = '';
  theme = 'dark';
  style = 'card';
  copied = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.expertId = user?.expertId || user?.id || 'demo-expert';
  }

  getEmbedCode(): string {
    const baseUrl = window.location.origin;
    return `<iframe src="${baseUrl}/widget/expert/${this.expertId}?theme=${this.theme}&style=${this.style}" width="380" height="260" frameborder="0" scrolling="no" style="border-radius:12px; overflow:hidden;"></iframe>`;
  }

  getPreviewUrl(): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}/widget/expert/${this.expertId}?theme=${this.theme}&style=${this.style}`;
  }

  copyCode(): void {
    navigator.clipboard.writeText(this.getEmbedCode());
    this.copied = true;
    setTimeout(() => this.copied = false, 2000);
  }
}

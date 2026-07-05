import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService, ChatMessage } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { ExpertService } from '../../services/expert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  expertId: string = '';
  expertName: string = 'Expert';
  expertStatus: string = 'offline';
  remainingSeconds: number | null = null;
  
  messages: ChatMessage[] = [];
  newMessage: string = '';
  
  roomId: string = '';
  currentUserId: string = '';
  currentUserName: string = '';

  private subscriptions: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatService: ChatService,
    private authService: AuthService,
    private expertService: ExpertService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const user = this.authService.getCurrentUser();
      if (!user) {
        this.router.navigate(['/login']);
        return;
      }
      
      this.currentUserId = user.id;
      this.currentUserName = user.name;

      this.route.paramMap.subscribe(params => {
        this.expertId = params.get('expertId') || '';
        if (this.expertId) {
          // Fetch expert details to get the name
          this.expertService.getExpertById(this.expertId).subscribe(expert => {
            if (expert) {
              this.expertName = expert.name;
            }
          });

          // Generating a unique room ID for the user and expert
          // For simplicity, sort IDs to have a consistent room name regardless of who starts
          const ids = [this.currentUserId, this.expertId].sort();
          this.roomId = `room_${ids[0]}_${ids[1]}`;
          
          this.chatService.joinRoom(this.roomId, this.expertId);
        }
      });

      this.subscriptions.add(
        this.chatService.onReceiveMessage().subscribe(msg => {
          this.messages.push(msg);
        })
      );

      this.subscriptions.add(
        this.chatService.onStatusUpdate().subscribe(data => {
          if (data.expertId === this.expertId) {
            this.expertStatus = data.status;
          }
        })
      );

      this.subscriptions.add(
        this.chatService.onTimerUpdate().subscribe(data => {
          this.remainingSeconds = data.remainingSeconds;
        })
      );

      this.subscriptions.add(
        this.chatService.onTimerEnded().subscribe(data => {
          this.remainingSeconds = 0;
          alert(data.message);
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.chatService.disconnect();
  }

  sendMessage(): void {
    if (this.newMessage.trim() && this.roomId) {
      this.chatService.sendMessage(this.roomId, this.newMessage, this.currentUserId, this.currentUserName);
      this.newMessage = '';
    }
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
}

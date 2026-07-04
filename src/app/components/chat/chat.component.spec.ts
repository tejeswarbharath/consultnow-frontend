import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { ChatComponent } from './chat.component';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { ExpertService } from '../../services/expert.service';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;

  // Mock AuthService
  const mockAuthService = {
    getCurrentUser: () => ({ id: 'test-user-id', name: 'Test User', role: 'user' }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatComponent, RouterTestingModule, HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: (key: string) => 'test-expert-id' }),
          },
        },
        { provide: AuthService, useValue: mockAuthService },
        ChatService,
        ExpertService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

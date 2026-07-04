import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AiSupportChatComponent } from './ai-support-chat.component';
import { AiService } from '../../services/ai.service';

describe('AiSupportChatComponent', () => {
  let component: AiSupportChatComponent;
  let fixture: ComponentFixture<AiSupportChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiSupportChatComponent, HttpClientTestingModule],
      providers: [AiService],
    }).compileComponents();

    fixture = TestBed.createComponent(AiSupportChatComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

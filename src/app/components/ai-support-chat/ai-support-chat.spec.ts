import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiSupportChatComponent } from './ai-support-chat.component';

describe('AiSupportChatComponent', () => {
  let component: AiSupportChatComponent;
  let fixture: ComponentFixture<AiSupportChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AiSupportChatComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AiSupportChatComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiSupportChat } from './ai-support-chat';

describe('AiSupportChat', () => {
  let component: AiSupportChat;
  let fixture: ComponentFixture<AiSupportChat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiSupportChat],
    }).compileComponents();

    fixture = TestBed.createComponent(AiSupportChat);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
